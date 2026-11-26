"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import {
  formatMoney,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import orderDefinition from "../../[poId]/get/definition";
import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OrderLineRemoveWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const result = data?.result;

  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const poId = form.watch("poId");
  const lineId = form.watch("lineId");
  const verify =
    interactive && !responseOnly && !result && Boolean(poId && lineId);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { poId: poId ?? "" },
        queryOptions: {
          enabled: verify,
          staleTime: 0,
          refetchOnMount: "always" as const,
          disableLocalCache: true,
          queryKey: `po-line-confirmation:${poId ?? ""}:${lineId ?? ""}`,
        },
      },
    }),
    [poId, lineId, verify],
  );
  const read = useEndpoint(orderDefinition, options, logger, user).read;
  const loading = verify && (read?.isLoading || read?.isFetching);
  const order = read?.response?.success ? read.response.data.result : undefined;
  const line =
    order?.id === poId && order?.status === "DRAFT" && !loading
      ? order.lines.find((item) => item.id === lineId)
      : undefined;

  if (result !== undefined) {
    const totalsLabel = t("orderLineRemove.post.widget.updatedOrderTotals");
    return (
      <Div
        className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-4"
        data-testid="purchase-line-removal-result"
      >
        <Div className="flex flex-col gap-1">
          <Span className="text-lg font-semibold">
            {t("orderLineRemove.post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
            {result.removedDescription ??
              t("orderLineRemove.post.success.description")}
          </Span>
        </Div>

        <Div
          role="group" // oxlint-disable-line jsx-a11y/prefer-tag-over-role -- Shared UI has no cross-platform fieldset component.
          ariaLabel={totalsLabel}
          className="flex flex-col gap-2 text-sm"
        >
          <Span className="font-semibold">{totalsLabel}</Span>
          <RemovalAmountRow
            label={t("orderLineRemove.post.response.subtotal")}
            value={formatMoney(result.subtotal, result.currency, locale)}
          />
          <RemovalAmountRow
            label={t("orderLineRemove.post.response.taxAmount")}
            value={formatMoney(result.taxAmount, result.currency, locale)}
          />
          <RemovalAmountRow
            label={t("orderLineRemove.post.response.total")}
            value={formatMoney(result.total, result.currency, locale)}
            total
          />
        </Div>

        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start"
          >
            {t("orderLineRemove.post.widget.backToOrder")}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {loading ? (
        <Span aria-live="polite" className="text-sm text-muted-foreground">
          {t("orderLineRemove.post.widget.verifying")}
        </Span>
      ) : line && order ? (
        <>
          <Div
            className="flex flex-col gap-2 rounded-lg border p-3"
            data-testid="purchase-line-confirmation"
          >
            <Span className="text-lg font-semibold [overflow-wrap:anywhere]">
              {line.description}
            </Span>
            <Div className="flex flex-col gap-2 text-sm">
              <RemovalAmountRow
                label={t("orderLineAdd.post.quantity.label")}
                value={formatQuantity(line.quantity, locale)}
              />
              <RemovalAmountRow
                label={t("orderGet.get.widget.colLineTotal")}
                value={formatMoney(line.lineTotal, order.currency, locale)}
              />
            </Div>
          </Div>
          <Span className="text-sm text-muted-foreground">
            {t("orderLineRemove.post.widget.warning")}
          </Span>
        </>
      ) : (
        <Span aria-live="polite" className="text-sm text-muted-foreground">
          {t("orderLineRemove.post.widget.unavailable")}
        </Span>
      )}
      <FormAlertWidget field={{}} />
      <Div className="flex flex-wrap justify-end gap-2">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigation.pop()}
          >
            {t("orderLineRemove.post.widget.cancel")}
          </Button>
        )}
        {line && (
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "orderLineRemove.post.title",
              variant: "destructive",
            }}
          />
        )}
      </Div>
    </Div>
  );
}

function RemovalAmountRow({
  label,
  value,
  total = false,
}: {
  label: string;
  value: string;
  total?: boolean;
}): JSX.Element {
  return (
    <Div
      data-testid="purchase-removal-amount"
      className={`grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,auto)] items-baseline gap-x-3 ${total ? "border-t pt-2 font-semibold" : ""}`}
    >
      <Span className="min-w-0 text-muted-foreground [overflow-wrap:anywhere]">
        {label}
      </Span>
      <Span className="min-w-0 text-right tabular-nums [overflow-wrap:anywhere]">
        {value}
      </Span>
    </Div>
  );
}
