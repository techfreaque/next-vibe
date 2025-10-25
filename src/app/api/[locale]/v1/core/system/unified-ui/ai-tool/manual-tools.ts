/**
 * Manual Tools Registry
 * Defines manually implemented tools (not from endpoints)
 */

import "server-only";

import type { AIToolMetadata } from "./types";

/**
 * Get all manual tools
 */
export function getManualTools(): AIToolMetadata[] {
  return [
    {
      name: "search",
      displayName: "app.api.v1.core.agent.web.braveSearch.get.title",
      description: "app.api.v1.core.agent.web.braveSearch.get.description",
      icon: "search",
      category: "app.api.v1.core.agent.web.braveSearch.category",
      tags: ["search", "web", "information"],
      cost: 1, // 1 credit per search
      endpointId: "manual-brave-search",
      allowedRoles: ["PUBLIC", "CUSTOMER", "ADMIN"],
      isManualTool: true,
      parameters: undefined, // Schema is defined in the tool itself
    },
    // Add more manual tools here as needed
  ];
}

/**
 * Get manual tool by name
 */
export function getManualTool(name: string): AIToolMetadata | undefined {
  return getManualTools().find((tool) => tool.name === name);
}

/**
 * Check if a tool is manual
 */
export function isManualTool(name: string): boolean {
  return getManualTools().some((tool) => tool.name === name);
}
