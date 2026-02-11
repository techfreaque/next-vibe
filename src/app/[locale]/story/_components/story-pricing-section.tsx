"use client";

import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import { BuyTab } from "../../subscription/components/buy-tab";
import { OverviewTab } from "../../subscription/components/overview-tab";

interface StoryPricingSectionProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function StoryPricingSection({
  locale,
  user,
}: StoryPricingSectionProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <Container className="py-16 flex flex-col gap-12">
      {/* Section Header */}
      <Div className="text-center flex flex-col gap-4">
        <H2 className="text-3xl font-bold tracking-tight">
          {t("app.story._components.home.pricingSection.title")}
        </H2>
        <P className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("app.story._components.home.pricingSection.description")}
        </P>
      </Div>

      {/* Overview Section */}
      <Div className="flex flex-col gap-6">
        <OverviewTab
          locale={locale}
          onSwitchTab={(): void => {
            /* no-op */
          }}
        />
      </Div>

      {/* Buy Credits Section */}
      <Div className="flex flex-col gap-6">
        <BuyTab locale={locale} user={user} />
      </Div>
    </Container>
  );
}
