# CarpeApp - Architecture Technique et Protocoles

## 1. Introduction
CarpeApp est une messagerie décentralisée utilisant LoRa et Bluetooth pour assurer la communication en l'absence d'infrastructure réseau traditionnelle.

## 2. Contraintes des Réseaux Décentralisés

### 2.1 Contraintes LoRa

#### **Contraintes Réglementaires (France)**
- **Duty Cycle** : Maximum 1% du temps sur les bandes ISM (868 MHz)
- **Puissance maximale** : 14 dBm (25 mW) sur 868.0-868.6 MHz
- **Puissance maximale** : 27 dBm (500 mW) sur 868.7-869.2 MHz
- **Puissance maximale** : 14 dBm (25 mW) sur 869.4-869.65 MHz
- **Puissance maximale** : 10 dBm (10 mW) sur 869.7-870.0 MHz
- **Bandes autorisées** : 863-870 MHz (ISM) et 433-434 MHz (SRD)

#### **Contraintes Techniques**
- **Bande passante** : 125 kHz, 250 kHz, ou 500 kHz
- **Spreading Factor** : SF7 à SF12 (détermine la portée et la robustesse)
- **Taille de paquet** : Maximum 255 bytes (LoRa) ou 242 bytes (LoRaWAN)
- **Taille effective** : 51-222 bytes selon le SF et la bande passante
- **Latence** : 100ms-2s selon le SF et la bande passante
- **Portée** : 2-15 km selon l'environnement et la configuration

#### **Contraintes de Fréquence et Timing**
- **Canal unique** : Un seul canal par appareil à la fois
- **Hopping interdit** : Pas de changement de fréquence pendant la transmission
- **Temps d'émission** : Maximum 400ms par message sur 868 MHz
- **Intervalle minimum** : Respect du duty cycle (ex: 1% = 1s émission max pour 100s)
- **Interférences** : Sensible aux autres appareils LoRa sur la même fréquence

#### **Contraintes de Débit**
- **Débit brut** : 0.3-37.5 kbps selon le SF
- **Débit net** : 0.1-25 kbps (overhead protocol)
- **Messages par heure** : Maximum 36 messages/heure avec duty cycle 1%
- **Messages par jour** : Maximum 864 messages/jour avec duty cycle 1%

#### **Spreading Factors (SF) et leurs Contraintes**

##### **SF7 (Spreading Factor 7)**
- **Débit** : 5.47 kbps (125 kHz), 10.94 kbps (250 kHz), 21.88 kbps (500 kHz)
- **Temps d'air** : ~41ms (125 kHz), ~20ms (250 kHz), ~10ms (500 kHz)
- **Portée** : 2-5 km (urbain), 5-10 km (rural)
- **Robustesse** : Faible résistance aux interférences
- **Utilisation** : Communication courte portée, débit élevé requis

##### **SF8**
- **Débit** : 3.13 kbps (125 kHz), 6.25 kbps (250 kHz), 12.5 kbps (500 kHz)
- **Temps d'air** : ~72ms (125 kHz), ~36ms (250 kHz), ~18ms (500 kHz)
- **Portée** : 3-7 km (urbain), 7-12 km (rural)
- **Robustesse** : Résistance modérée aux interférences
- **Utilisation** : Équilibre portée/débit, zones urbaines

##### **SF9**
- **Débit** : 1.76 kbps (125 kHz), 3.52 kbps (250 kHz), 7.03 kbps (500 kHz)
- **Temps d'air** : ~144ms (125 kHz), ~72ms (250 kHz), ~36ms (500 kHz)
- **Portée** : 5-10 km (urbain), 10-15 km (rural)
- **Robustesse** : Bonne résistance aux interférences
- **Utilisation** : Communication moyenne portée, zones suburbaines

##### **SF10**
- **Débit** : 0.98 kbps (125 kHz), 1.95 kbps (250 kHz), 3.91 kbps (500 kHz)
- **Temps d'air** : ~288ms (125 kHz), ~144ms (250 kHz), ~72ms (500 kHz)
- **Portée** : 8-15 km (urbain), 15-25 km (rural)
- **Robustesse** : Très bonne résistance aux interférences
- **Utilisation** : Longue portée, zones rurales

##### **SF11**
- **Débit** : 0.54 kbps (125 kHz), 1.07 kbps (250 kHz), 2.15 kbps (500 kHz)
- **Temps d'air** : ~576ms (125 kHz), ~288ms (250 kHz), ~144ms (500 kHz)
- **Portée** : 12-20 km (urbain), 20-30 km (rural)
- **Robustesse** : Excellente résistance aux interférences
- **Utilisation** : Très longue portée, zones isolées

##### **SF12**
- **Débit** : 0.29 kbps (125 kHz), 0.59 kbps (250 kHz), 1.17 kbps (500 kHz)
- **Temps d'air** : ~1152ms (125 kHz), ~576ms (250 kHz), ~288ms (500 kHz)
- **Portée** : 15-25 km (urbain), 25-40 km (rural)
- **Robustesse** : Résistance maximale aux interférences
- **Utilisation** : Portée extrême, zones très isolées

