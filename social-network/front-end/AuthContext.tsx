import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

/**
 * ============================================================================
 * AUTH CONTEXT (Minimal Example)
 * ============================================================================
 *
 * Ceci est un exemple volontairement minimaliste d’un AuthContext adapté
 * à une application React / React Native.
 *
 * L’objectif ici est architectural :
 * - Montrer une structure propre et maintenable
 * - Centraliser la logique d’authentification
 * - Exposer une API claire au reste de l’application
 *
 * Les appels API sont volontairement simulés afin de ne pas surcharger
 * la lisibilité avec des détails d’implémentation réseau.
 *
 * Dans le projet réel, les fonctions login/register appelaient
 * un backend via Axios, avec gestion de tokens.
 *
 * ============================================================================
 */


/**
 * ============================================================================
 * Types
 * ============================================================================
 */

/**
 * Représentation minimale d’un utilisateur authentifié.
 * 
 * On garde ici uniquement les champs nécessaires au contexte global.
 * Les données détaillées (profil étendu, préférences, etc.)
 * doivent être gérées dans d’autres modules dédiés.
 */
export type User = {
  id: number;
  email: string;
  pseudo: string;
};

/**
 * Interface exposée par le contexte.
 *
 * L’idée est d’exposer uniquement :
 * - L’état courant
 * - Les actions métier
 *
 * On n’expose jamais les setters internes.
 */
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};


/**
 * ============================================================================
 * Context
 * ============================================================================
 *
 * On initialise le contexte avec undefined afin d’obliger
 * son utilisation à l’intérieur du Provider.
 */
const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);


/**
 * ============================================================================
 * Provider
 * ============================================================================
 */

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  /**
   * État interne du contexte.
   *
   * - user : représente l’utilisateur authentifié
   * - loading : permet de gérer les états de chargement
   */
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);


  /**
   * ============================================================================
   * LOGIN
   * ============================================================================
   *
   * Simule un appel API.
   *
   * Dans une implémentation réelle :
   * - Appel backend
   * - Vérification des identifiants
   * - Récupération d’un token
   * - Stockage sécurisé (AsyncStorage / SecureStore)
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Simulation d’un délai réseau
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      // Ici serait placé l’appel API réel

      setUser({
        id: 1,
        email,
        pseudo: "DemoUser",
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  /**
   * ============================================================================
   * REGISTER
   * ============================================================================
   *
   * Même logique que login.
   *
   * Dans un projet réel :
   * - Validation backend
   * - Création utilisateur
   * - Login automatique possible
   */
  const register = async (
    email: string,
    password: string
  ) => {
    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      setUser({
        id: 1,
        email,
        pseudo: "NewUser",
      });
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  /**
   * ============================================================================
   * LOGOUT
   * ============================================================================
   *
   * Supprime simplement l’utilisateur du state.
   *
   * Dans un projet réel :
   * - Suppression du token
   * - Invalidation backend éventuelle
   */
  const logout = () => {
    setUser(null);
  };


  /**
   * ============================================================================
   * Valeur exposée
   * ============================================================================
   *
   * On dérive isAuthenticated directement de user.
   * Cela évite toute duplication d’état.
   */
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


/**
 * ============================================================================
 * Hook personnalisé
 * ============================================================================
 *
 * Permet d’utiliser le contexte proprement.
 *
 * On force son usage à l’intérieur du Provider
 * pour éviter des erreurs silencieuses.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}
