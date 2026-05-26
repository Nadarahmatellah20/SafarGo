<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:users,email',
            'phone'                 => 'nullable|string|max:20',
            'password'              => ['required', 'string', 'confirmed', Password::min(6)->letters()->numbers()],
            'password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = strtolower(trim($request->email));

        $user = User::create([
            'name'     => trim($request->name),
            'email'    => $email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone ?: null,
            'documents_enabled' => true,
            'is_active' => true,
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

        $credentials = [
            'email'    => strtolower(trim($request->email)),
            'password' => $request->password,
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        $user  = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            return response()->json(['message' => 'Votre compte est désactivé. Contactez l’administrateur.'], 403);
        }

        $user->tokens()->where('name', 'safarGo')->delete();
        $token = $user->createToken('safarGo')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    public function adminLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', strtolower(trim($request->email)))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe admin incorrect'], 401);
        }

        if (!$user->is_admin) {
            return response()->json(['message' => 'Ce compte n’est pas administrateur'], 403);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Votre compte administrateur est désactivé'], 403);
        }

        $user->tokens()->where('name', 'safarGo')->delete();
        $token = $user->createToken('safarGo')->plainTextToken;

        return response()->json([
            'message' => 'Connexion administrateur réussie',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    public function socialRedirect(string $provider)
    {
        $config = $this->socialConfig($provider);
        if (!$config || empty($config['client_id']) || empty($config['client_secret'])) {
            return response()->json(['message' => 'Connexion ' . ucfirst($provider) . ' non configurée'], 422);
        }

        $state = Str::random(48);
        Cache::put('oauth_state_' . $state, $provider, now()->addMinutes(10));

        $params = [
            'client_id'     => $config['client_id'],
            'redirect_uri'  => $config['redirect_uri'],
            'response_type' => 'code',
            'scope'         => $config['scope'],
            'state'         => $state,
        ];

        if ($provider === 'apple') {
            $params['response_mode'] = 'query';
        }

        return redirect()->away($config['authorize_url'] . '?' . http_build_query($params));
    }

    public function socialCallback(Request $request, string $provider)
    {
        $config = $this->socialConfig($provider);
        $stateProvider = Cache::pull('oauth_state_' . $request->state);

        if (!$config || !$request->filled('code') || $stateProvider !== $provider) {
            return redirect()->away($this->frontendUrl('/?social_error=invalid_request'));
        }

        try {
            $profile = $this->fetchSocialProfile($provider, $request->code, $config);
        } catch (\Throwable $e) {
            return redirect()->away($this->frontendUrl('/?social_error=' . urlencode($e->getMessage())));
        }

        if (empty($profile['email'])) {
            return redirect()->away($this->frontendUrl('/?social_error=email_missing'));
        }

        $user = User::firstOrCreate(
            ['email' => strtolower($profile['email'])],
            [
                'name'              => $profile['name'] ?: ucfirst($provider) . ' User',
                'password'          => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
                'photo'             => $profile['photo'] ?? null,
                'documents_enabled' => true,
                'is_active'         => true,
            ]
        );

        if (!$user->is_active) {
            return redirect()->away($this->frontendUrl('/?social_error=account_disabled'));
        }

        $updates = [
            'email_verified_at' => $user->email_verified_at ?: now(),
        ];

        if (!empty($profile['name']) && $user->name !== $profile['name']) {
            $updates['name'] = $profile['name'];
        }

        if (!empty($profile['photo']) && empty($user->photo)) {
            $updates['photo'] = $profile['photo'];
        }

        $user->update($updates);
        $user->tokens()->where('name', 'safarGo')->delete();
        $token = $user->createToken('safarGo')->plainTextToken;

        return redirect()->away($this->frontendUrl('/social-callback?token=' . urlencode($token)));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnexion de tous les appareils réussie']);
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
            'photo' => 'sometimes|nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only('name', 'phone', 'email', 'photo');
        if (isset($data['name'])) {
            $data['name'] = trim($data['name']);
        }
        if (isset($data['email'])) {
            $data['email'] = strtolower(trim($data['email']));
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profil mis à jour',
            'user'    => $user->fresh(),
        ]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required|string',
            'new_password' => ['required', 'string', 'confirmed', Password::min(6)->letters()->numbers()],
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
        $currentToken = $request->user()->currentAccessToken();
        if ($currentToken) {
            $request->user()->tokens()->where('id', '!=', $currentToken->id)->delete();
        }

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

        $email = strtolower(trim($request->email));
        $code = rand(100000, 999999);
        Cache::put('reset_' . $email, $code, now()->addMinutes(15));

        return response()->json([
            'message' => 'Code envoyé à ' . $email,
            'code'    => $code,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'code'     => 'required|digits:6',
            'password' => ['required', 'string', 'confirmed', Password::min(6)->letters()->numbers()],
            'password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = strtolower(trim($request->email));
        $cached = Cache::get('reset_' . $email);

        if (!$cached || (string) $cached !== (string) $request->code) {
            return response()->json(['message' => 'Code invalide ou expiré'], 400);
        }

        $user = User::where('email', $email)->first();
        $user->update(['password' => Hash::make($request->password)]);
        $user->tokens()->delete();
        Cache::forget('reset_' . $email);

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès']);
    }

    private function socialConfig(string $provider): ?array
    {
        $redirectUri = rtrim(config('app.url'), '/') . '/api/auth/social/' . $provider . '/callback';

        return match ($provider) {
            'google' => [
                'client_id'     => env('GOOGLE_CLIENT_ID'),
                'client_secret' => env('GOOGLE_CLIENT_SECRET'),
                'redirect_uri'  => env('GOOGLE_REDIRECT_URI', $redirectUri),
                'authorize_url' => 'https://accounts.google.com/o/oauth2/v2/auth',
                'token_url'     => 'https://oauth2.googleapis.com/token',
                'user_url'      => 'https://www.googleapis.com/oauth2/v3/userinfo',
                'scope'         => 'openid email profile',
            ],
            'microsoft' => [
                'client_id'     => env('MICROSOFT_CLIENT_ID'),
                'client_secret' => env('MICROSOFT_CLIENT_SECRET'),
                'redirect_uri'  => env('MICROSOFT_REDIRECT_URI', $redirectUri),
                'authorize_url' => 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                'token_url'     => 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                'user_url'      => 'https://graph.microsoft.com/oidc/userinfo',
                'scope'         => 'openid email profile',
            ],
            'apple' => [
                'client_id'     => env('APPLE_CLIENT_ID'),
                'client_secret' => $this->appleClientSecret(),
                'redirect_uri'  => env('APPLE_REDIRECT_URI', $redirectUri),
                'authorize_url' => 'https://appleid.apple.com/auth/authorize',
                'token_url'     => 'https://appleid.apple.com/auth/token',
                'user_url'      => null,
                'scope'         => 'name email',
            ],
            default => null,
        };
    }

    private function fetchSocialProfile(string $provider, string $code, array $config): array
    {
        $tokenResponse = Http::asForm()->post($config['token_url'], [
            'client_id'     => $config['client_id'],
            'client_secret' => $config['client_secret'],
            'code'          => $code,
            'grant_type'    => 'authorization_code',
            'redirect_uri'  => $config['redirect_uri'],
        ]);

        if (!$tokenResponse->successful()) {
            throw new \RuntimeException('token_exchange_failed');
        }

        $token = $tokenResponse->json();

        if ($provider === 'apple') {
            $claims = $this->jwtPayload($token['id_token'] ?? '');
            return [
                'email' => $claims['email'] ?? null,
                'name'  => $claims['email'] ? Str::before($claims['email'], '@') : null,
                'photo' => null,
            ];
        }

        $profileResponse = Http::withToken($token['access_token'] ?? '')->get($config['user_url']);
        if (!$profileResponse->successful()) {
            throw new \RuntimeException('profile_fetch_failed');
        }

        $profile = $profileResponse->json();

        return [
            'email' => $profile['email'] ?? $profile['preferred_username'] ?? null,
            'name'  => $profile['name'] ?? trim(($profile['given_name'] ?? '') . ' ' . ($profile['family_name'] ?? '')),
            'photo' => $profile['picture'] ?? null,
        ];
    }

    private function appleClientSecret(): ?string
    {
        $teamId = env('APPLE_TEAM_ID');
        $clientId = env('APPLE_CLIENT_ID');
        $keyId = env('APPLE_KEY_ID');
        $privateKey = str_replace('\\n', "\n", (string) env('APPLE_PRIVATE_KEY'));

        if (!$teamId || !$clientId || !$keyId || !$privateKey) {
            return null;
        }

        $header = $this->base64UrlEncode(json_encode(['alg' => 'ES256', 'kid' => $keyId]));
        $payload = $this->base64UrlEncode(json_encode([
            'iss' => $teamId,
            'iat' => time(),
            'exp' => time() + 86400 * 30,
            'aud' => 'https://appleid.apple.com',
            'sub' => $clientId,
        ]));

        openssl_sign($header . '.' . $payload, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $signature = $this->ecdsaDerToJose($signature, 64);

        return $header . '.' . $payload . '.' . $this->base64UrlEncode($signature);
    }

    private function ecdsaDerToJose(string $derSignature, int $partLength): string
    {
        $offset = 3;
        $rLength = ord($derSignature[$offset]);
        $r = substr($derSignature, $offset + 1, $rLength);
        $offset += $rLength + 2;
        $sLength = ord($derSignature[$offset]);
        $s = substr($derSignature, $offset + 1, $sLength);

        $r = str_pad(ltrim($r, "\x00"), $partLength / 2, "\x00", STR_PAD_LEFT);
        $s = str_pad(ltrim($s, "\x00"), $partLength / 2, "\x00", STR_PAD_LEFT);

        return $r . $s;
    }

    private function jwtPayload(string $jwt): array
    {
        $parts = explode('.', $jwt);
        if (count($parts) < 2) {
            return [];
        }

        return json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true) ?: [];
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function frontendUrl(string $path): string
    {
        return rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/') . $path;
    }
}
