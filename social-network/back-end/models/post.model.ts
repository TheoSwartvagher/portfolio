
/**
 * ============================================================================
 * POST MODEL
 * ============================================================================
 *
 * Rôle :
 * - Définir la structure d’un Post
 * - Formaliser les DTO utilisés par les services
 * - Servir de contrat typé entre couches
 *
 * Aucune logique métier ici.
 *
 * ============================================================================
 */


/**
 * ---------------------------------------------------------------------------
 * Type principal représentant un Post tel qu'il existe en base
 * ---------------------------------------------------------------------------
 */
export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl: string | null;
  type: "simple" | "goal" | "challenge";
  createdAt: Date;
}


/**
 * ---------------------------------------------------------------------------
 * DTO pour la création d’un post
 * ---------------------------------------------------------------------------
 * Utilisé par le controller → service
 */
export interface CreatePostDTO {
  userId: number;
  content: string;
  imageUrl?: string;
  type?: "simple" | "goal" | "challenge";
}


/**
 * ---------------------------------------------------------------------------
 * DTO pour la réponse API
 * ---------------------------------------------------------------------------
 * Ce que le front reçoit réellement
 */
export interface PostResponseDTO {
  id: number;
  userId: number;
  content: string;
  imageUrl: string | null;
  type: string;
  createdAt: Date;

  // Données enrichies potentielles
  likesCount?: number;
  commentsCount?: number;
}


/**
 * ---------------------------------------------------------------------------
 * Mapper DB → Model
 * ---------------------------------------------------------------------------
 * Permet d’uniformiser les noms venant de la base
 * (snake_case → camelCase)
 */
export const mapPostFromDB = (row: any): Post => {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    imageUrl: row.image_url,
    type: row.type,
    createdAt: row.created_at,
  };
};
