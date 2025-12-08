# CoopHub Frontend - Architecture & Sécurité

## 🏗️ Architecture

### Structure des Dossiers

```
src/
├── api/              # Couche API - Appels HTTP
├── components/       # Composants réutilisables
├── config/          # Configuration & constantes
├── hooks/           # Custom React hooks
├── pages/           # Pages/écrans de l'application
├── styles/          # Fichiers SASS
├── utils/           # Utilitaires & helpers
│   ├── validation.ts    # Validation d'entrées
│   ├── security.ts      # Sécurité & rate limiting
│   └── storage.ts       # Gestion sécurisée du stockage
└── types.ts         # Définitions TypeScript
```

### Séparation des Responsabilités (SoC)

1. **API Layer** (`api/`) : Communication avec le backend
2. **Business Logic** (`hooks/`, `utils/`) : Logique métier réutilisable
3. **Presentation** (`components/`, `pages/`) : Interface utilisateur
4. **Configuration** (`config/`) : Constantes et paramètres centralisés

---

## 🔒 Sécurité

### Protection XSS (Cross-Site Scripting)

#### 1. Sanitization des Entrées
```typescript
// utils/validation.ts
export const sanitizeInput = (input: string): string => {
  return input.replace(SECURITY_CONFIG.FORBIDDEN_CHARS, '').trim();
};
```

**Utilisation** : Tous les champs utilisateur sont sanitizés avant envoi au backend.

#### 2. Escaping HTML
```typescript
// utils/security.ts
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
```

**Utilisation** : Les données utilisateur affichées sont échappées (username, email).

### Rate Limiting

Protection contre les attaques par force brute :

- **Maximum 5 tentatives** de connexion
- **Verrouillage temporaire** de 5 minutes après dépassement
- Tracking en mémoire par identifiant utilisateur

```typescript
// Vérification avant login
const { isLocked, remainingTime } = checkLoginAttempts(identifier);
if (isLocked) {
  // Afficher message d'erreur avec temps restant
}

// Après échec
recordFailedAttempt(identifier);

// Après succès
clearLoginAttempts(identifier);
```

### Gestion Sécurisée du Stockage

Wrapper autour de `localStorage` avec :

- **Gestion d'erreurs** : Ne plante pas si localStorage indisponible
- **Type safety** : Parsing JSON automatique avec types
- **Clés centralisées** : Via variables d'environnement

```typescript
// ❌ Mauvais
localStorage.setItem('token', token);

// ✅ Bon
import { setAuthToken } from '../utils/storage';
setAuthToken(token);
```

### Timeout des Requêtes

Protection contre les attaques slowloris :

```typescript
const { signal, cleanup } = createTimeoutSignal(10000); // 10 secondes
fetch(url, { signal });
```

### Validation des Entrées

#### Règles de Validation

| Champ | Min | Max | Pattern |
|-------|-----|-----|---------|
| Identifier | 3 | 50 | `^[a-zA-Z0-9._@-]+$` |
| Password | 4 | 128 | - |
| Email | - | - | Format email standard |

#### Caractères Interdits

```typescript
FORBIDDEN_CHARS: /<|>|&lt;|&gt;|javascript:|onerror=|onclick=/gi
```

---

## 🎯 Bonnes Pratiques

### TypeScript

- **Typage strict** : Toutes les fonctions et variables typées
- **Interfaces** : Types réutilisables dans `types.ts`
- **Génériques** : Hook `useForm<T>` pour flexibilité

### React

- **Hooks personnalisés** : Logique réutilisable (`useForm`)
- **Composants fonctionnels** : Avec `React.FC`
- **Props destructurées** : Lisibilité améliorée
- **ARIA attributes** : Accessibilité (rôles, labels)

### SASS

- **Variables** : Couleurs, tailles centralisées (`variables.scss`)
- **@use** : Syntaxe moderne (pas `@import`)
- **BEM-like** : Classes descriptives (`login-form-container`)

### Sécurité Frontend

1. ✅ **Ne jamais exposer de secrets** dans le code
2. ✅ **Variables d'environnement** pour configuration
3. ✅ **Validation côté client ET serveur**
4. ✅ **Sanitization avant envoi**
5. ✅ **Escaping lors de l'affichage**
6. ✅ **Rate limiting**
7. ✅ **HTTPS uniquement** en production
8. ✅ **Pas de console.log sensible** (mots de passe, tokens)

### Configuration Environnement

```bash
# .env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_TOKEN_STORAGE_KEY=authToken
VITE_USER_STORAGE_KEY=userData
```

**Avantages** :
- Changement facile selon environnement (dev/staging/prod)
- Pas de valeurs hardcodées
- Sécurité accrue

---

## 📝 JSDoc

Toutes les fonctions ont une documentation complète :

```typescript
/**
 * Authenticates user with provided credentials
 * 
 * @param credentials - User login credentials
 * @returns Promise resolving to login response
 * @throws {ApiError} If authentication fails
 * 
 * @example
 * const response = await login({ identifier: 'john', password: 'pass' });
 */
```

**Bénéfices** :
- Autocomplétion IDE améliorée
- Documentation générée automatiquement
- Compréhension rapide du code

---

## 🧪 Validation

### Côté Frontend

```typescript
// Validation immédiate
const error = validateIdentifier(input);
if (error) {
  setErrors({ identifier: error });
}
```

### Côté Backend

```javascript
// Double validation pour sécurité
if (!identifier || !password) {
  throw new BadRequestError('Champs requis');
}
```

**Principe** : Ne jamais faire confiance aux données du client.

---

## 🚀 Points Clés pour l'Interview

### Architecture

> **Question** : "Pourquoi cette séparation des dossiers ?"

**Réponse** : 
- Séparation des préoccupations (SoC)
- Facilite les tests unitaires
- Code réutilisable et maintenable
- Évolutivité simplifiée

### Sécurité

> **Question** : "Comment protégez-vous contre XSS ?"

**Réponse** :
1. **Sanitization** : Suppression caractères dangereux à l'entrée
2. **Escaping** : Échappement HTML à l'affichage
3. **Validation** : Regex strictes sur formats attendus
4. **CSP** : Content Security Policy (configuration serveur)

> **Question** : "Comment gérez-vous les attaques par force brute ?"

**Réponse** :
- Rate limiting côté frontend (5 tentatives max)
- Verrouillage temporaire (5 minutes)
- Devrait être complété par rate limiting backend
- Captcha après X tentatives (amélioration future)

### Performance

> **Question** : "Optimisations frontend ?"

**Réponse** :
- Timeout sur requêtes HTTP (10s)
- Pas de re-renders inutiles (useState bien placés)
- Lazy loading possible (React.lazy)
- SASS minifié en production

### TypeScript

> **Question** : "Avantages de TypeScript ?"

**Réponse** :
- Détection erreurs à la compilation
- Autocomplétion IDE puissante
- Refactoring sûr
- Documentation vivante (types = documentation)
- Moins de bugs en production

---

## 🔧 Améliorations Futures

### Sécurité
- [ ] CAPTCHA après 3 tentatives échouées
- [ ] 2FA (authentification à deux facteurs)
- [ ] CSP Headers configuration
- [ ] Subresource Integrity (SRI)

### Performance
- [ ] Code splitting (React.lazy)
- [ ] Service Worker pour cache
- [ ] Image optimization
- [ ] CDN pour assets statiques

### UX
- [ ] Mode sombre
- [ ] Internationalisation (i18n)
- [ ] Animations fluides
- [ ] Messages d'erreur contextuels

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
