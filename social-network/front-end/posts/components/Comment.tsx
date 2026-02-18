import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { likeComment, unlikeComment } from "../../whatsup_functions/likeComment";
import { useVisiteProfileContext } from "../../../VisiteProfile/Contexts/VisiteProfileContext";
import { useLoginContext } from "../../../../../auth/login/login_contexts/LoginContext";
import { shortformattedTimeAgo } from "../../../../../generic_functions/getTimeSinceDate";
import { showToast } from "../../Whatsup";
import { verifIfCommentExist } from "../../whatsup_functions/verifIfExist";

interface Props {
  comment: any; // Objet commentaire (incluant children)
  navigation: any;
  toggleIsOverlayOpen: () => void;
  setAnswerToCommentId: (id: number) => void;
  setAnswerToPseudo: (pseudo: string) => void;
  setAnswerToUsrId: (id: number) => void;
  refresh: () => void;
  depth?: number; // 👈 niveau d’imbrication pour indentation
}

/**
 * Composant récursif représentant un commentaire.
 * 
 * Il :
 * - Gère son état local de likes (optimistic UI)
 * - Permet la réponse
 * - S’auto-rend pour ses enfants (récursivité)
 */
function Comment({
  comment,
  navigation,
  toggleIsOverlayOpen,
  setAnswerToCommentId,
  setAnswerToPseudo,
  setAnswerToUsrId,
  refresh,
  depth = 0, // Par défaut racine
}: Props) {

  const { navigate } = navigation;
  const { setVisiteProfileUsrID } = useVisiteProfileContext();
  const { profileGeneralInfo } = useLoginContext();

  /**
   * 🎯 State local des likes
   * 
   * On initialise avec les likes reçus en props.
   * Cela permet une gestion optimiste sans recharger
   * tout l’arbre immédiatement.
   */
  const [likeTab, setLikeTab] = useState<number[]>(comment.likes);

  /**
   * Synchronisation si les likes du commentaire
   * changent après refresh.
   */
  useEffect(() => {
    setLikeTab(comment.likes);
  }, [comment.likes]);

  /**
   * Valeur dérivée : l'utilisateur a-t-il liké ?
   */
  const hasLiked = likeTab.includes(profileGeneralInfo.usr_ID);

  /**
   * ❤️ Gestion optimiste du like
   * 
   * - Vérifie existence commentaire
   * - Appel API
   * - Mise à jour locale sans mutation
   */
  const handleLike = async () => {

    if (!(await verifIfCommentExist(comment.comment_id))) {
      showToast("Ce commentaire n'existe plus !");
      return;
    }

    if (hasLiked) {
      await unlikeComment(comment.comment_id, profileGeneralInfo.usr_ID);

      setLikeTab((prev) =>
        prev.filter((id) => id !== profileGeneralInfo.usr_ID)
      );

    } else {
      await likeComment(comment.comment_id, profileGeneralInfo.usr_ID);

      setLikeTab((prev) => [...prev, profileGeneralInfo.usr_ID]);
    }
  };

  return (
    <>
      {/* Bloc principal du commentaire */}
      <View
        style={{
          marginLeft: depth * 15, // 👈 indentation proportionnelle au niveau
          marginBottom: 15,
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 8 }}>

          {/* Avatar + navigation profil */}
          <TouchableOpacity
            onPress={() => {
              if (profileGeneralInfo.usr_ID !== comment.comment_usr_id) {
                toggleIsOverlayOpen(); // fermeture overlay
                setVisiteProfileUsrID(comment.comment_usr_id);
                navigate("VisiteProfile");
              }
            }}
          >
            <Image
              style={{ height: 40, width: 40, borderRadius: 20 }}
              source={{ uri: comment.usr_profilepicture }}
            />
          </TouchableOpacity>

          {/* Contenu commentaire */}
          <View style={{ flex: 1, marginLeft: 10 }}>

            {/* Alias */}
            <Text style={{ fontWeight: "600" }}>
              @{comment.usr_alias}
            </Text>

            {/* Texte */}
            <Text>{comment.comment_text}</Text>

            {/* Footer */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >

              {/* Date relative */}
              <Text style={{ fontSize: 10, color: "#999" }}>
                {shortformattedTimeAgo(comment.comment_date)}
              </Text>

              {/* Répondre */}
              <TouchableOpacity
                onPress={() => {
                  setAnswerToCommentId(comment.comment_id);
                  setAnswerToPseudo(comment.usr_alias);
                  setAnswerToUsrId(comment.usr_id);
                }}
              >
                <Text style={{ fontSize: 10, color: "#999" }}>
                  Répondre
                </Text>
              </TouchableOpacity>

              {/* Like */}
              <TouchableOpacity onPress={handleLike}>
                <Text style={{ fontSize: 11 }}>
                  {likeTab.length}{" "}
                  <FontAwesome5
                    name="heart"
                    size={11}
                    solid={hasLiked}
                    color="#00ff7f"
                  />
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </View>

      {/* 🔥 RÉCURSIVITÉ */}
      {/* Chaque commentaire peut rendre ses enfants */}
      {comment.children &&
        comment.children.map((child: any) => (
          <Comment
            key={child.comment_id}
            comment={child}
            navigation={navigation}
            toggleIsOverlayOpen={toggleIsOverlayOpen}
            setAnswerToCommentId={setAnswerToCommentId}
            setAnswerToPseudo={setAnswerToPseudo}
            setAnswerToUsrId={setAnswerToUsrId}
            refresh={refresh}
            depth={depth + 1} // 👈 incrémentation niveau
          />
        ))}
    </>
  );
}

/**
 * React.memo permet d’éviter les re-renders inutiles
 * si les props n’ont pas changé.
 */
export default React.memo(CommentComponent);
