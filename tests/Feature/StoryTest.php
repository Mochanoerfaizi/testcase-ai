<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Story;
use App\Services\TaigaService;
use Mockery;

class StoryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a user and authenticate
        $user = User::factory()->create();
        $this->actingAs($user);
    }

    public function test_can_list_stories()
    {
        $product = Product::factory()->create();
        Story::create([
            'taiga_id' => 123,
            'product_id' => $product->id,
            'subject' => 'Test Story',
            'description' => 'Description',
            'taiga_created_at' => now(),
            'creator_name' => 'John Doe',
        ]);

        $response = $this->get(route('stories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Stories/Index')
            ->has('stories', 1)
        );
    }

    public function test_can_fetch_stories_from_taiga()
    {
        $mockService = Mockery::mock(TaigaService::class);
        $mockService->shouldReceive('getProjects')->andReturn(['success' => true, 'data' => []]);
        $mockService->shouldReceive('getStories')->andReturn([
            'success' => true, 
            'data' => [
                [
                    'id' => 456,
                    'subject' => 'Fetched Story',
                    'created_date' => '2023-01-01T00:00:00Z',
                    'owner_extra_info' => ['full_name_display' => 'Jane Doe']
                ]
            ]
        ]);

        $this->app->instance(TaigaService::class, $mockService);

        $response = $this->post(route('stories.fetch-from-taiga'), ['project_id' => 1]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['subject' => 'Fetched Story']);
    }

    public function test_can_store_imported_stories()
    {
        $product = Product::factory()->create();
        $storyData = [
            'id' => 789,
            'subject' => 'Imported Story',
            'description' => 'Desc',
            'created_date' => '2023-01-01T00:00:00Z',
            'owner_extra_info' => ['full_name_display' => 'Importer'],
            'assigned_to_extra_info' => []
        ];

        $response = $this->post(route('stories.store'), [
            'product_id' => $product->id,
            'stories' => [$storyData]
        ]);

        $response->assertRedirect(route('stories.index'));
        $this->assertDatabaseHas('stories', ['taiga_id' => 789, 'subject' => 'Imported Story']);
    }

    public function test_can_update_story()
    {
        $product = Product::factory()->create();
        $story = Story::create([
            'taiga_id' => 101,
            'product_id' => $product->id,
            'subject' => 'Old Subject',
            'taiga_created_at' => now(),
            'creator_name' => 'Editor',
        ]);

        $response = $this->put(route('stories.update', $story->id), [
            'subject' => 'New Subject',
            'description' => 'New Description'
        ]);

        $response->assertRedirect(route('stories.index'));
        $this->assertDatabaseHas('stories', ['id' => $story->id, 'subject' => 'New Subject']);
    }

    public function test_can_delete_story()
    {
        $product = Product::factory()->create();
        $story = Story::create([
            'taiga_id' => 202,
            'product_id' => $product->id,
            'subject' => 'To Delete',
            'taiga_created_at' => now(),
            'creator_name' => 'Deleter',
        ]);

        $response = $this->delete(route('stories.destroy', $story->id));

        $response->assertRedirect(route('stories.index'));
        $this->assertDatabaseMissing('stories', ['id' => $story->id]);
    }
}
