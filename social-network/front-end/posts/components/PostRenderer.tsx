import React from "react";

/**
 * Typage du modèle Post.
 * Permet d'assurer la cohérence des données
 * reçues depuis l’API.
 */
import { Post } from "./types/Post";

/**
 * Typage de la navigation (React Navigation v6).
 * On évite `any` pour garantir un typage strict
 * et sécurisé des routes.
 */
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

/**
 * Import des différents types de publications.
 * Chaque composant est responsable de son rendu spécifique.
 */
import SimplePost from "./posts/SimplePost";
import GoalPost from "./posts/GoalPost";
import ChallengePost from "./posts/ChallengePost";

/**
 * Typage précis de la navigation.
 * Ici, PostRenderer est utilisé dans l’écran "Whatsup".
 */
type WhatsupNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Whatsup"
>;

/**
 * Props du composant.
 * - post : objet représentant la publication
 * - navigation : objet navigation typé
 */
interface Props {
  post: Post;
  navigation: WhatsupNavigationProp;
}

/**
 * PostRenderer
 *
 * Composant responsable de sélectionner dynamiquement
 * quel composant afficher en fonction du type de publication.
 *
 * Il agit comme un "dispatcher" de rendu.
 *
 * Avantage :
 * - Séparation des responsabilités
 * - Code extensible
 * - Lisibilité améliorée
 */
function PostRenderer({ post, navigation }: Props) {

  /**
   * Switch basé sur le type de post.
   * Permet une architecture facilement extensible.
   *
   * Si un nouveau type apparaît,
   * il suffit d'ajouter un case.
   */
  switch (post.post_type) {

    case "simple_post":
      return (
        <SimplePost
          post={post}
          navigation={navigation}
        />
      );

    case "goal_post":
      return (
        <GoalPost
          post={post}
          navigation={navigation}
        />
      );

    case "challenge_post":
      return (
        <ChallengePost
          post={post}
          navigation={navigation}
        />
      );

    /**
     * Si le type n’est pas reconnu,
     * on ne rend rien.
     * On pourrait aussi logguer une erreur en dev.
     */
    default:
      return null;
  }
}

/**
 * React.memo permet d’éviter les re-renders inutiles
 * si les props n’ont pas changé.
 *
 * Utile dans un feed où plusieurs posts sont affichés.
 */
export default React.memo(PostRenderer);
