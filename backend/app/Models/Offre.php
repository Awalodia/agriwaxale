<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    use HasFactory;

    protected $fillable = [
        'producteur_id', 'categorie_id', 'nom_produit', 'quantite',
        'prix_initial', 'zone_production', 'photo', 'date_publication', 'statut'
    ];

    public function producteur()
    {
        return $this->belongsTo(Producteur::class);
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function negociations()
    {
        return $this->hasMany(Negociation::class);
    }

    public function ligneCommandes()
    {
        return $this->hasMany(LigneCommande::class);
    }
}
