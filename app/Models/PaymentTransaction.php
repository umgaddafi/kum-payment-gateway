<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PaymentTransaction extends Model
{
    protected $fillable = [
        'uuid',
        'customer_name',
        'customer_email',
        'amount',
        'currency',
        'card_holder_name',
        'card_last_four',
        'card_brand',
        'payment_reference',
        'status',
        'gateway_message',
        'failure_reason',
        'processed_at',
        'meta',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
        'meta' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $transaction): void {
            if (! $transaction->uuid) {
                $transaction->uuid = (string) Str::uuid();
            }
        });
    }
}
