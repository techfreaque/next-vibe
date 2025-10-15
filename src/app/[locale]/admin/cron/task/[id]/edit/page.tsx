/**
 * Cron Task Edit Page
 * Admin page for editing a specific cron task
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";

import type { IndividualCronTaskType } from "@/app/api/[locale]/v1/core/system/tasks/cron/task/[id]/definition";
import { PulseHealthStatus } from "@/app/api/[locale]/v1/core/system/tasks/enum";
import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CronTaskEditClient } from "./_components/cron-task-edit-client";

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
    name: "Sample Task",
    description: "Task description",
    version: 1,
    schedule: "0 * * * *",
    enabled: true,
    priority: "MEDIUM",
    status: "PENDING",
    category: "GENERAL",
    timeout: 3600,
    retries: 3,
    lastRun: null,
    nextRun: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t("admin.dashboard.cron.taskDetails.edit")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.dashboard.cron.taskDetails.editDescription")}
        </p>
      </div>

      <CronTaskEditClient
        taskId={id}
        locale={locale}
        initialData={taskWithComputedFields}
      />
    </div>
  );
}

export async function generateMetadata({
  params,
}: CronTaskEditPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("admin.dashboard.cron.taskDetails.edit"),
    description: t("admin.dashboard.cron.taskDetails.editDescription"),
  };
}
