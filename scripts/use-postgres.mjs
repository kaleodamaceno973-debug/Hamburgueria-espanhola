// Troca o provider do Prisma de SQLite para PostgreSQL (produção/Vercel).
import { readFileSync, writeFileSync } from "node:fs";
const file = new URL("../prisma/schema.prisma", import.meta.url);
const src = readFileSync(file, "utf8");
const out = src.replace('provider = "sqlite"', 'provider = "postgresql"');
if (src === out) console.log("Schema já está em PostgreSQL.");
else { writeFileSync(file, out); console.log("✔ Prisma configurado para PostgreSQL. Rode: npx prisma db push && npm run db:seed"); }
