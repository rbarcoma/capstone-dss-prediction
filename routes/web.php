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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// public page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/contact', function (Request $request) {
    $data = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'max:255'],
        'message' => ['required', 'string', 'max:5000'],
    ]);

    Mail::raw(
        "Name: {$data['name']}\nEmail: {$data['email']}\n\nMessage:\n{$data['message']}",
        function ($message) use ($data) {
            $message
                ->to('dsspredictionqc@gmail.com')
                ->replyTo($data['email'], $data['name'])
                ->subject('New DSS Energy Contact Message');
        },
    );

    return back()->with('success', 'Message sent successfully.');
})->name('contact.send');

// user routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->role === 'admin') {
            $routes = [
                'admin.dashboard' => 'admin.dashboard',
                'admin.data_management' => 'admin.data-management',
                'admin.preprocessing' => 'admin.data-preprocessing',
                'admin.analytics' => 'admin.analytics',
                'admin.forecasting' => 'admin.forecasting',
                'admin.decision_support' => 'admin.decision-support',
                'admin.reports' => 'admin.reports',
                'admin.audit_trail' => 'admin.audit-trail',
                'admin.rbac' => 'admin.users',
            ];
        } else {
            $routes = [
                'user.dashboard' => 'user.dashboard',
                'user.analytics' => 'user.analytics',
                'user.forecast_results' => 'user.forecast-results',
                'user.decision_support' => 'user.decision-support-results',
                'user.reports' => 'user.reports',
            ];
        }

        foreach ($routes as $module => $route) {
            if ($user->canAccessModule($module)) {
                return redirect()->route($route);
            }
        }

        abort(403, 'No module access has been assigned to your account.');
    })->name('dashboard');
});

// admin pages
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', AdminDashboardController::class)->middleware('module:admin.dashboard')->name('admin.dashboard');

    Route::get('/data-management', [DataManagementController::class, 'index'])->middleware('module:admin.data_management')->name('admin.data-management');
    Route::post('/data-management', [DataManagementController::class, 'store'])->middleware('module:admin.data_management')->name('admin.data-management.store');
    Route::delete('/data-management/{dataset}', [DataManagementController::class, 'destroy'])->middleware('module:admin.data_management')->name('admin.data-management.destroy');

    Route::get('/data-preprocessing', [PreprocessingController::class, 'index'])->middleware('module:admin.preprocessing')->name('admin.data-preprocessing');
    Route::get('/preprocessing', [PreprocessingController::class, 'index'])->middleware('module:admin.preprocessing')->name('admin.preprocessing');
    Route::post('/data-preprocessing/run', [PreprocessingController::class, 'run'])->middleware('module:admin.preprocessing')->name('admin.data-preprocessing.run');

    Route::get('/analytics', [AnalyticsController::class, 'index'])->middleware('module:admin.analytics')->name('admin.analytics');

    Route::get('/forecasting', [ForecastingController::class, 'index'])->middleware('module:admin.forecasting')->name('admin.forecasting');
    Route::post('/forecasting/train', [ForecastingController::class, 'train'])->middleware('module:admin.forecasting')->name('admin.forecasting.train');
    Route::post('/forecasting/predict', [ForecastingController::class, 'predict'])->middleware('module:admin.forecasting')->name('admin.forecasting.predict');

    Route::get('/decision-support', [DecisionSupportController::class, 'index'])->middleware('module:admin.decision_support')->name('admin.decision-support');
    Route::post('/decision-support/generate', [DecisionSupportController::class, 'generate'])->middleware('module:admin.decision_support')->name('admin.decision-support.generate');

    Route::get('/reports', [ReportController::class, 'index'])->middleware('module:admin.reports')->name('admin.reports');
    Route::post('/reports', [ReportController::class, 'store'])->middleware('module:admin.reports')->name('admin.reports.store');
    Route::get('/reports/{report}/download', [ReportController::class, 'download'])->middleware('module:admin.reports')->name('admin.reports.download');

    Route::get('/users', [UserManagementController::class, 'index'])->middleware('module:admin.rbac')->name('admin.users');
    Route::post('/users', [UserManagementController::class, 'store'])->middleware('module:admin.rbac')->name('admin.users.store');
    Route::put('/users/{user}', [UserManagementController::class, 'update'])->middleware('module:admin.rbac')->name('admin.users.update');
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->middleware('module:admin.rbac')->name('admin.users.destroy');

    Route::get('/audit-trail', [AuditTrailController::class, 'index'])->middleware('module:admin.audit_trail')->name('admin.audit-trail');
});

Route::middleware(['auth'])->prefix('user')->group(function () {
    Route::get('/dashboard', [ViewerController::class, 'dashboard'])->middleware('module:user.dashboard')->name('user.dashboard');
    Route::get('/analytics', [ViewerController::class, 'analytics'])->middleware('module:user.analytics')->name('user.analytics');
    Route::get('/forecast-results', [ViewerController::class, 'forecasts'])->middleware('module:user.forecast_results')->name('user.forecast-results');
    Route::get('/decision-support-results', [ViewerController::class, 'decisionSupport'])->middleware('module:user.decision_support')->name('user.decision-support-results');
    Route::get('/reports', [ViewerController::class, 'reports'])->middleware('module:user.reports')->name('user.reports');
});

Route::middleware(['auth', 'module:admin.reports,user.reports'])->get('/reports/{report}/download', [ReportController::class, 'download'])->name('reports.download');

require __DIR__.'/settings.php';
