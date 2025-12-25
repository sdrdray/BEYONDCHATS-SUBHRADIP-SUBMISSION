<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\DB;

// Health check route (no database needed)
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'message' => 'API is running']);
});

// Debug route to check database connection
Route::get('/debug', function () {
    try {
        DB::connection()->getPdo();
        $tables = DB::select('SHOW TABLES');
        return response()->json([
            'database' => 'connected',
            'tables' => $tables,
            'env' => [
                'DB_HOST' => env('MYSQLHOST'),
                'DB_DATABASE' => env('MYSQLDATABASE'),
                'DB_USERNAME' => env('MYSQLUSER'),
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'database' => 'failed',
            'error' => $e->getMessage(),
            'env' => [
                'DB_HOST' => env('MYSQLHOST'),
                'DB_DATABASE' => env('MYSQLDATABASE'),
                'DB_USERNAME' => env('MYSQLUSER'),
            ]
        ], 500);
    }
});

Route::middleware('api')->group(function () {
    // Articles CRUD routes
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    
    // Additional routes
    Route::get('/articles/latest/get', [ArticleController::class, 'latest']);
});
