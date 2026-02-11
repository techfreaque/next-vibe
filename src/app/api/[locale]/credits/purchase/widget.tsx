/**
 * Credits Purchase Widget
 * Complete credit pack pricing card with purchase form
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  AlertCircle,
  ExternalLink,
  Info,
  Sparkles,
  TrendingUp,
} from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect } from "react";

import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { IntFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/int-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { useTranslation } from "@/i18n/core/client";

import type definition from "./definition";
import type { CreditsPurchasePostResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: CreditsPurchasePostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

/**
 * Format price with currency
 */
function formatPrice(price: number, locale: string, currency: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });
  return formatter.format(price);
}

/**
 * Credits Purchase Container Widget
 */
export function CreditsPurchaseContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const t = useWidgetTranslation();
  const children = field.children;
  const { locale } = useTranslation();

  const products = productsRepository.getProducts(locale);
  const packProduct = products[ProductIds.CREDIT_PACK];
  const packPrice = packProduct.price;
  const packCredits = packProduct.credits;

  const hasActiveSubscription = false;

  // Redirect to checkout URL on successful response
  useEffect(() => {
    if (field.value?.checkoutUrl) {
      window.location.href = field.value.checkoutUrl;
    }
  }, [field.value?.checkoutUrl]);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t("app.subscription.subscription.buy.pack.title")}
        </CardTitle>
        <CardDescription>
          {t("app.subscription.subscription.buy.pack.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Pricing Display */}
        <Div className="flex items-baseline gap-1">
          <Div className="text-4xl font-bold">
            {formatPrice(packPrice, locale, packProduct.currency)}
          </Div>
          <Div className="text-sm text-muted-foreground">
            {t("app.subscription.subscription.buy.pack.perPack")}
          </Div>
        </Div>

        {/* Features */}
        <Div className="flex flex-col gap-3 text-sm">
          <Div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            <Span>
              {t("app.subscription.subscription.buy.pack.features.credits", {
                count: packCredits,
              })}
            </Span>
          </Div>
          <Div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <Span>
              {t("app.subscription.subscription.buy.pack.features.expiry")}
            </Span>
          </Div>
          <Div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <Span>
              {t("app.subscription.subscription.buy.pack.features.bestFor")}
            </Span>
          </Div>
        </Div>

        {/* Purchase Form - Only for active subscribers */}
        {hasActiveSubscription ? (
          <Div className="flex flex-col gap-3">
            <FormAlertWidget field={{}} />

            {/* Quantity Field */}
            <Div className="w-full">
              <IntFieldWidget fieldName="quantity" field={children.quantity} />
            </Div>

            {/* Submit Button */}
            <SubmitButtonWidget
              field={{
                text: "app.subscription.subscription.buy.pack.button.submit",
                loadingText: "app.api.credits.purchase.post.submit.loading",
                icon: "credit-card",
                variant: "outline",
              }}
            />

            {/* Response - Checkout Link (fallback if redirect doesn't work) */}
            {field.value?.checkoutUrl && (
              <Div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Div className="text-sm font-medium mb-2">
                  {t("app.api.credits.purchase.post.redirecting")}
                </Div>
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href={field.value.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("app.api.credits.purchase.post.openCheckout")}
                  </Link>
                </Button>
              </Div>
            )}
          </Div>
        ) : (
          <Div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Div className="text-sm text-amber-700 dark:text-amber-300">
              <Info className="h-4 w-4 inline mr-2" />
              {t("app.subscription.subscription.buy.pack.requiresSubscription")}
            </Div>
          </Div>
        )}
      </CardContent>
    </Card>
  );
}
