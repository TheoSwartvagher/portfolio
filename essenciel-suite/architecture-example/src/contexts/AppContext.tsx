import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

/**
 * ============================================================================
 * APP CONTEXT (Example – Portfolio)
 * ============================================================================
 *
 * Contexte global minimal pour démontrer :
 * - Gestion d’un state global
 * - Centralisation des préférences applicatives
 * - Typage propre avec TypeScript
 *
 * Ce contexte est volontairement simple.
 * Il illustre la structure utilisée dans la suite Essenciel.
 * ============================================================================
 */


/**
 * ================================
 * Types
 * ================================
 */

type AppContextType = {

  isDarkMode: boolean;
  toggleDarkMode: () => void;
};


/**
 * ================================
 * Context
 * ================================
 */

const AppContext = createContext<AppContextType | undefined>(
  undefined
);


/**
 * ================================
 * Provider
 * ================================
 */

interface Props {
  children: ReactNode;
}

export function AppProvider({ children }: Props) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value: AppContextType = {
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}


/**
 * ================================
 * Hook custom
 * ================================
 */

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used within an AppProvider"
    );
  }

  return context;
}
