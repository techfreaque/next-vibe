/**
 * Custom Widget for Referral Codes List
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  AlertCircle,
  Check,
  Copy,
  DollarSign,
  Link2,
  TrendingUp,
  Users,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { useState } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CodesListGetResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: CodesListGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for referral codes list
 */
export function ReferralCodesListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const codes = field.value?.codes ?? [];
  const t = useWidgetTranslation();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, index: number): Promise<void> => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(
        `${window.location.origin}/track?ref=${code}`,
      );
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    }
  };

  if (codes.length === 0) {
    return (
      <Div className="flex flex-col items-center justify-center py-12 text-center">
        <Div className="rounded-full bg-muted p-3 mb-4">
          <Link2 className="h-6 w-6 text-muted-foreground" />
        </Div>
        <Div className="text-sm font-medium text-muted-foreground">
          {t("app.user.referral.myCodes.empty")}
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-3">
      {codes.map((code, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header with Code and Copy Button */}
            <Div className="flex items-center justify-between gap-3 p-4 border-b bg-muted/30">
              <Div className="flex items-center gap-3 min-w-0 flex-1">
                <Div className="rounded-lg bg-background p-2 border">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </Div>
                <Div className="min-w-0 flex-1">
                  <Div className="font-mono font-semibold text-base">
                    {code.code}
                  </Div>
                  {code.label && (
                    <Div className="text-xs text-muted-foreground mt-0.5">
                      {code.label}
                    </Div>
                  )}
                </Div>
              </Div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => handleCopy(code.code, index)}
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {t("app.user.referral.myCodes.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    {t("app.user.referral.myCodes.copy")}
                  </>
                )}
              </Button>
            </Div>

            {/* Stats Grid */}
            <Div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
              {/* Uses */}
              <Div className="p-4 flex flex-col gap-1">
                <Div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Users className="h-3.5 w-3.5" />
                  {t("app.user.referral.myCodes.uses")}
                </Div>
                <Div className="text-lg font-semibold tabular-nums">
                  {code.currentUses}
                </Div>
              </Div>

              {/* Signups */}
              <Div className="p-4 flex flex-col gap-1">
                <Div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {t("app.user.referral.myCodes.signups")}
                </Div>
                <Div className="text-lg font-semibold tabular-nums">
                  {code.totalSignups}
                </Div>
              </Div>

              {/* Revenue */}
              <Div className="p-4 flex flex-col gap-1">
                <Div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <DollarSign className="h-3.5 w-3.5" />
                  {t("app.user.referral.myCodes.revenue")}
                </Div>
                <Div className="text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {code.totalRevenueCents}
                </Div>
              </Div>

              {/* Earnings */}
              <Div className="p-4 flex flex-col gap-1">
                <Div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <DollarSign className="h-3.5 w-3.5" />
                  {t("app.user.referral.myCodes.earnings")}
                </Div>
                <Div className="text-lg font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                  {code.totalEarningsCents}
                </Div>
              </Div>
            </Div>

            {/* Inactive Warning */}
            {!code.isActive && (
              <Div className="px-4 py-3 border-t bg-red-50 dark:bg-red-950/20">
                <Div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <Span>{t("app.user.referral.myCodes.inactive")}</Span>
                </Div>
              </Div>
            )}
          </CardContent>
        </Card>
      ))}
    </Div>
  );
}
