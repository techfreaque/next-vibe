import type { StatusPillVariant } from "next-vibe/ui/components/status-pill";

import { PurchaseOrderStatus, PurchaseOrderStatusDB } from "../enum";
import type { PurchasingT } from "../i18n";

const variants = {
  DRAFT: "muted",
  SENT: "info",
  CONFIRMED: "info",
  PARTIALLY_RECEIVED: "warning",
  RECEIVED: "success",
  BILLED: "success",
  CANCELLED: "muted",
} satisfies Record<(typeof PurchaseOrderStatusDB)[number], StatusPillVariant>;

export function purchaseOrderStatus(
  status: string,
  t: PurchasingT,
): { label: string; variant: StatusPillVariant } {
  const recognized = PurchaseOrderStatusDB.find((key) => key === status);
  return recognized
    ? {
        label: t(PurchaseOrderStatus[recognized]),
        variant: variants[recognized],
      }
    : { label: status, variant: "muted" };
}

export function isPurchaseDeliveryOverdue(
  date: Date | null,
  status: string,
): boolean {
  if (!date || ["RECEIVED", "BILLED", "CANCELLED"].includes(status)) {
    return false;
  }
  return (
    new Date(date).toISOString().slice(0, 10) <
    new Date().toISOString().slice(0, 10)
  );
}
