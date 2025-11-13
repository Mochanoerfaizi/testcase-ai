<?php

use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/permissions/json', [PermissionController::class, 'index'])->name('permissions.json');
    Route::get('/permissions', [PermissionController::class, 'toIndex'])->name('permissions.index');
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
    Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
});
