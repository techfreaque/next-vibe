/**
 * Anthropic Agent SDK Tool Bridge
 *
 * Bridges the gap between AI SDK CoreTool objects (which have execute functions)
 * and the Agent SDK's MCP tool format (which needs handler functions).
 *
 * This module provides a tool executor registry that:
 * 1. Stores CoreTool execute functions keyed by tool name
 * 2. Is used by the Agent SDK MCP handler to actually run tools
 * 3. Is scoped per-request to avoid conflicts
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

/**
 * Tool executor function type — matches CoreTool's execute signature (with options)
 */
type ToolExecutor = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- tool args are dynamic
  args: any,
  options?: { toolCallId?: string },
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- generic executor return
) => Promise<unknown>;

/**
 * Per-request tool executor registry.
 * Created before streaming starts, passed to the Agent SDK provider.
 */
export class AgentToolExecutorRegistry {
  private executors = new Map<string, ToolExecutor>();
  batchRemaining = 0;

  /**
   * Set of callbackMode values seen in the current batch that require stopping
   * the Agent SDK loop after the batch completes.
   * The MCP handler populates this directly from tool args — no dependency on
   * stream-part-handler having processed the tool-call events yet.
   */
  batchStopModes = new Set<string>();

  /**
   * Called when an assistant message with tool_use is received, before any MCP handlers fire.
   * Sets the expected number of tools in this parallel batch so isLastInBatch is accurate.
   */
  setBatchSize(count: number): void {
    this.batchRemaining = count;
    this.batchStopModes.clear();
  }

  /**
   * Decrement and return whether this is the last tool in the batch.
   * Used by the MCP handler for tools that skip execute() (e.g. approve).
   */
  consumeOne(): boolean {
    if (this.batchRemaining > 0) {
      this.batchRemaining--;
    }
    return this.batchRemaining === 0;
  }

  /**
   * Register all CoreTools from the AI SDK tools map
   */
  registerTools(tools: Record<string, CoreTool>, logger: EndpointLogger): void {
    for (const [toolName, coreTool] of Object.entries(tools)) {
      const execute = (coreTool as { execute?: ToolExecutor }).execute;
      if (execute) {
        this.executors.set(toolName, execute);
      } else {
        logger.warn("[AgentToolBridge] Tool has no execute function", {
          toolName,
        });
      }
    }
    logger.info("[AgentToolBridge] Registered tool executors", {
      count: this.executors.size,
    });
  }

  /**
   * Execute a tool by name. Called by the Agent SDK MCP handler.
   * Returns the result plus `isLastInBatch` — true when no other tool calls
   * remain pending in the current batch (mirrors finish-step pendingToolMessages check).
   */
  async execute(
    toolName: string,
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- MCP tool args are dynamic
    args: Record<string, unknown>,
    logger: EndpointLogger,
    toolCallId: string,
  ): Promise<{
    content: Array<{ type: "text"; text: string }>;
    isError?: boolean;
    isLastInBatch: boolean;
  }> {
    const executor = this.executors.get(toolName);
    const isLastInBatch = this.consumeOne();

    if (!executor) {
      logger.error("[AgentToolBridge] Tool not found in registry", {
        toolName,
        registered: [...this.executors.keys()],
      });
      return {
        content: [
          {
            type: "text" as const,
            // eslint-disable-next-line i18next/no-literal-string -- error for AI
            text: `Error: Tool '${toolName}' not found`,
          },
        ],
        isError: true,
        isLastInBatch,
      };
    }

    try {
      const result = await executor(
        args,
        toolCallId ? { toolCallId } : undefined,
      );
      return {
        content: [
          {
            type: "text" as const,
            text:
              typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2),
          },
        ],
        isLastInBatch,
      };
    } catch (error) {
      const parsed = parseError(error);
      logger.warn("[AgentToolBridge] Tool execution error", {
        toolName,
        error: parsed.message,
      });
      return {
        content: [
          {
            type: "text" as const,
            // eslint-disable-next-line i18next/no-literal-string -- error for AI
            text: `Error: ${parsed.message}`,
          },
        ],
        isError: true,
        isLastInBatch,
      };
    }
  }

  /**
   * Get all registered tool names
   */
  getToolNames(): string[] {
    return [...this.executors.keys()];
  }
}
