"use client";

/**
 * Cron Task Edit Client Component
 * Client-side component for editing cron tasks
 */

import { Button } from "next-vibe-ui/ui/button";
import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Div } from "next-vibe-ui/ui/div";
import { H2, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { IndividualCronTaskType } from "@/app/api/[locale]/system/unified-interface/tasks/cron/task/[id]/definition";
import { useCronTaskEndpoint } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CronTaskEditForm } from "./cron-task-edit-form";

interface CronTaskEditClientProps {
  taskId: string;
  locale: CountryLanguage;
  initialData: IndividualCronTaskType;
}

export function CronTaskEditClient({
  taskId,
  locale,
  initialData,
}: CronTaskEditClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();

  // Create logger and get endpoint for form handling
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useCronTaskEndpoint(
    {
      taskId,
      enabled: true,
    },
    logger,
  );

  const handleBack = (): void => {
    router.push(`/${locale}/admin/cron/tasks`);
  };

  return (
    <Div className="flex flex-col gap-6">
      {/* Header with back button */}
      <Div className="flex items-center justify-between">
        <Div>
          <H2 className="text-xl font-semibold">
            {t("app.admin.cron.taskDetails.edit")}
          </H2>
          <P className="text-sm text-muted-foreground">
            {initialData.name} • {initialData.schedule}
          </P>
        </Div>
        <Button onClick={handleBack} variant="outline">
          {t("app.admin.cron.taskDetails.back")}
        </Button>
      </Div>

      {/* Edit form */}
      <CronTaskEditForm
        task={initialData}
        endpoint={endpoint}
        locale={locale}
      />
    </Div>
  );
}
