import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import Comment from "./Comments/Comment";
import { selectCommentPost } from "../whatsup_functions/commentPost";
import { addComment } from "../whatsup_functions/addComment";
import { useLoginContext } from "../../../../auth/login/login_contexts/LoginContext";
import { showToast } from "../Whatsup";

/**
 * Type représentant un commentaire sous forme de noeud hiérarchique.
 * 
 * - answerto_commentid : null si commentaire racine
 * - children : tableau de réponses imbriquées
 * 
 * On ajoute un index signature pour conserver toutes les autres
 * propriétés renvoyées par l’API.
 */
export interface CommentNode {
  comment_id: number;
  answerto_commentid: number | null;
  likes: number[];
  children?: CommentNode[];
  [key: string]: any;
}

interface Props {
  visible: boolean;        // contrôle ouverture du modal
  onClose: () => void;     // callback fermeture
  postId: number;          // id du post
  postOwnerId: number;     // id du propriétaire du post
  navigation: any;         // navigation React Navigation
}

export default function CommentsOverlay({
  visible,
  onClose,
  postId,
  postOwnerId,
  navigation,
}: Props) {

  /**
   * Récupération des infos utilisateur connecté
   */
  const { profileGeneralInfo } = useLoginContext();

  /**
   * State principal :
   * - comments : liste plate renvoyée par l’API
   * - loading : état de chargement
   */
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * State lié à la réponse à un commentaire
   */
  const [answerToCommentId, setAnswerToCommentId] = useState<number | null>(null);
  const [answerToPseudo, setAnswerToPseudo] = useState<string | null>(null);
  const [answerToUsrId, setAnswerToUsrId] = useState<number | null>(null);

  /**
   * State du champ input
   */
  const [newComment, setNewComment] = useState("");

  /**
   * 🔄 Chargement des commentaires
   * 
   * useCallback pour éviter la recréation inutile
   * lors des re-renders.
   */
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);

      // Appel API : récupération liste plate
      const data = await selectCommentPost(postOwnerId, postId, 0);

      setComments(data);

    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postOwnerId, postId]);

  /**
   * Chargement automatique lorsque le modal s’ouvre
   */
  useEffect(() => {
    if (visible) {
      loadComments();
    }
  }, [visible, loadComments]);

  /**
   * 🏗 Construction de l’arbre hiérarchique des commentaires
   * 
   * Complexité O(n)
   * 
   * 1. Création d’un Map<id, comment>
   * 2. Parcours pour rattacher chaque commentaire à son parent
   * 3. Les commentaires sans parent deviennent des "roots"
   * 
   * useMemo évite de reconstruire l’arbre
   * tant que comments ne change pas.
   */
  const commentsTree = useMemo(() => {

    const map = new Map<number, CommentNode>();
    const roots: CommentNode[] = [];

    // Étape 1 : indexation
    comments.forEach((comment) => {
      map.set(comment.comment_id, {
        ...comment,
        children: [],
      });
    });

    // Étape 2 : liaison parent/enfant
    map.forEach((comment) => {
      if (comment.answerto_commentid === null) {
        roots.push(comment);
      } else {
        const parent = map.get(comment.answerto_commentid);
        if (parent) {
          parent.children!.push(comment);
        }
      }
    });

    return roots;

  }, [comments]);

  /**
   * ➕ Ajout d’un commentaire ou d’une réponse
   */
  const handleAddComment = async () => {

    if (!newComment.trim()) return;

    try {

      await addComment(
        postOwnerId,
        postId,
        profileGeneralInfo.usr_ID,
        newComment,
        answerToCommentId,
        answerToPseudo,
        answerToUsrId
      );

      // Reset states
      setNewComment("");
      setAnswerToCommentId(null);
      setAnswerToPseudo(null);
      setAnswerToUsrId(null);

      // Reload commentaires pour synchronisation
      await loadComments();

      showToast("Votre commentaire a été ajouté !");

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>

      {/* Overlay semi-transparent */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >

        {/* Conteneur principal */}
        <View
          style={{
            height: "80%",
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}
        >

          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              Commentaires
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#ff00ff" }}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>

          {/* LISTE DES COMMENTAIRES */}
          <ScrollView style={{ flex: 1 }}>
            {commentsTree.map((comment) => (
              <Comment
                key={comment.comment_id}
                comment={comment}
                navigation={navigation}
                toggleIsOverlayOpen={onClose}
                setAnswerToCommentId={setAnswerToCommentId}
                setAnswerToPseudo={setAnswerToPseudo}
                setAnswerToUsrId={setAnswerToUsrId}
                refresh={loadComments}
              />
            ))}

            {loading && <ActivityIndicator size="small" />}
          </ScrollView>

          {/* INPUT DE SAISIE */}
          <View style={{ marginTop: 10 }}>

            {/* Annulation réponse */}
            {answerToCommentId && (
              <TouchableOpacity
                onPress={() => {
                  setAnswerToCommentId(null);
                  setAnswerToPseudo(null);
                  setAnswerToUsrId(null);
                }}
              >
                <Text style={{ color: "#aaa", fontSize: 12 }}>
                  Annuler la réponse
                </Text>
              </TouchableOpacity>
            )}

            <TextInput
              placeholder={
                answerToCommentId
                  ? `Répondre à @${answerToPseudo}`
                  : "Ajouter un commentaire..."
              }
              value={
                answerToCommentId && answerToPseudo
                  ? `@${answerToPseudo} ${newComment}`
                  : newComment
              }
              onChangeText={(text) => {
                if (answerToCommentId && answerToPseudo) {
                  setNewComment(text.substring(answerToPseudo.length + 2));
                } else {
                  setNewComment(text);
                }
              }}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 8,
                padding: 10,
                minHeight: 60,
                marginBottom: 10,
              }}
            />

            <TouchableOpacity
              onPress={handleAddComment}
              style={{ alignItems: "flex-end" }}
            >
              <Text style={{ fontWeight: "600", color: "#ff00ff" }}>
                Publier <FontAwesome5 name="paper-plane" size={14} />
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
}
