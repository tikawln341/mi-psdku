<?php

namespace App\Clients;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class ProductServiceClient
{
    public function getProduct(int $productId): array
    {
        $baseUrl = rtrim(
            config('services.product.url', ''),
            '/'
        );

        if ($baseUrl === '') {
            throw new RuntimeException(
                'URL Product Service belum dikonfigurasi.'
            );
        }

        $response = Http::timeout(5)
            ->acceptJson()
            ->get("{$baseUrl}/products/{$productId}");

        if ($response->failed()) {
            throw new RuntimeException(
                "Gagal mengambil produk ID {$productId} dari Product Service."
            );
        }

        $product = $response->json('data');

        if (! is_array($product)) {
            throw new RuntimeException(
                'Format data produk dari Product Service tidak valid.'
            );
        }

        return $product;
    }
}
