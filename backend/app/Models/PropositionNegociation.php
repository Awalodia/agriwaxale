<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropositionNegociation extends Model
{
    use HasFactory;

    protected $fillable = [
        'negociation_id', 'user_id', 'prix_propose',
        'quantite_proposee', 'statut', 'date_proposition', 'message'
    ];

    public function negociation()
    {
        return $this->belongsTo(Negociation::class);
    }

    public function auteur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
