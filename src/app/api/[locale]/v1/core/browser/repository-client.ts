/**
 * Browser Repository Client
 * Client-side utilities for Chrome DevTools MCP tool execution
 */

import type { CountryLanguage } from "@/i18n/core/config";

import type { BrowserRequestInput, BrowserResponseOutput } from "./definition";
import type { BrowserToolValue } from "./enum";
import { BrowserTool } from "./enum";

/**
 * Browser Repository Client Interface
 * Defines contract for browser operations
 */
interface BrowserRepositoryClient {
  /**
   * Execute a Chrome DevTools MCP tool
   * @param tool - The tool to execute
   * @param args - JSON string of arguments
   * @param locale - User locale
   * @returns Promise with execution result
   */
  executeTool(
    tool: typeof BrowserToolValue,
    locale: CountryLanguage,
    args?: string,
  ): Promise<BrowserResponseOutput>;

  /**
   * Get available browser tools
   */
  getAvailableTools(): (typeof BrowserToolValue)[];

  /**
   * Validate tool arguments
   * @param tool - The tool to validate for
   * @param args - JSON string arguments
   * @returns Validation result
   */
  validateArguments(
    tool: typeof BrowserToolValue,
    args?: string,
  ): { valid: boolean; error?: string };
}

/**
 * Browser Repository Client Implementation
 * Handles client-side browser tool operations
 */
class BrowserRepositoryClientImpl implements BrowserRepositoryClient {
  private readonly baseUrl = "/api";

  /**
   * Execute a Chrome DevTools MCP tool
   */
  async executeTool(
    tool: typeof BrowserToolValue,
    locale: CountryLanguage,
    args?: string,
  ): Promise<BrowserResponseOutput> {
    const url = `${this.baseUrl}/${locale}/v1/core/browser`;

    const requestData: BrowserRequestInput = {
      tool,
      arguments: args,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      return {
        success: false,
        result: `HTTP ${response.status}: ${response.statusText}`,
        status: ["FAILED"],
        executionId: "",
      };
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get available browser tools
   */
  getAvailableTools(): (typeof BrowserToolValue)[] {
    return [
      BrowserTool.CLICK,
      BrowserTool.DRAG,
      BrowserTool.FILL,
      BrowserTool.FILL_FORM,
      BrowserTool.HANDLE_DIALOG,
      BrowserTool.HOVER,
      BrowserTool.PRESS_KEY,
      BrowserTool.UPLOAD_FILE,
      BrowserTool.CLOSE_PAGE,
      BrowserTool.LIST_PAGES,
      BrowserTool.NAVIGATE_PAGE,
      BrowserTool.NEW_PAGE,
      BrowserTool.SELECT_PAGE,
      BrowserTool.WAIT_FOR,
      BrowserTool.EMULATE,
      BrowserTool.RESIZE_PAGE,
      BrowserTool.PERFORMANCE_ANALYZE_INSIGHT,
      BrowserTool.PERFORMANCE_START_TRACE,
      BrowserTool.PERFORMANCE_STOP_TRACE,
      BrowserTool.GET_NETWORK_REQUEST,
      BrowserTool.LIST_NETWORK_REQUESTS,
      BrowserTool.EVALUATE_SCRIPT,
      BrowserTool.GET_CONSOLE_MESSAGE,
      BrowserTool.LIST_CONSOLE_MESSAGES,
      BrowserTool.TAKE_SCREENSHOT,
      BrowserTool.TAKE_SNAPSHOT,
    ];
  }

  /**
   * Validate tool arguments
   */
  validateArguments(
    tool: typeof BrowserToolValue,
    args?: string,
  ): { valid: boolean; error?: string } {
    if (!args) {
      // Some tools don't require arguments
      const toolsWithoutRequiredArgs: (typeof BrowserToolValue)[] = [
        BrowserTool.LIST_PAGES,
        BrowserTool.LIST_NETWORK_REQUESTS,
        BrowserTool.LIST_CONSOLE_MESSAGES,
      ];

      if (toolsWithoutRequiredArgs.includes(tool)) {
        return { valid: true };
      }

      return { valid: false, error: "Arguments are required for this tool" };
    }

    try {
      const parsed = JSON.parse(args);

      // Basic validation based on tool type
      switch (tool) {
        case BrowserTool.NAVIGATE_PAGE:
          if (!parsed.url || typeof parsed.url !== "string") {
            return {
              valid: false,
              error: "URL is required and must be a string",
            };
          }
          break;

        case BrowserTool.CLICK:
        case BrowserTool.HOVER:
          if (!parsed.selector || typeof parsed.selector !== "string") {
            return {
              valid: false,
              error: "Selector is required and must be a string",
            };
          }
          break;

        case BrowserTool.FILL:
          if (!parsed.selector || typeof parsed.selector !== "string") {
            return {
              valid: false,
              error: "Selector is required and must be a string",
            };
          }
          if (!parsed.value) {
            return { valid: false, error: "Value is required" };
          }
          break;

        case BrowserTool.EVALUATE_SCRIPT:
          if (!parsed.expression || typeof parsed.expression !== "string") {
            return {
              valid: false,
              error: "Expression is required and must be a string",
            };
          }
          break;

        case BrowserTool.TAKE_SCREENSHOT:
          if (
            parsed.format &&
            !["png", "jpeg", "webp"].includes(parsed.format)
          ) {
            return { valid: false, error: "Format must be png, jpeg, or webp" };
          }
          break;

        // Add more specific validations as needed
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}

/**
 * Singleton Repository Client Instance
 */
export const browserClientRepository = new BrowserRepositoryClientImpl();
