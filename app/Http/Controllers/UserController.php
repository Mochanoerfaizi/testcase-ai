<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Menampilkan halaman utama untuk management user.
     */
    public function toIndex()
    {
        return Inertia::render('UserManagement/index');
    }

    /**
     * Mengambil data user dengan filter, sorting, dan paginasi.
     */
    public function index(Request $request)
    {
        $query = User::with('roles:id,name');

        // Global search (search across name and email)
        $filterColumn = $request->get('filter_column');
        $filterValue = $request->get('filter_value');

        if (!empty($filterValue) && empty($filterColumn)) {
            // Global search: search di name dan email
            $query->where(function ($q) use ($filterValue) {
                $q->where('name', 'ilike', "%$filterValue%")
                  ->orWhere('email', 'ilike', "%{$filterValue}%");
            });
        } elseif (!empty($filterColumn) && !empty($filterValue)) {
            // Column-specific filter
            if (in_array($filterColumn, ['name', 'email', 'is_active'])) {
                if ($filterColumn === 'is_active') {
                    $query->where($filterColumn, $filterValue === 'true' || $filterValue === '1');
                } else {
                    $values = explode(',', $filterValue);
                    $query->whereIn($filterColumn, $values);
                }
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (in_array($sortBy, ['name', 'email', 'is_active', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Paginasi
        $perPage = $request->get('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json($users);
    }

    /**
     * Menyimpan data user baru.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'is_active' => 'boolean',
            'roles' => 'nullable|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        // Set default is_active jika tidak ada
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        // Simpan data
        $user = User::create($validated);

        // Assign roles
        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        // Load roles for response
        $user->load('roles:id,name');

        // Hapus password dari response
        $user->makeHidden(['password']);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'User berhasil dibuat',
                'data' => $user,
            ], 201);
        }

        return redirect()->route('users.index')
            ->with('success', 'User berhasil dibuat');
    }

    /**
     * Memperbarui data user yang ada.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'is_active' => 'boolean',
            'roles' => 'nullable|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        // Hash password jika ada
        if (isset($validated['password']) && !empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Sync roles
        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        // Load roles for response
        $user->load('roles:id,name');

        // Hapus password dari response
        $user->makeHidden(['password']);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'data' => $user,
        ]);
    }

    /**
     * Toggle status aktif/non-aktif user.
     */
    public function toggleActive(User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();

        // Hapus password dari response
        $user->makeHidden(['password']);

        return response()->json([
            'message' => 'Status user berhasil diubah',
            'data' => $user,
        ]);
    }

    /**
     * Menghapus data user.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus',
        ]);
    }
}
