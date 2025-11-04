import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import type { SubscriptionData } from "./types";
import { formatDate } from "./types";

interface SubscriptionStatusCardProps {
  locale: CountryLanguage;
  initialSubscription: SubscriptionData;
}

export function SubscriptionStatusCard({ locale, initialSubscription }: SubscriptionStatusCardProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-primary">
        <CardHeader>
          <Div className="flex items-start justify-between">
            <Div className="space-y-1">
              <CardTitle className="flex items-center gap-3">
                <Div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </Div>
                {t("app.subscription.subscription.title")}
              </CardTitle>
              <CardDescription>
                {t("app.subscription.subscription.description")}
              </CardDescription>
            </Div>
            <Badge className="bg-green-600 text-white">
              {initialSubscription.status}
            </Badge>
          </Div>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Div className="p-4 rounded-lg bg-accent border">
              <Div className="text-sm text-muted-foreground mb-1">
                {t("app.subscription.subscription.billingInterval")}
              </Div>
              <Div className="text-lg font-semibold capitalize">
                {initialSubscription.billingInterval.toLowerCase()}
              </Div>
            </Div>
            <Div className="p-4 rounded-lg bg-accent border">
              <Div className="text-sm text-muted-foreground mb-1">
                {t("app.subscription.subscription.currentPeriodStart")}
              </Div>
              <Div className="text-lg font-semibold">
                {formatDate(initialSubscription.currentPeriodStart, locale)}
              </Div>
            </Div>
            <Div className="p-4 rounded-lg bg-accent border">
              <Div className="text-sm text-muted-foreground mb-1">
                {t("app.subscription.subscription.nextBillingDate")}
              </Div>
              <Div className="text-lg font-semibold">
                {initialSubscription.currentPeriodEnd
                  ? formatDate(initialSubscription.currentPeriodEnd, locale)
                  : t("app.common.notAvailable")}
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>
    </motion.div>
  );
}