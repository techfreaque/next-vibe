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

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div, type DivMouseEvent } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { X } from "next-vibe-ui/ui/icons/X";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { SendMessageParams } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/send-message";
import type {
  ToolCall,
  ToolCallResult,
} from "@/app/api/[locale]/agent/chat/db";
import { pathToAliasMap } from "@/app/api/[locale]/system/generated/alias-map";
import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import { definitionLoader } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/loader";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { endpoints as cronIdEndpoints } from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/definition";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { NavigationStackProvider } from "../../../react/hooks/use-navigation-stack";
import {
  type ReactTranslationKey,
  scopedTranslation as reactScopedTranslation,
} from "../../../react/i18n";
import { EndpointRenderer } from "./EndpointRenderer";
import { EndpointsPage } from "./EndpointsPage";

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
  const { t: globalT } = simpleT(locale);
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

  // Update isOpen when decision changes
  useEffect(() => {
    if (decision && decision.type !== "pending") {
      setIsOpen(false);
    }
  }, [decision]);

  const [definition, setDefinition] = useState<CreateApiEndpointAny | null>(
    null,
  );
  // For execute-tool: resolve the child endpoint's definition for title/icon
  const [childDefinition, setChildDefinition] =
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
      }
    };
    void loadDef();
  }, [toolCall.toolName, definition, tryLoadIdentifier]);

  // Separate effect: load child definition for execute-tool once parent + args are available.
  // Runs whenever args change so it picks up toolName even if args arrived after definition.
  useEffect(() => {
    if (!definition?.aliases?.includes("execute-tool")) {
      return;
    }
    const args = toolCall.args;
    const childToolName =
      args && typeof args === "object" && "toolName" in args
        ? (args as Record<string, string>).toolName
        : undefined;
    if (!childToolName) {
      return;
    }

    const loadChild = async (): Promise<void> => {
      const childResult = await tryLoadIdentifier(childToolName);
      if (childResult.success) {
        setChildDefinition(childResult.data);
      }
    };
    void loadChild();
  }, [definition, toolCall.args, tryLoadIdentifier]);

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
    !hasResult &&
    !hasError &&
    !isWaitingForConfirmation &&
    !isTerminalStatus &&
    !isSentToBackground &&
    !isWakeUpBackground &&
    !isWaitingForRemote &&
    !isConfirmedByUser;

  /** Extract a displayable error message from toolCall.error or toolCall.result (when it's an ErrorResponseType) */
  const getErrorMessage = (): string => {
    // Primary: toolCall.error is ErrorResponseType with typed TranslationKey message
    const err = toolCall.error;
    if (err) {
      return globalT(
        err.message,
        err.messageParams as Record<string, string | number> | undefined,
      );
    }
    // Fallback: toolCall.result is an ErrorResponseType (tool returned fail() without throwing).
    // Display the raw message string - it may be a translation key but ToolCallResult
    // doesn't carry TranslationKey typing, so we display as-is.
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

  const handleCopyJson = (e: DivMouseEvent): void => {
    e.stopPropagation();
    const payload: {
      request?: ToolCall["args"];
      response?: ToolCall["result"];
      error?: ToolCall["error"];
    } = {};
    if (toolCall.args) {
      payload.request = toolCall.args;
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
    void navigator.clipboard.writeText(text).then(() => {
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

  // Resolve display title: for execute-tool, prefer child endpoint's title/icon
  const resolveDisplay = (): {
    displayName: string;
    icon: IconKey | undefined;
  } => {
    // When execute-tool wraps a child endpoint, use the child's title/icon
    if (childDefinition) {
      const childScopedT = childDefinition.scopedTranslation.scopedT(locale);

      // Try child's dynamicTitle with the execute-tool's input (child's request data)
      const childDynamicFn = childDefinition.dynamicTitle as
        | DynamicTitleFn
        | undefined;
      const childInput =
        toolCall.args &&
        typeof toolCall.args === "object" &&
        "input" in toolCall.args
          ? (toolCall.args as Record<string, ToolCall["args"]>).input
          : undefined;
      const childResponse =
        toolCall.result &&
        typeof toolCall.result === "object" &&
        "data" in toolCall.result
          ? (toolCall.result as Record<string, ToolCall["result"]>).data
          : toolCall.result;
      const childDynamic = childDynamicFn
        ? childDynamicFn({
            request:
              childInput && typeof childInput === "object"
                ? childInput
                : undefined,
            response:
              childResponse && typeof childResponse === "object"
                ? childResponse
                : undefined,
          })
        : undefined;

      if (childDynamic) {
        return {
          displayName:
            childScopedT.t(childDynamic.message, childDynamic.messageParams) ??
            toolCall.toolName,
          icon: childDefinition.icon,
        };
      }

      // Fall back to child's static title
      const childTitle = childDefinition.title
        ? childScopedT.t(childDefinition.title)
        : undefined;
      if (childTitle) {
        return { displayName: childTitle, icon: childDefinition.icon };
      }
    }

    // Standard path: use this definition's own title
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

    return {
      displayName: dynamicResult
        ? (scopedT?.t(dynamicResult.message, dynamicResult.messageParams) ??
          staticTitle ??
          toolCall.toolName)
        : (staticTitle ?? toolCall.toolName),
      icon: definition?.icon,
    };
  };

  const { displayName, icon } = resolveDisplay();
  const credits = definition?.credits ?? toolCall.creditsUsed ?? 0;
  const creditsDisplay = credits
    ? globalT(
        credits === 1
          ? "app.chat.toolCall.creditsUsed_one"
          : "app.chat.toolCall.creditsUsed_other",
        { cost: credits },
      )
    : null;

  return (
    <Div
      className={cn(
        "rounded-lg border border-border/50 bg-muted overflow-hidden",
        "transition-all duration-200",
      )}
    >
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
                <Span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                  {t(
                    isWakeUpBackground
                      ? "widgets.toolCall.status.deniedWakeUp"
                      : "widgets.toolCall.status.denied",
                  )}
                </Span>
              )}
              {isWaitingForConfirmation && decision?.type === "confirmed" && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
                  {t("widgets.toolCall.status.pendingConfirmation")}
                </Span>
              )}
              {isWaitingForConfirmation && decision?.type === "declined" && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-500">
                  {t("widgets.toolCall.status.pendingCancellation")}
                </Span>
              )}
              {isWaitingForConfirmation &&
                (!decision || decision.type === "pending") && (
                  <Span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500">
                    {t(
                      isWakeUpBackground
                        ? "widgets.toolCall.status.waitingForConfirmationWakeUp"
                        : "widgets.toolCall.status.waitingForConfirmation",
                    )}
                  </Span>
                )}
              {isLoading && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  {t("widgets.toolCall.status.executing")}
                </Span>
              )}
              {isSentToBackground && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
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
                <Span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
                  {t("widgets.toolCall.status.waitingForRemote")}
                </Span>
              )}
              {isConfirmedByUser && !isWakeUpBackground && !isDeniedByUser && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
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
                !isWaitingForConfirmation &&
                !isSentToBackground &&
                !isWakeUpBackground &&
                !isWaitingForRemote &&
                !isDeferred &&
                !isConfirmedByUser && (
                  <Span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                    {t("widgets.toolCall.status.complete")}
                  </Span>
                )}
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
            {isLoading && (
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

            {/* Definition-Driven Rendering - handles waiting, completed, and declined states */}
            {!isLoading &&
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
                let resultObj: { [key: string]: ToolCallResult } = {};
                if (toolCall.result) {
                  if (
                    typeof toolCall.result === "object" &&
                    !Array.isArray(toolCall.result)
                  ) {
                    resultObj = toolCall.result;
                  } else if (typeof toolCall.result === "string") {
                    try {
                      const parsed = JSON.parse(
                        toolCall.result,
                      ) as ToolCallResult;
                      if (
                        parsed &&
                        typeof parsed === "object" &&
                        !Array.isArray(parsed)
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
                      <Div className="rounded-md bg-green-500/10 border border-green-500/20 p-3">
                        <Span className="text-green-600 dark:text-green-500 text-sm font-medium">
                          {t("widgets.toolCall.status.pendingConfirmation")}
                        </Span>
                      </Div>
                    )}

                    {/* Show pending cancellation banner */}
                    {isWaitingForConfirmation && isPendingCancel && (
                      <Div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
                        <Span className="text-red-600 dark:text-red-500 text-sm font-medium">
                          {t("widgets.toolCall.status.pendingCancellation")}
                        </Span>
                      </Div>
                    )}

                    {/* Show waiting for confirmation banner (no decision yet) - includes Confirm/Cancel buttons */}
                    {isWaitingForConfirmation &&
                      !isDeclined &&
                      !hasPendingDecision && (
                        <Div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3 flex items-center justify-between gap-3 flex-wrap">
                          <Span className="text-amber-600 dark:text-amber-500 text-sm font-medium">
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
                                  text: "widgets.toolCall.actions.confirm" satisfies ReactTranslationKey,
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
