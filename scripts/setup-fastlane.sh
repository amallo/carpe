#!/bin/bash

# Script pour initialiser Fastlane et configurer les certificats
# Usage: ./scripts/setup-fastlane.sh

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_header "Configuration Fastlane pour CarpeApp"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    print_error "Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

# Vérifier que le dossier ios existe
if [ ! -d "ios" ]; then
    print_error "Le dossier ios n'existe pas"
    exit 1
fi

print_message "Installation de Fastlane..."
gem install fastlane

print_message "Installation de CocoaPods..."
sudo gem install cocoapods

print_message "Installation des pods iOS..."
cd ios && pod install && cd ..

print_message "Configuration des certificats avec Match..."

echo ""
print_warning "IMPORTANT: Avant de continuer, assurez-vous d'avoir :"
echo "1. Un compte Apple Developer"
echo "2. Un repository GitHub privé pour les certificats"
echo "3. Les Team IDs de votre compte Apple"
echo ""

read -p "Voulez-vous configurer Match maintenant ? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_message "Configuration de Match..."
    
    # Demander les informations nécessaires
    read -p "Votre Apple ID: " APPLE_ID
    read -p "URL du repository GitHub pour les certificats (ex: https://github.com/username/certificates): " CERT_REPO_URL
    read -p "Team ID App Store Connect: " ITC_TEAM_ID
    read -p "Team ID Developer Portal: " TEAM_ID
    read -s -p "Mot de passe pour chiffrer les certificats: " MATCH_PASSWORD
    echo ""
    
    # Mettre à jour les fichiers de configuration
    print_message "Mise à jour des fichiers de configuration..."
    
    # Mettre à jour Appfile
    sed -i '' "s/your-apple-id@example.com/$APPLE_ID/g" ios/fastlane/Appfile
    sed -i '' "s/123456789/$ITC_TEAM_ID/g" ios/fastlane/Appfile
    sed -i '' "s/ABC123DEF4/$TEAM_ID/g" ios/fastlane/Appfile
    
    # Mettre à jour Matchfile
    sed -i '' "s|https://github.com/your-username/certificates.git|$CERT_REPO_URL|g" ios/fastlane/Matchfile
    sed -i '' "s/your-apple-id@example.com/$APPLE_ID/g" ios/fastlane/Matchfile
    
    print_message "Génération des certificats..."
    cd ios
    MATCH_PASSWORD="$MATCH_PASSWORD" fastlane match appstore
    cd ..
    
    print_message "Certificats générés avec succès !"
else
    print_warning "Configuration de Match ignorée. Vous devrez la faire manuellement."
fi

echo ""
print_message "Configuration terminée !"
print_warning "N'oubliez pas de :"
echo "1. Configurer les secrets GitHub (voir docs/GITHUB_CI_CD_SETUP.md)"
echo "2. Tester le build localement : cd ios && fastlane beta"
echo "3. Vérifier que l'app compile correctement"
echo ""

print_message "Pour tester le CI/CD :"
echo "1. Push sur la branche main/master"
echo "2. Vérifier l'exécution dans GitHub Actions"
echo "3. Vérifier l'upload dans App Store Connect" 