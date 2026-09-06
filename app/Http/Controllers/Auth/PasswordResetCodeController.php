<?php

namespace App\Http\Controllers\Auth;

use App\Concerns\PasswordValidationRules;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PasswordResetCodeController extends Controller
{
    use PasswordValidationRules;

    public function request(Request $request)
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    public function sendCode(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = strtolower($data['email']);
        $user = User::query()->where('email', $email)->first();

        $request->session()->put('password_reset_email', $email);
        $request->session()->forget('password_reset_verified_email');

        if ($user) {
            $code = (string) random_int(100000, 999999);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $email],
                [
                    'token' => Hash::make($code),
                    'created_at' => now(),
                ],              
            );

            Mail::html($this->emailBody($code), function ($message) use ($email) {
                $message
                    ->to($email)
                    ->subject('Your DSS Energy password reset code');
            });
        }

        return redirect()
            ->route('password.code')
            ->with('status', 'If the email exists in the system, a 6-digit reset code has been sent.');
    }

    public function codeForm(Request $request)
    {
        $email = strtolower((string) $request->session()->get('password_reset_email', ''));

        if (! $email) {
            return redirect()->route('password.request');
        }

        return Inertia::render('auth/verify-reset-code', [
            'email' => $email,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function verifyCode(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $email = strtolower((string) $request->session()->get('password_reset_email', ''));

        if (! $email) {
            return redirect()->route('password.request');
        }

        if (! User::query()->where('email', $email)->exists() || ! $this->validCode($email, $data['code'])) {
            throw ValidationException::withMessages([
                'code' => 'The reset code is invalid or has expired.',
            ]);
        }

        $request->session()->put('password_reset_verified_email', $email);

        return redirect()
            ->route('password.reset')
            ->with('status', 'Code verified. You can now create a new password.');
    }

    public function showResetForm(Request $request)
    {
        $email = strtolower((string) $request->session()->get('password_reset_verified_email', ''));

        if (! $email) {
            return redirect()->route('password.request');
        }

        return Inertia::render('auth/reset-password', [
            'email' => $email,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function reset(Request $request)
    {
        $data = $request->validate([
            'password' => $this->passwordRules(),
        ]);

        $email = strtolower((string) $request->session()->get('password_reset_verified_email', ''));

        if (! $email) {
            throw ValidationException::withMessages([
                'password' => 'Please verify your reset code first.',
            ]);
        }

        $user = User::query()->where('email', $email)->firstOrFail();
        $user->forceFill([
            'password' => $data['password'],
        ])->save();

        DB::table('password_reset_tokens')->where('email', $email)->delete();
        $request->session()->forget([
            'password_reset_email',
            'password_reset_verified_email',
        ]);

        return redirect()
            ->route('login')
            ->with('status', 'Your password has been reset. You can now log in.');
    }

    private function validCode(string $email, string $code): bool
    {
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();
        $expireMinutes = (int) config('auth.passwords.users.expire', 60);

        return $record &&
            Hash::check($code, $record->token) &&
            now()->diffInMinutes($record->created_at) <= $expireMinutes;
    }

    private function emailBody(string $code): string
    {
        return '
            <div style="background:#f6f8fb;padding:32px;font-family:Arial,sans-serif;color:#0f172a;">
                <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
                    <h1 style="margin:0 0 8px;font-size:22px;">DSS Energy</h1>
                    <p style="margin:0 0 24px;color:#475569;">Use this 6-digit code to reset your password.</p>
                    <div style="font-size:34px;letter-spacing:10px;font-weight:700;text-align:center;background:#ecfdf5;color:#047857;border-radius:10px;padding:18px 12px;margin:24px 0;">'
                        . e($code) .
                    '</div>
                    <p style="margin:0 0 12px;color:#475569;">This code will expire in 60 minutes.</p>
                    <p style="margin:0;color:#475569;">If you did not request a password reset, no further action is required.</p>
                </div>
            </div>
        ';
    }
}
