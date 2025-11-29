"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { ToolCall } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { ToolCallRenderer } from "@/app/api/[locale]/v1/core/system/unified-interface/react/widgets/renderers/ToolCallRenderer";
import { Platform } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/platform";
import type { WidgetRenderContext } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/types";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Tool Display Props
 */
interface ToolDisplayProps {
  /** Single tool call to display (each TOOL message has exactly one tool call) */
  toolCall: ToolCall;
  /** Current locale for translations */
  locale: CountryLanguage;
  /** Thread ID */
  threadId: string;
  /** Whether the message has content after tool calls (affects default open state) */
  hasContent: boolean;
  /** Message ID for collapse state tracking */
  messageId: string;
  /** Collapse state management callbacks */
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
 * Tool Display Component
 *
 * Renders a single tool call using the unified-interface widget system via ToolCallRenderer.
 * This component is a thin wrapper that creates the widget render context and
 * delegates all rendering logic to ToolCallRenderer.
 *
 * **Architecture**:
 * - Uses definition-driven UI from unified-interface system
 * - Each TOOL message has exactly one tool call (singular, not array)
 * - Request fields (args) and response fields (result) are rendered using WidgetRenderer
 * - All widget types (LINK_LIST, DATA_TABLE, etc.) are supported
 *
 * **UX Behavior**:
 * - Tool calls are COLLAPSED by default when streaming in
 * - Users can toggle open/closed manually
 * - Once toggled, state is preserved in collapseState
 *
 * @param props - Component props
 * @returns Rendered tool call or null if no tool call
 */
export function ToolDisplay({
  toolCall,
  locale,
  threadId,
  hasContent: _hasContent = false,
  messageId,
  collapseState,
}: ToolDisplayProps): JSX.Element | null {
  if (!toolCall) {
    return null;
  }

  // Create widget render context
  // Use NEXT_PAGE as the default for web UI components
  const context: WidgetRenderContext = {
    locale,
    isInteractive: true,
    permissions: [],
    platform: Platform.NEXT_PAGE,
  };

  // Tool calls should always start collapsed
  const defaultOpen = false;

  return (
    <Div className="flex flex-col gap-3 mb-3">
      <ToolCallRenderer
        toolCall={toolCall}
        locale={locale}
        context={context}
        defaultOpen={defaultOpen}
        threadId={threadId}
        messageId={messageId}
        toolIndex={0}
        collapseState={collapseState}
      />
    </Div>
  );
}
