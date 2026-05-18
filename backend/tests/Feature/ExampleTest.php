<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_login_returns_a_token_for_valid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'message',
                'token',
                'user' => ['name', 'email'],
            ]);
    }

    public function test_items_endpoint_requires_a_valid_token(): void
    {
        $response = $this->getJson('/api/items');

        $response
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_items_endpoint_returns_static_data_for_authenticated_requests(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer fake-jwt-token-for-demo',
        ])->getJson('/api/items');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'items' => [
                    '*' => ['id', 'title', 'description'],
                ],
            ]);
    }
}
