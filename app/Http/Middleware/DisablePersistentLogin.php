<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

class DisablePersistentLogin
{
    public function handle(Request $request, Closure $next): Response
    {
        $guard = Auth::guard('web');

        if (method_exists($guard, 'getRecallerName')) {
            $recallerName = $guard->getRecallerName();

            if ($request->cookies->has($recallerName)) {
                $request->cookies->remove($recallerName);
                Cookie::queue(Cookie::forget($recallerName));
            }
        }

        if ($this->isAuthenticationAttempt($request)) {
            $request->merge(['remember' => false]);
            $request->session()->forget('login.remember');
        }

        return $next($request);
    }

    private function isAuthenticationAttempt(Request $request): bool
    {
        return $request->isMethod('post')
            && ($request->is('login') || $request->is('two-factor-challenge'));
    }
}
