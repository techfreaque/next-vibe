/**
 * Custom Widget for Cron Task Detail View
 * Full-featured task profile with execution stats, navigation, edit, delete, and history.
 * Also exports TaskInputEditWidget for dynamic task input editing in PUT form.
 */

"use client";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Form } from "next-vibe/ui/components/form/form";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Play } from "next-vibe/ui/components/icons/Play";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Span } from "next-vibe/ui/components/span";
import React, { useCallback, useEffect, useState } from "react";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import { getFullPath } from "../../../../core/core-utils/path";
import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { getDefaultTimezone } from "../../../../core/i18n/core/localization-utils";
import type { WidgetData } from "../../../../core/utils/json";
import { cn } from "../../../../unified-ui/_shared/cn";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "../../../../unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "../../../../unified-ui/renderers/web/EndpointsPage";
import { BooleanFieldWidget } from "../../../../unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "../../../../unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "../../../../unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "../../../../unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "../../../../unified-ui/widgets/form-fields/textarea-field/widget";
import { NavigateButtonWidget } from "../../../../unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "../../../../unified-ui/widgets/interactive/submit-button/widget";
import { formatCronScheduleShort } from "../../../cron-formatter";
import { CronTaskPriority, CronTaskStatus } from "../../../enum";
import type endpoints from "../definition";
import type { CronTaskGetResponseOutput } from "../definition";
import { ScheduleAutocomplete } from "./schedule-autocomplete";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Task = CronTaskGetResponseOutput["task"];

interface WidgetProps {
  field: (typeof endpoints.GET)["fields"];
}

// ---------------------------------------------------------------------------
// Status / Priority color maps
// Keyed on enum values (i18n key strings), not plain short strings
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  [CronTaskStatus.RUNNING]: "bg-info/10 text-info",
  [CronTaskStatus.COMPLETED]: "bg-success/10 text-success",
  [CronTaskStatus.FAILED]: "bg-destructive/10 text-destructive",
  [CronTaskStatus.ERROR]: "bg-destructive/10 text-destructive",
  [CronTaskStatus.TIMEOUT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [CronTaskStatus.PENDING]: "bg-warning/10 text-warning",
};

