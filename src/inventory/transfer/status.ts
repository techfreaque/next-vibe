import { TransferStatus, TransferStatusDB } from "../enum";
import type { scopedTranslation } from "../i18n";

export function transferStatusLabel(
  status: string,
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): string {
  const known = TransferStatusDB.find((value) => value === status);
  return known ? t(TransferStatus[known]) : status;
}

export function transferStatusVariant(
  status: string,
): "muted" | "info" | "success" {
  if (status === "IN_TRANSIT") {
    return "info";
  }
  if (status === "RECEIVED") {
    return "success";
  }
  return "muted";
}
