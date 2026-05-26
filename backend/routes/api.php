<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VoyageController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Auth routes (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/admin-login', [AuthController::class, 'adminLogin']);
    Route::get('/social/{provider}/redirect', [AuthController::class, 'socialRedirect']);
    Route::get('/social/{provider}/callback', [AuthController::class, 'socialCallback']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/user', [AuthController::class, 'updateUser']);
        Route::put('/password', [AuthController::class, 'changePassword']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });

    // Voyages
    Route::get('/voyages', [VoyageController::class, 'index']);
    Route::get('/voyages/{id}', [VoyageController::class, 'show']);

    // Reservations
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

    // Paiements
    Route::get('/paiements/methods', [PaiementController::class, 'methods']);
    Route::post('/paiements/methods', [PaiementController::class, 'addMethod']);
    Route::delete('/paiements/methods/{id}', [PaiementController::class, 'deleteMethod']);
    Route::post('/paiements/pay', [PaiementController::class, 'pay']);
    Route::get('/paiements/history', [PaiementController::class, 'history']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::post('/register', [AdminController::class, 'registerAdmin']);

        Route::get('/voyages', [AdminController::class, 'indexVoyages']);
        Route::post('/voyages', [AdminController::class, 'storeVoyage']);
        Route::put('/voyages/{id}', [AdminController::class, 'updateVoyage']);
        Route::delete('/voyages/{id}', [AdminController::class, 'destroyVoyage']);

        Route::get('/users', [AdminController::class, 'indexUsers']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'destroyUser']);
        Route::put('/users/{id}/toggle-admin', [AdminController::class, 'toggleAdmin']);
        Route::put('/users/{id}/toggle-active', [AdminController::class, 'toggleActive']);

        Route::get('/reservations', [AdminController::class, 'indexReservations']);
        Route::put('/reservations/{id}/cancel', [AdminController::class, 'cancelReservation']);
        Route::delete('/reservations/{id}', [AdminController::class, 'destroyReservation']);

        Route::get('/paiements', [AdminController::class, 'indexPaiements']);
    });
});
