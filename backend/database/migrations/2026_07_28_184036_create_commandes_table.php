<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('acheteur_id')->constrained('acheteurs')->onDelete('cascade');
            $table->foreignId('negociation_id')->nullable()->constrained('negociations')->onDelete('set null');
            $table->string('statut')->default('en_attente');
            $table->timestamp('date_creation')->useCurrent();
            $table->date('date_livraison')->nullable();
            $table->string('adresse_livraison')->nullable();
            $table->string('mode_livraison')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
