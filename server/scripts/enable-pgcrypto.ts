import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);

(async () => {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;
  console.log("pgcrypto enabled");
})();

// DATABASE_URL='postgresql://neondb_owner:npg_8tyIlB0QvpeW@ep-nameless-king-aeqqqhn2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require' npm run db:migrate
