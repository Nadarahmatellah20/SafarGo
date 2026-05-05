<?php

namespace App\Http\Controllers;

use App\Models\PaiementMethod;
use App\Models\Paiement;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaiementController extends Controller
{
    public function methods(Request $request)
    {
        $methods = PaiementMethod::where('user_id', $request->user()->id)->get();
        return response()->json(['data' => $methods]);
    }

    public function addMethod(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type'   => 'required|in:visa,mastercard,paypal,amex',
            'last4'  => 'required|digits:4',
            'expiry' => 'required|string|max:7',
            'holder' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $method = PaiementMethod::create([
            'user_id'           => $request->user()->id,
            'type'              => $request->type,
            'derniers_chiffres' => $request->last4,
            'nom_titulaire'     => $request->holder,
            'expiration'        => $request->expiry,
        ]);

        return response()->json([
            'message' => 'Carte ajoutée',
            'method'  => $method,
        ], 201);
    }

    public function deleteMethod(Request $request, $id)
    {
        $method = PaiementMethod::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $method->delete();

        return response()->json(['message' => 'Carte supprimée']);
    }

    public function pay(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:reservations,id',
            'method_id'      => 'required|exists:paiement_methods,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reservation = Reservation::where('id', $request->reservation_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $method = PaiementMethod::where('id', $request->method_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $paiement = Paiement::create([
            'user_id'        => $request->user()->id,
            'reservation_id' => $reservation->id,
            'method_id'      => $method->id,
            'montant'        => $reservation->total,
            'statut'         => 'payé',
        ]);

        $reservation->update(['statut' => 'confirmée']);

        return response()->json([
            'message'  => 'Paiement effectué avec succès',
            'paiement' => $paiement->load('reservation.voyage', 'method'),
        ]);
    }

    public function history(Request $request)
    {
        $history = Paiement::with(['reservation.voyage', 'method'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $history]);
    }
}
