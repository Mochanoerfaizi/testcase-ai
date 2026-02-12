<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TaigaService
{
    protected $baseUrl;
    protected $username;
    protected $password;
    protected $authToken;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('app.taiga.url'), '/');
        $this->username = config('app.taiga.username');
        $this->password = config('app.taiga.password');
    }

    /**
     * Get authentication token from Taiga API
     */
    protected function getAuthToken()
    {
        if ($this->authToken) {
            return $this->authToken;
        }

        // Cache token for 1 hour
        $this->authToken = Cache::remember('taiga_auth_token', 3600, function () {
            try {
                $response = Http::post("{$this->baseUrl}/api/v1/auth", [
                    'type' => 'normal',
                    'username' => $this->username,
                    'password' => $this->password,
                ]);

                if ($response->successful()) {
                    return $response->json('auth_token');
                }

                Log::error('Taiga authentication failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return null;
            } catch (\Exception $e) {
                Log::error('Taiga authentication error', [
                    'message' => $e->getMessage(),
                ]);
                return null;
            }
        });

        return $this->authToken;
    }

    /**
     * Get all projects from Taiga
     */
    public function getProjects()
    {
        $token = $this->getAuthToken();

        if (!$token) {
            return [
                'success' => false,
                'message' => 'Failed to authenticate with Taiga',
                'data' => [],
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Content-Type' => 'application/json',
            ])->get("{$this->baseUrl}/api/v1/projects");

            if ($response->successful()) {
                $projects = collect($response->json())->map(function ($project) {
                    return [
                        'id' => $project['id'],
                        'name' => $project['name'],
                        'slug' => $project['slug'] ?? null,
                        'description' => $project['description'] ?? null,
                    ];
                });

                return [
                    'success' => true,
                    'data' => $projects,
                ];
            }

            Log::error('Failed to fetch Taiga projects', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch projects from Taiga',
                'data' => [],
            ];
        } catch (\Exception $e) {
            Log::error('Taiga API error', [
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [],
            ];
        }
    }

    /**
     * Get a specific project by ID
     */
    public function getProject($projectId)
    {
        $token = $this->getAuthToken();

        if (!$token) {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
            ])->get("{$this->baseUrl}/api/v1/projects/{$projectId}");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Taiga get project error', [
                'project_id' => $projectId,
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }
    /**
     * Get stories for a specific project
     */
    public function getStories($projectId, $page = 1, $pageSize = 10)
    {
        $token = $this->getAuthToken();

        if (!$token) {
            return [
                'success' => false,
                'message' => 'Failed to authenticate with Taiga',
                'data' => [],
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Content-Type' => 'application/json',
                // 'x-disable-pagination' => 'True', // Enable pagination
            ])->get("{$this->baseUrl}/api/v1/userstories", [
                'project' => $projectId,
                'page' => $page,
                'page_size' => $pageSize,
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                    'meta' => [
                        'total' => (int) $response->header('x-pagination-count'),
                        'current_page' => (int) $page,
                        'per_page' => (int) $pageSize,
                        'total_pages' => ceil((int) $response->header('x-pagination-count') / $pageSize),
                    ]
                ];
            }

            Log::error('Failed to fetch Taiga stories', [
                'project_id' => $projectId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to fetch stories from Taiga',
                'data' => [],
            ];
        } catch (\Exception $e) {
            Log::error('Taiga API error (getStories)', [
                'project_id' => $projectId,
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [],
            ];
        }
    }
}
