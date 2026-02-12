<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\Product; // Assuming products are needed, wait, product_id connects to products.
use App\Services\TaigaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoryController extends Controller
{
    protected $taigaService;

    public function __construct(TaigaService $taigaService)
    {
        $this->taigaService = $taigaService;
    }

    public function index()
    {
        $stories = Story::with('product')->latest()->get();
        return Inertia::render('Stories/Index', [
            'stories' => $stories
        ]);
    }

    public function create()
    {
        $products = Product::all();
        return Inertia::render('Stories/Import', [
            'products' => $products
        ]);
    }

    public function fetchStories(Request $request)
    {
        $request->validate(['project_id' => 'required']);
        
        $page = $request->input('page', 1);
        $pageSize = $request->input('page_size', 10);

        $result = $this->taigaService->getStories($request->project_id, $page, $pageSize);
        
        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return response()->json([
            'data' => $result['data'],
            'meta' => $result['meta']
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'stories' => 'required|array',
            'product_id' => 'required|exists:products,id',
        ]);

        foreach ($request->stories as $storyData) {
            Story::updateOrCreate(
                ['taiga_id' => $storyData['id']],
                [
                    'product_id' => $request->product_id,
                    'subject' => $storyData['subject'],
                    'description' => $storyData['description'],
                    'taiga_created_at' => $storyData['created_date'],
                    'creator_name' => $storyData['owner_extra_info']['full_name_display'] ?? 'Unknown',
                    'creator_email' => null, // Taiga API might not expose email directly in public userstories endpoint without extra permissions/calls
                    'assigned_to' => $storyData['assigned_to_extra_info'] ?? null,
                ]
            );
        }

        return redirect()->route('stories.index')->with('success', 'Stories imported successfully.');
    }

    public function edit(Story $story)
    {
        return Inertia::render('Stories/Edit', [
            'story' => $story
        ]);
    }

    public function update(Request $request, Story $story)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $story->update($validated);

        return redirect()->route('stories.index')->with('success', 'Story updated successfully.');
    }

    public function destroy(Story $story)
    {
        $story->delete();
        return redirect()->route('stories.index')->with('success', 'Story deleted successfully.');
    }
}
