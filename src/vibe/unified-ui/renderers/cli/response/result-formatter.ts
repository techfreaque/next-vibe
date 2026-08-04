/**
 * CLI Result Formatter
 * Static class for formatting CLI execution results and rendering responses
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import React from "react";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import { getEnvAvailability } from "../../../../agent/env-availability";
import { getFullPath } from "../../../../core/core-utils/path";
import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../../../core/i18n/core/config";
import type { ContentBlock } from "../../../../core/route/response.schema";
import type { WidgetData } from "../../../../core/utils/json";
import { parseError } from "../../../../core/utils/parse-error";
import { EXECUTE_TOOL_ALIAS } from "../../../../execute-tool/constants";
import type { JwtPayloadType } from "../../../../identity/auth/types";
import type { EndpointLogger } from "../../../../logger/types";
import type { RouteExecutionResult } from "../../../../platforms/cli/runtime/route-executor";
import type { Platform } from "../../../../platforms/platforms";
import { prewarmBuiltinWidgets } from "../../web/WidgetRenderer";
import { CliErrorFormatter } from "./error-formatter";
import { renderToString as fastRenderToString } from "./fast-ink-renderer/renderer";
import { CliRenderTree } from "./render-tree";

/**
 * Save image blocks from a ContentResponse to .tmp/screenshots/ and replace
 * them with text blocks referencing the saved file paths.
 * Only called in the CLI pipeline so fs access is safe.
 */
function saveContentResponseImages(data: WidgetData): WidgetData {
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !("isContentResponse" in data) ||
    !data.isContentResponse ||
    !("content" in data) ||
    !Array.isArray(data.content)
  ) {
    return data;
  }

  const tmpDir = join(process.cwd(), ".tmp", "screenshots");
  mkdirSync(tmpDir, { recursive: true });

  const lines: string[] = [];
  for (const block of data.content as ContentBlock[]) {
    if (block.type === "text") {
      lines.push(block.text);
    } else if (block.type === "image") {
      const ext = block.mimeType.split("/")[1] ?? "png";
      const filename = `screenshot-${Date.now()}.${ext}`;
      const filePath = join(tmpDir, filename);
      writeFileSync(filePath, Buffer.from(block.data, "base64"));
      lines.push(`Saved to: ${filePath}`);
    }
  }

  // Merge into a single text block so CLI renderer outputs proper newlines
  return {
    ...data,
    content: [{ type: "text" as const, text: lines.join("\n") }],
  } as WidgetData;
}

/**
 * Pre-warm React.lazy widgets so their promises resolve before sync rendering.
 * The fast reconciler renders synchronously - lazy components that haven't
 * resolved yet will suspend and produce no output.
 */
interface ReactLazyRef {
  _payload: {
    _status: number;
    _result:
      | (() => Promise<{ default: React.ComponentType }>)
      | { default: React.ComponentType };
  };
}

async function prewarmLazy(render: ReactLazyRef): Promise<void> {
  // React.lazy stores { _status, _result } on _payload where:
  //   _status: -1 = uninitialized, 0 = pending, 1 = fulfilled, 2 = rejected
  const payload = Reflect.get(render, "_payload") as {
    _status: number;
    _result:
      | (() => Promise<{ default: React.ComponentType }>)
      | { default: React.ComponentType };
  };
  if (payload._status === -1) {
    const factory = payload._result as () => Promise<{
      default: React.ComponentType;
    }>;
    const result = await factory();
    payload._status = 1;
    payload._result = result;
  }
}

export async function prewarmLazyWidgets(
  endpoint: CreateApiEndpointAny,
): Promise<void> {
  // Resolve the builtin widget modules this endpoint's field tree uses —
  // the sync fast renderer cannot suspend on an unresolved React.lazy.
  await prewarmBuiltinWidgets(endpoint);

  const fields = endpoint.fields;
  if (!fields || typeof fields !== "object") {
    return;
  }

  // fields.render is the lazy component directly (customWidgetObject puts render at top level)
  const render = Reflect.get(fields, "render");
  if (!render) {
    return;
  }

  // lazyWidget() components: function with cliWidget + preload
  if (
    typeof render === "function" &&
    "cliWidget" in render &&
    "preload" in render
  ) {
    await (render as { preload: () => Promise<void> }).preload();
    return;
  }

  // bare React.lazy objects
  if (typeof render === "object" && "_payload" in render && "_init" in render) {
    await prewarmLazy(render as ReactLazyRef);
  }
}

/**
 * Static class for formatting CLI execution results and rendering responses
 */
