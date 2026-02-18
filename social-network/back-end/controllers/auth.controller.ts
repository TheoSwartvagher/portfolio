
import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

/**
 * ============================================================================
 * AUTH CONTROLLER
 * ============================================================================
 *
 * Rôle :
 * - Recevoir les requêtes HTTP
 * - Valider les données d’entrée
 * - Appeler le service correspondant
 * - Retourner une réponse HTTP adaptée
 *
 * Aucune logique SQL ici.
 * Aucune logique métier complexe ici.
 *
 * ============================================================================
 */


/**
 * ---------------------------------------------------------------------------
 * REGISTER
 * POST /api/auth/register
 * ---------------------------------------------------------------------------
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation minimale
    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis.",
      });
    }

    const user = await AuthService.register(email, password);

    return res.status(201).json({
      message: "Utilisateur créé avec succès.",
      user,
    });

  } catch (error: any) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Erreur lors de l'inscription.",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * LOGIN
 * POST /api/auth/login
 * ---------------------------------------------------------------------------
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis.",
      });
    }

    const result = await AuthService.login(email, password);

    if (!result) {
      return res.status(401).json({
        message: "Identifiants invalides.",
      });
    }

    return res.status(200).json({
      message: "Connexion réussie.",
      user: result.user,
      token: result.token,
    });

  } catch (error: any) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Erreur lors de la connexion.",
    });
  }
};


/**
 * ---------------------------------------------------------------------------
 * LOGOUT
 * POST /api/auth/logout
 * ---------------------------------------------------------------------------
 *
 * Si authentification JWT stateless :
 * → rien à faire côté serveur
 *
 * Si refresh tokens :
 * → suppression ou blacklist en base
 */
export const logout = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Déconnexion réussie.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la déconnexion.",
    });
  }
};
