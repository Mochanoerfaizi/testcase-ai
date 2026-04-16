<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\TaigaController;
use App\Http\Controllers\StoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'welcome'])->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [PageController::class, 'dashboard'])->name('dashboard');
    
    // Audit routes
    Route::get('/audits', [AuditController::class, 'index'])->name('audits.index');
    Route::get('/audits/{audit}', [AuditController::class, 'show'])->name('audits.show');
    
    // Taiga routes
    Route::get('/api/taiga/projects', [TaigaController::class, 'getProjects'])->name('taiga.projects');

    // Stories
    Route::post('/stories/fetch-from-taiga', [StoryController::class, 'fetchStories'])->name('stories.fetch-from-taiga');
    Route::post('/stories/fetch-milestones', [StoryController::class, 'fetchMilestones'])->name('stories.fetch-milestones');
    Route::post('/stories/fetch-details', [StoryController::class, 'fetchStoryDetails'])->name('stories.fetch-details');
    Route::post('/stories/{story}/additionals', [StoryController::class, 'saveAdditionals'])->name('stories.save-additionals');
    Route::post('/stories/{story}/testcases/generate', [\App\Http\Controllers\TestcaseController::class, 'generate'])->name('testcases.generate');
    Route::get('/stories/{story}/testcases/export', [\App\Http\Controllers\TestcaseController::class, 'export'])->name('testcases.export');
    Route::resource('stories', StoryController::class);
});

require __DIR__.'/auth.php';
require __DIR__.'/users.php';
require __DIR__.'/roles.php';
require __DIR__.'/permissions.php';
require __DIR__.'/profile.php';
require __DIR__.'/products.php';
require __DIR__.'/master/master_data_producer.php';