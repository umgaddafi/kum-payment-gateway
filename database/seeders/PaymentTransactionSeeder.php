<?php

namespace Database\Seeders;

use App\Models\PaymentTransaction;
use Illuminate\Database\Seeder;

class PaymentTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $transactions = [
            [
                'customer_name' => 'Amina Yusuf',
                'customer_email' => 'amina@example.com',
                'amount' => 120.00,
                'currency' => 'USD',
                'card_holder_name' => 'Amina Yusuf',
                'card_last_four' => '4242',
                'card_brand' => 'Visa',
                'payment_reference' => 'KPG-DEMO0001',
                'status' => 'successful',
                'gateway_message' => 'Payment approved by mock gateway.',
                'failure_reason' => null,
            ],
            [
                'customer_name' => 'David Mensah',
                'customer_email' => 'david@example.com',
                'amount' => 89.50,
                'currency' => 'USD',
                'card_holder_name' => 'David Mensah',
                'card_last_four' => '0002',
                'card_brand' => 'Mastercard',
                'payment_reference' => 'KPG-DEMO0002',
                'status' => 'failed',
                'gateway_message' => 'Payment declined by mock gateway.',
                'failure_reason' => 'Insufficient funds.',
            ],
            [
                'customer_name' => 'Grace Okafor',
                'customer_email' => 'grace@example.com',
                'amount' => 6400.00,
                'currency' => 'USD',
                'card_holder_name' => 'Grace Okafor',
                'card_last_four' => '4242',
                'card_brand' => 'Visa',
                'payment_reference' => 'KPG-DEMO0003',
                'status' => 'pending',
                'gateway_message' => 'Transaction flagged for manual review because the amount is high.',
                'failure_reason' => null,
            ],
        ];

        foreach ($transactions as $index => $transaction) {
            PaymentTransaction::updateOrCreate(
                ['payment_reference' => $transaction['payment_reference']],
                [
                    ...$transaction,
                    'processed_at' => now()->subMinutes(20 - ($index * 5)),
                    'meta' => ['seeded' => true],
                ],
            );
        }
    }
}
