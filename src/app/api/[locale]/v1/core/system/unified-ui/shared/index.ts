/**
 * Unified Platform System
 * Single source of truth for all platforms (CLI, AI, MCP, Web, Mobile)
 *
 * This module provides a unified interface for:
 * - Endpoint discovery
 * - Endpoint grouping/categorization
 * - Platform configuration
 * - Platform-agnostic operations
 *
 * Usage:
 * ```typescript
 * import { createAIPlatform } from "@/app/api/[locale]/v1/core/system/unified-ui/shared";
 *
 * const platform = createAIPlatform(logger, user);
 * const endpoints = await platform.discoverEndpoints();
 * const groups = await platform.groupEndpoints({ strategy: GroupingStrategy.BY_PATH });
 * ```
 */

// Platform abstraction
export {
  createAIPlatform,
  createCLIPlatform,
  createMCPPlatform,
  createMobilePlatform,
  createPlatformService,
  createWebPlatform,
  type PlatformContext,
  type PlatformStats,
  UnifiedPlatformService,
} from "./platform/unified-platform";

// Discovery
export {
  type DiscoveryResult,
  getUnifiedDiscovery,
  type UnifiedDiscoveryOptions,
  UnifiedDiscoveryService,
} from "./discovery/unified-discovery";

// Grouping
export {
  type EndpointGroup,
  getUnifiedGrouping,
  type GroupingOptions,
  GroupingStrategy,
  UnifiedGroupingService,
} from "./grouping/unified-grouping";

// Configuration
export {
  AI_CONFIG,
  CLI_CONFIG,
  getPlatformConfig,
  MCP_CONFIG,
  mergePlatformConfig,
  MOBILE_CONFIG,
  Platform,
  type PlatformConfig,
  platformToAuthPlatform,
  validatePlatformConfig,
  WEB_CONFIG,
} from "./config/platform-config";

// Re-export endpoint adapter for backward compatibility
export {
  getDiscoveredEndpoints,
  getStaticEndpoints,
} from "../ai-tool/endpoint-adapter";

// Re-export types
export type { DiscoveredEndpoint } from "../ai-tool/types";
