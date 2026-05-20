<?php

namespace App\Support;

use App\Models\AuditTrail;
use Illuminate\Support\Facades\Auth;

class AuditLogger
{
    public static function log(
        string $module,
        string $action,
        string $description,
        string $status = 'success'
    ): void {
        $user = Auth::user();

        AuditTrail::create([
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'System',
            'module' => $module,
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip(),
            'status' => $status,
        ]);
    }
}
