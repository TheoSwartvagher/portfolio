
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * ============================================================================
 * AUTH MIDDLEWARE
 * ============================================================================
 *
 * Rôle :
 * - Vérifier la présence d’un token JWT
 * - Valider sa signature
 * - Injecter l’utilisateur décodé dans req.user
 *
 * Ce middleware protège les routes privées.
 *
 * ============================================================================
 */

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token manquant",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token invalide",
      });
    }

    // Vérification du token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: number; email: string };

    // Injection utilisateur dans la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Non autorisé",
    });
  }
};
