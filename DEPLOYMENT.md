# Guide de Déploiement - CarpeApp

Ce guide explique comment configurer et déployer l'application CarpeApp pour différents environnements.

## Configuration des Environnements

### Développement (par défaut)
En mode développement (`__DEV__ = true`), l'application utilise :
- `InMemoryPeerProvider` - Fournisseur de données simulées pour les tests
- `GrantedPermissionProvider` - Permissions automatiquement accordées
- Logs de débogage activés

### Production
En mode production (`__DEV__ = false`), l'application utilise :
- `BLEPeerProvider` - Fournisseur Bluetooth réel
- `NativePermissionProvider` - Gestion native des permissions
- Logs de débogage désactivés

## Variables d'Environnement

### Configuration des Providers
```bash
# Forcer l'utilisation des providers de production même en développement
USE_MOCK_PROVIDERS=false

# Utiliser les providers de développement (par défaut en __DEV__)
USE_MOCK_PROVIDERS=true
```

### Configuration des API
```bash
# URL de l'API (optionnel)
API_BASE_URL=https://api.carpeapp.com
```

## Déploiement iOS

### 1. Préparation
```bash
# Installer les dépendances
npm install

# Installer les pods iOS
cd ios && pod install && cd ..
```

### 2. Configuration Xcode
1. Ouvrir `ios/carpeApp.xcworkspace`
2. Vérifier le "Team" dans "Signing & Capabilities"
3. Incrémenter le numéro de version et build
4. S'assurer que les icônes sont présentes dans `Images.xcassets/AppIcon.appiconset/`

### 3. Build pour TestFlight
```bash
# Clean build
cd ios && xcodebuild clean -workspace carpeApp.xcworkspace -scheme carpeApp

# Archive pour TestFlight
xcodebuild archive -workspace carpeApp.xcworkspace -scheme carpeApp -archivePath carpeApp.xcarchive
```

### 4. Upload vers App Store Connect
1. Ouvrir Xcode Organizer
2. Sélectionner l'archive créée
3. Cliquer "Distribute App" > "App Store Connect" > "Upload"
4. Suivre les étapes de validation

## Déploiement Android

### 1. Préparation
```bash
# Installer les dépendances
npm install

# Vérifier que le SDK Android est configuré
npx react-native doctor
```

### 2. Build Release
```bash
# Build APK
cd android && ./gradlew assembleRelease

# Build AAB (recommandé pour Play Store)
cd android && ./gradlew bundleRelease
```

### 3. Signer l'APK/AAB
```bash
# Utiliser le keystore configuré dans android/app/build.gradle
# Le fichier signé sera dans android/app/build/outputs/
```

## Configuration Automatique avec Fastlane (Optionnel)

### Installation
```bash
# Installer Fastlane
gem install fastlane

# Initialiser Fastlane dans le projet
fastlane init
```

### Configuration Fastfile
```ruby
# fastlane/Fastfile
platform :ios do
  desc "Deploy to TestFlight"
  lane :beta do
    build_ios_app(
      workspace: "ios/carpeApp.xcworkspace",
      scheme: "carpeApp",
      export_method: "app-store"
    )
    upload_to_testflight
  end
end

platform :android do
  desc "Deploy to Play Store"
  lane :beta do
    gradle(
      task: "bundle",
      build_type: "Release"
    )
    upload_to_play_store(track: 'internal')
  end
end
```

### Utilisation
```bash
# Déployer sur iOS TestFlight
fastlane ios beta

# Déployer sur Android Play Store
fastlane android beta
```

## Vérifications Pré-Déploiement

### iOS
- [ ] Icônes d'application présentes
- [ ] Version et build incrémentés
- [ ] Permissions configurées dans Info.plist
- [ ] Certificats de signature valides
- [ ] Tests sur simulateur iOS 18

### Android
- [ ] Keystore configuré
- [ ] Permissions dans AndroidManifest.xml
- [ ] Version et versionCode incrémentés
- [ ] Tests sur émulateur Android

## Dépannage

### Erreurs Courantes

#### iOS
- **"Missing app icon"** : Vérifier `Images.xcassets/AppIcon.appiconset/`
- **"Incompatible with iOS 18"** : Mettre à jour Xcode et les dépendances
- **"Code signing failed"** : Vérifier les certificats et le provisioning profile

#### Android
- **"Keystore not found"** : Vérifier le chemin dans `build.gradle`
- **"Permission denied"** : Vérifier `AndroidManifest.xml`
- **"Build failed"** : Clean et rebuild le projet

### Logs de Débogage
```bash
# iOS
npx react-native run-ios --device

# Android
npx react-native run-android
```

## Support

Pour toute question ou problème de déploiement, consulter :
- [Documentation React Native](https://reactnative.dev/docs/deployment)
- [Guide Apple Developer](https://developer.apple.com/distribute/)
- [Guide Google Play Console](https://support.google.com/googleplay/android-developer) 