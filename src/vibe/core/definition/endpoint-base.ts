/**
 * Base Endpoint Types
 *
 * Core types that can be imported by widget configs without circular dependencies.
 * This file must NOT import from widgets/configs.ts
 */

import type { z } from "zod";

import type { UserRoleValue } from "../../identity/roles/enum";
import type { UnifiedField } from "../../unified-ui/_shared/configs";
import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../unified-ui/_shared/types";
import type { CreateApiEndpoint } from "./create";
import type { Methods } from "./enums";

// ============================================================================
// FIELD USAGE CONFIGURATION
// ============================================================================

/**
 * Type alias for CreateApiEndpoint - accepts any generic parameters.
 * Uses the widest valid type for each parameter so every concrete endpoint
 * returned by createEndpoint() is assignable to this.
 */
export type CreateApiEndpointAny = CreateApiEndpoint<
  Methods,
  readonly UserRoleValue[],
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
  // oxlint-disable-next-line no-explicit-any
  any, // TEvents — any so both never (no events) and full event maps are assignable
  // oxlint-disable-next-line no-explicit-any
  any, // TChannel — any so both undefined (no channel) and any scope are assignable
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

export interface ApiSection {
  readonly GET?: CreateApiEndpointAny;
  readonly POST?: CreateApiEndpointAny;
  readonly PUT?: CreateApiEndpointAny;
  readonly PATCH?: CreateApiEndpointAny;
  readonly DELETE?: CreateApiEndpointAny;
  readonly [key: string]: CreateApiEndpointAny | ApiSection | undefined;
}
