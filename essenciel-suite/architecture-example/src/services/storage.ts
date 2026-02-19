import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * ============================================================================
 * STORAGE SERVICE
 * ============================================================================
 *
 * Rôle :
 * - Centraliser l’accès à AsyncStorage
 * - Uniformiser la sérialisation / désérialisation
 * - Éviter la duplication de code
 * - Fournir une base réutilisable dans toutes les apps Essenciel
 *
 * Ce fichier ne contient AUCUNE logique métier.
 * Les clés spécifiques à une app doivent être définies ailleurs.
 *
 * ============================================================================
 */

/**
 * Sauvegarde une valeur (automatiquement JSON.stringify si objet)
 */
export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);

    await AsyncStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Storage setItem error:", error);
    throw error;
  }
};

/**
 * Récupère une valeur typée
 */
export const getItem = async <T>(
  key: string
): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      // Si ce n'est pas du JSON (string simple)
      return value as unknown as T;
    }
  } catch (error) {
    console.error("Storage getItem error:", error);
    throw error;
  }
};

/**
 * Supprime une clé
 */
export const removeItem = async (
  key: string
): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Storage removeItem error:", error);
    throw error;
  }
};

/**
 * Clear complet (rarement utilisé)
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Storage clear error:", error);
    throw error;
  }
};
