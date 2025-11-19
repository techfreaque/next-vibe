/**
 * Cron History Client Component
 * Client component for viewing cron execution history
 */

"use client";

import type React from "react";
import { Div } from "next-vibe-ui/ui/div";

import { useTaskHistory } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/history/hooks";
import type { CountryLanguage } from "@/i18n/core/config";

import { ExecutionHistory } from "./execution-history";

interface CronHistoryClientProps {
  locale: CountryLanguage;
}

export function CronHistoryClient({
  locale,
}: CronHistoryClientProps): React.JSX.Element {
  const historyEndpoint = useTaskHistory();
  return (
    <Div className="flex flex-col gap-6">
      <ExecutionHistory
        historyEndpoint={historyEndpoint}
        isLoading={historyEndpoint.read?.isLoading || false}
        locale={locale}
      />
    </Div>
  );
}
