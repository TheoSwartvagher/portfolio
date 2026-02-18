
import { Request, Response } from "express";
import * as postService from "../services/post.service";

/**
 * ============================================================================
 * POST CONTROLLER
 * ============================================================================
 *
 * Rôle :
 * - Gérer la couche HTTP
 * - Extraire les paramètres de la requête
 * - Appeler le service métier
 * - Retourner une réponse structurée
 *
 * Aucune logique base de données ici.
 *
 * ============================================================================
 */


/**
 * ---------------------------------------------------------------------------
 * GET /api/posts
 * ---------------------------------------------------------------------------
 * Récupérer le feed principal
 */
export const getFeedPosts = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.query.userId);

    const posts = await postService.getFeedPosts(userId);

    return res.status(200).json(posts);
  } catch (error) {
    console.error("getFeedPosts error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération du feed",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * GET /api/posts/:postId
 * ---------------------------------------------------------------------------
 * Récupérer un post spécifique
 */
export const getPostById = async (
  req: Request,
  res: Response
) => {
  try {
    const postId = Number(req.params.postId);

    const post = await postService.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post introuvable",
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("getPostById error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération du post",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * POST /api/posts
 * ---------------------------------------------------------------------------
 * Créer un nouveau post
 */
export const createPost = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, content, imageUrl, type } = req.body;

    if (!userId || !content) {
      return res.status(400).json({
        message: "Paramètres manquants",
      });
    }

    const newPost = await postService.createPost({
      userId,
      content,
      imageUrl,
      type,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("createPost error:", error);
    return res.status(500).json({
      message: "Erreur lors de la création du post",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * DELETE /api/posts/:postId
 * ---------------------------------------------------------------------------
 * Supprimer un post
 */
export const deletePost = async (
  req: Request,
  res: Response
) => {
  try {
    const postId = Number(req.params.postId);
    const userId = Number(req.body.userId);

    const success = await postService.deletePost(
      postId,
      userId
    );

    if (!success) {
      return res.status(403).json({
        message: "Suppression non autorisée",
      });
    }

    return res.status(200).json({
      message: "Post supprimé avec succès",
    });
  } catch (error) {
    console.error("deletePost error:", error);
    return res.status(500).json({
      message: "Erreur lors de la suppression",
    });
  }
};
