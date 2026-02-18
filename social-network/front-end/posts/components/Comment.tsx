
import React, { useMemo, useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import Answer from "./Answer";

import { useVisiteProfileContext } from "../../../VisiteProfile/Contexts/VisiteProfileContext";
import { useLoginContext } from "../../../../../auth/login/login_contexts/LoginContext";
import { likeComment, unlikeComment } from "../../whatsup_functions/likeComment";
import { shortformattedTimeAgo } from "../../../../../generic_functions/getTimeSinceDate";
import { handleDeleteCommentAction } from "../../whatsup_functions/commentPost";
import { showToast } from "../../Whatsup";
import { Overlay } from "react-native-elements";
import { getDateToSentance } from "../../../../../generic_functions/getDateToSentance";
import { verifIfCommentExist } from "../../whatsup_functions/verifIfExist";

interface Props {
  updateCommentTab: any;
  commentTab: any[];
  setCommentTab: any;
  navigation: any;
  toggleIsOverlayOpen: () => void;
  setAnswerToCommentId: (id: number) => void;
  setAnswerToPseudo: (pseudo: string) => void;
  setAnswerToUsrId: (id: number) => void;

  comment_id: number;
  comment_text: string;
  comment_date: string;
  usr_id: number;
  comment_usr_id: number;
  usr_alias: string;
  usr_profilepicture: string;
  usr_pseudo: string;
  usr_certification: boolean;
  likes: number[];
}

export default function Comment(props: Props) {
  const {
    updateCommentTab,
    commentTab,
    navigation,
    toggleIsOverlayOpen,
    setAnswerToCommentId,
    setAnswerToPseudo,
    setAnswerToUsrId,
    comment_id,
    comment_text,
    comment_date,
    usr_id,
    comment_usr_id,
    usr_alias,
    usr_profilepicture,
    usr_certification,
    likes,
  } = props;

  const { navigate } = navigation;
  const { setVisiteProfileUsrID } = useVisiteProfileContext();
  const { profileGeneralInfo } = useLoginContext();

  const [likeTab, setLikeTab] = useState<number[]>(likes);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const hasLiked = likeTab.includes(profileGeneralInfo.usr_ID);

  /**
   * Answers dérivés dynamiquement
   */
  const answers = useMemo(() => {
    return commentTab
      .filter((c) => c.answerto_commentid === comment_id)
      .map((answer) => (
        <Answer
          key={answer.comment_id}
          navigation={navigation}
          toggleIsOverlayOpen={toggleIsOverlayOpen}
          commentTab={commentTab}
          updateCommentTab={updateCommentTab}
          setAnswerToPseudo={setAnswerToPseudo}
          setAnswerToCommentId={setAnswerToCommentId}
          setAnswerToUsrId={setAnswerToUsrId}
          {...answer}
        />
      ));
  }, [commentTab, comment_id]);

  /**
   * Like optimiste propre (sans mutation)
   */
  const handleLike = async () => {
    if (!(await verifIfCommentExist(comment_id))) {
      showToast("Ce commentaire n'existe plus !");
      return;
    }

    if (hasLiked) {
      await unlikeComment(comment_id, profileGeneralInfo.usr_ID);
      setLikeTab((prev) =>
        prev.filter((id) => id !== profileGeneralInfo.usr_ID)
      );
    } else {
      await likeComment(comment_id, profileGeneralInfo.usr_ID);
      setLikeTab((prev) => [...prev, profileGeneralInfo.usr_ID]);
    }
  };

  return (
    <>
      <View style={{ marginLeft: 10, marginBottom: 15 }}>
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => {
              if (profileGeneralInfo.usr_ID !== comment_usr_id) {
                toggleIsOverlayOpen();
                setVisiteProfileUsrID(comment_usr_id);
                navigate("VisiteProfile");
              }
            }}
          >
            <Image
              style={{ height: 45, width: 45, borderRadius: 22 }}
              source={{ uri: usr_profilepicture }}
            />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: "600" }}>
              @{usr_alias}
              {usr_certification && (
                <FontAwesome5
                  name="certificate"
                  size={12}
                  color="#00ff7f"
                />
              )}
            </Text>

            <Text>{comment_text}</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <Text style={{ fontSize: 10, color: "#999" }}>
                {shortformattedTimeAgo(comment_date)}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setAnswerToCommentId(comment_id) ||
                  setAnswerToPseudo(usr_alias) ||
                  setAnswerToUsrId(usr_id)
                }
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

      {answers}
    </>
  );
}
