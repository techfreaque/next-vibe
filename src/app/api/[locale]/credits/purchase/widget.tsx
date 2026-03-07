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
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Minus } from "next-vibe-ui/ui/icons/Minus";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect } from "react";

import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { useSubscription } from "@/app/api/[locale]/subscription/hooks";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { useTranslation } from "@/i18n/core/client";

import type definition from "./definition";
import type { CreditsPurchasePostResponseOutput } from "./definition";

const MIN_QTY = 1;

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
  const t = useWidgetTranslation<typeof definition.POST>();
  const { locale } = useTranslation();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const form = useWidgetForm();

  const products = productsRepository.getProducts(locale);
  const packProduct = products[ProductIds.CREDIT_PACK];
  const packPrice = packProduct.price;
  const packCredits = packProduct.credits;

  const subscriptionEndpoint = useSubscription(logger, user);
  const currentSubscription = subscriptionEndpoint.read?.data;
  const hasActiveSubscription =
    currentSubscription?.status === SubscriptionStatus.ACTIVE;

  const quantity: number = Number(form?.watch("quantity") ?? 1) || 1;
  const totalPrice = packPrice * quantity;
  const totalCredits = packCredits * quantity;

  function setQuantity(next: number): void {
    const clamped = Math.max(MIN_QTY, next);
    form?.setValue("quantity", clamped, { shouldValidate: true });
  }

  // Redirect to checkout URL on successful response
  useEffect(() => {
    if (field.value?.checkoutUrl) {
      window.location.href = field.value.checkoutUrl;
    }
  }, [field.value?.checkoutUrl]);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl">{t("post.pack.title")}</CardTitle>
        <CardDescription>{t("post.pack.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Pricing Display */}
        <Div className="flex items-baseline gap-1">
          <Div className="text-4xl font-bold">
            {formatPrice(packPrice, locale, packProduct.currency)}
          </Div>
          <Div className="text-sm text-muted-foreground">
            {t("post.pack.perPack")}
          </Div>
        </Div>

        {/* Features */}
        <Div className="flex flex-col gap-3 text-sm">
          <Div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            <Span>
              {t("post.pack.features.credits", {
                count: packCredits,
              })}
            </Span>
          </Div>
          <Div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <Span>{t("post.pack.features.expiry")}</Span>
          </Div>
          <Div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <Span>{t("post.pack.features.bestFor")}</Span>
          </Div>
        </Div>

        {/* Purchase Form - Only for active subscribers */}
        {hasActiveSubscription ? (
          <Div className="flex flex-col gap-4">
            <FormAlertWidget field={{}} />

            {/* Quantity Stepper */}
            <Div className="flex flex-col gap-2">
              <Span className="text-sm font-medium text-muted-foreground">
                {t("post.quantity.label")}
              </Span>
              <Div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="h-14 w-14 rounded-none border-r border-border text-xl font-light flex-shrink-0"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= MIN_QTY}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Div className="flex-1 flex flex-col items-center justify-center h-14 select-none">
                  <Span className="text-2xl font-bold tabular-nums">
                    {quantity}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {quantity === 1 ? "pack" : "packs"}
                  </Span>
                </Div>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="h-14 w-14 rounded-none border-l border-border text-xl font-light flex-shrink-0"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </Div>

              {/* Total summary */}
              {quantity > 1 && (
                <Div className="text-sm text-muted-foreground px-1">
                  {t("post.pack.totalSummary", {
                    totalCredits: totalCredits.toLocaleString(locale),
                    totalPrice: formatPrice(
                      totalPrice,
                      locale,
                      packProduct.currency,
                    ),
                  })}
                </Div>
              )}
            </Div>

            {/* Submit Button */}
            <SubmitButtonWidget<typeof definition.POST>
              field={{
                text: "post.submit.text",
                loadingText: "post.submit.loading",
                icon: "credit-card",
                variant: "default",
              }}
            />

            {/* Response - Checkout Link (fallback if redirect doesn't work) */}
            {field.value?.checkoutUrl && (
              <Div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Div className="text-sm font-medium mb-2">
                  {t("post.redirecting")}
                </Div>
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href={field.value.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("post.openCheckout")}
                  </Link>
                </Button>
              </Div>
            )}
          </Div>
        ) : (
          <Div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Div className="text-sm text-amber-700 dark:text-amber-300">
              <Info className="h-4 w-4 inline mr-2" />
              {t("post.pack.requiresSubscription")}
            </Div>
          </Div>
        )}
      </CardContent>
    </Card>
  );
}
