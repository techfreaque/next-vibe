"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import {
  ResultBanner,
  type ResultBannerVariant,
} from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { type JSX, type ReactNode, useMemo } from "react";

import { scopedTranslation } from "../i18n";
import getDefinition from "./[poId]/get/definition";
import { purchaseOrderStatus } from "./status";

/**
 * Shared confirmation page for one-step purchase order actions (send,
 * confirm, cancel, convert to bill): names the order, shows its supplier,
 * total and status, explains the consequence and offers the action.
 */
export function PurchaseOrderActionConfirm({
  poId,
  title,
  consequence,
  tone = "info",
  allowedStatuses,
  blockedMessage,
  primaryAction,
  done,
  doneTitle,
  doneMessage,
  doneActions,
}: {
  poId: string;
  title: string;
  consequence: string;
  tone?: ResultBannerVariant;
  /** Statuses in which the action can run; others show `blockedMessage`. */
  allowedStatuses: readonly string[];
  blockedMessage: string;
  primaryAction: ReactNode;
  done: boolean;
  doneTitle: string;
  doneMessage: string;
  doneActions?: ReactNode;
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const { t } = scopedTranslation.scopedT(locale);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { poId },
        queryOptions: { enabled: poId !== "" },
      },
    }),
    [poId],
  );
  const read = useEndpoint(getDefinition, options, logger, user).read;
  const order = read?.data?.result;

  const backToOrder = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    if (poId) {
      navigation.push(getDefinition.GET, { urlPathParams: { poId } });
    }
  };

  const backButton = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={backToOrder}
      className="-ml-1 gap-1.5 self-start"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("orderAction.backToOrder")}
    </Button>
  );

  const status = order ? purchaseOrderStatus(order.status, t) : null;
  const allowed = order ? allowedStatuses.includes(order.status) : true;
  const subtitle = order
    ? [order.poNumber, order.vendorName].filter(Boolean).join(" · ")
    : undefined;

  return (
    <AdminForm
      title={title}
      description={subtitle}
      backButton={backButton}
      secondaryActions={
        done || !allowed ? (
          doneActions
        ) : (
          <Button type="button" variant="outline" onClick={backToOrder}>
            {t("orderAction.keepOrder")}
          </Button>
        )
      }
      primaryAction={
        done || !allowed ? (
          <Button type="button" onClick={backToOrder}>
            {t("orderAction.openOrder")}
          </Button>
        ) : (
          primaryAction
        )
      }
    >
      {!order && read?.isLoading ? <LoadingBlock /> : null}
      {order && status ? (
        <Div className="grid gap-4 rounded-xl border bg-card p-4 @md:grid-cols-[minmax(0,1fr)_auto]">
          <Div className="flex min-w-0 flex-col gap-1">
            <Div className="flex flex-wrap items-center gap-2">
              <Span className="text-base font-semibold whitespace-nowrap">
                {order.poNumber}
              </Span>
              <StatusPill
                status={order.status}
                variant={status.variant}
                label={status.label}
              />
            </Div>
            <Span className="text-sm text-muted-foreground break-words">
              {[
                order.vendorName,
                order.expectedDeliveryDate
                  ? `${t("orderAction.expected")} ${formatDocDate(order.expectedDeliveryDate, locale)}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </Span>
          </Div>
          <Div className="flex flex-col @md:items-end">
            <Span className="text-xs text-muted-foreground">
              {t("orderAction.total")}
            </Span>
            <Span className="text-lg font-semibold tabular-nums">
              {formatMoney(order.total, order.currency, locale)}
            </Span>
          </Div>
        </Div>
      ) : null}
      {done ? (
        <ResultBanner
          variant="success"
          title={doneTitle}
          message={doneMessage}
        />
      ) : !allowed ? (
        <ResultBanner
          variant="warning"
          title={t("orderAction.notAvailable")}
          message={blockedMessage}
        />
      ) : (
        <ResultBanner variant={tone} title={title} message={consequence} />
      )}
    </AdminForm>
  );
}
