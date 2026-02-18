import React, { useState, useEffect, useCallback } from "react";
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

interface Props {
  visible: boolean;
  onClose: () => void;
  postId: number;
  postOwnerId: number;
  navigation: any; // typable si tu as RootStack
}

export default function CommentsOverlay({
  visible,
  onClose,
  postId,
  postOwnerId,
  navigation,
}: Props) {
  const { profileGeneralInfo } = useLoginContext();

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [answerToCommentId, setAnswerToCommentId] = useState<number | null>(null);
  const [answerToPseudo, setAnswerToPseudo] = useState<string | null>(null);
  const [answerToUsrId, setAnswerToUsrId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  /**
   * Chargement commentaires
   */
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await selectCommentPost(postOwnerId, postId, 0);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postOwnerId, postId]);

  /**
   * Chargement à l'ouverture
   */
  useEffect(() => {
    if (visible) {
      loadComments();
    }
  }, [visible, loadComments]);

  /**
   * Callback unique pour répondre
   */
  const handleReply = useCallback(
    (commentId: number, pseudo: string, usrId: number) => {
      setAnswerToCommentId(commentId);
      setAnswerToPseudo(pseudo);
      setAnswerToUsrId(usrId);
    },
    []
  );

  /**
   * Ajout commentaire
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

      setNewComment("");
      setAnswerToCommentId(null);
      setAnswerToPseudo(null);
      setAnswerToUsrId(null);

      await loadComments();

      showToast("Votre commentaire a été ajouté !");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
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
              <Text style={{ color: "#ff00ff" }}>Fermer</Text>
            </TouchableOpacity>
          </View>

          {/* LISTE */}
          <ScrollView style={{ flex: 1 }}>
            {comments.map((comment) => (
              <Comment
                key={comment.comment_id}
                comment={comment}
                onReply={handleReply}
                onRefresh={loadComments}
                navigation={navigation}
              />
            ))}

            {loading && <ActivityIndicator size="small" />}
          </ScrollView>

          {/* INPUT */}
          <View style={{ marginTop: 10 }}>
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
                answerToCommentId
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
