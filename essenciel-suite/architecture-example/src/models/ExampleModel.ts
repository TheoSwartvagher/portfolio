/**
 * ============================================================================
 * EXEMPLE MODEL
 * ============================================================================
 *
 * Ce fichier illustre la manière dont les modèles sont définis
 * dans l’architecture Essenciel.
 *
 * Objectifs :
 * - Centraliser les types métier
 * - Sécuriser les données avec TypeScript
 * - Clarifier la structure attendue des objets
 * - Faciliter l’évolution future de l’application
 *
 * Il s’agit ici d’un exemple volontairement simple
 * utilisé uniquement à des fins de démonstration.
 *
 * ============================================================================
 */


/**
 * ---------------------------------------------------------------------------
 * Exemple : Item principal de l’application
 * ---------------------------------------------------------------------------
 *
 * Représente une entité métier générique
 * (ex: objectif, routine, tâche, cercle, etc.)
 */
export interface ExampleItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  isActive: boolean;
}


/**
 * ---------------------------------------------------------------------------
 * Exemple : Statistiques associées
 * ---------------------------------------------------------------------------
 *
 * Permet d’illustrer une structure plus complexe.
 */
export interface ExampleStats {
  total: number;
  completed: number;
  completionRate: number;
}


/**
 * ---------------------------------------------------------------------------
 * Factory optionnelle (bonne pratique)
 * ---------------------------------------------------------------------------
 *
 * Permet de créer un objet proprement formatté.
 */
export const createExampleItem = (
  title: string,
  description?: string
): ExampleItem => {
  return {
    id: Date.now().toString(),
    title,
    description,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
};
