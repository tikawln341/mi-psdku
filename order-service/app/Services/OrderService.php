<?php

namespace App\Services;

use App\Clients\CartServiceClient;
use App\Clients\ProductServiceClient;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class OrderService
{
    public function __construct(
        private CartServiceClient $cartClient,
        private ProductServiceClient $productClient
    ) {
    }

    public function checkout(int $userId): Order
    {
        // 1. Mengambil keranjang milik user.
        $cart = $this->cartClient->getCart($userId);
        $items = $cart['items'] ?? [];

        if (!is_array($items) || count($items) === 0) {
            throw new RuntimeException('Keranjang belanja masih kosong.');
        }

        // 2. Memeriksa produk dan menghitung total pesanan.
        $orderItems = [];
        $totalCents = 0;

        foreach ($items as $item) {
            $productId = (int) ($item['product_id'] ?? 0);
            $quantity = (int) ($item['quantity'] ?? 0);

            if ($productId <= 0 || $quantity <= 0) {
                throw new RuntimeException('Data item keranjang tidak valid.');
            }

            $product = $this->productClient->getProduct($productId);

            $name = $product['name'] ?? null;
            $price = $product['price'] ?? null;
            $stock = $product['stock'] ?? null;

            if (
                !is_string($name) ||
                $name === '' ||
                !is_numeric($price) ||
                !is_numeric($stock)
            ) {
                throw new RuntimeException(
                    "Data produk ID {$productId} tidak valid."
                );
            }

            if ((float) $price < 0 || (int) $stock < $quantity) {
                throw new RuntimeException(
                    "Stok produk {$name} tidak mencukupi."
                );
            }

            // Menghitung nilai uang dalam satuan sen agar
            // perhitungan tidak bergantung pada pecahan float.
            $unitPriceCents = (int) round((float) $price * 100);
            $subtotalCents = $unitPriceCents * $quantity;

            $totalCents += $subtotalCents;

            $orderItems[] = [
                'product_id' => $productId,
                'product_name' => $name,
                'unit_price' => number_format($unitPriceCents / 100, 2, '.', ''),
                'quantity' => $quantity,
                'subtotal' => number_format($subtotalCents / 100, 2, '.', ''),
            ];
        }

        // 3. Menyimpan pesanan dan seluruh item dalam satu transaksi.
        $order = DB::transaction(function () use (
            $userId,
            $orderItems,
            $totalCents
        ) {
            $newOrder = Order::create([
                'user_id' => $userId,
                'status' => 'PENDING',
                'total_amount' => number_format(
                    $totalCents / 100,
                    2,
                    '.',
                    ''
                ),
            ]);

            $newOrder->items()->createMany($orderItems);

            return $newOrder->load('items');
        });

        // 4. Mengosongkan keranjang setelah pesanan berhasil disimpan.
        // Kegagalan mengosongkan keranjang tidak membatalkan pesanan.
        try {
            $this->cartClient->clearCart($userId);
        } catch (\Throwable $exception) {
            Log::warning('Pesanan berhasil dibuat, tetapi keranjang gagal dikosongkan.', [
                'order_id' => $order->id,
                'user_id' => $userId,
                'error' => $exception->getMessage(),
            ]);
        }

        return $order;
    }

    public function getOrderById(int $orderId): ?Order
    {
        return Order::with('items')->find($orderId);
    }
}