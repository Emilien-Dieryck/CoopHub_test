# CoopHub Frontend

Application React TypeScript moderne pour la page de connexion CoopHub.

## 🚀 Stack Technique

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **SASS** - Préprocesseur CSS
- **Fetch API** - Appels HTTP

## 📁 Structure du Projet

```
src/
├── api/
│   └── authApi.ts           # API d'authentification
├── assets/
│   ├── logo.png             # Logo CoopHub
│   └── background.png       # Image de fond
├── components/
│   ├── Input.tsx            # Composant Input réutilisable
│   └── Input.scss           # Styles du composant Input
├── hooks/
│   └── useForm.ts           # Hook de gestion de formulaire
├── pages/
│   └── LoginPage/
│       ├── LoginPage.tsx    # Page de connexion
│       └── LoginPage.scss   # Styles de la page
├── styles/
│   ├── _variables.scss      # Variables SASS (couleurs, espacements)
│   └── global.scss          # Styles globaux
├── types.ts                 # Types TypeScript
├── App.tsx                  # Composant principal
└── main.tsx                 # Point d'entrée React
```

## 🔧 Installation

```bash
# Installer les dépendances
npm install
```

## 🚀 Démarrage

```bash
# Lancer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:5173
```

## 🏗️ Build

```bash
# Créer un build de production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 🔐 Fonctionnalités

### Sécurité
- ✅ **Input sanitization** - Suppression caractères dangereux
- ✅ **XSS protection** - Escaping HTML lors de l'affichage
- ✅ **Rate limiting** - Max 5 tentatives de connexion
- ✅ **Request timeout** - 10 secondes maximum
- ✅ **Secure storage** - Wrapper localStorage avec error handling
- ✅ **Validation stricte** - Regex patterns et contraintes de longueur

### Fonctionnalités Utilisateur
- ✅ Formulaire de connexion avec validation temps réel
- ✅ Gestion des erreurs (frontend et backend)
- ✅ Design moderne et responsive
- ✅ Animations et transitions fluides
- ✅ Architecture modulaire et scalable
- ✅ Hook personnalisé pour formulaires
- ✅ Composants réutilisables et accessibles (ARIA)

## 🎨 Design

Design basé sur les maquettes fournies :
- Layout deux colonnes (60% / 40%)
- Section gauche avec gradient bleu, logo, et illustration
- Section droite avec formulaire centré
- Messages d'erreur contextuels
- Écran de succès après connexion
- Animations fluides

## 🔌 API Backend

Le frontend communique avec le backend configuré via `.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

**Endpoint:**
```
POST /api/login
```

**Payload:**
```json
{
  "identifier": "john_doe",
  "password": "john123"
}
```

**Réponse succès:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Réponse erreur:**
```json
{
  "error": "Invalid credentials"
}
```

## 📚 Documentation

- **[SECURITY.md](./SECURITY.md)** - Architecture et bonnes pratiques de sécurité
- **JSDoc inline** - Documentation complète dans le code

### Fichiers Clés

| Fichier | Description |
|---------|-------------|
| `config/constants.ts` | Configuration centralisée (API, validation, erreurs) |
| `utils/validation.ts` | Validation et sanitization des entrées |
| `utils/security.ts` | Rate limiting, XSS protection, helpers |
| `utils/storage.ts` | Wrapper sécurisé pour localStorage |
| `hooks/useForm.ts` | Hook réutilisable de gestion de formulaire |
| `api/authApi.ts` | Appels API avec timeout et error handling |

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Serveur de développement (port 5173)
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Linter le code (si configuré)
```

## 🧪 Tests de Sécurité

### Test Rate Limiting
1. Tenter 5 connexions échouées successives
2. Vérifier le message "Trop de tentatives"
3. Attendre 5 minutes ou recharger la page

### Test XSS
1. Tenter d'injecter `<script>alert('XSS')</script>` dans identifier
2. Vérifier que le script est sanitizé/échappé
3. Aucun script ne doit s'exécuter

### Test Validation
1. Tenter identifier avec moins de 3 caractères → erreur
2. Tenter password avec moins de 4 caractères → erreur
3. Tenter caractères invalides (`<`, `>`, etc.) → supprimés

## 🌐 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (2 dernières versions)
- **Responsive** : Mobile (320px+), tablette, desktop
- **Accessibilité** : WCAG 2.1 Level AA (ARIA labels, keyboard navigation)

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env` à la racine du frontend :

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:4000/api

# Storage Keys (optionnel, valeurs par défaut disponibles)
VITE_TOKEN_STORAGE_KEY=authToken
VITE_USER_STORAGE_KEY=userData
```

### Constantes de Sécurité

Modifiables dans `src/config/constants.ts` :

```typescript
SECURITY_CONFIG: {
  MAX_LOGIN_ATTEMPTS: 5,           // Tentatives avant verrouillage
  LOCKOUT_DURATION: 5 * 60 * 1000, // Durée de verrouillage (ms)
}

VALIDATION_RULES: {
  IDENTIFIER: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
  },
  PASSWORD: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 128,
  },
}
```

## 📝 Notes Importantes

- **Sécurité** : La validation frontend est complétée par la validation backend
- **Tokens** : Stockés en localStorage (considérer httpOnly cookies en production)
- **HTTPS** : Obligatoire en production pour protéger les credentials
- **CSP** : Configurer Content Security Policy sur le serveur
- **CORS** : Le backend doit autoriser l'origine frontend

## 🚀 Prochaines Améliorations

- [ ] Tests unitaires (Vitest + React Testing Library)
- [ ] Tests E2E (Playwright/Cypress)
- [ ] CAPTCHA après 3 tentatives
- [ ] Authentification à deux facteurs (2FA)
- [ ] Mode sombre
- [ ] Internationalisation (i18n)
- [ ] Service Worker pour cache
- [ ] Code splitting avec React.lazy
