/**
 * Filter Utilities
 * Helper functions for filtering tools
 */

import "server-only";

import type { AIToolMetadata } from "./types";

/**
 * Filter tools by roles
 */
export function filterByRoles(
  tools: AIToolMetadata[],
  roles: string[],
): AIToolMetadata[] {
  if (roles.length === 0) {
    return tools;
  }

  return tools.filter((tool) =>
    tool.allowedRoles.some((role) => roles.includes(role)),
  );
}

/**
 * Filter tools by categories
 */
export function filterByCategories(
  tools: AIToolMetadata[],
  categories: string[],
): AIToolMetadata[] {
  if (categories.length === 0) {
    return tools;
  }

  return tools.filter(
    (tool) => tool.category && categories.includes(tool.category),
  );
}

/**
 * Filter tools by tags
 */
export function filterByTags(
  tools: AIToolMetadata[],
  tags: string[],
): AIToolMetadata[] {
  if (tags.length === 0) {
    return tools;
  }

  return tools.filter((tool) => tool.tags.some((tag) => tags.includes(tag)));
}

/**
 * Filter out manual tools
 */
export function excludeManualTools(tools: AIToolMetadata[]): AIToolMetadata[] {
  return tools.filter((tool) => !tool.isManualTool);
}

/**
 * Filter tools by search query
 */
export function filterBySearchQuery(
  tools: AIToolMetadata[],
  query: string,
): AIToolMetadata[] {
  if (!query) {
    return tools;
  }

  const lowerQuery = query.toLowerCase();

  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}

/**
 * Check if tool matches search query
 */
export function matchesSearchQuery(
  tool: AIToolMetadata,
  query: string,
): boolean {
  if (!query) {
    return true;
  }

  const lowerQuery = query.toLowerCase();

  return (
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Check if tool has any of the specified roles
 */
export function hasAnyRole(tool: AIToolMetadata, roles: string[]): boolean {
  if (roles.length === 0) {
    return true;
  }

  return tool.allowedRoles.some((role) => roles.includes(role));
}

/**
 * Check if tool has any of the specified tags
 */
export function hasAnyTag(tool: AIToolMetadata, tags: string[]): boolean {
  if (tags.length === 0) {
    return true;
  }

  return tool.tags.some((tag) => tags.includes(tag));
}

/**
 * Check if tool is in any of the specified categories
 */
export function isInAnyCategory(
  tool: AIToolMetadata,
  categories: string[],
): boolean {
  if (categories.length === 0) {
    return true;
  }

  return tool.category ? categories.includes(tool.category) : false;
}
