import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/auth-forms";
import { Skeleton } from "@/components/ui/skeleton";
import { googleEnabled } from "@/auth";
import { safeCallbackUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Criar conta", robots: { index: false } };

async function Form({ searchParams }: { searchParams: PageProps<"/cadastro">["searchParams"] }) {
  const sp = await searchParams;
  return <RegisterForm callbackUrl={safeCallbackUrl(sp.callbackUrl)} google={googleEnabled} />;
}

export default function RegisterPage({ searchParams }: PageProps<"/cadastro">) {
  return (
    <AuthShell title="Criar conta" subtitle="Ganhe 20% off no primeiro pedido com o cupom PRIMEIRA20.">
      <Suspense fallback={<Skeleton className="h-96" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
