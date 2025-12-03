/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Handler Type Inference Tests
 *
 * This file contains type-level tests to ensure handler functions receive
 * the correct user type based on endpoint roles. These tests will fail at
 * compile-time if the type inference breaks.
 *
 * DO NOT DELETE - This prevents regressions in type inference logic.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  ApiHandlerProps,
  InferJwtPayloadTypeFromRoles,
  MethodHandlerConfig,
} from "../../endpoints/route/handler";
import type { EndpointHandlerConfig } from "../../endpoints/route/multi";

// Helper type to test if two types are exactly equal
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

/**
 * HANDLER TYPE INFERENCE TESTS
 * Test that handler functions receive the correct user type based on endpoint roles
 */

// Test endpoint with PUBLIC-only role
const testPublicOnlyEndpoint = createEndpoint({
  method: Methods.POST,
  path: ["test", "public-only"],
  title: "test" as any,
  description: "test" as any,
  category: "test" as any,
  tags: [],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
    {},
    {},
  ),
  errorTypes: {} as Record<
    string,
    { title: TranslationKey; description: TranslationKey }
  >,
  successTypes: {} as { title: TranslationKey; description: TranslationKey },
  examples: {
    requests: undefined,
    urlPathParams: undefined,
    responses: undefined,
  },
});

// Test endpoint with ADMIN-only role
const testAdminOnlyEndpoint = createEndpoint({
  method: Methods.POST,
  path: ["test", "admin-only"],
  title: "test" as any,
  description: "test" as any,
  category: "test" as any,
  tags: [],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
    {},
    {},
  ),
  errorTypes: {} as Record<
    string,
    { title: TranslationKey; description: TranslationKey }
  >,
  successTypes: {} as { title: TranslationKey; description: TranslationKey },
  examples: {
    requests: undefined,
    urlPathParams: undefined,
    responses: undefined,
  },
});

// Test endpoint with mixed roles (PUBLIC + ADMIN)
const testMixedRolesEndpoint = createEndpoint({
  method: Methods.POST,
  path: ["test", "mixed-roles"],
  title: "test" as any,
  description: "test" as any,
  category: "test" as any,
  tags: [],
  allowedRoles: [UserRole.PUBLIC, UserRole.ADMIN] as const,
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
    {},
    {},
  ),
  errorTypes: {} as Record<
    string,
    { title: TranslationKey; description: TranslationKey }
  >,
  successTypes: {} as { title: TranslationKey; description: TranslationKey },
  examples: {
    requests: undefined,
    urlPathParams: undefined,
    responses: undefined,
  },
});

// Extract allowedRoles types to verify they're preserved correctly
type PublicOnlyRoles = (typeof testPublicOnlyEndpoint.POST)["allowedRoles"];
type AdminOnlyRoles = (typeof testAdminOnlyEndpoint.POST)["allowedRoles"];
type MixedRoles = (typeof testMixedRolesEndpoint.POST)["allowedRoles"];

// Verify roles are exact tuple types, not widened arrays
type PublicOnlyRolesExact = Expect<
  Equal<PublicOnlyRoles, readonly [typeof UserRole.PUBLIC]>
>;
type AdminOnlyRolesExact = Expect<
  Equal<AdminOnlyRoles, readonly [typeof UserRole.ADMIN]>
>;
type MixedRolesExact = Expect<
  Equal<MixedRoles, readonly [typeof UserRole.PUBLIC, typeof UserRole.ADMIN]>
>;

// Test InferJwtPayloadTypeFromRoles with exact endpoint roles
type PublicOnlyUserType = InferJwtPayloadTypeFromRoles<PublicOnlyRoles>;
type AdminOnlyUserType = InferJwtPayloadTypeFromRoles<AdminOnlyRoles>;
type MixedRolesUserType = InferJwtPayloadTypeFromRoles<MixedRoles>;

// Verify inferred user types are correct
type PublicOnlyUserTypeCheck = Expect<
  Equal<PublicOnlyUserType, JWTPublicPayloadType>
>;
type AdminOnlyUserTypeCheck = Expect<
  Equal<AdminOnlyUserType, JwtPrivatePayloadType>
>;
type MixedRolesUserTypeCheck = Expect<
  Equal<MixedRolesUserType, JwtPayloadType>
>;

// Export a dummy value to make this a valid module
export const HANDLER_TYPE_TESTS_PASS = true;
