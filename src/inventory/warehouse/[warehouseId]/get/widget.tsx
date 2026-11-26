"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminRecord } from "next-vibe/unified-ui/widgets/containers/admin-record/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InventoryWarehouseGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const result = useWidgetValue<typeof definition.GET>()?.result;
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();

  const back = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    void import("../../list/definition").then((mod) =>
      navigation.push(mod.default.GET, {
        data: { companyId: result?.companyId },
      }),
    );
  };

  const backButton = interactive && (
    <Button type="button" size="sm" variant="ghost" onClick={back}>
      <ChevronLeft className="size-4" aria-hidden="true" />
      {t("warehouseGet.get.widget.backToList")}
    </Button>
  );

  if (!result) {
    return (
      <AdminRecord
        title={t("warehouseGet.get.title")}
        backButton={backButton}
        details={{
          title: t("warehouseGet.get.widget.select"),
          content: (
            <>
              <EntityPickerFieldWidget
                fieldName="warehouseId"
                field={field.children.warehouseId}
              />
              <SubmitButtonWidget<typeof definition.GET>
                field={{ text: "warehouseGet.get.widget.select" }}
              />
            </>
          ),
        }}
      />
    );
  }

  const edit = (): void => {
    void import("../update/definition").then((mod) =>
      navigation.push(mod.default.PATCH, {
        data: { warehouseId: result.id },
        popNavigationOnSuccess: 1,
      }),
    );
  };
  const stock = (): void => {
    void import("../../../stock/list/definition").then((mod) =>
      navigation.push(mod.default.GET, {
        data: { companyId: result.companyId, warehouseId: result.id },
      }),
    );
  };
  const overview = (): void => {
    void import("../../../dashboard/definition").then((mod) =>
      navigation.push(mod.default.GET, {
        data: { companyId: result.companyId },
      }),
    );
  };

  const status = result.isActive ? "active" : "inactive";
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const metrics = [];
  if (result.stockedProducts !== undefined) {
    metrics.push({
      label: t("warehouseGet.get.widget.stockedProducts"),
      value: result.stockedProducts.toLocaleString(locale),
    });
  }
  if (result.stockValue !== undefined && result.valuationCurrency) {
    metrics.push({
      label: t("stockList.get.widget.stockValue"),
      value:
        result.stockValue === null
          ? t("warehouseGet.get.widget.missingValuation")
          : formatMoney(result.stockValue, result.valuationCurrency, locale),
    });
  }

  return (
    <AdminRecord
      title={result.name}
      subtitle={[
        result.code,
        result.companyName,
        result.isDefault && t("warehouseGet.get.response.isDefault"),
      ]
        .filter(Boolean)
        .join(" · ")}
      status={{
        status,
        label: t(
          result.isActive
            ? "warehouseCreate.post.widget.active"
            : "warehouseCreate.post.widget.inactive",
        ),
        variant: result.isActive ? "success" : "muted",
      }}
      backButton={backButton}
      actions={
        interactive && (
          <>
            <Button type="button" variant="outline" size="sm" onClick={edit}>
              {t("warehouseGet.get.widget.edit")}
            </Button>
            <Button type="button" size="sm" onClick={stock}>
              {t("warehouseGet.get.widget.viewStock")}
            </Button>
          </>
        )
      }
      metrics={metrics}
      details={{
        title: t("warehouseGet.get.widget.details"),
        content: (
          <DetailGrid columns={2}>
            {result.address && (
              <DetailField
                label={t("warehouseGet.get.response.address")}
                value={result.address}
              />
            )}
            <DetailField
              label={t("warehouseGet.get.response.createdAt")}
              value={date.format(new Date(result.createdAt))}
            />
            <DetailField
              label={t("warehouseGet.get.response.updatedAt")}
              value={date.format(new Date(result.updatedAt))}
            />
          </DetailGrid>
        ),
      }}
      related={
        interactive
          ? {
              title: t("warehouseGet.get.widget.related"),
              content: (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={overview}
                >
                  {t("warehouseGet.get.widget.companyInventory")}
                </Button>
              ),
            }
          : undefined
      }
    />
  );
}
