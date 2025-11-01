"use client";

import { cn } from "next-vibe/shared/utils";
import { Collapsible } from "next-vibe-ui//ui/collapsible";
import { CollapsibleContent } from "next-vibe-ui//ui/collapsible";
import { CollapsibleTrigger } from "next-vibe-ui//ui/collapsible";
import { Div } from "next-vibe-ui//ui/div";
import { Pre } from "next-vibe-ui//ui/pre";
import { Span } from "next-vibe-ui//ui/span";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

import type {
  ToolCall,
  ToolCallResult,
} from "@/app/api/[locale]/v1/core/agent/chat/db";
import type { ResponseFieldMetadata } from "@/app/api/[locale]/v1/core/system/unified-interface/cli/widgets/types";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LinkListWidget } from "../react/widgets/LinkListWidget";
import type { WidgetRenderContext } from "../shared/ui/types";

interface ToolCallRendererProps {
  toolCalls: ToolCall[];
  locale: CountryLanguage;
  hasContent?: boolean;
}

/**
 * Get summary from tool arguments
 */
function getArgsSummary(args: ToolCallResult): string | null {
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    return null;
  }

  // Try common fields
  if ("query" in args && typeof args.query === "string") {
    return args.query;
  }

  // Get first string value
  const firstString = Object.values(args).find((v) => typeof v === "string");
  return firstString ? String(firstString) : null;
}

/**
 * Render tool result using data-driven widgets
 */
function renderToolResult(
  toolCall: ToolCall,
  locale: CountryLanguage,
  context: WidgetRenderContext,
): JSX.Element {
  const { t } = simpleT(locale);

  // If no result, show nothing
  if (!toolCall.result) {
    return <></>;
  }

  // Check if we have widget metadata for data-driven rendering
  const hasMetadata =
    toolCall.widgetMetadata?.responseFields &&
    toolCall.widgetMetadata.responseFields.length > 0;

  if (!hasMetadata) {
    // Fallback to JSON dump if no metadata
    return (
      <>
        <Div className="text-xs font-medium text-muted-foreground mb-1">
          {t("app.chat.toolCall.result")}:
        </Div>
        <Pre className="text-xs overflow-x-auto text-foreground/80 max-h-60">
          {JSON.stringify(toolCall.result, null, 2)}
        </Pre>
      </>
    );
  }

  // Render each field using its widget type
  return (
    <Div className="space-y-3">
      {toolCall.widgetMetadata!.responseFields.map((field) => {
        const fieldValue =
          toolCall.result?.[field.name as keyof typeof toolCall.result];

        // Skip if no value
        if (fieldValue === undefined || fieldValue === null) {
          return null;
        }

        // Create proper metadata structure
        const metadata: ResponseFieldMetadata = {
          name: field.name,
          type: FieldDataType.ARRAY,
          widgetType: field.widgetType,
          value: fieldValue,
          label: field.label,
          description: field.description,
        };

        // Handle different widget types
        switch (field.widgetType) {
          case WidgetType.LINK_LIST:
            // Search results - render as link list
            if (Array.isArray(fieldValue)) {
              return (
                <LinkListWidget
                  key={field.name}
                  data={{
                    items: fieldValue as Array<{
                      url: string;
                      title: string;
                      snippet?: string;
                      age?: string;
                      source?: string;
                    }>,
                    layout: "list",
                  }}
                  metadata={metadata}
                  context={context}
                />
              );
            }
            break;

          case WidgetType.GROUPED_LIST:
            // Grouped list - render as link list for search results
            if (Array.isArray(fieldValue)) {
              return (
                <LinkListWidget
                  key={field.name}
                  data={{
                    items: fieldValue as Array<{
                      url: string;
                      title: string;
                      snippet?: string;
                      age?: string;
                      source?: string;
                    }>,
                    layout: "list",
                  }}
                  metadata={metadata}
                  context={context}
                />
              );
            }
            break;

          default:
            // Fallback to JSON for other types
            return (
              <Div key={field.name} className="space-y-1">
                {field.label && (
                  <Span className="text-sm font-medium">{field.label}</Span>
                )}
                {field.description && (
                  <Span className="text-xs text-muted-foreground">
                    {field.description}
                  </Span>
                )}
                <Pre className="text-sm overflow-x-auto">
                  {JSON.stringify(fieldValue, null, 2)}
                </Pre>
              </Div>
            );
        }

        return null;
      })}
    </Div>
  );
}