const PRIORITY_COLORS: Record<string, string> = {
  [CronTaskPriority.CRITICAL]: "bg-destructive/10 text-destructive",
  [CronTaskPriority.HIGH]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [CronTaskPriority.MEDIUM]: "bg-info/10 text-info",
  [CronTaskPriority.LOW]: "bg-success/10 text-success",
  [CronTaskPriority.BACKGROUND]:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

// Render the fixed wall-clock time without shifting it into the viewer's zone.
function annualScheduleParts(
  schedule: string,
  locale: CountryLanguage,
): { date: string; time: string } | undefined {
  const fixed = /^(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+\*$/u.exec(
    schedule.trim(),
  );
  if (!fixed) {
    return undefined;
  }
  const minute = Number(fixed[1]);
  const hour = Number(fixed[2]);
  const day = Number(fixed[3]);
  const month = Number(fixed[4]);
  const date = new Date(Date.UTC(2000, month - 1, day, hour, minute));
  if (
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute
  ) {
    return undefined;
  }
  return {
    date: new Intl.DateTimeFormat(locale, {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(date),
    time: new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(date),
  };
}

function formatDate(s: string | null | undefined, never: string): string {
  if (!s) {
    return never;
  }
  return s.slice(0, 16).replace("T", " ");
}

function formatDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Badge({
  label,
  className,
}: {
  label: string;
  className: string;
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        className,
      )}
    >
      {label}
    </Span>
  );
}

function StatCard({
  icon,
  value,
  label,
  iconColor,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconColor: string;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col items-center min-w-0 gap-1 rounded-lg border bg-card px-2 py-3 text-center sm:p-4">
      <Div style={{ color: iconColor, marginBottom: "2px" }}>{icon}</Div>
      <Div
        style={{
          fontWeight: 700,
          fontSize: "1.5rem",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.2,
        }}
      >
        {String(value)}
      </Div>
      <Div className="max-w-full text-center text-xs leading-tight text-muted-foreground [overflow-wrap:anywhere]">
        {label}
      </Div>
    </Div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-0.5">
      <Div className="text-xs text-muted-foreground">{label}</Div>
      <Div className="text-sm">{children}</Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Shared hook: resolve endpoint definition by routeId
// ---------------------------------------------------------------------------

function useResolvedEndpoint(routeId: string | null | undefined): {
  definition: CreateApiEndpointAny | null;
  isLoading: boolean;
  error: string | null;
} {
  // Last finished resolution, tagged with the routeId it belongs to
  const [resolved, setResolved] = useState<{
    routeId: string;
    definition: CreateApiEndpointAny | null;
    error: string | null;
  } | null>(null);

  // No route - drop any previous resolution (adjust state during render)
  if (!routeId && resolved !== null) {
    setResolved(null);
  }

  useEffect((): (() => void) => {
    if (!routeId) {
      return () => undefined;
    }

    let cancelled = false;

    const resolve = async (): Promise<void> => {
      const canonicalId = getFullPath(routeId) ?? routeId;
      const ep = await getEndpoint(canonicalId);
      if (cancelled) {
        return;
      }
      setResolved(
        ep
          ? { routeId, definition: ep, error: null }
          : { routeId, definition: null, error: routeId },
      );
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [routeId]);

  // Previous resolution stays visible while the next routeId loads
  return {
    definition: resolved?.definition ?? null,
    isLoading: !!routeId && resolved?.routeId !== routeId,
    error: resolved?.error ?? null,
  };
}

// ---------------------------------------------------------------------------
// TaskInputViewSection - read-only display for GET detail view
// ---------------------------------------------------------------------------

function TaskInputViewSection({
  routeId,
  taskInput,
  t,
}: {
  routeId: string;
  taskInput: Record<string, WidgetData>;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): React.JSX.Element {
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const { definition, isLoading, error } = useResolvedEndpoint(routeId);

  const hasInput = Object.keys(taskInput).length > 0;

  if (!hasInput) {
    return (
      <Div className="rounded-lg border p-4 flex flex-col gap-3">
        <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
          {t("widget.taskInput.title")}
        </Div>
        <Div className="text-sm text-muted-foreground">
          {t("widget.taskInput.empty")}
        </Div>
      </Div>
    );
  }

  return (
    <Div className="rounded-lg border p-4 flex flex-col gap-3">
      <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
        {t("widget.taskInput.title")}
      </Div>

      {isLoading && (
        <Div className="flex items-center gap-2 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.taskInput.loading")}
          </Span>
        </Div>
      )}

      {error && (
        <Div className="text-sm text-muted-foreground">
          {t("widget.taskInput.notFound")}
        </Div>
      )}

      {definition && (
        <EndpointsPage
          logger={logger}
          endpoint={{
            [definition.method]: definition,
          }}
          locale={locale}
          user={user}
          platform={platform}
          disabled={true}
          endpointOptions={{
            read: { initialData: taskInput as never },
            create: { autoPrefillData: taskInput as never },
            delete: { autoPrefillData: taskInput as never },
            update: { autoPrefillData: taskInput as never },
          }}
        />
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// TaskInputEditWidget - editable widget for PUT form (custom widget render)
// Loads endpoint definition by routeId from GET response, renders its fields,
// and propagates changes back to the parent form's taskInput field.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TaskInputEditSection - dynamic task input section for PUT form
// Loads endpoint definition by routeId, renders its fields,
// and propagates changes back to the parent form's taskInput field.
// ---------------------------------------------------------------------------

function TaskInputEditSection({
  t,
}: {
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.PUT>>;
}): React.JSX.Element {
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const response = useWidgetResponse();

  // Get routeId and taskInput from GET response (via prefillFromGet)
  const responseData = response?.success === true ? response.data : undefined;
  const routeId =
    responseData &&
    typeof responseData === "object" &&
    !Array.isArray(responseData) &&
    "task" in responseData
      ? (responseData as { task?: { routeId?: string } }).task?.routeId
      : undefined;

  const taskInput =
    responseData &&
    typeof responseData === "object" &&
    !Array.isArray(responseData) &&
    "task" in responseData
      ? (responseData as { task?: { taskInput?: Record<string, WidgetData> } })
          .task?.taskInput
      : undefined;

  const { definition, isLoading, error } = useResolvedEndpoint(routeId);

  const method = definition?.method as
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | undefined;

  if (!routeId) {
    return <></>;
  }

  if (isLoading) {
    return (
      <Div className="rounded-lg border p-4 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <Span className="text-sm text-muted-foreground">
          {t("widget.taskInput.loading")}
        </Span>
      </Div>
    );
  }

  if (error || !definition || !method) {
    return (
      <Div className="rounded-lg border p-4 text-sm text-muted-foreground">
        {t("widget.taskInput.notFound")}
      </Div>
    );
  }

  return (
    <Div className="rounded-lg border p-4 flex flex-col gap-3">
      <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
        {t("widget.taskInput.editTitle")}
      </Div>
      <EndpointsPage
        logger={logger}
        endpoint={{ [method]: definition }}
        locale={locale}
        user={user}
        platform={platform}
        endpointOptions={
          taskInput && Object.keys(taskInput).length > 0
            ? method === "GET"
              ? { read: { urlPathParams: taskInput as never } }
              : { create: { autoPrefillData: taskInput as never } }
            : undefined
        }
      />
    </Div>
  );
}

// ---------------------------------------------------------------------------
// ScheduleField - wraps ScheduleAutocomplete with react-hook-form integration
// ---------------------------------------------------------------------------

function ScheduleField({
  field,
}: {
  field: (typeof endpoints.PUT)["fields"]["children"]["schedule"];
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof endpoints.PUT>();
  const t = useWidgetTranslation<typeof endpoints.PUT>();

  const value = form.watch("schedule");

  const handleChange = useCallback(
    (newValue: string): void => {
      form.setValue("schedule", newValue, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
    },
    [form],
  );

  const handleBlur = useCallback((): void => {
    form.trigger("schedule");
  }, [form]);

  return (
    <Div className="flex flex-col gap-1.5">
      <Div className="text-sm font-medium">
        {t(field.label as Parameters<typeof t>[0])}
      </Div>
      <ScheduleAutocomplete
        value={value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={t(field.placeholder as Parameters<typeof t>[0])}
        locale={locale}
      />
      {field.description && (
        <Div className="text-xs text-muted-foreground">
          {t(field.description as Parameters<typeof t>[0])}
        </Div>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// CronTaskEditContainer - root custom widget for PUT form
// Renders all form fields + dynamic task input section
// ---------------------------------------------------------------------------

interface EditWidgetProps {
  field: {
    value: WidgetData | null | undefined;
  } & (typeof endpoints.PUT)["fields"];
}

export function CronTaskEditContainer({
  field,
}: EditWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.PUT>();
  const children = field.children;
  const form = useWidgetForm<typeof endpoints.PUT>();
  const onSubmit = useWidgetOnSubmit();

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Div className="flex flex-col gap-4 p-4">
        {/* Actions bar: back + submit */}
        <Div className="flex items-center gap-2">
          <NavigateButtonWidget field={children.actions.children.backButton} />
          <SubmitButtonWidget<typeof endpoints.PUT>
            field={children.actions.children.submitButton}
          />
        </Div>

        {/* Form fields in a grid */}
        <Div className="grid grid-cols-12 gap-4">
          <Div className="col-span-12">
            <TextFieldWidget
              field={children.displayName}
              fieldName="displayName"
            />
          </Div>
          <Div className="col-span-12">
            <TextareaFieldWidget
              field={children.description}
              fieldName="description"
            />
          </Div>
          <Div className="col-span-6">
            <ScheduleField field={children.schedule} />
          </Div>
          <Div className="col-span-6">
            <BooleanFieldWidget field={children.enabled} fieldName="enabled" />
          </Div>
          <Div className="col-span-6">
            <SelectFieldWidget field={children.priority} fieldName="priority" />
          </Div>
          <Div className="col-span-6">
            <SelectFieldWidget
              field={children.outputMode}
              fieldName="outputMode"
            />
          </Div>
          <Div className="col-span-6">
            <NumberFieldWidget field={children.timeout} fieldName="timeout" />
          </Div>
          <Div className="col-span-6">
            <NumberFieldWidget field={children.retries} fieldName="retries" />
          </Div>
          <Div className="col-span-6">
            <NumberFieldWidget
              field={children.retryDelay}
              fieldName="retryDelay"
            />
          </Div>
          <Div className="col-span-6">
            <BooleanFieldWidget field={children.hidden} fieldName="hidden" />
          </Div>
          <Div className="col-span-6">
            <BooleanFieldWidget field={children.runOnce} fieldName="runOnce" />
          </Div>
          <Div className="col-span-6">
            <TextFieldWidget
              field={children.targetInstance}
              fieldName="targetInstance"
            />
          </Div>
        </Div>

        {/* Dynamic task input section */}
        <TaskInputEditSection t={t} />
      </Div>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function CronTaskDetailContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const { push: navigate } = useWidgetNavigation();
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const children = field.children;

  const isLoading = endpointMutations?.read?.isLoading;
  const fieldValue = useWidgetValue<typeof endpoints.GET>();
  const task: Task | null | undefined = fieldValue?.task;
  const form = useWidgetForm<typeof endpoints.GET>();
  const routeTaskId = form.watch("id");
  const taskId = task?.id ?? routeTaskId;

  // ── Refresh ──
  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const [refresh, setRefresh] = useState<{
    taskId: string;
    status: "pending" | "success" | "error";
  }>();
  const refreshStatus =
    refresh?.taskId === taskId ? refresh?.status : undefined;

  const handleExplicitRefresh = async (): Promise<void> => {
    const read = endpointMutations?.read;
    if (!taskId || !read || refreshStatus === "pending") {
      return;
    }
    if (!read.refetchResult) {
      await read.refetch();
      return;
    }
    setRefresh({ taskId, status: "pending" });
    try {
      const result = await read.refetchResult();
      setRefresh({ taskId, status: result.success ? "success" : "error" });
    } catch {
      setRefresh({ taskId, status: "error" });
    }
  };

  // ── Navigation: edit task ──
  const handleEdit = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const m = await import("../definition");
      navigate(m.default.PUT, {
        urlPathParams: { id: task.id },
        data: task as never,
        prefillFromGet: true,
        getEndpoint: m.default.GET,
        popNavigationOnSuccess: 1,
        onSuccessCallback: handleRefresh,
      });
    })();
  }, [navigate, task, handleRefresh]);

  // ── Navigation: delete task ──
  const handleDelete = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const m = await import("../definition");
      navigate(m.default.DELETE, {
        urlPathParams: { id: task.id },
        renderInModal: true,
        popNavigationOnSuccess: 2,
        onSuccessCallback: handleRefresh,
      });
    })();
  }, [navigate, task, handleRefresh]);

  // ── Navigation: history ──
  const handleHistory = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const m = await import("../../history/definition");
      navigate(m.default.GET, {
        data: { taskId: task.id },
      });
    })();
  }, [navigate, task]);

  // ── Navigation: run task now ──
  const handleRun = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const m = await import("../../../execute/definition");
      navigate(m.default.POST, {
        data: { taskId: task.id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
        onSuccessCallback: handleRefresh,
      });
    })();
  }, [navigate, task, handleRefresh]);

  // ── Loading state ──
  if (!task && (refreshStatus === "pending" || refreshStatus === "error")) {
    return (
      <Div className="flex flex-col items-start gap-3 p-4">
        <NavigateButtonWidget field={children.backButton} />
        <Div aria-live="polite" className="text-sm text-muted-foreground">
          {t(
            refreshStatus === "error"
              ? "widget.refreshFailed"
              : "widget.refreshing",
          )}
        </Div>
        <Button
          type="button"
          variant="outline"
          disabled={refreshStatus === "pending"}
          onClick={() => void handleExplicitRefresh()}
        >
          {t("widget.refresh")}
        </Button>
      </Div>
    );
  }

  if (isLoading && !task) {
    return (
      <Div className="flex items-center justify-center h-full min-h-64 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  // ── Not found state ──
  if (fieldValue && !task) {
    return (
      <Div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <XCircle className="h-8 w-8 text-muted-foreground" />
        <Div className="text-sm text-muted-foreground">
          {t("widget.notFound")}
        </Div>
      </Div>
    );
  }

  // ── No data yet ──
  if (!task) {
    return (
      <Div className="flex items-center justify-center h-full min-h-64 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  // ── Computed values ──
  const successRate =
    task.executionCount > 0
      ? Math.round((task.successCount / task.executionCount) * 100)
      : 0;

  const neverLabel = t("widget.never");
  const annualSchedule = annualScheduleParts(task.schedule, locale);

  const statusColorClass = task.lastExecutionStatus
    ? (STATUS_COLORS[task.lastExecutionStatus] ??
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")
    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  const priorityColorClass =
    PRIORITY_COLORS[task.priority] ??
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  return (
    <Div className="flex flex-col gap-0 pb-8">
      {/* ── Top action bar ── */}
      <Div className="sticky top-0 z-10 flex min-w-0 flex-col gap-3 border-b bg-background p-4 md:flex-row md:flex-wrap md:items-center">
        <Div className="flex min-w-0 items-center gap-2 md:flex-1">
          <NavigateButtonWidget field={children.backButton} />
          <Div className="min-w-0 flex-1">
            <Div className="truncate text-lg font-bold leading-tight">
              {task.displayName}
            </Div>
            <Div className="mt-px truncate font-mono text-xs text-muted-foreground">
              {task.routeId}
            </Div>
          </Div>
        </Div>

        <Div className="flex max-w-full flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void handleExplicitRefresh()}
            disabled={refreshStatus === "pending"}
            aria-label={t("widget.refresh")}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRun}
            className="gap-1.5 text-success border-success/30 hover:bg-success/10"
          >
            <Play className="h-4 w-4" />
            {t(task.enabled ? "widget.run" : "widget.runManually")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleHistory}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            {t("widget.history")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="gap-1.5"
          >
            <Pencil className="h-4 w-4" />
            {t("widget.edit")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            {t("widget.delete")}
          </Button>
        </Div>
      </Div>

      <Div aria-live="polite" className="px-4 text-sm text-muted-foreground">
        {refreshStatus && (
          <Span
            className={cn(
              "mt-3 inline-block",
              refreshStatus === "error" && "text-destructive",
            )}
          >
            {t(
              refreshStatus === "pending"
                ? "widget.refreshing"
                : refreshStatus === "success"
                  ? "widget.refreshSucceeded"
                  : "widget.refreshFailed",
            )}
          </Span>
        )}
      </Div>

      <Div className="px-4 pt-4 flex flex-col gap-4">
        <Div className="flex flex-wrap items-center gap-3">
          <Badge
            label={
              task.enabled ? t("widget.enabled") : t("widget.schedulePaused")
            }
            className={
              task.enabled
                ? "bg-success/10 text-success"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }
          />
        </Div>

        {task.description && (
          <Div className="text-sm text-muted-foreground">
            {task.description}
          </Div>
        )}

        {/* ── Identity section ── */}
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
            {t("widget.identity")}
          </Div>
          <Div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoRow label={t("widget.id")}>
              <Div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  color: "var(--muted-foreground)",
                  wordBreak: "break-all",
                }}
              >
                {task.id}
              </Div>
            </InfoRow>
            <InfoRow label={t("widget.version")}>
              <Div>{task.version}</Div>
            </InfoRow>
            <InfoRow label={t("widget.category")}>
              <Badge
                label={t(task.category as Parameters<typeof t>[0])}
                className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </InfoRow>
            <InfoRow label={t("widget.priority")}>
              <Badge label={t(task.priority)} className={priorityColorClass} />
            </InfoRow>
            <InfoRow label={t("widget.schedule")}>
              <Div className="text-sm">
                {annualSchedule
                  ? t("widget.annualSchedule", annualSchedule)
                  : formatCronScheduleShort(
                      task.schedule,
                      task.timezone ?? getDefaultTimezone(locale),
                      locale,
                      logger,
                    )}
              </Div>
            </InfoRow>
            {task.timezone && (
              <InfoRow label={t("widget.timezone")}>
                <Div>{task.timezone}</Div>
              </InfoRow>
            )}
            <InfoRow label={t("widget.owner")}>
              {task.owner.type === "system" ? (
                <Badge
                  label={t("widget.ownerSystem")}
                  className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                />
              ) : (
                <Badge
                  label={t("widget.ownerUser")}
                  className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
                />
              )}
            </InfoRow>
            <InfoRow label={t("widget.outputMode")}>
              <Badge
                label={t(task.outputMode)}
                className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </InfoRow>
            <InfoRow label={t("widget.createdAt")}>
              <Div>
                {formatDate(new Date(task.createdAt).toISOString(), neverLabel)}
              </Div>
            </InfoRow>
            <InfoRow label={t("widget.updatedAt")}>
              <Div>
                {formatDate(new Date(task.updatedAt).toISOString(), neverLabel)}
              </Div>
            </InfoRow>
          </Div>
        </Div>

        <Div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            value={task.executionCount}
            label={t("widget.stats.totalExecutions")}
            iconColor="#2563eb"
          />
          <StatCard
            icon={<CheckCircle className="h-5 w-5" />}
            value={task.successCount}
            label={t("widget.stats.successful")}
            iconColor="#16a34a"
          />
          <StatCard
            icon={<XCircle className="h-5 w-5" />}
            value={task.errorCount}
            label={t("widget.stats.errors")}
            iconColor="#dc2626"
          />
        </Div>

        {task.executionCount > 0 && (
          <Div className="rounded-lg border p-4 flex flex-col gap-2">
            <Div className="flex items-center justify-between">
              <Div className="text-xs font-medium text-muted-foreground">
                {t("widget.stats.successRate")}
              </Div>
              <Div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#16a34a",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {successRate}%
              </Div>
            </Div>
            <Div className="bg-muted rounded-full h-2 overflow-hidden">
              <Div
                style={{
                  width: `${Math.min(successRate, 100)}%`,
                  backgroundColor: "#22c55e",
                  height: "8px",
                  borderRadius: "9999px",
                  transition: "width 0.3s",
                }}
              />
            </Div>
          </Div>
        )}

        {/* ── Timing section ── */}
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
            {t("widget.timingSection")}
          </Div>
          <Div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoRow label={t("widget.timing.avgDuration")}>
              <Div>{formatDuration(task.averageExecutionTime)}</Div>
            </InfoRow>
            <InfoRow label={t("widget.timing.lastDuration")}>
              <Div>{formatDuration(task.lastExecutionDuration)}</Div>
            </InfoRow>
            <InfoRow label={t("widget.timing.lastRun")}>
              <Div className="flex flex-wrap items-center gap-1">
                <Div>{formatDate(task.lastExecutedAt, neverLabel)}</Div>
                {task.lastExecutionStatus && (
                  <Badge
                    label={t(task.lastExecutionStatus)}
                    className={statusColorClass}
                  />
                )}
              </Div>
            </InfoRow>
            <InfoRow label={t("widget.timing.nextRun")}>
              <Div>{formatDate(task.nextExecutionAt, neverLabel)}</Div>
            </InfoRow>
            <InfoRow label={t("widget.timing.timeout")}>
              <Div>{formatDuration(task.timeout)}</Div>
            </InfoRow>
            <InfoRow label={t("widget.timing.retries")}>
              <Div>{task.retries ?? "—"}</Div>
            </InfoRow>
            <InfoRow label={t("widget.timing.retryDelay")}>
              <Div>{formatDuration(task.retryDelay)}</Div>
            </InfoRow>
          </Div>
        </Div>

        {/* ── Task Input section ── */}
        <TaskInputViewSection
          routeId={task.routeId}
          taskInput={task.taskInput}
          t={t}
        />

        {/* ── Last execution error (conditional) ── */}
        {task.lastExecutionError && (
          <Div
            style={{
              border: "1px solid #fca5a5",
              background: "rgba(239,68,68,0.04)",
              borderRadius: "0.5rem",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-destructive" />
              <Div className="text-xs font-semibold uppercase tracking-wide text-destructive">
                {t("widget.lastExecutionError")}
              </Div>
            </Div>
            <Div
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "#dc2626",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {task.lastExecutionError}
            </Div>
          </Div>
        )}

        {/* ── Bottom action row ── */}
        <Div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRun}
            className="gap-1.5 text-success border-success/30 hover:bg-success/10"
          >
            <Play className="h-4 w-4" />
            {t(task.enabled ? "widget.run" : "widget.runManually")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="gap-1.5"
          >
            <Pencil className="h-4 w-4" />
            {t("widget.edit")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleHistory}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            {t("widget.history")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleExplicitRefresh()}
            disabled={refreshStatus === "pending"}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            {t("widget.refresh")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            {t("widget.delete")}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
