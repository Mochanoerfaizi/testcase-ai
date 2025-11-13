<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define modules with their permissions
        $modules = [
            'dashboard' => ['read'],
            'datasets' => ['create', 'read', 'update', 'delete'],
            'dataset-entry' => ['create', 'read'],
            'data-producers' => ['create', 'read', 'update', 'delete'],
            'users' => ['create', 'read', 'update', 'delete', 'toggle-status'],
            'roles' => ['create', 'read', 'update', 'delete'],
            'permissions' => ['create', 'read', 'update', 'delete'],
        ];

        // Create permissions for each module
        $allPermissions = [];
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $permissionName = "{$module}.{$action}";
                Permission::create(['name' => $permissionName]);
                $allPermissions[] = $permissionName;
            }
        }

        // Create roles and assign permissions
        $superAdmin = Role::create(['name' => 'Super Admin']);
        $admin = Role::create(['name' => 'Admin']);
        $user = Role::create(['name' => 'User']);

        // Super Admin gets all permissions
        $superAdmin->givePermissionTo(Permission::all());

        // Admin gets most permissions except role/permission management
        $adminPermissions = [];
        foreach ($modules as $module => $actions) {
            if (!in_array($module, ['roles', 'permissions'])) {
                foreach ($actions as $action) {
                    $adminPermissions[] = "{$module}.{$action}";
                }
            }
        }
        $admin->givePermissionTo($adminPermissions);

        // User gets basic read-only permissions
        $userPermissions = [
            'dashboard.read',
            'datasets.read',
            'dataset-entry.read',
            'data-producers.read',
        ];
        $user->givePermissionTo($userPermissions);

        $this->command->info('Permissions and roles seeded successfully!');
        $this->command->info('Total permissions created: ' . count($allPermissions));
    }
}
