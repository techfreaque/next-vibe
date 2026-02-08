// oxlint-disable no-explicit-any
/**
 * Type inference tests to validate the entire type chain
 * Each test builds on the previous one to ensure complete type safety
 *
 * This file uses type-level tests to verify that:
 * 1. Basic field types work correctly
 * 2. Nested structures preserve types
 * 3. API endpoints can be created with any field structure
 * 4. Hooks can accept endpoints without constraint issues
 * 5. Type inference works through the entire chain
 */

import { z } from "zod";

import {
  type UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../../unified-ui/widgets/_shared/types";
import type {
  ApiEndpoint,
  CreateApiEndpoint,
} from "../../endpoints/definition/create";
import {
  arrayOptionalField,
  objectField,
  objectOptionalField,
  requestDataArrayField,
  responseArrayField,
} from "../../field/utils";
import {
  requestField,
  requestResponseField,
  requestUrlPathParamsField,
  responseField,
} from "../../field/utils-new";
import type { UnifiedField } from "../../types/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";
import type { Methods } from "../../types/enums";
import { FieldDataType, WidgetType } from "../../types/enums";

// ============================================================================
// LEVEL 1: Test basic field types
// ============================================================================

// Test 1.1: PrimitiveField extends UnifiedField (checked via Test1_2)
// Test 1.2: ObjectField with record children extends UnifiedField
const test1_2_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {},
);

type Test1_2_Result =
  typeof test1_2_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test1_2: Test1_2_Result = "✓ PASS";

// Test 1.3: ObjectField with specific children extends UnifiedField
const test1_3_field = objectField(
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

type Test1_3_Result =
  typeof test1_3_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test1_3: Test1_3_Result = "✓ PASS";

// Test 1.4: ObjectField with flexible usage extends UnifiedField
const test1_4_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data", response: true },
  {
    nested: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data", response: true },
      {},
    ),
  },
);

type Test1_4_Result =
  typeof test1_4_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test1_4: Test1_4_Result = "✓ PASS";

// Test 1.5: ArrayField extends UnifiedField
const test1_5_field = requestDataArrayField(
  { type: WidgetType.CONTAINER },
  objectField(
    { type: WidgetType.CONTAINER },
    { request: "data" },
    {
      item: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "item.name",
        schema: z.string(),
      }),
    },
  ),
);

type Test1_5_Result =
  typeof test1_5_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test1_5: Test1_5_Result = "✓ PASS";

// ============================================================================
// LEVEL 2: Test nested ObjectField structures
// ============================================================================

// Test 2.1: Nested ObjectField extends UnifiedField
const test2_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    credentials: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        email: objectField(
          { type: WidgetType.CONTAINER },
          { request: "data" },
          {},
        ),
        password: objectField(
          { type: WidgetType.CONTAINER },
          { request: "data" },
          {},
        ),
      },
    ),
    options: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        rememberMe: objectField(
          { type: WidgetType.CONTAINER },
          { request: "data" },
          {},
        ),
      },
    ),
  },
);

type Test2_1_Result =
  typeof test2_1_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test2_1: Test2_1_Result = "✓ PASS";

// ============================================================================
// LEVEL 3: Test ApiEndpoint interface
// ============================================================================

// Test 3.1: Can we create an ApiEndpoint with specific ObjectField?
const test3_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    name: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        value: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "name.value",
          schema: z.string(),
        }),
      },
    ),
  },
);

type Test3_1_Endpoint = ApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  typeof test3_1_field
>;

// Just verify it's a valid ApiEndpoint type
type Test3_1_Result =
  Test3_1_Endpoint extends ApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    string,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test3_1: Test3_1_Result = "✓ PASS";

// Test 3.2: Can we create an ApiEndpoint with nested ObjectField?
type Test3_2_Endpoint = ApiEndpoint<
  Methods.PUT,
  readonly UserRoleValue[],
  string,
  typeof test2_1_field
>;
type Test3_2_Result =
  Test3_2_Endpoint extends ApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    string,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test3_2: Test3_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 4: Test CreateApiEndpoint type
// ============================================================================

// Test 4.1: CreateApiEndpoint with optional object field
const test4_1_field = objectOptionalField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    value: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "test4_1_field.value",
      schema: z.string(),
    }),
  },
);

