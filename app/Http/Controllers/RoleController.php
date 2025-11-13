<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Role;
use App\Models\Permission;

class RoleController extends Controller
{
    /**
     * Menampilkan halaman utama untuk management role.
     */
    public function toIndex()
    {
        return Inertia::render('RoleManagement/index');
    }

    /**
     * Mengambil data role dengan filter, sorting, dan paginasi.
     */
    public function index(Request $request)
    {
        $query = Role::with('permissions:id,name');

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
        $roles = $query->paginate($perPage);

        return response()->json($roles);
    }

    /**
     * Menyimpan data role baru.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        // Simpan data
        $role = Role::create(['name' => $validated['name']]);

        // Sync permissions by name
        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        // Log the creation manually
        \OwenIt\Auditing\Models\Audit::create([
            'user_type' => auth()->check() ? get_class(auth()->user()) : null,
            'user_id' => auth()->id() ?? null,
            'event' => 'created',
            'auditable_type' => get_class($role),
            'auditable_id' => $role->id,
            'old_values' => json_encode([]),
            'new_values' => json_encode([
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray()
            ]),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'tags' => 'role_created',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Role berhasil dibuat',
                'data' => $role->load('permissions'),
            ], 201);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Role berhasil dibuat');
    }

    /**
     * Memperbarui data role yang ada.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        // Store old values for manual audit
        $oldPermissions = $role->permissions->pluck('name')->toArray();
        $oldName = $role->name;

        $role->update(['name' => $validated['name']]);

        // Sync permissions by name
        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        // Reload the role with fresh permissions
        $role->load('permissions');
        $newPermissions = $role->permissions->pluck('name')->toArray();
        
        // Log permission changes manually if they changed
        if ($oldPermissions != $newPermissions) {
            \OwenIt\Auditing\Models\Audit::create([
                'user_type' => auth()->check() ? get_class(auth()->user()) : null,
                'user_id' => auth()->id() ?? null,
                'event' => 'updated',
                'auditable_type' => get_class($role),
                'auditable_id' => $role->id,
                'old_values' => json_encode(['permissions' => $oldPermissions, 'name' => $oldName]),
                'new_values' => json_encode(['permissions' => $newPermissions, 'name' => $role->name]),
                'url' => request()->fullUrl(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'tags' => 'role_permissions_updated',
            ]);
        }

        return response()->json([
            'message' => 'Role berhasil diperbarui',
            'data' => $role->load('permissions'),
        ]);
    }

    /**
     * Menghapus data role.
     */
    public function destroy(Role $role)
    {
        // Store values for audit before deletion
        $roleData = [
            'name' => $role->name,
            'permissions' => $role->permissions->pluck('name')->toArray()
        ];

        $role->delete();

        // Log the deletion manually
        \OwenIt\Auditing\Models\Audit::create([
            'user_type' => auth()->check() ? get_class(auth()->user()) : null,
            'user_id' => auth()->id() ?? null,
            'event' => 'deleted',
            'auditable_type' => Role::class,
            'auditable_id' => $role->id,
            'old_values' => json_encode($roleData),
            'new_values' => json_encode([]),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'tags' => 'role_deleted',
        ]);

        return response()->json([
            'message' => 'Role berhasil dihapus',
        ]);
    }

    /**
     * Get all roles for user assignment.
     */
    public function getAllRoles()
    {
        $roles = Role::orderBy('name')->get(['id', 'name']);

        return response()->json($roles);
    }

    /**
     * Get all permissions for role assignment.
     */
    public function getPermissions()
    {
        $permissions = Permission::orderBy('name')->get();

        return response()->json($permissions);
    }
}
