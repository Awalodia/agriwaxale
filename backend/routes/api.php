<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OffreController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\NegociationController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/offres', [OffreController::class, 'index']);
Route::get('/offres/{offre}', [OffreController::class, 'show']);
Route::get('/categories', [CategorieController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::post('/offres', [OffreController::class, 'store']);
    Route::post('/offres/{offre}', [OffreController::class, 'update']); // POST + _method=PUT pour l'upload photo
    Route::put('/offres/{offre}', [OffreController::class, 'update']);
    Route::delete('/offres/{offre}', [OffreController::class, 'destroy']);

    Route::apiResource('negociations', NegociationController::class);

    Route::get('/panier', [CommandeController::class, 'panier']);
    Route::delete('/lignes-commande/{ligne}', [CommandeController::class, 'removeLigne']);
    Route::apiResource('commandes', CommandeController::class);

    Route::post('/paiements', [PaiementController::class, 'store']);
    Route::post('/evaluations', [EvaluationController::class, 'store']);
    Route::get('/mes-evaluations', [EvaluationController::class, 'mine']);

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/utilisateurs', [AdminController::class, 'utilisateurs']);
        Route::put('/producteurs/{producteurId}/valider', [AdminController::class, 'validerCompte']);
        Route::post('/categories', [AdminController::class, 'storeCategorie']);
        Route::delete('/categories/{categorie}', [AdminController::class, 'destroyCategorie']);
        Route::get('/commandes', [AdminController::class, 'commandes']);
        Route::get('/negociations', [AdminController::class, 'negociations']);
        Route::get('/evaluations', [AdminController::class, 'evaluations']);
        Route::get('/indicateurs', [AdminController::class, 'indicateurs']);
    });
});
