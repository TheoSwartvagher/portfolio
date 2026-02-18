import { Router } from "express";
import {
  getCommentsByPost,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from "../controllers/comment.controller";

/**
 * ============================================================================
 * COMMENT ROUTES
 * ============================================================================
 *
 * Rôle :
 * - Définir les endpoints liés aux commentaires
 * - Rediriger vers les controllers
 *
 * Aucune logique métier ici.
 *
 * ============================================================================
 */

const router = Router();

/**
 * Récupérer les commentaires d’un post
 * GET /api/comments/:postId
 */
router.get("/:postId", getCommentsByPost);

/**
 * Ajouter un commentaire
 * POST /api/comments
 */
router.post("/", createComment);

/**
 * Supprimer un commentaire
 * DELETE /api/comments/:commentId
 */
router.delete("/:commentId", deleteComment);

/**
 * Like un commentaire
 * POST /api/comments/:commentId/like
 */
router.post("/:commentId/like", likeComment);

/**
 * Unlike un commentaire
 * DELETE /api/comments/:commentId/like
 */
router.delete("/:commentId/like", unlikeComment);

export default router;
