
import { Request, Response } from "express";
import * as commentService from "../services/comment.service";

/**
 * ============================================================================
 * COMMENT CONTROLLER
 * ============================================================================
 *
 * Rôle :
 * - Gérer la couche HTTP
 * - Valider les paramètres
 * - Appeler les services
 * - Retourner des réponses normalisées
 *
 * Aucune logique SQL ici.
 * Aucune logique métier complexe ici.
 *
 * ============================================================================
 */


/**
 * ---------------------------------------------------------------------------
 * GET /api/comments/:postId
 * ---------------------------------------------------------------------------
 * Récupère tous les commentaires d’un post
 */
export const getCommentsByPost = async (
  req: Request,
  res: Response
) => {
  try {
    const postId = Number(req.params.postId);

    if (!postId) {
      return res.status(400).json({
        message: "Invalid postId",
      });
    }

    const comments = await commentService.getCommentsByPost(postId);

    return res.status(200).json(comments);
  } catch (error) {
    console.error("getCommentsByPost error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * POST /api/comments
 * ---------------------------------------------------------------------------
 * Crée un nouveau commentaire
 */
export const createComment = async (
  req: Request,
  res: Response
) => {
  try {
    const { postId, userId, content, parentCommentId } = req.body;

    if (!postId || !userId || !content) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newComment = await commentService.createComment({
      postId,
      userId,
      content,
      parentCommentId: parentCommentId ?? null,
    });

    return res.status(201).json(newComment);
  } catch (error) {
    console.error("createComment error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * DELETE /api/comments/:commentId
 * ---------------------------------------------------------------------------
 * Supprime un commentaire
 */
export const deleteComment = async (
  req: Request,
  res: Response
) => {
  try {
    const commentId = Number(req.params.commentId);

    if (!commentId) {
      return res.status(400).json({
        message: "Invalid commentId",
      });
    }

    await commentService.deleteComment(commentId);

    return res.status(204).send();
  } catch (error) {
    console.error("deleteComment error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * POST /api/comments/:commentId/like
 * ---------------------------------------------------------------------------
 * Like un commentaire
 */
export const likeComment = async (
  req: Request,
  res: Response
) => {
  try {
    const commentId = Number(req.params.commentId);
    const { userId } = req.body;

    if (!commentId || !userId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    await commentService.likeComment(commentId, userId);

    return res.status(200).json({
      message: "Comment liked",
    });
  } catch (error) {
    console.error("likeComment error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * DELETE /api/comments/:commentId/like
 * ---------------------------------------------------------------------------
 * Unlike un commentaire
 */
export const unlikeComment = async (
  req: Request,
  res: Response
) => {
  try {
    const commentId = Number(req.params.commentId);
    const { userId } = req.body;

    if (!commentId || !userId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    await commentService.unlikeComment(commentId, userId);

    return res.status(200).json({
      message: "Comment unliked",
    });
  } catch (error) {
    console.error("unlikeComment error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
