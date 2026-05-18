<?php

namespace App\Http\Middleware;

use App\Services\DummyDataService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FakeTokenMiddleware
{
    public function __construct(private readonly DummyDataService $dummyDataService)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if ($token !== $this->dummyDataService->token()) {
            return new JsonResponse([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        return $next($request);
    }
}
