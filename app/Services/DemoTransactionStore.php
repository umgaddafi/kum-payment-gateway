<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DemoTransactionStore
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function all(Request $request): array
    {
        return [
            ...$this->sessionTransactions($request),
            ...$this->seedTransactions(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function recent(Request $request, int $limit = 6): array
    {
        return array_slice($this->all($request), 0, $limit);
    }

    /**
     * @return array<string, int|float>
     */
    public function stats(Request $request): array
    {
        $transactions = $this->all($request);

        return [
            'total_transactions' => count($transactions),
            'successful_transactions' => count(array_filter($transactions, fn (array $transaction) => $transaction['status'] === 'successful')),
            'failed_transactions' => count(array_filter($transactions, fn (array $transaction) => $transaction['status'] === 'failed')),
            'pending_transactions' => count(array_filter($transactions, fn (array $transaction) => $transaction['status'] === 'pending')),
            'total_volume' => array_reduce(
                $transactions,
                fn (float $carry, array $transaction) => $carry + (float) $transaction['amount'],
                0.0
            ),
        ];
    }

    /**
     * @param array<string, mixed> $transaction
     */
    public function prepend(Request $request, array $transaction): void
    {
        $transactions = $this->sessionTransactions($request);
        array_unshift($transactions, $transaction);

        $request->session()->put('demo_transactions', array_slice($transactions, 0, 20));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function sessionTransactions(Request $request): array
    {
        /** @var array<int, array<string, mixed>> $transactions */
        $transactions = $request->session()->get('demo_transactions', []);

        return $transactions;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function seedTransactions(): array
    {
        return [
            [
                'id' => 'seed-1',
                'customer_name' => 'Amina Yusuf',
                'customer_email' => 'amina@example.com',
                'amount' => 120.00,
                'currency' => 'USD',
                'card_brand' => 'Visa',
                'card_last_four' => '4242',
                'payment_reference' => 'KPG-DEMO0001',
                'status' => 'successful',
                'gateway_message' => 'Payment approved by mock gateway.',
                'failure_reason' => null,
                'processed_at' => now()->subMinutes(20)->toDateTimeString(),
            ],
            [
                'id' => 'seed-2',
                'customer_name' => 'David Mensah',
                'customer_email' => 'david@example.com',
                'amount' => 89.50,
                'currency' => 'USD',
                'card_brand' => 'Mastercard',
                'card_last_four' => '0002',
                'payment_reference' => 'KPG-DEMO0002',
                'status' => 'failed',
                'gateway_message' => 'Payment declined by mock gateway.',
                'failure_reason' => 'Insufficient funds.',
                'processed_at' => now()->subMinutes(14)->toDateTimeString(),
            ],
            [
                'id' => 'seed-3',
                'customer_name' => 'Grace Okafor',
                'customer_email' => 'grace@example.com',
                'amount' => 6400.00,
                'currency' => 'USD',
                'card_brand' => 'Visa',
                'card_last_four' => '4242',
                'payment_reference' => 'KPG-DEMO0003',
                'status' => 'pending',
                'gateway_message' => 'Transaction flagged for manual review because the amount is high.',
                'failure_reason' => null,
                'processed_at' => now()->subMinutes(7)->toDateTimeString(),
            ],
        ];
    }

    public function makeTransactionId(): string
    {
        return 'demo-'.Str::lower(Str::random(12));
    }
}