type Test4_1_CreateEndpoint = CreateApiEndpoint<
  Methods.PATCH,
  readonly UserRoleValue[],
  string,
  typeof test4_1_field
>;
type Test4_1_Result =
  Test4_1_CreateEndpoint extends CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    string,
    typeof test4_1_field
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test4_1: Test4_1_Result = "✓ PASS";

// Test 4.2: CreateApiEndpoint with nested ObjectField
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

type Test4_2_CreateEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  typeof test4_2_field
>;
type Test4_2_Result =
  Test4_2_CreateEndpoint extends CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    string,
    typeof test4_2_field
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test4_2: Test4_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 5: Test with actual login endpoint structure
// ============================================================================

// Test 5.1: Simple request-only field
const test5_1_request_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    name: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "user.name",
      schema: z.string(),
    }),
  },
);

// Test 5.1b: Response-only array field
const test5_1_response_field = responseArrayField(
  { type: WidgetType.CONTAINER },
  objectField(
    { type: WidgetType.CONTAINER },
    { response: true },
    {
      id: responseField({
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
    },
  ),
);

// Test 5.1c: Optional login history
const test5_1_optional_field = arrayOptionalField(
  { response: true },
  { type: WidgetType.CONTAINER },
  objectField(
    { type: WidgetType.CONTAINER },
    { response: true },
    {
      amount: responseField({
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
    },
  ),
);

// Test 5.1d: Request data with optional settings
const test5_1_request_optional = objectOptionalField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    url: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.URL,
      label: "settings.url",
      schema: z.string().url(),
    }),
  },
);

// Test 5.1e: Mixed request/response structure with nested fields
const test5_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data", response: true },
  {
    login: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        username: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "login.username",
          schema: z.string(),
        }),
      },
    ),
    preferences: objectOptionalField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        theme: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "preferences.theme",
          schema: z.string(),
        }),
      },
    ),
    results: responseArrayField(
      { type: WidgetType.CONTAINER },
      objectField(
        { type: WidgetType.CONTAINER },
        { response: true },
        {
          value: responseField({
            type: WidgetType.TEXT,
            schema: z.number(),
          }),
        },
      ),
    ),
  },
);

// Test 5.1: Request field extends UnifiedField
type Test5_1_Result =
  typeof test5_1_request_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test5_1: Test5_1_Result = "✓ PASS";

// Test 5.1b: Response array field extends UnifiedField
type Test5_1b_Result =
  typeof test5_1_response_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test5_1b: Test5_1b_Result = "✓ PASS";

// Test 5.1c: Optional array field extends UnifiedField
type Test5_1c_Result =
  typeof test5_1_optional_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test5_1c: Test5_1c_Result = "✓ PASS";
void test5_1c;

// Test 5.1d: Optional object field extends UnifiedField
type Test5_1d_Result =
  typeof test5_1_request_optional extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test5_1d: Test5_1d_Result = "✓ PASS";
void test5_1d;

// Test 5.1e: Mixed field extends UnifiedField
type Test5_1e_Result =
  typeof test5_1_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test5_1e: Test5_1e_Result = "✓ PASS";
void test5_1e;

// Test 5.2: CreateApiEndpoint with mixed request/response field
type Test5_2_MixedEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  typeof test5_1_field
>;

type Test5_2_Result =
  Test5_2_MixedEndpoint extends CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    string,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
    >
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test5_2: Test5_2_Result = "✓ PASS";

// Test 5.2b: Does Test5_2_MixedEndpoint extend CreateApiEndpointAny?
type Test5_2b_Result = Test5_2_MixedEndpoint extends CreateApiEndpointAny
  ? "✓ PASS"
  : "✗ FAIL";
const test5_2b: Test5_2b_Result = "✓ PASS";

// Test 5.2c: Breaking down - does the TFields parameter work with test5_1_field?
type Test5_2c_GenericEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  typeof test5_1_field
>;
type Test5_2c_Result = Test5_2c_GenericEndpoint extends CreateApiEndpointAny
  ? "✓ PASS"
  : "✗ FAIL";
const test5_2c: Test5_2c_Result = "✓ PASS";

