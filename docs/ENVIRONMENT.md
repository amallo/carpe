# Configuration des Environnements

Ce document décrit les variables d'environnement disponibles pour configurer l'application CarpeApp.

## Variables d'Environnement Disponibles

### Configuration des Providers

#### `USE_MOCK_PROVIDERS`
- **Type**: `boolean`
- **Valeurs**: `true` | `false`
- **Défaut**: `true` en mode `__DEV__`, `false` en mode production
- **Description**: Contrôle l'utilisation des providers simulés vs réels

**Comportement**:
- `true` : Utilise `InMemoryPeerProvider` et `GrantedPermissionProvider`
- `false` : Utilise `BLEPeerProvider` et `NativePermissionProvider`

### Configuration des API

#### `API_BASE_URL`
- **Type**: `string`
- **Défaut**: `https://api.carpeapp.com`
- **Description**: URL de base pour les appels API

### Configuration des Logs

#### `DEBUG_LOGS`
- **Type**: `boolean`
- **Valeurs**: `true` | `false`
- **Défaut**: `true` en mode `__DEV__`, `false` en mode production
- **Description**: Active/désactive les logs de débogage détaillés

### Configuration des Fonctionnalités

#### `ENABLE_ANALYTICS`
- **Type**: `boolean`
- **Valeurs**: `true` | `false`
- **Défaut**: `false` en mode `__DEV__`, `true` en mode production
- **Description**: Active/désactive les analytics (Firebase, etc.)

#### `ENABLE_CRASH_REPORTING`
- **Type**: `boolean`
- **Valeurs**: `true` | `false`
- **Défaut**: `false` en mode `__DEV__`, `true` en mode production
- **Description**: Active/désactive le crash reporting

## Utilisation

### Méthode 1 : Variables d'environnement système

```bash
# Définir une variable pour la session courante
export USE_MOCK_PROVIDERS=false

# Lancer l'application
npx react-native run-ios
```

### Méthode 2 : Script de basculement

```bash
# Basculer vers le mode développement
./scripts/switch-env.sh dev

# Basculer vers le mode production
./scripts/switch-env.sh prod
```

### Méthode 3 : Fichier .env

Créer un fichier `.env` à la racine du projet :

```env
USE_MOCK_PROVIDERS=true
API_BASE_URL=https://api.carpeapp.com
DEBUG_LOGS=true
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false
```

## Configuration par Environnement

### Développement Local
```env
USE_MOCK_PROVIDERS=true
DEBUG_LOGS=true
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false
```

### Tests
```env
USE_MOCK_PROVIDERS=true
DEBUG_LOGS=true
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false
```

### Staging
```env
USE_MOCK_PROVIDERS=false
DEBUG_LOGS=true
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
```

### Production
```env
USE_MOCK_PROVIDERS=false
DEBUG_LOGS=false
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
```

## Intégration dans le Code

Les variables d'environnement sont accessibles via le fichier `src/app/config/environment.ts` :

```typescript
import { ENV, useMockProviders, debugLog } from '../config/environment';

// Vérifier l'environnement
if (useMockProviders()) {
    debugLog('Utilisation des providers simulés');
}

// Accéder aux variables
console.log('API URL:', ENV.API_BASE_URL);
```

## Bonnes Pratiques

1. **Ne jamais commiter de secrets** dans les fichiers de configuration
2. **Utiliser des valeurs par défaut** pour les variables optionnelles
3. **Documenter les nouvelles variables** dans ce fichier
4. **Tester les configurations** sur différents environnements
5. **Utiliser le script de basculement** pour éviter les erreurs de configuration

## Dépannage

### Variable non prise en compte
- Redémarrer l'application après modification
- Vérifier la syntaxe de la variable
- S'assurer que la variable est bien exportée

### Configuration inattendue
- Vérifier les valeurs par défaut dans `environment.ts`
- Contrôler l'ordre de priorité des variables
- Utiliser les logs de débogage pour diagnostiquer 