<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('forecast_results', function (Blueprint $table) {
            $table->timestamp('predicted_at')->nullable()->after('user_id');
        });

        DB::table('forecast_results')
            ->whereNull('predicted_at')
            ->update([
                'predicted_at' => DB::raw('COALESCE(updated_at, created_at)'),
            ]);

        $duplicates = DB::table('forecast_results')
            ->select('year', 'month', DB::raw('MAX(id) as keep_id'))
            ->groupBy('year', 'month')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $duplicate) {
            DB::table('forecast_results')
                ->where('year', $duplicate->year)
                ->where('month', $duplicate->month)
                ->where('id', '!=', $duplicate->keep_id)
                ->delete();
        }

        Schema::table('forecast_results', function (Blueprint $table) {
            $table->unique(['year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::table('forecast_results', function (Blueprint $table) {
            $table->dropUnique(['year', 'month']);
            $table->dropColumn('predicted_at');
        });
    }
};
