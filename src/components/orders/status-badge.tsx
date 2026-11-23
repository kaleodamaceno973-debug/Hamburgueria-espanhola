import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/constants";

const STATUS_VARIANT: Record<OrderStatus, "warning" | "info" | "default" | "success" | "danger" | "muted"> = {
  PENDING_PAYMENT: "warning",
  PAID: "info",
  PREPARING: "default",
  READY: "success",
  OUT_FOR_DELIVERY: "info",
  COMPLETED: "muted",
  CANCELLED: "danger",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{ORDER_STATUS_LABEL[status]}</Badge>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const v = status === "PAID" ? "success" : status === "FAILED" ? "danger" : status === "REFUNDED" ? "muted" : "warning";
  return <Badge variant={v}>{PAYMENT_STATUS_LABEL[status]}</Badge>;
}
