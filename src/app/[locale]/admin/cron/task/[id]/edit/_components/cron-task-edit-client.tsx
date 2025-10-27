"use client";

/**
 * Cron Task Edit Client Component
 * Client-side component for editing cron tasks
 */

import { useRouter } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import type React from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { IndividualCronTaskType } from "@/app/api/[locale]/v1/core/system/unified-backend/tasks/cron/task/[id]/definition";
import { useCronTaskEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/tasks/cron/tasks/hooks";
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
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("app.admin.cron.taskDetails.edit")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {initialData.name} • {initialData.schedule}
          </p>
        </div>
        <Button onClick={handleBack} variant="outline">
          {t("app.admin.cron.taskDetails.back")}
        </Button>
      </div>

      {/* Edit form */}
      <CronTaskEditForm
        task={initialData}
        endpoint={endpoint}
        locale={locale}
      />
    </div>
  );
}
