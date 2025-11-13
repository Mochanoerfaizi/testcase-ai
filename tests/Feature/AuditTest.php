<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use OwenIt\Auditing\Models\Audit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Permission as SpatiePermission;

class AuditTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user with admin role
        $this->user = User::factory()->create();
        $adminRole = Role::create(['name' => 'Admin']);
        $this->user->assignRole($adminRole);
        
        // Give the user necessary permissions
        $permissions = [
            'roles.create', 'roles.read', 'roles.update', 'roles.delete',
            'permissions.create', 'permissions.read', 'permissions.update', 'permissions.delete'
        ];
        
        foreach ($permissions as $permissionName) {
            $permission = SpatiePermission::firstOrCreate(['name' => $permissionName]);
            $adminRole->givePermissionTo($permission);
        }
        
        $this->actingAs($this->user);
    }

    /** @test */
    public function it_logs_role_creation()
    {
        $response = $this->postJson('/roles', [
            'name' => 'Test Role',
            'permissions' => []
        ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('audits', [
            'event' => 'created',
            'auditable_type' => Role::class,
            'tags' => 'role_created'
        ]);
    }

    /** @test */
    public function it_logs_role_update()
    {
        $role = Role::create(['name' => 'Original Role']);
        
        // Create a permission to assign
        $permission = SpatiePermission::create(['name' => 'test.permission']);
        
        $response = $this->putJson("/roles/{$role->id}", [
            'name' => 'Updated Role',
            'permissions' => ['test.permission']  // Actually change permissions
        ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('audits', [
            'event' => 'updated',
            'auditable_type' => Role::class,
            'tags' => 'role_permissions_updated'
        ]);
    }

    /** @test */
    public function it_logs_role_deletion()
    {
        $role = Role::create(['name' => 'Role to Delete']);
        
        $response = $this->deleteJson("/roles/{$role->id}");

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('audits', [
            'event' => 'deleted',
            'auditable_type' => Role::class,
            'tags' => 'role_deleted'
        ]);
    }

    /** @test */
    public function it_logs_permission_creation()
    {
        $response = $this->postJson('/permissions', [
            'name' => 'test.permission'
        ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('audits', [
            'event' => 'created',
            'auditable_type' => Permission::class,
            'tags' => 'permission_created'
        ]);
    }

    /** @test */
    public function it_logs_permission_update()
    {
        $permission = Permission::create(['name' => 'original.permission']);
        
        $response = $this->putJson("/permissions/{$permission->id}", [
            'name' => 'updated.permission'
        ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('audits', [
            'event' => 'updated',
            'auditable_type' => Permission::class,
            'tags' => 'permission_updated'
        ]);
    }

    /** @test */
    public function it_logs_permission_deletion()
    {
        $permission = Permission::create(['name' => 'permission.to.delete']);
        
        $response = $this->deleteJson("/permissions/{$permission->id}");

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('audits', [
            'event' => 'deleted',
            'auditable_type' => Permission::class,
            'tags' => 'permission_deleted'
        ]);
    }
}