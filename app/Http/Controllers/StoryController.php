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

    public function index(Request $request)
    {
        $query = Story::with(['product', 'additionals'])->latest();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('taiga_id', 'like', "%{$search}%"); // taiga_id might be integer, but like works if casted or string
            });
        }

        $stories = $query->get();

        return Inertia::render('Stories/Index', [
            'stories' => $stories,
            'filters' => $request->only(['search']),
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
        $milestoneId = $request->input('milestone_id'); // Optional milestone filter

        $result = $this->taigaService->getStories($request->project_id, $page, $pageSize, $milestoneId);
        
        if (!$result['success']) {
            return response()->json(['message' => $result['message']], 500); // Changed to JSON response for axios
        }

        return response()->json([
            'data' => $result['data'],
            'meta' => $result['meta']
        ]);
    }

    public function fetchMilestones(Request $request)
    {
        $request->validate(['project_id' => 'required']);

        $result = $this->taigaService->getMilestones($request->project_id);

        if (!$result['success']) {
            return response()->json(['message' => $result['message']], 500);
        }

        return response()->json([
            'data' => $result['data']
        ]);
    }

    public function fetchStoryDetails(Request $request)
    {
        $request->validate([
            'project_id' => 'required',
            'stories' => 'required|array',
        ]);

        $updatedStories = [];
        // We know stories is an array of story objects from frontend
        foreach ($request->stories as $story) {
            if (isset($story['ref'])) {
                // Fetch detail using ref
                $detail = $this->taigaService->getStoryByRef($request->project_id, $story['ref']);
                if ($detail) {
                    $story['description'] = $detail['description'];
                    $story['subject'] = $detail['subject'];
                    if (isset($detail['owner_extra_info'])) {
                         $story['owner_extra_info'] = $detail['owner_extra_info'];
                    }
                }
            }
            $updatedStories[] = $story;
        }

        return response()->json([
            'success' => true,
            'data' => $updatedStories
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

    public function show(Story $story)
    {
        $story->load(['product', 'additionals']);
        
        return Inertia::render('Stories/Show', [
            'story' => $story
        ]);
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

    public function saveAdditionals(Request $request, Story $story)
    {
        $request->validate([
            'additionals' => 'array',
            'additionals.*.key' => 'required|string',
            'additionals.*.label' => 'required|string',
            'additionals.*.value' => 'required|string',
            'additionals.*.description' => 'nullable|string',
        ]);

        // Delete existing additionals
        $story->additionals()->delete();

        // Create new additionals
         if ($request->has('additionals')) {
            $story->additionals()->createMany($request->additionals);
        }

        return redirect()->back()->with('success', 'Additional information saved successfully.');
    }
}
