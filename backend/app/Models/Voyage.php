<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voyage extends Model
{
    use HasFactory;

    protected $fillable = [
        'destination',
        'pays',
        'description',
        'prix',
        'duree',
        'image',
        'images',
        'note',
        'places_disponibles',
        'type_offre',
        'transport_type',
        'lieu_depart',
        'lieu_arrivee',
        'date_evenement',
    ];

    protected $casts = [
        'prix'               => 'float',
        'note'               => 'float',
        'places_disponibles' => 'integer',
        'duree'              => 'integer',
        'date_evenement'      => 'date:Y-m-d',
        'images'              => 'array',
    ];

    protected $appends = [
        'country',
        'price',
        'duration',
        'rating',
        'available_spots',
        'category',
        'offer_type',
        'offer_label',
        'transport',
        'departure_place',
        'arrival_place',
        'event_date',
        'gallery',
        'departure_dates',
    ];

    private static array $categoryMap = [
        'France'               => 'Europe',
        'Espagne'              => 'Europe',
        'Italie'               => 'Europe',
        'Grèce'                => 'Europe',
        'Portugal'             => 'Europe',
        'Allemagne'            => 'Europe',
        'Pays-Bas'             => 'Europe',
        'Maroc'                => 'Afrique',
        'Égypte'               => 'Afrique',
        'Tunisie'              => 'Afrique',
        'Afrique du Sud'       => 'Afrique',
        'Japon'                => 'Asie',
        'Thaïlande'            => 'Asie',
        'Indonésie'            => 'Asie',
        'Chine'                => 'Asie',
        'Inde'                 => 'Asie',
        'Vietnam'              => 'Asie',
        'Singapour'            => 'Asie',
        'États-Unis'           => 'Amériques',
        'Canada'               => 'Amériques',
        'Brésil'               => 'Amériques',
        'Mexique'              => 'Amériques',
        'Émirats Arabes Unis'  => 'Moyen-Orient',
        'Arabie Saoudite'      => 'Moyen-Orient',
        'Qatar'                => 'Moyen-Orient',
        'Turquie'              => 'Moyen-Orient',
        'Maldives'             => 'Océan Indien',
        'Maurice'              => 'Océan Indien',
        'Réunion'              => 'Océan Indien',
        'Seychelles'           => 'Océan Indien',
    ];

    public function getCountryAttribute(): string
    {
        return $this->pays;
    }

    public function getPriceAttribute(): float
    {
        return (float) $this->prix;
    }

    public function getDurationAttribute(): int
    {
        return (int) $this->duree;
    }

    public function getRatingAttribute(): float
    {
        return (float) $this->note;
    }

    public function getAvailableSpotsAttribute(): int
    {
        return (int) $this->places_disponibles;
    }

    public function getCategoryAttribute(): string
    {
        if ($this->type_offre === 'hajj' || $this->type_offre === 'omra') {
            return 'Hajj & Omra';
        }

        if ($this->type_offre === 'evenement') {
            return 'Événements';
        }

        if ($this->type_offre === 'transport') {
            return 'Transport';
        }

        return self::$categoryMap[$this->pays] ?? 'Monde';
    }

    public function getOfferTypeAttribute(): string
    {
        return $this->type_offre ?? 'voyage';
    }

    public function getOfferLabelAttribute(): string
    {
        return match ($this->type_offre) {
            'evenement' => 'Billetterie événement',
            'hajj'      => 'Package Hajj',
            'omra'      => 'Package Omra',
            'transport' => 'Transport',
            default     => 'Voyage',
        };
    }

    public function getTransportAttribute(): ?string
    {
        return $this->transport_type;
    }

    public function getDeparturePlaceAttribute(): ?string
    {
        return $this->lieu_depart;
    }

    public function getArrivalPlaceAttribute(): ?string
    {
        return $this->lieu_arrivee;
    }

    public function getEventDateAttribute(): ?string
    {
        return $this->date_evenement?->format('Y-m-d');
    }

    public function getGalleryAttribute(): array
    {
        $images = $this->images ?? [];

        if ($this->image && !in_array($this->image, $images, true)) {
            array_unshift($images, $this->image);
        }

        return array_values(array_filter($images));
    }

    public function getDepartureDatesAttribute(): array
    {
        $dates = [];
        $base  = Carbon::now()->startOfMonth()->addMonth();
        $seed  = (int) $this->id;

        if ($this->date_evenement) {
            return [$this->date_evenement->format('Y-m-d')];
        }

        for ($i = 0; $i < 5; $i++) {
            $offset  = ($seed * 3 + $i * 7) % 25;
            $dates[] = $base->copy()->addMonths($i)->addDays($offset)->format('Y-m-d');
        }

        return $dates;
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
