/**
 * AI Tool Handler Types
 * Core TypeScript interfaces for the AI tool system
 */

import "server-only";

import type { CoreTool } from "ai";
import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { Methods } from "../cli/vibe/endpoints/endpoint-types/core/enums";
import type { UnifiedField } from "../cli/vibe/endpoints/endpoint-types/core/types";
import type { CreateApiEndpoint } from "../cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { EndpointLogger } from "../cli/vibe/endpoints/endpoint-handler/logger";

/**
 * Discovered endpoint metadata
 */
export interface DiscoveredEndpoint {
  /** Unique identifier for the endpoint */
  id: string;

  /** File path to the route */
  routePath: string;

  /** File path to the definition */
  definitionPath: string;

  /** HTTP method */
  method: Methods;

  /** Endpoint path segments */
  path: string[];

  /** Tool-friendly name (snake_case) */
  toolName: string;

  /** Endpoint aliases */
  aliases: string[];

  /** Allowed user roles */
  allowedRoles: readonly (typeof UserRoleValue)[];

  /** Endpoint definition */
  definition: CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    UnifiedField<z.ZodTypeAny>
  >;

  /** Whether this endpoint is enabled for AI tools */
  enabled: boolean;

  /** Timestamp of last discovery */
  discoveredAt: number;
}

/**
 * AI Tool metadata
 */
export interface AIToolMetadata {
  /** Tool name (snake_case) */
  name: string;

  /** Tool description for AI */
  description: string;

  /** Category for organization */
  category?: string;

  /** Tags for filtering */
  tags: string[];

  /** Source endpoint ID */
  endpointId: string;

  /** Allowed roles */
  allowedRoles: readonly (typeof UserRoleValue)[];

  /** Whether this is a manual tool (e.g., braveSearch) */
  isManualTool: boolean;

  /** Tool parameters schema */
  parameters?: z.ZodTypeAny;
}

/**
 * AI Tool execution context
 */
export interface AIToolExecutionContext {
  /** Tool name being executed */
  toolName: string;

  /** Tool parameters */
  parameters: Record<string, unknown>;

  /** User context */
  user: {
    id?: string;
    email?: string;
    role?: string;
    isPublic: boolean;
  };

  /** Locale for translations */
  locale: CountryLanguage;

  /** Logger instance */
  logger: EndpointLogger;

  /** Request metadata */
  metadata?: {
    conversationId?: string;
    messageId?: string;
    timestamp: number;
  };
}

/**
 * AI Tool execution result
 */
export interface AIToolExecutionResult {
  /** Whether execution succeeded */
  success: boolean;

  /** Result data */
  data?: unknown;

  /** Error message if failed */
  error?: string;

  /** Execution metadata */
  metadata?: {
    executionTime: number;
    endpointPath: string;
    method: string;
    cached?: boolean;
  };
}

/**
 * Tool filter criteria
 */
export interface ToolFilterCriteria {
  /** User roles to filter by */
  roles?: readonly (typeof UserRoleValue)[];

  /** Include only specific categories */
  categories?: string[];

  /** Include only specific tags */
  tags?: string[];

  /** Exclude manual tools */
  excludeManualTools?: boolean;

  /** Include only enabled tools */
  enabledOnly?: boolean;

  /** Search query for tool names/descriptions */
  searchQuery?: string;
}

/**
 * Tool registry statistics
 */
export interface ToolRegistryStats {
  /** Total endpoints discovered */
  totalEndpoints: number;

  /** Total AI tools available */
  totalTools: number;

  /** Tools by category */
  toolsByCategory: Record<string, number>;

  /** Tools by role */
  toolsByRole: Record<string, number>;

  /** Manual vs dynamic tools */
  manualTools: number;
  dynamicTools: number;

  /** Cache statistics */
  cacheStats: {
    size: number;
    hits: number;
    misses: number;
    lastRefresh: number;
  };
}

/**
 * Tool discovery options
 */
export interface ToolDiscoveryOptions {
  /** Root directory to scan */
  rootDir?: string;

  /** Paths to exclude */
  excludePaths?: string[];

  /** Include only specific methods */
  includeMethods?: Methods[];

  /** Enable caching */
  cache?: boolean;

  /** Cache TTL in milliseconds */
  cacheTTL?: number;

  /** Whether to follow symbolic links */
  followSymlinks?: boolean;
}

