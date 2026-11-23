import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/auth-forms";
import { Skeleton } from "@/components/ui/skeleton";
import { googleEnabled } from "@/auth";
import { safeCallbackUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

const ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "Este e-mail já está ligado a outro método de login.",
  AccessDenied: "Acesso negado.",
  Configuration: "Login temporariamente indisponível.",
};

async function Form({ searchParams }: { searchParams: PageProps<"/entrar">["searchParams"] }) {
  const sp = await searchParams;
  const callbackUrl = safeCallbackUrl(sp.callbackUrl);
  const error = typeof sp.error === "string" ? (ERRORS[sp.error] ?? "Não foi possível entrar. Tente novamente.") : undefined;
  const notice = callbackUrl.startsWith("/checkout") ? "Entre ou crie sua conta para finalizar o pedido — leva 20 segundos." : error;
  return <LoginForm callbackUrl={callbackUrl} google={googleEnabled} notice={notice} />;
}

export default function LoginPage({ searchParams }: PageProps<"/entrar">) {
  return (
    <AuthShell title="Entrar" subtitle="Acompanhe pedidos, salve seus dados e peça mais rápido.">
      <Suspense fallback={<Skeleton className="h-72" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
