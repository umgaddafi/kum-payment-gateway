<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1', 'max:999999.99'],
            'currency' => ['required', 'string', 'size:3'],
            'card_holder_name' => ['required', 'string', 'max:255'],
            'card_number' => ['required', 'string', 'min:12', 'max:23'],
            'expiry_month' => ['required', 'digits:2'],
            'expiry_year' => ['required', 'digits:2'],
            'cvv' => ['required', 'digits_between:3,4'],
        ];
    }
}
