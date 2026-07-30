<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    // Suivre ses commandes
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->acheteur) {
            $commandes = Commande::where('acheteur_id', $user->acheteur->id)
                ->with(['ligneCommandes.offre', 'paiement', 'evaluation'])->get();
        } elseif ($user->producteur) {
            // Le producteur voit les commandes liées à ses offres
            $commandes = Commande::whereHas('ligneCommandes.offre', function ($q) use ($user) {
                $q->where('producteur_id', $user->producteur->id);
            })->with(['ligneCommandes.offre', 'acheteur.user'])->get();
        } else {
            $commandes = Commande::with(['ligneCommandes.offre', 'acheteur.user'])->get(); // admin
        }

        return response()->json($commandes);
    }

    public function show(Commande $commande)
    {
        return response()->json($commande->load(['ligneCommandes.offre', 'paiement', 'evaluation', 'acheteur.user']));
    }

    // Une commande "libre" (achat direct, sans négociation) — optionnel selon ton flux
    public function store(Request $request)
    {
        $acheteur = $request->user()->acheteur;
        if (! $acheteur) {
            return response()->json(['message' => 'Seul un acheteur peut passer commande.'], 403);
        }

        $validated = $request->validate([
            'offre_id' => 'required|exists:offres,id',
            'quantite' => 'required|numeric|min:0',
        ]);

        $offre = \App\Models\Offre::findOrFail($validated['offre_id']);

        $commande = Commande::create([
            'acheteur_id' => $acheteur->id,
            'statut' => 'en_attente',
            'date_creation' => now(),
        ]);

        \App\Models\LigneCommande::create([
            'commande_id' => $commande->id,
            'offre_id' => $offre->id,
            'quantite' => $validated['quantite'],
            'prix_unitaire' => $offre->prix_initial,
            'sous_total' => $offre->prix_initial * $validated['quantite'],
        ]);

        return response()->json($commande->load('ligneCommandes'), 201);
    }

    // Valider la commande («include» Renseigner l'adresse) / Annuler la commande («extend» de Suivre)
    public function update(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'action' => 'required|in:valider,annuler,confirmer_livraison',
            'adresse_livraison' => 'required_if:action,valider|string',
            'mode_livraison' => 'required_if:action,valider|string',
        ]);

        if ($validated['action'] === 'valider') {
            $commande->update([
                'adresse_livraison' => $validated['adresse_livraison'],
                'mode_livraison' => $validated['mode_livraison'],
                'statut' => 'en_attente_paiement',
            ]);
            return response()->json($commande);
        }

        if ($validated['action'] === 'annuler') {
            if (in_array($commande->statut, ['confirmee', 'livree'])) {
                return response()->json(['message' => 'Cette commande ne peut plus être annulée.'], 403);
            }
            $commande->update(['statut' => 'annulee']);
            return response()->json($commande);
        }

        if ($validated['action'] === 'confirmer_livraison') {
            $producteur = $request->user()->producteur;
            if (! $producteur) {
                return response()->json(['message' => 'Seul un producteur peut confirmer une livraison.'], 403);
            }
            $commande->update(['statut' => 'livree', 'date_livraison' => now()]);
            return response()->json($commande);
        }
    }

}
