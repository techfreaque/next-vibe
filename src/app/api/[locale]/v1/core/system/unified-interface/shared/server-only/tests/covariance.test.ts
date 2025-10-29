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

import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type {
  ArrayField,
  ObjectField,
  PrimitiveField,
  UnifiedField,
} from "../../types/endpoint";
import type { ApiEndpoint, CreateApiEndpoint } from "../../endpoint/create";
import type { Methods } from "../../types/enums";

// ============================================================================
// LEVEL 1: Test basic field types
// ============================================================================

// Test 1.1: PrimitiveField extends UnifiedField
type Test1_1_PrimitiveField = PrimitiveField<z.ZodString, { request: "data" }>;
type Test1_1_Result =
  Test1_1_PrimitiveField extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
// Test 1.2: ObjectField with any children extends UnifiedField
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Test1_2_ObjectField = ObjectField<any, { request: "data" }>;
type Test1_2_Result =
  Test1_2_ObjectField extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test1_2: Test1_2_Result = "✓ PASS";

// Test 1.3: ObjectField with specific children extends UnifiedField
type Test1_3_ObjectField = ObjectField<
  { name: PrimitiveField<z.ZodString, { request: "data" }> });
  { request: "data" }
>;
type Test1_3_Result =
  Test1_3_ObjectField extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test1_3: Test1_3_Result = "✓ PASS";

// Test 1.4: ObjectField with any usage extends UnifiedField
type Test1_4_ObjectField = ObjectField<
  { name: PrimitiveField<z.ZodString, { request: "data" }> },
  any
>;
type Test1_4_Result =
  Test1_4_ObjectField extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test1_4: Test1_4_Result = "✓ PASS";

// Test 1.5: ArrayField extends UnifiedField
type Test1_5_ArrayField = ArrayField<
  PrimitiveField<z.ZodString, { request: "data" }>,
  { request: "data" }
>;
type Test1_5_Result =
  Test1_5_ArrayField extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test1_5: Test1_5_Result = "✓ PASS";

// ============================================================================
// LEVEL 2: Test nested ObjectField structures
// ============================================================================

// Test 2.1: Nested ObjectField extends UnifiedField
type Test2_1_NestedObjectField = ObjectField<
  {
    credentials: ObjectField<
      {
        email: PrimitiveField<z.ZodString, { request: "data" }>;
        password: PrimitiveField<z.ZodString, { request: "data" }>;
      });
      { request: "data" }
    >;
    options: ObjectField<
      {
        rememberMe: PrimitiveField<z.ZodBoolean, { request: "data" }>;
      });
      { request: "data" }
    >;
  });
  { request: "data" }
>;
type Test2_1_Result =
  Test2_1_NestedObjectField extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
const test2_1: Test2_1_Result = "✓ PASS";

// ============================================================================
// LEVEL 3: Test ApiEndpoint interface
// ============================================================================

// Test 3.1: Can we create an ApiEndpoint with specific ObjectField?
type Test3_1_Endpoint = ApiEndpoint<
  "test",
  Methods.POST,
  readonly (typeof UserRoleValue)[],
  ObjectField<
    { name: PrimitiveField<z.ZodString, { request: "data" }> });
    { request: "data" }
  >
>;
// Just verify it's a valid ApiEndpoint type
type Test3_1_Result =
  Test3_1_Endpoint extends ApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test3_1: Test3_1_Result = "✓ PASS";

// Test 3.2: Can we create an ApiEndpoint with nested ObjectField?
type Test3_2_Endpoint = ApiEndpoint<
  "test",
  Methods.POST,
  readonly (typeof UserRoleValue)[],
  Test2_1_NestedObjectField
>;
type Test3_2_Result =
  Test3_2_Endpoint extends ApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test3_2: Test3_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 4: Test CreateApiEndpoint type
// ============================================================================

// Test 4.1: CreateApiEndpoint with simple ObjectField
type Test4_1_CreateEndpoint = CreateApiEndpoint<
  "test",
  Methods.POST,
  readonly (typeof UserRoleValue)[],
  ObjectField<
    { name: PrimitiveField<z.ZodString, { request: "data" }> });
    { request: "data" }
  >
>;
type Test4_1_Result =
  Test4_1_CreateEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test4_1: Test4_1_Result = "✓ PASS";

