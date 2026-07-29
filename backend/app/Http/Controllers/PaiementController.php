<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Paiement;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    // Effectuer le paiement — clôt la validation de la commande
    public function store(Request $request)
    {
        $validated = $request->validate([
            'commande_id' => 'required|exists:commandes,id',
            'mode_paiement' => 'required|in:wave,orange_money,carte_bancaire',
        ]);

        $commande = Commande::with('ligneCommandes')->findOrFail($validated['commande_id']);

        if ($commande->statut !== 'en_attente_paiement') {
            return response()->json(['message' => 'La commande doit d\'abord être validée (adresse renseignée).'], 403);
        }

        $montant = $commande->ligneCommandes->sum('sous_total');

        $paiement = Paiement::create([
            'commande_id' => $commande->id,
            'montant' => $montant,
            'date_paiement' => now(),
            'mode_paiement' => $validated['mode_paiement'],
            'statut' => 'paye',
        ]);

        $commande->update(['statut' => 'confirmee']);

        return response()->json(['paiement' => $paiement, 'commande' => $commande], 201);
    }
}
