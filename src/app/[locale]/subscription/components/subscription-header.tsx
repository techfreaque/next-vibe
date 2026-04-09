"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { scopedTranslation } from "@/app/[locale]/subscription/i18n";
import { useTranslation } from "@/i18n/core/client";

export function SubscriptionHeader(): JSX.Element {
  const { locale: currentLocale } = useTranslation();
  const { t } = scopedTranslation.scopedT(currentLocale);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center flex flex-col gap-4"
    >
      <H1 className="text-4xl font-bold tracking-tight">
        {t("subscription.title")}
      </H1>
      <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
        {t("subscription.description")}
      </P>
    </MotionDiv>
  );
}