/**
 * Tool converter options
 */
export interface ToolConverterOptions {
  /** Target locale for descriptions */
  locale?: CountryLanguage;

  /** Include verbose descriptions */
  verbose?: boolean;

  /** Include examples in descriptions */
  includeExamples?: boolean;

  /** Maximum description length */
  maxDescriptionLength?: number;
}

/**
 * Tool executor options
 */
export interface ToolExecutorOptions {
  /** Enable dry run mode */
  dryRun?: boolean;

  /** Timeout in milliseconds */
  timeout?: number;

  /** Enable verbose logging */
  verbose?: boolean;

  /** Whether to stream responses */
  stream?: boolean;
}

/**
 * Tool registry interface
 */
export interface IToolRegistry {
  /** Initialize the registry */
  initialize(): Promise<void>;

  /** Get all tools filtered by criteria */
  getTools(criteria?: ToolFilterCriteria): Promise<AIToolMetadata[]>;

  /** Get tools as AI SDK CoreTool[] */
  getAISDKTools(criteria?: ToolFilterCriteria): Promise<CoreTool[]>;

  /** Get tools for a specific user */
  getToolsForUser(
    user: AIToolExecutionContext["user"],
    locale: CountryLanguage,
  ): Promise<CoreTool[]>;

  /** Get tool metadata by name */
  getToolByName(name: string): Promise<AIToolMetadata | null>;

  /** Execute a tool */
  executeTool(
    context: AIToolExecutionContext,
    options?: ToolExecutorOptions,
  ): Promise<AIToolExecutionResult>;

  /** Refresh the registry (rediscover endpoints) */
  refresh(): Promise<void>;

  /** Get registry statistics */
  getStats(): ToolRegistryStats;

  /** Clear cache */
  clearCache(): void;
}

/**
 * Tool discovery interface
 */
export interface IToolDiscovery {
  /** Discover all endpoints */
  discover(options?: ToolDiscoveryOptions): Promise<DiscoveredEndpoint[]>;

  /** Discover endpoints in a specific directory */
  discoverInDirectory(dirPath: string): Promise<DiscoveredEndpoint[]>;

  /** Watch for changes (development mode) */
  watch(callback: (endpoints: DiscoveredEndpoint[]) => void): () => void;

  /** Clear discovery cache */
  clearCache(): void;
}

/**
 * Tool converter interface
 */
export interface IToolConverter {
  /** Convert endpoint to AI tool metadata */
  convert(
    endpoint: DiscoveredEndpoint,
    options?: ToolConverterOptions,
  ): Promise<AIToolMetadata>;

  /** Convert endpoint to AI SDK CoreTool */
  convertToAISDKTool(
    endpoint: DiscoveredEndpoint,
    executor: (params: Record<string, unknown>) => Promise<unknown>,
    options?: ToolConverterOptions,
  ): Promise<CoreTool>;

  /** Generate tool description from endpoint */
  generateDescription(
    endpoint: DiscoveredEndpoint,
    locale: CountryLanguage,
    options?: ToolConverterOptions,
  ): Promise<string>;

  /** Convert endpoint path to tool name */
  pathToToolName(path: string[]): string;
}

/**
 * Tool filter interface
 */
export interface IToolFilter {
  /** Filter tools by user permissions */
  filterByPermissions(
    tools: AIToolMetadata[],
    user: AIToolExecutionContext["user"],
  ): AIToolMetadata[];

  /** Filter tools by criteria */
  filterByCriteria(
    tools: AIToolMetadata[],
    criteria: ToolFilterCriteria,
  ): AIToolMetadata[];

  /** Check if user has permission for tool */
  hasPermission(
    tool: AIToolMetadata,
    user: AIToolExecutionContext["user"],
  ): boolean;
}

/**
 * Tool executor interface
 */
export interface IToolExecutor {
  /** Execute a tool */
  execute(
    context: AIToolExecutionContext,
    options?: ToolExecutorOptions,
  ): Promise<AIToolExecutionResult>;

  /** Execute multiple tools in parallel */
  executeParallel(
    contexts: AIToolExecutionContext[],
    options?: ToolExecutorOptions,
  ): Promise<AIToolExecutionResult[]>;

  /** Validate tool parameters */
  validateParameters(
    toolName: string,
    parameters: Record<string, unknown>,
  ): Promise<{ valid: boolean; errors?: string[] }>;
}
