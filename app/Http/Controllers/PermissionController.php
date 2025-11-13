<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Menampilkan halaman utama untuk management permission.
     */
    public function toIndex()
    {
        return Inertia::render('PermissionManagement/index');
    }

    /**
     * Mengambil data permission dengan filter, sorting, dan paginasi.
     */
    public function index(Request $request)
    {
        $query = Permission::query();

        // Global search (search across name)
        $filterColumn = $request->get('filter_column');
        $filterValue = $request->get('filter_value');

        if (!empty($filterValue) && empty($filterColumn)) {
            // Global search: search di name
            $query->where('name', 'like', "%{$filterValue}%");
        } elseif (!empty($filterColumn) && !empty($filterValue)) {
            // Column-specific filter
            if ($filterColumn === 'name') {
                $values = explode(',', $filterValue);
                $query->whereIn($filterColumn, $values);
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (in_array($sortBy, ['name', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Paginasi
        $perPage = $request->get('per_page', 10);
        $permissions = $query->paginate($perPage);

        return response()->json($permissions);
    }

    /**
     * Menyimpan data permission baru.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        // Simpan data
        $permission = Permission::create(['name' => $validated['name']]);

        // Log the creation manually
        \OwenIt\Auditing\Models\Audit::create([
            'user_type' => auth()->check() ? get_class(auth()->user()) : null,
            'user_id' => auth()->id() ?? null,
            'event' => 'created',
            'auditable_type' => get_class($permission),
            'auditable_id' => $permission->id,
            'old_values' => json_encode([]),
            'new_values' => json_encode(['name' => $permission->name]),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'tags' => 'permission_created',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Permission berhasil dibuat',
                'data' => $permission,
            ], 201);
        }

        return redirect()->route('permissions.index')
            ->with('success', 'Permission berhasil dibuat');
    }

    /**
     * Memperbarui data permission yang ada.
     */
    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
        ]);

        // Store old name for audit
        $oldName = $permission->name;
        
        $permission->update(['name' => $validated['name']]);

        // Log the update manually
        \OwenIt\Auditing\Models\Audit::create([
            'user_type' => auth()->check() ? get_class(auth()->user()) : null,
            'user_id' => auth()->id() ?? null,
            'event' => 'updated',
            'auditable_type' => get_class($permission),
            'auditable_id' => $permission->id,
            'old_values' => json_encode(['name' => $oldName]),
            'new_values' => json_encode(['name' => $permission->name]),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'tags' => 'permission_updated',
        ]);

        return response()->json([
            'message' => 'Permission berhasil diperbarui',
            'data' => $permission,
        ]);
    }

    /**
     * Menghapus data permission.
     */
    public function destroy(Permission $permission)
    {
        // Store values for audit before deletion
        $permissionName = $permission->name;

        $permission->delete();

        // Log the deletion manually
        \OwenIt\Auditing\Models\Audit::create([
            'user_type' => auth()->check() ? get_class(auth()->user()) : null,
            'user_id' => auth()->id() ?? null,
            'event' => 'deleted',
            'auditable_type' => Permission::class,
            'auditable_id' => $permission->id,
            'old_values' => json_encode(['name' => $permissionName]),
            'new_values' => json_encode([]),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'tags' => 'permission_deleted',
        ]);

        return response()->json([
            'message' => 'Permission berhasil dihapus',
        ]);
    }
}
