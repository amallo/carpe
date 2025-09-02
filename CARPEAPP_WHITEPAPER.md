# CarpeApp Whitepaper
## Architecture de Résilience et Communication Décentralisée

**Version:** 1.0  
**Date:** December 2024  
**Auteur:** CarpeApp Team

---

## 1. Introduction

### 1.1 Vision du Projet
CarpeApp est une application de communication décentralisée conçue pour la **résilience avant tout**. Notre objectif est de créer un système de communication qui survit aux pannes, coupures de réseau, et catastrophes naturelles.

**Philosophie : Résilience > Sécurité**
- Commencer par une communication fiable et robuste
- Sécuriser progressivement selon les besoins
- Prioriser la survie du réseau sur la perfection technique

### 1.2 Cas d'Usage Prioritaires
- **Communication d'urgence** : Quand les réseaux traditionnels sont coupés
- **Réseaux communautaires** : Communication locale sans infrastructure centralisée
- **Backup de communication** : Alternative aux réseaux cellulaires et WiFi
- **Résilience urbaine** : Communication en cas de catastrophe ou panne massive

---

## 2. Architecture de Résilience

### 2.1 Principes Fondamentaux

#### **Redondance Multi-Transport**
- **BLE (Bluetooth Low Energy)** : Découverte et communication à proximité (< 100m)
- **LoRa (Long Range)** : Communication longue portée (2-15km) et relais
- **Cache local** : Messages stockés localement pour retransmission
- **Routage adaptatif** : Changement automatique de route en cas de panne

#### **Auto-Réparation et Dégradation Gracieuse**
- **Auto-réparation** : Le réseau se reconfigure automatiquement
- **Dégradation gracieuse** : L'app fonctionne même avec des fonctionnalités réduites
- **Tolérance aux pannes** : Un nœud défaillant n'arrête pas le réseau
- **Mode dégradé** : Fonctionnement même avec des ressources limitées

### 2.2 Stratégies de Résilience

#### **Découverte et Connexion**
- **Découverte automatique** : Pairs détectés automatiquement
- **Connexion intelligente** : Choix du meilleur transport disponible
- **Reconnexion automatique** : Tentative de reconnexion en cas de perte
- **État persistant** : Conservation des informations de connexion

#### **Gestion des Pannes**
- **Détection proactive** : Monitoring continu de la santé du réseau
- **Basculement automatique** : Changement de route en cas de problème
- **Récupération progressive** : Remise en service par étapes
- **Apprentissage** : Amélioration continue des stratégies de récupération

---

## 3. Protocole de Messages - Channel Public

### 3.1 Structure de Message

#### **Message de Base (Unencrypted Public Channel)**
```
Header (Unencrypted - pour le routage):
├── Message ID: UUID unique
├── Timestamp: Heure d'envoi
├── TTL: Time To Live (nombre de sauts)
├── Source: ID de l'expéditeur
├── Destination: ID du destinataire ou "BROADCAST"
├── Message Type: Type de message
├── Priority: HIGH, NORMAL, LOW
└── Size: Taille du payload

Payload (Unencrypted pour le channel public):
├── Content: Contenu du message
├── Metadata: Informations supplémentaires
└── Checksum: Vérification d'intégrité

Footer:
├── Signature: Signature Ed25519 du header + payload
└── End Marker: Marqueur de fin de message
```

### 3.2 Types de Messages

#### **Messages Utilisateur (Public)**
- **TEXT** : Messages texte simples (limite : 280 caractères)
- **LOCATION** : Coordonnées GPS (latitude, longitude, précision)
- **STATUS** : Statut personnel (disponible, occupé, en urgence, hors ligne)

#### **Messages de Contrôle (Gestion du Réseau)**
- **HELLO** : Découverte de pairs et annonce de présence
- **PING/PONG** : Vérification de connectivité et santé du réseau
- **ROUTE_UPDATE** : Mise à jour des tables de routage
- **BLACKLIST_UPDATE** : Mise à jour des listes noires partagées

#### **Messages Système (Public)**
- **BEACON** : Signal de présence périodique (LoRa)
- **RESPONSE** : Réponse aux beacons de découverte
- **NETWORK_STATUS** : État général du réseau (nombre de pairs, qualité)

### 3.3 Gestion des Messages

