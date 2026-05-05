<?php

namespace App\Http\Controllers;

use App\Models\Voyage;
use Illuminate\Http\Request;

class VoyageController extends Controller
{
    private static array $categoryMap = [
        'Europe'       => ['France', 'Espagne', 'Italie', 'Grèce', 'Portugal', 'Allemagne', 'Pays-Bas'],
        'Asie'         => ['Japon', 'Thaïlande', 'Indonésie', 'Chine', 'Inde', 'Vietnam', 'Singapour'],
        'Afrique'      => ['Maroc', 'Égypte', 'Tunisie', 'Afrique du Sud'],
        'Amériques'    => ['États-Unis', 'Canada', 'Brésil', 'Mexique'],
        'Moyen-Orient' => ['Émirats Arabes Unis', 'Arabie Saoudite', 'Qatar', 'Turquie'],
        'Océan Indien' => ['Maldives', 'Maurice', 'Réunion', 'Seychelles'],
    ];

    public function index(Request $request)
    {
        $query = Voyage::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('destination', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('pays', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'Tous') {
            $pays = self::$categoryMap[$request->category] ?? [];
            if (!empty($pays)) {
                $query->whereIn('pays', $pays);
            }
        }

        if ($request->filled('min_prix')) {
            $query->where('prix', '>=', $request->min_prix);
        }

        if ($request->filled('max_prix')) {
            $query->where('prix', '<=', $request->max_prix);
        }

        if ($request->filled('min_price')) {
            $query->where('prix', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('prix', '<=', $request->max_price);
        }

        $voyages = $query->orderBy('id')->get();

        return response()->json([
            'data'  => $voyages,
            'total' => $voyages->count(),
        ]);
    }

    public function show($id)
    {
        $voyage = Voyage::findOrFail($id);
        return response()->json($voyage);
    }
}
