<?php

namespace App\Http\Controllers;

use App\Models\PaymentTransaction;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $transactions = PaymentTransaction::query()
            ->latest()
            ->take(12)
            ->get()
            ->map(fn (PaymentTransaction $transaction) => [
                'id' => $transaction->id,
                'customer_name' => $transaction->customer_name,
                'customer_email' => $transaction->customer_email,
                'amount' => (float) $transaction->amount,
                'currency' => $transaction->currency,
                'status' => $transaction->status,
                'payment_reference' => $transaction->payment_reference,
                'card_brand' => $transaction->card_brand,
                'card_last_four' => $transaction->card_last_four,
                'gateway_message' => $transaction->gateway_message,
                'processed_at' => optional($transaction->processed_at)?->toDateTimeString(),
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_transactions' => PaymentTransaction::count(),
                'successful_transactions' => PaymentTransaction::where('status', 'successful')->count(),
                'failed_transactions' => PaymentTransaction::where('status', 'failed')->count(),
                'pending_transactions' => PaymentTransaction::where('status', 'pending')->count(),
                'total_volume' => (float) PaymentTransaction::sum('amount'),
            ],
            'transactions' => $transactions,
        ]);
    }
}
