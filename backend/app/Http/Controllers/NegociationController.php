<?php

namespace App\Http\Controllers;

use App\Models\Negociation;
use App\Models\PropositionNegociation;
use App\Models\Commande;
use Illuminate\Http\Request;

class NegociationController extends Controller
{
    // Lister les négociations de l'utilisateur connecté (acheteur ou producteur)
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->acheteur) {
            $negociations = Negociation::where('acheteur_id', $user->acheteur->id)
                ->with(['offre', 'propositions.auteur'])->get();
        } elseif ($user->producteur) {
            $negociations = Negociation::where('producteur_id', $user->producteur->id)
                ->with(['offre', 'propositions.auteur'])->get();
        } else {
            $negociations = Negociation::with(['offre', 'propositions.auteur'])->get(); // admin
        }

        return response()->json($negociations);
    }

    public function show(Negociation $negociation)
    {
        return response()->json($negociation->load(['offre', 'acheteur.user', 'producteur.user', 'propositions.auteur']));
    }

    // Lancer une négociation = "Négocier une offre" + "Proposer un prix" (première proposition)
    public function store(Request $request)
    {
        $acheteur = $request->user()->acheteur;
        if (! $acheteur) {
            return response()->json(['message' => 'Seul un acheteur peut lancer une négociation.'], 403);
        }

        $validated = $request->validate([
            'offre_id' => 'required|exists:offres,id',
            'prix_propose' => 'required|integer|min:0',
            'quantite_proposee' => 'required|numeric|min:0',
            'message' => 'nullable|string',
        ]);

        $offre = \App\Models\Offre::findOrFail($validated['offre_id']);

        $negociation = Negociation::create([
            'offre_id' => $offre->id,
            'acheteur_id' => $acheteur->id,
            'producteur_id' => $offre->producteur_id,
            'statut' => 'en_cours',
            'date_creation' => now(),
        ]);

        PropositionNegociation::create([
            'negociation_id' => $negociation->id,
            'user_id' => $request->user()->id,
            'prix_propose' => $validated['prix_propose'],
            'quantite_proposee' => $validated['quantite_proposee'],
            'statut' => 'en_attente',
            'date_proposition' => now(),
            'message' => $validated['message'] ?? null,
        ]);

        return response()->json($negociation->load('propositions'), 201);
    }

    // Répondre à une négociation : accepter / refuser / contre-proposer / annuler
    public function update(Request $request, Negociation $negociation)
    {
        $validated = $request->validate([
            'action' => 'required|in:accepter,refuser,contre_proposer,annuler',
            'prix_propose' => 'required_if:action,contre_proposer|integer|min:0',
            'quantite_proposee' => 'required_if:action,contre_proposer|numeric|min:0',
            'message' => 'nullable|string',
        ]);

        switch ($validated['action']) {
            case 'accepter':
                $negociation->update(['statut' => 'acceptee', 'date_cloture' => now()]);

                // Une négociation acceptée génère une commande
                $commande = Commande::create([
                    'acheteur_id' => $negociation->acheteur_id,
                    'negociation_id' => $negociation->id,
                    'statut' => 'en_attente',
                    'date_creation' => now(),
                ]);

                $derniereProposition = $negociation->propositions()->latest()->first();
                \App\Models\LigneCommande::create([
                    'commande_id' => $commande->id,
                    'offre_id' => $negociation->offre_id,
                    'quantite' => $derniereProposition->quantite_proposee,
                    'prix_unitaire' => $derniereProposition->prix_propose,
                    'sous_total' => $derniereProposition->prix_propose * $derniereProposition->quantite_proposee,
                ]);

                return response()->json(['negociation' => $negociation, 'commande' => $commande]);

            case 'refuser':
                $negociation->update(['statut' => 'refusee', 'date_cloture' => now()]);
                return response()->json($negociation);

            case 'annuler':
                $negociation->update(['statut' => 'annulee', 'date_cloture' => now()]);
                return response()->json($negociation);

            case 'contre_proposer':
                PropositionNegociation::create([
                    'negociation_id' => $negociation->id,
                    'user_id' => $request->user()->id,
                    'prix_propose' => $validated['prix_propose'],
                    'quantite_proposee' => $validated['quantite_proposee'],
                    'statut' => 'en_attente',
                    'date_proposition' => now(),
                    'message' => $validated['message'] ?? null,
                ]);
                return response()->json($negociation->load('propositions'));
        }
    }
}
