<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditTrail;
use Inertia\Inertia;

class AuditTrailController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/AuditTrail', [
            'auditTrails' => AuditTrail::query()
                ->latest()
                ->get(),
        ]);
    }
}
