<?php

namespace App\Http\Controllers;

use App\Exceptions\CheckoutConflictException;
use App\Exceptions\ServiceUnavailableException;
use App\Http\Requests\StoreOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Throwable;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        try {
            $order = $this->orderService->checkout(
                (int) $request->validated('user_id')
            );

            return response()->json([
                'message' => 'Pesanan berhasil dibuat.',
                'data' => $order,
            ], 201);

        } catch (CheckoutConflictException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 409);

        } catch (ServiceUnavailableException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 503);

        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses pesanan.',
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $order = $this->orderService->getOrderById($id);

        if (!$order) {
            return response()->json([
                'message' => 'Pesanan tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'message' => 'Detail pesanan berhasil diambil.',
            'data' => $order,
        ], 200);
    }

    public function index(int $userId, Request $request): JsonResponse
    {
        $status = $request->query('status');

        if (
            $status !== null &&
            !in_array($status, ['PENDING', 'PAID'], true)
        ) {
            return response()->json([
                'message' => 'Status harus PENDING atau PAID.',
            ], 422);
        }

        $orders = $this->orderService->getOrdersByUser(
            $userId,
            $status
        );

        return response()->json([
            'message' => 'Riwayat pesanan berhasil diambil.',
            'data' => $orders,
        ], 200);
    }

    public function pay(int $id): JsonResponse
    {
        try {
            $order = $this->orderService->payOrder($id);

            if (!$order) {
                return response()->json([
                    'message' => 'Pesanan tidak ditemukan.',
                ], 404);
            }

            return response()->json([
                'message' => 'Pembayaran pesanan berhasil.',
                'data' => $order,
            ], 200);

        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 409);

        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses pembayaran.',
            ], 500);
        }
    }
}
