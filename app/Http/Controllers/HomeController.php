<?php

namespace App\Http\Controllers;

use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $transactions = PaymentTransaction::query()
            ->latest()
            ->take(6)
            ->get()
            ->map(fn (PaymentTransaction $transaction) => [
                'id' => $transaction->id,
                'customer_name' => $transaction->customer_name,
                'amount' => (float) $transaction->amount,
                'currency' => $transaction->currency,
                'status' => $transaction->status,
                'payment_reference' => $transaction->payment_reference,
                'card_brand' => $transaction->card_brand,
                'card_last_four' => $transaction->card_last_four,
                'processed_at' => optional($transaction->processed_at)?->toDateTimeString(),
            ]);

        return Inertia::render('Payments/Home', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'transactions' => $transactions,
            'simulationRules' => [
                ['card' => '**** 4242', 'result' => 'Approved'],
                ['card' => '**** 0002', 'result' => 'Declined: insufficient funds'],
                ['card' => '**** 9995', 'result' => 'Declined: suspected fraud'],
                ['card' => 'Amount >= 5000', 'result' => 'Pending manual review'],
            ],
        ]);
    }
}
