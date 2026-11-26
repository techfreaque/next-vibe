"use client";

import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
  formatPercent,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { scopedTranslation as accountingTranslation } from "@/payment/accounting/i18n";
import { PaymentProvider } from "@/payment/enum";

import { ProductType } from "../../../enum";
import type definition from "./definition";

export function CatalogProductGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const { push, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const { t: accountingT } = accountingTranslation.scopedT(locale);
  const product = data?.result;
  const commerce = data?.commerce;

  const browse = (): void => {
    if (canGoBack) {
      pop();
      return;
    }
    void import("../../list/definition").then(({ default: catalog }) => {
      push(catalog.GET, {});
      return undefined;
    });
  };
  const back = interactive ? (
    <Button type="button" variant="ghost" size="sm" onClick={browse}>
      <ChevronLeft className="size-4" />
      {t("get.widget.back")}
    </Button>
  ) : undefined;

  if (!product) {
    return (
      <WidgetShell layout="page">
        <WidgetHeader size="page" title={t("get.title")} backButton={back} />
        {response?.success === false ? (
          <EmptyBlock
            title={t("get.widget.unavailable")}
            message={response.message}
          />
        ) : (
          interactive && (
            <>
              <EntityPickerFieldWidget
                fieldName="productId"
                field={field.children.productId}
              />
              <SubmitButtonWidget<typeof definition.GET>
                field={{ text: "get.widget.select" }}
              />
            </>
          )
        )}
      </WidgetShell>
    );
  }

  const physical = product.type === ProductType.PHYSICAL;
  const typeLabel = physical
    ? t("get.widget.typePhysical")
    : product.type === ProductType.SERVICE
      ? t("get.widget.typeService")
      : t("get.widget.typeDigital");
  const interval =
    product.billingInterval === "MONTHLY"
      ? t("get.widget.billingMonthly")
      : product.billingInterval === "YEARLY"
        ? t("get.widget.billingYearly")
        : undefined;
  const canMap = commerce?.canConfigure && product.isActive && !!product.sku;
  const companyId = product.companyId ?? undefined;
  const configure = (): void => {
    if (!companyId) {
      return;
    }
    void import("@/payment/accounting/mapping/definition").then(
      ({ default: mapping }) => {
        push(mapping.POST, {
          data: {
            companyId,
            productId: product.id,
            currency: CurrenciesArr.find(
              (code) => code === commerce?.companyCurrency,
            ),
          },
        });
        return undefined;
      },
    );
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={product.name}
        subtitle={product.description ?? commerce?.companyName}
        backButton={back}
        titleAccessory={
          <StatusPill
            status={product.isActive ? "active" : "inactive"}
            label={
              product.isActive
                ? t("get.widget.active")
                : t("get.widget.inactive")
            }
            variant={product.isActive ? "success" : "muted"}
          />
        }
        actions={
          interactive && commerce?.canEdit ? (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                void import("../update/definition").then(
                  ({ default: editor }) => {
                    push(editor.PATCH, {
                      urlPathParams: { productId: product.id },
                      popNavigationOnSuccess: 1,
                    });
                    return undefined;
                  },
                );
              }}
            >
              {t("get.widget.edit")}
            </Button>
          ) : undefined
        }
      />

      <SectionGroup title={t("get.widget.details")}>
        <DetailGrid columns={3}>
          <DetailField
            label={t("get.response.sku")}
            value={product.sku ?? undefined}
          />
          <DetailField label={t("get.response.type")} value={typeLabel} />
          {commerce?.companyName && (
            <DetailField
              label={t("get.response.companyId")}
              value={commerce.companyName}
            />
          )}
          {product.isSubscription && (
            <DetailField label={t("get.widget.recurring")} value={interval} />
          )}
          <DetailField
            label={t("get.response.basePrice")}
            value={formatMoney(product.basePrice, product.currency, locale)}
          />
          <DetailField
            label={t("get.response.currency")}
            value={product.currency}
          />
          <DetailField
            label={t("get.response.defaultTaxRate")}
            value={
              product.defaultTaxRate !== null
                ? formatPercent(product.defaultTaxRate, locale)
                : undefined
            }
          />
          {product.unit && (
            <DetailField label={t("get.response.unit")} value={product.unit} />
          )}
          <DetailField
            label={t("get.response.updatedAt")}
            value={formatDocDate(product.updatedAt, locale)}
          />
        </DetailGrid>
      </SectionGroup>

      {commerce && commerce.prices.length > 0 && (
        <SectionGroup title={t("get.widget.prices")}>
          <DetailGrid columns={3}>
            {commerce.prices.map((price) => (
              <DetailField
                key={price.id}
                label={
                  price.tierName
                    ? `${price.tierName} · ${price.currency}`
                    : price.currency
                }
                value={formatMoney(price.price, price.currency, locale)}
              />
            ))}
          </DetailGrid>
        </SectionGroup>
      )}

      {interactive && physical && commerce?.canViewStock && companyId && (
        <SectionGroup title={t("get.widget.stock")}>
          <Button
            type="button"
            variant="outline"
            className="self-start"
            onClick={() => {
              void import("@/inventory/stock/list/definition").then(
                ({ default: stock }) => {
                  push(stock.GET, {
                    data: {
                      companyId,
                      productId: product.id,
                    },
                  });
                  return undefined;
                },
              );
            }}
          >
            {t("get.widget.viewStock")}
          </Button>
        </SectionGroup>
      )}

      {commerce?.canConfigure && (
        <SectionGroup title={t("get.widget.offers")}>
          {commerce.offers.length > 0 ? (
            commerce.offers.map((offer) => (
              <Div key={offer.id} className="rounded-md border p-3">
                <DetailGrid columns={3}>
                  <DetailField
                    label={accountingT(
                      offer.provider === PaymentProvider.STRIPE
                        ? "providerStripe"
                        : "providerNow",
                    )}
                    value={offer.offerId}
                  />
                  <DetailField
                    label={t("get.response.currency")}
                    value={offer.currency}
                  />
                  <DetailField
                    label={t(
                      offer.recognition === "immediate"
                        ? "get.widget.revenueAccount"
                        : "get.widget.liabilityAccount",
                    )}
                    value={
                      offer.accountName
                        ? [offer.accountCode, offer.accountName]
                            .filter(Boolean)
                            .join(" ")
                        : undefined
                    }
                  />
                </DetailGrid>
              </Div>
            ))
          ) : (
            <P className="text-sm text-muted-foreground">
              {t("get.widget.noOffers")}
            </P>
          )}
          {interactive &&
            (canMap ? (
              <Button
                type="button"
                variant="outline"
                className="self-start"
                onClick={configure}
              >
                {t("get.widget.configureOffer")}
              </Button>
            ) : (
              <P className="text-sm text-muted-foreground">
                {t("get.widget.offerNeedsSku")}
              </P>
            ))}
        </SectionGroup>
      )}

      {interactive && (product.isActive || commerce?.canEdit) && (
        <Div className="flex flex-wrap gap-2">
          {product.isActive && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void import("@/payment/invoice/line/add/definition").then(
                  ({ default: invoice }) => {
                    push(invoice.POST, {
                      data: {
                        productId: product.id,
                        description: product.name,
                        quantity: 1,
                      },
                    });
                    return undefined;
                  },
                );
              }}
            >
              {t("get.widget.addToInvoice")}
            </Button>
          )}
          {commerce?.canEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void import("../deactivate/definition").then(
                  ({ default: update }) => {
                    push(update.POST, {
                      urlPathParams: { productId: product.id },
                      popNavigationOnSuccess: 1,
                    });
                    return undefined;
                  },
                );
              }}
            >
              {t(
                product.isActive
                  ? "get.widget.deactivate"
                  : "get.widget.activate",
              )}
            </Button>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
