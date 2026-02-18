
/**
 * ============================================================================
 * COMMENT MODEL
 * ============================================================================
 *
 * Rôle :
 * - Définir la structure typée d’un commentaire côté application
 * - Transformer les données provenant de la base (snake_case)
 *   vers un format propre côté backend (camelCase)
 *
 * Cette couche évite :
 * - D’exposer directement la structure SQL
 * - De propager le snake_case dans toute l’application
 *
 * ============================================================================
 */


/**
 * ---------------------------------------------------------------------------
 * Interface principale côté application
 * ---------------------------------------------------------------------------
 */
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  parentCommentId: number | null;
  createdAt: Date;
  updatedAt: Date | null;
}


/**
 * ---------------------------------------------------------------------------
 * Type représentant une ligne brute venant de la base de données
 * (format snake_case)
 * ---------------------------------------------------------------------------
 */
export interface CommentDbRow {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  parent_comment_id: number | null;
  created_at: Date;
  updated_at: Date | null;
}


/**
 * ---------------------------------------------------------------------------
 * Mapper DB → Application
 * ---------------------------------------------------------------------------
 *
 * Transforme une ligne SQL brute vers un objet propre pour l’application.
 *
 * Exemple :
 * post_id → postId
 * created_at → createdAt
 */
export const mapCommentFromDb = (
  row: CommentDbRow
): Comment => {
  return {
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    content: row.content,
    parentCommentId: row.parent_comment_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
