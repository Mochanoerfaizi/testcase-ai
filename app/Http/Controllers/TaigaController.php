<?php

namespace App\Http\Controllers;

use App\Services\TaigaService;
use Illuminate\Http\Request;

class TaigaController extends Controller
{
    protected $taigaService;

    public function __construct(TaigaService $taigaService)
    {
        $this->taigaService = $taigaService;
    }

    /**
     * Get all Taiga projects
     */
    public function getProjects()
    {
        $result = $this->taigaService->getProjects();

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message'] ?? 'Failed to fetch Taiga projects',
                'data' => [],
            ], 500);
        }

        return response()->json([
            'data' => $result['data'],
        ]);
    }
}
