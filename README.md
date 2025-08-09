# 🌊 Carpe  
![Build Status](https://github.com/amallo/carpe/actions/workflows/ci.yml/badge.svg?branch=main)  
![License](https://img.shields.io/github/license/amallo/carpe)  
![Version](https://img.shields.io/github/package-json/v/amallo/carpe)  

**Communication longue portée, sécurisée, et sans Internet.**  

---

## 🚀 Pourquoi Carpe ?
Imagine pouvoir envoyer un message **sécurisé** à quelqu’un **sans réseau cellulaire** ni **Wi-Fi**.  
**Carpe** rend cela possible grâce à une combinaison intelligente de **LoRa** (longue portée) et **Bluetooth** (liaison smartphone ↔ ESP32), avec chiffrement de bout en bout.  

Carpe, c’est la carpe qui nage dans les **ondes LoRa** pour transmettre vos messages… 🐟📡

---

## 🔒 Ce que Carpe apporte
- **Sécurité totale** → Chiffrement sur le téléphone, jamais sur le réseau. Les modules LoRa ne voient que des données chiffrées.  
- **Indépendance réseau** → Fonctionne sans 4G/5G, sans Wi-Fi.  
- **Portée XXL** → LoRa assure plusieurs kilomètres de couverture.  
- **Léger & rapide** → Format binaire optimisé, faible consommation d’énergie.  
- **Fiabilité** → Gestion des accusés de réception (ACK) non bloquants.

## 🛠 Architecture en bref
📱 Téléphone A 📡 ESP32 A 🌐 LoRa 📡 ESP32 B 📱 Téléphone B
[Chiffre msg] → BLE → [Relais sécurisé] → [Transmission] → [Relais sécurisé] → [Déchiffre msg]