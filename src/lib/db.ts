import "server-only";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Modo demo na Vercel com SQLite: o banco populado no build (prisma/demo.db)
 * vai junto no deploy e é copiado para /tmp (único diretório gravável).
 * Os dados voltam ao estado inicial quando a instância reinicia.
 * Em produção real use PostgreSQL (DATABASE_URL=postgresql://...).
 */
function resolveUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!process.env.VERCEL || !url?.startsWith("file:") || process.env.NEXT_PHASE === "phase-production-build") return undefined;
  const source = path.join(process.cwd(), "prisma", "demo.db");
  const target = "/tmp/smash-demo.db";
  try {
    if (!fs.existsSync(target) && fs.existsSync(source)) fs.copyFileSync(source, target);
    return `file:${target}`;
  } catch {
    return undefined;
  }
}

function createClient() {
  const url = resolveUrl();
  return new PrismaClient({
    ...(url ? { datasources: { db: { url } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
