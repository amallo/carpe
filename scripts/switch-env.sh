#!/bin/bash

# Script pour basculer entre les environnements de développement et de production
# Usage: ./scripts/switch-env.sh [dev|prod]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Vérifier si un argument est fourni
if [ $# -eq 0 ]; then
    print_error "Usage: $0 [dev|prod]"
    echo ""
    echo "Options:"
    echo "  dev   - Configuration de développement (providers simulés)"
    echo "  prod  - Configuration de production (providers réels)"
    echo ""
    echo "Exemples:"
    echo "  $0 dev   # Utiliser les providers de développement"
    echo "  $0 prod  # Utiliser les providers de production"
    exit 1
fi

ENV_MODE=$1

case $ENV_MODE in
    "dev")
        print_header "Configuration de Développement"
        print_message "Activation des providers simulés..."
        
        # Créer le fichier .env pour React Native
        echo "USE_MOCK_PROVIDERS=true" > .env
        echo "ENABLE_DEBUG_LOGS=true" >> .env
        echo "API_BASE_URL=https://api.carpeapp.com" >> .env
        
        # Exporter la variable d'environnement pour la session actuelle
        export USE_MOCK_PROVIDERS=true
        
        print_message "USE_MOCK_PROVIDERS=true"
        print_message "Fichier .env créé avec la configuration de développement"
        print_message "L'application utilisera :"
        echo "  - InMemoryPeerProvider (données simulées)"
        echo "  - GrantedPermissionProvider (permissions automatiques)"
        echo "  - Logs de débogage activés"
        ;;
        
    "prod")
        print_header "Configuration de Production"
        print_message "Activation des providers réels..."
        
        # Créer le fichier .env pour React Native
        echo "USE_MOCK_PROVIDERS=false" > .env
        echo "ENABLE_DEBUG_LOGS=false" >> .env
        echo "API_BASE_URL=https://api.carpeapp.com" >> .env
        
        # Exporter la variable d'environnement pour la session actuelle
        export USE_MOCK_PROVIDERS=false
        
        print_message "USE_MOCK_PROVIDERS=false"
        print_message "Fichier .env créé avec la configuration de production"
        print_message "L'application utilisera :"
        echo "  - BLEPeerProvider (Bluetooth réel)"
        echo "  - NativePermissionProvider (permissions natives)"
        echo "  - Logs de débogage désactivés"
        ;;
        
    *)
        print_error "Mode invalide: $ENV_MODE"
        print_error "Utilisez 'dev' ou 'prod'"
        exit 1
        ;;
esac

echo ""
print_message "Configuration appliquée avec succès !"
echo ""
print_warning "IMPORTANT: Pour Xcode, vous devez :"
echo "  1. Nettoyer le build (Product > Clean Build Folder ou Cmd+Shift+K)"
echo "  2. Redémarrer Xcode"
echo "  3. Rebuild le projet (Product > Build ou Cmd+B)"
echo ""
print_message "Pour tester la configuration :"
echo "  npx react-native run-ios     # iOS"
echo "  npx react-native run-android # Android"
echo ""
print_message "Le fichier .env a été créé/modifié avec la configuration $ENV_MODE" 