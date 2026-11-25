"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Label } from "next-vibe/ui/components/label";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
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

export function PosOrderRemoveItemWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>()?.result;
  const form = useWidgetForm<typeof definition.POST>();
  const [orderId, itemId] = useWatch({
    control: form.control,
    name: ["details.orderId", "details.itemId"],
  });
  const order = useOrderPreview(result?.orderId ?? orderId);
  const selected = order?.items.find((row) => row.itemId === itemId);
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("orderRemoveItem.post.title")}
        subtitle={t("orderRemoveItem.post.description")}
        backButton={
          navigation.canGoBack && (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => navigation.pop()}
            >
              {t("orderRemoveItem.post.widget.backToOrder")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {result ? (
        <ResultBanner
          variant="success"
          title={t("orderRemoveItem.post.success.title")}
          message={
            order
              ? formatMoney(result.orderTotal, order.currency, locale)
              : t("orderRemoveItem.post.success.description")
          }
        >
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() =>
              void import("../get/definition").then((m) =>
                navigation.push(m.default.GET, {
                  urlPathParams: { orderId: result.orderId },
                }),
              )
            }
          >
            {t("orderRemoveItem.post.widget.backToOrder")}
          </Button>
        </ResultBanner>
      ) : (
        <>
          <EntityPickerFieldWidget
            fieldName="details.orderId"
            field={field.children.details.children.orderId}
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
              ) : order.items.length === 0 ? (
                <ResultBanner
                  variant="info"
                  title={t("orderGet.get.widget.noItems")}
                />
              ) : (
                <>
                  <Label htmlFor="pos-remove-line">
                    {t("orderRemoveItem.post.itemId.label")}
                  </Label>
                  <Select
                    value={selected?.itemId ?? ""}
                    onValueChange={(value) =>
                      form.setValue("details.itemId", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger id="pos-remove-line">
                      <SelectValue
                        placeholder={t(
                          "orderRemoveItem.post.widget.chooseLine",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {order.items.map((row) => (
                        <SelectItem
                          key={row.itemId}
                          value={row.itemId}
                        >{`${row.description} · ${formatMoney(row.lineTotal, order.currency, locale)}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selected && (
                    <SubmitButtonWidget<typeof definition.POST>
                      field={{
                        text: "orderRemoveItem.post.title",
                        variant: "destructive",
                        className: "self-start",
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </WidgetShell>
  );
}