#### **Cycle de Vie d'un Message**
1. **Création** : Génération de l'ID, timestamp, signature
2. **Validation** : Vérification de la taille, format, contenu
3. **Routage** : Détermination du chemin de transmission
4. **Transmission** : Envoi via BLE ou LoRa
5. **Suivi** : Monitoring de la livraison
6. **Retry** : Retransmission en cas d'échec
7. **Acknowledgment** : Confirmation de réception
8. **Nettoyage** : Suppression après TTL expiré

---

## 4. Routage et Découverte

### 4.1 Découverte de Pairs

#### **Via BLE (Discovery)**
- **Broadcast** : Annonce de présence à proximité
- **Scan** : Découverte des pairs dans la zone
- **Pairing** : Établissement de la confiance mutuelle
- **Exchange** : Partage des informations de routage

#### **Via LoRa (Long Range)**
- **Beacon** : Messages de présence périodiques
- **Scan** : Écoute des beacons des pairs éloignés
- **Response** : Réponse aux beacons reçus
- **Update** : Mise à jour des tables de routage

### 4.2 Tables de Routage

#### **Structure de la Table**
```
Peer ID: Identifiant unique du pair
├── Last Seen: Dernière activité détectée
├── Connection Type: BLE, LoRa, ou BOTH
├── Signal Strength: RSSI (BLE) ou SNR (LoRa)
├── Reliability: Taux de succès des transmissions
├── Capabilities: Types de messages supportés
├── Route: Chemin pour atteindre ce pair
└── Status: ONLINE, OFFLINE, UNRELIABLE
```

#### **Mise à Jour des Routes**
- **Automatique** : Découverte de nouveaux chemins
- **Adaptative** : Changement selon la qualité du signal
- **Fallback** : Retour aux routes de secours
- **Cleanup** : Suppression des routes obsolètes

### 4.3 Stratégies de Routage

#### **Routage Direct**
- **Pair à Pair** : Communication directe si possible
- **BLE** : Pour les pairs à proximité (< 100m)
- **LoRa** : Pour les pairs éloignés (2-15km)

#### **Routage Multi-Hop**
- **Relay** : Utilisation de pairs intermédiaires
- **Flooding** : Diffusion à tous les pairs
- **Selective** : Routage intelligent selon la destination

---

## 5. Gestion de la Résilience

### 5.1 Détection de Pannes

#### **Indicateurs de Problèmes**
- **Connectivity Loss** : Plus de réponse du pair
- **Signal Degradation** : RSSI/SNR qui baisse
- **Message Loss** : Messages qui n'arrivent pas
- **Timeout** : Réponses qui prennent trop de temps

#### **Actions Automatiques**
- **Route Switch** : Changement automatique de chemin
- **Retry Logic** : Nouvelle tentative avec backoff exponentiel
- **Fallback** : Utilisation des routes de secours
- **Alert** : Notification à l'utilisateur

### 5.2 Auto-Réparation

#### **Reconnexion Automatique**
- **BLE Reconnect** : Tentative de reconnexion BLE
- **LoRa Beacon** : Écoute des beacons de réapparition
- **Route Recovery** : Récupération des routes perdues
- **State Sync** : Synchronisation de l'état

#### **Dégradation Gracieuse**
- **Mode Offline** : Fonctionnement local uniquement
- **Mode Limited** : Fonctionnalités réduites
- **Mode Emergency** : Communication critique seulement

---

## 6. Sécurité Progressive

### 6.1 Niveaux de Sécurité

#### **Niveau 1 : Protection de Base (ESP32)**
- **Rate Limiting** : Limitation du débit de messages
- **Message Validation** : Vérification des formats et tailles
- **Size Limits** : Limitation de la taille des messages
- **TTL Enforcement** : Respect des Time To Live

#### **Niveau 2 : Protection Anti-Abus**
- **Content Filtering** : Filtrage basique du contenu
- **Deduplication** : Élimination des messages dupliqués
- **Blacklist Partagée** : Liste noire des appareils abusifs partagée entre tous
- **User Quotas** : Quotas par utilisateur pour éviter le spam

#### **Niveau 3 : Sécurité Avancée**
- **Message Encryption** : Chiffrement des messages privés
- **Digital Signatures** : Signatures numériques Ed25519
- **Perfect Forward Secrecy** : Secret parfait avec clés éphémères
- **Anonymous Communication** : Communication anonyme optionnelle

### 6.2 Stratégie de Déploiement
- **Phase 1** : Protection de base (ESP32) + messages publics
- **Phase 2** : Anti-abuse + blacklist partagée + monitoring
- **Phase 3** : Encryption + signatures + canaux privés
- **Phase 4** : Sécurité avancée + anonymat + audit
