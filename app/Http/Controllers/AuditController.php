<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OwenIt\Auditing\Models\Audit;
use Inertia\Inertia;

class AuditController extends Controller
{
    /**
     * Display a listing of the audit logs.
     */
    public function index(Request $request)
    {
        $query = Audit::with(['user', 'auditable'])->orderBy('created_at', 'desc');

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by type
        if ($request->filled('auditable_type')) {
            $query->where('auditable_type', $request->auditable_type);
        }

        // Filter by event
        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        // Filter by tags
        if ($request->filled('tags')) {
            $query->where('tags', 'like', '%' . $request->tags . '%');
        }

        // Date range filter
        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        $perPage = $request->get('per_page', 15);
        $audits = $query->paginate($perPage);

        return Inertia::render('Audit/Index', [
            'audits' => $audits,
            'filters' => $request->only(['user_id', 'auditable_type', 'event', 'tags', 'start_date', 'end_date'])
        ]);
    }

    /**
     * Show the specified audit log.
     */
    public function show(Audit $audit)
    {
        $audit->load(['user', 'auditable']);
        
        return Inertia::render('Audit/Show', [
            'audit' => $audit
        ]);
    }
}