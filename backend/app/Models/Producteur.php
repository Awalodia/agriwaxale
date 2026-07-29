<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producteur extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'zone_production', 'statut_compte'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function offres()
    {
        return $this->hasMany(Offre::class);
    }

    public function negociations()
    {
        return $this->hasMany(Negociation::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}
