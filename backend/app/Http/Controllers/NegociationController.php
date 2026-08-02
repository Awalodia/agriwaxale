<?php

namespace App\Http\Controllers;

use App\Models\Negociation;
use App\Models\PropositionNegociation;
use App\Models\Commande;
use App\Models\LigneCommande;
use Illuminate\Http\Request;

class NegociationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->acheteur) {
            $negociations = Negociation::where('acheteur_id', $user->acheteur->id)->with(['offre', 'propositions.auteur'])->get();
        } elseif ($user->producteur) {
            $negociations = Negociation::where('producteur_id', $user->producteur->id)->with(['offre', 'propositions.auteur'])->get();
        } else {
            $negociations = Negociation::with(['offre', 'propositions.auteur'])->get();
        }

        return response()->json($negociations);
    }

    public function show(Negociation $negociation)
    {
        return response()->json($negociation->load(['offre', 'acheteur.user', 'producteur.user', 'propositions.auteur']));
    }

    public function store(Request $request)
    {
        $acheteur = $request->user()->acheteur;
        if (! $acheteur) {
            return response()->json(['message' => 'Seul un acheteur peut lancer une négociation.'], 403);
        }

        $validated = $request->validate([
            'offre_id' => 'required|exists:offres,id',
            'prix_propose' => 'required|integer|min:50',
            'quantite_proposee' => 'required|integer|min:1',
            'message' => 'nullable|string',
        ]);

        $offre = \App\Models\Offre::findOrFail($validated['offre_id']);

        if ($validated['quantite_proposee'] > $offre->quantite) {
            return response()->json(['message' => 'La quantité demandée dépasse le stock disponible.'], 422);
        }

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

    public function update(Request $request, Negociation $negociation)
    {
        $validated = $request->validate([
            'action' => 'required|in:accepter,refuser,contre_proposer,annuler',
            'prix_propose' => 'required_if:action,contre_proposer|integer|min:50',
            'quantite_proposee' => 'required_if:action,contre_proposer|integer|min:1',
            'message' => 'nullable|string',
        ]);

        $derniereProposition = $negociation->propositions()->latest()->first();

        if ($derniereProposition
            && $derniereProposition->user_id === $request->user()->id
            && $validated['action'] !== 'annuler') {
            return response()->json(['message' => "Vous devez attendre la réponse de l'autre partie avant d'agir à nouveau."], 403);
        }

        switch ($validated['action']) {
            case 'accepter':
                $negociation->update(['statut' => 'acceptee', 'date_cloture' => now()]);

                if (!empty($validated['message'] ?? null)) {
                    PropositionNegociation::create([
                        'negociation_id' => $negociation->id,
                        'user_id' => $request->user()->id,
                        'prix_propose' => $derniereProposition->prix_propose,
                        'quantite_proposee' => $derniereProposition->quantite_proposee,
                        'statut' => 'acceptee',
                        'date_proposition' => now(),
                        'message' => $validated['message'],
                    ]);
                }

                $offre = $negociation->offre;
                if ($derniereProposition->quantite_proposee > $offre->quantite) {
                    return response()->json(['message' => 'Stock insuffisant pour accepter cette négociation.'], 422);
                }

                // Réutilise le panier existant (brouillon) s'il y en a déjà un, sinon en crée un.
                $commande = Commande::firstOrCreate(
                    ['acheteur_id' => $negociation->acheteur_id, 'statut' => 'brouillon'],
                    ['date_creation' => now(), 'negociation_id' => $negociation->id]
                );

                LigneCommande::create([
                    'commande_id' => $commande->id,
                    'offre_id' => $negociation->offre_id,
                    'quantite' => $derniereProposition->quantite_proposee,
                    'prix_unitaire' => $derniereProposition->prix_propose,
                    'sous_total' => $derniereProposition->prix_propose * $derniereProposition->quantite_proposee,
                ]);

                $offre->decrement('quantite', $derniereProposition->quantite_proposee);

                return response()->json(['negociation' => $negociation, 'commande' => $commande]);

            case 'refuser':
                $negociation->update(['statut' => 'refusee', 'date_cloture' => now()]);
                if (!empty($validated['message'] ?? null)) {
                    PropositionNegociation::create([
                        'negociation_id' => $negociation->id,
                        'user_id' => $request->user()->id,
                        'prix_propose' => $derniereProposition->prix_propose,
                        'quantite_proposee' => $derniereProposition->quantite_proposee,
                        'statut' => 'refusee',
                        'date_proposition' => now(),
                        'message' => $validated['message'],
                    ]);
                }
                return response()->json($negociation);

            case 'annuler':
                $negociation->update(['statut' => 'annulee', 'date_cloture' => now()]);
                return response()->json($negociation);

            case 'contre_proposer':
                $offre = $negociation->offre;
                if ($validated['quantite_proposee'] > $offre->quantite) {
                    return response()->json(['message' => 'La quantité demandée dépasse le stock disponible.'], 422);
                }
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
