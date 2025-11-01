"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { ToolCall } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { ToolCallRenderer } from "@/app/api/[locale]/v1/core/system/unified-interface/react/widgets/ToolCallRenderer";
import type { WidgetRenderContext } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/ui/types";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Tool Display Props
 */
interface ToolDisplayProps {
  /** Array of tool calls to display */
  toolCalls: ToolCall[];
  /** Current locale for translations */
  locale: CountryLanguage;
  /** Whether the message has content after tool calls (affects default open state) */
  hasContent?: boolean;
}

/**
 * Tool Display Component
 *
 * Renders tool calls using the unified-interface widget system via ToolCallRenderer.
 * This component is a thin wrapper that creates the widget render context and
 * delegates all rendering logic to ToolCallRenderer.
 *
 * **Architecture**:
 * - Uses definition-driven UI from unified-interface system
 * - Each tool call is rendered by ToolCallRenderer
 * - Request fields (args) and response fields (result) are rendered using WidgetRenderer
 * - All widget types (LINK_LIST, DATA_TABLE, etc.) are supported
 *
 * **UX Behavior**:
 * - Tool calls are OPEN by default when there's no content after (user needs to see what happened)
 * - Tool calls are COLLAPSED by default when there's content after (reduce wall of text)
 * - Users can always toggle open/closed manually
 *
 * @param props - Component props
 * @returns Rendered tool calls or null if no tool calls
 */
export function ToolDisplay({
  toolCalls,
  locale,
  hasContent = false,
}: ToolDisplayProps): JSX.Element | null {
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

  // Determine default open state based on whether there's content after
  // Open by default when NO content after, collapsed when there IS content after
  const defaultOpen = !hasContent;

  return (
    <Div className="space-y-3 mb-3">
      {toolCalls.map((toolCall, index) => (
        <ToolCallRenderer
          key={index}
          toolCall={toolCall}
          locale={locale}
          context={context}
          defaultOpen={defaultOpen}
        />
      ))}
    </Div>
  );
}

