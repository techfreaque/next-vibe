/**
 * Tool Call Item
 * Individual tool call display with result rendering
 */

"use client";

import { Div, Span } from "next-vibe-ui/ui";
import { Search } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";

import type { ToolCall } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { FieldDataType } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { ResponseFieldMetadata } from "@/app/api/[locale]/v1/core/system/unified-ui/shared/widgets/cli/types";
import { WidgetRenderer } from "@/app/api/[locale]/v1/core/system/unified-ui/shared/widgets/react/WidgetRenderer";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { createChatWidgetContext } from "../../lib/widget-context";

interface ToolCallItemProps {
  toolCall: ToolCall;
  locale: CountryLanguage;
}

/**
 * Render tool icon
 */
function ToolIcon({ toolCall }: { toolCall: ToolCall }): JSX.Element {
  if (toolCall.icon) {
    return <Span className="text-blue-400">{toolCall.icon}</Span>;
  }

  if (toolCall.toolName === "search") {
    return <Search className="h-4 w-4 text-blue-400" />;
  }

  // eslint-disable-next-line i18next/no-literal-string
  return <Span className="text-blue-400">🔧</Span>;
}

/**
 * Render tool header with metadata
 */
function ToolHeader({ toolCall }: { toolCall: ToolCall }): JSX.Element {
  return (
    <Div className="flex items-start gap-2 px-3 py-2 border-b border-border/50">
      <Div className="shrink-0 mt-0.5">
        <ToolIcon toolCall={toolCall} />
      </Div>
      <Div className="flex-1 min-w-0">
        <Div className="font-medium text-blue-400">
          {toolCall.displayName || toolCall.toolName}
        </Div>
        {toolCall.executionTime && (
          <Div className="text-muted-foreground text-xs mt-1">
            {toolCall.executionTime}ms
          </Div>
        )}
        {toolCall.creditsUsed !== undefined && toolCall.creditsUsed > 0 && (
          <Div className="text-muted-foreground text-xs mt-1">
            {toolCall.creditsUsed} credits
          </Div>
        )}
      </Div>
    </Div>
  );
}

/**
 * Render tool result with widget system
 */
function ToolResult({
  toolCall,
  locale,
}: {
  toolCall: ToolCall;
  locale: CountryLanguage;
}): JSX.Element | null {
  if (!toolCall.result) {
    return null;
  }

  // Check if we have widget metadata
  if (
    toolCall.widgetMetadata &&
    toolCall.widgetMetadata.responseFields.length > 0
  ) {
    return (
      <Div className="p-3">
        <Div className="space-y-3">
          {toolCall.widgetMetadata.responseFields.map((field, fieldIndex) => {
            // Create ResponseFieldMetadata from the stored metadata
            const fieldMetadata: ResponseFieldMetadata = {
              name: field.name,
              type: FieldDataType.TEXT,
              widgetType: field.widgetType,
              value: toolCall.result,
              label: field.label,
              description: field.description,
              config: field.layout,
            };

            return (
              <WidgetRenderer
                key={fieldIndex}
                widgetType={field.widgetType}
                data={toolCall.result}
                metadata={fieldMetadata}
                context={createChatWidgetContext(locale)}
              />
            );
          })}
        </Div>
      </Div>
    );
  }

  // Fallback to JSON display
  return (
    <Div className="p-3">
      <pre className="text-xs overflow-x-auto text-muted-foreground">
        {JSON.stringify(toolCall.result, null, 2)}
      </pre>
    </Div>
  );
}

/**
 * Render tool error
 */
function ToolError({
  toolCall,
  locale,
}: {
  toolCall: ToolCall;
  locale: CountryLanguage;
}): JSX.Element | null {
  if (!toolCall.error) {
    return null;
  }

  const { t } = simpleT(locale);

  return (
    <Div className="p-3 bg-red-500/10 border-t border-red-500/20">
      <Div className="text-sm font-medium text-red-400">
        {t("app.chat.errors.unexpectedError")}
      </Div>
      <Div className="text-xs text-red-300 mt-1">{toolCall.error}</Div>
    </Div>
  );
}

/**
 * Tool Call Item Component
 * Renders a single tool call with its result
 */
export function ToolCallItem({
  toolCall,
  locale,
}: ToolCallItemProps): JSX.Element {
  return (
    <Div className="rounded-md bg-background/50 border border-border/50">
      <ToolHeader toolCall={toolCall} />
      <ToolResult toolCall={toolCall} locale={locale} />
      <ToolError toolCall={toolCall} locale={locale} />
    </Div>
  );
}
