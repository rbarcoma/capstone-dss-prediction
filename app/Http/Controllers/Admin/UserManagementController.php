<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\AuditLogger;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users', [
            'users' => User::query()->latest()->get(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['admin', 'user'])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create($data);

        AuditLogger::log(
            'User Management',
            'Add User',
            'Created new user account: ' . $user->email . '.'
        );

        return back()->with('success', 'User created.');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'role' => ['required', Rule::in(['admin', 'user'])],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (! filled($data['password'] ?? null)) {
            unset($data['password']);
        }

        $user->update($data);

        AuditLogger::log(
            'User Management',
            'Edit User',
            'Updated user account: ' . $user->email . '.'
        );

        return back()->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        abort_if($user->id === auth()->id(), 422, 'You cannot delete your own account.');

        $email = $user->email;

        $user->delete();

        AuditLogger::log(
            'User Management',
            'Delete User',
            'Deleted user account: ' . $email . '.'
        );

        return back()->with('success', 'User deleted.');
    }
}
