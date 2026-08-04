/**
 * Tool Call Renderer Component
 * 100% definition-driven rendering of tool calls
 *
 * This component:
 * 1. Loads endpoint definition from registry
 * 2. Merges args + result into single data object
 * 3. Passes merged data to WidgetRenderer with root field definition
 * 4. Widget system handles ALL rendering based on field usage metadata
 * 5. Works for ANY endpoint - zero hardcoded logic
 *
 * Design Principles:
 * - 100% definition-driven - NO hardcoded REQUEST/RESPONSE sections
 * - Field usage metadata controls what renders where
 * - Definition decides: combined view, separate sections, custom layout
 * - Reuses existing widget system completely
 */

"use client";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { definitionLoader } from "next-vibe/core/definition/loader";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import { AWAIT_TASK_ALIAS } from "next-vibe/execute-tool/await-task/constants";
import { endpoints as cancelCallEndpoints } from "next-vibe/execute-tool/call-control/cancel/definition";
import { endpoints as detachCallEndpoints } from "next-vibe/execute-tool/call-control/detach/definition";
import { endpoints as resumeWhenDoneEndpoints } from "next-vibe/execute-tool/call-control/resume-when-done/definition";
import {
  CallbackMode,
  EXECUTE_TOOL_ALIAS,
} from "next-vibe/execute-tool/constants";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { type EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";
import { endpoints as cronIdEndpoints } from "next-vibe/tasks/cron/[id]/definition";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe/ui/ui/collapsible";
import { Div, type DivMouseEvent } from "next-vibe/ui/ui/div";
import { Check } from "next-vibe/ui/ui/icons/Check";
import { ChevronDown } from "next-vibe/ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe/ui/ui/icons/ChevronRight";
import { Copy } from "next-vibe/ui/ui/icons/Copy";
import { Loader2 } from "next-vibe/ui/ui/icons/Loader2";
import { X } from "next-vibe/ui/ui/icons/X";
import { Span } from "next-vibe/ui/ui/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  type ReactHooksTranslationKey,
  scopedTranslation as reactScopedTranslation,
} from "next-vibe/unified-ui/hooks/i18n";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { NavigationStackProvider } from "next-vibe/unified-ui/hooks/use-navigation-stack";
import { EndpointRenderer } from "next-vibe/unified-ui/renderers/web/EndpointRenderer";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import { type IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";

import { pathToAliasMap } from "@/generated/endpoints/alias-map";

import type { SendMessageParams } from "../../../../../ai-stream/stream/hooks/send-message";
import type { ToolCall } from "../../../../db";
import { useChatNavigationStore } from "../../../../hooks/use-chat-navigation-store";

type ToolDecision =
  | { type: "pending" }
  | {
      type: "confirmed";
      updatedArgs?: Record<string, string | number | boolean | null>;
    }
  | { type: "declined" };

interface ToolCallRendererProps {
  toolCall: ToolCall;
  locale: CountryLanguage;
  user: JwtPayloadType; // JWT payload for permission checks when loading definitions
  defaultOpen?: boolean;
  threadId: string;
  messageId: string;
  toolIndex?: number;
  logger: EndpointLogger;
  /** Override the platform used for definition loading (default: NEXT_PAGE) */
  platformOverride?: Platform;
  collapseState?: {
    isCollapsed: (
      key: {
        messageId: string;
        sectionType: "thinking" | "tool";
        sectionIndex: number;
      },
      autoCollapsed: boolean,
    ) => boolean;
    toggleCollapse: (
      key: {
        messageId: string;
        sectionType: "thinking" | "tool";
        sectionIndex: number;
      },
      currentState: boolean,
    ) => void;
  };
  /** Optional batch mode handlers - when provided, tool won't submit individually */
  onConfirm?: (formData: FieldValues) => void;
  onCancel?: () => void;
  /** Parent message ID for batch submission */
  parentId?: string;
  /** Decision state for batch mode - used to style buttons and manage collapse */
  decision?: ToolDecision;
  /** Send message callback for tool confirmations */
  sendMessage?: (params: SendMessageParams) => void;
}

/**
 * Tool Call Renderer Component
 * Main component that orchestrates tool call rendering
 */
export function ToolCallRenderer({
  toolCall,
  locale,
  defaultOpen = false,
  threadId,
  messageId,
  toolIndex = 0,
  collapseState,
  user,
  onConfirm: batchOnConfirm,
  onCancel: batchOnCancel,
  parentId,
  decision,
  logger,
  platformOverride,
  sendMessage,
}: ToolCallRendererProps): JSX.Element {
  const { t } = reactScopedTranslation.scopedT(locale);
  const loadPlatform = platformOverride ?? Platform.NEXT_PAGE;

  // Determine if tool is waiting for user confirmation
  const isWaitingForConfirmation = Boolean(toolCall.waitingForConfirmation);

  const getIsOpen = (): boolean => {
    // If a decision has been made in batch mode, collapse the tool
    if (decision && decision.type !== "pending") {
      return false;
    }
    // Always open when waiting for confirmation
    if (isWaitingForConfirmation) {
      return true;
    }
    if (collapseState && messageId !== undefined) {
      const key = {
        messageId,
        sectionType: "tool" as const,
        sectionIndex: toolIndex,
      };
      const autoCollapsed = !defaultOpen;
      return !collapseState.isCollapsed(key, autoCollapsed);
    }
    return defaultOpen;
  };
  const [isOpen, setIsOpen] = useState(getIsOpen);

  const [definition, setDefinition] = useState<CreateApiEndpointAny | null>(
    null,
  );

  // When outer tool is execute-tool, also load the inner tool definition for display title
  const [innerToolDefinition, setInnerToolDefinition] =
    useState<CreateApiEndpointAny | null>(null);

  // Create a form for managing the tool parameters when waiting for confirmation
  const confirmationForm = useForm<FieldValues>({
    defaultValues:
      toolCall.args && typeof toolCall.args === "object" ? toolCall.args : {},
  });

  // Validate tool args against definition schema and show field-level errors
  // Only run validation when the tool is expanded (not collapsed)
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    // Only validate when the tool is open
    if (!isOpen) {
      return;
    }

    if (!toolCall.error || !definition || !toolCall.args) {
      // Clear errors when no error or no definition loaded yet
      if (hasValidated) {
        confirmationForm.clearErrors();
      }
      return;
    }

    // Get the request data schema from the definition
    const requestDataSchema = definition.requestSchema;
    const requestUrlParamsSchema = definition.requestUrlPathParamsSchema;

    if (!requestDataSchema && !requestUrlParamsSchema) {
      return;
    }

    try {
      // Validate the args against the definition schema
      // This will throw a ZodError if validation fails
      if (requestDataSchema) {
        requestDataSchema.parse(toolCall.args);
      }
      if (requestUrlParamsSchema && typeof toolCall.args === "object") {
        requestUrlParamsSchema.parse(toolCall.args);
      }

      // If validation passes, clear any errors
      confirmationForm.clearErrors();
      setHasValidated(true);
    } catch (error) {
      // ZodError contains validation errors
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as {
          issues: Array<{ path: string[]; message: string; code: string }>;
        };

        // Clear existing errors first
        confirmationForm.clearErrors();

        // Set errors for each field
        zodError.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            const fieldName = issue.path.join(".");
            confirmationForm.setError(fieldName, {
              type: issue.code || "validation",
              message: issue.message,
            });
          }
        });
        setHasValidated(true);
      }
    }
  }, [
    isOpen,
    toolCall.error,
    toolCall.args,
    definition,
    confirmationForm,
    hasValidated,
  ]);

  /**
   * Resolve a tool name (possibly with remote instanceId__ prefix) to a canonical
   * alias using the generated alias-map, then load the endpoint definition.
   *
   * Resolution order:
   * 1. Strip remote instanceId__ prefix (e.g. "hermes__agent_chat_threads_GET" → "agent_chat_threads_GET")
   * 2. Look up in pathToAliasMap → canonical alias (e.g. "agent_chat_threads_GET")
   * 3. Fall back to the stripped identifier if not in map
   * 4. Fall back to the original identifier
   */
  const tryLoadIdentifier = useCallback(
    async (identifier: string): ReturnType<typeof definitionLoader.load> => {
      // Strip remote instanceId__ prefix
      const stripped = identifier.includes("__")
        ? identifier.slice(identifier.indexOf("__") + 2)
        : identifier;

      // Resolve via alias-map (may map to itself or to a short alias)
      const canonical =
        (pathToAliasMap as Record<string, string>)[stripped] ??
        (pathToAliasMap as Record<string, string>)[identifier] ??
        stripped;

      // Try canonical alias first, then stripped, then original
      const candidates = [...new Set([canonical, stripped, identifier])];

      for (const candidate of candidates) {
        const result = await definitionLoader.load({
          identifier: candidate,
          platform: loadPlatform,
          user,
          logger,
          locale,
        });
        if (result.success) {
          return result;
        }
      }

      // Return final failure (last candidate)
      return definitionLoader.load({
        identifier: canonical,
        platform: loadPlatform,
        user,
        logger,
        locale,
      });
    },
    [loadPlatform, user, logger, locale],
  );

  useEffect(() => {
    // Skip if definition is already loaded
    if (definition) {
      return;
    }

    const loadDef = async (): Promise<void> => {
      const result = await tryLoadIdentifier(toolCall.toolName);
      if (result.success) {
        setDefinition(result.data);
        // Apply definition's defaultExpanded once loaded, but only if there's no user override.
        // For defaultExpanded=true tools: collapsed while executing/backgrounded, expanded
        // once done (the completion effect below re-opens when the result arrives).
        if (result.data.defaultExpanded !== undefined) {
          const hasUserOverride =
            collapseState &&
            messageId !== undefined &&
            collapseState.isCollapsed(
              { messageId, sectionType: "tool", sectionIndex: toolIndex },
              !result.data.defaultExpanded,
            ) !== !result.data.defaultExpanded;
          if (!hasUserOverride) {
            const currentlyLoading =
              Boolean(toolCall.isPartial) ||
              (!toolCall.result &&
                !toolCall.error &&
                !toolCall.waitingForConfirmation &&
                toolCall.status !== "completed" &&
                toolCall.status !== "failed");
            const isBackground =
              toolCall.callbackMode === CallbackMode.DETACH ||
              toolCall.callbackMode === CallbackMode.WAKE_UP;
            setIsOpen(
              result.data.defaultExpanded
                ? !currentlyLoading && !isBackground
                : false,
            );
          }
        }
      }
    };
    void loadDef();
  }, [
    toolCall.toolName,
    toolCall.isPartial,
    toolCall.result,
    toolCall.error,
    toolCall.waitingForConfirmation,
    toolCall.status,
    toolCall.callbackMode,
    definition,
    tryLoadIdentifier,
    collapseState,
    messageId,
    toolIndex,
  ]);

  // When the outer tool is execute-tool, load the inner tool's definition for its display title
  const isExecuteTool = Boolean(
    definition?.aliases?.includes(EXECUTE_TOOL_ALIAS),
  );
  const isAwaitTaskOuter = Boolean(
    definition?.aliases?.includes(AWAIT_TASK_ALIAS),
  );

  const executeToolArgs =
    isExecuteTool &&
    toolCall.args &&
    typeof toolCall.args === "object" &&
    !Array.isArray(toolCall.args)
      ? (toolCall.args as { [key: string]: WidgetData })
      : null;
  const executeToolResult =
    isExecuteTool &&
    toolCall.result &&
    typeof toolCall.result === "object" &&
    !Array.isArray(toolCall.result)
      ? (toolCall.result as { [key: string]: WidgetData })
      : null;

  // When the outer tool is await-task, the inner tool name comes from the response
  const awaitTaskResult =
    isAwaitTaskOuter &&
    toolCall.result &&
    typeof toolCall.result === "object" &&
    !Array.isArray(toolCall.result)
      ? (toolCall.result as { [key: string]: WidgetData })
      : null;

  // When execute-tool wraps await-task, look through to the real inner tool via result.originalToolName
  const executeWrapsAwaitTask =
    typeof executeToolArgs?.toolName === "string" &&
    executeToolArgs.toolName === AWAIT_TASK_ALIAS &&
    executeToolResult?.result &&
    typeof executeToolResult.result === "object" &&
    !Array.isArray(executeToolResult.result);
  const executeAwaitTaskInner = executeWrapsAwaitTask
    ? (executeToolResult?.result as { [key: string]: WidgetData } | null)
    : null;

  // Resolve final inner tool name, preferring the deepest real tool
  const innerToolName: string | undefined = (() => {
    // execute-tool wrapping await-task: use the original tool from await-task's result
    if (
      executeWrapsAwaitTask &&
      typeof executeAwaitTaskInner?.originalToolName === "string"
    ) {
      return executeAwaitTaskInner.originalToolName;
    }
    // execute-tool directly: use toolName from args (may still be await-task if no result yet)
    if (typeof executeToolArgs?.toolName === "string") {
      return executeToolArgs.toolName;
    }
    // await-task outer: use originalToolName from response
    if (typeof awaitTaskResult?.originalToolName === "string") {
      return awaitTaskResult.originalToolName;
    }
    return undefined;
  })();

  // Compute the request/response to pass to inner tool's dynamicTitle
  // so it receives the actual tool's args/result, not the wrapper's
  const innerToolRequest: WidgetData | undefined = (() => {
    if (executeWrapsAwaitTask) {
      // execute-tool → await-task → real tool: inner args are in result.originalArgs
      const inner = executeAwaitTaskInner;
      return inner?.originalArgs && typeof inner.originalArgs === "object"
        ? (inner.originalArgs as WidgetData)
        : undefined;
    }
    if (isExecuteTool) {
      // execute-tool directly: inner args are in args.input
      return executeToolArgs?.input && typeof executeToolArgs.input === "object"
        ? (executeToolArgs.input as WidgetData)
        : undefined;
    }
    if (isAwaitTaskOuter) {
      // await-task outer: inner args are in result.originalArgs
      return awaitTaskResult?.originalArgs &&
        typeof awaitTaskResult.originalArgs === "object"
        ? (awaitTaskResult.originalArgs as WidgetData)
        : undefined;
    }
    return undefined;
  })();

  const innerToolResponse: WidgetData | undefined = (() => {
    if (executeWrapsAwaitTask) {
      // execute-tool → await-task → real tool: inner result is in result.result
      const inner = executeAwaitTaskInner;
      return inner?.result && typeof inner.result === "object"
        ? (inner.result as WidgetData)
        : undefined;
    }
    if (isExecuteTool) {
      // execute-tool directly: inner result is in result.result
      return executeToolResult?.result &&
        typeof executeToolResult.result === "object"
        ? (executeToolResult.result as WidgetData)
        : undefined;
    }
    if (isAwaitTaskOuter) {
      // await-task outer: inner result is in result.result
      return awaitTaskResult?.result &&
        typeof awaitTaskResult.result === "object"
        ? (awaitTaskResult.result as WidgetData)
        : undefined;
    }
    return undefined;
  })();

  useEffect((): (() => void) => {
    if (!innerToolName) {
      setInnerToolDefinition(null);
      return () => undefined;
    }
    // If a different tool is loaded, clear it so we reload for the new name
    if (
      innerToolDefinition &&
      !innerToolDefinition.aliases?.includes(innerToolName)
    ) {
      setInnerToolDefinition(null);
      return () => undefined;
    }
    // Skip if already loaded — open state is set once on first load, not on every toolCall update
    if (innerToolDefinition) {
      return () => undefined;
    }
    let cancelled = false;
    const load = async (): Promise<void> => {
      const result = await tryLoadIdentifier(innerToolName);
      if (!cancelled && result.success) {
        setInnerToolDefinition(result.data);
        if (result.data.defaultExpanded !== undefined) {
          const hasUserOverride =
            collapseState &&
            messageId !== undefined &&
            collapseState.isCollapsed(
              { messageId, sectionType: "tool", sectionIndex: toolIndex },
              !result.data.defaultExpanded,
            ) !== !result.data.defaultExpanded;
          if (!hasUserOverride) {
            const currentlyLoading =
              Boolean(toolCall.isPartial) ||
              (!toolCall.result &&
                !toolCall.error &&
                !toolCall.waitingForConfirmation &&
                toolCall.status !== "completed" &&
                toolCall.status !== "failed");
            const isBackground =
              toolCall.callbackMode === CallbackMode.DETACH ||
              toolCall.callbackMode === CallbackMode.WAKE_UP;
            setIsOpen(
              result.data.defaultExpanded
                ? !currentlyLoading && !isBackground
                : false,
            );
          }
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [
    innerToolName,
    innerToolDefinition,
    tryLoadIdentifier,
    collapseState,
    messageId,
    toolIndex,
    toolCall.isPartial,
    toolCall.result,
    toolCall.error,
    toolCall.waitingForConfirmation,
    toolCall.status,
    toolCall.callbackMode,
  ]);

  // defaultExpanded tools stay collapsed while executing (the definition-load
  // effects see currentlyLoading/isBackground and set closed) — but those effects
  // only run once per definition, so re-evaluate here and expand once the call
  // finishes and the result/error arrives.
  const expandDefinition = innerToolDefinition ?? definition;
  useEffect(() => {
    if (!expandDefinition?.defaultExpanded) {
      return;
    }
    const isTerminal =
      toolCall.status === "completed" || toolCall.status === "failed";
    const isDone =
      Boolean(toolCall.result) || Boolean(toolCall.error) || isTerminal;
    // Background dispatch acks carry a result ({hint, taskId}) but the call is
    // still parked — only the injected final result (terminal status or a
    // deferred backfill) counts as done. detach never backfills, so it only
    // expands if a deferred result arrives.
    const isParkedBackground =
      (toolCall.callbackMode === CallbackMode.WAKE_UP &&
        !toolCall.isDeferred &&
        !isTerminal) ||
      (toolCall.callbackMode === CallbackMode.DETACH && !toolCall.isDeferred);
    if (!isDone || toolCall.isPartial || isParkedBackground) {
      return;
    }
    const hasUserOverride =
      collapseState &&
      messageId !== undefined &&
      collapseState.isCollapsed(
        { messageId, sectionType: "tool", sectionIndex: toolIndex },
        false,
      ) !== false;
    if (!hasUserOverride) {
      setIsOpen(true);
    }
  }, [
    expandDefinition,
    toolCall.result,
    toolCall.error,
    toolCall.status,
    toolCall.isPartial,
    toolCall.callbackMode,
    toolCall.isDeferred,
    collapseState,
    messageId,
    toolIndex,
  ]);

  const isPartial = Boolean(toolCall.isPartial);
  const hasResult = Boolean(toolCall.result);
  // Detect error: toolCall.error should be an ErrorResponseType (object with success=false).
  // Also detect when toolCall.result is an ErrorResponseType (tool returned fail() without throwing).
  const resultIsError =
    toolCall.result !== null &&
    toolCall.result !== undefined &&
    typeof toolCall.result === "object" &&
    !Array.isArray(toolCall.result) &&
    "success" in toolCall.result &&
    toolCall.result.success === false;
  // status="failed" counts as an error even with no result (e.g. remote task failed with no output)
  const statusIsError = toolCall.status === "failed";
  const hasError = Boolean(toolCall.error) || resultIsError || statusIsError;
  // status="completed" or "failed" means the tool finished - don't show loading even if result is null
  // (remote async tasks may complete with no result payload)
  const isTerminalStatus =
    toolCall.status === "completed" || toolCall.status === "failed";
  // detach: fire-and-forget, result in task history only
  const isSentToBackground =
    toolCall.callbackMode === "detach" && !toolCall.isDeferred;
  // wakeUp: result will be injected back into thread when ready (only while still pending)
  const isWakeUpBackground =
    toolCall.callbackMode === "wakeUp" &&
    !toolCall.isDeferred &&
    !isTerminalStatus;
  // wait: stream paused while remote executes
  const isWaitingForRemote =
    toolCall.callbackMode === "wait" && toolCall.status === "pending";
  // deferred: result arrived async after original stream ended
  const isDeferred = Boolean(toolCall.isDeferred) && !toolCall.isConfirmed;
  // confirmed by user (approve mode): tool was manually approved and executed
  const isConfirmedByUser = Boolean(toolCall.isConfirmed);
  // denied by user (approve mode): user explicitly declined an approve-mode tool
  const isDeniedByUser =
    toolCall.callbackMode === "approve" &&
    toolCall.isConfirmed === false &&
    hasError;
  const isLoading =
    isPartial ||
    (!hasResult &&
      !hasError &&
      !isWaitingForConfirmation &&
      !isTerminalStatus &&
      !isSentToBackground &&
      !isWakeUpBackground &&
      !isWaitingForRemote &&
      !isConfirmedByUser);

  /** Extract a displayable error message from toolCall.error or toolCall.result (when it's an ErrorResponseType) */
  const getErrorMessage = (): string => {
    const err = toolCall.error;
    if (err) {
      return err.message;
    }
    // Fallback: toolCall.result is an ErrorResponseType (tool returned fail() without throwing).
    // Display the raw message string - it may be a translation key but WidgetData
    if (
      resultIsError &&
      typeof toolCall.result === "object" &&
      toolCall.result !== null &&
      "message" in toolCall.result &&
      typeof toolCall.result.message === "string"
    ) {
      return toolCall.result.message;
    }
    return "";
  };

  const [wasWaitingForConfirmation, setWasWaitingForConfirmation] = useState(
    isWaitingForConfirmation,
  );
  const [copied, setCopied] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const cancelMutation = useApiMutation(cronIdEndpoints.DELETE, logger, user);

  const handleCancelTask = useCallback(
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      const taskId = toolCall.remoteTaskId;
      if (!taskId || isCancelling) {
        return;
      }
      setIsCancelling(true);
      void cancelMutation
        .mutateAsync({
          urlPathParams: { id: taskId },
        })
        .then(() => undefined)
        .catch(() => {
          setIsCancelling(false);
        });
    },
    [cancelMutation, toolCall.remoteTaskId, isCancelling],
  );

  // Mid-flight / parked call-control actions, keyed by callId. For a PARKED wakeUp
  // call the id is pendingCallId; for a LIVE in-flight call it is the toolCallId.
  // detach handles both stages (deliver-signal, else discard-parked+unblock).
  const controlCallId = toolCall.pendingCallId ?? toolCall.toolCallId;

  // Incognito threads live only in localStorage — a backgrounded/revived call has
  // no server-side thread to inject its result into, so only cancel is offered.
  const isIncognito =
    useChatNavigationStore((s) => s.currentRootFolderId) ===
    DefaultFolderId.INCOGNITO;

  const [isDetaching, setIsDetaching] = useState(false);
  const detachMutation = useApiMutation(detachCallEndpoints.POST, logger, user);
  const handleDetach = useCallback(
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (!controlCallId || isDetaching) {
        return;
      }
      setIsDetaching(true);
      void detachMutation
        .mutateAsync({ requestData: { callId: controlCallId } })
        .then(() => undefined)
        .catch(() => {
          setIsDetaching(false);
        });
    },
    [detachMutation, controlCallId, isDetaching],
  );

  const [isResuming, setIsResuming] = useState(false);
  const resumeMutation = useApiMutation(
    resumeWhenDoneEndpoints.POST,
    logger,
    user,
  );
  const handleResumeWhenDone = useCallback(
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (!controlCallId || isResuming) {
        return;
      }
      setIsResuming(true);
      void resumeMutation
        .mutateAsync({ requestData: { callId: controlCallId } })
        .then(() => undefined)
        .catch(() => {
          setIsResuming(false);
        });
    },
    [resumeMutation, controlCallId, isResuming],
  );

  const [isCancellingCall, setIsCancellingCall] = useState(false);
  const cancelCallMutation = useApiMutation(
    cancelCallEndpoints.POST,
    logger,
    user,
  );
  const handleCancelCall = useCallback(
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (!controlCallId || isCancellingCall) {
        return;
      }
      setIsCancellingCall(true);
      void cancelCallMutation
        .mutateAsync({ requestData: { callId: controlCallId } })
        .then(() => undefined)
        .catch(() => {
          setIsCancellingCall(false);
        });
    },
    [cancelCallMutation, controlCallId, isCancellingCall],
  );

  const handleCopyJson = (e: DivMouseEvent): void => {
    e.stopPropagation();

    // Build request: merge args with top-level metadata fields not already present in args
    const argsObj =
      toolCall.args &&
      typeof toolCall.args === "object" &&
      !Array.isArray(toolCall.args)
        ? (toolCall.args as Record<string, ToolCall["args"]>)
        : undefined;
    const metaOverrides: Record<string, string> = {};
    if (toolCall.callbackMode && (!argsObj || !("callbackMode" in argsObj))) {
      metaOverrides["callbackMode"] = toolCall.callbackMode;
    }
    if (toolCall.remoteTaskId && (!argsObj || !("remoteTaskId" in argsObj))) {
      metaOverrides["remoteTaskId"] = toolCall.remoteTaskId;
    }

    const payload: {
      toolName: string;
      request?: ToolCall["args"];
      response?: ToolCall["result"];
      error?: ToolCall["error"];
    } = { toolName: toolCall.toolName };
    if (toolCall.args || Object.keys(metaOverrides).length > 0) {
      payload.request = argsObj
        ? { ...argsObj, ...metaOverrides }
        : metaOverrides;
    }
    if (toolCall.result) {
      if (typeof toolCall.result === "string") {
        try {
          payload.response = JSON.parse(toolCall.result) as ToolCall["result"];
        } catch {
          payload.response = toolCall.result;
        }
      } else {
        payload.response = toolCall.result;
      }
    }
    if (toolCall.error) {
      payload.error = toolCall.error;
    }
    const text = JSON.stringify(payload, null, 2);
    void copyToClipboard(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return undefined;
    });
  };

  // Update isOpen when waitingForConfirmation changes
  useEffect(() => {
    if (isWaitingForConfirmation) {
      setIsOpen(true);
      setWasWaitingForConfirmation(true);
    } else if (wasWaitingForConfirmation && !isWaitingForConfirmation) {
      // Tool was just confirmed/declined - collapse it
      setIsOpen(false);
      setWasWaitingForConfirmation(false);
    }
  }, [isWaitingForConfirmation, wasWaitingForConfirmation]);

  const handleToggle = (newState: boolean): void => {
    if (collapseState && messageId !== undefined) {
      const key = {
        messageId,
        sectionType: "tool" as const,
        sectionIndex: toolIndex,
      };
      const autoCollapsed = !defaultOpen;
      const currentState = !collapseState.isCollapsed(key, autoCollapsed);
      collapseState.toggleCollapse(key, currentState);
      setIsOpen(newState);
    } else {
      setIsOpen(newState);
    }
  };

  // dynamicTitle is fully typed at each definition site; here we call it via CreateApiEndpointAny
  // which erases the concrete field types - cast the function to accept ToolCall data
  type DynamicTitleFn = (data: {
    request?: ToolCall["args"];
    response?: ToolCall["result"];
  }) =>
    | { message: string; messageParams?: Record<string, string | number> }
    | undefined;

  // Resolve display title: use this definition's own title/dynamicTitle.
  // When outer tool is execute-tool and the inner tool definition is loaded,
  // show the inner tool's title directly (so "Generate Image" shows instead of "Execute: generate_image").
  const resolveDisplay = (): {
    displayName: string;
    icon: IconKey | undefined;
  } => {
    // If we have the inner tool resolved, use its title as the display name
    if (innerToolDefinition) {
      const innerScopedT =
        innerToolDefinition.scopedTranslation.scopedT(locale);
      const innerStaticTitle = innerToolDefinition.title
        ? (innerScopedT?.t(innerToolDefinition.title) ?? toolCall.toolName)
        : toolCall.toolName;
      const innerDynamicFn = innerToolDefinition.dynamicTitle as
        | DynamicTitleFn
        | undefined;
      const innerDynamic = innerDynamicFn?.({
        request: innerToolRequest,
        response: innerToolResponse,
      });
      const innerTitle = innerDynamic
        ? (innerScopedT?.t(innerDynamic.message, innerDynamic.messageParams) ??
          innerStaticTitle)
        : innerStaticTitle;
      return {
        displayName: innerTitle,
        icon: innerToolDefinition.icon ?? definition?.icon,
      };
    }

    const scopedT = definition?.scopedTranslation.scopedT(locale);
    const staticTitle = definition?.title
      ? scopedT?.t(definition.title)
      : toolCall.toolName;

    const dynamicTitleFn = definition?.dynamicTitle as
      | DynamicTitleFn
      | undefined;
    const dynamicResult = dynamicTitleFn
      ? dynamicTitleFn({
          request:
            toolCall.args && typeof toolCall.args === "object"
              ? toolCall.args
              : undefined,
          response:
            toolCall.result && typeof toolCall.result === "object"
              ? toolCall.result
              : undefined,
        })
      : undefined;

    type DynamicIconFn = (data: {
      request?: ToolCall["args"];
      response?: ToolCall["result"];
    }) => IconKey | undefined;
    const dynamicIconFn = definition?.dynamicIcon as DynamicIconFn | undefined;
    const resolvedIcon =
      dynamicIconFn?.({
        request:
          toolCall.args && typeof toolCall.args === "object"
            ? toolCall.args
            : undefined,
        response:
          toolCall.result && typeof toolCall.result === "object"
            ? toolCall.result
            : undefined,
      }) ?? definition?.icon;

    return {
      displayName: dynamicResult
        ? (scopedT?.t(dynamicResult.message, dynamicResult.messageParams) ??
          staticTitle ??
          toolCall.toolName)
        : (staticTitle ?? toolCall.toolName),
      icon: resolvedIcon,
    };
  };

  const { displayName, icon } = resolveDisplay();

  // dynamicCredits is fully typed at each definition site; here we call it via CreateApiEndpointAny
  // which erases the concrete field types - use the same erased-fn pattern as dynamicTitle
  type DynamicCreditsFn = (data: {
    request?: ToolCall["args"];
    response?: ToolCall["result"];
  }) => number | undefined;

  const dynamicCreditsFn = definition?.dynamicCredits as
    | DynamicCreditsFn
    | undefined;
  const dynamicCost = dynamicCreditsFn?.({
    request: toolCall.args,
    response: toolCall.result,
  });
  const credits =
    dynamicCost ?? definition?.credits ?? toolCall.creditsUsed ?? 0;
  const creditsDisplay = credits
    ? t(
        credits === 1
          ? "widgets.toolCall.creditsUsed_one"
          : "widgets.toolCall.creditsUsed_other",
        { cost: credits },
      )
    : null;

  return (
    <Div className="rounded-lg border border-border/50 bg-muted overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        {/* Header */}
        <CollapsibleTrigger asChild>
          <Div
            className={cn(
              "flex items-center justify-between p-3 cursor-pointer",
              "hover:bg-accent transition-colors",
            )}
          >
            <Div className="flex items-center gap-2">
              {/* Expand/Collapse Icon */}
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}

              <Div className="flex items-center gap-2">
                {icon && (
                  <Icon icon={icon} className="h-4 w-4 text-muted-foreground" />
                )}
                <Span className="font-medium text-sm">{displayName}</Span>
              </Div>

              {/* Loading Indicator */}
              {isLoading && (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              )}

              {/* Credits */}
              {creditsDisplay && (
                <Span className="text-xs text-muted-foreground">
                  {creditsDisplay}
                </Span>
              )}
            </Div>

            {/* Status Badge */}
            <Div className="flex items-center gap-2">
              {/* Copy JSON button - when expanded and any data is available */}
              {isOpen && (hasResult || hasError || toolCall.args) && (
                <Div
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                  onClick={handleCopyJson}
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Div>
              )}
              {hasError && !isDeniedByUser && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  {t("widgets.toolCall.status.error")}
                </Span>
              )}
              {isDeniedByUser && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  {t(
                    isWakeUpBackground
                      ? "widgets.toolCall.status.deniedWakeUp"
                      : "widgets.toolCall.status.denied",
                  )}
                </Span>
              )}
              {isWaitingForConfirmation && decision?.type === "confirmed" && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success dark:text-success">
                  {t("widgets.toolCall.status.pendingConfirmation")}
                </Span>
              )}
              {isWaitingForConfirmation && decision?.type === "declined" && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive dark:text-destructive">
                  {t("widgets.toolCall.status.pendingCancellation")}
                </Span>
              )}
              {isWaitingForConfirmation &&
                (!decision || decision.type === "pending") && (
                  <Span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                    {t(
                      isWakeUpBackground
                        ? "widgets.toolCall.status.waitingForConfirmationWakeUp"
                        : "widgets.toolCall.status.waitingForConfirmation",
                    )}
                  </Span>
                )}
              {isLoading &&
                (() => {
                  const loadingBadge = definition?.statusBadge?.loading;
                  if (loadingBadge) {
                    const scopedT =
                      definition.scopedTranslation.scopedT(locale);
                    return (
                      <Span
                        className={`text-xs px-2 py-0.5 rounded-full ${loadingBadge.color}`}
                      >
                        {scopedT.t(loadingBadge.label)}
                      </Span>
                    );
                  }
                  return (
                    <Span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-primary">
                      {t("widgets.toolCall.status.executing")}
                    </Span>
                  );
                })()}
              {/* Live in-flight controls: cancel / detach / resume-when-done.
                  Shown while a call is actively running so the user can steer it
                  (mirrors the AI-callable call-control tools). */}
              {isLoading && controlCallId && (
                <>
                  {!isIncognito && (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                        disabled={isDetaching}
                        onClick={handleDetach}
                      >
                        {isDetaching ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          t("widgets.toolCall.actions.runInBackground")
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                        disabled={isResuming}
                        onClick={handleResumeWhenDone}
                      >
                        {isResuming ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          t("widgets.toolCall.actions.resumeWhenDone")
                        )}
                      </Button>
                    </>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-5 px-1.5 text-xs text-muted-foreground hover:text-destructive"
                    disabled={isCancellingCall}
                    onClick={handleCancelCall}
                  >
                    {isCancellingCall ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </Button>
                </>
              )}
              {isSentToBackground && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-warning">
                  {t("widgets.toolCall.status.sentToBackground")}
                </Span>
              )}
              {isWakeUpBackground &&
                !isDeniedByUser &&
                !isWaitingForConfirmation && (
                  <>
                    <Span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
                      {t(
                        isConfirmedByUser
                          ? "widgets.toolCall.status.confirmedWakeUp"
                          : "widgets.toolCall.status.wakeUpBackground",
                      )}
                    </Span>
                    {toolCall.remoteTaskId && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-5 px-1.5 text-xs text-muted-foreground hover:text-destructive"
                        disabled={isCancelling}
                        onClick={handleCancelTask}
                      >
                        {isCancelling ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </>
                )}
              {isWaitingForRemote && (
                <>
                  <Span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
                    {t("widgets.toolCall.status.waitingForRemote")}
                  </Span>
                  {controlCallId && (
                    <>
                      {!isIncognito && (
                        <>
                          {/* detach — run in background, discard result, unblock now */}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                            disabled={isDetaching}
                            onClick={handleDetach}
                          >
                            {isDetaching ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              t("widgets.toolCall.actions.runInBackground")
                            )}
                          </Button>
                          {/* resume-when-done — keep waiting in background, revive with result */}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                            disabled={isResuming}
                            onClick={handleResumeWhenDone}
                          >
                            {isResuming ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              t("widgets.toolCall.actions.resumeWhenDone")
                            )}
                          </Button>
                        </>
                      )}
                      {/* cancel — interrupt, return an error result */}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-5 px-1.5 text-xs text-muted-foreground hover:text-destructive"
                        disabled={isCancellingCall}
                        onClick={handleCancelCall}
                      >
                        {isCancellingCall ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                    </>
                  )}
                </>
              )}
              {isConfirmedByUser && !isWakeUpBackground && !isDeniedByUser && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                  {t("widgets.toolCall.status.confirmed")}
                </Span>
              )}
              {isDeferred && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
                  {t("widgets.toolCall.status.deferred")}
                </Span>
              )}
              {(hasResult || isTerminalStatus) &&
                !hasError &&
                !isPartial &&
                !isWaitingForConfirmation &&
                !isSentToBackground &&
                !isWakeUpBackground &&
                !isWaitingForRemote &&
                !isDeferred &&
                !isConfirmedByUser &&
                (() => {
                  const doneBadge = definition?.statusBadge?.done;
                  if (doneBadge) {
                    const scopedT =
                      definition.scopedTranslation.scopedT(locale);
                    return (
                      <Span
                        className={`text-xs px-2 py-0.5 rounded-full ${doneBadge.color}`}
                      >
                        {scopedT.t(doneBadge.label)}
                      </Span>
                    );
                  }
                  return (
                    <Span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                      {t("widgets.toolCall.status.complete")}
                    </Span>
                  );
                })()}
            </Div>
          </Div>
        </CollapsibleTrigger>

        {/* Content */}
        <CollapsibleContent>
          <Div className="border-t border-border/50 bg-card">
            {/* Deferred result notice */}
            {isDeferred && (
              <Div className="flex items-center gap-2 px-3 py-2 text-xs text-purple-500 bg-purple-500/5 border-b border-purple-500/10">
                <Span>{t("widgets.toolCall.messages.deferredResult")}</Span>
              </Div>
            )}
            {/* Loading State - show spinner, and endpoint with input data if available */}
            {/* When isPartial with result data, skip this - definition-driven rendering below handles it */}
            {isLoading && !isPartial && (
              <>
                <Div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <Span>{t("widgets.toolCall.messages.executingTool")}</Span>
                </Div>
                {definition &&
                  toolCall.args &&
                  typeof toolCall.args === "object" &&
                  !Array.isArray(toolCall.args) && (
                    <Div className="p-4 pt-0">
                      <NavigationStackProvider>
                        <EndpointRenderer
                          user={user}
                          endpoint={definition}
                          locale={locale}
                          data={toolCall.args}
                          logger={logger}
                          disabled={true}
                          response={undefined}
                          platform={loadPlatform}
                        />
                      </NavigationStackProvider>
                    </Div>
                  )}
              </>
            )}

            {/* Error State - Check if it's a declined tool (has args) or a real error */}
            {hasError &&
              (!toolCall.args ||
                typeof toolCall.args !== "object" ||
                Array.isArray(toolCall.args)) && (
                <Div className="p-4">
                  <Div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                    <Div className="flex items-start gap-2">
                      <Span className="text-destructive text-sm font-medium">
                        {t("widgets.toolCall.messages.errorLabel")}
                      </Span>
                      <Span className="text-destructive text-sm">
                        {getErrorMessage()}
                      </Span>
                    </Div>
                  </Div>
                </Div>
              )}

            {/* Loading spinner: definition not yet loaded but confirmation needed */}
            {!isLoading && isWaitingForConfirmation && !definition && (
              <Div className="p-4 flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <Span className="text-sm">
                  {t("widgets.toolCall.status.executing")}
                </Span>
              </Div>
            )}

            {/* Definition-Driven Rendering - handles waiting, completed, partial, and declined states */}
            {(!isLoading || isPartial) &&
              definition &&
              (hasError
                ? // Declined state - show form fields disabled with error message
                  toolCall.args &&
                  typeof toolCall.args === "object" &&
                  !Array.isArray(toolCall.args)
                : // Normal states - waiting or completed
                  !hasError) &&
              (() => {
                // Safely merge args and result - only spread if they're objects
                const argsObj =
                  toolCall.args &&
                  typeof toolCall.args === "object" &&
                  !Array.isArray(toolCall.args)
                    ? toolCall.args
                    : {};
                // Parse string results (backwards compat: old DB rows may have stringified results)
                let resultObj: { [key: string]: WidgetData } = {};
                if (toolCall.result) {
                  if (
                    typeof toolCall.result === "object" &&
                    !Array.isArray(toolCall.result) &&
                    !(toolCall.result instanceof Date)
                  ) {
                    resultObj = toolCall.result;
                  } else if (typeof toolCall.result === "string") {
                    try {
                      const parsed = JSON.parse(toolCall.result) as WidgetData;
                      if (
                        parsed &&
                        typeof parsed === "object" &&
                        !Array.isArray(parsed) &&
                        !(parsed instanceof Date)
                      ) {
                        resultObj = parsed;
                      }
                    } catch {
                      // Not valid JSON string - leave empty
                    }
                  }
                }
                const mergedData = { ...argsObj, ...resultObj };

                // Determine state:
                // - Waiting for confirmation: editable form with confirm/cancel buttons
                // - Declined: disabled form with error message, no buttons
                // - Complete: read-only display
                const isDeclined = Boolean(hasError && toolCall.args);
                const needsConfirmation =
                  isWaitingForConfirmation && !isDeclined;

                const handleConfirm = (formData: FieldValues): void => {
                  // Batch mode: call provided handler (allows changing choice)
                  if (batchOnConfirm) {
                    batchOnConfirm(formData);
                    return;
                  }

                  // Individual mode: submit immediately
                  if (!sendMessage) {
                    return;
                  }
                  const argsRecord: Record<
                    string,
                    string | number | boolean | null
                  > = {};
                  for (const [key, value] of Object.entries(formData)) {
                    if (
                      typeof value === "string" ||
                      typeof value === "number" ||
                      typeof value === "boolean" ||
                      value === null
                    ) {
                      argsRecord[key] = value;
                    }
                  }
                  sendMessage({
                    content: "",
                    attachments: [],
                    threadId,
                    parentId: parentId ?? messageId,
                    toolConfirmations: [
                      {
                        messageId,
                        confirmed: true,
                        updatedArgs: argsRecord,
                      },
                    ],
                  });
                };

                const handleCancel = (): void => {
                  // Batch mode: call provided handler (allows changing choice)
                  if (batchOnCancel) {
                    batchOnCancel();
                    return;
                  }

                  // Individual mode: submit immediately
                  if (!sendMessage) {
                    return;
                  }
                  sendMessage({
                    content: "",
                    attachments: [],
                    threadId,
                    parentId: parentId ?? messageId,
                    toolConfirmations: [
                      {
                        messageId,
                        confirmed: false,
                      },
                    ],
                  });
                };

                // Determine if tool has a pending decision in batch mode
                const isPendingConfirm = decision?.type === "confirmed";
                const isPendingCancel = decision?.type === "declined";
                const hasPendingDecision = isPendingConfirm || isPendingCancel;

                // For GET endpoints in confirmation mode: use EndpointsPage so the endpoint
                // can auto-fetch its data (respecting its own queryOptions defaults).
                // We render our own Confirm/Cancel buttons - do NOT pass them to EndpointsPage
                // to avoid triggering an actual API mutation on confirm.
                const isGetConfirmation =
                  needsConfirmation && definition.method === "GET";

                // Build confirm handler from current confirmationForm values
                const handleConfirmFromForm = (): void => {
                  handleConfirm(confirmationForm.getValues());
                };

                return (
                  <Div
                    className="p-4 space-y-4"
                    data-tool-editable={needsConfirmation}
                  >
                    {/* Show pending confirmation banner */}
                    {isWaitingForConfirmation && isPendingConfirm && (
                      <Div className="rounded-md bg-success/10 border border-success/20 p-3">
                        <Span className="text-success dark:text-success text-sm font-medium">
                          {t("widgets.toolCall.status.pendingConfirmation")}
                        </Span>
                      </Div>
                    )}

                    {/* Show pending cancellation banner */}
                    {isWaitingForConfirmation && isPendingCancel && (
                      <Div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                        <Span className="text-destructive dark:text-destructive text-sm font-medium">
                          {t("widgets.toolCall.status.pendingCancellation")}
                        </Span>
                      </Div>
                    )}

                    {/* Show waiting for confirmation banner (no decision yet) - includes Confirm/Cancel buttons */}
                    {isWaitingForConfirmation &&
                      !isDeclined &&
                      !hasPendingDecision && (
                        <Div className="rounded-md bg-warning/10 border border-warning/20 p-3 flex items-center justify-between gap-3 flex-wrap">
                          <Span className="text-warning text-sm font-medium">
                            {t(
                              isWakeUpBackground
                                ? "widgets.toolCall.messages.confirmationRequiredWakeUp"
                                : "widgets.toolCall.messages.confirmationRequired",
                            )}
                          </Span>
                          <Div className="flex gap-2 shrink-0">
                            <Button
                              type="button"
                              size="sm"
                              variant="default"
                              onClick={handleConfirmFromForm}
                              data-testid="tool-confirm-button"
                              aria-label={t("widgets.toolCall.actions.confirm")}
                            >
                              {t("widgets.toolCall.actions.confirm")}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              data-testid="tool-deny-button"
                              aria-label={t("widgets.toolCall.actions.deny")}
                            >
                              {t("widgets.toolCall.actions.deny")}
                            </Button>
                          </Div>
                        </Div>
                      )}

                    {/* Show error banner when tool was declined */}
                    {isDeclined && (
                      <Div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                        <Span className="text-destructive text-sm font-medium">
                          {getErrorMessage()}
                        </Span>
                      </Div>
                    )}

                    {/* GET endpoints: use EndpointsPage so auto-fetch works.
                        Widget submit is also wired to handleConfirmFromForm via onSubmit override.
                        Real API is NOT called - confirm goes through sendMessage. */}
                    {isGetConfirmation ? (
                      <EndpointsPage
                        endpoint={{ GET: definition }}
                        locale={locale}
                        user={user}
                        platform={loadPlatform}
                        endpointOptions={{
                          read: {
                            urlPathParams: argsObj as never,
                          },
                        }}
                      />
                    ) : (
                      /* POST/PATCH/PUT/DELETE and completed/declined: EndpointRenderer with
                         confirmationForm - submit calls handleConfirm (sendMessage), not real API */
                      <NavigationStackProvider>
                        <EndpointRenderer
                          user={user}
                          endpoint={definition}
                          locale={locale}
                          data={mergedData}
                          logger={logger}
                          platform={loadPlatform}
                          disabled={!needsConfirmation || hasPendingDecision}
                          form={
                            needsConfirmation || isDeclined
                              ? confirmationForm
                              : undefined
                          }
                          onSubmit={
                            needsConfirmation ? handleConfirm : undefined
                          }
                          onCancel={
                            needsConfirmation ? handleCancel : undefined
                          }
                          submitButton={
                            needsConfirmation
                              ? {
                                  text: "widgets.toolCall.actions.confirm" satisfies ReactHooksTranslationKey,
                                  variant:
                                    decision?.type === "confirmed"
                                      ? "default"
                                      : decision?.type === "declined"
                                        ? "ghost"
                                        : "default",
                                }
                              : undefined
                          }
                          cancelButton={
                            needsConfirmation
                              ? {
                                  variant:
                                    decision?.type === "declined"
                                      ? "destructive"
                                      : "outline",
                                }
                              : undefined
                          }
                          response={
                            resultObj && Object.keys(resultObj).length > 0
                              ? { success: true as const, data: resultObj }
                              : undefined
                          }
                        />
                      </NavigationStackProvider>
                    )}
                  </Div>
                );
              })()}
          </Div>
        </CollapsibleContent>
      </Collapsible>
    </Div>
  );
}
