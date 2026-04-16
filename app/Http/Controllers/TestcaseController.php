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

        $prompt = "Buatkan testcase QA berdasarkan deskripsi user story berikut. Hasilkan tepat dua testcase: satu positif (Positive Case) dan satu negatif (Negative Case). Hanya kembalikan output murni dalam format array JSON tanpa markdown block (jangan pakai ```json). Setiap item dalam array adalah sebuah objek yang memiliki field 'name' (nama testcase), 'status' (isi dengan 'Draft'), 'description' (deskripsi langkah), dan 'script' (opsional, kode skenario seperti Gherkin atau instruksi kode, null jika tidak ada). \n\nDeskripsi Story:\n" . strip_tags($story->description);

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
                foreach ($testcasesData as $tc) {
                    if (!empty($tc['name'])) {
                        Testcase::create([
                            'story_id' => $story->id,
                            'name' => $tc['name'],
                            'status' => $tc['status'] ?? 'Draft',
                            'description' => $tc['description'] ?? null,
                            'script' => $tc['script'] ?? null,
                        ]);
                        $createdCount++;
                    }
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
}
