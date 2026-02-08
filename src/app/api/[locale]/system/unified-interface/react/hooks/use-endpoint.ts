"use client";

/**
 * NEW useEndpoint - Drop-in replacement with Zustand instance management
 *
 * This is the new implementation that provides a single shared instance
 * per unique endpoint + urlPathParams combination.
 *
 * To enable: Simply change imports from './use-endpoint' to './use-endpoint-new'
 * To revert: Change imports back to './use-endpoint'
 */

export {
  clearEndpointInstances,
  getEndpointInstanceCount,
  getEndpointInstanceDetails,
  useEndpointManaged as useEndpoint,
} from "./use-endpoint-store";

// Re-export types for convenience
export type { EndpointReturn, UseEndpointOptions } from "./endpoint-types";
