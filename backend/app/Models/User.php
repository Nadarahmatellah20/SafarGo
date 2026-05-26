<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'photo',
        'is_admin',
        'documents_enabled',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_admin'          => 'boolean',
            'documents_enabled' => 'boolean',
            'is_active'         => 'boolean',
        ];
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function paiementMethods()
    {
        return $this->hasMany(PaiementMethod::class);
    }
}
