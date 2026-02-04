/**
 * Cron History Client Component
 * Client component for viewing cron execution history
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type React from "react";

import { useTaskHistory } from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/hooks";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { ExecutionHistory } from "./execution-history";

interface CronHistoryClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CronHistoryClient({
  locale,
  user,
}: CronHistoryClientProps): React.JSX.Element {
  const historyEndpoint = useTaskHistory(user);
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
