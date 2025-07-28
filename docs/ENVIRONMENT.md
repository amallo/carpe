# Configuration des Environnements

Ce document explique comment configurer et utiliser les différents environnements dans l'application CarpeApp.

## Vue d'ensemble

L'application utilise un système de configuration basé sur des variables d'environnement pour basculer entre les modes développement et production. Cela permet de :

- Utiliser des providers simulés en développement
- Utiliser des providers réels en production
- Contrôler les logs de débogage
- Configurer les URLs d'API

## Variables d'environnement

### USE_MOCK_PROVIDERS
- `true` : Utilise les providers simulés (InMemoryPeerProvider, GrantedPermissionProvider)
- `false` : Utilise les providers réels (BLEPeerProvider, NativePermissionProvider)

### ENABLE_DEBUG_LOGS
- `true` : Active les logs de débogage détaillés
- `false` : Désactive les logs de débogage

### API_BASE_URL
- URL de base pour les appels API

## Scripts disponibles

### Initialisation
```bash
./scripts/init-env.sh
```
Crée le fichier `.env` avec la configuration de développement par défaut.

### Changement d'environnement
```bash
# Mode développement (providers simulés)
./scripts/switch-env.sh dev

# Mode production (providers réels)
./scripts/switch-env.sh prod
```

## Utilisation avec Xcode

**IMPORTANT** : Pour que les changements prennent effet dans Xcode, vous devez :

1. **Nettoyer le build** : Product > Clean Build Folder
2. **Redémarrer Xcode**
3. **Rebuild le projet**

### Étapes détaillées

1. Exécutez le script de changement d'environnement :
   ```bash
   ./scripts/switch-env.sh dev
   ```

2. Dans Xcode :
   - Allez dans le menu `Product`
   - Sélectionnez `Clean Build Folder` (ou utilisez `Cmd+Shift+K`)
   - Fermez Xcode complètement
   - Rouvrez le projet
   - Build le projet (`Cmd+B`)

3. Vérifiez que la configuration est appliquée en regardant les logs de l'application.

## Vérification de la configuration

Vous pouvez vérifier quelle configuration est active en regardant les logs de l'application :

- **Mode développement** : Vous verrez des messages comme "Using InMemoryPeerProvider for development"
- **Mode production** : Vous verrez des messages comme "Using BLEPeerProvider for production"

## Structure des fichiers

```
carpeApp/
├── .env                    # Variables d'environnement (ignoré par git)
├── env.example            # Modèle de configuration
├── scripts/
│   ├── init-env.sh       # Script d'initialisation
│   └── switch-env.sh     # Script de changement d'environnement
└── src/
    ├── app/
    │   └── config/
    │       └── environment.ts  # Configuration TypeScript
    └── types/
        └── env.d.ts       # Types pour les variables d'environnement
```

## Dépannage

### Les changements ne prennent pas effet dans Xcode

1. Vérifiez que le fichier `.env` a été créé/modifié
2. Nettoyez le build dans Xcode (Product > Clean Build Folder)
3. Redémarrez Xcode
4. Rebuild le projet

### Erreur "Cannot resolve module '@env'"

1. Vérifiez que `react-native-dotenv` est installé
2. Vérifiez que la configuration Babel est correcte
3. Redémarrez le bundler Metro : `npx react-native start --reset-cache`

### Variables d'environnement non définies

1. Vérifiez que le fichier `.env` existe à la racine du projet
2. Vérifiez la syntaxe du fichier `.env` (pas d'espaces autour du `=`)
3. Redémarrez le bundler Metro 