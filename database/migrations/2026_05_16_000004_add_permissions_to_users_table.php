<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('permissions')->nullable()->after('role');
        });

        DB::table('users')
            ->where('role', 'admin')
            ->update(['permissions' => json_encode(User::ADMIN_MODULES)]);

        DB::table('users')
            ->where('role', 'user')
            ->update(['permissions' => json_encode(User::USER_MODULES)]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('permissions');
        });
    }
};
