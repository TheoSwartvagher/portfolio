import React from 'react';
import { View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { styles } from '../themes/adBannerStyle';

/**
 * ============================================================================
 * AD BANNER COMPONENT (Reusable – Essenciel Suite)
 * ============================================================================
 *
 * Composant publicitaire générique utilisé dans les applications
 * de la suite Essenciel.
 *
 * Objectifs :
 * - Centraliser l’intégration Google Mobile Ads
 * - Gérer automatiquement DEV / PROD
 * - Permettre différentes tailles de bannière
 * - Autoriser un adUnitId personnalisé si nécessaire
 *
 * Le composant reste volontairement simple et réutilisable.
 * ============================================================================
 */


/**
 * ================================
 * Types
 * ================================
 */

type Props = {
  size?: BannerAdSize;
  adUnitId?: string;
};


/**
 * ================================
 * Configuration ID
 * ================================
 */

const defaultAdUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-XXXXXXXXXXXX/XXXXXXXXXX';


/**
 * ================================
 * Component
 * ================================
 */

export const AdBanner = ({
  size = BannerAdSize.BANNER,
  adUnitId = defaultAdUnitId,
}: Props) => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          // Publicités non personnalisées (conformité RGPD)
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};
