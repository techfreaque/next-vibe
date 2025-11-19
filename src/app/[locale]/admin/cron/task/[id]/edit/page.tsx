/**
 * Cron Task Edit Page
 * Admin page for editing a specific cron task
 */

import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import type { IndividualCronTaskType } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/task/[id]/definition";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
} from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/enum";
import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CronTaskEditClient } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/task/_components/cron-task-edit-client";

interface CronTaskEditPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export default async function CronTaskEditPage({
  params,
}: CronTaskEditPageProps): Promise<React.JSX.Element> {
  const { locale, id } = await params;
  const { t } = simpleT(locale);

  // Require admin user authentication
  await requireAdminUser(locale, `/${locale}/admin/cron/task/${id}/edit`);

  // TODO: Fetch task data from API endpoint
  // For now, create stub data to demonstrate the structure
  const taskWithComputedFields: IndividualCronTaskType = {
    id,
    name: "Sample Task", // eslint-disable-line i18next/no-literal-string -- Stub data
    description: "Task description", // eslint-disable-line i18next/no-literal-string -- Stub data
    version: 1,
    schedule: "0 * * * *", // eslint-disable-line i18next/no-literal-string -- Stub data
    enabled: true,
    priority: CronTaskPriority.MEDIUM,
    status: CronTaskStatus.PENDING,
    category: TaskCategory.SYSTEM,
    timeout: 3600,
    retries: 3,
    lastRun: undefined,
    nextRun: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <Div className="container mx-auto py-6">
      <Div className="mb-6">
        <H1 className="text-3xl font-bold">
          {t("app.admin.cron.taskDetails.edit")}
        </H1>
        <P className="text-muted-foreground">
          {t("app.admin.cron.taskDetails.editDescription")}
        </P>
      </Div>

      <CronTaskEditClient
        taskId={id}
        locale={locale}
        initialData={taskWithComputedFields}
      />
    </Div>
  );
}

export async function generateMetadata({
  params,
}: CronTaskEditPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.admin.cron.taskDetails.edit"),
    description: t("app.admin.cron.taskDetails.editDescription"),
  };
}
