/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * JWT Payload Type Inference Tests
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
} from "@/app/api/[locale]/user/auth/types";
import type { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import type { InferJwtPayloadTypeFromRoles } from "../../endpoints/route/handler";

// Helper type to test if two types are exactly equal
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/**
 * TEST 1: Single PUBLIC role should infer JWTPublicPayloadType
 */
type Test1 = InferJwtPayloadTypeFromRoles<readonly [typeof UserRole.PUBLIC]>;
type Test1Check = Expect<Equal<Test1, JWTPublicPayloadType>>;

/**
 * TEST 2: Single ADMIN role should infer JwtPrivatePayloadType
 */
type Test2 = InferJwtPayloadTypeFromRoles<readonly [typeof UserRole.ADMIN]>;
type Test2Check = Expect<Equal<Test2, JwtPrivatePayloadType>>;

/**
 * TEST 3: Single CUSTOMER role should infer JwtPrivatePayloadType
 */
type Test3 = InferJwtPayloadTypeFromRoles<readonly [typeof UserRole.CUSTOMER]>;
type Test3Check = Expect<Equal<Test3, JwtPrivatePayloadType>>;

/**
 * TEST 4: Multiple roles with PUBLIC should infer union type
 */
type Test4 = InferJwtPayloadTypeFromRoles<readonly [typeof UserRole.PUBLIC, typeof UserRole.ADMIN]>;
type Test4Check = Expect<Equal<Test4, JwtPayloadType>>;

/**
 * TEST 5: Multiple roles without PUBLIC should infer JwtPrivatePayloadType
 */
type Test5 = InferJwtPayloadTypeFromRoles<
  readonly [typeof UserRole.ADMIN, typeof UserRole.CUSTOMER]
>;
type Test5Check = Expect<Equal<Test5, JwtPrivatePayloadType>>;

/**
 * TEST 6: Mixed roles (PUBLIC + others) should infer union type
 */
type Test6 = InferJwtPayloadTypeFromRoles<
  readonly [typeof UserRole.ADMIN, typeof UserRole.PUBLIC, typeof UserRole.CUSTOMER]
>;
type Test6Check = Expect<Equal<Test6, JwtPayloadType>>;

/**
 * TEST 7: Single CLI_OFF role should infer JwtPrivatePayloadType
 */
type Test7 = InferJwtPayloadTypeFromRoles<readonly [typeof UserRole.CLI_OFF]>;
type Test7Check = Expect<Equal<Test7, JwtPrivatePayloadType>>;

// Export a dummy value to make this a valid module
export const JWT_PAYLOAD_TYPE_TESTS_PASS = true;
