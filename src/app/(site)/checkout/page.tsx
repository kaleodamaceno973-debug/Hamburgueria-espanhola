import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireUser } from "@/server/session";
import { availableSlots } from "@/lib/schedule";
import { paymentProvider } from "@/server/payments";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Finalizar pedido", robots: { index: false } };

async function CheckoutData() {
  const user = await requireUser("/checkout");
  const [profile, lastOrder] = await Promise.all([
    db.user.findUnique({ where: { id: user.id }, select: { name: true, phone: true } }),
    db.order.findFirst({ where: { userId: user.id, fulfillment: "DELIVERY" }, orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <CheckoutForm
      provider={paymentProvider()}
      slots={availableSlots()}
      defaults={{
        name: profile?.name ?? "",
        phone: profile?.phone ?? "",
        address: {
          street: lastOrder?.addressStreet ?? "",
          number: lastOrder?.addressNumber ?? "",
          district: lastOrder?.addressDistrict ?? "",
          city: lastOrder?.addressCity ?? "São Paulo",
          extra: lastOrder?.addressExtra ?? "",
        },
      }}
    />
  );
}

export default function CheckoutPage() {
  return (
    <div className="container-x pb-24 pt-28 md:pt-40">
      <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)]"><span className="slant">Finalizar pedido</span></h1>
      <p className="mt-2 text-muted-foreground">Falta pouco para o seu smash sair da chapa.</p>
      <div className="mt-10">
        <Suspense
          fallback={
            <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
              <Skeleton className="h-[600px]" />
              <Skeleton className="h-96" />
            </div>
          }
        >
          <CheckoutData />
        </Suspense>
      </div>
    </div>
  );
}
