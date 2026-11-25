import type { StatusPillVariant } from "next-vibe/ui/components/status-pill";

import { BillStatus, EstimateStatus, InvoiceStatus } from "@/payment/enum";

export function documentStatusVariant(
  status: string,
  attention?: { overdue?: boolean; partialPayment?: boolean },
): StatusPillVariant {
  if (attention?.overdue) {
    return "danger";
  }
  if (attention?.partialPayment) {
    return "warning";
  }
  switch (status) {
    case InvoiceStatus.OPEN:
    case EstimateStatus.SENT:
      return "info";
    case BillStatus.RECEIVED:
      return "warning";
    case InvoiceStatus.PAID:
    case BillStatus.APPROVED:
    case BillStatus.PAID:
    case EstimateStatus.ACCEPTED:
    case EstimateStatus.CONVERTED:
      return "success";
    case InvoiceStatus.UNCOLLECTIBLE:
    case BillStatus.DISPUTED:
    case EstimateStatus.DECLINED:
      return "danger";
    default:
      return "muted";
  }
}
