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

        $storyDescription = strip_tags($story->description);

        $prompt = <<<PROMPT
## TASK
Buatkan test case QA profesional dalam Bahasa Indonesia berdasarkan user story yang diberikan.

## KONTEKS
User story yang akan diuji adalah sebagai berikut:
"{$storyDescription}"

Test case ini akan digunakan oleh tim QA untuk memvalidasi fungsionalitas fitur yang dijelaskan dalam user story di atas.

## BATASAN
- Gunakan Bahasa Indonesia untuk semua nilai teks
- Setiap test case harus relevan dan spesifik terhadap user story
- Langkah-langkah test_procedure harus jelas, terurut, dan dapat diikuti
- Nilai severity harus salah satu dari: Low, Medium, High, atau Critical
- Nilai case_type harus: "Positive" atau "Negative"
- JANGAN sertakan markdown, komentar, atau teks penjelasan di luar array JSON

## FORMAT
Kembalikan HANYA array JSON murni (tanpa ```json atau tanda apapun) dengan struktur berikut:
[
  {
    "tc_id": "TC0001",
    "title": "Judul singkat test case",
    "summary": "Ringkasan singkat tujuan test case ini",
    "severity": "High",
    "prerequisites": "Prasyarat yang harus dipenuhi sebelum menjalankan test",
    "test_procedure": "1. Langkah pertama\n2. Langkah kedua\n3. Langkah ketiga",
    "expected_result": "Hasil yang diharapkan setelah test dijalankan",
    "case_type": "Positive"
  },
  {
    "tc_id": "TC0002",
    "title": "Judul singkat test case",
    "summary": "Ringkasan singkat tujuan test case ini",
    "severity": "Medium",
    "prerequisites": "Prasyarat yang harus dipenuhi sebelum menjalankan test",
    "test_procedure": "1. Langkah pertama\n2. Langkah kedua\n3. Langkah ketiga",
    "expected_result": "Hasil yang diharapkan setelah test dijalankan",
    "case_type": "Negative"
  }
]
PROMPT;

        try {
            // Set up a slightly longer timeout just in case the AI takes time
            $response = Http::timeout(60)->withoutVerifying()->withHeaders([
                'Authorization' => 'Bearer ' . $key,
                'Content-Type' => 'application/json'
            ])->post($url, [
                'model' => config('services.openai_custom.model', 'gpt-3.5-turbo'),
                'messages' => [
                    ['role' => 'system', 'content' => 'Kamu adalah QA Engineer profesional yang berpengalaman dalam membuat test case berkualitas tinggi. Tugasmu adalah menghasilkan test case berdasarkan user story yang diberikan. Kamu HANYA boleh mengembalikan output berupa array JSON mentah (raw JSON array) tanpa markdown, tanpa penjelasan tambahan, tanpa prefix apapun. Jika ada kesalahan atau informasi kurang, tetap kembalikan array JSON kosong [].'],
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
