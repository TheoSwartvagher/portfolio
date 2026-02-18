import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * ============================================================================
 * API SERVICE
 * ============================================================================
 *
 * Ce fichier représente la couche d’abstraction réseau de l’application.
 *
 * Objectifs :
 * - Centraliser la configuration axios
 * - Éviter d’utiliser fetch / axios directement dans les composants
 * - Préparer la gestion des tokens (JWT, refresh, etc.)
 * - Uniformiser la gestion des erreurs
 *
 * IMPORTANT :
 * Ce fichier ne contient aucune logique métier.
 * Il ne connaît ni les posts, ni les users, ni l’UI.
 *
 * Il fournit uniquement une interface réseau générique.
 *
 * ============================================================================
 */


/**
 * Instance axios unique pour toute l’application.
 *
 * Avantages :
 * - Configuration centralisée
 * - Timeout global
 * - Headers communs
 * - Interceptors applicables partout
 */
const api: AxiosInstance = axios.create({
  baseURL: "https://api.example.com", // À remplacer par ton backend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


/**
 * ============================================================================
 * INTERCEPTORS
 * ============================================================================
 *
 * Les interceptors permettent d'intercepter toutes les requêtes
 * et toutes les réponses avant qu’elles ne soient utilisées.
 *
 * Cas d’usage typiques :
 * - Injecter automatiquement un token
 * - Logger les requêtes
 * - Gérer un refresh token
 * - Centraliser la gestion des erreurs
 */


/**
 * Interceptor des requêtes
 *
 * Ici on pourrait injecter un token stocké dans AsyncStorage.
 * Cela évite d’ajouter manuellement l’Authorization header partout.
 */
api.interceptors.request.use(
  async (config) => {

    // Exemple d’ajout de token :
    // const token = await AsyncStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);


/**
 * Interceptor des réponses
 *
 * Permet une gestion d’erreurs centralisée.
 * Évite de dupliquer console.error dans tous les services.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response) {
      // Erreur backend (400, 401, 500…)
      console.error("API Error:", error.response.data);
    } else {
      // Erreur réseau ou timeout
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);


/**
 * ============================================================================
 * MÉTHODES GÉNÉRIQUES
 * ============================================================================
 *
 * Ces méthodes sont typées avec <T>.
 * Cela permet d’avoir un retour strictement typé côté TypeScript.
 *
 * Exemple :
 * const posts = await apiService.get<Post[]>("/posts");
 *
 * ============================================================================
 */

export const apiService = {

  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};

export default apiService;
