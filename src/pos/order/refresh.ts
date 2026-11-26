import type { EndpointLogger } from "next-vibe/logger/types";

export async function refreshPosOrder(
  orderId: string | undefined,
  logger: EndpointLogger,
): Promise<void> {
  if (!orderId) {
    return;
  }
  const [{ apiClient }, { default: endpoint }] = await Promise.all([
    import("next-vibe/unified-ui/hooks/store"),
    import("./[orderId]/get/definition"),
  ]);
  await apiClient.refetchEndpoint(endpoint.GET, logger, {
    urlPathParams: { orderId },
  });
}

/** Refresh the till screen of a session after a sale starts, ends or is voided. */
export async function refreshPosRegister(
  sessionId: string | undefined,
  logger: EndpointLogger,
): Promise<void> {
  if (!sessionId) {
    return;
  }
  const [{ apiClient }, { default: endpoint }] = await Promise.all([
    import("next-vibe/unified-ui/hooks/store"),
    import("../session/[sessionId]/register/definition"),
  ]);
  await apiClient.refetchEndpoint(endpoint.GET, logger, {
    urlPathParams: { sessionId },
  });
}
