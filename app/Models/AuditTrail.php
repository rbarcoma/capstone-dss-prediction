<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditTrail extends Model
{
    protected $fillable = [
        'user_id',
        'user_name',
        'module',
        'action',
        'description',
        'ip_address',
        'status',
    ];
}
