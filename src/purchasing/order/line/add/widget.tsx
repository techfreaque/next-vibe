"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Input } from "next-vibe/ui/components/input";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
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
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo, useState } from "react";

import productLookup from "@/pos/product-lookup/definition";

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
  const form = useWidgetForm<typeof definition.POST>();
  const poId = form.watch("poId");
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
  const currentOrder = order?.id === poId ? order : undefined;
  const currency = result?.currency ?? currentOrder?.currency;
  const companyId = currentOrder?.companyId;
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [chosen, setChosen] = useState<{ id: string; name: string }>();
  const productId = form.watch("productId");
  const selected = chosen?.id === productId ? chosen : undefined;
  const search = useApiQuery({
    endpoint: productLookup.GET,
    requestData: { query: submitted, companyId },
    options: {
      enabled: interactive && !result && Boolean(companyId && submitted),
      queryKey: `purchasing-product:${companyId ?? ""}:${submitted}`,
    },
    logger,
    user,
  });

  const selectProduct = (id: string, name: string): void => {
    form.setValue("productId", id, { shouldDirty: true });
    if (!form.getValues("itemDescription")) {
      form.setValue("itemDescription", name, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    setChosen({ id, name });
    setQuery("");
    setSubmitted("");
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
      className="-ml-1 gap-1.5 self-start"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("orderLineAdd.post.widget.backToOrder")}
    </Button>
  ) : undefined;

  const subtitle = currentOrder
    ? [currentOrder.poNumber, currentOrder.vendorName]
        .filter(Boolean)
        .join(" · ")
    : t("orderLineAdd.post.description");

  if (result !== undefined) {
    return (
      <AdminForm
        title={t("orderLineAdd.post.title")}
        description={subtitle}
        backButton={backButton}
        primaryAction={
          navigation.canGoBack ? (
            <Button type="button" onClick={() => navigation.pop()}>
              {t("orderLineAdd.post.widget.backToOrder")}
            </Button>
          ) : null
        }
      >
        <ResultBanner
          variant="success"
          title={t("orderLineAdd.post.widget.lineAdded")}
          message={t("orderLineAdd.post.success.description")}
        >
          <DetailGrid columns={3}>
            <DetailField
              label={t("orderLineAdd.post.response.subtotal")}
              value={formatMoney(result.subtotal, result.currency, locale)}
            />
            <DetailField
              label={t("orderLineAdd.post.response.taxAmount")}
              value={formatMoney(result.taxAmount, result.currency, locale)}
            />
            <DetailField
              label={t("orderLineAdd.post.response.total")}
              value={formatMoney(result.total, result.currency, locale)}
            />
          </DetailGrid>
        </ResultBanner>
      </AdminForm>
    );
  }

  return (
    <AdminForm
      title={t("orderLineAdd.post.title")}
      description={subtitle}
      backButton={backButton}
      alert={<FormAlertWidget field={{}} />}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "orderLineAdd.post.title" }}
        />
      }
    >
      <AdminFormSection title={t("orderLineAdd.post.titleShort")} columns={2}>
        {!poId && (
          <Div className="@lg:col-span-2">
            <EntityPickerFieldWidget
              fieldName="poId"
              field={{ ...field.children.poId, hidden: false }}
            />
          </Div>
        )}
        {interactive && (
          <Div className="flex min-w-0 flex-col gap-2 @lg:col-span-2">
            {selected ? (
              <Div className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2">
                <Span className="px-1 text-sm font-medium">
                  {selected.name}
                </Span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    form.setValue("productId", undefined, {
                      shouldDirty: true,
                    });
                    setChosen(undefined);
                  }}
                >
                  {t("orderLineAdd.post.widget.clearProduct")}
                </Button>
              </Div>
            ) : (
              <Div className="flex items-center gap-2">
                <Input
                  aria-label={t("orderLineAdd.post.widget.productSearch")}
                  placeholder={t("orderLineAdd.post.widget.productSearch")}
                  disabled={!companyId}
                  value={query}
                  onChangeText={setQuery}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!companyId || !query.trim() || search.isFetching}
                  onClick={() => {
                    const term = query.trim();
                    if (term === submitted) {
                      void search.refetch();
                    } else {
                      setSubmitted(term);
                    }
                  }}
                >
                  {t("orderLineAdd.post.widget.search")}
                </Button>
              </Div>
            )}
            {submitted &&
              !search.isFetching &&
              search.response?.success === false && (
                <Span className="text-sm text-destructive">
                  {search.response.message}
                </Span>
              )}
            {submitted &&
              !search.isFetching &&
              search.response?.success &&
              (search.response.data.products.length === 0 ? (
                <Span className="text-sm text-muted-foreground">
                  {t("orderLineAdd.post.widget.noProducts")}
                </Span>
              ) : (
                <Div className="flex flex-col gap-1 rounded-md border p-1">
                  {search.response.data.products.map((product) => (
                    <Button
                      key={product.id}
                      type="button"
                      variant="ghost"
                      className="justify-start"
                      onClick={() => selectProduct(product.id, product.name)}
                    >
                      {product.name}
                      {product.sku && (
                        <Span className="text-muted-foreground">
                          {product.sku}
                        </Span>
                      )}
                    </Button>
                  ))}
                </Div>
              ))}
          </Div>
        )}
        <Div className="@lg:col-span-2">
          <TextFieldWidget
            fieldName="itemDescription"
            field={withValue(field.children.itemDescription, undefined, null)}
          />
        </Div>
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
        <NumberFieldWidget
          fieldName="taxRate"
          presentation="percent"
          field={withValue(field.children.taxRate, undefined, null)}
        />
      </AdminFormSection>
    </AdminForm>
  );
}
