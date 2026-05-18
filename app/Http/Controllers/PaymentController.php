<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Services\DemoTransactionStore;
use App\Services\PaymentSimulatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function store(
        Request $sessionRequest,
        StorePaymentRequest $request,
        DemoTransactionStore $transactionStore,
        PaymentSimulatorService $paymentSimulator
    ): RedirectResponse {
        $validated = $request->validated();
        $normalizedCardNumber = preg_replace('/\D+/', '', $validated['card_number']) ?? '';
        $result = $paymentSimulator->process($validated['card_number'], (float) $validated['amount']);

        $transaction = [
            'id' => $transactionStore->makeTransactionId(),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'amount' => (float) $validated['amount'],
            'currency' => strtoupper($validated['currency']),
            'card_last_four' => substr($normalizedCardNumber, -4),
            'card_brand' => $paymentSimulator->detectBrand($validated['card_number']),
            'payment_reference' => 'KPG-'.strtoupper(Str::random(10)),
            'status' => $result['status'],
            'gateway_message' => $result['message'],
            'failure_reason' => $result['failure_reason'],
            'processed_at' => now()->toDateTimeString(),
        ];

        $transactionStore->prepend($sessionRequest, $transaction);

        return redirect()
            ->route('home')
            ->with('paymentResult', [
                'reference' => $transaction['payment_reference'],
                'status' => $transaction['status'],
                'message' => $transaction['gateway_message'],
                'failure_reason' => $transaction['failure_reason'],
            ]);
    }
}
