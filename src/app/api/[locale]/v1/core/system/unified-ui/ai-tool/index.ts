/**
 * AI Tool Handler System
 * Main exports for the AI tool system
 */

import "server-only";

// Config
export {
  aiToolConfig,
  isAIToolSystemEnabled,
  getDiscoveryOptions,
} from "./config";

// Types
export type {
  CoreTool,
  DiscoveredEndpoint,
  AIToolMetadata,
  AIToolExecutionContext,
  AIToolExecutionResult,
  ToolFilterCriteria,
  ToolRegistryStats,
  ToolDiscoveryOptions,
  ToolConverterOptions,
  ToolExecutorOptions,
  IToolRegistry,
  IToolDiscovery,
  IToolConverter,
  IToolFilter,
  IToolExecutor,
  Platform,
  ToolParameterValue,
} from "./types";

// Discovery
export { ToolDiscovery, toolDiscovery, getToolDiscovery } from "./discovery";

// Converter
export { ToolConverter, toolConverter, getToolConverter } from "./converter";

// Filter
export { ToolFilter, toolFilter, getToolFilter } from "./filter";

// Executor
export { ToolExecutor, toolExecutor, getToolExecutor } from "./executor";

// Registry (Main Entry Point)
export { ToolRegistry, aiToolRegistry, getToolRegistry } from "./registry";
