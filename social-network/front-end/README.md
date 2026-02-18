# Social Network – Front-End Architecture (Code Excerpts)

## Objectif

Ce dossier ne contient pas une application complète.

Il s’agit d’un **ensemble volontairement sélectionné de portions de code** dont le but est de démontrer :

* Ma capacité à structurer une application React Native
* Ma compréhension des architectures front-end modernes
* Maîtrise du Context API
* Séparation des responsabilités
* Abstraction des appels API
* Gestion propre des états complexes (posts, likes, commentaires)

Le but n’est pas de présenter un produit fonctionnel,
mais de montrer que je sais concevoir la structure d’un projet complet et scalable.

---

## Stack technique

* React Native
* Expo
* TypeScript
* Context API
* Axios
* Hooks personnalisés
* Architecture modulaire orientée feature

---

## Ce que contient réellement ce dossier

Il contient des extraits représentatifs :

* Un AuthContext minimal et propre
* Un service API centralisé
* Une architecture de gestion des posts
* Une gestion hiérarchique des commentaires
* Une séparation claire entre UI et logique

Il ne contient pas :

* L’ensemble des écrans
* L’intégralité des routes
* La totalité des features
* La configuration complète d’un projet Expo

Ces éléments ont été volontairement exclus pour garder le focus sur l’architecture et la qualité du code.

---

## AuthContext

Le contexte d’authentification est volontairement réduit à l’essentiel :

```
{
  user,
  isAuthenticated,
  login,
  register,
  logout,
  loading
}
```

Ce choix démontre :

* Compréhension du pattern Context
* Gestion d’état global propre
* Séparation claire des responsabilités

Les thèmes, followers, préférences utilisateur, etc. ne sont volontairement pas inclus car ils relèvent d’autres domaines métier.

---

## apiService

Le fichier `apiService.ts` centralise :

* La configuration Axios
* Les interceptors
* La gestion uniforme des erreurs
* Les méthodes HTTP génériques typées

Exemple d’utilisation possible :

```ts
const posts = await apiService.get<Post[]>("/posts");

await apiService.post("/posts/like", {
  postId: 42,
});
```

Ce fichier démontre une compréhension de :

* L’abstraction réseau
* La préparation à l’injection de token
* La scalabilité de la couche API

---

## Architecture Posts & Commentaires

Les posts sont conçus avec :

* Un composant principal (ex : `SimplePost`)
* Une gestion locale optimiste des likes
* Un overlay de commentaires séparé
* Un composant `Comment` récursif pour gérer les réponses imbriquées

Cela démontre :

* La séparation UI / logique
* La gestion d’arborescences dynamiques
* Une approche maintenable et scalable

---

## Ce que ce projet démontre réellement

Ce dossier montre que je sais :

* Structurer un projet React Native proprement
* Organiser une architecture par feature
* Séparer les couches (UI / logique / API)
* Éviter la duplication de logique
* Isoler la responsabilité des composants
* Penser à la maintenabilité dès le départ

Il ne s’agit pas d’un projet fini,
mais d’un échantillon technique représentatif de mes compétences front-end.

---

Si tu veux, je peux maintenant te dire très honnêtement si ton portfolio est solide pour un poste React Native junior / intermédiaire.
