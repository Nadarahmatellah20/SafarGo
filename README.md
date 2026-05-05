# SafarGo — Laravel + React + MySQL

## Structure du projet

```
safarGo-laravel/
├── backend/     → API Laravel 11 (PHP + MySQL)
├── frontend/    → Application React (Vite + TypeScript)
└── README.md
```

---

## Prérequis

| Outil | Version | Téléchargement |
|-------|---------|----------------|
| **PHP** | 8.2+ | https://www.php.net |
| **Composer** | 2.x | https://getcomposer.org |
| **Node.js** | 18+ | https://nodejs.org |
| **MySQL** | 8.x | Via XAMPP → https://www.apachefriends.org |

> **Conseil Windows** : Installez XAMPP pour avoir PHP + MySQL en un seul package.

---

## Étape 1 — Créer la base de données MySQL

Ouvrez **phpMyAdmin** (XAMPP) ou MySQL Workbench et créez la base :

```sql
CREATE DATABASE safarGo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Étape 2 — Configurer le Backend Laravel

Ouvrez un terminal dans le dossier `backend/` :

```bash
# 1. Installer les dépendances PHP
composer install

# 2. Copier le fichier de configuration
copy .env.example .env

# 3. Générer la clé de l'application
php artisan key:generate

# 4. Configurer MySQL dans .env
#    Ouvrez le fichier .env et modifiez :
#    DB_DATABASE=safarGo
#    DB_USERNAME=root
#    DB_PASSWORD=         (vide si XAMPP par défaut)

# 5. Créer les tables + insérer les données
php artisan migrate --seed

# 6. Lancer le serveur API
php artisan serve
```

✅ L'API est disponible sur **http://localhost:8000**

---

## Étape 3 — Lancer le Frontend React

Ouvrez un **nouveau terminal** dans le dossier `frontend/` :

```bash
npm install
npm run dev
```

✅ L'application s'ouvre sur **http://localhost:5173**

---

## Routes API disponibles

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | /api/auth/register | Non | Inscription |
| POST | /api/auth/login | Non | Connexion |
| POST | /api/auth/logout | Oui | Déconnexion |
| GET | /api/auth/user | Oui | Profil utilisateur |
| PUT | /api/auth/user | Oui | Modifier le profil |
| POST | /api/auth/forgot-password | Non | Code de réinitialisation |
| POST | /api/auth/reset-password | Non | Nouveau mot de passe |
| GET | /api/voyages | Oui | Liste des 10 destinations |
| GET | /api/voyages/{id} | Oui | Détail d'un voyage |
| GET | /api/reservations | Oui | Mes réservations |
| POST | /api/reservations | Oui | Créer une réservation |
| PUT | /api/reservations/{id}/cancel | Oui | Annuler |
| DELETE | /api/reservations/{id} | Oui | Supprimer |
| GET | /api/paiements/methods | Oui | Mes cartes |
| POST | /api/paiements/methods | Oui | Ajouter une carte |
| DELETE | /api/paiements/methods/{id} | Oui | Supprimer une carte |
| POST | /api/paiements/pay | Oui | Payer une réservation |
| GET | /api/paiements/history | Oui | Historique des paiements |

---

## Structure Laravel

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php
│   │   ├── VoyageController.php
│   │   ├── ReservationController.php
│   │   └── PaiementController.php
│   └── Models/
│       ├── User.php
│       ├── Voyage.php
│       ├── Reservation.php
│       ├── Paiement.php
│       └── PaiementMethod.php
├── database/
│   ├── migrations/          ← Tables MySQL
│   └── seeders/             ← 10 destinations pré-chargées
├── routes/
│   └── api.php              ← Toutes les routes API
└── .env                     ← Configuration MySQL
```
