<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TABLE IF EXISTS `climate_records`');

        Schema::create('climate_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dataset_id')->nullable();
            $table->unsignedSmallInteger('year');
            $table->unsignedTinyInteger('month');
            $table->decimal('temperature', 8, 2)->nullable();
            $table->decimal('humidity', 8, 2)->nullable();
            $table->decimal('rainfall', 10, 2)->nullable();
            $table->decimal('solar_irradiance', 10, 2)->nullable();
            $table->timestamps();
            $table->unique(['year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('climate_records');
    }
};
