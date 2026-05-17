<?php

namespace App\Services;

class PaymentSimulatorService
{
    public function process(string $cardNumber, float $amount): array
    {
        $normalizedNumber = preg_replace('/\D+/', '', $cardNumber) ?? '';
        $lastFour = substr($normalizedNumber, -4);

        if ($amount >= 5000) {
            return [
                'status' => 'pending',
                'message' => 'Transaction flagged for manual review because the amount is high.',
                'failure_reason' => null,
            ];
        }

        return match ($lastFour) {
            '4242' => [
                'status' => 'successful',
                'message' => 'Payment approved by mock gateway.',
                'failure_reason' => null,
            ],
            '0002' => [
                'status' => 'failed',
                'message' => 'Payment declined by mock gateway.',
                'failure_reason' => 'Insufficient funds.',
            ],
            '9995' => [
                'status' => 'failed',
                'message' => 'Payment blocked by mock gateway.',
                'failure_reason' => 'Suspected fraud pattern.',
            ],
            default => [
                'status' => 'successful',
                'message' => 'Payment approved after standard verification.',
                'failure_reason' => null,
            ],
        };
    }

    public function detectBrand(string $cardNumber): string
    {
        $normalizedNumber = preg_replace('/\D+/', '', $cardNumber) ?? '';

        return match (true) {
            str_starts_with($normalizedNumber, '4') => 'Visa',
            preg_match('/^5[1-5]/', $normalizedNumber) === 1 => 'Mastercard',
            preg_match('/^3[47]/', $normalizedNumber) === 1 => 'American Express',
            default => 'Card',
        };
    }
}
