/**
 * useEndpoint Hook
 * A comprehensive hook that provides all CRUD operations for an endpoints object
 * Automatically detects available methods and provides corresponding functionality
 *
 * Features:
 * - Create operations with full form functionality (based on useApiForm)
 * - Read operations with query form functionality (based on useApiQueryForm)
 * - Delete operations with mutation functionality
 * - Auto-prefilling from GET endpoint data (server-side only)
 * - Form clearing based on environment and debug settings
 * - Type-safe with full TypeScript inference
 * - Simple interface with sane defaults
 *
 * Note: Local storage functionality has been removed for better performance and simplicity
 */

"use client";

// Re-export types and utilities
export * from "./types";
// Re-export the main hook
export { useEndpoint } from "./use-endpoint";
// Re-export individual operation hooks
export { useEndpointCreate } from "./use-endpoint-create";
export { useEndpointDelete } from "./use-endpoint-delete";
export { useEndpointRead } from "./use-endpoint-read";
export * from "./utils";
