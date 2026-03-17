/**
 * Task Execute Widget
 * Loads the task's endpoint UI by routeId so the user can review/edit
 * inputs before running. On success, renders the tool's result inline.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import {
  useEndpoint,
  type UseEndpointOptions,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { NavigationStackProvider } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { getFullPath } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import { endpoints as cronTaskEndpoints } from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/definition";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointRenderer";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { CronTaskStatus } from "../enum";
import type endpoints from "./definition";
import type { TaskExecuteResponseOutput } from "./definition";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WidgetProps {
  field: {
    value: TaskExecuteResponseOutput | null | undefined;
  } & (typeof endpoints.POST)["fields"];
}

interface EndpointMethods {
  GET?: CreateApiEndpointAny;
  POST?: CreateApiEndpointAny;
  PUT?: CreateApiEndpointAny;
  PATCH?: CreateApiEndpointAny;
  DELETE?: CreateApiEndpointAny;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function formatDate(s: string | null | undefined): string {
  if (!s) {
    return "—";
  }
  return s.slice(0, 19).replace("T", " ");
}

// ---------------------------------------------------------------------------
// Status icon
// ---------------------------------------------------------------------------

function StatusIcon({
  status,
}: {
  status: string | null | undefined;
}): JSX.Element {
  if (status === CronTaskStatus.COMPLETED) {
    return <CheckCircle className="h-6 w-6 text-green-600" />;
  }
  if (
    status === CronTaskStatus.FAILED ||
    status === CronTaskStatus.ERROR ||
    status === CronTaskStatus.TIMEOUT
  ) {
    return <XCircle className="h-6 w-6 text-red-500" />;
  }
  return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function TaskExecuteContainer({ field }: WidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const { endpointMutations } = useWidgetContext();
  const form = useWidgetForm<typeof endpoints.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const children = field.children;

  const isSubmitting = endpointMutations?.create?.isSubmitting;
  const result = field.value;

  // Watch taskId from form
  const taskId = form.watch("taskId") ?? "";

  // Fetch cron task details to get routeId + taskInput
  // Use only { GET } so options type doesn't require PUT/DELETE url params
  const cronGetOnly = useMemo(() => ({ GET: cronTaskEndpoints.GET }), []);
  const taskState = useEndpoint(
    cronGetOnly,
    useMemo(
      () => ({
        read: {
          urlPathParams: { id: taskId },
          queryOptions: { enabled: !!taskId },
        },
      }),
      [taskId],
    ),
    logger,
    user,
  );

  const taskData =
    taskState?.read?.response?.success === true
      ? taskState.read.response.data.task
      : null;

  const routeId = taskData?.routeId ?? null;
  const taskInput = useMemo(() => taskData?.taskInput ?? {}, [taskData]);

  // Resolve routeId → endpoint definition
  const [toolEndpoint, setToolEndpoint] = useState<CreateApiEndpointAny | null>(
    null,
  );

  useEffect((): (() => void) => {
    if (!routeId) {
      setToolEndpoint(null);
      return () => undefined;
    }

    let cancelled = false;
    const resolve = async (): Promise<void> => {
      const canonicalId = getFullPath(routeId) ?? routeId;
      const ep = await getEndpoint(canonicalId);
      if (!cancelled) {
        setToolEndpoint(ep ?? null);
      }
    };
    void resolve();
    return () => {
      cancelled = true;
    };
  }, [routeId]);

  const toolMethod = toolEndpoint?.method as
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | undefined;

  // Build prefill options for the embedded tool endpoint form
  const toolEndpointOptions = useMemo(():
    | UseEndpointOptions<EndpointMethods>
    | undefined => {
    if (!toolMethod || !taskInput || Object.keys(taskInput).length === 0) {
      return undefined;
    }
    if (toolMethod === "GET") {
      return { read: { urlPathParams: taskInput as never } };
    }
    if (toolMethod === "POST") {
      return { create: { autoPrefillData: taskInput as never } };
    }
    if (toolMethod === "PUT") {
      return { create: { autoPrefillData: taskInput as never } };
    }
    if (toolMethod === "PATCH") {
      return { update: { autoPrefillData: taskInput as never } };
    }
    if (toolMethod === "DELETE") {
      return {
        delete: {
          urlPathParams: taskInput as never,
          autoPrefillData: taskInput as never,
        },
      };
    }
    return undefined;
  }, [toolMethod, taskInput]);

  // ── Loading / submitting state ──
  if (isSubmitting) {
    return (
      <Div className="flex flex-col items-center gap-3 py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <Div className="text-sm text-muted-foreground">
          {t("post.container.description")}
        </Div>
      </Div>
    );
  }

  // ── Result state ──
  if (result) {
    const isSuccess = result.success === true;
    const status = result.status;

    const statusBgClass = isSuccess
      ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/40"
      : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/40";

    const statusTextClass = isSuccess
      ? "text-green-800 dark:text-green-300"
      : "text-red-800 dark:text-red-300";

    return (
      <Div className="flex flex-col gap-4 p-4">
        {/* Back button */}
        <Div className="flex items-center gap-2">
          <NavigateButtonWidget field={children.backButton} />
        </Div>

        {/* Status banner */}
        <Div
          className={`rounded-lg border p-4 flex items-center gap-3 ${statusBgClass}`}
        >
          <StatusIcon status={status} />
          <Div className="flex flex-col gap-0.5">
            <Div className={`font-semibold text-sm ${statusTextClass}`}>
              {isSuccess
                ? t("post.success.title")
                : t("post.errors.internal.title")}
            </Div>
            {result.message && (
              <Div className="text-xs text-muted-foreground">
                {result.message}
              </Div>
            )}
          </Div>
        </Div>

        {/* Execution summary */}
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
            {t("post.fields.taskId.label")}:{" "}
            <Span className="font-mono normal-case">{result.taskId}</Span>
          </Div>

          {result.taskName && (
            <Div className="flex flex-col gap-0.5">
              <Div className="text-xs text-muted-foreground">
                {t("post.response.taskName")}
              </Div>
              <Div className="text-sm font-medium">{result.taskName}</Div>
            </Div>
          )}

          <Div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {status && (
              <Div className="flex flex-col gap-0.5">
                <Div className="text-xs text-muted-foreground">
                  {t("post.response.status")}
                </Div>
                <Div className="text-sm font-mono">{status}</Div>
              </Div>
            )}

            {result.duration !== undefined && result.duration !== null && (
              <Div className="flex flex-col gap-0.5">
                <Div className="text-xs text-muted-foreground">
                  {t("post.response.duration")}
                </Div>
                <Div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDuration(result.duration)}
                </Div>
              </Div>
            )}

            {result.executedAt && (
              <Div className="flex flex-col gap-0.5">
                <Div className="text-xs text-muted-foreground">
                  {t("post.response.executedAt")}
                </Div>
                <Div className="text-sm">{formatDate(result.executedAt)}</Div>
              </Div>
            )}
          </Div>
        </Div>

        {/* Tool result rendered via its own endpoint UI */}
        {toolEndpoint && (
          <NavigationStackProvider>
            <EndpointRenderer
              endpoint={toolEndpoint}
              locale={locale}
              user={user}
              logger={logger}
              data={taskInput as WidgetData}
              disabled={true}
            />
          </NavigationStackProvider>
        )}
      </Div>
    );
  }

  // ── Input state (before submit) ──
  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header with back button */}
      <Div className="flex items-center gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex flex-col gap-0.5">
          <Div className="font-semibold text-base">
            {t("post.container.title")}
          </Div>
          <Div className="text-sm text-muted-foreground">
            {t("post.container.description")}
          </Div>
        </Div>
      </Div>

      {/* Task ID input */}
      <TextFieldWidget field={children.taskId} fieldName="taskId" />

      {/* Task loading indicator */}
      {taskId && taskState?.read?.isLoading && (
        <Div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <Span>{t("post.container.description")}</Span>
        </Div>
      )}

      {/* Tool endpoint UI — editable input form */}
      {taskId && taskData && toolEndpoint && toolMethod && (
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
            {taskData.displayName}
            <Span className="ml-2 font-mono text-xs normal-case font-normal">
              {routeId}
            </Span>
          </Div>
          <EndpointsPage
            endpoint={{ [toolMethod]: toolEndpoint } as EndpointMethods}
            locale={locale}
            user={user}
            endpointOptions={toolEndpointOptions}
          />
        </Div>
      )}

      {/* Submit button */}
      <SubmitButtonWidget<typeof endpoints.POST>
        field={children.submitButton}
      />
    </Div>
  );
}
