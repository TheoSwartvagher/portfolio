import { Router } from "express";
import * as authController from "../controllers/auth.controller";

/**
 * ============================================================================
 * AUTH ROUTES
 * ============================================================================
 *
 * Rôle :
 * - Définir les endpoints liés à l'authentification
 * - Associer chaque route à son controller
 *
 * Ce fichier ne contient AUCUNE logique métier.
 * Il agit uniquement comme passerelle HTTP.
 *
 * ============================================================================
 */

const router = Router();

/**
 * ---------------------------------------------------------------------------
 * POST /api/auth/register
 * ---------------------------------------------------------------------------
 * Crée un nouvel utilisateur
 */
router.post("/register", authController.register);

/**
 * ---------------------------------------------------------------------------
 * POST /api/auth/login
 * ---------------------------------------------------------------------------
 * Authentifie un utilisateur
 */
router.post("/login", authController.login);

/**
 * ---------------------------------------------------------------------------
 * POST /api/auth/logout
 * ---------------------------------------------------------------------------
 * Déconnecte l'utilisateur (ex: blacklist token)
 */
router.post("/logout", authController.logout);

export default router;

