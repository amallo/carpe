# Cursor Hooks System

Ce système de hooks automatise le workflow TDD et la validation de l'architecture hexagonale.

## 🎣 Hooks Disponibles

### **userpromptsubmit** (Avant chaque prompt)
- **tdd-guard** : Vérifie que tous les tests passent
- **validate-architecture** : Valide l'architecture hexagonale

### **userpromptcomplete** (Après chaque prompt)
- **post-prompt-validation** : Vérifie que les tests passent toujours

## 🛠️ Scripts NPM

```bash
# Tester les hooks manuellement
npm run tdd-guard
npm run validate-architecture
npm run post-prompt-validation

# TDD avec tdd-guard-jest
npm run test:tdd
```

## 📁 Structure

```
.cursor-hooks/
├── hooks.json                    # Configuration des hooks
├── tdd-guard                     # Hook TDD
├── validate-architecture         # Hook validation architecture
├── post-prompt-validation        # Hook validation post-prompt
└── README.md                     # Documentation
```

## ✅ Fonctionnement

1. **Avant chaque prompt** : Les hooks vérifient que l'état est valide
2. **Après chaque prompt** : Les hooks valident que les changements sont corrects
3. **Blocage automatique** : Si les tests échouent ou l'architecture est violée

## 🎯 Avantages

- **TDD Automatique** : Tests vérifiés en continu
- **Architecture Protégée** : Violations détectées automatiquement
- **Workflow Fluide** : Intégration transparente avec Cursor
- **Validation Continue** : Vérification après chaque changement
