
import { Pool } from "pg";

/**
 * ============================================================================
 * DATABASE CONFIGURATION
 * ============================================================================
 *
 * Rôle :
 * - Centraliser la connexion à la base de données
 * - Exposer une instance unique de Pool
 *
 * Ce fichier ne contient aucune logique métier.
 * Il est utilisé uniquement par les services.
 *
 * ============================================================================
 */

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Test de connexion (optionnel mais propre)
 */
pool
  .connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
