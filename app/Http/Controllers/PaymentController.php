<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Models\PaymentTransaction;
use App\Services\PaymentSimulatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function store(
        StorePaymentRequest $request,
        PaymentSimulatorService $paymentSimulator
    ): RedirectResponse {
        $validated = $request->validated();
        $normalizedCardNumber = preg_replace('/\D+/', '', $validated['card_number']) ?? '';
        $result = $paymentSimulator->process($validated['card_number'], (float) $validated['amount']);

        $transaction = PaymentTransaction::create([
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'amount' => $validated['amount'],
            'currency' => strtoupper($validated['currency']),
            'card_holder_name' => $validated['card_holder_name'],
            'card_last_four' => substr($normalizedCardNumber, -4),
            'card_brand' => $paymentSimulator->detectBrand($validated['card_number']),
            'payment_reference' => 'KPG-'.strtoupper(Str::random(10)),
            'status' => $result['status'],
            'gateway_message' => $result['message'],
            'failure_reason' => $result['failure_reason'],
            'processed_at' => now(),
            'meta' => [
                'expiry_month' => $validated['expiry_month'],
                'expiry_year' => $validated['expiry_year'],
            ],
        ]);

        return redirect()
            ->route('home')
            ->with('paymentResult', [
                'reference' => $transaction->payment_reference,
                'status' => $transaction->status,
                'message' => $transaction->gateway_message,
                'failure_reason' => $transaction->failure_reason,
            ]);
    }
}
