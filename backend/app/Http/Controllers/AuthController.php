<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:users',
            'password'              => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone ?: null,
        ]);

        $token = $user->createToken('safarGo')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('safarGo')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateUser(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name'  => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only('name', 'phone', 'email'));

        return response()->json([
            'message' => 'Profil mis à jour',
            'user'    => $user->fresh(),
        ]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
            'new_password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'Ancien mot de passe incorrect'], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $code = rand(100000, 999999);
        Cache::put('reset_' . $request->email, $code, now()->addMinutes(15));

        return response()->json([
            'message' => 'Code envoyé à ' . $request->email,
            'code'    => $code,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'code'     => 'required|digits:6',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cached = Cache::get('reset_' . $request->email);

        if (!$cached || (string) $cached !== (string) $request->code) {
            return response()->json(['message' => 'Code invalide ou expiré'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password)]);
        Cache::forget('reset_' . $request->email);

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès']);
    }
}
