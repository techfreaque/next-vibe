"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { CurrencySelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/currency-select-field/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useRef } from "react";

import warehouseGetDefinition from "@/inventory/warehouse/[warehouseId]/get/definition";

import getDefinition from "../get/definition";
import type definition from "./definition";

export function OrderUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const poId = form?.watch("poId") ?? "";

  // Load the saved order so the form opens with its current values.
  const getOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { poId },
        queryOptions: { enabled: poId !== "" },
      },
    }),
    [poId],
  );
  const read = useEndpoint(getDefinition, getOptions, logger, user).read;
  const order = read?.data?.result;
  const deliveryWarehouseId = order?.deliveryWarehouseId ?? "";
  const warehouseOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { warehouseId: deliveryWarehouseId },
        queryOptions: { enabled: deliveryWarehouseId !== "" },
      },
    }),
    [deliveryWarehouseId],
  );
  const deliveryWarehouseName = useEndpoint(
    warehouseGetDefinition,
    warehouseOptions,
    logger,
    user,
  ).read?.data?.result?.name;
  const orderCompanyId = order?.companyId;
  const companyListData = useMemo(
    () => (orderCompanyId ? { companyId: orderCompanyId } : undefined),
    [orderCompanyId],
  );

  const filledFor = useRef<string | null>(null);
  useEffect(() => {
    if (!order || !form || filledFor.current === order.id) {
      return;
    }
    filledFor.current = order.id;
    const opts = { shouldDirty: false } as const;
    form.setValue("vendorId", order.vendorId, opts);
    form.setValue("currency", order.currency, opts);
    form.setValue(
      "expectedDeliveryDate",
      order.expectedDeliveryDate ?? undefined,
      opts,
    );
    form.setValue(
      "deliveryWarehouseId",
      order.deliveryWarehouseId ?? undefined,
      opts,
    );
    form.setValue("notes", order.notes ?? undefined, opts);
  }, [order, form]);

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
      className="-ml-1 gap-1.5 self-start"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("orderUpdate.patch.widget.backToPO")}
    </Button>
  ) : undefined;

  const subtitle = order
    ? [order.poNumber, order.vendorName].filter(Boolean).join(" · ")
    : undefined;

  if (data?.result !== undefined) {
    return (
      <AdminForm
        title={t("orderUpdate.patch.widget.title")}
        description={subtitle}
        backButton={backButton}
        primaryAction={
          navigation.canGoBack ? (
            <Button type="button" onClick={() => navigation.pop()}>
              {t("orderUpdate.patch.widget.backToPO")}
            </Button>
          ) : null
        }
      >
        <ResultBanner
          variant="success"
          title={t("orderUpdate.patch.success.title")}
          message={t("orderUpdate.patch.success.description")}
        />
      </AdminForm>
    );
  }

  const editable = !order || order.status === "DRAFT";

  return (
    <AdminForm
      title={t("orderUpdate.patch.widget.title")}
      description={subtitle}
      backButton={backButton}
      secondaryActions={
        navigation.canGoBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigation.pop()}
          >
            {t("orderUpdate.patch.widget.cancel")}
          </Button>
        ) : undefined
      }
      primaryAction={
        editable ? (
          <SubmitButtonWidget<typeof definition.PATCH>
            field={{ text: "orderUpdate.patch.widget.save" }}
          />
        ) : null
      }
    >
      {poId !== "" && !order && read?.isLoading ? (
        <LoadingBlock />
      ) : !editable ? (
        <ResultBanner
          variant="warning"
          title={t("orderUpdate.patch.widget.lockedTitle")}
          message={t("orderUpdate.patch.widget.lockedMessage")}
        />
      ) : (
        <>
          <AdminFormSection
            title={t("orderCreate.post.widget.sectionSupplier")}
            columns={2}
          >
            <EntityPickerFieldWidget
              fieldName="vendorId"
              field={field.children.vendorId}
              listData={companyListData}
              selectedLabel={order?.vendorName ?? undefined}
            />
            <CurrencySelectFieldWidget
              fieldName="currency"
              field={withValue(field.children.currency, undefined, null)}
            />
          </AdminFormSection>
          <AdminFormSection
            title={t("orderCreate.post.widget.sectionDelivery")}
            columns={2}
          >
            <DateFieldWidget
              fieldName="expectedDeliveryDate"
              utcCalendarDay
              field={withValue(
                field.children.expectedDeliveryDate,
                undefined,
                null,
              )}
            />
            <EntityPickerFieldWidget
              fieldName="deliveryWarehouseId"
              field={field.children.deliveryWarehouseId}
              listData={companyListData}
              selectedLabel={deliveryWarehouseName}
            />
            <Div className="@lg:col-span-2">
              <TextareaFieldWidget
                fieldName="notes"
                field={withValue(field.children.notes, undefined, null)}
              />
            </Div>
          </AdminFormSection>
        </>
      )}
    </AdminForm>
  );
}
