<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('datasets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type');
            $table->string('original_name');
            $table->string('path');
            $table->string('status')->default('pending');
            $table->json('validation_errors')->nullable();
            $table->unsignedInteger('record_count')->default(0);
            $table->timestamps();
        });

        Schema::create('consumption_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dataset_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('year');
            $table->unsignedTinyInteger('month');
            $table->decimal('consumption_kwh', 15, 2);
            $table->decimal('peak_demand_kw', 15, 2)->nullable();
            $table->timestamps();
            $table->unique(['year', 'month']);
        });

        Schema::create('climate_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dataset_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('year');
            $table->unsignedTinyInteger('month');
            $table->decimal('temperature', 8, 2)->nullable();
            $table->decimal('humidity', 8, 2)->nullable();
            $table->decimal('rainfall', 10, 2)->nullable();
            $table->decimal('solar_irradiance', 10, 2)->nullable();
            $table->timestamps();
            $table->unique(['year', 'month']);
        });

        Schema::create('processed_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('year');
            $table->unsignedTinyInteger('month');
            $table->decimal('consumption_kwh', 15, 2);
            $table->decimal('temperature', 8, 2);
            $table->decimal('humidity', 8, 2);
            $table->decimal('rainfall', 10, 2);
            $table->decimal('solar_irradiance', 10, 2);
            $table->decimal('peak_demand_kw', 15, 2);
            $table->decimal('lag_1', 15, 2);
            $table->decimal('lag_2', 15, 2);
            $table->unsignedInteger('trend');
            $table->decimal('month_sin', 12, 8);
            $table->decimal('month_cos', 12, 8);
            $table->timestamps();
            $table->unique(['year', 'month']);
        });

        Schema::create('forecast_results', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('year');
            $table->unsignedTinyInteger('month');
            $table->decimal('predicted_consumption_kwh', 15, 2);
            $table->decimal('previous_consumption_kwh', 15, 2)->nullable();
            $table->decimal('change_percent', 8, 2)->nullable();
            $table->decimal('mae', 12, 4)->nullable();
            $table->decimal('rmse', 12, 4)->nullable();
            $table->decimal('r2_score', 12, 4)->nullable();
            $table->string('model_type')->default('Random Forest');
            $table->timestamps();
        });

        Schema::create('dss_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('forecast_result_id')->nullable()->constrained()->nullOnDelete();
            $table->string('demand_status');
            $table->string('readiness_level');
            $table->json('recommendations');
            $table->json('priority_actions');
            $table->json('basis')->nullable();
            $table->timestamps();
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('type')->default('full');
            $table->json('summary');
            $table->string('file_path')->nullable();
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->text('description')->nullable();
            $table->json('properties')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('dss_results');
        Schema::dropIfExists('forecast_results');
        Schema::dropIfExists('processed_records');
        Schema::dropIfExists('climate_records');
        Schema::dropIfExists('consumption_records');
        Schema::dropIfExists('datasets');
    }
};