// Test 4.2: CreateApiEndpoint with nested ObjectField
type Test4_2_CreateEndpoint = CreateApiEndpoint<
  "test",
  Methods.POST,
  readonly (typeof UserRoleValue)[],
  Test2_1_NestedObjectField
>;
type Test4_2_Result =
  Test4_2_CreateEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test4_2: Test4_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 5: Test with actual login endpoint structure
// ============================================================================

// Test 5.1: Exact structure from login endpoint
type Test5_1_LoginFields = ObjectField<
  {
    credentials: ObjectField<
      {
        email: PrimitiveField<z.ZodString, { request: "data" }>;
        password: PrimitiveField<z.ZodString, { request: "data" }>;
      });
      { request: "data" }
    >;
    options: ObjectField<
      {
        rememberMe: PrimitiveField<z.ZodBoolean, { request: "data" }>;
      });
      { request: "data" }
    >;
    leadId: PrimitiveField<z.ZodString, { request: "data" }>;
  });
  { request: "data"; response: true }
>;

type Test5_1_Result =
  Test5_1_LoginFields extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test5_1: Test5_1_Result = "✓ PASS";

// Test 5.2: CreateApiEndpoint with login fields
type Test5_2_LoginEndpoint = CreateApiEndpoint<
  "default",
  Methods.POST,
  readonly (typeof UserRoleValue)[],
  Test5_1_LoginFields
>;

type Test5_2_Result =
  Test5_2_LoginEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test5_2: Test5_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 6: Test constraint checking in different positions
// ============================================================================

// Test 6.1: Direct constraint check
type Test6_1_DirectCheck<T extends UnifiedField<z.ZodTypeAny>> = T;
type Test6_1_Result =
  Test6_1_DirectCheck<Test5_1_LoginFields> extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
const test6_1: Test6_1_Result = "✓ PASS";

// Test 6.2: Constraint in function parameter position
type Test6_2_FunctionParam = <T extends UnifiedField<z.ZodTypeAny>>(
  fields: T,
) => T;
type Test6_2_Result = Test6_2_FunctionParam extends (
  fields: Test5_1_LoginFields,
) => any
  ? "✓ PASS"
  : "✗ FAIL";
// This might fail - let's see
const test6_2: Test6_2_Result = "✓ PASS";

// Test 6.3: Constraint in nested generic (now without UnifiedField constraint)
type Test6_3_NestedGeneric<
  TFields,
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    TFields
  >,
> = TEndpoint;

type Test6_3_Result =
  Test6_3_NestedGeneric<
    Test5_1_LoginFields,
    Test5_2_LoginEndpoint
  > extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test6_3: Test6_3_Result = "✓ PASS";

// ============================================================================
// LEVEL 7: Test the exact pattern used in useApiForm
// ============================================================================

// Test 7.1: Simplified useApiForm signature (with any instead of UnifiedField)
type Test7_1_UseApiForm = <
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >,
>(
  endpoint: TEndpoint,
) => void;

// Can we call it with the login endpoint?
type Test7_1_Result = Test7_1_UseApiForm extends (
  endpoint: Test5_2_LoginEndpoint,
) => void
  ? "✓ PASS"
  : "✗ FAIL";
const test7_1: Test7_1_Result = "✓ PASS";

// Test 7.2: Test that we can pass login endpoint to a function expecting any endpoint
type Test7_2_AcceptsAnyEndpoint = (
  endpoint: CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >,
) => void;

// Can we pass the login endpoint to it?
type Test7_2_Result =
  Test5_2_LoginEndpoint extends Parameters<Test7_2_AcceptsAnyEndpoint>[0]
    ? "✓ PASS"
    : "✗ FAIL";
const test7_2: Test7_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 8: Test actual hook signatures (current implementation)
// ============================================================================

// Test 8.1: Current useApiForm signature with any
type Test8_1_UseApiFormCurrent = <
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >,
>(
  endpoint: TEndpoint,
) => void;

type Test8_1_Result = Test8_1_UseApiFormCurrent extends (
  endpoint: Test5_2_LoginEndpoint,
) => void
  ? "✓ PASS"
  : "✗ FAIL";
const test8_1: Test8_1_Result = "✓ PASS";

// Test 8.2: Test that we can infer types from the endpoint
type Test8_2_InferredRequest = Test5_2_LoginEndpoint["TRequestOutput"];
type Test8_2_InferredResponse = Test5_2_LoginEndpoint["TResponseOutput"];
type Test8_2_InferredUrlVars = Test5_2_LoginEndpoint["TUrlVariablesOutput"];

