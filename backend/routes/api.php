<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('fake.token')->group(function (): void {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/items', [DashboardController::class, 'items']);
});