#### **Impact du SF sur le Duty Cycle**
- **SF7-SF9** : Temps d'air court → Plus de messages possibles par période
- **SF10-SF12** : Temps d'air long → Moins de messages possibles par période
- **Exemple** : Avec duty cycle 1% (36s/heure)
  - SF7 (125 kHz) : ~878 messages/heure possibles
  - SF12 (125 kHz) : ~31 messages/heure possibles

### 2.2 Contraintes Bluetooth
- **Portée limitée** : 10-100m selon la classe
- **Consommation énergétique** : Critique pour les appareils mobiles
- **Interférences** : Sensible aux perturbations RF

### 2.3 Contraintes Générales des Réseaux Décentralisés
- **Pas de contrôle sur la réception** : Aucune garantie de livraison
- **Besoin d'ACK** : Nécessité de confirmation de réception
- **Deduplication** : Gestion des messages dupliqués
- **Pas de serveur central** : Routage et coordination distribués

## 3. Principes de Protocoles Mis en Jeu

### 3.1 Fiabilité et Réception
- **Stop-and-Wait ARQ** : Attente d'ACK avant envoi suivant
- **Go-Back-N ARQ** : Retransmission en cas de perte
- **Selective Repeat ARQ** : Retransmission sélective des paquets perdus
- **Timeout et Retry** : Gestion des délais d'attente

### 3.2 Deduplication et Cohérence
- **Identifiants uniques** : UUID ou hash pour chaque message
- **Timestamps** : Gestion de l'ordre temporel
- **Séquence de numérotation** : Numérotation séquentielle des messages
- **Bloom Filters** : Détection efficace des doublons

### 3.3 Routage et Topologie
- **Flooding** : Diffusion à tous les nœuds
- **Gossip Protocol** : Propagation épidémique des messages
- **AODV (Ad-hoc On-Demand Distance Vector)** : Routage à la demande
- **OLSR (Optimized Link State Routing)** : Routage proactif

### 3.4 Gestion des Ressources
- **Token Bucket** : Contrôle du débit d'émission
- **Leaky Bucket** : Régulation du trafic sortant
- **Priority Queuing** : Gestion des priorités de messages
- **Resource Reservation** : Réservation de bande passante

### 3.5 Sécurité et Authentification
- **Challenge-Response** : Authentification mutuelle
- **Nonce** : Protection contre les attaques par rejeu
- **Rate Limiting** : Protection contre le spam
- **Blacklisting** : Exclusion des nœuds malveillants

## 4. Architecture de Messages

### 4.1 Structure de Base
```
Header (32 bytes)
├── Message ID (16 bytes)
├── Timestamp (8 bytes)
├── Type (1 byte)
├── Priority (1 byte)
├── TTL (1 byte)
├── Source (4 bytes)
└── Reserved (1 byte)

Payload (variable)
├── Data (0-223 bytes)
└── Padding (si nécessaire)

Footer (16 bytes)
├── CRC32 (4 bytes)
└── Signature (12 bytes)
```

### 4.2 Types de Messages
- **TEXT** : Message texte simple
- **HELLO** : Découverte de nœuds
- **PING/PONG** : Vérification de connectivité
- **ROUTE_UPDATE** : Mise à jour de routage
- **BLACKLIST_UPDATE** : Mise à jour de liste noire
- **BEACON** : Signal de présence
- **NETWORK_STATUS** : État du réseau

## 5. Stratégies de Compensation

### 5.1 Pour la Fiabilité
- **Retransmission exponentielle** : Backoff progressif
- **Fragmentation** : Découpage des gros messages
- **Redondance** : Envoi multiple des messages critiques
- **Checksums** : Vérification d'intégrité

### 5.2 Pour la Performance
- **Compression** : Réduction de la taille des données
- **Cache** : Mise en cache des messages fréquents
- **Préchargement** : Anticipation des besoins
- **Optimisation des paquets** : Minimisation des overheads

### 5.3 Pour la Sécurité
- **Chiffrement symétrique** : ChaCha20-Poly1305
- **Signatures** : Ed25519 pour l'authentification
- **Échange de clés** : X25519 pour la confidentialité
- **Rotation des clés** : Renouvellement périodique

## 6. Considérations d'Implémentation

### 6.1 Gestion de la Mémoire
- **Pool d'objets** : Réutilisation des structures de messages
- **Garbage collection** : Nettoyage des ressources
- **Compression** : Réduction de l'empreinte mémoire

### 6.2 Gestion de l'Énergie
- **Sleep modes** : Mise en veille des composants
- **Adaptation dynamique** : Ajustement selon la batterie
- **Priorisation** : Messages critiques en premier

### 6.3 Monitoring et Debug
- **Logs structurés** : Traçabilité des opérations
- **Métriques** : Performance et santé du réseau
- **Alertes** : Détection des problèmes
- **Télémétrie** : Collecte de données de diagnostic