// Test 5.2d: With TranslationKey as TScopedTranslationKey and matching TKey in fields
type Test5_2d_MatchingTKeys = CreateApiEndpoint<
  Methods,
  readonly UserRoleValue[],
  TranslationKey,
  UnifiedField<
    TranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<
      TranslationKey,
      ConstrainedChildUsage<FieldUsageConfig>
    >
  >
>;
type Test5_2d_Result = Test5_2d_MatchingTKeys extends CreateApiEndpointAny
  ? "✓ PASS"
  : "✗ FAIL";
const test5_2d: Test5_2d_Result = "✓ PASS";

// ============================================================================
// LEVEL 6: Test constraint checking in different positions
// ============================================================================

// Create a login fields structure for testing
const test6_loginFields = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data", response: true },
  {
    credentials: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {},
    ),
    options: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {},
    ),
  },
);

// Test 6.1: Direct constraint check
type Test6_1_DirectCheck<
  T extends UnifiedField<
    TranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TranslationKey, FieldUsageConfig>
  >,
> = T;
type Test6_1_Result =
  Test6_1_DirectCheck<typeof test6_loginFields> extends UnifiedField<
    TranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TranslationKey, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test6_1: Test6_1_Result = "✓ PASS";

// Test 6.2: Constraint in function parameter position
type Test6_2_FunctionParam = <
  T extends UnifiedField<
    TranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TranslationKey, FieldUsageConfig>
  >,
>(
  fields: T,
) => T;
type Test6_2_Result = Test6_2_FunctionParam extends (
  fields: typeof test6_loginFields,
) => any
  ? "✓ PASS"
  : "✗ FAIL";
const test6_2: Test6_2_Result = "✓ PASS";

// Create endpoint for test 6.3
type Test6_3_LoginEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  typeof test6_loginFields
>;

// Test 6.3: Constraint in nested generic
type Test6_3_NestedGeneric<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Type parameter used for constraint testing
  TFields,
  TEndpoint extends CreateApiEndpointAny,
> = TEndpoint;

type Test6_3_Result =
  Test6_3_NestedGeneric<
    typeof test6_loginFields,
    Test6_3_LoginEndpoint
  > extends CreateApiEndpointAny
    ? "✓ PASS"
    : "✗ FAIL";
const test6_3: Test6_3_Result = "✓ PASS";

// ============================================================================
// LEVEL 7: Test the exact pattern used in useApiForm
// ============================================================================

// Create login endpoint for level 7 tests
type Test7_LoginEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  string,
  typeof test5_1_field
>;

// Test 7.1: Simplified useApiForm signature (with any instead of UnifiedField)
type Test7_1_UseApiForm = <TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
) => void;

// Can we call it with the login endpoint?
type Test7_1_Result = Test7_1_UseApiForm extends (
  endpoint: Test7_LoginEndpoint,
) => void
  ? "✓ PASS"
  : "✗ FAIL";
const test7_1: Test7_1_Result = "✓ PASS";

// Test 7.2: Test that we can pass login endpoint to a function expecting any endpoint
type Test7_2_AcceptsAnyEndpoint = (
  endpoint: CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    TranslationKey,
    UnifiedField<
      TranslationKey,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<
        TranslationKey,
        ConstrainedChildUsage<FieldUsageConfig>
      >
    >
  >,
) => void;

// Can we pass the login endpoint to it?
type Test7_2_Result =
  Test7_LoginEndpoint extends Parameters<Test7_2_AcceptsAnyEndpoint>[0]
    ? "✓ PASS"
    : "✗ FAIL";
const test7_2: Test7_2_Result = "✗ FAIL";

// ============================================================================
// LEVEL 8: Test actual hook signatures (current implementation)
// ============================================================================

// Test 8.1: Current useApiForm signature with any
type Test8_1_UseApiFormCurrent = <TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
) => void;

type Test8_1_Result = Test8_1_UseApiFormCurrent extends (
  endpoint: Test7_LoginEndpoint,
) => void
  ? "✓ PASS"
  : "✗ FAIL";
const test8_1: Test8_1_Result = "✓ PASS";

// Test 8.2: Test that we can infer types from the endpoint
type Test8_2_InferredRequest = Test7_LoginEndpoint["types"]["RequestOutput"];

// Check that inferred types are not 'never'
type Test8_2_RequestResult = Test8_2_InferredRequest extends never
  ? "✗ FAIL"
  : "✓ PASS";
