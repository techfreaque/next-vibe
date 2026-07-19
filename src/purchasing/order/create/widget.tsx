"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import {
  withValue,
  withValueNonStrict,
} from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

export function OrderCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleViewOrder = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    const id = data?.result?.id;
    if (!id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[poId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { poId: id },
      });
    })();
  };

  const result = data?.result;

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("orderCreate.post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground mt-0.5">
            {t("orderCreate.post.success.description")}
          </Span>
        </Div>

        <Div className="rounded-lg border bg-card p-4">
          <Div className="flex items-center justify-between mb-3">
            <Span className="text-base font-semibold font-mono">
              {result.poNumber}
            </Span>
            <Badge variant="secondary" className="text-xs">
              {result.status}
            </Badge>
          </Div>

          <Div className="grid grid-cols-3 gap-3 text-sm">
            <Div className="p-2 rounded border bg-background">
              <Span className="text-xs text-muted-foreground block">
                {t("orderCreate.post.response.subtotal")}
              </Span>
              <Span className="font-medium text-sm">
                {formatAmount(result.subtotal)}
              </Span>
            </Div>
            <Div className="p-2 rounded border bg-background">
              <Span className="text-xs text-muted-foreground block">
                {t("orderCreate.post.response.taxAmount")}
              </Span>
              <Span className="font-medium text-sm">
                {formatAmount(result.taxAmount)}
              </Span>
            </Div>
            <Div className="p-2 rounded border bg-muted/30">
              <Span className="text-xs text-muted-foreground block">
                {t("orderCreate.post.response.total")}
              </Span>
              <Span className="font-semibold text-sm">
                {formatAmount(result.total)}
              </Span>
            </Div>
          </Div>
        </Div>

        <Div className="flex items-center gap-2">
          <Button type="button" size="sm" onClick={handleViewOrder}>
            {t("orderCreate.post.widget.viewOrder")}
          </Button>
          {navigation.canGoBack && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => navigation.pop()}
            >
              {t("orderCreate.post.widget.backToList")}
            </Button>
          )}
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("orderCreate.post.widget.backToList")}
        </Button>
      )}

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="companyId"
          field={withValue(field.children.companyId, undefined, null)}
        />
        <TextFieldWidget
          fieldName="vendorId"
          field={withValue(field.children.vendorId, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <TextFieldWidget
            fieldName="currency"
            field={withValue(field.children.currency, undefined, null)}
          />
          <TextFieldWidget
            fieldName="expectedDeliveryDate"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            field={
              withValueNonStrict(
                field.children.expectedDeliveryDate,
                undefined,
                null,
              ) as never
            }
          />
        </Div>
        <TextFieldWidget
          fieldName="deliveryWarehouseId"
          field={withValue(field.children.deliveryWarehouseId, undefined, null)}
        />
        <TextareaFieldWidget
          fieldName="notes"
          field={withValue(field.children.notes, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "orderCreate.post.title" }}
      />
    </Div>
  );
}
