/**
 * Shared Endpoint Registry Types
 * Common types used by both CLI and AI Tool systems
 */

import "server-only";

import type { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type { UnifiedField } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Discovered endpoint (minimal format from endpoint-adapter)
 */
export interface DiscoveredEndpoint {
  id: string;
  toolName: string;
  routePath: string;
  definitionPath: string;
  definition: CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    UnifiedField<z.ZodTypeAny>
  >;
  enabled: boolean;
  discoveredAt: number;
}

/**
 * Discovered endpoint metadata
 * This is the common format used by both CLI and AI Tool systems
 */
export interface DiscoveredEndpointMetadata {
  // Identification
  id: string; // Unique identifier (e.g., "get_v1_core_user_profile")
  name: string; // Human-readable name (e.g., "user_profile")

  // Location
  path: string; // API path (e.g., "/v1/core/user/profile")
  routePath: string; // File system path to route.ts
  definitionPath: string; // File system path to definition.ts

  // HTTP Method
  method: Methods;

  // Metadata
  title: string; // Translation key for title
  description: string; // Translation key for description
  category: string; // Translation key for category
  tags: readonly string[]; // Translation keys for tags

  // Access Control
  allowedRoles: readonly (typeof UserRoleValue)[];
  requiresAuth: boolean;

  // Schemas
  requestSchema?: z.ZodTypeAny;
  responseSchema?: z.ZodTypeAny;

  // Credit cost for this endpoint (0 = free, undefined = free)
  credits?: number;

  // AI Tool metadata
  aiTool?: {
    instructions: string;
    displayName: string;
    icon: string;
    color: string;
    priority: number;
  };

  // CLI metadata
  aliases?: readonly string[];

  // Additional metadata
  isDeprecated?: boolean;
  version?: string;
}

/**
 * Endpoint registry interface
 * Common interface for both CLI and AI Tool registries
 */
export interface IEndpointRegistry {
  /**
   * Initialize the registry by discovering all endpoints
   */
  initialize(): Promise<void>;

  /**
   * Get all discovered endpoints
   */
  getAllEndpoints(): Promise<DiscoveredEndpointMetadata[]>;

  /**
   * Get endpoint by ID
   */
  getEndpointById(id: string): Promise<DiscoveredEndpointMetadata | null>;

  /**
   * Get endpoints by filter criteria
   */
  getEndpoints(
    criteria: EndpointFilterCriteria,
  ): Promise<DiscoveredEndpointMetadata[]>;

  /**
   * Check if registry is initialized
   */
  isInitialized(): boolean;

  /**
   * Get registry statistics
   */
  getStats(): EndpointRegistryStats;
}

/**
 * Filter criteria for querying endpoints
 */
export interface EndpointFilterCriteria {
  methods?: Methods[];
  roles?: (typeof UserRoleValue)[];
  categories?: string[];
  tags?: string[];
  requiresAuth?: boolean;
  searchQuery?: string;
}

/**
 * Registry statistics
 */
export interface EndpointRegistryStats {
  totalEndpoints: number;
  endpointsByMethod: Record<Methods, number>;
  endpointsByCategory: Record<string, number>;
  lastRefresh: number;
  initialized: boolean;
}

/**
 * Discovery options
 */
export interface EndpointDiscoveryOptions {
  rootDir?: string;
  excludePaths?: string[];
  includeMethods?: Methods[];
  cache?: boolean;
  cacheTTL?: number;
}
