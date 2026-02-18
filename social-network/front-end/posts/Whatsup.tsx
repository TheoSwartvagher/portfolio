// Imports React et hooks nécessaires
import React, { useEffect, useState, useCallback, useRef } from "react";

// Composants React Native utilisés pour la mise en page et le scroll
import {
  View,
  ScrollView,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

// Typage de la navigation (React Navigation + TypeScript)
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

// Typage des données Post
import { Post } from "./types/Post";

// Service isolé responsable des appels API
import { fetchPosts } from "../services/postService";

// Composant chargé de rendre dynamiquement chaque type de post
import PostRenderer from "./PostRenderer";

/**
 * Typage strict de la navigation pour éviter l’usage de `any`
 * Cela garantit la cohérence des routes et paramètres.
 */
type WhatsupNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Whatsup"
>;

interface WhatsupProps {
  navigation: WhatsupNavigationProp;
}

/**
 * Composant principal du feed social.
 * Responsable :
 * - De la récupération paginée des posts
 * - De la gestion du scroll infini
 * - Du rendu des publications
 */
export default function Whatsup({ navigation }: WhatsupProps) {

  /**
   * State contenant la liste des posts affichés.
   * Utilisation de useState car toute modification
   * doit déclencher un re-render de l’interface.
   */
  const [posts, setPosts] = useState<Post[]>([]);

  /**
   * State indiquant si une requête est en cours.
   * Permet d’éviter les requêtes concurrentes
   * et d’afficher un indicateur de chargement.
   */
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * offsetRef permet de stocker l’offset de pagination
   * sans provoquer de re-render.
   *
   * On utilise useRef car l’offset n’impacte pas
   * directement l’affichage.
   */
  const offsetRef = useRef<number>(0);

  /**
   * Nombre de posts chargés par requête.
   */
  const LIMIT = 10;

  /**
   * Fonction responsable du chargement des posts.
   *
   * useCallback permet d’éviter la recréation
   * inutile de la fonction entre les renders.
   */
  const loadPosts = useCallback(async () => {

    // Sécurité pour éviter les appels multiples simultanés
    if (loading) return;

    try {
      setLoading(true);

      // Appel API avec offset courant
      const newPosts = await fetchPosts(
        offsetRef.current,
        LIMIT
      );

      /**
       * On concatène les nouveaux posts
       * à la liste existante.
       *
       * Utilisation de la forme fonctionnelle
       * de setState pour garantir l’intégrité
       * en cas de re-render concurrent.
       */
      setPosts((prev) => [...prev, ...newPosts]);

      // Incrémentation de l’offset pour la prochaine requête
      offsetRef.current += LIMIT;

    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }

  }, [loading]);

  /**
   * Chargement initial du feed
   * (équivalent componentDidMount).
   */
  useEffect(() => {
    loadPosts();
  }, []);

  /**
   * Gestion du scroll infini.
   * Détecte si l’utilisateur est proche du bas
   * pour déclencher un nouveau chargement.
   */
  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {

    const { layoutMeasurement, contentOffset, contentSize } =
      event.nativeEvent;

    /**
     * On considère que l’utilisateur est en bas
     * lorsqu’il est à moins de 20px de la fin.
     */
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - 20;

    if (isCloseToBottom && !loading) {
      loadPosts();
    }
  };

  /**
   * Rendu principal du composant.
   */
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16} // fréquence de rafraîchissement du scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >

        {/**
         * Mapping des posts.
         * Le rendu dynamique est délégué à PostRenderer
         * afin de séparer la logique de sélection
         * du type de post.
         */}
        {posts.map((post) => (
          <PostRenderer
            key={post.post_id}
            post={post}
            navigation={navigation}
          />
        ))}

        {/**
         * Indicateur de chargement affiché
         * uniquement si une requête est active.
         */}
        {loading && (
          <ActivityIndicator size="large" color="#ff00ff" />
        )}
      </ScrollView>
    </View>
  );
}
