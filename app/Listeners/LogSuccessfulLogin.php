<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use OwenIt\Auditing\Models\Audit;
use Illuminate\Support\Facades\Request;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // Only log for the web guard
        if ($event->guard !== 'web') {
            return;
        }

        // Check if we already have a recent login audit for this user
        $recentAudit = Audit::where('user_id', $event->user->id)
            ->where('event', 'login')
            ->where('created_at', '>', now()->subMinute())
            ->first();
            
        if ($recentAudit) {
            // Already logged recently, skip
            return;
        }

        // Create audit record for login
        Audit::create([
            'user_type' => get_class($event->user),
            'user_id' => $event->user->id,
            'event' => 'login',
            'auditable_type' => get_class($event->user),
            'auditable_id' => $event->user->id,
            'old_values' => [],
            'new_values' => [],
            'url' => Request::fullUrl(),
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'tags' => 'authentication',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}