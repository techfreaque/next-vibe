/**
 * Custom Widget for Cron Task Detail View
 * Full-featured task profile with execution stats, navigation, edit, delete, and history.
 * Also exports TaskInputEditWidget for dynamic task input editing in PUT form.
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Pencil,
  RefreshCw,
  Trash2,
  TrendingUp,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  getEndpoint,
  getFullPath,
} from "@/app/api/[locale]/system/generated/endpoint";
import { NavigationStackProvider } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointRenderer";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { CronTaskPriority, CronTaskStatus } from "../../enum";
import type endpoints from "./definition";
import type {
  CronTaskGetResponseOutput,
  CronTaskPutRequestOutput,
} from "./definition";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Task = CronTaskGetResponseOutput["task"];

interface WidgetProps {
  field: {
    value: CronTaskGetResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Status / Priority color maps
// Keyed on enum values (i18n key strings), not plain short strings
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  [CronTaskStatus.RUNNING]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [CronTaskStatus.COMPLETED]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [CronTaskStatus.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [CronTaskStatus.ERROR]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [CronTaskStatus.TIMEOUT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [CronTaskStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
};

const PRIORITY_COLORS: Record<string, string> = {
  [CronTaskPriority.CRITICAL]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [CronTaskPriority.HIGH]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [CronTaskPriority.MEDIUM]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [CronTaskPriority.LOW]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [CronTaskPriority.BACKGROUND]:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

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
    <Div className="flex flex-col items-center gap-1 p-4 rounded-lg border bg-card text-center">
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
      <Div className="text-xs text-muted-foreground text-center">{label}</Div>
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
  const [definition, setDefinition] = useState<CreateApiEndpointAny | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect((): (() => void) => {
    if (!routeId) {
      setDefinition(null);
      setError(null);
      return () => undefined;
    }

    let cancelled = false;
    setIsLoading(true);

    const resolve = async (): Promise<void> => {
      const canonicalId = getFullPath(routeId) ?? routeId;
      const ep = await getEndpoint(canonicalId);
      if (cancelled) {
        return;
      }
      if (ep) {
        setDefinition(ep);
        setError(null);
      } else {
        setDefinition(null);
        setError(routeId);
      }
      setIsLoading(false);
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [routeId]);

  return { definition, isLoading, error };
}

// ---------------------------------------------------------------------------
// TaskInputViewSection — read-only display for GET detail view
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
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const { definition, isLoading, error } = useResolvedEndpoint(routeId);

  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

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
        <NavigationStackProvider>
          <EndpointRenderer
            endpoint={definition}
            locale={locale}
            data={taskInput}
            disabled={true}
            logger={logger}
            user={user}
          />
        </NavigationStackProvider>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// TaskInputEditWidget — editable widget for PUT form (custom widget render)
// Loads endpoint definition by routeId from GET response, renders its fields,
// and propagates changes back to the parent form's taskInput field.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TaskInputEditSection — dynamic task input section for PUT form
// Loads endpoint definition by routeId, renders its fields,
// and propagates changes back to the parent form's taskInput field.
// ---------------------------------------------------------------------------

function TaskInputEditSection({
  t,
}: {
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.PUT>>;
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const parentForm = useWidgetForm<typeof endpoints.PUT>();
  const response = useWidgetResponse();

  // Get routeId from GET response (available via prefillFromGet)
  const responseData = response?.success === true ? response.data : undefined;
  const routeId =
    responseData &&
    typeof responseData === "object" &&
    !Array.isArray(responseData) &&
    "task" in responseData
      ? (responseData as { task?: { routeId?: string } }).task?.routeId
      : undefined;

  const { definition, isLoading, error } = useResolvedEndpoint(routeId);

  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  // Get current taskInput value from parent form
  const currentTaskInput = parentForm?.watch(
    "taskInput" as keyof CronTaskPutRequestOutput,
  ) as Record<string, WidgetData> | undefined;

  // Create inner form for editing the endpoint's fields
  const innerForm = useForm<FieldValues>({
    defaultValues: currentTaskInput ?? {},
  });

  // Watch inner form changes and propagate back to parent taskInput
  useEffect(() => {
    if (!parentForm || !definition) {
      return undefined;
    }

    const subscription = innerForm.watch((values) => {
      parentForm.setValue(
        "taskInput" as keyof CronTaskPutRequestOutput,
        values as CronTaskPutRequestOutput[keyof CronTaskPutRequestOutput],
        {
          shouldDirty: true,
          shouldTouch: true,
        },
      );
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, [innerForm, parentForm, definition]);

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

  if (error || !definition) {
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
      <Div className="text-xs text-muted-foreground">
        {t("widget.taskInput.editDescription")}
      </Div>
      <NavigationStackProvider>
        <EndpointRenderer
          endpoint={definition}
          locale={locale}
          data={currentTaskInput}
          form={innerForm as never}
          logger={logger}
          user={user}
        />
      </NavigationStackProvider>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// CronTaskEditContainer — root custom widget for PUT form
// Renders all form fields + dynamic task input section
// ---------------------------------------------------------------------------

interface EditWidgetProps {
  field: {
    value: WidgetData | null | undefined;
  } & (typeof endpoints.PUT)["fields"];
  fieldName: string;
}

export function CronTaskEditContainer({
  field,
}: EditWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.PUT>();
  const children = field.children;

  return (
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
          <TextFieldWidget field={children.schedule} fieldName="schedule" />
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
  const router = useRouter();
  const children = field.children;

  const isLoading = endpointMutations?.read?.isLoading;
  const task: Task | null | undefined = field.value?.task;

  // ── Navigation: edit task ──
  const handleEdit = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const m = await import("./definition");
      navigate(m.default.PUT, {
        urlPathParams: { id: task.id },
        data: task as never,
        prefillFromGet: true,
        getEndpoint: m.default.GET,
        popNavigationOnSuccess: 1,
      });
    })();
  }, [navigate, task]);

  // ── Navigation: delete task ──
  const handleDelete = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const m = await import("./definition");
      navigate(m.default.DELETE, {
        urlPathParams: { id: task.id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  }, [navigate, task]);

  // ── Navigation: history ──
  const handleHistory = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    router.push(`/${locale}/admin/cron/history`);
  }, [router, locale, task]);

  // ── Refresh ──
  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  // ── Loading state ──
  if (isLoading) {
    return (
      <Div className="flex items-center justify-center h-full min-h-64 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  // ── Not found state ──
  if (field.value && !task) {
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
      <Div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background z-10">
        <NavigateButtonWidget field={children.backButton} />

        <Div className="flex-1 min-w-0">
          <Div className="font-bold text-lg truncate leading-tight">
            {task.displayName}
          </Div>
          <Div
            style={{
              fontFamily: "monospace",
              fontSize: "0.72rem",
              color: "var(--muted-foreground)",
              marginTop: "1px",
            }}
          >
            {task.routeId}
          </Div>
        </Div>

        <Div className="flex items-center gap-1 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
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

      <Div className="px-4 pt-4 flex flex-col gap-4">
        {/* ── Header: displayName + routeId + enabled badge ── */}
        <Div className="flex flex-wrap items-center gap-3 pb-1">
          <Div className="text-2xl font-bold leading-snug">
            {task.displayName}
          </Div>
          <Div
            style={{
              fontFamily: "monospace",
              fontSize: "0.78rem",
              color: "var(--muted-foreground)",
              background: "var(--muted)",
              borderRadius: "4px",
              padding: "2px 8px",
            }}
          >
            {task.routeId}
          </Div>
          <Badge
            label={task.enabled ? t("widget.enabled") : t("widget.disabled")}
            className={
              task.enabled
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }
          />
        </Div>

        {task.description && (
          <Div className="text-sm text-muted-foreground -mt-2">
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
              <Div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  background: "var(--muted)",
                  borderRadius: "4px",
                  padding: "1px 6px",
                  display: "inline-block",
                }}
              >
                {task.schedule}
              </Div>
            </InfoRow>
            {task.timezone && (
              <InfoRow label={t("widget.timezone")}>
                <Div>{task.timezone}</Div>
              </InfoRow>
            )}
            <InfoRow label={t("widget.owner")}>
              {task.userId === null ? (
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
              <Div>{formatDate(task.createdAt, neverLabel)}</Div>
            </InfoRow>
            <InfoRow label={t("widget.updatedAt")}>
              <Div>{formatDate(task.updatedAt, neverLabel)}</Div>
            </InfoRow>
          </Div>
        </Div>

        {/* ── Execution stats row: 4 stat cards ── */}
        <Div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            value={`${successRate}%`}
            label={t("widget.stats.successRate")}
            iconColor="#9333ea"
          />
        </Div>

        {/* ── Success rate progress bar ── */}
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
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <Div className="text-xs font-semibold uppercase tracking-wide text-red-600">
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
            onClick={handleRefresh}
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