export class CliResultFormatter {
  /**
   * Format execution result for display
   */
  static async formatResult(
    result: RouteExecutionResult,
    outputFormat: "json" | "pretty",
    locale: CountryLanguage,
    verbose: boolean,
    logger: EndpointLogger,
    endpoint: CreateApiEndpointAny | null,
    user: JwtPayloadType,
    platform: Platform,
    requestInput: Record<string, WidgetData> | undefined,
  ): Promise<{ output: string; renderMs: number }> {
    if (!result.success) {
      return {
        output: CliErrorFormatter.formatErrorResult(result, locale, verbose),
        renderMs: 0,
      };
    }

    const renderStart = performance.now();
    let output = "";

    // Only show metadata in verbose mode
    if (verbose) {
      // Add execution metadata if available
      if (result.metadata?.route) {
        // eslint-disable-next-line i18next/no-literal-string
        output += `🛣️  Route: ${result.metadata.method} ${result.metadata.route}\n`;
      }
      output += "\n";
    }

    // Format data based on output format
    if (result.data) {
      output += "\n";

      switch (outputFormat) {
        case "json":
          // eslint-disable-next-line i18next/no-literal-string
          output += "📊 Result (JSON):\n";
          output += JSON.stringify(result.data, null, 2);
          break;
        case "pretty":
        default: {
          // execute-tool response: render the inner endpoint's widget directly.
          // Detect by endpoint alias + { result } wrapper in response data.
          // Use requestInput.toolName (passed by the CLI executor) to resolve the inner endpoint.
          let renderEndpoint = endpoint;
          let renderData: WidgetData = result.data;
          const isExecuteTool =
            endpoint?.aliases?.includes(EXECUTE_TOOL_ALIAS) ?? false;
          const rawInnerToolName =
            isExecuteTool && requestInput
              ? requestInput["toolName"]
              : undefined;
          const innerToolName =
            typeof rawInnerToolName === "string" ? rawInnerToolName : undefined;
          if (
            isExecuteTool &&
            innerToolName &&
            typeof result.data === "object" &&
            result.data !== null &&
            !Array.isArray(result.data) &&
            !(result.data instanceof Date) &&
            "result" in result.data
          ) {
            const canonicalId = getFullPath(innerToolName) ?? innerToolName;
            const innerEndpoint = await getEndpoint(canonicalId);
            if (innerEndpoint) {
              renderEndpoint = innerEndpoint;
              renderData = result.data["result"];
            }
          }

          // Render with Ink if endpoint available, else JSON fallback
          if (renderEndpoint) {
            output += await CliResultFormatter.renderWithEndpoint(
              renderData,
              renderEndpoint,
              locale,
              logger,
              user,
              platform,
            );
          } else {
            // Fallback to JSON without endpoint definition
            if (typeof result.data === "object") {
              output += JSON.stringify(result.data, null, 2);
            } else {
              output += String(result.data);
            }
          }
          break;
        }
      }
    }

    return { output, renderMs: Math.round(performance.now() - renderStart) };
  }

  /**
   * Render data using endpoint definition
   * Uses fast renderer with hook support
   *
   * Public because live-frame.ts calls it repeatedly to repaint a progressive
   * result region — realtime rendering is "render a whole new frame per update",
   * since the fast renderer has no diffing path.
   */
  static async renderWithEndpoint(
    data: WidgetData,
    endpoint: CreateApiEndpointAny,
    locale: CountryLanguage,
    logger: EndpointLogger,
    user: JwtPayloadType,
    platform: Platform,
  ): Promise<string> {
    try {
      const perfStart = performance.now();

      // Pre-warm any lazy CLI widgets so they're resolved before sync rendering
      await prewarmLazyWidgets(endpoint);
      const availability = await getEnvAvailability();

      // Save ContentResponse images to .tmp/screenshots/ for CLI
      const processedData = saveContentResponseImages(data);

      // Create component
      const createStart = performance.now();
      const component = React.createElement(CliRenderTree, {
        endpoint,
        locale,
        data: processedData,
        logger,
        user,
        platform,
        availability,
      });
      const componentTime = performance.now() - createStart;

      // Use fast renderer (supports hooks via renderToStaticMarkup internally for function components)
      const renderStart = performance.now();
      const output = fastRenderToString(component, logger);
      const renderTime = performance.now() - renderStart;

      const totalTime = performance.now() - perfStart;

      logger.debug(
        `[Fast Renderer] createElement: ${componentTime.toFixed(2)}ms, ` +
          `render: ${renderTime.toFixed(2)}ms, ` +
          `total: ${totalTime.toFixed(2)}ms, ` +
          `output: ${output.length} chars`,
      );

      // Fall back to JSON if renderer produced empty output (reconciler failure)
      if (!output) {
        logger.error(
          "[Fast Renderer] Empty output, falling back to JSON",
          undefined,
          endpoint.path?.join("/"),
        );
        return JSON.stringify(data, null, 2);
      }

      return output;
    } catch (error) {
      logger.warn("Fast rendering failed, falling back to JSON:", {
        error: parseError(error),
      });
      return JSON.stringify(data, null, 2);
    }
  }
}
