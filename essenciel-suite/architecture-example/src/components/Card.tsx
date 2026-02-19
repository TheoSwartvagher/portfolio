import React from 'react';
import {
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { styles } from '../themes/cardStyle';

/**
 * ============================================================================
 * CARD (Reusable UI Component – Essenciel Suite)
 * ============================================================================
 *
 * Composant conteneur standardisé.
 *
 * Objectifs :
 * - Wrapper réutilisable
 * - Support pressable optionnel
 * - Feedback visuel cohérent
 * - Typage propre
 * - Architecture scalable
 *
 * Ce composant fait partie du design system commun
 * utilisé dans les applications de la suite Essenciel.
 * ============================================================================
 */

interface Props {
  children: React.ReactNode;

  /**
   * Si défini, la Card devient interactive
   */
  onPress?: () => void;

  /**
   * Permet surcharge du style externe
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Désactive l'interaction si onPress est fourni
   */
  disabled?: boolean;

  /**
   * Permet de désactiver l’ombre si nécessaire
   */
  noShadow?: boolean;
}

export const Card: React.FC<Props> = ({
  children,
  onPress,
  style,
  disabled = false,
  noShadow = false,
}) => {
  const baseStyle = [
    styles.card,
    noShadow && styles.noShadow,
    style,
  ];

  /**
   * Mode interactif
   */
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          ...baseStyle,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  /**
   * Mode statique
   */
  return <View style={baseStyle}>{children}</View>;
};