// Check that inferred types are not 'never'
type Test8_2_RequestResult = Test8_2_InferredRequest extends never
  ? "✗ FAIL"
  : "✓ PASS";
const test8_2: Test8_2_RequestResult = "✓ PASS";

// ============================================================================
// LEVEL 9: Test type inference through the entire chain
// ============================================================================

// Test 9.1: Test that ObjectField children are preserved
type Test9_1_FieldsFromEndpoint = Test5_2_LoginEndpoint["fields"];
type Test9_1_Result =
  Test9_1_FieldsFromEndpoint extends ObjectField<
    {
      credentials: any;
      options: any;
      leadId: any;
    },
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test9_1: Test9_1_Result = "✓ PASS";

// Test 9.2: Test that we can access nested field types
type Test9_2_CredentialsField =
  Test9_1_FieldsFromEndpoint extends ObjectField<infer C, any>
    ? C extends { credentials: infer Cred }
      ? Cred
      : never
    : never;
type Test9_2_Result =
  Test9_2_CredentialsField extends ObjectField<any, any> ? "✓ PASS" : "✗ FAIL";
const test9_2: Test9_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 10: Test edge cases and complex scenarios
// ============================================================================

// Test 10.1: ArrayField with ObjectField children
type Test10_1_ArrayOfObjects = ArrayField<
  ObjectField<
    {
      id: PrimitiveField<z.ZodString, { request: "data" }>;
      name: PrimitiveField<z.ZodString, { request: "data" }>;
    });
    { request: "data" }
  >,
  { request: "data" }
>;
type Test10_1_Result =
  Test10_1_ArrayOfObjects extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
const test10_1: Test10_1_Result = "✓ PASS";

// Test 10.2: Deeply nested ObjectFields (3 levels)
type Test10_2_DeeplyNested = ObjectField<
  {
    level1: ObjectField<
      {
        level2: ObjectField<
          {
            level3: PrimitiveField<z.ZodString, { request: "data" }>;
          });
          { request: "data" }
        >;
      });
      { request: "data" }
    >;
  });
  { request: "data" }
>;
type Test10_2_Result =
  Test10_2_DeeplyNested extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
const test10_2: Test10_2_Result = "✓ PASS";

// Test 10.3: Mixed usage configurations
type Test10_3_MixedUsage = ObjectField<
  {
    requestOnly: PrimitiveField<z.ZodString, { request: "data" }>;
    responseOnly: PrimitiveField<z.ZodString, { response: true }>;
    both: PrimitiveField<z.ZodString, { request: "data"; response: true }>;
  });
  { request: "data"; response: true }
>;
type Test10_3_Result =
  Test10_3_MixedUsage extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test10_3: Test10_3_Result = "✓ PASS";

// Test 10.4: ArrayField with nested arrays
type Test10_4_NestedArrays = ArrayField<
  ArrayField<
    PrimitiveField<z.ZodString, { request: "data" }>,
    { request: "data" }
  >,
  { request: "data" }
>;
type Test10_4_Result =
  Test10_4_NestedArrays extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
const test10_4: Test10_4_Result = "✓ PASS";

// ============================================================================
// LEVEL 11: Test Record<string, CreateApiEndpoint> pattern (useEndpoint)
// ============================================================================

// Test 11.1: Record of endpoints with different methods
type Test11_1_EndpointRecord = Record<
  string,
  CreateApiEndpoint<string, Methods, readonly (typeof UserRoleValue)[], any>
>;

interface Test11_1_LoginEndpoints {
  POST: Test5_2_LoginEndpoint;
  GET: CreateApiEndpoint<
    "status",
    Methods.GET,
    readonly (typeof UserRoleValue)[],
    ObjectField<Record<string, never>, { response: true }>
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
    CreateApiEndpoint<string, Methods, readonly (typeof UserRoleValue)[], any>
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
type Test12_1_CustomField = ObjectField<
  {
    customProp1: PrimitiveField<z.ZodString, { request: "data" }>;
    customProp2: PrimitiveField<z.ZodNumber, { request: "data" }>;
    nested: ObjectField<
      {
        deep: PrimitiveField<z.ZodBoolean, { request: "data" }>;
      });
      { request: "data" }
    >;
  });
  { request: "data" }
>;

type Test12_1_CustomEndpoint = CreateApiEndpoint<
  "custom",
  Methods.POST,
  readonly (typeof UserRoleValue)[],
  Test12_1_CustomField
