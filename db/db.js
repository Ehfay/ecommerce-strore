// db/db.js
import pg from "pg"; // Import pg as a default import
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg; // Destructure Pool from pg

// Create a connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;
