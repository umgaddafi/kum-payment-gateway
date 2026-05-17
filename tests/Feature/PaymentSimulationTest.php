<?php

namespace Tests\Feature;

use App\Models\PaymentTransaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentSimulationTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_can_be_rendered(): void
    {
        $this->get('/')->assertOk();
    }

    public function test_a_successful_payment_can_be_simulated(): void
    {
        $response = $this->post('/payments', [
            'customer_name' => 'Jane Doe',
            'customer_email' => 'jane@example.com',
            'amount' => 120,
            'currency' => 'USD',
            'card_holder_name' => 'Jane Doe',
            'card_number' => '4242 4242 4242 4242',
            'expiry_month' => '12',
            'expiry_year' => '28',
            'cvv' => '123',
        ]);

        $response->assertRedirect(route('home', absolute: false));

        $this->assertDatabaseHas('payment_transactions', [
            'customer_email' => 'jane@example.com',
            'status' => 'successful',
            'card_last_four' => '4242',
        ]);
    }

    public function test_large_payments_are_marked_as_pending(): void
    {
        $this->post('/payments', [
            'customer_name' => 'Jane Doe',
            'customer_email' => 'jane@example.com',
            'amount' => 5000,
            'currency' => 'USD',
            'card_holder_name' => 'Jane Doe',
            'card_number' => '4242 4242 4242 4242',
            'expiry_month' => '12',
            'expiry_year' => '28',
            'cvv' => '123',
        ]);

        $transaction = PaymentTransaction::query()
            ->where('customer_email', 'jane@example.com')
            ->latest('id')
            ->first();

        $this->assertSame('pending', $transaction?->status);
    }
}