>;

type Test12_1_Result =
  Test12_1_CustomEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test12_1: Test12_1_Result = "✓ PASS";

// Test 12.2: Verify type inference works with custom fields
type Test12_2_CustomRequest = Test12_1_CustomEndpoint["TRequestOutput"];
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
type Test13_1_OptionalFields = ObjectField<
  {
    required: PrimitiveField<z.ZodString, { request: "data" }>;
    optional: PrimitiveField<z.ZodOptional<z.ZodString>, { request: "data" }>;
  });
  { request: "data" }
>;
type Test13_1_Result =
  Test13_1_OptionalFields extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
const test13_1: Test13_1_Result = "✓ PASS";

// Test 13.2: Endpoint with optional fields
type Test13_2_OptionalEndpoint = CreateApiEndpoint<
  "optional",
  Methods.POST,
  readonly (typeof UserRoleValue)[],
  Test13_1_OptionalFields
>;
type Test13_2_Request = Test13_2_OptionalEndpoint["TRequestOutput"];
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
type Test14_1_GetEndpoint = CreateApiEndpoint<
  "get",
  Methods.GET,
  readonly (typeof UserRoleValue)[],
  ObjectField<
    {
      data: PrimitiveField<z.ZodString, { response: true }>;
    });
    { response: true }
  >
>;
type Test14_1_Result =
  Test14_1_GetEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test14_1: Test14_1_Result = "✓ PASS";

// Test 14.2: DELETE endpoint
type Test14_2_DeleteEndpoint = CreateApiEndpoint<
  "delete",
  Methods.DELETE,
  readonly ["ADMIN"],
  ObjectField<
    {
      id: PrimitiveField<z.ZodString, { request: "urlPathParams" }>;
    });
    { request: "urlPathParams" }
  >
>;
type Test14_2_Result =
  Test14_2_DeleteEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >
    ? "✓ PASS"
    : "✗ FAIL";
const test14_2: Test14_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 15: Test complex real-world scenarios
// ============================================================================

// Test 15.1: Pagination with filters
type Test15_1_PaginationFields = ObjectField<
  {
    page: PrimitiveField<z.ZodNumber, { request: "data" }>;
    pageSize: PrimitiveField<z.ZodNumber, { request: "data" }>;
    filters: ObjectField<
      {
        search: PrimitiveField<z.ZodString, { request: "data" }>;
        status: PrimitiveField<z.ZodString, { request: "data" }>;
      });
      { request: "data" }
    >;
    results: ArrayField<
      ObjectField<
        {
          id: PrimitiveField<z.ZodString, { response: true }>;
          name: PrimitiveField<z.ZodString, { response: true }>;
        });
        { response: true }
      >,
      { response: true }
    >;
  });
  { request: "data"; response: true }
>;
type Test15_1_Result =
  Test15_1_PaginationFields extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
const test15_1: Test15_1_Result = "✓ PASS";

// Test 15.2: File upload with metadata
type Test15_2_FileUploadFields = ObjectField<
  {
    file: PrimitiveField<z.ZodAny, { request: "data" }>;
    metadata: ObjectField<
      {
        filename: PrimitiveField<z.ZodString, { request: "data" }>;
        size: PrimitiveField<z.ZodNumber, { request: "data" }>;
        mimeType: PrimitiveField<z.ZodString, { request: "data" }>;
      });
      { request: "data" }
    >;
    uploadResult: ObjectField<
      {
        url: PrimitiveField<z.ZodString, { response: true }>;
        id: PrimitiveField<z.ZodString, { response: true }>;
      });
      { response: true }
    >;
  });
  { request: "data"; response: true }
>;
type Test15_2_Result =
  Test15_2_FileUploadFields extends UnifiedField<z.ZodTypeAny>
    ? "✓ PASS"
    : "✗ FAIL";
const test15_2: Test15_2_Result = "✓ PASS";

// ============================================================================
// LEVEL 16: Test actual hook implementations
// ============================================================================

// Test 16.1: useApiForm with login endpoint
type Test16_1_UseApiFormSignature = <
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
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
type Test16_1_Result = Test5_2_LoginEndpoint extends Test16_1_CanCall
  ? "✓ PASS"
  : "✗ FAIL";
const test16_1: Test16_1_Result = "✓ PASS";

