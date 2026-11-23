import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

/** Status do pedido para atualização em tempo real (polling leve). */
export async function GET(_req: Request, ctx: RouteContext<"/api/orders/[code]">) {
  const { code } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const order = await db.order.findUnique({
    where: { code },
    select: {
      userId: true,
      status: true,
      paymentStatus: true,
      scheduledFor: true,
      updatedAt: true,
      events: { orderBy: { createdAt: "asc" }, select: { status: true, note: true, createdAt: true } },
    },
  });
  if (!order || (order.userId !== session.user.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }
  const { userId: _omit, ...data } = order;
  void _omit;
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
