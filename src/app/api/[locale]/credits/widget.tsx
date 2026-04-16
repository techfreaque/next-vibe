/**
 * Credits Balance Widget
 * Displays user credit balance breakdown
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { Coins } from "next-vibe-ui/ui/icons/Coins";
import { Gift } from "next-vibe-ui/ui/icons/Gift";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import {
  useWidgetSelector,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { useTranslation } from "@/i18n/core/client";

import type definition from "./definition";

/**
 * Format credit amount for display
 * Rounds to 2 decimal places to avoid floating point artifacts
 */
function formatCredits(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  if (rounded === Math.floor(rounded)) {
    return rounded.toString();
  }
  return rounded.toFixed(2);
}

/**
 * Credits total badge — subscribes only to `total`
 */
function CreditsBadge(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const total = useWidgetSelector<typeof definition.GET>()(
    (data) => data?.total ?? 0,
  );
  return (
    <Badge className="text-lg font-bold px-4 py-2">
      {total === 1
        ? t("get.balance.credit", { count: formatCredits(total) })
        : t("get.balance.credits", { count: formatCredits(total) })}
    </Badge>
  );
}

/**
 * Expiring credits cell — re-renders only when `expiring` changes
 */
function ExpiringCell(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const { locale } = useTranslation();
  const expiring = useWidgetSelector<typeof definition.GET>()(
    (data) => data?.expiring ?? 0,
  );
  const subscriptionProduct = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
  );
  return (
    <Div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
      <Div className="flex items-center gap-2 text-sm text-warning mb-2">
        <Calendar className="h-4 w-4" />
        {t("get.balance.expiring.title")}
      </Div>
      <Div className="text-2xl font-bold text-warning">
        {formatCredits(expiring)}
      </Div>
      <Div className="text-xs text-warning/70 mt-1">
        {t("get.balance.expiring.description", {
          subCredits: subscriptionProduct.credits,
        })}
      </Div>
    </Div>
  );
}

/**
 * Permanent credits cell — re-renders only when `permanent` changes
 */
function PermanentCell(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const permanent = useWidgetSelector<typeof definition.GET>()(
    (data) => data?.permanent ?? 0,
  );
  return (
    <Div className="p-4 rounded-lg bg-success/10 border border-success/30">
      <Div className="flex items-center gap-2 text-sm text-success mb-2">
        <Sparkles className="h-4 w-4" />
        {t("get.balance.permanent.title")}
      </Div>
      <Div className="text-2xl font-bold text-success">
        {formatCredits(permanent)}
      </Div>
      <Div className="text-xs text-success/70 mt-1">
        {t("get.balance.permanent.description")}
      </Div>
    </Div>
  );
}

/**
 * Free credits cell — re-renders only when `free` changes
 */
function FreeCell(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const { locale } = useTranslation();
  const free = useWidgetSelector<typeof definition.GET>()(
    (data) => data?.free ?? 0,
  );
  const freeProduct = productsRepository.getProduct(
    ProductIds.FREE_TIER,
    locale,
  );
  return (
    <Div className="p-4 rounded-lg bg-info/10 border border-info/30">
      <Div className="flex items-center gap-2 text-sm text-info mb-2">
        <Zap className="h-4 w-4" />
        {t("get.balance.free.title")}
      </Div>
      <Div className="text-2xl font-bold text-info">{formatCredits(free)}</Div>
      <Div className="text-xs text-info/70 mt-1">
        {t("get.balance.free.description", { count: freeProduct.credits })}
      </Div>
    </Div>
  );
}

/**
 * Earned credits cell — re-renders only when `earned` changes
 */
function EarnedCell(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const { locale } = useTranslation();
  const earned = useWidgetSelector<typeof definition.GET>()(
    (data) => data?.earned ?? 0,
  );
  return (
    <Link href={`/${locale}/user/referral`} className="block">
      <Div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors cursor-pointer h-full">
        <Div className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-300 mb-2">
          <Gift className="h-4 w-4" />
          {t("get.balance.earned.title")}
        </Div>
        <Div className="text-2xl font-bold text-violet-900 dark:text-violet-100">
          {formatCredits(earned)}
        </Div>
        <Div className="text-xs text-violet-600 dark:text-violet-400 mt-1">
          {t("get.balance.earned.description")}
        </Div>
      </Div>
    </Link>
  );
}

/**
 * Credits Balance Container Widget
 * The container itself subscribes to nothing — only sub-components re-render on data changes
 */
export function CreditsBalanceContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const widgetUser = useWidgetUser();
  const isAdmin =
    !widgetUser.isPublic && widgetUser.roles.includes(UserRole.ADMIN);
  const totalModelCount = getAvailableModelCount(isAdmin);

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
                {t("get.balance.title")}
              </CardTitle>
              <CardDescription>
                {t("get.balance.description", {
                  modelCount: totalModelCount,
                })}
              </CardDescription>
            </Div>
            <CreditsBadge />
          </Div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ExpiringCell />
            <PermanentCell />
            <FreeCell />
            <EarnedCell />
          </Div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
