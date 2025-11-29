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

import { cn } from "next-vibe/shared/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { ChevronDown, ChevronRight, Loader2 } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import { useState, useEffect } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { ToolCall } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { getIconComponent } from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import type { WidgetRenderContext } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/types";
import { definitionLoader } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/loader";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/platform";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { EndpointRenderer } from "./EndpointRenderer";
import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";

interface ToolCallRendererProps {
  toolCall: ToolCall;
  locale: CountryLanguage;
  context: WidgetRenderContext;
  defaultOpen?: boolean;
  threadId: string;
  messageId: string;
  toolIndex?: number;
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
}

/**
 * Tool Call Renderer Component
 * Main component that orchestrates tool call rendering
 */
export function ToolCallRenderer({
  toolCall,
  locale,
  context: _context,
  defaultOpen = false,
  threadId,
  messageId,
  toolIndex = 0,
  collapseState,
}: ToolCallRendererProps): JSX.Element {
  const { t } = simpleT(locale);
  const { sendMessage } = useChatContext();

  const [definition, setDefinition] = useState<CreateApiEndpointAny | null>(
    null,
  );
  const [_isLoadingDef, setIsLoadingDef] = useState(true);

  // Create a form for managing the tool parameters when waiting for confirmation
  const confirmationForm = useForm<FieldValues>({
    defaultValues:
      toolCall.args && typeof toolCall.args === "object" ? toolCall.args : {},
  });

  useEffect(() => {
    const loadDef = async (): Promise<void> => {
      // toolCall.toolName comes from AI SDK, which uses path_with_underscores format
      // We need to try multiple formats to find the definition:
      // 1. As-is (might be an alias like "search")
      // 2. Convert underscores to slashes + /GET
      // 3. Convert underscores to slashes + /POST

      const logger = createEndpointLogger(true, Date.now(), locale);

      logger.debug("[ToolCallRenderer] Loading definition", {
        toolName: toolCall.toolName,
      });

      const { createPublicUser } =
        await import("@/app/api/[locale]/v1/core/user/auth/helpers");
      const user = createPublicUser(crypto.randomUUID());

      let result = await definitionLoader.load({
        identifier: toolCall.toolName,
        platform: Platform.NEXT_PAGE,
        user,
        logger,
      });

      logger.debug("[ToolCallRenderer] First attempt", {
        success: result.success,
        identifier: toolCall.toolName,
      });

      if (!result.success && toolCall.toolName.includes("_")) {
        const convertedPath = `${toolCall.toolName.replace(/_/g, "/")}/GET`;
        logger.debug("[ToolCallRenderer] Trying converted GET path", {
          convertedPath,
        });
        result = await definitionLoader.load({
          identifier: convertedPath,
          platform: Platform.NEXT_PAGE,
          user,
          logger,
        });
        logger.debug("[ToolCallRenderer] Converted GET result", {
          success: result.success,
        });
      }

      if (!result.success && toolCall.toolName.includes("_")) {
        const convertedPath = `${toolCall.toolName.replace(/_/g, "/")}/POST`;
        logger.debug("[ToolCallRenderer] Trying converted POST path", {
          convertedPath,
        });
        result = await definitionLoader.load({
          identifier: convertedPath,
          platform: Platform.NEXT_PAGE,
          user,
          logger,
        });
        logger.debug("[ToolCallRenderer] Converted POST result", {
          success: result.success,
        });
      }

      if (result.success) {
        logger.info("[ToolCallRenderer] Definition loaded", {
          hasFields: !!result.data.fields,
          fieldsType: typeof result.data.fields,
        });
        setDefinition(result.data);
      } else {
        logger.error("[ToolCallRenderer] Failed to load definition", {
          message: result.message,
        });
      }
      setIsLoadingDef(false);
    };
    void loadDef();
  }, [toolCall.toolName, locale]);

  const hasResult = Boolean(toolCall.result);
  const hasError = Boolean(toolCall.error);
  const isWaitingForConfirmation = Boolean(toolCall.waitingForConfirmation);
  const isLoading = !hasResult && !hasError && !isWaitingForConfirmation;

  const getIsOpen = (): boolean => {
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
  const [wasWaitingForConfirmation, setWasWaitingForConfirmation] = useState(
    isWaitingForConfirmation,
  );

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

  const displayName = definition?.title
    ? t(definition.title)
    : toolCall.toolName;
  const icon = definition?.aiTool?.icon;
  const credits = definition?.credits ?? toolCall.creditsUsed ?? 0;
  const creditsDisplay = credits
    ? t("app.chat.toolCall.creditsUsed", { count: credits })
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
                {icon &&
                  (() => {
                    const IconComponent = getIconComponent(icon);
                    return (
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    );
                  })()}
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
              {hasError && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  {t(
                    "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.status.error",
                  )}
                </Span>
              )}
              {isWaitingForConfirmation && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500">
                  {t(
                    "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.status.waitingForConfirmation",
                  )}
                </Span>
              )}
              {isLoading && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  {t(
                    "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.status.executing",
                  )}
                </Span>
              )}
              {hasResult && !hasError && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                  {t(
                    "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.status.complete",
                  )}
                </Span>
              )}
            </Div>
          </Div>
        </CollapsibleTrigger>

        {/* Content */}
        <CollapsibleContent>
          <Div className="border-t border-border/50 bg-card">
            {/* Loading State */}
            {isLoading && (
              <Div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <Span>
                  {t(
                    "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.messages.executingTool",
                  )}
                </Span>
              </Div>
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
                        {t(
                          "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.messages.errorLabel",
                        )}
                      </Span>
                      <Span className="text-destructive text-sm">
                        {toolCall.error}
                      </Span>
                    </Div>
                  </Div>
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
                const resultObj =
                  toolCall.result &&
                  typeof toolCall.result === "object" &&
                  !Array.isArray(toolCall.result)
                    ? toolCall.result
                    : {};
                const mergedData = { ...argsObj, ...resultObj };

                // Determine state:
                // - Waiting for confirmation: editable form with confirm/cancel buttons
                // - Declined: disabled form with error message, no buttons
                // - Complete: read-only display
                const isDeclined = Boolean(hasError && toolCall.args);
                const isEditable = isWaitingForConfirmation && !isDeclined;
                const needsConfirmation =
                  isWaitingForConfirmation && !isDeclined;

                const handleConfirm = (formData: FieldValues): void => {
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
                    threadId,
                    parentId: messageId,
                    toolConfirmation: {
                      messageId,
                      confirmed: true,
                      updatedArgs: argsRecord,
                    },
                  });
                };

                const handleCancel = (): void => {
                  sendMessage({
                    content: "",
                    threadId,
                    parentId: messageId,
                    toolConfirmation: {
                      messageId,
                      confirmed: false,
                    },
                  });
                };

                // Use EndpointRenderer for 100% definition-driven rendering
                return (
                  <Div
                    className="p-4 space-y-4"
                    data-tool-editable={isEditable}
                  >
                    {/* Show info banner when waiting for confirmation */}
                    {isWaitingForConfirmation && !isDeclined && (
                      <Div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
                        <Span className="text-amber-600 dark:text-amber-500 text-sm font-medium">
                          {t(
                            "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.messages.confirmationRequired",
                          )}
                        </Span>
                      </Div>
                    )}

                    {/* Show error banner when tool was declined */}
                    {isDeclined && (
                      <Div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                        <Span className="text-destructive text-sm font-medium">
                          {toolCall.error}
                        </Span>
                      </Div>
                    )}

                    <EndpointRenderer
                      endpoint={definition}
                      locale={locale}
                      data={mergedData}
                      disabled={!isEditable || isDeclined}
                      form={needsConfirmation ? confirmationForm : undefined}
                      onSubmit={needsConfirmation ? handleConfirm : undefined}
                      onCancel={needsConfirmation ? handleCancel : undefined}
                      submitButtonText={
                        needsConfirmation
                          ? "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.actions.confirm"
                          : undefined
                      }
                    />
                  </Div>
                );
              })()}
          </Div>
        </CollapsibleContent>
      </Collapsible>
    </Div>
  );
}
