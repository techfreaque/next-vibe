"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

interface PosOrderCreateWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PosOrderCreateWidget({
  field,
}: PosOrderCreateWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const order = data?.result;

  const handleAddItem = (orderId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("@/pos/order/[orderId]/add-item/definition");
      navigation.push(def.default.POST, {
        data: {
          orderId,
          item: {
            productId: undefined,
            description: "",
            quantity: 1,
            unitPrice: 0,
            taxRate: undefined,
          },
        },
      });
    })();
  };

  const handleViewOrder = (orderId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("@/pos/order/[orderId]/get/definition");
      navigation.push(def.default.GET, { urlPathParams: { orderId } });
    })();
  };

  // Success state — order was created
  if (order) {
    return (
      <Div className="flex flex-col gap-5">
        {/* Order created banner */}
        <Div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-4 flex items-start gap-3">
          <Span className="text-blue-500 text-xl leading-none mt-0.5">#</Span>
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-semibold">
              {t("orderCreate.post.success.title")}
            </Span>
            <Span className="text-base font-mono font-bold">
              #{order.orderNumber}
            </Span>
          </Div>
          <Div className="ml-auto">
            <Badge
              variant="default"
              className="text-xs bg-blue-600 hover:bg-blue-600"
            >
              {t("enums.orderStatus.open")}
            </Badge>
          </Div>
        </Div>

        {/* Order details */}
        <Div className="rounded-lg border overflow-hidden divide-y">
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("orderCreate.post.response.currency")}
            </Span>
            <Badge variant="outline" className="text-xs font-mono">
              {order.currency}
            </Badge>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("orderCreate.post.response.total")}
            </Span>
            <Span className="text-sm font-mono font-bold">
              {new Intl.NumberFormat(locale, {
                style: "currency",
                currency: order.currency,
              }).format(Number(order.total))}
            </Span>
          </Div>
        </Div>

        {/* Primary action — add first item */}
        <Div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => handleAddItem(order.id)}
          >
            + {t("orderCreate.post.widget.addItem")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleViewOrder(order.id)}
          >
            {t("orderCreate.post.widget.viewOrder")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-5">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("orderCreate.post.widget.back")}
        </Button>
      )}

      <FormAlertWidget field={{}} />

      <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Div className="sm:col-span-2">
          <TextFieldWidget
            fieldName="details.sessionId"
            field={withValue(
              field.children.details.children.sessionId,
              undefined,
              null,
            )}
          />
        </Div>
        <TextFieldWidget
          fieldName="details.currency"
          field={withValue(
            field.children.details.children.currency,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="details.customerId"
          field={withValue(
            field.children.details.children.customerId,
            undefined,
            null,
          )}
        />
      </Div>

      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
