# Backend – Réseau Social (Exemple d’Architecture)

## Présentation

Ce dossier ne représente pas un backend complet prêt à être déployé en production.

Il s’agit d’un **exemple structuré** montrant comment j’organiserais le backend d’une application de réseau social.

L’objectif est de démontrer :

* Une architecture propre et maintenable
* Une séparation claire des responsabilités
* Une gestion cohérente de l’authentification
* Une structuration REST d’API
* Une organisation modulaire et scalable

Cet exemple est basé sur le même projet de réseau social que le dossier front-end (posts, commentaires, likes, authentification).

Le but n’est pas de livrer une application complète, mais de montrer que je sais structurer un backend professionnellement.

---

## Stack Technique (Exemple)

L’architecture présentée est pensée autour de :

* Node.js
* Express
* TypeScript
* JWT (authentification)
* bcrypt (hash des mots de passe)
* Base de données relationnelle (PostgreSQL / MySQL)

L’accent est mis sur la **structure** et la logique, pas sur la complexité technique.

---

## Structure du Projet

Organisation type :

```
src/
 ├── controllers/
 ├── services/
 ├── routes/
 ├── middlewares/
 ├── models/
 ├── utils/
 ├── config/
 └── server.ts
```

### Responsabilités

**controllers/**
Gèrent la couche HTTP (req, res, status codes).
Aucune logique métier.

**services/**
Contiennent la logique métier et les interactions base de données.

**routes/**
Définissent les endpoints et les relient aux controllers.

**middlewares/**
Gestion de l’authentification, validation, gestion globale des erreurs.

**models/**
Définitions des entités et typages liés à la base de données.

**utils/**
Fonctions réutilisables (génération de token, hash, helpers).

**config/**
Configuration environnement, base de données, variables sensibles.

Cette séparation garantit :

* Lisibilité
* Évolutivité
* Maintenabilité
* Testabilité

---

## Architecture de l’Authentification

Le système d’authentification repose sur :

* Hash des mots de passe avec bcrypt
* Génération de JWT
* Middleware de vérification des tokens
* Séparation entre controller et service

Flux classique :

1. L’utilisateur s’inscrit
2. Le mot de passe est hashé avant stockage
3. L’utilisateur se connecte
4. Les identifiants sont vérifiés
5. Un token JWT est généré
6. Les routes protégées vérifient le token via middleware

Cela démontre :

* Une compréhension de l’authentification stateless
* Une gestion sécurisée des mots de passe
* Une protection des routes sensibles

---

## Modules Métier Exemple

### Posts

Endpoints typiques :

```
POST   /posts
GET    /posts
GET    /posts/:id
POST   /posts/:id/like
DELETE /posts/:id/like
```

Structure :

* Route → définit l’endpoint
* Controller → valide les données
* Service → applique la logique métier et interagit avec la base

---

### Commentaires (Structure Hiérarchique)

Le système supporte des réponses imbriquées.

Structure base de données type :

```
comments
- id
- post_id
- user_id
- parent_comment_id (nullable)
- content
- created_at
```

Avantages :

* Stockage à plat en base
* Reconstruction en arbre côté service
* Logique scalable
* Compatible avec rendu récursif côté front-end

Cela correspond directement à la logique récursive présentée dans le dossier front-end.

---

## Gestion des Erreurs

Un middleware global permet :

* Centralisation des erreurs
* Uniformisation des réponses HTTP
* Éviter la duplication de try/catch
* Empêcher l’exposition d’informations sensibles

Exemple :

```
middlewares/error.middleware.ts
```

Cela reflète une approche backend professionnelle.

---

## Pourquoi ce Backend n’est pas complet

Ce dossier contient volontairement :

* Des portions ciblées
* Des exemples structurés
* Des modules représentatifs

Il ne vise pas à :

* Être lancé en production
* Être directement déployé
* Fournir toutes les fonctionnalités possibles

Il sert à démontrer :

* Ma capacité à structurer une API proprement
* Ma compréhension des responsabilités backend
* Ma logique d’architecture scalable

---

## Ce que cela démontre

* Séparation claire des responsabilités
* Architecture modulaire
* Authentification sécurisée
* Conception REST cohérente
* Vision long terme d’un projet backend

