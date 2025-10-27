/**
 * AI Tool Handler Types
 * Core TypeScript interfaces for the AI tool system
 */

import "server-only";

import type { tool } from "ai";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { Platform } from "../shared/config";
import type { DiscoveredEndpoint } from "../shared/endpoint-registry-types";

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
 */
export type ToolParameterValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ToolParameterValue[]
  | { [key: string]: ToolParameterValue };

/**
 * AI Tool execution context
 */
export interface AIToolExecutionContext {
  /** Tool name being executed */
  toolName: string;

  /** Tool parameters */
  parameters: Record<string, ToolParameterValue>;

  /** User context */
  user: {
    id?: string;
    email?: string;
    role?: typeof UserRoleValue;
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
    name: string;
    widgetType: WidgetType;
    label?: string;
    description?: string;
    layout?: Record<string, string | number | boolean>;
    validation?: Record<string, string | number | boolean>;
    options?: Array<{ value: string; label: string }>;
  }>;
  creditsUsed?: number;
  executionTime?: number;
}

/**
 * AI Tool execution result
 */
export interface AIToolExecutionResult {
  /** Whether execution succeeded */
  success: boolean;

  /** Result data */
  data?: ToolParameterValue;

  /** Error message if failed */
  error?: string;

  /** Execution metadata */
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
  initialize(): void;

  /**
   * Get all endpoints with optional filtering by user permissions and platform
   * @param user - User context for permission filtering (optional)
   * @param platform - Platform to filter by (optional)
   * @param criteria - Additional filter criteria (optional)
   */
  getEndpoints(
    user?: AIToolExecutionContext["user"],
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
  refresh(): void;

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
    parameters: Record<string, ToolParameterValue>,
  ): { valid: boolean; errors?: string[] };
}
