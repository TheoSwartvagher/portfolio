/**
 * ============================================================================
 * SERVER ENTRY POINT
 * ============================================================================
 *
 * Rôle :
 * - Initialiser l'application Express
 * - Configurer les middlewares globaux
 * - Déclarer les routes principales
 * - Gérer les erreurs globales
 * - Démarrer le serveur
 *
 * Ce fichier ne contient aucune logique métier.
 * Il sert uniquement de point d’entrée de l’API.
 *
 * ============================================================================
 */

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Routes principales
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";

/**
 * ============================================================================
 * INITIALISATION
 * ============================================================================
 */

const app: Application = express();
const PORT = process.env.PORT || 5000;

/**
 * ============================================================================
 * MIDDLEWARES GLOBAUX
 * ============================================================================
 */

// Sécurité basique HTTP headers
app.use(helmet());

// Autoriser les requêtes cross-origin
app.use(cors());

// Logger développement
app.use(morgan("dev"));

// Parser JSON
app.use(express.json());

/**
 * ============================================================================
 * ROUTES PRINCIPALES
 * ============================================================================
 */

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

/**
 * ============================================================================
 * ROUTE HEALTH CHECK
 * ============================================================================
 * Utile pour vérifier que le serveur tourne
 */

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

/**
 * ============================================================================
 * MIDDLEWARE GLOBAL D’ERREUR
 * ============================================================================
 */

app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);

    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

/**
 * ============================================================================
 * LANCEMENT DU SERVEUR
 * ============================================================================
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
