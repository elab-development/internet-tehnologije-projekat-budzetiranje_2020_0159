<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
 

 

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [UserController::class, 'index']); // Route to fetch all users
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::put('/payments/{id}', [PaymentController::class, 'update']);
    Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
    Route::get('/payments/user/{userId}', [PaymentController::class, 'paymentsByUserId']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);


    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::get('/expenses/{id}', [ExpenseController::class, 'show']);
    Route::post('/expenses', [ExpenseController::class, 'store']);
    Route::put('/expenses/{id}', [ExpenseController::class, 'update']);
    Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);
    Route::get('/expenses/user/{userId}', [ExpenseController::class, 'expensesByUserId']);


    Route::get('/incomes', [IncomeController::class, 'index']);
    Route::get('/incomes/{id}', [IncomeController::class, 'show']);
    Route::post('/incomes', [IncomeController::class, 'store']);
    Route::put('/incomes/{id}', [IncomeController::class, 'update']);
    Route::delete('/incomes/{id}', [IncomeController::class, 'destroy']);
    Route::get('/incomes/receiver/{receiverId}', [IncomeController::class, 'incomesByReceiverId']);
});



 