<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use OwenIt\Auditing\Models\Audit;

class LoginLogoutAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_event_is_audited(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', false));

        // Check that an audit record was created for login
        $this->assertDatabaseHas('audits', [
            'event' => 'login',
            'user_id' => $user->id,
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'tags' => 'authentication',
        ]);
    }

    public function test_logout_event_is_audited(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/logout');

        $this->assertGuest();

        // Check that an audit record was created for logout
        $this->assertDatabaseHas('audits', [
            'event' => 'logout',
            'user_id' => $user->id,
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'tags' => 'authentication',
        ]);
    }
}