import "server-only";
import crypto from "node:crypto";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { put } from "@vercel/blob";
import { imageFileSchema } from "@/lib/validation";

export const UPLOAD_DIR = path.join(process.cwd(), ".uploads");

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

/** Salva a imagem no Vercel Blob (produção) ou em /public/uploads (local). */
export async function saveImage(file: File, folder = "produtos"): Promise<string> {
  const parsed = imageFileSchema.safeParse(file);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Imagem inválida");
  const name = `${folder}/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${EXT[file.type]}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, file, { access: "public", contentType: file.type });
    return blob.url;
  }
  if (process.env.VERCEL) {
    throw new Error("Configure BLOB_READ_WRITE_TOKEN (Vercel Blob) para enviar imagens em produção.");
  }
  // Fora de /public: arquivos criados após o build são servidos por app/uploads/[...path]
  const dest = path.join(UPLOAD_DIR, name);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
