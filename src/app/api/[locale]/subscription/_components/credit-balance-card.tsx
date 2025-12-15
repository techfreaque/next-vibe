"use client";

import Link from "next/link";
import { Badge } from "next-vibe-ui/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  Calendar,
  Coins,
  Gift,
  Sparkles,
  Zap,
} from "next-vibe-ui/ui/icons";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";
import { useMemo } from "react";

import { type CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import {
  ProductIds,
  productsRepository,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/products/repository-client";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Format credit amount for display
 * Shows decimals only when needed
 */
function formatCredits(amount: number): string {
  if (amount === Math.floor(amount)) {
    return amount.toString();
  }
  return amount.toFixed(2);
}

interface CreditBalanceCardProps {
  locale: CountryLanguage;
  initialCredits: CreditsGetResponseOutput | null;
  freeCredits: number;
}

export function CreditBalanceCard({
  locale,
  initialCredits,
  freeCredits,
}: CreditBalanceCardProps): JSX.Element {
  const { t } = useTranslation();

  // Create logger once - memoize to prevent recreating on every render
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  // Fetch credits data with server-side initial data (disables initial fetch)
  // Will refetch on window focus to keep data fresh
  // Hook handles null case internally - called unconditionally per React rules
  const creditsEndpoint = useCredits(logger, initialCredits ?? null);
  const credits =
    creditsEndpoint?.read?.response?.success &&
    creditsEndpoint.read.response.data
      ? creditsEndpoint.read.response.data
      : initialCredits;

  // Get subscription credits from products repository
  const subscriptionProduct = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
  );

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader>
          <Div className="flex items-start justify-between">
            <Div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-3">
                <Div className="p-2 rounded-lg bg-primary/10">
                  <Coins className="h-6 w-6 text-primary" />
                </Div>
                {t("app.subscription.subscription.balance.title")}
              </CardTitle>
              <CardDescription>
                {t("app.subscription.subscription.balance.description", {
                  modelCount: TOTAL_MODEL_COUNT,
                })}
              </CardDescription>
            </Div>
            <Badge className="text-lg font-bold px-4 py-2">
              {(credits?.total ?? 0) === 1
                ? t("app.subscription.subscription.balance.credit", {
                    count: formatCredits(credits?.total ?? 0),
                  })
                : t("app.subscription.subscription.balance.credits", {
                    count: formatCredits(credits?.total ?? 0),
                  })}
            </Badge>
          </Div>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Expiring Credits */}
            <Div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <Div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 mb-2">
                <Calendar className="h-4 w-4" />
                {t("app.subscription.subscription.balance.expiring.title")}
              </Div>
              <Div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {formatCredits(credits?.expiring ?? 0)}
              </Div>
              <Div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {t(
                  "app.subscription.subscription.balance.expiring.description",
                  {
                    subCredits: subscriptionProduct.credits,
                  },
                )}
              </Div>
            </Div>

            {/* Permanent Credits */}
            <Div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 mb-2">
                <Sparkles className="h-4 w-4" />
                {t("app.subscription.subscription.balance.permanent.title")}
              </Div>
              <Div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatCredits(credits?.permanent ?? 0)}
              </Div>
              <Div className="text-xs text-green-600 dark:text-green-400 mt-1">
                {t(
                  "app.subscription.subscription.balance.permanent.description",
                )}
              </Div>
            </Div>

            {/* Free Credits */}
            <Div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 mb-2">
                <Zap className="h-4 w-4" />
                {t("app.subscription.subscription.balance.free.title")}
              </Div>
              <Div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCredits(credits?.free ?? 0)}
              </Div>
              <Div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {t("app.subscription.subscription.balance.free.description", {
                  count: freeCredits,
                })}
              </Div>
            </Div>

            {/* Earned Credits (from referrals) */}
            <Link href={`/${locale}/user/referral`} className="block">
              <Div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors cursor-pointer h-full">
                <Div className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-300 mb-2">
                  <Gift className="h-4 w-4" />
                  {t("app.subscription.subscription.balance.earned.title")}
                </Div>
                <Div className="text-2xl font-bold text-violet-900 dark:text-violet-100">
                  {formatCredits(credits?.earned ?? 0)}
                </Div>
                <Div className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                  {t(
                    "app.subscription.subscription.balance.earned.description",
                  )}
                </Div>
              </Div>
            </Link>
          </Div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
