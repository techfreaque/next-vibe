/**
 * Centralized helper types for extracting types from endpoints
 * These helpers reduce duplication across hook types and component types
 */

import type { CreateApiEndpointAny } from "./endpoint";

// ============================================================================
// METHOD-SPECIFIC TYPE EXTRACTORS
// ============================================================================

/**
 * Extract Request types from GET endpoint
 */
export type GetRequest<T> = T extends { GET: CreateApiEndpointAny }
  ? T["GET"]["types"]["RequestOutput"]
  : never;

export type GetResponse<T> = T extends { GET: CreateApiEndpointAny }
  ? T["GET"]["types"]["ResponseOutput"]
  : never;

export type GetUrlVariables<T> = T extends { GET: CreateApiEndpointAny }
  ? T["GET"]["types"]["UrlVariablesOutput"]
  : never;

/**
 * Extract Request types from POST endpoint
 */
export type PostRequest<T> = T extends { POST: CreateApiEndpointAny }
  ? T["POST"]["types"]["RequestOutput"]
  : never;

export type PostResponse<T> = T extends { POST: CreateApiEndpointAny }
  ? T["POST"]["types"]["ResponseOutput"]
  : never;

export type PostUrlVariables<T> = T extends { POST: CreateApiEndpointAny }
  ? T["POST"]["types"]["UrlVariablesOutput"]
  : never;

/**
 * Extract Request types from PUT endpoint
 */
export type PutRequest<T> = T extends { PUT: CreateApiEndpointAny }
  ? T["PUT"]["types"]["RequestOutput"]
  : never;

export type PutResponse<T> = T extends { PUT: CreateApiEndpointAny }
  ? T["PUT"]["types"]["ResponseOutput"]
  : never;

export type PutUrlVariables<T> = T extends { PUT: CreateApiEndpointAny }
  ? T["PUT"]["types"]["UrlVariablesOutput"]
  : never;

/**
 * Extract Request types from PATCH endpoint
 */
export type PatchRequest<T> = T extends { PATCH: CreateApiEndpointAny }
  ? T["PATCH"]["types"]["RequestOutput"]
  : never;

export type PatchResponse<T> = T extends { PATCH: CreateApiEndpointAny }
  ? T["PATCH"]["types"]["ResponseOutput"]
  : never;

export type PatchUrlVariables<T> = T extends { PATCH: CreateApiEndpointAny }
  ? T["PATCH"]["types"]["UrlVariablesOutput"]
  : never;

/**
 * Extract Request types from DELETE endpoint
 */
export type DeleteRequest<T> = T extends { DELETE: CreateApiEndpointAny }
  ? T["DELETE"]["types"]["RequestOutput"]
  : never;

export type DeleteResponse<T> = T extends { DELETE: CreateApiEndpointAny }
  ? T["DELETE"]["types"]["ResponseOutput"]
  : never;

export type DeleteUrlVariables<T> = T extends { DELETE: CreateApiEndpointAny }
  ? T["DELETE"]["types"]["UrlVariablesOutput"]
  : never;

// ============================================================================
// PRIMARY MUTATION TYPE (POST > PUT > PATCH > DELETE)
// ============================================================================

/**
 * Get the primary mutation request type (prefers POST, then PUT, then PATCH, then DELETE)
 */
export type PrimaryMutationRequest<T> =
  PostRequest<T> extends never
    ? PutRequest<T> extends never
      ? PatchRequest<T> extends never
        ? DeleteRequest<T>
        : PatchRequest<T>
      : PutRequest<T>
    : PostRequest<T>;

export type PrimaryMutationResponse<T> =
  PostResponse<T> extends never
    ? PutResponse<T> extends never
      ? PatchResponse<T> extends never
        ? DeleteResponse<T>
        : PatchResponse<T>
      : PutResponse<T>
    : PostResponse<T>;

export type PrimaryMutationUrlVariables<T> =
  PostUrlVariables<T> extends never
    ? PutUrlVariables<T> extends never
      ? PatchUrlVariables<T> extends never
        ? DeleteUrlVariables<T>
        : PatchUrlVariables<T>
      : PutUrlVariables<T>
    : PostUrlVariables<T>;
