<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Negociation extends Model
{
    use HasFactory;

    protected $fillable = [
        'offre_id', 'acheteur_id', 'producteur_id',
        'statut', 'date_creation', 'date_cloture'
    ];

    public function offre()
    {
        return $this->belongsTo(Offre::class);
    }

    public function acheteur()
    {
        return $this->belongsTo(Acheteur::class);
    }

    public function producteur()
    {
        return $this->belongsTo(Producteur::class);
    }

    public function propositions()
    {
        return $this->hasMany(PropositionNegociation::class);
    }

    public function commande()
    {
        return $this->hasOne(Commande::class);
    }
}
