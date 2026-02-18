
/**
 * ============================================================================
 * USER MODEL
 * ============================================================================
 *
 * Rôle :
 * - Normaliser les données venant de la base
 * - Supprimer les champs sensibles (ex: password)
 * - Typage strict
 *
 * ============================================================================
 */

export type User = {
  id: number;
  email: string;
};

export const UserModel = {
  fromDb: (row: any): User => ({
    id: row.id,
    email: row.email,
  }),
};
