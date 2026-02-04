/**
 * Route Constraint Tests
 *
 * Tests constraint validation for endpoint creation and field configuration.
 */

import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../../unified-ui/widgets/_shared/types";
import type { CreateApiEndpoint } from "../../endpoints/definition/create";
import { objectField } from "../../field/utils";
import type { UnifiedField } from "../../types/endpoint";
import { WidgetType } from "../../types/enums";
import type { RequestResponseWidgetConfig } from "../../widgets/configs";
import type { CreateApiEndpointAny } from "../endpoint-base";
import type { Methods } from "../enums";

// ============================================================================
// STEP 1: Test TKey variance - can specific TKey extend string?
// ============================================================================

// Test 1.1: Specific literal TKey extends string
type Test1_1_LiteralExtendsString = "app.test.label" extends string
  ? "PASS"
  : "FAIL";
const test1_1: Test1_1_LiteralExtendsString = "PASS";

// ============================================================================
// STEP 2: Test WidgetConfig<TKey> variance
// ============================================================================

// Test 2.1: WidgetConfig with specific TKey extends WidgetConfig<string>
type Test2_1_WidgetConfigVariance =
  UnifiedField<
    "app.test",
    z.ZodTypeAny,
    FieldUsageConfig,
    never
  > extends UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, never>
    ? "PASS"
    : "FAIL";
const test2_1: Test2_1_WidgetConfigVariance = "PASS";

// ============================================================================
// STEP 3: Test PrimitiveField variance
// ============================================================================

// Test 3.1: PrimitiveField with specific TKey extends UnifiedField<string, z.ZodTypeAny>
type Test3_1_PrimitiveFieldVariance =
  RequestResponseWidgetConfig<
    "app.test",
    z.ZodString,
    FieldUsageConfig,
    "primitive"
  > extends UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, never>
    ? "PASS"
    : "FAIL";
const test3_1: Test3_1_PrimitiveFieldVariance = "PASS";

// ============================================================================
// STEP 4: Test ObjectField variance
// ============================================================================

// Test 4.1: ObjectField with specific TKey extends UnifiedField<string, z.ZodTypeAny>
// Tests that an objectField with specific literal TKey extends generic UnifiedField
const test4_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {},
);

type Test4_1_ObjectFieldVariance =
  typeof test4_1_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "PASS"
    : "FAIL";
const test4_1: Test4_1_ObjectFieldVariance = "PASS";

// Test 4.2: ObjectField with children extends UnifiedField<string, z.ZodTypeAny>
// Tests that an objectField containing nested fields extends the generic UnifiedField constraint
const test4_2_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    nested: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {},
    ),
  },
);

type Test4_2_ObjectFieldGeneric =
  typeof test4_2_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "PASS"
    : "FAIL";
const test4_2: Test4_2_ObjectFieldGeneric = "PASS";

// ============================================================================
// STEP 5: Test UserRoleValue array variance
// ============================================================================

// Test 5.1: Specific UserRoleValue literal extends UserRoleValue
type SpecificRole = "app.api.user.userRoles.enums.userRole.admin";
type Test5_1_SpecificRoleExtendsUnion = SpecificRole extends UserRoleValue
  ? "PASS"
  : "FAIL";
const test5_1: Test5_1_SpecificRoleExtendsUnion = "PASS";

// Test 5.2: Tuple of specific role extends readonly UserRoleValue[]
type Test5_2_TupleExtendsArray = readonly [
  SpecificRole,
] extends readonly UserRoleValue[]
  ? "PASS"
  : "FAIL";
const test5_2: Test5_2_TupleExtendsArray = "PASS";

// Test 5.3: Array of specific role extends readonly UserRoleValue[]
type Test5_3_ArrayExtendsArray =
  readonly SpecificRole[] extends readonly UserRoleValue[] ? "PASS" : "FAIL";
const test5_3: Test5_3_ArrayExtendsArray = "PASS";

// ============================================================================
// STEP 6: Test CreateApiEndpoint structure with proper constraints
// ============================================================================

type GenericEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  AnyChildrenConstrain<string, FieldUsageConfig>,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
>;

type Test6_1_GenericEndpointExtendsAny =
  GenericEndpoint extends CreateApiEndpointAny ? "PASS" : "FAIL";
const test6_1: Test6_1_GenericEndpointExtendsAny = "PASS";

// Test 6.2: CreateApiEndpoint with specific types extends CreateApiEndpointAny
type SpecificEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly [SpecificRole],
  string,
  AnyChildrenConstrain<string, FieldUsageConfig>,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
>;

type Test6_2_SpecificEndpointExtendsAny =
  SpecificEndpoint extends CreateApiEndpointAny ? "PASS" : "FAIL";
const test6_2: Test6_2_SpecificEndpointExtendsAny = "PASS";

// ============================================================================
// STEP 7: Test definitions object pattern (as used in route files)
// ============================================================================

// Test 7.1: Object with readonly POST property
interface DefinitionsObject {
  readonly POST: SpecificEndpoint;
}

type Test7_1_DefinitionsObjectExtends =
  DefinitionsObject extends Partial<Record<Methods, CreateApiEndpointAny>>
    ? "PASS"
    : "FAIL";
const test7_1: Test7_1_DefinitionsObjectExtends = "PASS";

// Test 7.2: as const object pattern
const syntheticDefinitions = {
  POST: {} as SpecificEndpoint,
} as const;

type Test7_2_AsConstPattern =
  typeof syntheticDefinitions extends Partial<
    Record<Methods, CreateApiEndpointAny>
  >
    ? "PASS"
    : "FAIL";
const test7_2: Test7_2_AsConstPattern = "PASS";

export {
  test1_1,
  test2_1,
  test3_1,
  test4_1,
  test4_2,
  test5_1,
  test5_2,
  test5_3,
  test6_1,
  test6_2,
  test7_1,
  test7_2,
};
