<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP TABLE IF EXISTS `consumption_records`');

        Schema::create('consumption_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dataset_id')->nullable();
            $table->unsignedSmallInteger('year');
            $table->unsignedTinyInteger('month');
            $table->decimal('consumption_kwh', 15, 2);
            $table->decimal('peak_demand_kw', 15, 2)->nullable();
            $table->timestamps();
            $table->unique(['year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consumption_records');
    }
};
