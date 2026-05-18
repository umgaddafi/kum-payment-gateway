<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DummyDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct(private readonly DummyDataService $dummyDataService)
    {
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (! $this->dummyDataService->credentialsMatch(
            $request->string('email')->toString(),
            $request->string('password')->toString(),
        )) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        return response()->json([
            'message' => 'Login successful.',
            'token' => $this->dummyDataService->token(),
            'user' => $this->dummyDataService->user(),
        ]);
    }

    public function user(): JsonResponse
    {
        return response()->json([
            'user' => $this->dummyDataService->user(),
        ]);
    }
}
