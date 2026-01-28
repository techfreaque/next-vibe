/**
 * Base Endpoint Types
 *
 * Core types that can be imported by widget configs without circular dependencies.
 * This file must NOT import from widgets/configs.ts
 */

import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../unified-ui/widgets/_shared/types";
import type { CreateApiEndpoint } from "../endpoints/definition/create";
import type { UnifiedField } from "./endpoint";
import type { Methods } from "./enums";

// ============================================================================
// FIELD USAGE CONFIGURATION
// ============================================================================

/**
 * Type alias for CreateApiEndpoint - accepts any generic parameters
 * This is a branded type that any CreateApiEndpoint can be assigned to
 */
export type CreateApiEndpointAny = CreateApiEndpoint<
  Methods,
  readonly UserRoleValue[],
  string,
  AnyChildrenConstrain<string, FieldUsageConfig>,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any, // RequestInput
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any, // RequestOutput
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any, // ResponseInput
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any, // ResponseOutput
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any, // UrlVariablesInput
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any // UrlVariablesOutput
>;

/**
 * API section type for nested endpoint structure
 * Used in generated endpoints.ts file
 * Accepts CreateApiEndpoint with any type parameters or CreateEndpointReturnInMethod
 */
export interface ApiSection {
  readonly GET?: CreateApiEndpointAny;
  readonly POST?: CreateApiEndpointAny;
  readonly PUT?: CreateApiEndpointAny;
  readonly PATCH?: CreateApiEndpointAny;
  readonly DELETE?: CreateApiEndpointAny;
  readonly [key: string]: CreateApiEndpointAny | ApiSection | undefined;
}
