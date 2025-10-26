/**
 * AI Tool Handler System
 * Main exports for the AI tool system
 */

import "server-only";

// Config
export { aiToolConfig, isAIToolSystemEnabled } from "./config";

// Types
export type {
  AIToolExecutionContext,
  AIToolExecutionResult,
  AIToolMetadataSerialized,
  CoreTool,
  DiscoveredEndpoint,
  IToolExecutor,
  IToolFilter,
  IToolRegistry,
  Platform,
  ToolCallWidgetMetadata,
  ToolExecutorOptions,
  ToolFilterCriteria,
  ToolParameterValue,
  ToolRegistryStats,
} from "./types";

// Endpoint Adapter
export { getDiscoveredEndpoints, getStaticEndpoints } from "./endpoint-adapter";

// Filter
export { getToolFilter, ToolFilter, toolFilter } from "./filter";

// Executor
export { getToolExecutor, ToolExecutor, toolExecutor } from "./executor";

// Factory
export type { ToolFactoryOptions } from "./factory";
export { getToolFactory, ToolFactory } from "./factory";

// Utilities
export { createErrorResult, extractErrorMessage } from "./error-handler";

// Registry (Main Entry Point)
export { aiToolRegistry, getToolRegistry, ToolRegistry } from "./registry";
