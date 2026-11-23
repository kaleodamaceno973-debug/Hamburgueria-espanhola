import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", // "/conta$" e "/conta/" — um "/conta" puro bloquearia também "/contato"
      disallow: ["/admin", "/conta$", "/conta/", "/checkout", "/pagamento/", "/pedido/", "/api/", "/entrar", "/cadastro"] }],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
