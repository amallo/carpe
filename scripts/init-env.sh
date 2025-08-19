#!/bin/bash

# Script pour initialiser l'environnement par défaut
# Usage: ./scripts/init-env.sh

set -e

# Couleurs pour les messages
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

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_header "Initialisation de l'environnement"

# Vérifier si le fichier .env existe déjà
if [ -f ".env" ]; then
    print_warning "Le fichier .env existe déjà."
    echo "Contenu actuel :"
    cat .env
    echo ""
    read -p "Voulez-vous le remplacer ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_message "Initialisation annulée."
        exit 0
    fi
fi

# Créer le fichier .env avec la configuration de développement par défaut
print_message "Création du fichier .env avec la configuration de développement..."

cat > .env << EOF
USE_MOCK_PROVIDERS=true
ENABLE_DEBUG_LOGS=true
API_BASE_URL=https://api.carpeapp.com
EOF

print_message "Fichier .env créé avec succès !"
echo ""
print_message "Configuration par défaut :"
echo "  - USE_MOCK_PROVIDERS=true (providers simulés)"
echo "  - ENABLE_DEBUG_LOGS=true (logs de débogage activés)"
echo "  - API_BASE_URL=https://api.carpeapp.com"
echo ""
print_message "Pour changer d'environnement, utilisez :"
echo "  ./scripts/switch-env.sh dev   # Mode développement"
echo "  ./scripts/switch-env.sh prod  # Mode production" 