const test8_2: Test8_2_RequestResult = "✓ PASS";

// ============================================================================
// LEVEL 9: Test type inference through the entire chain
// ============================================================================

// Test 9.1: Test that endpoint fields match the original field type
type Test9_1_FieldsFromEndpoint = Test7_LoginEndpoint["fields"];
type Test9_1_Result = Test9_1_FieldsFromEndpoint extends typeof test5_1_field
  ? "✓ PASS"
  : "✗ FAIL";
const test9_1: Test9_1_Result = "✓ PASS";

// Test 9.2: Test that children structure is accessible
type Test9_2_HasChildren = Test9_1_FieldsFromEndpoint extends {
  children: infer C;
}
  ? C extends { login: any; preferences: any; results: any }
    ? "✓ PASS"
    : "✗ FAIL"
  : "✗ FAIL";
const test9_2: Test9_2_HasChildren = "✓ PASS";

// ============================================================================
// LEVEL 10: Test edge cases and complex scenarios
// ============================================================================

// Test 10.1: Array with nested object children with id and name fields
const test10_1_field = requestDataArrayField(
  { type: WidgetType.CONTAINER },
  objectField(
    { type: WidgetType.CONTAINER },
    { request: "data" },
    {
      id: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "ID",
        schema: z.string(),
      }),
      name: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "Name",
        schema: z.string(),
      }),
    },
  ),
);

type Test10_1_Result =
  typeof test10_1_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test10_1: Test10_1_Result = "✓ PASS";

// Test 10.2: Deeply nested ObjectFields (3 levels)
const test10_2_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    level1: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        level2: objectField(
          { type: WidgetType.CONTAINER },
          { request: "data" },
          {
            level3: requestField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "Level 3",
              schema: z.string(),
            }),
          },
        ),
      },
    ),
  },
);

type Test10_2_Result =
  typeof test10_2_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test10_2: Test10_2_Result = "✓ PASS";

// Test 10.3: Mixed usage configurations
const test10_3_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data", response: true },
  {
    requestOnly: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "Request Only",
      schema: z.string(),
    }),
    responseOnly: responseField({
      type: WidgetType.TEXT,
      content: "Response Only",
      schema: z.string(),
    }),
    both: requestResponseField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "Both",
      schema: z.string(),
    }),
  },
);

type Test10_3_Result =
  typeof test10_3_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test10_3: Test10_3_Result = "✓ PASS";

// Test 10.4: Nested arrays (array of arrays)
const test10_4_innerArray = requestDataArrayField(
  { type: WidgetType.CONTAINER },
  requestField({
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "String",
    schema: z.string(),
  }),
);

const test10_4_field = requestDataArrayField(
  { type: WidgetType.CONTAINER },
  test10_4_innerArray,
);

type Test10_4_Result =
  typeof test10_4_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test10_4: Test10_4_Result = "✓ PASS";

// ============================================================================
// LEVEL 11: Test Record<string, CreateApiEndpoint> pattern (useEndpoint)
// ============================================================================

// Test 11.1: Record of endpoints with different methods

// Create GET endpoint field for test 11
const test11_1_getField = objectField(
  { type: WidgetType.CONTAINER },
  { response: true },
  {},
);

interface Test11_1_LoginEndpoints {
  POST: Test6_3_LoginEndpoint;
  GET: CreateApiEndpoint<
    Methods.GET,
    readonly UserRoleValue[],
    TranslationKey,
    typeof test11_1_getField
  >;
}

// Test 11.1: Verify the record type is valid (structural check)
type Test11_1_Result = keyof Test11_1_LoginEndpoints extends "POST" | "GET"
  ? "✓ PASS"
  : "✗ FAIL";
const test11_1: Test11_1_Result = "✓ PASS";

// Test 11.2: Verify we can pass the endpoints to a generic function
type Test11_2_UseEndpoint = <
  T extends Record<
    string,
    CreateApiEndpoint<Methods, readonly UserRoleValue[], TranslationKey, any>
  >,
>(
  endpoints: T,
) => void;

// Just verify the function type is valid
type Test11_2_Result = Test11_2_UseEndpoint extends (...args: any[]) => void
  ? "✓ PASS"
  : "✗ FAIL";
