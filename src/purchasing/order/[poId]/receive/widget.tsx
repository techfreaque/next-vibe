"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Label } from "next-vibe/ui/components/label";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { NumberInput } from "next-vibe/ui/components/number-input";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { type JSX, useEffect, useId, useMemo } from "react";

import detailDefinition from "../get/definition";
import type definition from "./definition";

export function OrderReceiveWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();

  const result = data?.result;
  const form = useWidgetForm<typeof definition.POST>();
  const poId = form.watch("poId");
  const requested = form.watch("lines");
  const lines = Array.isArray(requested) ? requested : [];
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const isSubmitting = useWidgetIsSubmitting();
  const onSubmit = useWidgetOnSubmit();
  const disabled = useWidgetDisabled();
  const id = useId();
  useEffect(() => {
    if (interactive && poId && !form.getValues("receiptId")) {
      form.setValue("receiptId", crypto.randomUUID());
    }
  }, [form, interactive, poId]);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { poId: poId ?? "" },
        queryOptions: { enabled: interactive && !!poId && !result },
      },
    }),
    [interactive, poId, result],
  );
  const read = useEndpoint(detailDefinition, options, logger, user).read;
  const loaded = read?.data?.result;
  const order = loaded?.id === poId ? loaded : undefined;
  const openLines =
    order?.lines.filter((line) => line.quantityReceived < line.quantity) ?? [];
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 4 });

  const setQuantity = (poLineId: string, quantityReceived: number): void => {
    const current = form.getValues("lines");
    const values = Array.isArray(current) ? current : [];
    const prior = values.find((line) => line.poLineId === poLineId);
    if ((prior?.quantityReceived ?? 0) === quantityReceived) {
      return;
    }
    const next = values.filter((line) => line.poLineId !== poLineId);
    if (quantityReceived > 0) {
      next.push({ poLineId, quantityReceived });
    }
    form.setValue("lines", next, { shouldDirty: true });
  };

  if (result !== undefined) {
    const partial = result.status === "PARTIALLY_RECEIVED";
    return (
      <AdminForm
        title={t("orderReceive.post.success.title")}
        description={order?.poNumber}
        className="max-w-3xl"
        primaryAction={
          navigation.canGoBack ? (
            <Button type="button" onClick={() => navigation.pop()}>
              {t("orderReceive.post.widget.backToPO")}
            </Button>
          ) : null
        }
      >
        <ResultBanner
          variant="success"
          title={
            partial
              ? t("enums.poStatus.partiallyReceived")
              : t("enums.poStatus.received")
          }
          message={new Date(result.receivedAt).toLocaleDateString(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
      </AdminForm>
    );
  }

  return (
    <AdminForm
      title={t("orderReceive.post.title")}
      description={order?.poNumber}
      className="max-w-3xl"
      backButton={
        navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="gap-1.5"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t("orderReceive.post.widget.backToPO")}
          </Button>
        )
      }
      primaryAction={
        <Button
          type="button"
          onClick={() => onSubmit?.()}
          disabled={
            disabled ||
            isSubmitting ||
            !openLines.some((line) =>
              lines.some((quantity) => quantity.poLineId === line.id),
            )
          }
        >
          {t("orderReceive.post.title")}
        </Button>
      }
    >
      {!poId && (
        <EntityPickerFieldWidget fieldName="poId" field={field.children.poId} />
      )}
      {poId &&
        !order &&
        (read?.error ? (
          <EmptyBlock
            title={read.error.message}
            action={{
              label: t("orderReceive.post.widget.retry"),
              onClick: () => void read.refetch(),
            }}
          />
        ) : (
          <LoadingBlock message={t("orderReceive.post.widget.loading")} />
        ))}
      {order && (
        <AdminFormSection title={t("orderReceive.post.lines.label")}>
          {openLines.length ? (
            openLines.map((line) => {
              const remaining =
                Math.round((line.quantity - line.quantityReceived) * 10_000) /
                10_000;
              const quantityId = `${id}-${line.id}`;
              return (
                <Div
                  key={line.id}
                  className="flex min-w-0 flex-wrap items-center justify-between gap-2"
                >
                  <Div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Label htmlFor={quantityId}>{line.description}</Label>
                    <Span className="text-xs text-muted-foreground">
                      {t("orderReceive.post.widget.remaining", {
                        quantity: number.format(remaining),
                      })}
                    </Span>
                  </Div>
                  <NumberInput
                    id={quantityId}
                    min={0}
                    max={remaining}
                    step={0.0001}
                    locale={locale}
                    value={
                      lines.find((quantity) => quantity.poLineId === line.id)
                        ?.quantityReceived ?? 0
                    }
                    onChange={(value) => setQuantity(line.id, value)}
                    disabled={disabled || isSubmitting}
                    className="w-40 max-w-full"
                  />
                </Div>
              );
            })
          ) : (
            <EmptyBlock title={t("orderReceive.post.widget.noOpenLines")} />
          )}
        </AdminFormSection>
      )}
      {order && (
        <EntityPickerFieldWidget
          fieldName="warehouseId"
          field={field.children.warehouseId}
          listData={{ companyId: order.companyId }}
        />
      )}
      <TextareaFieldWidget
        fieldName="notes"
        field={withValue(field.children.notes, undefined, null)}
      />
    </AdminForm>
  );
}
