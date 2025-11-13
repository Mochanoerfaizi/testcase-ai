<?php

use App\Http\Controllers\Master\DataProducerController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {

    // Route untuk mengambil data JSON (untuk tabel, dll.)
    Route::get('data-producers/json', [DataProducerController::class, 'index'])
        ->name('data-producers.index.json');

    // Route untuk menampilkan halaman Inertia
    Route::get('data-producers', [DataProducerController::class, 'toIndex'])
        ->name('data-producers.index');

    // Route untuk menyimpan data baru
    Route::post('data-producers', [DataProducerController::class, 'store'])
        ->name('data-producers.store');

    // Route untuk memperbarui data yang ada
    Route::put('data-producers/{data_producer}', [DataProducerController::class, 'update'])
        ->name('data-producers.update');

    // Route untuk menghapus data
    Route::delete('data-producers/{data_producer}', [DataProducerController::class, 'destroy'])
        ->name('data-producers.destroy');

});
