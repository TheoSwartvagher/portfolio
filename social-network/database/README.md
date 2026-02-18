# Database – Social Network (Extrait)

## Objectif

Ce dossier contient une **portion simplifiée du schéma de base de données** utilisée pour illustrer l’architecture backend présentée dans ce portfolio.

Il ne s’agit pas de la base complète d’une application en production, mais d’un exemple cohérent permettant de démontrer :

* La modélisation relationnelle
* La gestion des relations entre entités
* L’intégrité référentielle
* Les relations many-to-many
* La hiérarchie des commentaires
* L’optimisation via index

Ce schéma est aligné avec les portions de code backend fournies dans le dossier `back-end`.

---

## Structure représentée

Le schéma comprend les entités principales d’un réseau social :

### 1. Users

Représente les utilisateurs de la plateforme.

Champs principaux :

* `id`
* `email`
* `password_hash`
* `pseudo`
* `alias`
* `bio`
* `profile_picture`
* `is_certified`
* `created_at`

Contraintes :

* Email unique
* Suppression en cascade sur les relations dépendantes

---

### 2. Posts

Représente les publications.

Relations :

* `author_id` → `users(id)`

Index :

* Index sur `author_id`
* Index sur `created_at`

---

### 3. Comments

Gestion hiérarchique via :

* `parent_id` (auto-référence)

Permet :

* Commentaires
* Réponses imbriquées
* Arborescence récursive

Relations :

* `post_id` → `posts(id)`
* `author_id` → `users(id)`
* `parent_id` → `comments(id)`

---

### 4. Post Likes

Relation many-to-many entre :

* `users`
* `posts`

Clé primaire composite :

```
(user_id, post_id)
```

Empêche les doubles likes.

---

### 5. Comment Likes

Relation many-to-many entre :

* `users`
* `comments`

Clé primaire composite :

```
(user_id, comment_id)
```

---

### 6. Follows

Relation many-to-many auto-référencée entre utilisateurs :

* `follower_id`
* `followed_id`

Contraintes :

* Clé primaire composite
* Suppression en cascade
* Interdiction de se suivre soi-même

---

## Points d’architecture démontrés

Ce schéma montre :

* Compréhension des relations 1-N et N-N
* Utilisation des clés étrangères
* Utilisation des contraintes CHECK
* Gestion d’intégrité référentielle
* Structuration logique cohérente avec les routes backend

---

## Ce qui n’est volontairement pas inclus

* Système de rôles avancés
* Notifications
* Messagerie privée
* Tables de logs
* Optimisations avancées (partitioning, triggers, etc.)

L’objectif est de rester aligné avec les portions backend présentées dans le portfolio.

---

## Conclusion

Ce dossier illustre la capacité à :

* Concevoir un schéma relationnel propre
* L’aligner avec une architecture Express + TypeScript
* Structurer une base cohérente avec un système de posts et commentaires hiérarchiques

Il s’agit d’un extrait pédagogique et architectural, destiné à démontrer la compréhension des fondamentaux backend.

---
