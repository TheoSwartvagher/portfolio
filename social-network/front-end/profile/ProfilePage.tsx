import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLoginContext } from "../../../auth/login/login_contexts/LoginContext";

import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import ProfileMenuOverlay from "./components/ProfileMenuOverlay";
import ProfilePictureOverlay from "./components/ProfilePictureOverlay";
import OverlayFollowers from "./OverlayFollowers";
import OverlayFollowed from "./OverlayFollowed";

import { useProfileOverlays } from "./hooks/useProfileOverlays";
import { useProfilePicture } from "./hooks/useProfilePicture";
import { useProfileLogout } from "./hooks/useProfileLogout";

/**
 * Typage navigation minimal propre.
 * À étendre si nécessaire.
 */
type RootStackParamList = {
  Profile: undefined;
};

type ProfileNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface Props {
  navigation: ProfileNavigationProp;
}

/**
 * ===============================
 * PROFILE SCREEN
 * ===============================
 *
 * Rôle :
 * - Orchestration UI uniquement
 * - Injection des hooks métier
 * - Composition des sous-composants
 *
 * Aucune logique métier ici.
 */
export default function Profile({ navigation }: Props) {
  const { profileGeneralInfo } = useLoginContext();

  /**
   * Hooks métier externalisés
   */
  const { activeOverlay, openOverlay, closeOverlay } =
    useProfileOverlays();

  const {
    selectedImage,
    selectImage,
    validateProfilePicture,
  } = useProfilePicture();

  const { handleLogout } = useProfileLogout();

  /**
   * Loader centré propre
   */
  if (!profileGeneralInfo) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <ProfileHeader
        navigation={navigation}
        profile={profileGeneralInfo}
        onOpenMenu={() => openOverlay("menu")}
        onOpenPicture={() => openOverlay("picture")}
        onOpenFollowers={() => openOverlay("followers")}
        onOpenFollowed={() => openOverlay("followed")}
      />

      {/* TABS */}
      <ProfileTabs navigation={navigation} />

      {/* ================= OVERLAYS ================= */}

      <ProfileMenuOverlay
        visible={activeOverlay === "menu"}
        onClose={closeOverlay}
        onLogout={handleLogout}
      />

      <ProfilePictureOverlay
        visible={activeOverlay === "picture"}
        onClose={closeOverlay}
        currentImage={profileGeneralInfo.usr_profilePicture}
        selectedImage={selectedImage}
        onSelectImage={selectImage}
        onValidate={validateProfilePicture}
      />

      <OverlayFollowers
        visible={activeOverlay === "followers"}
        navigation={navigation}
        onClose={closeOverlay}
      />

      <OverlayFollowed
        visible={activeOverlay === "followed"}
        navigation={navigation}
        onClose={closeOverlay}
      />
    </View>
  );
}
