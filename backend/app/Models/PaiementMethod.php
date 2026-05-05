<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaiementMethod extends Model
{
    use HasFactory;

    protected $table = 'paiement_methods';

    protected $fillable = [
        'user_id',
        'type',
        'derniers_chiffres',
        'nom_titulaire',
        'expiration',
    ];

    protected $appends = [
        'last4',
        'holder',
        'expiry',
        'is_default',
    ];

    public function getLast4Attribute(): string
    {
        return (string) $this->derniers_chiffres;
    }

    public function getHolderAttribute(): string
    {
        return (string) $this->nom_titulaire;
    }

    public function getExpiryAttribute(): string
    {
        return (string) $this->expiration;
    }

    public function getIsDefaultAttribute(): bool
    {
        return false;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'method_id');
    }
}
