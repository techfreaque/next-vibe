"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import detailDefinition from "../../[poId]/get/definition";
import type definition from "./definition";

export function OrderLineAddWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const result = data?.result;
  const poId = useWidgetForm<typeof definition.POST>().watch("poId");
  const interactive = useWidgetIsInteractive();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { poId: poId ?? "" },
        queryOptions: { enabled: interactive && !!poId && !result },
      },
    }),
    [poId, interactive, result],
  );
  const order = useEndpoint(detailDefinition, options, logger, user).read?.data
    ?.result;
  const currency =
    result?.currency ?? (order?.id === poId ? order?.currency : undefined);

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("orderLineAdd.post.widget.lineAdded")}
          </Span>
        </Div>
        <Div className="grid grid-cols-3 gap-2 text-xs">
          <Div>
            <Span className="block text-muted-foreground">
              {t("orderLineAdd.post.response.subtotal")}
            </Span>
            <Span className="font-medium">
              {formatMoney(result.subtotal, result.currency, locale)}
            </Span>
          </Div>
          <Div>
            <Span className="block text-muted-foreground">
              {t("orderLineAdd.post.response.taxAmount")}
            </Span>
            <Span className="font-medium">
              {formatMoney(result.taxAmount, result.currency, locale)}
            </Span>
          </Div>
          <Div>
            <Span className="block text-muted-foreground">
              {t("orderLineAdd.post.response.total")}
            </Span>
            <Span className="font-semibold">
              {formatMoney(result.total, result.currency, locale)}
            </Span>
          </Div>
        </Div>
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start"
          >
            {t("orderLineAdd.post.widget.backToOrder")}
          </Button>
        )}
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
          {t("orderLineAdd.post.widget.backToOrder")}
        </Button>
      )}

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="productId"
          field={withValue(field.children.productId, undefined, null)}
        />
        <TextFieldWidget
          fieldName="itemDescription"
          field={withValue(field.children.itemDescription, undefined, null)}
        />
        <Div className="grid grid-cols-2 gap-3">
          <NumberFieldWidget
            fieldName="quantity"
            presentation="quantity"
            field={withValue(field.children.quantity, undefined, null)}
          />
          <NumberFieldWidget
            fieldName="unitPrice"
            presentation="money"
            currency={currency}
            field={withValue(field.children.unitPrice, undefined, null)}
          />
        </Div>
        <NumberFieldWidget
          fieldName="taxRate"
          presentation="percent"
          field={withValue(field.children.taxRate, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "orderLineAdd.post.title" }}
      />
    </Div>
  );
}
