import React from 'react';
import {
  Text,
  Pressable,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { styles } from '../themes/primaryButtonStyle';

/**
 * ============================================================================
 * PRIMARY BUTTON (Reusable – Essenciel Suite)
 * ============================================================================
 *
 * Composant bouton principal standardisé.
 *
 * Objectifs :
 * - Réutilisable dans toutes les apps de la suite
 * - Gestion disabled
 * - Gestion loading
 * - Style centralisé via theme
 * - Typage propre TypeScript
 *
 * Ce composant représente le bouton principal
 * utilisé dans les formulaires et actions primaires.
 * ============================================================================
 */


/**
 * ================================
 * Types
 * ================================
 */

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}


/**
 * ================================
 * Component
 * ================================
 */

export const Button: React.FC<Props> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text
          style={[
            styles.text,
            isDisabled && styles.textDisabled,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};
