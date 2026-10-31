<?php

namespace App\Clients;

use App\Exceptions\CheckoutConflictException;
use App\Exceptions\ServiceUnavailableException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class ProductServiceClient
{
    public function getProduct(int $productId): array
    {
        $baseUrl = rtrim(config('services.product.url', ''), '/');

        if ($baseUrl === '') {
            throw new ServiceUnavailableException(
                'URL Product Service belum dikonfigurasi.'
            );
        }

        try {
            $response = Http::timeout(5)
                ->acceptJson()
                ->get("{$baseUrl}/products/{$productId}");

        } catch (ConnectionException $exception) {
            throw new ServiceUnavailableException(
                'Product Service tidak dapat dihubungi.'
            );
        }

        if ($response->status() === 404) {
            throw new CheckoutConflictException(
                "Produk ID {$productId} tidak ditemukan."
            );
        }

        if ($response->failed()) {
            throw new ServiceUnavailableException(
                "Gagal mengambil produk ID {$productId} dari Product Service."
            );
        }

        $product = $response->json('data');

        if (!is_array($product)) {
            throw new ServiceUnavailableException(
                'Format data produk dari Product Service tidak valid.'
            );
        }

        return $product;
    }
}