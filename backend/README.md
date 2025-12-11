# CoopHub Backend

API REST Node.js sécurisée pour l'authentification.

## 🚀 Stack Technique

- **Node.js 18+** - Runtime JavaScript
- **Express 4** - Framework HTTP
- **bcryptjs** - Hachage de mots de passe
- **jsonwebtoken** - Tokens JWT
- **Winston** - Logging professionnel
- **dotenv** - Variables d'environnement

## 📁 Structure du Projet

```
src/
├── controllers/
│   └── authController.js    # Contrôleur d'authentification
├── services/
│   └── authService.js       # Logique métier
├── repositories/
│   └── userRepository.js    # Accès aux données utilisateurs
├── middleware/
│   ├── authMiddleware.js    # Vérification JWT
│   ├── rateLimitMiddleware.js # Rate limiting (IP + identifiant)
│   └── errorHandler.js      # Gestion centralisée des erreurs
├── utils/
│   ├── logger.js            # Configuration Winston
│   └── securityUtils.js     # Validation, bcrypt helpers
├── data/
│   └── users.js             # Utilisateurs (mock database)
├── exceptions/
│   ├── BadRequestError.js   # Erreur 400
│   └── UnauthorizedError.js # Erreur 401
├── routes/
│   └── authRoutes.js        # Routes /api/login
├── app.js                   # Configuration Express
└── server.js                # Point d'entrée

logs/
└── backend.log                # Logs Winston

tests/
├── test-bcrypt.js           # Test hachage
├── test-repository.js       # Test accès données
├── test-service.js          # Test logique métier
├── test-security-utils.js   # Test validation
└── test-integration.js      # Tests API complets
```

## 🔧 Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

## 🚀 Démarrage

```bash
# Développement (avec watch)
npm run dev

# Production
npm start

# Le serveur sera disponible sur http://localhost:4000
```

## 🔐 Sécurité Implémentée

| Fonctionnalité | Description |
|----------------|-------------|
| **bcrypt** | Hachage des mots de passe (10 rounds) |
| **JWT** | Tokens signés avec expiration 24h |
| **Rate Limiting IP** | 20 requêtes/minute par IP |
| **Rate Limiting Login** | 5 tentatives/5min par identifiant |
| **Validation** | Protection XSS, SQL injection, NoSQL injection |
| **CORS** | Configuré pour le frontend uniquement |
| **Helmet** | Headers de sécurité HTTP |

## 📝 API

### Health Check

```
GET /api/health
```

**Réponse :**
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T10:00:00.000Z"
}
```

### Login

```
POST /api/login
Content-Type: application/json
```

**Payload :**
```json
{
  "identifier": "john_doe",
  "password": "john123"
}
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Réponse erreur (401) :**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Rate limit dépassé (429) :**
```json
{
  "success": false,
  "error": "Too many login attempts. Try again later."
}
```

## 👤 Comptes de Test

| Username | Email | Password |
|----------|-------|----------|
| john_doe | john@example.com | john123 |
| jane_smith | jane@example.com | jane456 |
| admin | admin@example.com | admin123 |

## 📊 Logs

Les logs sont enregistrés dans `logs/` :

```
2025-12-11 10:30:00 [info]: Server running on port 4000
2025-12-11 10:30:05 [info]: Login attempt for: john_doe
2025-12-11 10:30:05 [info]: Login successful for: john_doe
2025-12-11 10:30:10 [warn]: Invalid credentials for: unknown_user
2025-12-11 10:30:15 [warn]: Rate limit exceeded for IP: 192.168.1.1
```

## 🧪 Tests

```bash
# Lancer tous les tests
node tests/test-integration.js

# Tests individuels
node tests/test-bcrypt.js
node tests/test-repository.js
node tests/test-service.js
node tests/test-security-utils.js
```

## ⚙️ Configuration

### Variables d'Environnement (.env)

```bash
# Serveur
PORT=4000

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

## 🛠️ Scripts Disponibles

```bash
npm start    # Lancer en production
npm run dev  # Lancer en développement (watch mode)
```

## 📝 Notes

- Les mots de passe sont hachés avec bcrypt (10 rounds)
- Les tokens JWT expirent après 24 heures
- Le rate limiting se réinitialise automatiquement
