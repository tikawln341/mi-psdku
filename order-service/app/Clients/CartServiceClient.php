<?php

namespace App\Clients;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class CartServiceClient
{
    public function getCart(int $userId): array
    {
        $baseUrl = rtrim(config('services.cart.url', ''), '/');

        if ($baseUrl === '') {
            throw new RuntimeException('URL Cart Service belum dikonfigurasi.');
        }

        $response = Http::timeout(5)
            ->acceptJson()
            ->get("{$baseUrl}/carts/{$userId}");

        if ($response->failed()) {
            throw new RuntimeException(
                "Gagal mengambil keranjang user ID {$userId} dari Cart Service."
            );
        }

        $cart = $response->json('data');

        if (!is_array($cart)) {
            throw new RuntimeException('Format data keranjang dari Cart Service tidak valid.');
        }

        return $cart;
    }

    public function clearCart(int $userId): void
    {
        $baseUrl = rtrim(config('services.cart.url', ''), '/');

        if ($baseUrl === '') {
            throw new RuntimeException('URL Cart Service belum dikonfigurasi.');
        }

        $response = Http::timeout(5)
            ->acceptJson()
            ->delete("{$baseUrl}/carts/{$userId}");

        if ($response->failed()) {
            throw new RuntimeException(
                "Gagal mengosongkan keranjang user ID {$userId}."
            );
        }
    }
}