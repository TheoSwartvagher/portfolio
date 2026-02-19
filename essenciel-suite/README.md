# Essenciel – Suite d’applications React Native standardisées

## Présentation

Essenciel est une suite de petites applications mobiles développées avec **React Native (TypeScript)** publiés ou en cours de publications sur les store.

L’objectif principal de cette suite n’est pas de présenter une application isolée, mais de démontrer :

* Une architecture standardisée
* Une organisation de projet reproductible
* Une base technique commune optimisée
* Une approche modulaire et scalable
* Une capacité à industrialiser le développement mobile

Ce dossier présente des portions représentatives du code utilisées comme base commune pour toutes les applications de la suite.

---

## Philosophie du projet

La suite Essenciel repose sur un principe simple :

> Chaque nouvelle application doit pouvoir être créée rapidement, en s’appuyant sur une architecture déjà optimisée et éprouvée.

Cela permet :

* Réduction drastique du temps de développement
* Cohérence entre toutes les applications
* Maintenance simplifiée
* Évolutivité maîtrisée
* Mutualisation des composants et des outils

---

## Stack technique

* React Native
* TypeScript
* React Navigation
* AsyncStorage
* i18n (internationalisation dès la base)
* react-native-google-mobile-ads
* Architecture modulaire par features
* Thématisation centralisée

---

## Architecture standard

Chaque projet Essenciel repose sur une structure commune :

```
src/
│
├── components/        → Composants UI réutilisables
│   ├── Card
│   ├── Header
│   ├── Buttons
│   ├── AdBanner
│   └── UI commun
│
├── contexts/          → Gestion d’état globale
│
├── i18n/              → Internationalisation
│   ├── fr.json
│   ├── en.json
│   └── useTranslation.ts
│
├── models/            → Typage métier
│
├── pages/             → Écrans applicatifs
│
├── services/          → Navigation, storage, logique externe
│
├── themes/            → Styles et thème global
│   ├── theme.ts
│   └── styles par composant
│
└── utils/             → Fonctions utilitaires
```

Cette structure est utilisée comme base pour toutes les applications de la suite.

---

## Standardisation mise en place

### 1. Typage systématique

* Tous les projets sont en TypeScript
* Modèles centralisés
* Props typées
* Contexte typé

Objectif : robustesse et maintenabilité.

---

### 2. Thématisation centralisée

Chaque application repose sur :

* Un fichier `theme.ts`
* Des styles séparés par composant
* Une cohérence typographique
* Une palette contrôlée

Objectif : uniformité visuelle et modification rapide globale.

---

### 3. Internationalisation intégrée dès le départ

Chaque application est pensée dès sa création pour être traduisible :

* Fichiers `fr.json` / `en.json`
* Hook `useTranslation`
* Aucun texte hardcodé dans les composants principaux

Objectif : scalabilité internationale immédiate.

---

### 4. Monétisation intégrée dans l’architecture

Chaque application inclut dès le départ :

* Intégration Google Mobile Ads
* Composant `AdBanner` réutilisable
* Emplacements prévus dans l’architecture

Objectif : industrialisation de la monétisation.

---

### 5. Composants UI réutilisables

Un ensemble de composants communs est partagé entre les projets :

* Cards
* Headers
* Boutons
* Layouts
* Feedbacks

Ces composants permettent :

* Cohérence UX
* Gain de temps
* Maintenance centralisée

---

## Objectif portfolio

Ce dossier ne contient pas une application complète prête à être publiée.

Il présente :

* L’architecture commune
* Les conventions mises en place
* Les patterns réutilisés
* Des portions de code représentatives

Le but est de démontrer :

* Capacité à structurer une suite d’applications
* Vision long terme
* Optimisation des process
* Approche professionnelle du développement mobile

---

## Positionnement technique

Ce projet montre :

* Capacité à industrialiser le développement mobile
* Compréhension de la modularité
* Standardisation d’architecture
* Anticipation des besoins futurs (ads, i18n, thème, navigation)
