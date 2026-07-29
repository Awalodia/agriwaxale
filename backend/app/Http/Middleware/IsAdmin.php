<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->administrateur) {
            return response()->json(['message' => 'Accès réservé à l\'administrateur.'], 403);
        }

        return $next($request);
    }
}
