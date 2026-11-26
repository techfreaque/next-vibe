"use client";

import { Button } from "next-vibe/ui/components/button";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  AdminRecordDetail,
  type AdminRecordFact,
} from "next-vibe/unified-ui/_shared/admin-record-detail";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";
import { z } from "zod";

import deactivateDefinition from "../deactivate/definition";
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
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const form = useWidgetForm<typeof definition.GET>();
  const requestedId = form?.watch("vendorId");
  const vendorId = result?.id ?? "";
  const deactivateOptions = useMemo(
    () => ({ create: { urlPathParams: { vendorId } } }),
    [vendorId],
  );
  const deactivate = useEndpoint(
    deactivateDefinition,
    deactivateOptions,
    logger,
    user,
  ).create;
  const deactivateFailed = deactivate?.response?.success === false;
  // The record refetch can return the cached row; trust the action result.
  const isActive =
    result?.isActive === true && deactivate?.response?.success !== true;

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
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className="self-start gap-1.5 -ml-2"
      onClick={back}
    >
      <ChevronLeft className="size-4" aria-hidden="true" />
      {t("vendorGet.get.widget.backToList")}
    </Button>
  );

  const edit = (): void => {
    if (!result) {
      return;
    }
    void import("../update/definition").then((mod) =>
      navigation.push(mod.default.PATCH, {
        urlPathParams: { vendorId: result.id },
        popNavigationOnSuccess: 1,
        onSuccessCallback: () => void read?.refetch(),
      }),
    );
  };
  const runDeactivate = (): void => {
    if (!deactivate) {
      return;
    }
    void (async (): Promise<void> => {
      await deactivate.submitForm();
      await read?.refetch();
    })();
  };
  const createOrder = (): void => {
    if (!result) {
      return;
    }
    void import("../../../order/create/definition").then((mod) =>
      navigation.push(mod.default.POST, {
        data: { companyId: result.companyId, vendorId: result.id },
      }),
    );
  };
  const viewOrders = (): void => {
    if (!result) {
      return;
    }
    void import("../../../order/list/definition").then((mod) =>
      navigation.push(mod.default.GET, {
        data: { companyId: result.companyId, vendorId: result.id },
      }),
    );
  };

  const address = result
    ? [
        result.addressLine1,
        result.addressLine2,
        [result.postalCode, result.city, result.region]
          .filter(Boolean)
          .join(" "),
        result.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const facts: AdminRecordFact[] = result
    ? [
        ...(result.orderCount !== undefined
          ? [
              {
                key: "orders",
                label: t("vendorGet.get.widget.orderCount"),
                value: result.orderCount.toLocaleString(locale),
              },
            ]
          : []),
        ...(result.receivingCount !== undefined
          ? [
              {
                key: "receiving",
                label: t("vendorGet.get.widget.receivingCount"),
                value: result.receivingCount.toLocaleString(locale),
              },
            ]
          : []),
        {
          key: "terms",
          label: t("vendorGet.get.widget.paymentTerms"),
          value:
            result.defaultPaymentTermsDays === null
              ? undefined
              : result.defaultPaymentTermsDays === 0
                ? t("vendorGet.get.widget.dueOnReceipt")
                : t("vendorGet.get.widget.netDays", {
                    days: result.defaultPaymentTermsDays.toLocaleString(locale),
                  }),
        },
        {
          key: "currency",
          label: t("vendorGet.get.response.defaultCurrency"),
          value: result.defaultCurrency,
        },
        {
          key: "vat",
          label: t("vendorGet.get.response.vatNumber"),
          value: result.vatNumber ?? undefined,
        },
        {
          key: "phone",
          label: t("vendorGet.get.response.phone"),
          value: result.phone ?? undefined,
        },
        {
          key: "email",
          label: t("vendorGet.get.response.email"),
          value: result.email ?? undefined,
          className: "@sm:col-span-2 @lg:col-span-3",
        },
        {
          key: "address",
          label: t("vendorGet.get.widget.address"),
          value: address || undefined,
        },
        {
          key: "website",
          label: t("vendorGet.get.response.website"),
          value: result.website ?? undefined,
        },
        {
          key: "tax",
          label: t("vendorGet.get.response.taxId"),
          value: result.taxId ?? undefined,
        },
        {
          key: "notes",
          label: t("vendorGet.get.response.notes"),
          value: result.notes ?? undefined,
        },
      ].filter((fact) => fact.value !== undefined && fact.value !== "")
    : [];

  if (
    !result &&
    response?.success !== false &&
    !z.uuid().safeParse(requestedId).success
  ) {
    return (
      <AdminRecordDetail
        title={t("vendorGet.get.titleShort")}
        backButton={backButton}
      >
        <EntityPickerFieldWidget
          fieldName="vendorId"
          field={field.children.vendorId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "vendorGet.get.widget.select" }}
        />
      </AdminRecordDetail>
    );
  }

  return (
    <AdminRecordDetail
      title={result?.name ?? t("vendorGet.get.titleShort")}
      subtitle={
        result
          ? [result.code, result.companyName].filter(Boolean).join(" · ") ||
            undefined
          : undefined
      }
      status={
        result
          ? {
              status: isActive ? "active" : "inactive",
              label: t(
                isActive
                  ? "vendorList.get.widget.active"
                  : "vendorList.get.widget.inactive",
              ),
              variant: isActive ? "success" : "muted",
            }
          : undefined
      }
      backButton={backButton}
      primaryAction={
        interactive && isActive
          ? {
              key: "order",
              label: t("vendorGet.get.widget.createOrder"),
              icon: <Plus className="size-4" aria-hidden="true" />,
              onClick: createOrder,
            }
          : undefined
      }
      secondaryActions={
        interactive && result
          ? [
              {
                key: "orders",
                label: t("vendorGet.get.widget.viewOrders"),
                onClick: viewOrders,
              },
              {
                key: "edit",
                label: t("vendorGet.get.widget.edit"),
                icon: <Pencil className="size-4" aria-hidden="true" />,
                onClick: edit,
              },
            ]
          : undefined
      }
      moreActions={
        interactive && isActive && deactivate
          ? [
              {
                key: "deactivate",
                label: t("vendorGet.get.widget.deactivate"),
                destructive: true,
                disabled: deactivate.isSubmitting,
                onClick: runDeactivate,
                confirm: {
                  title: t("vendorGet.get.widget.deactivateTitle", {
                    name: result.name,
                  }),
                  message: t("vendorGet.get.widget.deactivateMessage"),
                  confirmLabel: t("vendorGet.get.widget.deactivate"),
                },
              },
            ]
          : undefined
      }
      feedback={
        deactivateFailed ? (
          <ResultBanner
            variant="danger"
            title={t("vendorGet.get.widget.deactivateFailed")}
            message={deactivate?.response?.message}
          />
        ) : undefined
      }
      facts={facts}
      technicalDetails={
        result
          ? [
              {
                key: "id",
                label: t("vendorGet.get.vendorId.label"),
                value: result.id,
              },
            ]
          : undefined
      }
      state={
        result
          ? { kind: "ready" }
          : response?.success === false
            ? {
                kind: "error",
                title: t("vendorGet.get.widget.loadFailed"),
                message: response.message,
                action:
                  read && interactive
                    ? {
                        label: t("vendorGet.get.widget.retry"),
                        onClick: () => void read.refetch(),
                      }
                    : undefined,
                secondaryAction: interactive
                  ? {
                      label: t("vendorGet.get.widget.backToList"),
                      onClick: back,
                    }
                  : undefined,
              }
            : { kind: "loading", label: t("vendorGet.get.widget.loading") }
      }
    />
  );
}
