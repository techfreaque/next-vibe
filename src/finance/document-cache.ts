import type { EndpointLogger } from "next-vibe/logger/types";

export async function refreshInvoiceDocuments(
  logger: EndpointLogger,
  invoiceId?: string,
): Promise<void> {
  const [{ apiClient }, list, detail] = await Promise.all([
    import("next-vibe/unified-ui/hooks/store"),
    import("@/payment/invoice/list/definition"),
    import("@/payment/invoice/[invoiceId]/get/definition"),
  ]);
  await Promise.all([
    apiClient.refetchEndpoint(list.default.GET, logger),
    invoiceId
      ? apiClient.refetchEndpoint(detail.default.GET, logger, {
          urlPathParams: { invoiceId },
        })
      : undefined,
  ]);
}

export async function refreshBillDocuments(
  logger: EndpointLogger,
  billId?: string,
): Promise<void> {
  const [{ apiClient }, list, detail] = await Promise.all([
    import("next-vibe/unified-ui/hooks/store"),
    import("@/payment/bill/list/definition"),
    import("@/payment/bill/[billId]/get/definition"),
  ]);
  await Promise.all([
    apiClient.refetchEndpoint(list.default.GET, logger),
    billId
      ? apiClient.refetchEndpoint(detail.default.GET, logger, {
          urlPathParams: { billId },
        })
      : undefined,
  ]);
}

export async function refreshEstimateDocuments(
  logger: EndpointLogger,
  estimateId?: string,
): Promise<void> {
  const [{ apiClient }, list, detail] = await Promise.all([
    import("next-vibe/unified-ui/hooks/store"),
    import("@/payment/estimate/list/definition"),
    import("@/payment/estimate/[estimateId]/get/definition"),
  ]);
  await Promise.all([
    apiClient.refetchEndpoint(list.default.GET, logger),
    estimateId
      ? apiClient.refetchEndpoint(detail.default.GET, logger, {
          urlPathParams: { estimateId },
        })
      : undefined,
  ]);
}
