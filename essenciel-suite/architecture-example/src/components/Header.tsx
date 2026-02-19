import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Pressable,
  Animated,
  Image,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../themes/headerStyle';

/**
 * ============================================================================
 * HEADER (Animated Accordion – Portfolio Example)
 * ============================================================================
 *
 * Objectifs démontrés :
 * - Animation contrôlée avec Animated API
 * - Menu accordéon fluide
 * - Animation passive indépendante
 * - Composant UI isolé et réutilisable
 *
 * Ce composant illustre la capacité à créer :
 * - des micro-interactions
 * - une navigation animée
 * - une UI dynamique mais structurée
 *
 * Il est volontairement générique pour le portfolio.
 * ============================================================================
 */

export const Header = () => {
  const [open, setOpen] = useState(false);

  /**
   * Animation d'ouverture du menu
   */
  const menuAnim = useRef(new Animated.Value(0)).current;

  /**
   * Animation passive du logo (micro-interaction)
   */
  const idleAnim = useRef(new Animated.Value(0)).current;

  /**
   * Animation passive infinie du logo
   */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(1500),
        Animated.timing(idleAnim, {
          toValue: -4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(idleAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [idleAnim]);

  /**
   * Toggle menu accordéon
   */
  const toggleMenu = () => {
    Animated.timing(menuAnim, {
      toValue: open ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    setOpen(!open);
  };

  /**
   * Style du menu accordéon
   */
  const actionsStyle = {
    opacity: menuAnim,
    transform: [
      {
        translateX: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 50],
        }),
      },
    ],
  };

  /**
   * Style du logo :
   * combine animation passive + déplacement accordéon
   */
  const logoStyle = {
    transform: [
      {
        translateX: Animated.add(
          idleAnim,
          menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 70],
          })
        ),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Menu accordéon */}
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        style={[styles.actionsRow, actionsStyle]}
      >
        <Pressable style={styles.action}>
          <Icon name="language" size={18} />
        </Pressable>

        <Pressable style={styles.action}>
          <Icon name="attach-money" size={18} />
        </Pressable>

        <Pressable style={styles.action}>
          <Icon name="info" size={18} />
        </Pressable>
      </Animated.View>

      {/* Logo central animé */}
      <Animated.View style={logoStyle}>
        <Pressable onPress={toggleMenu} hitSlop={10}>
          <Image
            source={require('../../assets/logo/example.png')}
            style={styles.logo}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};
