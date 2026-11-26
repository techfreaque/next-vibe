"use client";

import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useMemo } from "react";

import definition, { type InvoiceGetResponseOutput } from "./definition";

/**
 * Loads the invoice an action widget (duplicate, reminder, line
 * removal) applies to, so the confirmation shows number, customer and total.
 */
export function useInvoiceActionContext(
  invoiceId: string | undefined,
  enabled: boolean,
): { invoice: InvoiceGetResponseOutput | undefined; loading: boolean } {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const active = enabled && Boolean(invoiceId);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { invoiceId: invoiceId ?? "" },
        queryOptions: {
          enabled: active,
          staleTime: 0,
          refetchOnMount: "always" as const,
          disableLocalCache: true,
          queryKey: `invoice-action-context:${invoiceId ?? ""}`,
        },
      },
    }),
    [invoiceId, active],
  );
  const read = useEndpoint(definition, options, logger, user).read;
  const response = read?.response;
  return {
    invoice:
      response?.success && response.data.id === invoiceId
        ? response.data
        : undefined,
    loading: active && Boolean(read?.isLoading || read?.isFetching),
  };
}
