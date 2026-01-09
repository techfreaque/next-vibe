"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import type { FieldValues } from "react-hook-form";

import type { ToolCall } from "@/app/api/[locale]/agent/chat/db";
import { ToolCallRenderer } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/ToolCallRenderer";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export type ToolDecision =
  | { type: "pending" }
  | {
      type: "confirmed";
      updatedArgs?: Record<string, string | number | boolean | null>;
    }
  | { type: "declined" };

/**
 * Tool Display Props
 */
interface ToolDisplayProps {
  logger: EndpointLogger;
  /** Single tool call to display (each TOOL message has exactly one tool call) */
  toolCall: ToolCall;
  /** Current locale for translations */
  locale: CountryLanguage;
  /** Thread ID */
  threadId: string;
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
  user: JwtPayloadType;
  /** Optional batch mode handlers */
  onConfirm?: (formData: FieldValues) => void;
  onCancel?: () => void;
  parentId?: string;
  defaultOpen?: boolean;
  /** Decision state for batch mode */
  decision?: ToolDecision;
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
  user,
  threadId,
  messageId,
  collapseState,
  onConfirm,
  onCancel,
  parentId,
  defaultOpen: defaultOpenProp,
  decision,
  logger,
}: ToolDisplayProps): JSX.Element | null {
  if (!toolCall) {
    return null;
  }

  // Tool calls should always start collapsed unless overridden
  const defaultOpen = defaultOpenProp ?? false;

  return (
    <Div className="flex flex-col gap-3 mb-3">
      <ToolCallRenderer
        toolCall={toolCall}
        locale={locale}
        defaultOpen={defaultOpen}
        threadId={threadId}
        messageId={messageId}
        toolIndex={0}
        collapseState={collapseState}
        user={user}
        onConfirm={onConfirm}
        onCancel={onCancel}
        parentId={parentId}
        decision={decision}
        logger={logger}
      />
    </Div>
  );
}
