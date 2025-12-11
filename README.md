# CoopHub - Login Page

> Page de connexion SPA sécurisée avec React + Node.js

## 📋 Consigne

Ce projet répond à l'exercice technique demandant de :
1. ✅ Mettre en œuvre le HTML/SASS pour une page de login
2. ✅ L'intégrer dans un framework JavaScript (React) en SPA
3. ✅ Réaliser le formulaire et envoyer les données vers un backend (HTTP POST)
4. ✅ Développer un backend pour récupérer ces données et les afficher en log

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation et lancement

```bash
# Cloner le projet
git clone <url-du-repo>
cd CoopHub_test

# Lancer les deux serveurs (bash)
./start.sh

# OU manuellement :

# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### URLs
- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:4000
- **API Login** : POST http://localhost:4000/api/login

## 🔐 Compte de test

```
Username : admin
Email : admin@example.com
Mot de passe : abcde123
```

## 🛠️ Stack technique

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18.3 | Framework SPA |
| TypeScript | 5.6 | Typage strict |
| Vite | 5.4 | Build tool |
| SASS | - | Styles |

### Backend
| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 18+ | Runtime |
| Express | 4.21 | Framework HTTP |
| bcryptjs | 2.4 | Hachage mots de passe |
| jsonwebtoken | 9.0 | Tokens JWT |
| Winston | 3.17 | Logging |

## 🔒 Sécurité implémentée

- **Hachage bcrypt** : mots de passe stockés de manière sécurisée
- **JWT** : tokens signés avec expiration
- **Rate limiting** : 
  - 20 requêtes/min par IP
  - 5 tentatives/5min par identifiant
- **Validation** : protection XSS, SQL injection, NoSQL injection
- **CORS** : configuré pour le frontend uniquement

## 📁 Structure du projet

```
CoopHub_test/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── api/             # Appels API
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages (LoginPage)
│   │   ├── styles/          # SASS (variables, global, composants)
│   │   ├── types/           # Types TypeScript
│   │   └── utils/           # Utilitaires (validation, storage)
│   └── ...
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── controllers/     # Contrôleurs HTTP
│   │   ├── services/        # Logique métier
│   │   ├── repositories/    # Accès aux données
│   │   ├── middleware/      # Auth, rate limit, errors
│   │   └── utils/           # Logger, sécurité
│   ├── logs/                # Logs Winston
│   └── ...
│
└── consignes/               # Énoncé de l'exercice
```

## 📊 Logs

Les logs sont enregistrés dans `backend/logs/` :
- `combined.log` : tous les logs
- `error.log` : erreurs uniquement

Format des logs :
```
2025-01-15 10:30:00 [info]: Tentative de connexion pour: admin@example.com
2025-01-15 10:30:00 [info]: Connexion réussie pour: admin@example.com
```

## 🧪 Tests de sécurité

Le projet a été testé contre :
- ✅ XSS (8 patterns bloqués)
- ✅ SQL Injection (7 patterns bloqués)
- ✅ NoSQL Injection (3 patterns bloqués)
- ✅ Command Injection (5 patterns bloqués)
- ✅ Path Traversal (3 patterns bloqués)

## 📝 API

### POST /api/login

**Request :**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (succès) :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@example.com"
  }
}
```

**Response (erreur) :**
```json
{
  "success": false,
  "error": "Identifiants invalides"
}
```

## 📄 License

MIT License - voir [LICENSE](LICENSE)
