import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const PROTECTED = ["/conta", "/checkout", "/pagamento", "/pedido"];

/**
 * Proteção no servidor antes de renderizar:
 * - /admin exige papel ADMIN
 * - área do cliente e checkout exigem login
 * As páginas e server actions verificam novamente (defesa em profundidade).
 */
export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const user = req.auth?.user;

  const needsAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const needsLogin = needsAdmin || PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (needsLogin && !user) {
    const url = new URL("/entrar", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }
  if (needsAdmin && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/conta?erro=acesso", req.nextUrl.origin));
  }
  if ((pathname === "/entrar" || pathname === "/cadastro") && user) {
    return NextResponse.redirect(new URL(user.role === "ADMIN" ? "/admin" : "/conta", req.nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/conta/:path*", "/checkout/:path*", "/pagamento/:path*", "/pedido/:path*", "/entrar", "/cadastro"],
};
