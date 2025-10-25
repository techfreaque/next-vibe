/**
 * Unified Grouping System
 * Platform-agnostic endpoint grouping and categorization
 * Works for CLI route groups, AI tool categories, MCP organization, etc.
 */

import "server-only";

import type { DiscoveredEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/ai-tool/types";

/**
 * Grouping strategy
 */
export enum GroupingStrategy {
  /** Group by path segments (e.g., /core/user, /core/leads) */
  BY_PATH = "by_path",

  /** Group by category from endpoint definition */
  BY_CATEGORY = "by_category",

  /** Group by HTTP method */
  BY_METHOD = "by_method",

  /** Group by user roles */
  BY_ROLE = "by_role",

  /** Group by tags */
  BY_TAG = "by_tag",

  /** Custom grouping function */
  CUSTOM = "custom",
}

/**
 * Endpoint group
 */
export interface EndpointGroup {
  /** Group identifier */
  id: string;

  /** Group name (human-readable) */
  name: string;

  /** Group description */
  description?: string;

  /** Endpoints in this group */
  endpoints: DiscoveredEndpoint[];

  /** Subgroups (for hierarchical grouping) */
  subgroups?: EndpointGroup[];

  /** Group metadata */
  metadata: {
    /** Total endpoints in group (including subgroups) */
    totalCount: number;

    /** Group path (for hierarchical groups) */
    path: string[];

    /** Group level (0 = root) */
    level: number;
  };
}

/**
 * Grouping options
 */
export interface GroupingOptions {
  /** Grouping strategy */
  strategy: GroupingStrategy;

  /** Maximum depth for hierarchical grouping */
  maxDepth?: number;

  /** Minimum endpoints per group (merge smaller groups) */
  minGroupSize?: number;

  /** Custom grouping function */
  customGroupFn?: (endpoint: DiscoveredEndpoint) => string;

  /** Sort groups */
  sortBy?: "name" | "count" | "path";

  /** Sort direction */
  sortDirection?: "asc" | "desc";
}

/**
 * Unified Grouping Service
 */
export class UnifiedGroupingService {
  /**
   * Group endpoints by strategy
   */
  groupEndpoints(
    endpoints: DiscoveredEndpoint[],
    options: GroupingOptions,
  ): EndpointGroup[] {
    switch (options.strategy) {
      case GroupingStrategy.BY_PATH:
        return this.groupByPath(endpoints, options);

      case GroupingStrategy.BY_CATEGORY:
        return this.groupByCategory(endpoints, options);

      case GroupingStrategy.BY_METHOD:
        return this.groupByMethod(endpoints, options);

      case GroupingStrategy.BY_ROLE:
        return this.groupByRole(endpoints, options);

      case GroupingStrategy.BY_TAG:
        return this.groupByTag(endpoints, options);

      case GroupingStrategy.CUSTOM:
        return this.groupByCustom(endpoints, options);

      default:
        return this.groupByPath(endpoints, options);
    }
  }

  /**
   * Group by path segments (hierarchical)
   */
  private groupByPath(
    endpoints: DiscoveredEndpoint[],
    options: GroupingOptions,
  ): EndpointGroup[] {
    const maxDepth = options.maxDepth || 3;
    const groups = new Map<string, DiscoveredEndpoint[]>();

    for (const endpoint of endpoints) {
      // Take first N path segments
      const pathSegments = endpoint.path.slice(1, maxDepth + 1); // Skip "v1"
      const groupKey = pathSegments.join("/");

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(endpoint);
    }

    return this.createGroupsFromMap(groups, options);
  }

  /**
   * Group by category
   */
  private groupByCategory(
    endpoints: DiscoveredEndpoint[],
    options: GroupingOptions,
  ): EndpointGroup[] {
    const groups = new Map<string, DiscoveredEndpoint[]>();

    for (const endpoint of endpoints) {
      const definition = endpoint.definition[endpoint.method];
      const category =
        typeof definition?.category === "string"
          ? definition.category
          : "uncategorized";

      if (!groups.has(category)) {
        groups.set(category, []);
      }
      const group = groups.get(category);
      if (group) {
        group.push(endpoint);
      }
    }

    return this.createGroupsFromMap(groups, options);
  }

  /**
   * Group by HTTP method
   */
  private groupByMethod(
    endpoints: DiscoveredEndpoint[],
    options: GroupingOptions,
  ): EndpointGroup[] {
    const groups = new Map<string, DiscoveredEndpoint[]>();

    for (const endpoint of endpoints) {
      const method = endpoint.method;

      if (!groups.has(method)) {
        groups.set(method, []);
      }
      groups.get(method)!.push(endpoint);
    }

    return this.createGroupsFromMap(groups, options);
  }

  /**
   * Group by user roles
   */
  private groupByRole(
    endpoints: DiscoveredEndpoint[],
    options: GroupingOptions,
  ): EndpointGroup[] {
    const groups = new Map<string, DiscoveredEndpoint[]>();

    for (const endpoint of endpoints) {
      for (const role of endpoint.allowedRoles) {
        if (!groups.has(role)) {
          groups.set(role, []);
        }
        groups.get(role)!.push(endpoint);
      }
    }

    return this.createGroupsFromMap(groups, options);
  }

  /**
   * Group by tags
   */
  private groupByTag(
    endpoints: DiscoveredEndpoint[],
    options: GroupingOptions,
  ): EndpointGroup[] {
    const groups = new Map<string, DiscoveredEndpoint[]>();

    for (const endpoint of endpoints) {
      const definition = endpoint.definition[endpoint.method];
      const tags = Array.isArray(definition?.tags)
        ? definition.tags
        : ["untagged"];

      for (const tag of tags) {
        if (typeof tag === "string") {
          if (!groups.has(tag)) {
            groups.set(tag, []);
          }
          const group = groups.get(tag);
          if (group) {
            group.push(endpoint);
          }
        }
      }
    }

    return this.createGroupsFromMap(groups, options);
  }

  /**
   * Group by custom function
   */
  private groupByCustom(
    endpoints: DiscoveredEndpoint[],
    options: GroupingOptions,
  ): EndpointGroup[] {
    if (!options.customGroupFn) {
      return [];
    }

    const groups = new Map<string, DiscoveredEndpoint[]>();

    for (const endpoint of endpoints) {
      const groupKey = options.customGroupFn(endpoint);

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      const group = groups.get(groupKey);
      if (group) {
        group.push(endpoint);
      }
    }

    return this.createGroupsFromMap(groups, options);
  }

  /**
   * Create EndpointGroup objects from map
   */
  private createGroupsFromMap(
    groups: Map<string, DiscoveredEndpoint[]>,
    options: GroupingOptions,
  ): EndpointGroup[] {
    const minSize = options.minGroupSize || 1;
    const result: EndpointGroup[] = [];

    for (const [key, endpoints] of groups.entries()) {
      // Skip groups that are too small
      if (endpoints.length < minSize) {
        continue;
      }

      const pathSegments = key.split("/").filter(Boolean);

      result.push({
        id: key,
        name: this.formatGroupName(key),
        description: this.generateGroupDescription(key, endpoints),
        endpoints,
        metadata: {
          totalCount: endpoints.length,
          path: pathSegments,
          level: pathSegments.length,
        },
      });
    }

    // Sort groups
    return this.sortGroups(result, options);
  }

  /**
   * Format group name
   */
  private formatGroupName(key: string): string {
    return key
      .split("/")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" > ");
  }

  /**
   * Generate group description
   */
  private generateGroupDescription(
    _key: string,
    endpoints: DiscoveredEndpoint[],
  ): string {
    const methods = new Set(endpoints.map((e) => e.method));
    const count = endpoints.length;
    const plural = count > 1 ? "s" : "";
    const methodList = Array.from(methods).join(", ");
    return `${count} endpoint${plural} (${methodList})`;
  }

  /**
   * Sort groups
   */
  private sortGroups(
    groups: EndpointGroup[],
    options: GroupingOptions,
  ): EndpointGroup[] {
    const sortBy = options.sortBy || "name";
    const direction = options.sortDirection || "asc";
    const multiplier = direction === "asc" ? 1 : -1;

    return groups.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "count":
          comparison = a.metadata.totalCount - b.metadata.totalCount;
          break;
        case "path":
          comparison = a.metadata.path
            .join("/")
            .localeCompare(b.metadata.path.join("/"));
          break;
      }

      return comparison * multiplier;
    });
  }
}

/**
 * Singleton instance
 */
let instance: UnifiedGroupingService | null = null;

export function getUnifiedGrouping(): UnifiedGroupingService {
  if (!instance) {
    instance = new UnifiedGroupingService();
  }
  return instance;
}
