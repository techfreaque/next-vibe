/**
 * Cron Tasks Table Component
 * Table component for displaying and managing cron tasks
 */

"use client";

import { cn } from "next-vibe/shared/utils/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Edit, Trash2, X } from "next-vibe-ui/ui/icons";
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
import { H3, P } from "next-vibe-ui/ui/typography";
import React, { useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CronTaskResponseType } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition";
import {
  useCronTaskEndpoint,
  useDeleteCronTask,
  useToggleCronTask,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/hooks";
import { formatCronSchedule } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { CronTaskEditForm } from "../../task/_components/cron-task-edit-form";

interface TaskToggleSwitchProps {
  task: CronTaskResponseType;
  onTaskUpdated: () => void;
  locale: CountryLanguage;
  user: JwtPayloadType;
}

function TaskToggleSwitch({
  task,
  onTaskUpdated,
  locale,
  user,
}: TaskToggleSwitchProps): React.JSX.Element {
  const logger = createEndpointLogger(false, Date.now(), locale);
  const toggleHook = useToggleCronTask(user, task.id, logger);

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
  user: JwtPayloadType;
}

function TaskDeleteButton({
  taskId,
  onTaskUpdated,
  locale,
  user,
}: TaskDeleteButtonProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const deleteHook = useDeleteCronTask(user, taskId, logger);

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
  user: JwtPayloadType;
}

function InlineEditForm({
  task,
  locale,
  onCancel,
  onSuccess,
  user,
}: InlineEditFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useCronTaskEndpoint(
    user,
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
  user: JwtPayloadType;
}

export function CronTasksTable({
  tasks,
  loading,
  locale,
  onTaskUpdated,
  user,
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

    // Compute status from DB fields
    if (!task.lastExecutedAt) {
      return (
        <Badge variant="secondary">
          {t("app.admin.cron.table.statusBadge.pending")}
        </Badge>
      );
    }

    if (task.lastExecutionError) {
      return (
        <Badge variant="destructive">
          {t("app.admin.cron.table.statusBadge.error")}
        </Badge>
      );
    }

    if (task.successCount > 0) {
      return (
        <Badge variant="default" className="bg-green-500">
          {t("app.admin.cron.table.statusBadge.completed")}
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        {t("app.admin.cron.table.statusBadge.unknown")}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Div className="flex flex-col gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- Array.from callback requires first parameter */}
        {Array.from({ length: 5 }).map((unused, i) => (
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
                    {task.lastExecutedAt
                      ? new Date(task.lastExecutedAt).toLocaleString(locale)
                      : t("app.admin.cron.table.statusBadge.never")}
                  </Div>
                </TableCell>
                <TableCell>
                  <Div className="text-sm">
                    {task.nextExecutionAt
                      ? new Date(task.nextExecutionAt).toLocaleString(locale)
                      : t("app.admin.cron.table.statusBadge.notScheduled")}
                  </Div>
                </TableCell>
                <TableCell>
                  <TaskToggleSwitch
                    task={task}
                    onTaskUpdated={onTaskUpdated}
                    locale={locale}
                    user={user}
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
                      user={user}
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
                      user={user}
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
