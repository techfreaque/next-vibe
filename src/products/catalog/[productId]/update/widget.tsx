"use client";

import { Button } from "next-vibe/ui/components/button";
import { Checkbox } from "next-vibe/ui/components/checkbox";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { Textarea } from "next-vibe/ui/components/textarea";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { DecimalInput } from "next-vibe/unified-ui/widgets/form-fields/number-field/decimal-input";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useId } from "react";

import { ProductTypeOptions } from "@/products/enum";

import productDefinition from "../get/definition";
import { scopedTranslation as detailTranslation } from "../get/i18n";
import type definition from "./definition";

export function CatalogUpdateWidget({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const { pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const productId = form.watch("productId");
  const idPrefix = useId();
  const locale = useWidgetLocale();
  const { t: detailT } = detailTranslation.scopedT(locale);
  const disabled = useWidgetDisabled();
  const read = useEndpoint(
    productDefinition,
    {
      read: {
        urlPathParams: { productId },
        queryOptions: { enabled: !!productId },
      },
    },
    logger,
    user,
  ).read;
  const product =
    read?.data?.result.id === productId ? read?.data?.result : undefined;
  const commerce = read?.data?.commerce;
  const edits = form.watch("fields");

  const result = data?.result;

  if (result?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("patch.success.title")}
          </Span>
          <Span className="text-base font-semibold text-foreground mt-1">
            {result.name}
          </Span>
        </Div>
        {canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => pop()}
            className="self-start"
          >
            {t("patch.widget.backToList")}
          </Button>
        )}
      </Div>
    );
  }

  const canEdit = product && commerce?.canEdit;

  return (
    <AdminForm
      title={t("patch.title")}
      className="mx-auto max-w-3xl"
      backButton={
        canGoBack && (
          <Button type="button" variant="ghost" size="sm" onClick={() => pop()}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t("patch.widget.back")}
          </Button>
        )
      }
      primaryAction={
        canEdit && (
          <SubmitButtonWidget<typeof definition.PATCH>
            field={{ text: "patch.title" }}
          />
        )
      }
    >
      {!productId ? (
        <EntityPickerFieldWidget
          fieldName="productId"
          field={{ ...field.children.productId, hidden: false }}
        />
      ) : read?.isLoading ? (
        <Span>{detailT("get.widget.loading")}</Span>
      ) : !product ? (
        <Div className="flex flex-col items-start gap-3">
          <Span>{t("patch.widget.couldNotLoad")}</Span>
          <Button
            type="button"
            variant="outline"
            onClick={() => void read?.refetch()}
          >
            {t("patch.widget.retry")}
          </Button>
        </Div>
      ) : !canEdit ? (
        <Span>{t("patch.errors.forbidden.description")}</Span>
      ) : (
        <Div className="flex flex-col gap-4">
          <Div className="grid gap-3 rounded-lg border bg-muted/40 p-3 @sm:grid-cols-2">
            <Div className="flex flex-col gap-1">
              <Span className="text-sm text-muted-foreground">
                {t("patch.widget.catalogCompany")}
              </Span>
              <Span className="text-sm font-medium">
                {commerce?.companyName ??
                  t(
                    product.companyId
                      ? "patch.widget.companyUnavailable"
                      : "patch.widget.personalCatalog",
                  )}
              </Span>
            </Div>
            <Div className="flex flex-col gap-1">
              <Span className="text-sm text-muted-foreground">
                {t("patch.widget.billingCadence")}
              </Span>
              <Span className="text-sm font-medium">
                {product.billingInterval === "MONTHLY"
                  ? detailT("get.widget.billingMonthly")
                  : product.billingInterval === "YEARLY"
                    ? detailT("get.widget.billingYearly")
                    : t("patch.widget.oneTime")}
              </Span>
            </Div>
          </Div>
          <Div className="grid min-w-0 gap-3 @lg:grid-cols-2">
            <Div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor={`${idPrefix}-name`}>
                {t("patch.name.label")}
              </Label>
              <Input
                id={`${idPrefix}-name`}
                value={edits?.name ?? product.name}
                disabled={disabled}
                onChangeText={(value) =>
                  form.setValue(
                    "fields.name",
                    value === product.name ? undefined : value,
                    { shouldDirty: true },
                  )
                }
              />
            </Div>
            <Div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor={`${idPrefix}-type`}>
                {t("patch.type.label")}
              </Label>
              <Select
                value={edits?.type ?? product.type}
                disabled={disabled}
                onValueChange={(value) => {
                  const type = ProductTypeOptions.find(
                    (option) => option.value === value,
                  )?.value;
                  form.setValue(
                    "fields.type",
                    type === product.type ? undefined : type,
                    { shouldDirty: true },
                  );
                }}
              >
                <SelectTrigger id={`${idPrefix}-type`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ProductTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Div>
          </Div>
          <Div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor={`${idPrefix}-description`}>
              {t("patch.productDescription.label")}
            </Label>
            <Textarea
              id={`${idPrefix}-description`}
              value={edits?.productDescription ?? product.description ?? ""}
              disabled={disabled}
              onChangeText={(value) =>
                form.setValue(
                  "fields.productDescription",
                  value === (product.description ?? "") ? undefined : value,
                  { shouldDirty: true },
                )
              }
            />
          </Div>
          <Div className="grid min-w-0 gap-3 @sm:grid-cols-2">
            <Div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor={`${idPrefix}-sku`}>{t("patch.sku.label")}</Label>
              <Textarea
                id={`${idPrefix}-sku`}
                className="min-h-9 min-w-0 overflow-y-auto font-mono text-xs leading-4 [field-sizing:content] [overflow-wrap:anywhere]"
                rows={3}
                maxLength={100}
                value={edits?.sku ?? product.sku ?? ""}
                disabled={disabled}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                }}
                onChangeText={(value) => {
                  if (!/[\r\n\u2028\u2029]/u.test(value)) {
                    form.setValue(
                      "fields.sku",
                      value === (product.sku ?? "") ? undefined : value,
                      { shouldDirty: true },
                    );
                  }
                }}
              />
            </Div>
            {(["unit", "currency"] as const).map((key) => (
              <Div key={key} className="flex min-w-0 flex-col gap-2">
                <Label htmlFor={`${idPrefix}-${key}`}>
                  {t(`patch.${key}.label`)}
                </Label>
                <Input
                  id={`${idPrefix}-${key}`}
                  value={edits?.[key] ?? product[key] ?? ""}
                  disabled={disabled}
                  onChangeText={(value) =>
                    form.setValue(
                      `fields.${key}`,
                      value === (product[key] ?? "") ? undefined : value,
                      { shouldDirty: true },
                    )
                  }
                />
              </Div>
            ))}
            <Div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor={`${idPrefix}-price`}>
                {t("patch.basePrice.label")}
              </Label>
              <DecimalInput
                id={`${idPrefix}-price`}
                locale={locale}
                presentation="money"
                suffix={edits?.currency ?? product.currency}
                disabled={disabled}
                value={edits?.basePrice ?? product.basePrice}
                onChange={(value) =>
                  form.setValue(
                    "fields.basePrice",
                    value === product.basePrice ? undefined : value,
                    { shouldDirty: true },
                  )
                }
              />
            </Div>
            <Div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor={`${idPrefix}-tax`}>
                {t("patch.defaultTaxRate.label")}
              </Label>
              <DecimalInput
                id={`${idPrefix}-tax`}
                locale={locale}
                presentation="percent"
                suffix="%"
                disabled={disabled}
                value={
                  edits?.defaultTaxRate ?? product.defaultTaxRate ?? undefined
                }
                onChange={(value) =>
                  form.setValue(
                    "fields.defaultTaxRate",
                    value === product.defaultTaxRate ? undefined : value,
                    { shouldDirty: true },
                  )
                }
              />
            </Div>
            <Div className="flex min-w-0 items-end gap-2 pb-2">
              <Checkbox
                id={`${idPrefix}-active`}
                checked={edits?.isActive ?? product.isActive}
                disabled={disabled}
                onCheckedChange={(value) =>
                  form.setValue(
                    "fields.isActive",
                    value === product.isActive ? undefined : value,
                    { shouldDirty: true },
                  )
                }
              />
              <Label htmlFor={`${idPrefix}-active`}>
                {t("patch.isActive.label")}
              </Label>
            </Div>
          </Div>
        </Div>
      )}
    </AdminForm>
  );
}
