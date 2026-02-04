/**
 * Referral Codes List Component
 * Displays user's referral codes with stats
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Check, Copy } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage, Currencies } from "@/i18n/core/config";
import { currencyByCountry } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { formatCurrency } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { useReferralCodesList } from "../hooks";

interface ReferralCodesListProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

export function ReferralCodesList({
  locale,
  user,
  logger,
}: ReferralCodesListProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const endpoint = useReferralCodesList(user, logger);
  const country = getCountryFromLocale(locale);
  const currency: Currencies = currencyByCountry[country];

  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = async (code: string): Promise<void> => {
    const url = `${window.location.origin}/track?ref=${code}`;
    await navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (endpoint.read.isLoading) {
    return <P>{t("app.user.referral.myCodes.loading")}</P>;
  }

  if (!endpoint.read.data) {
    return <P>{t("app.user.referral.myCodes.error")}</P>;
  }

  const codes = endpoint.read.data.codes;

  if (codes.length === 0) {
    return <P>{t("app.user.referral.myCodes.empty")}</P>;
  }

  return (
    <Div className="flex flex-col gap-4">
      {codes.map((code) => (
        <Card key={code.id} className="p-4">
          <Div className="flex flex-col gap-2">
            <Div className="flex items-center justify-between">
              <Div className="flex items-center gap-2">
                <Span className="font-mono font-bold text-lg">{code.code}</Span>
                {code.label && (
                  <Span className="text-sm text-muted-foreground">
                    ({code.label})
                  </Span>
                )}
              </Div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(code.code)}
              >
                {copiedCode === code.code ? (
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

            <Div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Div>
                <P className="text-muted-foreground">
                  {t("app.user.referral.myCodes.uses")}
                </P>
                <P className="font-semibold">{code.currentUses}</P>
              </Div>
              <Div>
                <P className="text-muted-foreground">
                  {t("app.user.referral.myCodes.signups")}
                </P>
                <P className="font-semibold">{code.totalSignups}</P>
              </Div>
              <Div>
                <P className="text-muted-foreground">
                  {t("app.user.referral.myCodes.revenue")}
                </P>
                <P className="font-semibold">
                  {formatCurrency(
                    code.totalRevenueCents / 100,
                    currency,
                    locale,
                  )}
                </P>
              </Div>
              <Div>
                <P className="text-muted-foreground">
                  {t("app.user.referral.myCodes.earnings")}
                </P>
                <P className="font-semibold">
                  {formatCurrency(
                    code.totalEarningsCents / 100,
                    currency,
                    locale,
                  )}
                </P>
              </Div>
            </Div>

            {!code.isActive && (
              <P className="text-sm text-red-500">
                {t("app.user.referral.myCodes.inactive")}
              </P>
            )}
          </Div>
        </Card>
      ))}
    </Div>
  );
}
