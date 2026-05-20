<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\AuditLogger;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    private array $modules = [
        'admin' => [
            ['key' => 'admin.dashboard', 'label' => 'Dashboard'],
            ['key' => 'admin.data_management', 'label' => 'Data Management'],
            ['key' => 'admin.preprocessing', 'label' => 'Preprocessing'],
            ['key' => 'admin.analytics', 'label' => 'Analytics'],
            ['key' => 'admin.forecasting', 'label' => 'Forecasting'],
            ['key' => 'admin.decision_support', 'label' => 'Decision Support'],
            ['key' => 'admin.reports', 'label' => 'Reports'],
            ['key' => 'admin.audit_trail', 'label' => 'Audit Trail'],
            ['key' => 'admin.rbac', 'label' => 'User Management'],
        ],
        'user' => [
            ['key' => 'user.dashboard', 'label' => 'Dashboard'],
            ['key' => 'user.analytics', 'label' => 'Analytics'],
            ['key' => 'user.forecast_results', 'label' => 'Forecast Results'],
            ['key' => 'user.decision_support', 'label' => 'Decision Support Results'],
            ['key' => 'user.reports', 'label' => 'Reports'],
        ],
    ];

    private array $roles = [
        'admin' => [
            'label' => 'Admin',
            'scope' => 'Full administrative control panel',
        ],
        'user' => [
            'label' => 'User',
            'scope' => 'Limited Decision-Maker Access',
        ],
    ];

    public function index()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::query()->latest()->get(['id', 'name', 'email', 'role', 'permissions', 'created_at']),
            'roles' => $this->roles,
            'modules' => $this->modules,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['admin', 'user'])],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $data['permissions'] = $this->allowedPermissions($data['role'], $data['permissions']);
        $this->ensurePermissionsSelected($data['permissions']);

        $user = User::create($data);

        AuditLogger::log(
            'User Management',
            'Create User Account',
            'Created user account ' . $user->email . ' with ' . $this->roles[$user->role]['label'] . ' role and selected module permissions.'
        );

        return back()->with('success', 'User created.');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'role' => ['required', Rule::in(['admin', 'user'])],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['required', 'string'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $data['permissions'] = $this->allowedPermissions($data['role'], $data['permissions']);
        $this->ensurePermissionsSelected($data['permissions']);

        if ($user->id === $request->user()->id && $data['role'] === 'admin') {
            $data['permissions'] = array_values(array_unique([
                ...$data['permissions'],
                'admin.rbac',
            ]));
        }

        if (! filled($data['password'] ?? null)) {
            unset($data['password']);
        }

        $user->update($data);

        AuditLogger::log(
            'User Management',
            'Update User Account',
            'Updated user account ' . $user->email . ' with ' . $this->roles[$user->role]['label'] . ' role and selected module permissions.'
        );

        return back()->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user)
    {
        abort_if($user->id === auth()->id(), 422, 'You cannot delete your own account.');

        $data = $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (! Hash::check($data['password'], $request->user()->password)) {
            throw ValidationException::withMessages([
                'password' => 'The password is incorrect.',
            ]);
        }

        $email = $user->email;

        $user->delete();

        AuditLogger::log(
            'User Management',
            'Delete User Account',
            'Deleted user account and role assignment: ' . $email . '.'
        );

        return back()->with('success', 'User deleted.');
    }

    private function allowedPermissions(string $role, array $permissions): array
    {
        $allowed = collect($this->modules[$role] ?? [])->pluck('key')->all();

        return array_values(array_intersect($permissions, $allowed));
    }

    private function ensurePermissionsSelected(array $permissions): void
    {
        if ($permissions === []) {
            throw ValidationException::withMessages([
                'permissions' => 'Select at least one module permission.',
            ]);
        }
    }
}