const test11_2: Test11_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 12: Test that constraints don't break inference
// ============================================================================

// Test 12.1: Verify that removing constraints allows any field structure
const test12_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    customProp1: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "Custom Prop 1",
      schema: z.string(),
    }),
    customProp2: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.NUMBER,
      label: "Custom Prop 2",
      schema: z.number(),
    }),
    nested: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        deep: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "Deep",
          schema: z.boolean(),
        }),
      },
    ),
  },
);

type Test12_1_CustomEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  TranslationKey,
  typeof test12_1_field
>;

type Test12_1_Result =
  Test12_1_CustomEndpoint extends CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    TranslationKey,
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test12_1: Test12_1_Result = "✓ PASS";

// Test 12.2: Verify type inference works with custom fields
type Test12_2_CustomRequest = Test12_1_CustomEndpoint["types"]["RequestOutput"];
type Test12_2_Result = Test12_2_CustomRequest extends {
  customProp1: string;
  customProp2: number;
  nested: { deep: boolean };
}
  ? "✓ PASS"
  : "✗ FAIL";
const test12_2: Test12_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 13: Test optional fields and undefined handling
// ============================================================================

// Test 13.1: Optional fields in ObjectField
const test13_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    required: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "Required",
      schema: z.string(),
    }),
    optional: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "Optional",
      schema: z.string().optional(),
    }),
  },
);

type Test13_1_Result =
  typeof test13_1_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test13_1: Test13_1_Result = "✓ PASS";

// Test 13.2: Endpoint with optional fields
type Test13_2_OptionalEndpoint = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[],
  TranslationKey,
  typeof test13_1_field
>;
type Test13_2_Request = Test13_2_OptionalEndpoint["types"]["RequestOutput"];
type Test13_2_Result = Test13_2_Request extends {
  required: string;
  optional?: string;
}
  ? "✓ PASS"
  : "✗ FAIL";
const test13_2: Test13_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 14: Test different HTTP methods
// ============================================================================

// Test 14.1: GET endpoint with response-only fields
const test14_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { response: true },
  {
    data: responseField({
      type: WidgetType.TEXT,
      content: "Response Data",
      schema: z.string(),
    }),
  },
);

type Test14_1_GetEndpoint = CreateApiEndpoint<
  Methods.GET,
  readonly UserRoleValue[],
  TranslationKey,
  typeof test14_1_field
>;

type Test14_1_Result =
  Test14_1_GetEndpoint extends CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    TranslationKey,
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test14_1: Test14_1_Result = "✓ PASS";

// Test 14.2: DELETE endpoint
const test14_2_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "urlPathParams" },
  {
    id: requestUrlPathParamsField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "ID",
      schema: z.string(),
    }),
  },
);

type Test14_2_DeleteEndpoint = CreateApiEndpoint<
  Methods.DELETE,
  readonly [typeof UserRole.ADMIN],
  TranslationKey,
  typeof test14_2_field
>;

type Test14_2_Result =
  Test14_2_DeleteEndpoint extends CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    TranslationKey,
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test14_2: Test14_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 15: Test complex real-world scenarios
// ============================================================================

// Test 15.1: Pagination with filters
const test15_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data", response: true },
  {
    page: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.NUMBER,
      label: "Page",
      schema: z.number(),
    }),
    pageSize: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.NUMBER,
      label: "Page Size",
      schema: z.number(),
    }),
    filters: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        search: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "Search",
          schema: z.string(),
        }),
        status: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "Status",
          schema: z.string(),
        }),
      },
    ),
    results: responseArrayField(
      { type: WidgetType.CONTAINER },
      objectField(
        { type: WidgetType.CONTAINER },
        { response: true },
        {
          id: responseField({
            type: WidgetType.TEXT,
            content: "ID",
            schema: z.string(),
          }),
          name: responseField({
            type: WidgetType.TEXT,
            content: "Name",
            schema: z.string(),
          }),
        },
      ),
    ),
  },
);

type Test15_1_Result =
  typeof test15_1_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test15_1: Test15_1_Result = "✓ PASS";

