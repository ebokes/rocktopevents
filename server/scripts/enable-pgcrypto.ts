import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);

(async () => {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;
  console.log("pgcrypto enabled");
})();
