"use client";

/**
 * The questions people have right before they pay, answered next to the
 * plans. Every number comes from the pricing config (getPricingParams,
 * credit unit price), never from copy.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { formatCreditUnitPrice } from "@/products/credit-money";
import { getPricingParams } from "@/products/repository-client";

import { scopedTranslation } from "../i18n";

const FAQ_KEYS = ["credit", "unused", "cancel", "free", "api", "pay"] as const;

export function PricingFaq({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const params = {
    ...getPricingParams(locale),
    unitPrice: formatCreditUnitPrice(locale),
  };

  return (
    <Div data-testid="pricing-faq" className="flex flex-col gap-4 px-1">
      <H3 className="m-0 text-lg font-semibold tracking-tight">
        {t("tiers.faq.heading")}
      </H3>
      <Div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        {FAQ_KEYS.map((key) => (
          <Div key={key} className="flex flex-col gap-1">
            <Span className="text-sm font-semibold text-foreground">
              {t(`tiers.faq.${key}.question`)}
            </Span>
            <P className="m-0 text-sm leading-relaxed text-muted-foreground">
              {t(`tiers.faq.${key}.answer`, params)}
            </P>
          </Div>
        ))}
      </Div>
      <Link
        href={`/${locale}/help`}
        className="text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        {t("tiers.faq.more")}
      </Link>
    </Div>
  );
}
