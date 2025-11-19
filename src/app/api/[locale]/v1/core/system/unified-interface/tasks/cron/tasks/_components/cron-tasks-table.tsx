/**
 * Cron Tasks Table Component
 * Table component for displaying and managing cron tasks
 */

"use client";

import { Edit, Trash2, X } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Switch } from "next-vibe-ui/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { Div } from "next-vibe-ui/ui/div";
import { H3, P } from "next-vibe-ui/ui/typography";
import React, { useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { CronTaskStatus } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/enum";
import type { CronTaskResponseType } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/tasks/definition";
import {
  useCronTaskEndpoint,
  useDeleteCronTask,
  useToggleCronTask,
} from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/tasks/hooks";
import { formatCronSchedule } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron-formatter";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { CronTaskEditForm } from "../../task/_components/cron-task-edit-form";

interface TaskToggleSwitchProps {
  task: CronTaskResponseType;
  onTaskUpdated: () => void;
  locale: CountryLanguage;
}

function TaskToggleSwitch({
  task,
  onTaskUpdated,
  locale,
}: TaskToggleSwitchProps): React.JSX.Element {
  const logger = createEndpointLogger(false, Date.now(), locale);
  const toggleHook = useToggleCronTask(task.id, logger);

  const handleToggle = async (): Promise<void> => {
    try {
      await toggleHook.delete?.submit();
      onTaskUpdated();
    } catch {
      // Error handling is managed by the hook
    }
  };

  return (
    <Switch
      checked={task.enabled}
      onCheckedChange={() => void handleToggle()}
      disabled={toggleHook.delete?.isSubmitting ?? false}
    />
  );
}

interface TaskDeleteButtonProps {
  taskId: string;
  onTaskUpdated: () => void;
  locale: CountryLanguage;
}

function TaskDeleteButton({
  taskId,
  onTaskUpdated,
  locale,
}: TaskDeleteButtonProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const deleteHook = useDeleteCronTask(taskId, logger);

  const handleDelete = async (): Promise<void> => {
    if (!window.confirm(t("app.admin.cron.buttons.confirmDelete"))) {
      return;
    }

    try {
      await deleteHook.delete?.submit();
      onTaskUpdated();
    } catch {
      // Error handling is managed by the hook
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={deleteHook.delete?.isSubmitting ?? false}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

interface InlineEditFormProps {
  task: CronTaskResponseType;
  locale: CountryLanguage;
  onCancel: () => void;
  onSuccess: () => void;
}

function InlineEditForm({
  task,
  locale,
  onCancel,
  onSuccess,
}: InlineEditFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useCronTaskEndpoint(
    {
      taskId: task.id,
      enabled: true,
    },
    logger,
  );

  // Watch for successful form submission
  React.useEffect(() => {
    if (endpoint.create.response?.success) {
      onSuccess();
    }
  }, [endpoint.create.response?.success, onSuccess]);

  return (
    <Div className="bg-gray-50 dark:bg-gray-800 p-4 border-t">
      <Div className="flex justify-between items-center mb-4">
        <H3 className="text-lg font-medium">
          {t("app.admin.cron.taskDetails.edit")}: {task.name}
        </H3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </Div>
      <CronTaskEditForm task={task} endpoint={endpoint} locale={locale} />
    </Div>
  );
}

interface CronTasksTableProps {
  tasks: CronTaskResponseType[];
  loading: boolean;
  locale: CountryLanguage;
  onTaskUpdated: () => void;
}

export function CronTasksTable({
  tasks,
  loading,
  locale,
  onTaskUpdated,
}: CronTasksTableProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const userTimezone = getDefaultTimezone(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  const getStatusBadge = (task: CronTaskResponseType): React.JSX.Element => {
    if (!task.enabled) {
      return (
        <Badge variant="secondary">
          {t("app.admin.cron.table.statusBadge.disabled")}
        </Badge>
      );
    }

    // Use the status field from the task
    switch (task.status) {
      case CronTaskStatus.RUNNING:
        return (
          <Badge variant="default" className="bg-blue-500">
            {t("app.admin.cron.table.statusBadge.running")}
          </Badge>
        );
      case CronTaskStatus.COMPLETED:
        return (
          <Badge variant="default" className="bg-green-500">
            {t("app.admin.cron.table.statusBadge.completed")}
          </Badge>
        );
      case CronTaskStatus.FAILED:
      case CronTaskStatus.ERROR:
      case CronTaskStatus.TIMEOUT:
        return (
          <Badge variant="destructive">
            {t("app.admin.cron.table.statusBadge.failed")}
          </Badge>
        );
      case CronTaskStatus.PENDING:
      case CronTaskStatus.SCHEDULED:
        return (
          <Badge variant="outline">
            {t("app.admin.cron.table.statusBadge.pending")}
          </Badge>
        );
      case CronTaskStatus.CANCELLED:
      case CronTaskStatus.STOPPED:
      case CronTaskStatus.SKIPPED:
        return (
          <Badge variant="secondary">
            {t("app.admin.cron.table.statusBadge.cancelled")}
          </Badge>
        );
      case CronTaskStatus.BLOCKED:
        return (
          <Badge variant="outline" className="bg-yellow-100">
            {t("app.admin.cron.table.statusBadge.blocked")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t("app.admin.cron.table.statusBadge.unknown")}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Div className="flex flex-col gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </Div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Div className="text-center py-8">
        <P className="text-gray-500 dark:text-gray-400">
          {t("app.admin.cron.cronErrors.admin.interface.noResults")}
        </P>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("app.admin.cron.table.name")}</TableHead>
            <TableHead>{t("app.admin.cron.table.schedule")}</TableHead>
            <TableHead>{t("app.admin.cron.table.status")}</TableHead>
            <TableHead>{t("app.admin.cron.table.lastExecuted")}</TableHead>
            <TableHead>{t("app.admin.cron.table.nextExecution")}</TableHead>
            <TableHead>{t("app.admin.cron.table.enabled")}</TableHead>
            <TableHead>{t("app.admin.cron.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <TableRow>
                <TableCell>
                  <Div className="flex items-center flex flex-row gap-2">
                    <Div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        task.enabled ? "bg-green-500" : "bg-gray-400",
                      )}
                    />
                    <Div>
                      <Div className="font-medium">{task.name}</Div>
                      {task.description && (
                        <Div className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description}
                        </Div>
                      )}
                    </Div>
                  </Div>
                </TableCell>
                <TableCell>
                  <Div className="text-sm">
                    {formatCronSchedule(
                      task.schedule,
                      userTimezone,
                      locale,
                      logger,
                    )}
                  </Div>
                </TableCell>
                <TableCell>{getStatusBadge(task)}</TableCell>
                <TableCell>
                  <Div className="text-sm">
                    {task.lastRun
                      ? new Date(task.lastRun).toLocaleString(locale)
                      : t("app.admin.cron.table.statusBadge.never")}
                  </Div>
                </TableCell>
                <TableCell>
                  <Div className="text-sm">
                    {task.nextRun
                      ? new Date(task.nextRun).toLocaleString(locale)
                      : t("app.admin.cron.table.statusBadge.notScheduled")}
                  </Div>
                </TableCell>
                <TableCell>
                  <TaskToggleSwitch
                    task={task}
                    onTaskUpdated={onTaskUpdated}
                    locale={locale}
                  />
                </TableCell>
                <TableCell>
                  <Div className="flex flex flex-row gap-1">
                    {editingTaskId === task.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTaskId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTaskId(task.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <TaskDeleteButton
                      taskId={task.id}
                      onTaskUpdated={onTaskUpdated}
                      locale={locale}
                    />
                  </Div>
                </TableCell>
              </TableRow>

              {/* Inline Edit Form */}
              {editingTaskId === task.id && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <InlineEditForm
                      task={task}
                      locale={locale}
                      onCancel={() => setEditingTaskId(null)}
                      onSuccess={() => {
                        setEditingTaskId(null);
                        onTaskUpdated();
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Div>
  );
}
