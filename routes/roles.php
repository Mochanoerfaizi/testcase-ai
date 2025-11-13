<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/roles/all', [RoleController::class, 'getAllRoles'])->name('roles.all');
    Route::get('/roles/json', [RoleController::class, 'index'])->name('roles.json');
    Route::get('/roles', [RoleController::class, 'toIndex'])->name('roles.index');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
    Route::get('/roles/permissions/all', [RoleController::class, 'getPermissions'])->name('roles.permissions');
});
