"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Coins,
  CreditCard,
  History,
  Info,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Div,
  Span,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "next-vibe-ui/ui";
import { Container } from "next-vibe-ui/ui/container";
import { H1, H3, H4, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

/**
 * Credit Balance Interface
 */
interface CreditBalance {
  total: number;
  expiring: number;
  permanent: number;
  free: number;
  expiresAt: string | null;
}

/**
 * Credit Transaction Interface
 */
interface CreditTransaction {
  id: string;
  amount: number;
  balanceAfter: number;
  type: string;
  modelId: string | null;
  messageId: string | null;
  createdAt: string;
}

interface SubscriptionClientContentProps {
  locale: CountryLanguage;
  initialCredits: CreditBalance | null;
  initialHistory: {
    transactions: CreditTransaction[];
    totalCount: number;
  } | null;
}

const getTransactionTypeKey = (
  type: string,
):
  | "app.subscription.subscription.history.types.purchase"
  | "app.subscription.subscription.history.types.subscription"
  | "app.subscription.subscription.history.types.usage"
  | "app.subscription.subscription.history.types.expiry"
  | "app.subscription.subscription.history.types.free_tier" => {
  switch (type) {
    case "purchase":
      return "app.subscription.subscription.history.types.purchase";
    case "subscription":
      return "app.subscription.subscription.history.types.subscription";
    case "usage":
      return "app.subscription.subscription.history.types.usage";
    case "expiry":
      return "app.subscription.subscription.history.types.expiry";
    case "free_tier":
      return "app.subscription.subscription.history.types.free_tier";
    default:
      return "app.subscription.subscription.history.types.usage"; // fallback
  }
};

const formatDate = (
  date: string | Date,
  locale: CountryLanguage,
): string => {
  try {
    const dateObject = new Date(date);
    return formatSimpleDate(dateObject, locale);
  } catch {
    return new Date(date).toLocaleDateString();
  }
};

const formatPrice = (amount: number, locale: CountryLanguage): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export function SubscriptionClientContent({
  locale,
  initialCredits,
  initialHistory,
}: SubscriptionClientContentProps): JSX.Element {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [packQuantity, setPackQuantity] = useState(1);

  return (
    <Container className="py-8 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <H1 className="text-4xl font-bold tracking-tight">
          {t("app.subscription.subscription.title")}
        </H1>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("app.subscription.subscription.description")}
        </P>
      </motion.div>

      {/* Credit Balance Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden">
          <CardHeader>
            <Div className="flex items-start justify-between">
              <Div className="space-y-1">
                <CardTitle className="flex items-center gap-3">
                  <Div className="p-2 rounded-lg bg-primary/10">
                    <Coins className="h-6 w-6 text-primary" />
                  </Div>
                  {t("app.subscription.subscription.balance.title")}
                </CardTitle>
                <CardDescription>
                  {t("app.subscription.subscription.balance.description")}
                </CardDescription>
              </Div>
              <Badge className="text-lg font-bold px-4 py-2">
                {initialCredits?.total ?? 0}{" "}
                {t("app.subscription.subscription.balance.total")}
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
                  {initialCredits?.expiring ?? 0}
                </Div>
                <Div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {t(
                    "app.subscription.subscription.balance.expiring.description",
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
                  {initialCredits?.permanent ?? 0}
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
                  {initialCredits?.free ?? 0}
                </Div>
                <Div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {t("app.subscription.subscription.balance.free.description")}
                </Div>
              </Div>

              {/* Expiration Notice */}
              {initialCredits?.expiresAt && initialCredits.expiring > 0 && (
                <Div className="p-4 rounded-lg bg-muted/50 border">
                  <Div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <AlertCircle className="h-4 w-4" />
                    {t("app.subscription.subscription.balance.nextExpiration")}
                  </Div>
                  <Div className="text-lg font-semibold">
                    {formatDate(initialCredits.expiresAt, locale)}
                  </Div>
                  <Div className="text-xs text-muted-foreground mt-1">
                    {initialCredits.expiring}{" "}
                    {t("app.subscription.subscription.balance.total")}
                  </Div>
                </Div>
              )}
            </Div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t("app.subscription.subscription.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="buy" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t("app.subscription.subscription.tabs.buy")}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {t("app.subscription.subscription.tabs.history")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {t("app.subscription.subscription.overview.howItWorks.title")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "app.subscription.subscription.overview.howItWorks.description",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Div className="space-y-3">
                  <Div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <Div>
                      <P className="font-medium text-amber-900 dark:text-amber-100">
                        {t(
                          "app.subscription.subscription.overview.howItWorks.expiring.title",
                        )}
                      </P>
                      <P className="text-sm text-amber-700 dark:text-amber-300">
                        {t(
                          "app.subscription.subscription.overview.howItWorks.expiring.description",
                        )}
                      </P>
                    </Div>
                  </Div>

                  <Div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <Div>
                      <P className="font-medium text-green-900 dark:text-green-100">
                        {t(
                          "app.subscription.subscription.overview.howItWorks.permanent.title",
                        )}
                      </P>
                      <P className="text-sm text-green-700 dark:text-green-300">
                        {t(
                          "app.subscription.subscription.overview.howItWorks.permanent.description",
                        )}
                      </P>
                    </Div>
                  </Div>

                  <Div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <Div>
                      <P className="font-medium text-blue-900 dark:text-blue-100">
                        {t(
                          "app.subscription.subscription.overview.howItWorks.free.title",
                        )}
                      </P>
                      <P className="text-sm text-blue-700 dark:text-blue-300">
                        {t(
                          "app.subscription.subscription.overview.howItWorks.free.description",
                        )}
                      </P>
                    </Div>
                  </Div>
                </Div>
              </CardContent>
            </Card>

            {/* Cost Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  {t("app.subscription.subscription.overview.costs.title")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "app.subscription.subscription.overview.costs.description",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Div className="space-y-4">
                  <Div>
                    <H4 className="font-semibold mb-2">
                      {t(
                        "app.subscription.subscription.overview.costs.models.title",
                      )}
                    </H4>
                    <Div className="grid grid-cols-2 gap-2 text-sm">
                      <Div className="flex justify-between p-2 rounded bg-muted/50">
                        <Span>
                          {t(
                            "app.subscription.subscription.overview.costs.models.gpt4",
                          )}
                        </Span>
                        <Span className="font-mono">
                          {t(
                            "app.subscription.subscription.overview.costs.models.cost",
                            {
                              count: 5,
                            },
                          )}
                        </Span>
                      </Div>
                      <Div className="flex justify-between p-2 rounded bg-muted/50">
                        <Span>
                          {t(
                            "app.subscription.subscription.overview.costs.models.claude",
                          )}
                        </Span>
                        <Span className="font-mono">
                          {t(
                            "app.subscription.subscription.overview.costs.models.cost",
                            {
                              count: 4,
                            },
                          )}
                        </Span>
                      </Div>
                      <Div className="flex justify-between p-2 rounded bg-muted/50">
                        <Span>
                          {t(
                            "app.subscription.subscription.overview.costs.models.gpt35",
                          )}
                        </Span>
                        <Span className="font-mono">
                          {t(
                            "app.subscription.subscription.overview.costs.models.cost",
                            {
                              count: 2,
                            },
                          )}
                        </Span>
                      </Div>
                      <Div className="flex justify-between p-2 rounded bg-muted/50">
                        <Span>
                          {t(
                            "app.subscription.subscription.overview.costs.models.llama",
                          )}
                        </Span>
                        <Span className="font-mono">
                          {t(
                            "app.subscription.subscription.overview.costs.models.cost",
                            {
                              count: 2,
                            },
                          )}
                        </Span>
                      </Div>
                    </Div>
                  </Div>

                  <Div>
                    <H4 className="font-semibold mb-2">
                      {t(
                        "app.subscription.subscription.overview.costs.features.title",
                      )}
                    </H4>
                    <Div className="grid grid-cols-2 gap-2 text-sm">
                      <Div className="flex justify-between p-2 rounded bg-muted/50">
                        <Span>
                          {t(
                            "app.subscription.subscription.overview.costs.features.search",
                          )}
                        </Span>
                        <Span className="font-mono">
                          {t(
                            "app.subscription.subscription.overview.costs.features.searchCost",
                          )}
                        </Span>
                      </Div>
                      <Div className="flex justify-between p-2 rounded bg-muted/50">
                        <Span>
                          {t(
                            "app.subscription.subscription.overview.costs.features.tts",
                          )}
                        </Span>
                        <Span className="font-mono">
                          {t(
                            "app.subscription.subscription.overview.costs.features.audioCost",
                          )}
                        </Span>
                      </Div>
                      <Div className="flex justify-between p-2 rounded bg-muted/50">
                        <Span>
                          {t(
                            "app.subscription.subscription.overview.costs.features.stt",
                          )}
                        </Span>
                        <Span className="font-mono">
                          {t(
                            "app.subscription.subscription.overview.costs.features.audioCost",
                          )}
                        </Span>
                      </Div>
                    </Div>
                  </Div>
                </Div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Buy Credits Tab */}
        <TabsContent value="buy" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Subscription Option */}
            <Card className="relative overflow-hidden border-2 border-primary">
              <Div className="absolute top-4 right-4">
                <Badge className="bg-primary">
                  {t("app.subscription.subscription.buy.subscription.badge")}
                </Badge>
              </Div>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("app.subscription.subscription.buy.subscription.title")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "app.subscription.subscription.buy.subscription.description",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Div className="space-y-2">
                  <Div className="text-4xl font-bold">{formatPrice(10, locale)}</Div>
                  <Div className="text-sm text-muted-foreground">
                    {t(
                      "app.subscription.subscription.buy.subscription.perMonth",
                    )}
                  </Div>
                </Div>

                <Div className="space-y-3 text-sm">
                  <Div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <Span>
                      {t(
                        "app.subscription.subscription.buy.subscription.features.credits",
                      )}
                    </Span>
                  </Div>
                  <Div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <Span>
                      {t(
                        "app.subscription.subscription.buy.subscription.features.expiry",
                      )}
                    </Span>
                  </Div>
                  <Div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <Span>
                      {t(
                        "app.subscription.subscription.buy.subscription.features.bestFor",
                      )}
                    </Span>
                  </Div>
                </Div>

                <Button className="w-full" size="lg">
                  {t("app.subscription.subscription.buy.subscription.button")}
                </Button>
              </CardContent>
            </Card>

            {/* Credit Pack Option */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("app.subscription.subscription.buy.pack.title")}
                </CardTitle>
                <CardDescription>
                  {t("app.subscription.subscription.buy.pack.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Div className="space-y-2">
                  <Div className="text-4xl font-bold">{formatPrice(5, locale)}</Div>
                  <Div className="text-sm text-muted-foreground">
                    {t("app.subscription.subscription.buy.pack.perPack")}
                  </Div>
                </Div>

                <Div className="space-y-3 text-sm">
                  <Div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <Span>
                      {t(
                        "app.subscription.subscription.buy.pack.features.credits",
                      )}
                    </Span>
                  </Div>
                  <Div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <Span>
                      {t(
                        "app.subscription.subscription.buy.pack.features.expiry",
                      )}
                    </Span>
                  </Div>
                  <Div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <Span>
                      {t(
                        "app.subscription.subscription.buy.pack.features.bestFor",
                      )}
                    </Span>
                  </Div>
                </Div>

                {/* Quantity Selector */}
                <Div className="space-y-3">
                  <label className="text-sm font-medium">
                    {t("app.subscription.subscription.buy.pack.quantity")}
                  </label>
                  <Div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPackQuantity(Math.max(1, packQuantity - 1))
                      }
                      disabled={packQuantity <= 1}
                    >
                      -
                    </Button>
                    <Div className="flex-1 text-center">
                      <Div className="text-lg font-semibold">
                        {packQuantity}
                      </Div>
                      <Div className="text-xs text-muted-foreground">
                        {t("app.subscription.subscription.buy.pack.total", {
                          count: packQuantity * 500,
                        })}
                      </Div>
                    </Div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPackQuantity(Math.min(10, packQuantity + 1))
                      }
                      disabled={packQuantity >= 10}
                    >
                      +
                    </Button>
                  </Div>
                  <Div className="text-center text-sm text-muted-foreground">
                    {t("app.subscription.subscription.buy.pack.totalPrice", {
                      price: formatPrice(5 * packQuantity, locale),
                    })}
                  </Div>
                </Div>

                <Button className="w-full" size="lg" variant="outline">
                  {t("app.subscription.subscription.buy.pack.button", {
                    count: packQuantity,
                    type:
                      packQuantity === 1
                        ? t("app.subscription.subscription.buy.pack.pack")
                        : t("app.subscription.subscription.buy.pack.packs"),
                  })}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Usage History Tab */}
        <TabsContent value="history" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  {t("app.subscription.subscription.history.title")}
                </CardTitle>
                <CardDescription>
                  {t("app.subscription.subscription.history.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!initialHistory || initialHistory.transactions.length === 0 ? (
                  <Div className="text-center py-12 space-y-4">
                    <History className="h-12 w-12 text-muted-foreground mx-auto" />
                    <Div>
                      <P className="text-lg font-medium">
                        {t("app.subscription.subscription.history.empty.title")}
                      </P>
                      <P className="text-sm text-muted-foreground mt-2">
                        {t(
                          "app.subscription.subscription.history.empty.description",
                        )}
                      </P>
                    </Div>
                  </Div>
                ) : (
                  <Div className="space-y-3">
                    {initialHistory.transactions.map((transaction) => (
                      <Div
                        key={transaction.id}
                        className={cn(
                          "p-4 rounded-lg border flex items-center justify-between",
                          transaction.amount > 0
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                        )}
                      >
                        <Div className="space-y-1">
                          <Div className="flex items-center gap-2">
                            <Span className="font-medium capitalize">
                              {t(getTransactionTypeKey(transaction.type))}
                            </Span>
                            {transaction.modelId && (
                              <Badge variant="outline" className="text-xs">
                                {transaction.modelId}
                              </Badge>
                            )}
                          </Div>
                          <Div className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt, locale)}
                          </Div>
                        </Div>
                        <Div className="text-right space-y-1">
                          <Div
                            className={cn(
                              "text-lg font-bold",
                              transaction.amount > 0
                                ? "text-green-700 dark:text-green-300"
                                : "text-red-700 dark:text-red-300",
                            )}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount}
                          </Div>
                          <Div className="text-xs text-muted-foreground">
                            {t(
                              "app.subscription.subscription.history.balance",
                              {
                                count: transaction.balanceAfter,
                              },
                            )}
                          </Div>
                        </Div>
                      </Div>
                    ))}

                    {initialHistory.totalCount > 10 && (
                      <Div className="text-center pt-4">
                        <Button variant="outline">
                          {t("app.subscription.subscription.history.loadMore")}
                        </Button>
                      </Div>
                    )}
                  </Div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
