<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    public const ADMIN_MODULES = [
        'admin.dashboard',
        'admin.data_management',
        'admin.preprocessing',
        'admin.analytics',
        'admin.forecasting',
        'admin.decision_support',
        'admin.reports',
        'admin.audit_trail',
        'admin.rbac',
    ];

    public const USER_MODULES = [
        'user.dashboard',
        'user.analytics',
        'user.forecast_results',
        'user.decision_support',
        'user.reports',
    ];

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'permissions',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'permissions' => 'array',
        ];
    }

    public function defaultPermissions(): array
    {
        return $this->role === 'admin'
            ? self::ADMIN_MODULES
            : self::USER_MODULES;
    }

    public function modulePermissions(): array
    {
        return $this->permissions ?: $this->defaultPermissions();
    }

    public function canAccessModule(string $module): bool
    {
        return in_array($module, $this->modulePermissions(), true);
    }
}
