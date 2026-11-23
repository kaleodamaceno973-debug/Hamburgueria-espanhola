import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/server/session";
import { getOrderForUser } from "@/server/orders";
import { OrderDetail } from "@/components/orders/order-detail";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Seu pedido", robots: { index: false } };

async function Content({ params, searchParams }: PageProps<"/pedido/[code]">) {
  const { code } = await params;
  const sp = await searchParams;
  const user = await requireUser(`/pedido/${code}`);
  const order = await getOrderForUser(code, user);
  if (!order) notFound();
  return (
    <>
      <h1 className="font-display text-[clamp(2.4rem,7vw,4.2rem)]"><span className="slant">Pedido <span className="text-primary">{order.code}</span></span></h1>
      <div className="mt-6">
        <OrderDetail order={order} justPaid={sp.pagamento === "ok"} />
      </div>
    </>
  );
}

export default function OrderPage(props: PageProps<"/pedido/[code]">) {
  return (
    <div className="container-x pb-24 pt-28 md:pt-40">
      <Link href="/conta" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Meus pedidos</Link>
      <Suspense fallback={<div className="space-y-6"><Skeleton className="h-16 w-2/3" /><Skeleton className="h-96" /></div>}>
        <Content {...props} />
      </Suspense>
    </div>
  );
}
