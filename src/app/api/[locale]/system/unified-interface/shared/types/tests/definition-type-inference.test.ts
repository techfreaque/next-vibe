/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * IMAP Type Inference Tests
 *
 * This file contains type-level tests for IMAP endpoint type inference.
 * These tests will fail at compile-time if the type inference breaks.
 *
 * DO NOT DELETE - This prevents regressions in type inference logic.
 */

import type {
  ErrorResponseType,
  ResponseType,
  SuccessResponseType,
} from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type imapAccountsListDefinition from "@/app/api/[locale]/emails/imap-client/accounts/list/definition";
import type imapAccountTestDefinition from "@/app/api/[locale]/emails/imap-client/accounts/test/definition";
import type imapConfigDefinition from "@/app/api/[locale]/emails/imap-client/config/definition";
import type {
  DeleteEndpointTypes,
  EndpointReturn,
  ExtractEndpointTypes,
  GetEndpointTypes,
  PrimaryMutationTypes,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type {
  FieldUsageConfig,
  InferSchemaFromField,
  ObjectField,
  PrimitiveField,
  UnifiedField,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { WidgetConfig } from "@/app/api/[locale]/system/unified-interface/shared/widgets/configs";

// Helper type to test if two types are exactly equal
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

/**
 * IMAP ACCOUNTS LIST TYPE INFERENCE TEST
 * Test the actual imap accounts list definition that's failing
 */

// Step 1: Verify the definition structure
type ImapStep1_DefType = typeof imapAccountsListDefinition;
type ImapStep1_Check = "GET" extends keyof ImapStep1_DefType ? true : false;
type ImapStep1_Verify = Expect<Equal<ImapStep1_Check, true>>;

// Step 2: Extract GET endpoint
type ImapStep2_GetEndpoint = typeof imapAccountsListDefinition.GET;
type ImapStep2_Check = "types" extends keyof ImapStep2_GetEndpoint
  ? true
  : false;
type ImapStep2_Verify = Expect<Equal<ImapStep2_Check, true>>;

// Step 3: Extract ResponseOutput from types
type ImapStep3_ResponseOutput = typeof imapAccountsListDefinition.GET extends {
  types: { ResponseOutput: infer R };
}
  ? R
  : never;

// Step 4: Verify it has proper structure (not any or never)
type ImapStep4_IsNotNever = ImapStep3_ResponseOutput extends never
  ? false
  : true;
type ImapStep4_Verify = Expect<Equal<ImapStep4_IsNotNever, true>>;

// Step 4a: Debug - Extract the types property directly
type ImapStep4a_Types = (typeof imapAccountsListDefinition.GET)["types"];
type ImapStep4a_HasResponseOutput =
  "ResponseOutput" extends keyof ImapStep4a_Types ? true : false;
type ImapStep4a_Verify = Expect<Equal<ImapStep4a_HasResponseOutput, true>>;

// Step 4b: Debug - Check the TScopedTranslationKey type
type ImapStep4b_ScopedTranslationKey = ImapStep4a_Types["ScopedTranslationKey"];
type ImapStep4b_IsString = ImapStep4b_ScopedTranslationKey extends string
  ? true
  : false;
type ImapStep4b_Verify = Expect<Equal<ImapStep4b_IsString, true>>;

// Step 4c: Debug - Check the Fields type
type ImapStep4c_Fields = ImapStep4a_Types["Fields"];
type ImapStep4c_IsObjectField = ImapStep4c_Fields extends { type: "object" }
  ? true
  : false;
// type ImapStep4c_Verify = Expect<Equal<ImapStep4c_IsObjectField, true>>;

// Step 4c2: Debug - Fields is not never
type ImapStep4c2_IsNever = ImapStep4c_Fields extends never ? true : false;
type ImapStep4c2_IsNeverVerify = Expect<Equal<ImapStep4c2_IsNever, false>>;

// Step 4c3: Debug - Check fields from the actual endpoint, not via types property
type ImapStep4c3_DirectFields = typeof imapAccountsListDefinition.GET.fields;

// Step 4c3a: What keys does the fields type have?
type ImapStep4c3a_FieldKeys = keyof ImapStep4c3_DirectFields;
// Should include: type, children, usage, ui

// Step 4c3b: Check if 'type' is in the keys
type ImapStep4c3b_HasTypeKey = "type" extends keyof ImapStep4c3_DirectFields
  ? true
  : false;
type ImapStep4c3b_Verify = Expect<Equal<ImapStep4c3b_HasTypeKey, true>>;

// Step 4c3c: Extract the type value
type ImapStep4c3c_TypeValue = ImapStep4c3_DirectFields extends { type: infer T }
  ? T
  : "not-found";

// Step 4c3d: Check the ScopedTranslationKey from types
type ImapStep4c3d_ScopedTranslationKey =
  ImapStep4a_Types["ScopedTranslationKey"];
// This should be a union of all the translation keys used in the endpoint

// Step 4c3e: Test if a PrimitiveField pattern matches
type ImapStep4c3e_DirectFieldsExtendObjectField =
  ImapStep4c3_DirectFields extends ObjectField<
    infer _TChildren,
    infer _TUsage,
    infer TKey,
    infer _TUI
  >
    ? TKey
    : "no-match";
// If this is "no-match", the pattern doesn't match. If it's a string type, we can see what TKey is.

// Step 4c3f: Test if fields match the basic ObjectField structure
type ImapStep4c3f_HasObjectType = ImapStep4c3_DirectFields extends {
  type: "object";
}
  ? true
  : false;
type ImapStep4c3f_HasChildren = ImapStep4c3_DirectFields extends {
  children: infer C;
}
  ? C
  : "no-children";
type ImapStep4c3f_HasUsage = ImapStep4c3_DirectFields extends { usage: infer U }
  ? U
  : "no-usage";
type ImapStep4c3f_HasUI = ImapStep4c3_DirectFields extends { ui: infer UI }
  ? UI
  : "no-ui";

// Step 4c3g: Test just the type property
type ImapStep4c3g_TypeOnly = ImapStep4c3_DirectFields extends { type: "object" }
  ? true
  : false;
type ImapStep4c3g_TypeAny = ImapStep4c3_DirectFields extends { type: string }
  ? true
  : false;
type ImapStep4c3g_ExtractType = ImapStep4c3_DirectFields["type"];
// If type is widened to string, TypeAny will be true but TypeOnly will be false

type ImapStep4c3g_TypeOnlyVerify = Expect<Equal<ImapStep4c3g_TypeOnly, true>>;
type ImapStep4c3g_TypeAnyVerify = Expect<Equal<ImapStep4c3g_TypeAny, true>>;

// Step 4c4: Compare Fields type with direct fields
type ImapStep4c4_FieldsMatchDirect =
  ImapStep4c_Fields extends ImapStep4c3_DirectFields ? true : false;

// Step 4d: Debug - Check ResponseOutput directly from types property
type ImapStep4d_ResponseOutput = ImapStep4a_Types["ResponseOutput"];
type ImapStep4d_IsNotNever = ImapStep4d_ResponseOutput extends never
  ? false
  : true;
type ImapStep4d_Verify = Expect<Equal<ImapStep4d_IsNotNever, true>>;

// Step 5: Extract the response type using ExtractEndpointTypes
type ImapStep5_ExtractedTypes = ExtractEndpointTypes<
  typeof imapAccountsListDefinition.GET
>;
type ImapStep5_ResponseType = ImapStep5_ExtractedTypes["response"];

// Step 6: Verify extracted type has 'accounts' property
type ImapStep6_HasAccounts = "accounts" extends keyof ImapStep5_ResponseType
  ? true
  : false;

// Step 7: Test EndpointReturn type (what useEndpoint actually returns)

type ImapStep7_EndpointReturn = EndpointReturn<
  typeof imapAccountsListDefinition
>;

// Verify read property exists and is not never
type ImapStep7_HasRead = "read" extends keyof ImapStep7_EndpointReturn
  ? true
  : false;
type ImapStep7_ReadVerify = Expect<Equal<ImapStep7_HasRead, true>>;

// Extract the read property type
type ImapStep7_ReadType = ImapStep7_EndpointReturn["read"];

// Verify read is not never or undefined
type ImapStep7_ReadNotNever = ImapStep7_ReadType extends never ? false : true;
type ImapStep7_ReadNotNeverVerify = Expect<Equal<ImapStep7_ReadNotNever, true>>;

// Verify read has response property
type ImapStep7_ReadHasResponse = "response" extends keyof ImapStep7_ReadType
  ? true
  : false;
type ImapStep7_ReadHasResponseVerify = Expect<
  Equal<ImapStep7_ReadHasResponse, true>
>;

// Extract the response type from read
type ImapStep7_ResponseType = ImapStep7_ReadType extends { response: infer R }
  ? R
  : never;

// Verify response is ResponseType wrapped - check if it has 'success' property
type ImapStep7_ResponseIsResponseType = ImapStep7_ResponseType extends
  | { success: boolean }
  | undefined
  ? true
  : false;
type ImapStep7_ResponseIsResponseTypeVerify = Expect<
  Equal<ImapStep7_ResponseIsResponseType, true>
>;

// Extract the data type from ResponseType (when success = true)
type ImapStep7_DataType = ImapStep7_ResponseType extends
  | ResponseType<infer TData>
  | undefined
  ? TData
  : never;

// Verify data has accounts property
type ImapStep7_DataHasAccounts = "accounts" extends keyof ImapStep7_DataType
  ? true
  : false;
type ImapStep7_DataHasAccountsVerify = Expect<
  Equal<ImapStep7_DataHasAccounts, true>
>;

// Step 8: Verify accounts is an array
type ImapStep8_AccountsType = ImapStep7_DataType extends {
  accounts: infer A;
}
  ? A
  : never;
// Check if accounts is an array by verifying it extends readonly array
type ImapStep8_AccountsIsArray =
  ImapStep8_AccountsType extends readonly (infer _Item)[] ? true : false;
type ImapStep8_AccountsIsArrayVerify = Expect<
  Equal<ImapStep8_AccountsIsArray, true>
>;

// Step 9: Verify data type is properly typed (not never)
type ImapStep9_DataIsNotNever = ImapStep7_DataType extends never ? false : true;
type ImapStep9_DataIsNotNeverVerify = Expect<
  Equal<ImapStep9_DataIsNotNever, true>
>;

// ============================================================================
// PART 10: FIELD TYPE PATTERN MATCHING TESTS
// ============================================================================

// Test 10a: Extract the TKey from the ObjectField
type Test10a_FieldsType = typeof imapAccountsListDefinition.GET.fields;
type Test10a_ExtractTKey =
  Test10a_FieldsType extends ObjectField<
    infer _TChildren,
    infer _TUsage,
    infer TKey,
    infer _TUI
  >
    ? TKey
    : "no-match";
// This will show us what TKey the field has

// Test 10b: Check if a simple PrimitiveField matches with string TKey
type Test10b_SimplePrimitive = PrimitiveField<
  z.ZodString,
  { response: true },
  string
>;
type Test10b_MatchesWithString =
  Test10b_SimplePrimitive extends PrimitiveField<
    infer _TSchema,
    FieldUsageConfig,
    string
  >
    ? true
    : false;
type Test10b_Verify = Expect<Equal<Test10b_MatchesWithString, true>>;

// Test 10c: Check if a narrow TKey field matches with wide TKey pattern
type Test10c_NarrowPrimitive = PrimitiveField<
  z.ZodString,
  { response: true },
  "app.common.test"
>;
type Test10c_MatchesWithString =
  Test10c_NarrowPrimitive extends PrimitiveField<
    infer _TSchema,
    FieldUsageConfig,
    string
  >
    ? true
    : false;
type Test10c_Verify = Expect<Equal<Test10c_MatchesWithString, true>>;

// Test 10d: Check if wide TKey field matches with narrow TKey pattern
type WideUnion = "app.common.test" | "app.common.other";
type Test10d_WidePrimitive = PrimitiveField<
  z.ZodString,
  { response: true },
  string
>;
type Test10d_MatchesWithNarrow =
  Test10d_WidePrimitive extends PrimitiveField<
    infer _TSchema,
    FieldUsageConfig,
    WideUnion
  >
    ? true
    : false;
// With covariance (out), this should be FALSE because string is wider than WideUnion

// Test 10e: Check narrow matches wide (should be true with covariance)
type Test10e_NarrowField = PrimitiveField<
  z.ZodString,
  { response: true },
  "app.common.test"
>;
type Test10e_MatchesWithWide =
  Test10e_NarrowField extends PrimitiveField<
    infer _TSchema,
    FieldUsageConfig,
    WideUnion
  >
    ? true
    : false;
// With covariance, narrow should match wide if "app.common.test" extends WideUnion

// Test 10f: Check if the actual IMAP fields match ObjectField pattern
type Test10f_ImapFields = typeof imapAccountsListDefinition.GET.fields;
type Test10f_MatchesObjectFieldString =
  Test10f_ImapFields extends ObjectField<
    infer _TChildren,
    FieldUsageConfig,
    string
  >
    ? true
    : false;
type Test10f_Verify = Expect<Equal<Test10f_MatchesObjectFieldString, true>>;

// Test 10g: Extract ScopedTranslationKey and test pattern match with it
type Test10g_ScopedKey =
  typeof imapAccountsListDefinition.GET.types.ScopedTranslationKey;
type Test10g_MatchesWithScopedKey =
  Test10f_ImapFields extends ObjectField<
    infer _TChildren,
    FieldUsageConfig,
    Test10g_ScopedKey
  >
    ? true
    : false;
// This is the key test - does the field match when using the endpoint's ScopedTranslationKey?

// Test 10h: What is the actual TKey in the IMAP fields?
type Test10h_ExtractedTKey =
  Test10f_ImapFields extends ObjectField<
    infer _C,
    infer _U,
    infer TKey,
    infer _UI
  >
    ? TKey
    : "extraction-failed";

// Test 10i: Is the extracted TKey assignable to ScopedTranslationKey?
type Test10i_TKeyAssignable = Test10h_ExtractedTKey extends Test10g_ScopedKey
  ? true
  : false;

// Test 10j: Is ScopedTranslationKey assignable to the extracted TKey?
type Test10j_ScopedKeyAssignable =
  Test10g_ScopedKey extends Test10h_ExtractedTKey ? true : false;

// ============================================================================
// PART 11: INFER SCHEMA FROM FIELD TESTS
// ============================================================================

// Test 11a: Simple InferSchemaFromField with matching TKey
type Test11a_SimpleField = PrimitiveField<
  z.ZodString,
  { response: true },
  "test.key"
>;
type Test11a_InferredSchema = InferSchemaFromField<
  Test11a_SimpleField,
  FieldUsage.Response,
  "test.key"
>;
type Test11a_IsNotNever = Test11a_InferredSchema extends z.ZodNever
  ? false
  : true;
// Should be true if pattern matching works with exact TKey match

// Test 11b: InferSchemaFromField with string TKey (widest)
type Test11b_InferredSchemaString = InferSchemaFromField<
  Test11a_SimpleField,
  FieldUsage.Response,
  string
>;
type Test11b_IsNotNever = Test11b_InferredSchemaString extends z.ZodNever
  ? false
  : true;
// Should be true if covariance works

// Test 11c: InferSchemaFromField with union TKey that includes the field's key
type Test11c_UnionKey = "test.key" | "other.key";
type Test11c_InferredSchema = InferSchemaFromField<
  Test11a_SimpleField,
  FieldUsage.Response,
  Test11c_UnionKey
>;
type Test11c_IsNotNever = Test11c_InferredSchema extends z.ZodNever
  ? false
  : true;
// Should be true if covariance works

// Test 11d: InferSchemaFromField with union TKey that does NOT include the field's key
type Test11d_UnionKey = "other.key" | "another.key";
type Test11d_InferredSchema = InferSchemaFromField<
  Test11a_SimpleField,
  FieldUsage.Response,
  Test11d_UnionKey
>;
type Test11d_IsNotNever = Test11d_InferredSchema extends z.ZodNever
  ? false
  : true;
// This depends on how covariance works - "test.key" does NOT extend this union

// Test 11e: InferSchemaFromField on actual IMAP fields
type Test11e_ImapFields = typeof imapAccountsListDefinition.GET.fields;
type Test11e_ScopedKey =
  typeof imapAccountsListDefinition.GET.types.ScopedTranslationKey;
type Test11e_InferredSchema = InferSchemaFromField<
  Test11e_ImapFields,
  FieldUsage.Response,
  Test11e_ScopedKey
>;
type Test11e_IsNotNever = Test11e_InferredSchema extends z.ZodNever
  ? false
  : true;

// Test 11f: Try with string as TTranslationKey
type Test11f_InferredSchema = InferSchemaFromField<
  Test11e_ImapFields,
  FieldUsage.Response,
  string
>;
type Test11f_IsNotNever = Test11f_InferredSchema extends z.ZodNever
  ? false
  : true;

// ============================================================================
// PART 12: SIMPLE FIELD CREATION AND INFERENCE TEST
// ============================================================================

// Test 12a: Create a simple field and check its TKey (using proper TextWidgetConfig with content)
const simpleTestField = responseField(
  { type: WidgetType.TEXT, content: "app.common.test" as const },
  {} as z.ZodString,
);
type Test12a_SimpleField = typeof simpleTestField;
type Test12a_ExtractTKey =
  Test12a_SimpleField extends PrimitiveField<
    infer _S,
    infer _U,
    infer TKey,
    infer _UI
  >
    ? TKey
    : "no-match";
// What is TKey here? Should be "app.common.test" if const preserves it

// Test 12b: Create an object field with children
const containerField = objectField(
  { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
  { response: true },
  {
    name: responseField(
      { type: WidgetType.TEXT, content: "app.common.name" as const },
      {} as z.ZodString,
    ),
  },
);
type Test12b_ContainerField = typeof containerField;
type Test12b_ExtractTKey =
  Test12b_ContainerField extends ObjectField<
    infer _C,
    infer _U,
    infer TKey,
    infer _UI
  >
    ? TKey
    : "no-match";

// Test 12c: Check if InferSchemaFromField works on this simple field
type Test12c_InferredSchema = InferSchemaFromField<
  Test12b_ContainerField,
  FieldUsage.Response,
  string
>;
type Test12c_IsNotNever = Test12c_InferredSchema extends z.ZodNever
  ? false
  : true;

// Test 12d: Check with the extracted TKey
type Test12d_InferredSchema = InferSchemaFromField<
  Test12b_ContainerField,
  FieldUsage.Response,
  Test12b_ExtractTKey
>;
type Test12d_IsNotNever = Test12d_InferredSchema extends z.ZodNever
  ? false
  : true;

// ============================================================================
// PART 13: DEEP DIVE INTO TKEY VARIANCE AND PATTERN MATCHING
// ============================================================================

// Test 13a: What is the actual TKey in IMAP fields? (extracted earlier as Test10h)
// If this shows "string", the field helpers are widening TKey
// If this shows a narrow union or literal, const is working

// Test 13b: Check if ObjectField with TKey=string matches ObjectField with TKey=narrow
type EmptyChildren = Record<string, never>;
type Test13b_StringToNarrow =
  ObjectField<EmptyChildren, { response: true }, string> extends ObjectField<
    EmptyChildren,
    { response: true },
    "narrow"
  >
    ? true
    : false;
// With covariance (out), string does NOT extend narrow, so this should be FALSE

// Test 13c: Check if ObjectField with TKey=narrow matches ObjectField with TKey=string
type Test13c_NarrowToString =
  ObjectField<EmptyChildren, { response: true }, "narrow"> extends ObjectField<
    EmptyChildren,
    { response: true },
    string
  >
    ? true
    : false;
// With covariance (out), narrow DOES extend string, so this should be TRUE
type Test13c_Verify = Expect<Equal<Test13c_NarrowToString, true>>;

// Test 13d: What is TUIConfig in IMAP fields?
type Test13d_ImapUI =
  Test10f_ImapFields extends ObjectField<infer _C, infer _U, infer _K, infer UI>
    ? UI
    : "no-ui";

// Test 13e: Does the IMAP UI extend WidgetConfig<string>?
type Test13e_UIExtendsWidgetConfigString =
  Test13d_ImapUI extends WidgetConfig<string> ? true : false;

// Test 13f: Manually check what type the objectField helper returns
// Look at the return type signature of objectField

// Test 13g: Check the children type
type Test13g_ImapChildren =
  Test10f_ImapFields extends ObjectField<infer C, infer _U, infer _K, infer _UI>
    ? C
    : "no-children";

// Test 13h: Check if children are valid UnifiedField<string>
type Test13h_ChildrenAreUnifiedFields =
  Test13g_ImapChildren extends Record<
    string,
    UnifiedField<string, z.ZodTypeAny>
  >
    ? true
    : false;

// Test 13i: Create a minimal ObjectField and test pattern matching
type Test13i_MinimalField = ObjectField<
  { name: PrimitiveField<z.ZodString, { response: true }, string> },
  { response: true },
  string
>;
type Test13i_MatchesString =
  Test13i_MinimalField extends ObjectField<infer _C, FieldUsageConfig, string>
    ? true
    : false;
type Test13i_Verify = Expect<Equal<Test13i_MatchesString, true>>;

// Test 13j: The key question - why doesn't IMAP fields match ObjectField<..., string>?
// Let's check each component separately

// 13j-1: Does the type match?
type Test13j1_TypeMatches = Test10f_ImapFields extends { type: "object" }
  ? true
  : false;
type Test13j1_Verify = Expect<Equal<Test13j1_TypeMatches, true>>;

// 13j-2: Does usage match FieldUsageConfig?
type Test13j2_UsageMatches = Test10f_ImapFields extends {
  usage: FieldUsageConfig;
}
  ? true
  : false;

// 13j-3: Does children match any record?
type Test13j3_ChildrenMatches = Test10f_ImapFields extends {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type testing requires unknown for runtime structure validation
  children: Record<string, unknown>;
}
  ? true
  : false;

// 13j-4: Does ui match WidgetConfig<string>?
type Test13j4_UIMatches = Test10f_ImapFields extends {
  ui: WidgetConfig<string>;
}
  ? true
  : false;

// 13j-5: Check without the UI constraint
type Test13j5_MatchesWithoutUI =
  Test10f_ImapFields extends ObjectField<infer _C, infer _U, string, infer _UI>
    ? true
    : false;

// 13j-6: Check without TKey constraint (use any string)
type Test13j6_MatchesAnyTKey =
  Test10f_ImapFields extends ObjectField<
    infer _C,
    infer _U,
    infer _TKey,
    infer _UI
  >
    ? true
    : false;

// ============================================================================
// PART 14: DEBUG - IS THE IMAP DEFINITION BROKEN?
// ============================================================================

// Test 14a: Is the GET endpoint defined?
type Test14a_GetExists = typeof imapAccountsListDefinition extends {
  GET: infer G;
}
  ? G
  : "no-get";
type Test14a_GetIsNotNever = Test14a_GetExists extends never ? false : true;
type Test14a_Verify = Expect<Equal<Test14a_GetIsNotNever, true>>;

// Test 14b: Is the fields property accessible?
type Test14b_FieldsAccessible = typeof imapAccountsListDefinition.GET extends {
  fields: infer F;
}
  ? F
  : "no-fields";
type Test14b_FieldsIsNotNever = Test14b_FieldsAccessible extends never
  ? false
  : true;
type Test14b_Verify = Expect<Equal<Test14b_FieldsIsNotNever, true>>;

// Test 14c: Direct typeof check on fields
type Test14c_DirectFields = typeof imapAccountsListDefinition.GET.fields;
type Test14c_IsNever = Test14c_DirectFields extends never ? true : false;
// We expect fields to NOT be never, so IsNever should be false
type Test14c_Verify = Expect<Equal<Test14c_IsNever, false>>;

// Test 14d: What keys does the fields object have?
type Test14d_FieldKeys = keyof Test14c_DirectFields;
// Should include: type, children, usage, ui, etc.

// Test 14e: Is Test10f_ImapFields the same as Test14c_DirectFields?
type Test14e_AreSame = Test10f_ImapFields extends Test14c_DirectFields
  ? Test14c_DirectFields extends Test10f_ImapFields
    ? true
    : false
  : false;
type Test14e_Verify = Expect<Equal<Test14e_AreSame, true>>;

// Test 14f: Does the endpoint have a proper types object?
type Test14f_Types = typeof imapAccountsListDefinition.GET.types;
type Test14f_HasResponseOutput = "ResponseOutput" extends keyof Test14f_Types
  ? true
  : false;
type Test14f_Verify = Expect<Equal<Test14f_HasResponseOutput, true>>;

// Test 14g: What is ScopedTranslationKey in the types?
type Test14g_ScopedKey = Test14f_Types["ScopedTranslationKey"];
type Test14g_IsString = Test14g_ScopedKey extends string ? true : false;
type Test14g_Verify = Expect<Equal<Test14g_IsString, true>>;

// Test 14h: Is the endpoint method GET?
type Test14h_Method = typeof imapAccountsListDefinition.GET.method;

// ============================================================================
// PART 15: DIRECT OBJECTFIELD RETURN TYPE TEST
// ============================================================================

// Test 15a: Call objectField directly and check the return type
const directObjectField = objectField(
  { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
  { response: true },
  {},
);
type Test15a_DirectType = typeof directObjectField;

// Test 15b: Does this direct field have type: "object"?
type Test15b_HasTypeObject = Test15a_DirectType extends { type: "object" }
  ? true
  : false;
type Test15b_Verify = Expect<Equal<Test15b_HasTypeObject, true>>;

// Test 15c: Extract the type property
type Test15c_TypeProperty = Test15a_DirectType["type"];

// Test 15d: Does it match ObjectField pattern with string TKey?
type Test15d_MatchesObjectField =
  Test15a_DirectType extends ObjectField<infer _C, infer _U, string, infer _UI>
    ? true
    : false;
type Test15d_Verify = Expect<Equal<Test15d_MatchesObjectField, true>>;

// Test 15e: What is the TKey in the direct field?
type Test15e_ExtractTKey =
  Test15a_DirectType extends ObjectField<
    infer _C,
    infer _U,
    infer TKey,
    infer _UI
  >
    ? TKey
    : "no-match";

// Test 15f: Create field with explicit string literals for translation keys
const fieldWithLabels = objectField(
  {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    title: "app.common.container" as const,
  },
  { response: true },
  {
    test: responseField(
      { type: WidgetType.TEXT, content: "app.common.test" as const },
      {} as z.ZodString,
    ),
  },
);
type Test15f_FieldWithLabels = typeof fieldWithLabels;
type Test15f_HasTypeObject = Test15f_FieldWithLabels extends { type: "object" }
  ? true
  : false;
type Test15f_Verify = Expect<Equal<Test15f_HasTypeObject, true>>;

// Export a dummy value to make this a valid module
export const IMAP_TYPE_TESTS_PASS = true;
