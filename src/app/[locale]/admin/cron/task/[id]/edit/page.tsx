/**
 * Cron Task Edit Page
 * Admin page for editing a specific cron task
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";

import type { CronTaskResponseType } from "@/app/api/[locale]/v1/core/system/tasks/cron/tasks/definition";
import { taskIndividualRepository } from "@/app/api/[locale]/v1/core/system/tasks/cron/tasks/repository";
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

  // Fetch cron task data to verify it exists
  const taskResponse = await taskIndividualRepository.findTaskById(id);

  // Handle task not found
  if (!taskResponse.success || !taskResponse.data) {
    notFound();
  }

  const task = taskResponse.data;

  // Transform the task data to match CronTaskResponseType
  const taskWithComputedFields: CronTaskResponseType = {
    id: task.id,
    name: task.name,
    description: task.description,
    version: task.version,
    schedule: task.schedule,
    enabled: task.enabled,
    priority: task.priority,
    timeout: task.timeout,
    retries: task.retries,
    retryDelay: task.retryDelay,
    defaultConfig:
      (task.defaultConfig as Record<string, string>) ||
      ({} as Record<string, string>),
    lastExecutionDuration: task.lastExecutionDuration,
    executionCount: task.executionCount,
    successCount: task.successCount,
    errorCount: task.errorCount,
    tags: (task.tags as string[]) || [],
    dependencies: (task.dependencies as string[]) || [],
    monitoring: task.monitoring
      ? (task.monitoring as Record<string, string>)
      : null,
    documentation: task.documentation
      ? (task.documentation as Record<string, string>)
      : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    lastExecutedAt: task.lastExecutedAt?.toISOString() || null,
    lastExecutionStatus: task.lastExecutionStatus,
    lastExecutionError: task.lastExecutionError,
    nextExecutionAt: null,
    isRunning: false,
    healthStatus: PulseHealthStatus.UNKNOWN,
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
