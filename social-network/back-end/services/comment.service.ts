import { pool } from "../config/pool";
import {
  Comment,
  mapCommentFromDb,
} from "../models/comment.model";

/**
 * ============================================================================
 * COMMENT SERVICE
 * ============================================================================
 *
 * Rôle :
 * - Contient la logique métier
 * - Dialogue avec la base de données
 * - Ne connaît PAS Express
 * - Ne retourne PAS de réponses HTTP
 *
 * ============================================================================
 */


/**
 * ---------------------------------------------------------------------------
 * Récupérer tous les commentaires d’un post
 * ---------------------------------------------------------------------------
 */
export const getCommentsByPost = async (
  postId: number
): Promise<Comment[]> => {
  const query = `
    SELECT *
    FROM comments
    WHERE post_id = $1
    ORDER BY created_at ASC
  `;

  const { rows } = await pool.query(query, [postId]);

  return rows.map(mapCommentFromDb);
};


/**
 * ---------------------------------------------------------------------------
 * Créer un commentaire
 * ---------------------------------------------------------------------------
 */
export const createComment = async ({
  postId,
  userId,
  content,
  parentCommentId,
}: {
  postId: number;
  userId: number;
  content: string;
  parentCommentId: number | null;
}): Promise<Comment> => {
  const query = `
    INSERT INTO comments (
      post_id,
      user_id,
      content,
      parent_comment_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    postId,
    userId,
    content,
    parentCommentId,
  ]);

  return mapCommentFromDb(rows[0]);
};


/**
 * ---------------------------------------------------------------------------
 * Supprimer un commentaire
 * ---------------------------------------------------------------------------
 */
export const deleteComment = async (
  commentId: number
): Promise<void> => {
  const query = `
    DELETE FROM comments
    WHERE id = $1
  `;

  await pool.query(query, [commentId]);
};


/**
 * ---------------------------------------------------------------------------
 * Like un commentaire
 * ---------------------------------------------------------------------------
 */
export const likeComment = async (
  commentId: number,
  userId: number
): Promise<void> => {
  const query = `
    INSERT INTO comment_likes (comment_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;

  await pool.query(query, [commentId, userId]);
};


/**
 * ---------------------------------------------------------------------------
 * Unlike un commentaire
 * ---------------------------------------------------------------------------
 */
export const unlikeComment = async (
  commentId: number,
  userId: number
): Promise<void> => {
  const query = `
    DELETE FROM comment_likes
    WHERE comment_id = $1 AND user_id = $2
  `;

  await pool.query(query, [commentId, userId]);
};
