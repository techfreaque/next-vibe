/**
 * AI Tool Handler Types
 * Core TypeScript interfaces for the AI tool system
 */

import "server-only";

import type { tool } from "ai";

import type { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { Platform } from "../shared/server-only/config";
import type {
  BaseExecutionContext,
  BaseExecutionResult,
  ParameterValue,
} from "../shared/server-only/execution/executor";
import type { BaseRegistryStats } from "../shared/server-only/execution/registry";
import type { DiscoveredEndpoint } from "../shared/server-only/types/registry";

/**
 * CoreTool type from AI SDK
 * This is the ONLY tool type we use - no custom wrappers or conversions
 * The actual types are inferred by the tool() function at creation time
 * We don't specify generic parameters - they're inferred from the tool() call
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CoreTool = ReturnType<typeof tool<any, any>>;

export type { DiscoveredEndpoint };

/**
 * AI Tool metadata (serialized version for API responses)
 * This is derived from DiscoveredEndpoint for API responses
 */
export interface AIToolMetadataSerialized {
  /** Tool name (snake_case) */
  name: string;

  /** Tool description for AI */
  description: string;

  /** Icon identifier for UI display */
  icon?: string;

  /** Category for organization */
  category?: string;

  /** Tags for filtering */
  tags: string[];

  /** Source endpoint ID */
  endpointId: string;

  /** Allowed roles (serialized as strings) */
  allowedRoles: string[];
}

/**
 * Tool parameter value types
 * Alias for ParameterValue from shared executor
 */
export type ToolParameterValue = ParameterValue;

/**
 * AI Tool execution context
 * Extends BaseExecutionContext with AI-specific fields
 */
export interface AIToolExecutionContext<
  TData = { [key: string]: ToolParameterValue },
> extends Omit<BaseExecutionContext<TData>, "user" | "metadata"> {
  /** User context - must be a valid JWT payload */
  user: JwtPayloadType;

  /** AI-specific metadata */
  metadata?: {
    conversationId?: string;
    messageId?: string;
    endpointId?: string;
    timestamp: number;
  };
}

/**
 * Widget metadata for tool result rendering
 */
export interface ToolCallWidgetMetadata {
  endpointId: string;
  responseFields: Array<{
    name: TranslationKey;
    widgetType: WidgetType;
    label?: TranslationKey;
    description?: TranslationKey;
    layout?: { [key: string]: string | number | boolean };
    validation?: { [key: string]: string | number | boolean };
    options?: Array<{ value: string; label: TranslationKey }>;
  }>;
  creditsUsed?: number;
  executionTime?: number;
}

/**
 * AI Tool execution result
 * Extends BaseExecutionResult with AI-specific fields
 */
export interface AIToolExecutionResult
  extends Omit<BaseExecutionResult, "data" | "metadata"> {
  /** Result data */
  data?: ToolParameterValue;

  /** AI-specific metadata */
  metadata?: {
    executionTime: number;
    endpointPath: string;
    method: string;
    cached?: boolean;
    widgetMetadata?: ToolCallWidgetMetadata;
  };
}

/**
 * Tool filter criteria
 */
export interface ToolFilterCriteria {
  /** User roles to filter by */
  roles?: readonly (typeof UserRoleValue)[];

  /** Include only specific categories */
  categories?: readonly TranslationKey[];

  /** Include only specific tags */
  tags?: readonly TranslationKey[];

  /** Include only enabled tools */
  enabledOnly?: boolean;

  /** Search query for tool names/descriptions */
  searchQuery?: string;
}

/**
 * Tool registry statistics
 * Extends BaseRegistryStats to ensure compatibility
 */
export interface ToolRegistryStats extends BaseRegistryStats {
  /** Total AI tools available */
  totalTools: number;

  /** Tools by category */
  toolsByCategory: { [key: string]: number };

  /** Tools by role */
  toolsByRole: { [key: string]: number };

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
 * Now works with DiscoveredEndpoint[] directly - no conversion
 */
export interface IToolRegistry {
  /** Initialize the registry */
  initialize(): Promise<void>;

  /**
   * Get all endpoints with optional filtering by user permissions and platform
   * @param user - User context for permission filtering (optional)
   * @param platform - Platform to filter by (optional)
   * @param criteria - Additional filter criteria (optional)
   */
  getEndpoints(
    user: AIToolExecutionContext["user"],
    platform?: Platform,
    criteria?: ToolFilterCriteria,
  ): DiscoveredEndpoint[];

  /** Get endpoint by tool name */
  getEndpointByToolName(toolName: string): DiscoveredEndpoint | null;

  /** Get endpoint by ID */
  getEndpointById(id: string): DiscoveredEndpoint | null;

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
 * Tool filter interface
 * Now works with DiscoveredEndpoint[] directly
 */
export interface IToolFilter {
  /** Filter endpoints by user permissions */
  filterEndpointsByPermissions(
    endpoints: DiscoveredEndpoint[],
    user: AIToolExecutionContext["user"],
    platform?: Platform,
  ): DiscoveredEndpoint[];

  /** Filter endpoints by criteria */
  filterEndpointsByCriteria(
    endpoints: DiscoveredEndpoint[],
    criteria: ToolFilterCriteria,
  ): DiscoveredEndpoint[];

  /** Check if user has permission for endpoint */
  hasEndpointPermission(
    endpoint: DiscoveredEndpoint,
    user: AIToolExecutionContext["user"],
    platform?: Platform,
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
    parameters: { [key: string]: ToolParameterValue },
  ): { valid: boolean; errors?: string[] };
}

const definitions = {};

export default definitions;
