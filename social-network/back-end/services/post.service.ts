
import { pool } from "../config/database";

/**
 * ============================================================================
 * POST SERVICE
 * ============================================================================
 *
 * Rôle :
 * - Contenir la logique métier liée aux posts
 * - Communiquer avec la base de données
 * - Retourner des données structurées
 *
 * Aucune logique HTTP ici.
 *
 * ============================================================================
 */

export type CreatePostDTO = {
  userId: number;
  content: string;
  imageUrl?: string;
  type?: string;
};

/**
 * ---------------------------------------------------------------------------
 * Récupérer le feed principal
 * ---------------------------------------------------------------------------
 * Peut inclure :
 * - posts des utilisateurs suivis
 * - tri par date
 * - pagination
 */
export const getFeedPosts = async (
  userId: number
) => {
  const query = `
    SELECT 
      p.id,
      p.user_id,
      p.content,
      p.image_url,
      p.type,
      p.created_at
    FROM posts p
    WHERE p.user_id = $1
       OR p.user_id IN (
         SELECT followed_id
         FROM follows
         WHERE follower_id = $1
       )
    ORDER BY p.created_at DESC
    LIMIT 50
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows;
};


/**
 * ---------------------------------------------------------------------------
 * Récupérer un post spécifique
 * ---------------------------------------------------------------------------
 */
export const getPostById = async (
  postId: number
) => {
  const query = `
    SELECT *
    FROM posts
    WHERE id = $1
  `;

  const { rows } = await pool.query(query, [postId]);

  return rows[0] || null;
};


/**
 * ---------------------------------------------------------------------------
 * Créer un post
 * ---------------------------------------------------------------------------
 */
export const createPost = async (
  data: CreatePostDTO
) => {
  const query = `
    INSERT INTO posts (user_id, content, image_url, type, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `;

  const values = [
    data.userId,
    data.content,
    data.imageUrl || null,
    data.type || "simple",
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};


/**
 * ---------------------------------------------------------------------------
 * Supprimer un post
 * ---------------------------------------------------------------------------
 * Vérifie que l'utilisateur est bien propriétaire
 */
export const deletePost = async (
  postId: number,
  userId: number
): Promise<boolean> => {
  const query = `
    DELETE FROM posts
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;

  const { rowCount } = await pool.query(query, [
    postId,
    userId,
  ]);

  return rowCount !== 0;
};
