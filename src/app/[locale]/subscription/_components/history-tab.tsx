import { motion } from "framer-motion";
import { History } from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import type { CreditTransaction } from "./types";
import { formatDate, getTransactionTypeKey } from "./types";

interface HistoryTabProps {
  locale: CountryLanguage;
  initialHistory: {
    transactions: CreditTransaction[];
    totalCount: number;
  } | null;
}

export function HistoryTab({ locale, initialHistory }: HistoryTabProps): JSX.Element {
  const { t } = useTranslation();

  return (
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
  );
}