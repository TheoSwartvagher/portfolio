
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { UserModel } from "../models/user.model";

/**
 * ============================================================================
 * AUTH SERVICE
 * ============================================================================
 *
 * Rôle :
 * - Contenir la logique métier d’authentification
 * - Interagir avec la base de données
 * - Gérer le hash des mots de passe
 * - Générer les tokens JWT
 *
 * Aucune logique HTTP ici.
 *
 * ============================================================================
 */

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";


/**
 * ---------------------------------------------------------------------------
 * REGISTER
 * ---------------------------------------------------------------------------
 */
export const register = async (email: string, password: string) => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Utilisateur déjà existant");
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Création utilisateur
  const result = await pool.query(
    `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email
    `,
    [email, hashedPassword]
  );

  const user = UserModel.fromDb(result.rows[0]);

  return user;
};


/**
 * ---------------------------------------------------------------------------
 * LOGIN
 * ---------------------------------------------------------------------------
 */
export const login = async (email: string, password: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const userRow = result.rows[0];

  // Vérification mot de passe
  const isPasswordValid = await bcrypt.compare(
    password,
    userRow.password
  );

  if (!isPasswordValid) {
    return null;
  }

  const user = UserModel.fromDb(userRow);

  // Génération token JWT
  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user,
    token,
  };
};
