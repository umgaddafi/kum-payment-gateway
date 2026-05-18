<?php

namespace Tests\Feature;

use Tests\TestCase;

class PaymentSimulationTest extends TestCase
{
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
        $this->followRedirects($response)
            ->assertSee('Payment approved by mock gateway.');
    }

    public function test_large_payments_are_marked_as_pending(): void
    {
        $response = $this->post('/payments', [
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

        $this->followRedirects($response)
            ->assertSee('Transaction flagged for manual review because the amount is high.');
    }
}
