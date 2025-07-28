# Configuration CI/CD GitHub Actions pour TestFlight

Ce guide explique comment configurer le déploiement automatique sur TestFlight via GitHub Actions.

## Prérequis

1. **Compte Apple Developer** avec accès à App Store Connect
2. **Repository GitHub** avec ton projet
3. **App Store Connect API Key** (recommandé) ou Apple ID avec 2FA

## 1. Configuration des Secrets GitHub

### Méthode 1 : App Store Connect API Key (Recommandée)

Va dans **Settings > Secrets and variables > Actions** de ton repository GitHub et ajoute :

#### Secrets requis :
- `APP_STORE_CONNECT_API_KEY_ID` - ID de ta clé API
- `APP_STORE_CONNECT_API_ISSUER_ID` - Issuer ID de ta clé API  
- `APP_STORE_CONNECT_API_KEY` - Contenu de ta clé API (fichier .p8)

### Méthode 2 : Apple ID (Alternative)

Si tu préfères utiliser ton Apple ID :
- `FASTLANE_APPLE_ID` - Ton Apple ID
- `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD` - Mot de passe spécifique à l'app

## 2. Configuration App Store Connect API Key

### Créer une clé API :
1. Va sur [App Store Connect](https://appstoreconnect.apple.com)
2. **Users and Access** > **Keys** > **Generate API Key**
3. Donne un nom à ta clé (ex: "GitHub Actions")
4. Sélectionne **App Manager** ou **Developer** selon tes besoins
5. Télécharge le fichier .p8

### Récupérer les informations :
- **Key ID** : Visible dans App Store Connect
- **Issuer ID** : Visible dans App Store Connect  
- **Key** : Contenu du fichier .p8 téléchargé

## 3. Configuration des Certificats

### Gestion manuelle des certificats :
1. **Installer les certificats** dans Xcode
2. **Configurer le provisioning profile** dans Xcode
3. **Vérifier le Team** dans les paramètres du projet

### Vérifications dans Xcode :
- Bundle Identifier correct
- Team sélectionné
- Certificats de distribution installés
- Provisioning profile App Store configuré

## 4. Configuration de l'App

### Mettre à jour Appfile :
```ruby
# ios/fastlane/Appfile
app_identifier("com.carpeapp.ios")
apple_id("ton-apple-id@example.com")
itc_team_id("123456789") # Team ID App Store Connect
team_id("ABC123DEF4") # Team ID Developer Portal
```

### Vérifier le Bundle Identifier :
Dans Xcode, vérifie que le Bundle Identifier correspond à `com.carpeapp.ios`.

## 5. Test du Workflow

### Test local :
```bash
# Installer Fastlane
gem install fastlane

# Tester le build localement
cd ios
fastlane beta
```

### Test sur GitHub :
1. Push sur la branche `main` ou `master`
2. Vérifier l'exécution dans **Actions** de ton repository
3. Vérifier l'upload dans App Store Connect

## 6. Workflow Détaillé

### Ce qui se passe à chaque push sur main/master :

1. **Tests** (Ubuntu) :
   - Checkout du code
   - Installation des dépendances
   - Exécution des tests unitaires

2. **Build et Deploy** (macOS) :
   - Checkout du code
   - Installation des dépendances
   - Configuration en mode production
   - Build de l'app iOS
   - Upload vers TestFlight

### Conditions de déclenchement :
- Push sur `main` ou `master`
- Tests réussis
- Pas de pull request (déploiement uniquement sur push direct)

## 7. Dépannage

### Erreurs courantes :

#### "No provisioning profiles found"
- Vérifier que les certificats sont bien installés dans Xcode
- Vérifier le `team_id` dans Appfile

#### "Build failed"
- Vérifier que l'app compile localement
- Vérifier les dépendances iOS (pods)

#### "Upload failed"
- Vérifier les credentials App Store Connect
- Vérifier que l'app est bien configurée dans App Store Connect

### Logs utiles :
- **Actions** > **Workflow** > **Job** > **Step** pour voir les logs détaillés
- `fastlane beta --verbose` pour tester localement

## 8. Optimisations

### Cache des dépendances :
Le workflow utilise le cache npm pour accélérer les builds.

### Builds parallèles :
Les tests et le build sont séparés pour optimiser le temps d'exécution.

## 9. Sécurité

### Bonnes pratiques :
- Utiliser des API Keys plutôt que des mots de passe
- Secrets chiffrés dans GitHub
- Permissions minimales sur les API Keys

### Rotation des clés :
- Renouveler les API Keys régulièrement
- Surveiller l'utilisation des clés dans App Store Connect

## Support

Pour toute question ou problème :
- [Documentation Fastlane](https://docs.fastlane.tools/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi) 