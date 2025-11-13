<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use OwenIt\Auditing\Models\Audit;
use Illuminate\Support\Facades\Request;

class LogSuccessfulLogout
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
    public function handle(Logout $event): void
    {
        // Only log for the web guard
        if ($event->guard !== 'web') {
            return;
        }

        // Check if user exists (might be null if session expired)
        if (!$event->user) {
            return;
        }

        // Check if we already have a recent logout audit for this user
        $recentAudit = Audit::where('user_id', $event->user->id)
            ->where('event', 'logout')
            ->where('created_at', '>', now()->subMinute())
            ->first();
            
        if ($recentAudit) {
            // Already logged recently, skip
            return;
        }

        // Create audit record for logout
        Audit::create([
            'user_type' => get_class($event->user),
            'user_id' => $event->user->id,
            'event' => 'logout',
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