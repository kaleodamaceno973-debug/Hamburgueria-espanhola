import type { NextAuthConfig } from "next-auth";

/**
 * Configuração leve (sem banco) compartilhada com o proxy.
 * Provedores com acesso ao banco ficam em `auth.ts`.
 */
export const authConfig = {
  pages: { signIn: "/entrar", error: "/entrar" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as { role?: "USER" | "ADMIN" }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string) ?? "";
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
