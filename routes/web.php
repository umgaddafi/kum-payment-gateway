<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
Route::get('/dashboard', DashboardController::class)->name('dashboard');
