<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DataManagementController;
use App\Http\Controllers\Admin\DecisionSupportController;
use App\Http\Controllers\Admin\ForecastingController;
use App\Http\Controllers\Admin\PreprocessingController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\User\ViewerController;
use App\Http\Controllers\Admin\AuditTrailController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// public page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// user routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return auth()->user()->role === 'admin'
            ? redirect()->route('admin.dashboard')
            : redirect()->route('user.dashboard');
    })->name('dashboard');
});

// admin pages
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', AdminDashboardController::class)->name('admin.dashboard');

    Route::get('/data-management', [DataManagementController::class, 'index'])->name('admin.data-management');
    Route::post('/data-management', [DataManagementController::class, 'store'])->name('admin.data-management.store');
    Route::delete('/data-management/{dataset}', [DataManagementController::class, 'destroy'])->name('admin.data-management.destroy');

    Route::get('/data-preprocessing', [PreprocessingController::class, 'index'])->name('admin.data-preprocessing');
    Route::get('/preprocessing', [PreprocessingController::class, 'index'])->name('admin.preprocessing');
    Route::post('/data-preprocessing/run', [PreprocessingController::class, 'run'])->name('admin.data-preprocessing.run');

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('admin.analytics');

    Route::get('/forecasting', [ForecastingController::class, 'index'])->name('admin.forecasting');
    Route::post('/forecasting/train', [ForecastingController::class, 'train'])->name('admin.forecasting.train');
    Route::post('/forecasting/predict', [ForecastingController::class, 'predict'])->name('admin.forecasting.predict');

    Route::get('/decision-support', [DecisionSupportController::class, 'index'])->name('admin.decision-support');
    Route::post('/decision-support/generate', [DecisionSupportController::class, 'generate'])->name('admin.decision-support.generate');

    Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports');
    Route::post('/reports', [ReportController::class, 'store'])->name('admin.reports.store');
    Route::get('/reports/{report}/download', [ReportController::class, 'download'])->name('admin.reports.download');

    Route::get('/users', [UserManagementController::class, 'index'])->name('admin.users');
    Route::post('/users', [UserManagementController::class, 'store'])->name('admin.users.store');
    Route::put('/users/{user}', [UserManagementController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('/audit-trail', [AuditTrailController::class, 'index'])->name('admin.audit-trail');
});

Route::middleware(['auth'])->prefix('user')->group(function () {
    Route::get('/dashboard', [ViewerController::class, 'dashboard'])->name('user.dashboard');
    Route::get('/analytics', [ViewerController::class, 'analytics'])->name('user.analytics');
    Route::get('/forecast-results', [ViewerController::class, 'forecasts'])->name('user.forecast-results');
    Route::get('/decision-support-results', [ViewerController::class, 'decisionSupport'])->name('user.decision-support-results');
    Route::get('/reports', [ViewerController::class, 'reports'])->name('user.reports');
});

Route::middleware(['auth'])->get('/reports/{report}/download', [ReportController::class, 'download'])->name('reports.download');

require __DIR__.'/settings.php';
