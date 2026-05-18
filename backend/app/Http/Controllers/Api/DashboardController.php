<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DummyDataService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private readonly DummyDataService $dummyDataService)
    {
    }

    public function items(): JsonResponse
    {
        return response()->json([
            'items' => $this->dummyDataService->items(),
        ]);
    }
}
