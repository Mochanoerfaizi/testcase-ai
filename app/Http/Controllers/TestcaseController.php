<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\Testcase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TestcaseController extends Controller
{
    public function generate(Request $request, Story $story)
    {
        $url = config('services.openai_custom.url');
        $key = config('services.openai_custom.key');

        if (!$url || !$key) {
            return redirect()->back()->with('error', 'Lengkapi konfigurasi OpenAI Custom di .env (OPENAI_CUSTOM_URL dan OPENAI_CUSTOM_KEY)');
        }

        // Helper to ensure URL hits correct endpoint if user only provided base domain
        if (strpos($url, '/chat/completions') === false && strpos($url, '/completions') === false) {
            $url = rtrim($url, '/') . '/v1/chat/completions';
        }

        $prompt = "Buatkan testcase QA dalam bahasa indonesia berdasarkan deskripsi user story berikut. Hasilkan tepat dua testcase: satu positif (Positive Case) dan satu negatif (Negative Case). Hanya kembalikan output murni dalam format array JSON tanpa markdown block (jangan pakai ```json). Setiap item dalam array adalah sebuah objek yang memiliki field: 'tc_id' (contoh: 'TC0001'), 'title' (judul singkat), 'summary' (ringkasan), 'severity' (Low/Medium/High/Critical), 'prerequisites' (prasyarat), 'test_procedure' (langkah-langkah terurut bernomor), 'expected_result' (hasil yang diharapkan), dan 'case_type' (isi dengan 'Positive' atau 'Negative'). \n\nDeskripsi Story:\n" . strip_tags($story->description);

        try {
            // Set up a slightly longer timeout just in case the AI takes time
            $response = Http::timeout(60)->withoutVerifying()->withHeaders([
                'Authorization' => 'Bearer ' . $key,
                'Content-Type' => 'application/json'
            ])->post($url, [
                'model' => config('services.openai_custom.model', 'gpt-3.5-turbo'),
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an expert QA Engineer API. You return strictly raw JSON arrays only without any formatting.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                $content = $responseData['choices'][0]['message']['content'] ?? '[]';
                
                // Clean the content
                $content = trim($content);
                // Remove possible markdown formatting if AI still outputs it
                $content = preg_replace('/^```json\s*/i', '', $content);
                $content = preg_replace('/\s*```$/', '', $content);

                $testcasesData = json_decode($content, true);

                if (json_last_error() !== JSON_ERROR_NONE || !is_array($testcasesData)) {
                    Log::error('AI Response output parsing failed: ' . $content);
                    return redirect()->back()->with('error', 'Gagal mem-parsing format output dari AI. Silakan coba lagi.');
                }

                $createdCount = 0;
                foreach ($testcasesData as $tcData) {
                    
                    // Helper to prevent Array to string conversion error from AI payload
                    $toString = function($val) {
                        if (is_array($val)) return implode("\n", $val);
                        return is_string($val) ? $val : null;
                    };

                    $story->testcases()->create([
                        'tc_id' => $tcData['tc_id'] ?? null,
                        'title' => $tcData['title'] ?? 'Untitled',
                        'summary' => $toString($tcData['summary'] ?? null),
                        'severity' => $tcData['severity'] ?? null,
                        'prerequisites' => $toString($tcData['prerequisites'] ?? null),
                        'test_procedure' => $toString($tcData['test_procedure'] ?? null),
                        'expected_result' => $toString($tcData['expected_result'] ?? null),
                        'case_type' => $tcData['case_type'] ?? null,
                    ]);
                    $createdCount++;
                }

                return redirect()->back()->with('success', "Berhasil men-generate {$createdCount} testcase baru menggunakan AI.");
            }

            Log::error('OpenAI Error: ' . $response->body());
            return redirect()->back()->with('error', "Gagal menghubungi AI endpoint. Status: " . $response->status());

        } catch (\Exception $e) {
            Log::error('Exception in UI generation: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan sistem internal: ' . $e->getMessage());
        }
    }

    public function export(Story $story)
    {
        $testcases = $story->testcases;

        if ($testcases->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada testcase untuk di-export.');
        }

        $fileName = "Testcases_Story_{$story->taiga_id}.csv";
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Name', 'Status', 'Description', 'Script'];

        $callback = function() use($testcases, $columns) {
            $file = fopen('php://output', 'w');
            
            // Add UTF-8 BOM so Excel opens it with proper encoding
            fputs($file, $bom =(chr(0xEF) . chr(0xBB) . chr(0xBF)));
            
            fputcsv($file, $columns);

            foreach ($testcases as $tc) {
                $row = [
                    $tc->id,
                    $tc->name,
                    $tc->status,
                    $tc->description,
                    $tc->script
                ];
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
