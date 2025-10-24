/**
 * Type Inference Tests
 *
 * This file contains type-level tests to ensure JWT payload type inference
 * works correctly based on endpoint roles. These tests will fail at compile-time
 * if the type inference breaks.
 *
 * DO NOT DELETE - This prevents regressions in type inference logic.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/definition";

import type { InferJwtPayloadTypeFromRoles } from "../types";

// Helper type to test if two types are exactly equal
type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

/**
 * TEST 1: Single PUBLIC role should infer JWTPublicPayloadType
 */
type Test1 = InferJwtPayloadTypeFromRoles<readonly ["PUBLIC"]>;
type Test1Check = Expect<Equal<Test1, JWTPublicPayloadType>>;

/**
 * TEST 2: Single ADMIN role should infer JwtPrivatePayloadType
 */
type Test2 = InferJwtPayloadTypeFromRoles<readonly ["ADMIN"]>;
type Test2Check = Expect<Equal<Test2, JwtPrivatePayloadType>>;

/**
 * TEST 3: Single CUSTOMER role should infer JwtPrivatePayloadType
 */
type Test3 = InferJwtPayloadTypeFromRoles<readonly ["CUSTOMER"]>;
type Test3Check = Expect<Equal<Test3, JwtPrivatePayloadType>>;

/**
 * TEST 4: Multiple roles with PUBLIC should infer union type
 */
type Test4 = InferJwtPayloadTypeFromRoles<readonly ["PUBLIC", "ADMIN"]>;
type Test4Check = Expect<Equal<Test4, JwtPayloadType>>;

/**
 * TEST 5: Multiple roles without PUBLIC should infer JwtPrivatePayloadType
 */
type Test5 = InferJwtPayloadTypeFromRoles<readonly ["ADMIN", "CUSTOMER"]>;
type Test5Check = Expect<Equal<Test5, JwtPrivatePayloadType>>;

/**
 * TEST 6: Mixed roles (PUBLIC + others) should infer union type
 */
type Test6 = InferJwtPayloadTypeFromRoles<
  readonly ["ADMIN", "PUBLIC", "CUSTOMER"]
>;
type Test6Check = Expect<Equal<Test6, JwtPayloadType>>;

/**
 * TEST 7: Single CLI_OFF role should infer JwtPrivatePayloadType
 */
type Test7 = InferJwtPayloadTypeFromRoles<readonly ["CLI_OFF"]>;
type Test7Check = Expect<Equal<Test7, JwtPrivatePayloadType>>;

// Export a dummy value to make this a valid module
export const TYPE_TESTS_PASS = true;

/**
 * INTEGRATION TEST: Test actual endpoint creation
 */
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { objectField } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { WidgetType, LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

// Test creating an endpoint with PUBLIC role
const testPublicEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["test"],
  title: "test" as any,
  description: "test" as any,
  category: "test" as any,
  tags: [] as any,
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField({ type: WidgetType.CONTAINER, layout: { type: LayoutType.STACKED } }, {}, {}),
  errorTypes: {} as any,
  successTypes: {} as any,
  examples: {} as any,
});

// Test creating an endpoint with ADMIN role
const testAdminEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["test"],
  title: "test" as any,
  description: "test" as any,
  category: "test" as any,
  tags: [] as any,
  allowedRoles: [UserRole.ADMIN] as const,
  fields: objectField({ type: WidgetType.CONTAINER, layout: { type: LayoutType.STACKED } }, {}, {}),
  errorTypes: {} as any,
  successTypes: {} as any,
  examples: {} as any,
});

// Check what allowedRoles type is preserved as
type PublicEndpointRoles = (typeof testPublicEndpoint)["allowedRoles"];
type AdminEndpointRoles = (typeof testAdminEndpoint)["allowedRoles"];

// These should be readonly ["PUBLIC"] and readonly ["ADMIN"] respectively
type PublicRolesCheck = PublicEndpointRoles extends readonly ["PUBLIC"] ? true : false;
type AdminRolesCheck = AdminEndpointRoles extends readonly ["ADMIN"] ? true : false;

/**
 * DIAGNOSTIC SECTION
 * Uncomment these lines to see what types are actually being inferred
 */

// type Debug1 = Test1;
// type Debug2 = Test2;
// type Debug3 = Test3;
// type Debug4 = Test4;
// type Debug5 = Test5;
// type Debug6 = Test6;
// type Debug7 = Test7;

/**
 * If you see errors above, the type inference is broken!
 *
 * Expected behavior:
 * - Single ["PUBLIC"] → JWTPublicPayloadType
 * - Single ["ADMIN"] or any other role → JwtPrivatePayloadType
 * - Multiple roles with PUBLIC → JwtPayloadType (union)
 * - Multiple roles without PUBLIC → JwtPrivatePayloadType
 */
