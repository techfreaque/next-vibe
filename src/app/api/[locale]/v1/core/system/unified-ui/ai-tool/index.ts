/**
 * AI Tool Handler System
 * Main exports for the AI tool system
 */

import "server-only";

// Config
export {
  aiToolConfig,
  getDiscoveryOptions,
  isAIToolSystemEnabled,
} from "./config";

// Types
export type {
  AIToolExecutionContext,
  AIToolExecutionResult,
  AIToolMetadata,
  CoreTool,
  DiscoveredEndpoint,
  IToolConverter,
  IToolDiscovery,
  IToolExecutor,
  IToolFilter,
  IToolRegistry,
  Platform,
  ToolCallWidgetMetadata,
  ToolConverterOptions,
  ToolDiscoveryOptions,
  ToolExecutorOptions,
  ToolFilterCriteria,
  ToolParameterValue,
  ToolRegistryStats,
} from "./types";

// Discovery
export { getToolDiscovery, ToolDiscovery, toolDiscovery } from "./discovery";

// Converter
export { getToolConverter, ToolConverter, toolConverter } from "./converter";

// Filter
export { getToolFilter, ToolFilter, toolFilter } from "./filter";

// Executor
export { getToolExecutor, ToolExecutor, toolExecutor } from "./executor";

// Factory
export type { ToolFactoryOptions } from "./factory";
export {
  createToolFromEndpoint,
  createToolsFromEndpoints,
  getToolFactory,
  ToolFactory,
} from "./factory";

// Widget Metadata
export {
  extractWidgetMetadata,
  extractWidgetMetadataById,
} from "./widget-metadata-extractor";

// Manual Tools
export { getManualTool, getManualTools, isManualTool } from "./manual-tools";

// Utilities
export { CacheManager } from "./cache-manager";
export { generateToolDescription } from "./description-generator";
export { createErrorResult, extractErrorMessage } from "./error-handler";
export { extractInputSchema } from "./schema-extractor";

// Registry (Main Entry Point)
export { aiToolRegistry, getToolRegistry, ToolRegistry } from "./registry";
