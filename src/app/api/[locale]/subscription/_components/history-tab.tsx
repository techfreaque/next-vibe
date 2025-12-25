"use client";

import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import type { CreditsHistoryGetResponseOutput } from "@/app/api/[locale]/credits/history/definition";
import creditsHistoryDefinitions from "@/app/api/[locale]/credits/history/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import type { CountryLanguage } from "@/i18n/core/config";

interface HistoryTabProps {
  locale: CountryLanguage;
  initialData: CreditsHistoryGetResponseOutput | null;
}

export function HistoryTab({
  locale,
  initialData,
}: HistoryTabProps): JSX.Element {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <EndpointsPage
        endpoint={creditsHistoryDefinitions}
        locale={locale}
        endpointOptions={{
          read: {
            queryOptions: {
              enabled: true,
            },
            initialData: initialData ?? undefined,
          },
        }}
      />
    </MotionDiv>
  );
}