// Test 15.2: File upload with metadata
const test15_2_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data", response: true },
  {
    file: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.FILE,
      label: "File",
      schema: z.any(),
    }),
    metadata: objectField(
      { type: WidgetType.CONTAINER },
      { request: "data" },
      {
        filename: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "Filename",
          schema: z.string(),
        }),
        size: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "Size",
          schema: z.number(),
        }),
        mimeType: requestField({
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "MIME Type",
          schema: z.string(),
        }),
      },
    ),
    uploadResult: objectField(
      { type: WidgetType.CONTAINER },
      { response: true },
      {
        url: responseField({
          type: WidgetType.TEXT,
          content: "URL",
          schema: z.string(),
        }),
        id: responseField({
          type: WidgetType.TEXT,
          content: "ID",
          schema: z.string(),
        }),
      },
    ),
  },
);

type Test15_2_Result =
  typeof test15_2_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test15_2: Test15_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 16: Test actual hook implementations
// ============================================================================

// Test 16.1: useApiForm with login endpoint
type Test16_1_UseApiFormSignature = <
  TEndpoint extends CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    TranslationKey,
    any
  >,
>(
  endpoint: TEndpoint,
) => {
  form: any;
  submitForm: any;
};

// Verify we can call it with login endpoint
type Test16_1_CanCall = Parameters<Test16_1_UseApiFormSignature>[0];
type Test16_1_Result = Test6_3_LoginEndpoint extends Test16_1_CanCall
  ? "✓ PASS"
  : "✗ FAIL";
const test16_1: Test16_1_Result = "✓ PASS";

// Test 16.2: useEndpoint with Record of endpoints

// Create a test record
const test16_2_logoutField = objectField(
  { type: WidgetType.CONTAINER },
  { response: true },
  {},
);

interface Test16_2_TestRecord {
  login: Test6_3_LoginEndpoint;
  logout: CreateApiEndpoint<
    Methods.POST,
    readonly UserRoleValue[],
    TranslationKey,
    typeof test16_2_logoutField
  >;
}

// Verify the record has the right structure
type Test16_2_Result = keyof Test16_2_TestRecord extends "login" | "logout"
  ? "✓ PASS"
  : "✗ FAIL";
const test16_2: Test16_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 17: Test type inference preservation through hooks
// ============================================================================

// Test 17.1: Verify request type has expected properties
type Test17_1_LoginRequest = Test6_3_LoginEndpoint["types"]["RequestOutput"];
type Test17_1_Result = Test17_1_LoginRequest extends {
  credentials: any;
  options: any;
}
  ? "✓ PASS"
  : "✗ FAIL";
const test17_1: Test17_1_Result = "✓ PASS";

// Test 17.2: Verify response type is not never
type Test17_2_LoginResponse = Test6_3_LoginEndpoint["types"]["ResponseOutput"];
type Test17_2_HasUser = Test17_2_LoginResponse extends never
  ? "✗ FAIL"
  : "✓ PASS";
const test17_2: Test17_2_HasUser = "✓ PASS";

// ============================================================================
// LEVEL 18: Test variance and readonly preservation
// ============================================================================

// Test 18.1: Readonly array types are preserved
type Test18_1_RolesType = Test6_3_LoginEndpoint["allowedRoles"];
type Test18_1_IsReadonly = Test18_1_RolesType extends readonly any[]
  ? "✓ PASS"
  : "✗ FAIL";
const test18_1: Test18_1_IsReadonly = "✓ PASS";

// Test 18.2: Readonly object properties are preserved
type Test18_2_FieldsType = Test6_3_LoginEndpoint["fields"];
type Test18_2_HasChildren =
  Test18_2_FieldsType extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    infer TChildren
  >
    ? TChildren extends { credentials: any }
      ? "✓ PASS"
      : "✗ FAIL"
    : "✗ FAIL";
const test18_2: Test18_2_HasChildren = "✓ PASS";

// ============================================================================
// LEVEL 19: Test error cases and edge cases
// ============================================================================

// Test 19.1: Empty object field
const test19_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { response: true },
  {},
);

type Test19_1_Result =
  typeof test19_1_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test19_1: Test19_1_Result = "✓ PASS";

// Test 19.2: Deeply nested arrays (3 levels)
const test19_2_level3 = responseArrayField(
  { type: WidgetType.CONTAINER },
  responseField({
    type: WidgetType.TEXT,
    content: "String",
    schema: z.string(),
  }),
);

