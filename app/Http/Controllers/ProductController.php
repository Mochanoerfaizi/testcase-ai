<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Menampilkan halaman utama untuk management product.
     */
    public function toIndex()
    {
        return Inertia::render('ProductManagement/index');
    }

    /**
     * Mengambil data product dengan filter, sorting, dan paginasi.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Global search (search across name)
        $filterColumn = $request->get('filter_column');
        $filterValue = $request->get('filter_value');

        if (!empty($filterValue) && empty($filterColumn)) {
            // Global search: search di name
            $query->where('name', 'ilike', "%$filterValue%");
        } elseif (!empty($filterColumn) && !empty($filterValue)) {
            // Column-specific filter
            if (in_array($filterColumn, ['name', 'url'])) {
                $values = explode(',', $filterValue);
                $query->whereIn($filterColumn, $values);
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (in_array($sortBy, ['name', 'url', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Paginasi
        $perPage = $request->get('per_page', 10);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Menyimpan data product baru.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'nullable|url|max:2048',
            'taiga_project_id' => 'nullable|string',
            'taiga_project_name' => 'nullable|string',
        ]);

        // Simpan data
        $product = Product::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Product berhasil dibuat',
                'data' => $product,
            ], 201);
        }

        return redirect()->route('products.index')
            ->with('success', 'Product berhasil dibuat');
    }

    /**
     * Memperbarui data product yang ada.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'nullable|url|max:2048',
            'taiga_project_id' => 'nullable|string',
            'taiga_project_name' => 'nullable|string',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product berhasil diperbarui',
            'data' => $product,
        ]);
    }

    /**
     * Menghapus data product.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product berhasil dihapus',
        ]);
    }
}
