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
  comment: any;
  navigation: any;
  toggleIsOverlayOpen: () => void;
  setAnswerToCommentId: (id: number) => void;
  setAnswerToPseudo: (pseudo: string) => void;
  setAnswerToUsrId: (id: number) => void;
  refresh: () => void;
  depth?: number; // 👈 important pour indentation
}

function CommentComponent({
  comment,
  navigation,
  toggleIsOverlayOpen,
  setAnswerToCommentId,
  setAnswerToPseudo,
  setAnswerToUsrId,
  refresh,
  depth = 0,
}: Props) {
  const { navigate } = navigation;
  const { setVisiteProfileUsrID } = useVisiteProfileContext();
  const { profileGeneralInfo } = useLoginContext();

  const [likeTab, setLikeTab] = useState<number[]>(comment.likes);

  useEffect(() => {
    setLikeTab(comment.likes);
  }, [comment.likes]);

  const hasLiked = likeTab.includes(profileGeneralInfo.usr_ID);

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
      <View
        style={{
          marginLeft: depth * 15, // 👈 indentation dynamique
          marginBottom: 15,
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => {
              if (profileGeneralInfo.usr_ID !== comment.comment_usr_id) {
                toggleIsOverlayOpen();
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

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: "600" }}>
              @{comment.usr_alias}
            </Text>

            <Text>{comment.comment_text}</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <Text style={{ fontSize: 10, color: "#999" }}>
                {shortformattedTimeAgo(comment.comment_date)}
              </Text>

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

      {/* 🔥 RÉCURSIVITÉ PURE */}
      {comment.children &&
        comment.children.map((child: any) => (
          <CommentComponent
            key={child.comment_id}
            comment={child}
            navigation={navigation}
            toggleIsOverlayOpen={toggleIsOverlayOpen}
            setAnswerToCommentId={setAnswerToCommentId}
            setAnswerToPseudo={setAnswerToPseudo}
            setAnswerToUsrId={setAnswerToUsrId}
            refresh={refresh}
            depth={depth + 1}
          />
        ))}
    </>
  );
}

export default React.memo(CommentComponent);
