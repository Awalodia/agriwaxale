<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Offre;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->acheteur) {
            $commandes = Commande::where('acheteur_id', $user->acheteur->id)
                ->where('statut', '!=', 'brouillon')
                ->with(['ligneCommandes.offre', 'paiement', 'evaluation'])
                ->latest()
                ->get();
        } elseif ($user->producteur) {
            $commandes = Commande::whereHas('ligneCommandes.offre', function ($q) use ($user) {
                $q->where('producteur_id', $user->producteur->id);
            })->where('statut', '!=', 'brouillon')->with(['ligneCommandes.offre', 'acheteur.user'])->get();
        } else {
            $commandes = Commande::where('statut', '!=', 'brouillon')->with(['ligneCommandes.offre', 'acheteur.user'])->get();
        }

        return response()->json($commandes);
    }

    public function show(Commande $commande)
    {
        return response()->json($commande->load(['ligneCommandes.offre', 'paiement', 'evaluation', 'acheteur.user']));
    }

    // Panier : la commande brouillon en cours de l'acheteur connecté
    public function panier(Request $request)
    {
        $acheteur = $request->user()->acheteur;
        if (! $acheteur) {
            return response()->json(['message' => 'Réservé aux acheteurs.'], 403);
        }
        $commande = Commande::where('acheteur_id', $acheteur->id)
            ->where('statut', 'brouillon')
            ->with('ligneCommandes.offre.producteur.user')
            ->first();

        return response()->json($commande);
    }

    // Ajouter un produit au panier (crée le panier s'il n'existe pas encore)
    public function store(Request $request)
    {
        $acheteur = $request->user()->acheteur;
        if (! $acheteur) {
            return response()->json(['message' => 'Seul un acheteur peut ajouter un produit au panier.'], 403);
        }

        $validated = $request->validate([
            'offre_id' => 'required|exists:offres,id',
            'quantite' => 'required|integer|min:1',
        ]);

        $offre = Offre::findOrFail($validated['offre_id']);

        if ($validated['quantite'] > $offre->quantite) {
            return response()->json(['message' => 'La quantité demandée dépasse le stock disponible.'], 422);
        }

        $commande = Commande::firstOrCreate(
            ['acheteur_id' => $acheteur->id, 'statut' => 'brouillon'],
            ['date_creation' => now()]
        );

        $ligne = $commande->ligneCommandes()->where('offre_id', $offre->id)->first();

        if ($ligne) {
            $nouvelleQuantite = $ligne->quantite + $validated['quantite'];
            $ligne->update([
                'quantite' => $nouvelleQuantite,
                'sous_total' => $nouvelleQuantite * $offre->prix_initial,
            ]);
        } else {
            LigneCommande::create([
                'commande_id' => $commande->id,
                'offre_id' => $offre->id,
                'quantite' => $validated['quantite'],
                'prix_unitaire' => $offre->prix_initial,
                'sous_total' => $offre->prix_initial * $validated['quantite'],
            ]);
        }

        $offre->decrement('quantite', $validated['quantite']);

        return response()->json($commande->load('ligneCommandes.offre'), 201);
    }

    // Retirer une ligne du panier (restitue le stock)
    public function removeLigne(Request $request, $ligneId)
    {
        $ligne = LigneCommande::findOrFail($ligneId);
        $commande = $ligne->commande;

        if (! $commande || $commande->acheteur_id !== $request->user()->acheteur?->id || $commande->statut !== 'brouillon') {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        $ligne->offre?->increment('quantite', $ligne->quantite);
        $ligne->delete();

        return response()->json(['message' => 'Produit retiré du panier.']);
    }

    public function update(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'action' => 'required|in:valider,annuler,confirmer_livraison',
            'adresse_livraison' => 'required_if:action,valider|string',
            'mode_livraison' => 'required_if:action,valider|string',
        ]);

        if ($validated['action'] === 'valider') {
            if (empty($commande->ligneCommandes()->count())) {
                return response()->json(['message' => 'Le panier est vide.'], 422);
            }
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
            foreach ($commande->ligneCommandes as $ligne) {
                $ligne->offre?->increment('quantite', $ligne->quantite);
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
