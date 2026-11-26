"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
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

export function VendorGetWidget({
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
      {t("vendorGet.get.widget.backToList")}
    </Button>
  );

  if (!result) {
    return (
      <AdminRecord
        title={t("vendorGet.get.title")}
        backButton={backButton}
        details={{
          title: t("vendorGet.get.widget.select"),
          content: (
            <>
              <EntityPickerFieldWidget
                fieldName="vendorId"
                field={field.children.vendorId}
              />
              <SubmitButtonWidget<typeof definition.GET>
                field={{ text: "vendorGet.get.widget.select" }}
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
        urlPathParams: { vendorId: result.id },
        popNavigationOnSuccess: 1,
      }),
    );
  };
  const deactivate = (): void => {
    void import("../deactivate/definition").then((mod) =>
      navigation.push(mod.default.POST, {
        urlPathParams: { vendorId: result.id },
        popNavigationOnSuccess: 1,
      }),
    );
  };
  const createOrder = (): void => {
    void import("../../../order/create/definition").then((mod) =>
      navigation.push(mod.default.POST, {
        data: { companyId: result.companyId, vendorId: result.id },
      }),
    );
  };
  const viewOrders = (): void => {
    void import("../../../order/list/definition").then((mod) =>
      navigation.push(mod.default.GET, {
        data: { companyId: result.companyId, vendorId: result.id },
      }),
    );
  };

  const metrics = [];
  if (result.orderCount !== undefined) {
    metrics.push({
      label: t("vendorGet.get.widget.orderCount"),
      value: result.orderCount.toLocaleString(locale),
    });
  }
  if (result.receivingCount !== undefined) {
    metrics.push({
      label: t("vendorGet.get.widget.receivingCount"),
      value: result.receivingCount.toLocaleString(locale),
    });
  }
  const address = [
    result.addressLine1,
    result.addressLine2,
    [result.postalCode, result.city, result.region].filter(Boolean).join(" "),
    result.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <AdminRecord
      title={result.name}
      subtitle={
        [result.code, result.companyName].filter(Boolean).join(" · ") ||
        undefined
      }
      status={{
        status: result.isActive ? "active" : "inactive",
        label: t(
          result.isActive
            ? "vendorList.get.widget.active"
            : "vendorList.get.widget.inactive",
        ),
        variant: result.isActive ? "success" : "muted",
      }}
      backButton={backButton}
      actions={
        interactive && (
          <>
            <Button
              type="button"
              variant={result.isActive ? "outline" : "default"}
              size="sm"
              onClick={edit}
            >
              {t("vendorGet.get.widget.edit")}
            </Button>
            {result.isActive && (
              <Button type="button" size="sm" onClick={createOrder}>
                {t("vendorGet.get.widget.createOrder")}
              </Button>
            )}
          </>
        )
      }
      metrics={metrics}
      details={{
        title: t("vendorGet.get.widget.details"),
        content: (
          <DetailGrid columns={2}>
            {result.email && (
              <DetailField
                className="@sm:col-span-2 @lg:col-span-1"
                label={t("vendorGet.get.response.email")}
                value={result.email}
              />
            )}
            {result.phone && (
              <DetailField
                label={t("vendorGet.get.response.phone")}
                value={result.phone}
              />
            )}
            {result.website && (
              <DetailField
                label={t("vendorGet.get.response.website")}
                value={result.website}
              />
            )}
            {address && (
              <DetailField
                label={t("vendorGet.get.response.addressLine1")}
                value={address}
              />
            )}
            {result.vatNumber && (
              <DetailField
                label={t("vendorGet.get.response.vatNumber")}
                value={result.vatNumber}
              />
            )}
            {result.taxId && (
              <DetailField
                label={t("vendorGet.get.response.taxId")}
                value={result.taxId}
              />
            )}
            <DetailField
              label={t("vendorGet.get.response.defaultCurrency")}
              value={result.defaultCurrency}
            />
            {result.defaultPaymentTermsDays !== null && (
              <DetailField
                label={t("vendorGet.get.response.defaultPaymentTermsDays")}
                value={result.defaultPaymentTermsDays.toLocaleString(locale)}
              />
            )}
            {result.notes && (
              <DetailField
                label={t("vendorGet.get.response.notes")}
                value={result.notes}
              />
            )}
          </DetailGrid>
        ),
      }}
      related={
        interactive
          ? {
              title: t("vendorGet.get.widget.related"),
              content: (
                <Div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={viewOrders}
                  >
                    {t("vendorGet.get.widget.viewOrders")}
                  </Button>
                  {result.isActive && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={deactivate}
                    >
                      {t("vendorGet.get.widget.deactivate")}
                    </Button>
                  )}
                </Div>
              ),
            }
          : undefined
      }
    />
  );
}
