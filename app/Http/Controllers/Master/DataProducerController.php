<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\DataProducer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DataProducerController extends Controller
{
    /**
     * Menampilkan halaman utama untuk master produsen data.
     */
    public function toIndex()
    {
        return Inertia::render('Master/DataProducer/index');
    }

    /**
     * Mengambil data produsen data dengan filter, sorting, dan paginasi.
     */
    public function index(Request $request)
    {
        $query = DataProducer::query();

        // Filter berdasarkan kolom dan nilai
        if ($request->has('filter_column') && $request->has('filter_value')) {
            $column = $request->get('filter_column');
            $value = $request->get('filter_value');

            if (in_array($column, ['name', 'classification', 'description'])) {
                $values = explode(',', $value);
                $query->whereIn($column, $values);
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (in_array($sortBy, ['name', 'classification', 'description', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Paginasi
        $perPage = $request->get('per_page', 10);
        $dataProducers = $query->paginate($perPage);

        return response()->json($dataProducers);
    }

    /**
     * Menyimpan data produsen data baru.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:data_producers,name',
            'classification' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Tambahkan UUID ke data yang divalidasi
        $validated['id'] = Str::uuid()->toString();

        // Simpan data
        $dataProducer = DataProducer::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Produsen data berhasil dibuat',
                'data' => $dataProducer,
            ], 201);
        }

        return redirect()->route('data-producers.index')
            ->with('success', 'Produsen data berhasil dibuat');
    }

    /**
     * Memperbarui data produsen data yang ada.
     */
    public function update(Request $request, DataProducer $dataProducer)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255|unique:data_producers,name,' . $dataProducer->id,
            'classification' => 'required|string|max:255',
            'description'    => 'nullable|string',
        ]);

        $dataProducer->update($validated);

        return response()->json([
            'message' => 'Produsen data berhasil diperbarui',
            'data'    => $dataProducer,
        ]);
    }

    /**
     * Menghapus data produsen data (soft delete).
     */
    public function destroy(DataProducer $dataProducer)
    {
        $dataProducer->delete();

        return response()->json([
            'message' => 'Produsen data berhasil dihapus',
        ]);
    }
}