/**
 * Tool Call Renderer Component
 * Renders tool calls using unified-interface widget system with dynamic definition loading from registry
 *
 * UX behavior:
 * - Tool calls are OPEN by default when there's no content after (user needs to see what happened)
 * - Tool calls are COLLAPSED by default when there's content after (reduce wall of text)
 * - Users can always toggle open/closed manually
 */
export function ToolCallRenderer({
  toolCalls,
  locale,
  hasContent = false,
}: ToolCallRendererProps): JSX.Element | null {
  const { t } = simpleT(locale);
  // Open by default when NO content after, collapsed when there IS content after
  const [isOpen, setIsOpen] = useState(!hasContent);

  if (!toolCalls || toolCalls.length === 0) {
    return null;
  }

  // Create widget render context
  const context: WidgetRenderContext = {
    locale,
    isInteractive: true,
    permissions: [],
    platform: "web",
  };

  // Get header title
  const getHeaderTitle = (): string => {
    if (toolCalls.length === 1 && toolCalls[0]) {
      const toolCall = toolCalls[0];

      if (toolCall.displayName) {
        return t(toolCall.displayName as Parameters<typeof t>[0]);
      }

      return toolCall.toolName;
    }

    return t("app.chat.toolCall.multiple", { count: toolCalls.length });
  };

  // Get summary for collapsed state
  const getSummary = (): string | null => {
    if (toolCalls.length === 1 && toolCalls[0]) {
      return getArgsSummary(toolCalls[0].args);
    }
    return null;
  };

  return (
    <Div className="mb-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Div
          className={cn(
            "rounded-lg border transition-all",
            isOpen
              ? "bg-blue-500/5 border-blue-500/30"
              : "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
          )}
        >
          {/* Header */}
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-400",
                "hover:bg-blue-500/5 transition-colors rounded-lg",
              )}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              <Span>{getHeaderTitle()}</Span>
              {!isOpen && getSummary() && (
                <Span className="text-muted-foreground text-xs truncate">
                  - {getSummary()}
                </Span>
              )}
            </button>
          </CollapsibleTrigger>

          {/* Content */}
          <CollapsibleContent>
            <Div className="space-y-3 p-3">
              {toolCalls.map((toolCall, index) => (
                <Div
                  key={index}
                  className="rounded-md bg-background/50 border border-border/50"
                >
                  {/* Tool Header */}
                  <Div className="px-3 py-2 border-b border-border/50">
                    <Div className="font-medium text-blue-400">
                      {toolCall.displayName
                        ? t(toolCall.displayName as Parameters<typeof t>[0])
                        : toolCall.toolName}
                    </Div>
                    {toolCall.creditsUsed !== undefined &&
                      toolCall.creditsUsed > 0 && (
                        <Div className="text-xs text-muted-foreground mt-1">
                          {toolCall.creditsUsed} credits
                        </Div>
                      )}
                  </Div>

                  {/* Arguments */}
                  {toolCall.args && (
                    <Div className="px-3 py-2 border-b border-border/50">
                      <Div className="text-xs font-medium text-muted-foreground mb-1">
                        {t("app.chat.toolCall.arguments")}:
                      </Div>
                      <Pre className="text-xs overflow-x-auto text-foreground/80">
                        {JSON.stringify(toolCall.args, null, 2)}
                      </Pre>
                    </Div>
                  )}

                  {/* Error */}
                  {toolCall.error && (
                    <Div className="px-3 py-2 bg-red-500/10 border-t border-red-500/20">
                      <Div className="text-xs font-medium text-red-400 mb-1">
                        {t("app.chat.toolCall.error")}:
                      </Div>
                      <Pre className="text-xs overflow-x-auto text-red-300">
                        {toolCall.error}
                      </Pre>
                    </Div>
                  )}

                  {/* Result - Render using data-driven widget system */}
                  {toolCall.result && (
                    <Div className="px-3 py-2">
                      {renderToolResult(toolCall, locale, context)}
                    </Div>
                  )}
                </Div>
              ))}
            </Div>
          </CollapsibleContent>
        </Div>
      </Collapsible>
    </Div>
  );
}
