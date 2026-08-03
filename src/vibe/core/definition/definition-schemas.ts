/**
 * Definition-build context for `createEndpoint`.
 *
 * Everything in here answers the same question: what does the framework know at
 * MODULE-LOAD time, before any request exists? That answer is deployment-shaped
 * — it depends on which platforms a build ships and which roles its identity
 * layer defines — so it is deliberately kept out of `create.ts`, which is
 * otherwise pure type plumbing and identical in every build.
 *
 * Keeping this seam here is what lets `create.ts` stay a shared file: a vendored
 * copy of the framework that ships, say, only a CLI surface and a single role can
 * replace THIS module and leave the 1000-line builder untouched. Same pattern as
 * `env/paths.ts`, which parameterizes layout for the generators.
 */
import {
  filterUserPermissionRoles,
  UserRole,
  type UserPermissionRoleValue,
  type UserRoleValue,
} from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";
import {
  generateFormSchema,
  generateSchemaForUsage,
} from "../../unified-ui/_shared/utils";

import type { InferFormSchema, InferSchemaFromField } from "./endpoint";
import { FieldUsage } from "./enums";

/**
 * The four static schemas every endpoint definition carries, derived once from
 * its unified fields.
 */
export interface DefinitionSchemas<TFields> {
  readonly requestSchema: InferSchemaFromField<TFields, FieldUsage.RequestData>;
  readonly responseSchema: InferSchemaFromField<
    TFields,
    FieldUsage.ResponseData
  >;
  readonly requestUrlSchema: InferSchemaFromField<
    TFields,
    FieldUsage.RequestUrlParams
  >;
  readonly formSchema: InferFormSchema<TFields>;
}

/**
 * Build the static schemas for one definition.
 *
 * No request context exists yet at definition-build time (this runs once at
 * module load). The endpoint's own declared allowedRoles is the real, meaningful
 * role set for static schema visibility; Platform.NEXT_API is the framework's
 * existing convention for "no specific caller platform" (same fallback
 * runInProcessTyped uses). Actual per-request filtering happens later via
 * generateRoleFilteredRequestSchema with the real caller's platform.
 */
export function buildDefinitionSchemas<TFields>(
  fields: TFields,
  allowedRoles: readonly UserRoleValue[],
): DefinitionSchemas<TFields> {
  const definitionUserRoles: readonly (typeof UserPermissionRoleValue)[] =
    filterUserPermissionRoles(allowedRoles);
  const definitionPlatform = Platform.NEXT_API;

  return {
    requestSchema: generateSchemaForUsage<TFields, FieldUsage.RequestData>(
      fields,
      FieldUsage.RequestData,
      definitionUserRoles,
      definitionPlatform,
    ),
    responseSchema: generateSchemaForUsage<TFields, FieldUsage.ResponseData>(
      fields,
      FieldUsage.ResponseData,
      definitionUserRoles,
      definitionPlatform,
    ),
    requestUrlSchema: generateSchemaForUsage<
      TFields,
      FieldUsage.RequestUrlParams
    >(
      fields,
      FieldUsage.RequestUrlParams,
      definitionUserRoles,
      definitionPlatform,
    ),
    formSchema: generateFormSchema(
      fields,
      definitionUserRoles,
      definitionPlatform,
    ),
  };
}

/**
 * Whether callers of this endpoint must be authenticated.
 *
 * An endpoint needs auth unless it opts out by naming the PUBLIC role. Returned
 * as a thunk because it is exposed on the endpoint object as `() => boolean`.
 */
export function makeRequiresAuthentication(
  allowedRoles: readonly UserRoleValue[],
): () => boolean {
  const required = !allowedRoles.includes(UserRole.PUBLIC);
  return (): boolean => required;
}
