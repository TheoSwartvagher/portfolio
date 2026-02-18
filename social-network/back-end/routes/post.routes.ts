
import { Router } from "express";
import {
  getFeedPosts,
  getPostById,
  createPost,
  deletePost,
  likePost,
  unlikePost,
} from "../controllers/post.controller";

/**
 * ============================================================================
 * POST ROUTES
 * ============================================================================
 *
 * Rôle :
 * - Définir les endpoints liés aux posts
 * - Rediriger vers les controllers
 *
 * Aucune logique métier ici.
 *
 * Convention REST utilisée :
 * - GET    -> lecture
 * - POST   -> création / action
 * - DELETE -> suppression
 *
 * ============================================================================
 */

const router = Router();

/**
 * Récupérer le feed principal
 * GET /api/posts
 */
router.get("/", getFeedPosts);

/**
 * Récupérer un post spécifique
 * GET /api/posts/:postId
 */
router.get("/:postId", getPostById);

/**
 * Créer un post
 * POST /api/posts
 */
router.post("/", createPost);

/**
 * Supprimer un post
 * DELETE /api/posts/:postId
 */
router.delete("/:postId", deletePost);

/**
 * Like un post
 * POST /api/posts/:postId/like
 */
router.post("/:postId/like", likePost);

/**
 * Unlike un post
 * DELETE /api/posts/:postId/like
 */
router.delete("/:postId/like", unlikePost);

export default router;