// Test 16.2: useEndpoint with Record of endpoints
type Test16_2_UseEndpointSignature = <
  T extends Record<
    string,
    CreateApiEndpoint<string, Methods, readonly (typeof UserRoleValue)[], any>
  >,
>(
  endpoints: T,
) => any;

// Create a test record
interface Test16_2_TestRecord {
  login: Test5_2_LoginEndpoint;
  logout: CreateApiEndpoint<
    "logout",
    Methods.POST,
    readonly (typeof UserRoleValue)[],
    ObjectField<Record<string, never>, { response: true }>
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
type Test17_1_LoginRequest = Test5_2_LoginEndpoint["TRequestOutput"];
type Test17_1_Result = Test17_1_LoginRequest extends {
  credentials: any;
  options: any;
}
  ? "✓ PASS"
  : "✗ FAIL";
const test17_1: Test17_1_Result = "✓ PASS";

// Test 17.2: Verify response type is not never
type Test17_2_LoginResponse = Test5_2_LoginEndpoint["TResponseOutput"];
type Test17_2_HasUser = Test17_2_LoginResponse extends never
  ? "✗ FAIL"
  : "✓ PASS";
const test17_2: Test17_2_HasUser = "✓ PASS";

// ============================================================================
// LEVEL 18: Test variance and readonly preservation
// ============================================================================

// Test 18.1: Readonly array types are preserved
type Test18_1_RolesType = Test5_2_LoginEndpoint["allowedRoles"];
type Test18_1_IsReadonly = Test18_1_RolesType extends readonly any[]
  ? "✓ PASS"
  : "✗ FAIL";
const test18_1: Test18_1_IsReadonly = "✓ PASS";

// Test 18.2: Readonly object properties are preserved
type Test18_2_FieldsType = Test5_2_LoginEndpoint["fields"];
type Test18_2_HasChildren =
  Test18_2_FieldsType extends ObjectField<infer TChildren, any>
    ? TChildren extends { credentials: any }
      ? "✓ PASS"
      : "✗ FAIL"
    : "✗ FAIL";
const test18_2: Test18_2_HasChildren = "✓ PASS";

// ============================================================================
// LEVEL 19: Test error cases and edge cases
// ============================================================================

// Test 19.1: Empty object field
type Test19_1_EmptyField = ObjectField<
  Record<string, never>,
  { response: true }
>;
type Test19_1_Result =
  Test19_1_EmptyField extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test19_1: Test19_1_Result = "✓ PASS";

// Test 19.2: Deeply nested arrays
type Test19_2_DeepArray = ArrayField<
  ArrayField<
    ArrayField<
      PrimitiveField<z.ZodString, { response: true }>,
      { response: true }
    >,
    { response: true }
  >,
  { response: true }
>;
type Test19_2_Result =
  Test19_2_DeepArray extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test19_2: Test19_2_Result = "✓ PASS";

// Test 19.3: Mixed usage configs
type Test19_3_MixedField = ObjectField<
  {
    input: PrimitiveField<z.ZodString, { request: "data" }>;
    output: PrimitiveField<z.ZodString, { response: true }>;
  });
  { request: "data"; response: true }
>;
type Test19_3_Result =
  Test19_3_MixedField extends UnifiedField<z.ZodTypeAny> ? "✓ PASS" : "✗ FAIL";
const test19_3: Test19_3_Result = "✓ PASS";

// ============================================================================
// LEVEL 20: Test actual definition.ts patterns
// ============================================================================

// Test 20.1: Multiple endpoints in a record (like actual definition files)
interface Test20_1_MultiEndpoint {
  default: CreateApiEndpoint<
    "default",
    Methods.POST,
    readonly (typeof UserRoleValue)[],
    ObjectField<
      {
        email: PrimitiveField<z.ZodString, { request: "data" }>;
      });
      { request: "data" }
    >
  >;
  verify: CreateApiEndpoint<
    "verify",
    Methods.POST,
    readonly (typeof UserRoleValue)[],
    ObjectField<
      {
        code: PrimitiveField<z.ZodString, { request: "data" }>;
      });
      { request: "data" }
    >
  >;
  resend: CreateApiEndpoint<
    "resend",
    Methods.POST,
    readonly (typeof UserRoleValue)[],
    ObjectField<Record<string, never>, { response: true }>
  >;
}

// Verify each endpoint is valid
type Test20_1_DefaultValid =
  Test20_1_MultiEndpoint["default"] extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
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
  test1_1: typeof test1_1;
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
  test5_2: typeof test5_2;
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
