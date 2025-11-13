<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/users/json', [UserController::class, 'index'])->name('users.json');
    Route::get('/users', [UserController::class, 'toIndex'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});