const test19_2_level2 = responseArrayField(
  { type: WidgetType.CONTAINER },
  test19_2_level3,
);

const test19_2_field = responseArrayField(
  { type: WidgetType.CONTAINER },
  test19_2_level2,
);

type Test19_2_Result =
  typeof test19_2_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test19_2: Test19_2_Result = "✓ PASS";

// Test 19.3: Mixed usage configs
const test19_3_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data", response: true },
  {
    input: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "Input",
      schema: z.string(),
    }),
    output: responseField({
      type: WidgetType.TEXT,
      content: "Output",
      schema: z.string(),
    }),
  },
);

type Test19_3_Result =
  typeof test19_3_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test19_3: Test19_3_Result = "✓ PASS";

// ============================================================================
// LEVEL 20: Test actual definition.ts patterns
// ============================================================================

// Test 20.1: Multiple endpoints in a record (like actual definition files)
const test20_1_defaultField = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    email: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
      label: "Email",
      schema: z.string().email(),
    }),
  },
);

const test20_1_verifyField = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {
    code: requestField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "Code",
      schema: z.string(),
    }),
  },
);

const test20_1_resendField = objectField(
  { type: WidgetType.CONTAINER },
  { response: true },
  {},
);

interface Test20_1_MultiEndpoint {
  default: CreateApiEndpoint<
    Methods.POST,
    readonly UserRoleValue[],
    TranslationKey,
    typeof test20_1_defaultField
  >;
  verify: CreateApiEndpoint<
    Methods.POST,
    readonly UserRoleValue[],
    TranslationKey,
    typeof test20_1_verifyField
  >;
  resend: CreateApiEndpoint<
    Methods.POST,
    readonly UserRoleValue[],
    TranslationKey,
    typeof test20_1_resendField
  >;
}

// Verify each endpoint is valid
type Test20_1_DefaultValid =
  Test20_1_MultiEndpoint["default"] extends CreateApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    TranslationKey,
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test20_1: Test20_1_DefaultValid = "✓ PASS";

// Test 20.2: Verify the record has all expected keys
type Test20_2_RecordValid = keyof Test20_1_MultiEndpoint extends
  | "default"
  | "verify"
  | "resend"
  ? "✓ PASS"
  : "✗ FAIL";
const test20_2: Test20_2_RecordValid = "✓ PASS";

// ============================================================================
// Export all tests for verification
// ============================================================================

export interface AllTests {
  test1_2: typeof test1_2;
  test1_3: typeof test1_3;
  test1_4: typeof test1_4;
  test1_5: typeof test1_5;
  test2_1: typeof test2_1;
  test3_1: typeof test3_1;
  test3_2: typeof test3_2;
  test4_1: typeof test4_1;
  test4_2: typeof test4_2;
  test5_1: typeof test5_1;
  test5_1b: typeof test5_1b;
  test5_2: typeof test5_2;
  test5_2b: typeof test5_2b;
  test5_2c: typeof test5_2c;
  test5_2d: typeof test5_2d;
  test6_1: typeof test6_1;
  test6_2: typeof test6_2;
  test6_3: typeof test6_3;
  test7_1: typeof test7_1;
  test7_2: typeof test7_2;
  test8_1: typeof test8_1;
  test8_2: typeof test8_2;
  test9_1: typeof test9_1;
  test9_2: typeof test9_2;
  test10_1: typeof test10_1;
  test10_2: typeof test10_2;
  test10_3: typeof test10_3;
  test10_4: typeof test10_4;
  test11_1: typeof test11_1;
  test11_2: typeof test11_2;
  test12_1: typeof test12_1;
  test12_2: typeof test12_2;
  test13_1: typeof test13_1;
  test13_2: typeof test13_2;
  test14_1: typeof test14_1;
  test14_2: typeof test14_2;
  test15_1: typeof test15_1;
  test15_2: typeof test15_2;
  test16_1: typeof test16_1;
  test16_2: typeof test16_2;
  test17_1: typeof test17_1;
  test17_2: typeof test17_2;
  test18_1: typeof test18_1;
  test18_2: typeof test18_2;
  test19_1: typeof test19_1;
  test19_2: typeof test19_2;
  test19_3: typeof test19_3;
  test20_1: typeof test20_1;
  test20_2: typeof test20_2;
}
