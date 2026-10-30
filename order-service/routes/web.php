<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'service' => 'order-service',
        'message' => 'Order Service is running',
    ]);
});