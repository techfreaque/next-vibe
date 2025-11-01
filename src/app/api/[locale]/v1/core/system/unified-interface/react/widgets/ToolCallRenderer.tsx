/**
 * Tool Call Renderer Component
 * Unified component for rendering tool calls using definition-driven UI
 *
 * This component:
 * 1. Loads endpoint definition from registry
 * 2. Renders request fields (args) as read-only display
 * 3. Renders response fields (result) using WidgetRenderer
 * 4. Handles loading/error states
 * 5. Works for ANY endpoint, not just search
 *
 * Design Principles:
 * - Zero hardcoded tool-specific logic
 * - Reuses existing widgets from unified-interface
 * - Platform-consistent with CLI/forms
 * - Definition-driven UI
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
import { useState } from "react";

import type { ToolCall } from "@/app/api/[locale]/v1/core/agent/chat/db";
import type { WidgetRenderContext } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/ui/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { RequestFieldsRenderer } from "./RequestFieldsRenderer";
import { ResponseFieldsRenderer } from "./ResponseFieldsRenderer";

interface ToolCallRendererProps {
  toolCall: ToolCall;
  locale: CountryLanguage;
  context: WidgetRenderContext;
  defaultOpen?: boolean;
}

/**
 * Tool Call Renderer Component
 * Main component that orchestrates tool call rendering
 */
export function ToolCallRenderer({
  toolCall,
  locale,
  context,
  defaultOpen = false,
}: ToolCallRendererProps): JSX.Element {
  const { t } = simpleT(locale);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(true);

  // Determine tool call state
  const hasResult = Boolean(toolCall.result);
  const hasError = Boolean(toolCall.error);
  const isLoading = !hasResult && !hasError;

  // Get display name
  const displayName = toolCall.displayName || toolCall.toolName;

  // Get credits display
  const creditsDisplay = toolCall.creditsUsed
    ? `${toolCall.creditsUsed} credits`
    : null;

  return (
    <Div
      className={cn(
        "rounded-lg border border-border/50 bg-muted/30 overflow-hidden",
        "transition-all duration-200",
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Header */}
        <CollapsibleTrigger asChild>
          <Div
            className={cn(
              "flex items-center justify-between p-3 cursor-pointer",
              "hover:bg-muted/50 transition-colors",
            )}
          >
            <Div className="flex items-center gap-2">
              {/* Expand/Collapse Icon */}
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}

              {/* Tool Icon */}
              {toolCall.icon && (
                <Span className="text-lg">{toolCall.icon}</Span>
              )}

              {/* Tool Name */}
              <Span className="font-medium text-sm">{displayName}</Span>

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
                  {t("app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.status.error")}
                </Span>
              )}
              {isLoading && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  {t("app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.status.executing")}
                </Span>
              )}
              {hasResult && !hasError && (
                <Span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                  {t("app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.status.complete")}
                </Span>
              )}
            </Div>
          </Div>
        </CollapsibleTrigger>

        {/* Content */}
        <CollapsibleContent>
          <Div className="border-t border-border/50 p-3 space-y-3">
            {/* Request Fields (Arguments) */}
            {toolCall.args && Object.keys(toolCall.args).length > 0 && (
              <Div className="space-y-2">
                <Collapsible
                  open={isRequestOpen}
                  onOpenChange={setIsRequestOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      {isRequestOpen ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                      <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {t("app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.sections.request")}
                      </Span>
                    </Div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Div className="mt-2">
                      <RequestFieldsRenderer
                        args={toolCall.args}
                        locale={locale}
                        context={context}
                      />
                    </Div>
                  </CollapsibleContent>
                </Collapsible>
              </Div>
            )}

            {/* Loading State */}
            {isLoading && (
              <Div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <Span>{t("app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.messages.executingTool")}</Span>
              </Div>
            )}

            {/* Error State */}
            {hasError && (
              <Div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                <Div className="flex items-start gap-2">
                  <Span className="text-destructive text-sm font-medium">
                    {t("app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.messages.errorLabel")}
                  </Span>
                  <Span className="text-destructive text-sm">
                    {toolCall.error}
                  </Span>
                </Div>
              </Div>
            )}

            {/* Response Fields (Result) */}
            {hasResult && !hasError && (
              <Div className="space-y-2">
                <Collapsible
                  open={isResponseOpen}
                  onOpenChange={setIsResponseOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      {isResponseOpen ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                      <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {t("app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.sections.response")}
                      </Span>
                    </Div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Div className="mt-2">
                      <ResponseFieldsRenderer
                        result={toolCall.result}
                        widgetMetadata={toolCall.widgetMetadata}
                        locale={locale}
                        context={context}
                      />
                    </Div>
                  </CollapsibleContent>
                </Collapsible>
              </Div>
            )}
          </Div>
        </CollapsibleContent>
      </Collapsible>
    </Div>
  );
}

