<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use OwenIt\Auditing\Models\Audit;

class DuplicateAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_creates_single_audit_record(): void
    {
        // Clear any existing audit records
        Audit::truncate();
        
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        // Record initial audit count
        $initialCount = Audit::count();
        
        $this->post('/', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        
        // Check that exactly one audit record was created for login
        $loginAudits = Audit::where('event', 'login')->count();
        $this->assertEquals(1, $loginAudits, "Expected exactly 1 login audit record, but found {$loginAudits}");
        
        // Also check that only one audit record was created in total
        $totalCount = Audit::count();
        $this->assertEquals(1, $totalCount, "Expected exactly 1 audit record, but found {$totalCount}");
    }

    public function test_logout_creates_single_audit_record(): void
    {
        // Clear any existing audit records
        Audit::truncate();
        
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        // Login first
        $this->post('/', [
            'email' => $user->email,
            'password' => 'password',
        ]);
        
        // Clear audit records created during login
        Audit::where('event', 'login')->delete();
        
        // Record initial audit count
        $initialCount = Audit::count();
        
        // Logout
        $this->actingAs($user)->post('/logout');
        
        $this->assertGuest();
        
        // Check that exactly one audit record was created for logout
        $logoutAudits = Audit::where('event', 'logout')->count();
        $this->assertEquals(1, $logoutAudits, "Expected exactly 1 logout audit record, but found {$logoutAudits}");
        
        // Also check that only one audit record was created in total
        $totalCount = Audit::count();
        $this->assertEquals(1, $totalCount, "Expected exactly 1 audit record, but found {$totalCount}");
    }
}