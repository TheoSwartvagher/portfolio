import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTranslation } from "../i18n/useTranslation";
import {theme} from "../themes/theme";
import {styles} from "../themes/globalStyle";
import Header from "../components/Header";

/**
 * ============================================================================
 * HOME SCREEN (PORTFOLIO EXAMPLE)
 * ============================================================================
 *
 * Cet écran est un exemple simplifié utilisé dans le portfolio.
 *
 * Objectif :
 * - Montrer la structure standard d’un écran Essenciel
 * - Illustrer l’utilisation du thème centralisé
 * - Illustrer l’intégration i18n dès la base
 * - Démontrer la séparation UI / logique
 *
 * Il ne s’agit pas d’un écran complet d’application,
 * mais d’un exemple architectural.
 *
 * ============================================================================
 */

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Header title={t("home.title")} />

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: theme.textPrimary },
          ]}
        >
          {t("home.welcome")}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme.textSecondary },
          ]}
        >
          {t("home.description")}
        </Text>
      </View>
    </View>
  );
}



