<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\TaigaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'welcome'])->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [PageController::class, 'dashboard'])->name('dashboard');
    
    // Audit routes
    Route::get('/audits', [AuditController::class, 'index'])->name('audits.index');
    Route::get('/audits/{audit}', [AuditController::class, 'show'])->name('audits.show');
    
    // Taiga routes
    Route::get('/api/taiga/projects', [TaigaController::class, 'getProjects'])->name('taiga.projects');
});

require __DIR__.'/auth.php';
require __DIR__.'/users.php';
require __DIR__.'/roles.php';
require __DIR__.'/permissions.php';
require __DIR__.'/profile.php';
require __DIR__.'/products.php';
require __DIR__.'/master/master_data_producer.php';