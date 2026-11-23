import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/server/session";
import { getOrderForUser } from "@/server/orders";
import { paymentProvider } from "@/server/payments";
import { DemoPayment } from "@/components/orders/demo-payment";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBRL } from "@/lib/utils";

export const metadata: Metadata = { title: "Pagamento", robots: { index: false } };

async function Content({ params }: { params: PageProps<"/pagamento/demo/[code]">["params"] }) {
  const { code } = await params;
  const user = await requireUser(`/pagamento/demo/${code}`);
  if (paymentProvider() !== "demo") redirect(`/pedido/${code}`);
  const order = await getOrderForUser(code, user);
  if (!order) notFound();
  if (order.status !== "PENDING_PAYMENT") redirect(`/pedido/${code}`);
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <DemoPayment code={order.code} totalCents={order.totalCents} method={order.paymentMethod} />
      <aside className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Pedido {order.code}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="text-foreground/80">{i.quantity}× {i.name}</span>
              <span className="tabular-nums">{formatBRL(i.totalCents)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-bold">
          <span>Total</span>
          <span className="tabular-nums text-gold">{formatBRL(order.totalCents)}</span>
        </div>
        <Link href={`/pedido/${order.code}`} className="mt-6 block text-center text-sm text-muted-foreground hover:text-primary">Pagar depois</Link>
      </aside>
    </div>
  );
}

export default function DemoPaymentPage({ params }: PageProps<"/pagamento/demo/[code]">) {
  return (
    <div className="container-x pb-24 pt-28 md:pt-40">
      <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)]"><span className="slant">Pagamento</span></h1>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-[480px]" />}>
          <Content params={params} />
        </Suspense>
      </div>
    </div>
  );
}
