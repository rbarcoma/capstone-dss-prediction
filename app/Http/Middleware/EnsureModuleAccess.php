<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureModuleAccess
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$modules): Response
    {
        foreach ($modules as $allowedModule) {
            if ($request->user()?->canAccessModule($allowedModule)) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized. You do not have access to this module.');
    }
}
