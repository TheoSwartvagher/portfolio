
import { Request, Response, NextFunction } from "express";

/**
 * ============================================================================
 * GLOBAL ERROR MIDDLEWARE
 * ============================================================================
 *
 * Rôle :
 * - Centraliser la gestion des erreurs
 * - Uniformiser les réponses API
 * - Éviter la duplication des try/catch
 *
 * Ce middleware doit être placé EN DERNIER dans server.ts
 *
 * ============================================================================
 */

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      err.message || "Une erreur interne est survenue",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
