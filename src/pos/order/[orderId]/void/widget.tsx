"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useWatch } from "react-hook-form";

import { PosOrderStatus } from "../../../enum";
import { useOrderPreview } from "../get/use-order-preview";
import type definition from "./definition";

export function PosOrderVoidWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>()?.result;
  const navigation = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.POST>();
  const orderId = useWatch({ control: form.control, name: "orderId" });
  const order = useOrderPreview(result ? undefined : orderId);
  const locale = useWidgetLocale();
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("orderVoid.post.title")}
        subtitle={t("orderVoid.post.description")}
        backButton={
          navigation.canGoBack && (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => navigation.pop()}
            >
              {t("orderVoid.post.widget.backToList")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {result ? (
        <ResultBanner
          variant="success"
          title={t("orderVoid.post.success.title")}
          message={t("orderVoid.post.success.description")}
        >
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              void import("../../list/definition").then((m) =>
                navigation.push(m.default.GET, {}),
              )
            }
          >
            {t("orderVoid.post.widget.backToList")}
          </Button>
        </ResultBanner>
      ) : (
        <>
          <EntityPickerFieldWidget
            fieldName="orderId"
            field={field.children.orderId}
          />
          {order && (
            <>
              <DetailGrid>
                <DetailField
                  label={t("orderGet.get.response.orderNumber")}
                  value={order.orderNumber}
                />
                <DetailField
                  label={t("orderGet.get.response.total")}
                  value={formatMoney(order.total, order.currency, locale)}
                />
              </DetailGrid>
              {order.status !== PosOrderStatus.OPEN ||
              order.payments.length > 0 ? (
                <ResultBanner
                  variant="warning"
                  title={t(
                    order.status !== PosOrderStatus.OPEN
                      ? "orderVoid.post.widget.closed"
                      : "orderVoid.post.widget.tendered",
                  )}
                />
              ) : (
                <SubmitButtonWidget<typeof definition.POST>
                  field={{
                    text: "orderVoid.post.title",
                    variant: "destructive",
                    className: "self-start",
                  }}
                />
              )}
            </>
          )}
        </>
      )}
    </WidgetShell>
  );
}
