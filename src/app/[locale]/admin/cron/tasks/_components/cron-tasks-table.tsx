/**
 * Cron Tasks Table Component
 * Table component for displaying and managing cron tasks
 */

"use client";

import { Edit, Trash2, X } from "lucide-react";
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
import React, { useState } from "react";

import type { CronTaskResponseType } from "@/app/api/[locale]/v1/core/system/tasks/cron/tasks/definition";
import {
  useCronTaskEndpoint,
  useDeleteCronTask,
  useToggleCronTask,
} from "@/app/api/[locale]/v1/core/system/tasks/cron/tasks/hooks";
import { formatCronSchedule } from "@/app/api/[locale]/v1/core/system/tasks/cron-formatter";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { CronTaskEditForm } from "../../task/[id]/edit/_components/cron-task-edit-form";

interface TaskToggleSwitchProps {
  task: CronTaskResponseType;
  onTaskUpdated: () => void;
}

function TaskToggleSwitch({
  task,
  onTaskUpdated,
}: TaskToggleSwitchProps): React.JSX.Element {
  const toggleHook = useToggleCronTask(task.id);

  const handleToggle = async (enabled: boolean): Promise<void> => {
    try {
      await toggleHook.mutateAsync(enabled);
      onTaskUpdated();
    } catch {
      // Error handling is managed by the hook
    }
  };

  return (
    <Switch
      checked={task.enabled}
      onCheckedChange={handleToggle}
      disabled={toggleHook.isPending}
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
  const deleteHook = useDeleteCronTask(taskId);

  const handleDelete = async (): Promise<void> => {
    if (!window.confirm(t("common.confirmDelete"))) {
      return;
    }

    try {
      await deleteHook.mutateAsync();
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
      disabled={deleteHook.isPending}
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
  const endpoint = useCronTaskEndpoint({
    taskId: task.id,
    enabled: true,
  });

  // Watch for successful form submission
  React.useEffect(() => {
    if (endpoint.create.response?.success) {
      onSuccess();
    }
  }, [endpoint.create.response?.success, onSuccess]);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {t("admin.dashboard.cron.taskDetails.edit")}: {task.name}
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <CronTaskEditForm task={task} endpoint={endpoint} locale={locale} />
    </div>
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

  const getStatusBadge = (task: CronTaskResponseType): React.JSX.Element => {
    if (!task.enabled) {
      return (
        <Badge variant="secondary">
          {t("admin.dashboard.cron.taskStatus.disabled")}
        </Badge>
      );
    }

    if (task.isRunning) {
      return (
        <Badge variant="default" className="bg-blue-500">
          {t("admin.dashboard.cron.taskStatus.running")}
        </Badge>
      );
    }

    if (task.lastExecutionStatus === "completed") {
      return (
        <Badge variant="default" className="bg-green-500">
          {t("admin.dashboard.cron.taskStatus.completed")}
        </Badge>
      );
    }

    if (task.lastExecutionStatus === "failed") {
      return (
        <Badge variant="destructive">
          {t("admin.dashboard.cron.taskStatus.failed")}
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        {t("admin.dashboard.cron.taskStatus.pending")}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {t("cronErrors.admin.interface.noResults")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.dashboard.cron.table.name")}</TableHead>
            <TableHead>{t("admin.dashboard.cron.table.schedule")}</TableHead>
            <TableHead>{t("admin.dashboard.cron.table.status")}</TableHead>
            <TableHead>
              {t("admin.dashboard.cron.table.lastExecuted")}
            </TableHead>
            <TableHead>
              {t("admin.dashboard.cron.table.nextExecution")}
            </TableHead>
            <TableHead>{t("admin.dashboard.cron.table.enabled")}</TableHead>
            <TableHead>{t("admin.dashboard.cron.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <TableRow>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        task.enabled ? "bg-green-500" : "bg-gray-400",
                      )}
                    />
                    <div>
                      <div className="font-medium">{task.name}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatCronSchedule(task.schedule, userTimezone, locale)}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(task)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {task.lastExecutedAt
                      ? new Date(task.lastExecutedAt).toLocaleString(locale)
                      : t("admin.dashboard.cron.taskStatus.never")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {task.nextExecutionAt
                      ? new Date(task.nextExecutionAt).toLocaleString(locale)
                      : t(
                          "admin.dashboard.cron.formatting.fallbacks.notScheduled",
                        )}
                  </div>
                </TableCell>
                <TableCell>
                  <TaskToggleSwitch task={task} onTaskUpdated={onTaskUpdated} />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
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
                  </div>
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
    </div>
  );
}
