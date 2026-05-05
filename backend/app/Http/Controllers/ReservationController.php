<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Voyage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $reservations = Reservation::with('voyage')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $reservations]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'voyage_id'      => 'required|exists:voyages,id',
            'departure_date' => 'required|date|after:today',
            'passengers'     => 'required|integer|min:1|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voyage = Voyage::findOrFail($request->voyage_id);
        $total  = $voyage->prix * $request->passengers;

        $reservation = Reservation::create([
            'user_id'          => $request->user()->id,
            'voyage_id'        => $request->voyage_id,
            'nombre_personnes' => $request->passengers,
            'date_depart'      => $request->departure_date,
            'total'            => $total,
            'statut'           => 'en attente',
        ]);

        return response()->json([
            'message'     => 'Réservation créée',
            'reservation' => $reservation->load('voyage'),
        ], 201);
    }

    public function cancel(Request $request, $id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $reservation->update(['statut' => 'annulée']);

        return response()->json([
            'message'     => 'Réservation annulée',
            'reservation' => $reservation->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée']);
    }
}
