/**
 * Test to systematically reproduce and debug the endpoint assignability issue
 *
 * Error: CreateApiEndpoint<"default", Methods.POST, readonly ["..."], ...>
 * is not assignable to CreateApiEndpointAny
 */

import { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../../unified-ui/widgets/_shared/types";
import type {
  ApiEndpoint,
  CreateApiEndpoint,
  EndpointReadOptions,
} from "../../endpoints/definition/create";
import { objectField } from "../../field/utils";
import { requestUrlPathParamsField } from "../../field/utils-new";
import type {
  ExamplesList,
  ExtractInput,
  ExtractOutput,
  InferSchemaFromField,
  UnifiedField,
} from "../../types/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";
import type {
  EndpointErrorTypes,
  FieldUsage,
  Methods,
} from "../../types/enums";
import { FieldDataType, WidgetType } from "../../types/enums";

// ============================================================================
// LEVEL 1: Test basic type parameter assignability
// ============================================================================

// Test 1.1: Can a literal string extend string?
type Test1_1_LiteralString = "default" extends string ? "PASS" : "FAIL";
const test1_1: Test1_1_LiteralString = "PASS";

// Test 1.2: Can a union literal extend string?
type Test1_2_UnionLiteral = "default" | "failed" extends string
  ? "PASS"
  : "FAIL";
const test1_2: Test1_2_UnionLiteral = "PASS";

// Test 1.3: Can a specific Methods enum extend Methods?
type Test1_3_MethodsPost = Methods.POST extends Methods ? "PASS" : "FAIL";
const test1_3: Test1_3_MethodsPost = "PASS";

// Test 1.4: Can a tuple of specific UserRoleValues extend readonly UserRoleValue[]?
type Test1_4_TupleExtends = readonly [
  "app.api.user.userRoles.enums.userRole.admin",
] extends readonly UserRoleValue[]
  ? "PASS"
  : "FAIL";
const test1_4: Test1_4_TupleExtends = "PASS";

// ============================================================================
// LEVEL 2: Test ApiEndpoint interface assignability with variance
// ============================================================================

// Test 2.1: ApiEndpoint with literal type parameters
const test2_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {},
);

type Test2_1_LiteralEndpoint = ApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  string,
  typeof test2_1_field
>;

// Test 2.2: Can it be assigned to ApiEndpoint with generic parameters?
type Test2_2_Result =
  Test2_1_LiteralEndpoint extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test2_2: Test2_2_Result = "PASS"; // Fixed with 'out' variance!

// Test 2.3: Check if the variance annotations work
type Test2_3_WithVariance =
  Test2_1_LiteralEndpoint extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test2_3: Test2_3_WithVariance = "PASS"; // Passes with 'out' variance!

// ============================================================================
// LEVEL 3: Test CreateApiEndpoint type alias assignability
// ============================================================================

// Test 3.1: CreateApiEndpoint with literal type parameters
const test3_1_field = objectField(
  { type: WidgetType.CONTAINER },
  { request: "urlPathParams", response: true },
  {
    jobId: requestUrlPathParamsField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.UUID,
      label: "Job ID",
      schema: z.string().uuid(),
    }),
  },
);

type Test3_1_LiteralCreate = CreateApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  string,
  typeof test3_1_field
>;

// Test 3.2: Can it be assigned to CreateApiEndpointAny?
type Test3_2_Result = Test3_1_LiteralCreate extends CreateApiEndpointAny
  ? "PASS"
  : "FAIL";
const test3_2: Test3_2_Result = "PASS"; // Fixed! CreateApiEndpoint now extends CreateApiEndpointAny

// Test 3.3: Does the objectField extend UnifiedField?
type Test3_3_ObjectFieldExtendsUnified =
  typeof test3_1_field extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "PASS"
    : "FAIL";
const test3_3: Test3_3_ObjectFieldExtendsUnified = "PASS"; // objectField DOES extend UnifiedField

// Test 3.4: Now test if CreateApiEndpoint with this objectField extends CreateApiEndpointAny
type Test3_4_FullCheck =
  CreateApiEndpoint<
    Methods.POST,
    readonly ["app.api.user.userRoles.enums.userRole.admin"],
    string,
    typeof test3_1_field
  > extends CreateApiEndpointAny
    ? "PASS"
    : "FAIL";
const test3_4: Test3_4_FullCheck = "PASS"; // We WANT this to pass

// Test 3.5: Check if the schema properties break variance
// CreateApiEndpoint has: readonly requestSchema: InferSchemaFromField<TFields, FieldUsage.RequestData>
// Let's test if this property type is compatible
type TestObjectField = typeof test3_1_field;

type Test3_5_SchemaCompat = {
  readonly requestSchema: InferSchemaFromField<
    TestObjectField,
    FieldUsage.RequestData
  >;
} extends {
  readonly requestSchema: InferSchemaFromField<
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >,
    FieldUsage.RequestData
  >;
}
  ? "PASS"
  : "FAIL";
const test3_5: Test3_5_SchemaCompat = "PASS"; // Schema property is compatible!

// Test 3.6: Check if the types object breaks variance
// CreateApiEndpoint has: readonly types: { Fields: TFields; ... }
type Test3_6_TypesCompat = {
  readonly types: {
    Fields: TestObjectField;
  };
} extends {
  readonly types: {
    Fields: UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >;
  };
}
  ? "PASS"
  : "FAIL";
const test3_6: Test3_6_TypesCompat = "PASS"; // types.Fields property is compatible!

// Test 3.7: Check if the ApiEndpoint base is the issue
// CreateApiEndpoint extends ApiEndpoint<...>
type Test3_7_ApiEndpointBase =
  ApiEndpoint<
    Methods.POST,
    readonly ["app.api.user.userRoles.enums.userRole.admin"],
    string,
    TestObjectField
  > extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test3_7: Test3_7_ApiEndpointBase = "PASS"; // We WANT ApiEndpoint with ObjectField to extend ApiEndpoint with UnifiedField

// Test 3.8: Direct test - does TestObjectField extend UnifiedField?
type Test3_8_Direct =
  TestObjectField extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
    ? "PASS"
    : "FAIL";
const test3_8: Test3_8_Direct = "PASS"; // We WANT objectField to extend UnifiedField

// Test 3.9: Test SimpleObjectField
const simpleObjectFieldValue = objectField(
  { type: WidgetType.CONTAINER },
  { request: "data" },
  {},
);

type SimpleObjectField = typeof simpleObjectFieldValue;
type Test3_10_SimpleObject =
  ApiEndpoint<
    Methods.POST,
    readonly ["app.api.user.userRoles.enums.userRole.admin"],
    string,
    SimpleObjectField
  > extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test3_10: Test3_10_SimpleObject = "PASS"; // We WANT simple ObjectField to work in ApiEndpoint

// Test 3.11: Test a minimal interface with just the fields property
interface MinimalEndpoint<
  out TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> {
  readonly fields: TFields;
}
type Test3_11_Minimal =
  MinimalEndpoint<TestObjectField> extends MinimalEndpoint<
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_11: Test3_11_Minimal = "PASS"; // We WANT minimal interface to work

// Test 3.12: Test with a conditional type property (like exampleRequest in ApiEndpoint)
interface ConditionalEndpoint<
  out TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> {
  readonly fields: TFields;
  readonly example: ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.RequestData>
  > extends never
    ? undefined
    : Record<
        string,
        ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
      >;
}
type Test3_12_Conditional =
  ConditionalEndpoint<TestObjectField> extends ConditionalEndpoint<
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_12: Test3_12_Conditional = "PASS"; // Conditional properties work!

// Test 3.13: Check what's actually different in ApiEndpoint that causes the failure
// ApiEndpoint has many properties. Let me add them one by one.
interface TestEndpointV1<
  out TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> {
  readonly fields: TFields;
}
interface TestEndpointV2<
  out TMethod extends Methods,
  out TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> extends TestEndpointV1<TFields> {
  readonly method: TMethod;
}
type Test3_13_V2 =
  TestEndpointV2<Methods.POST, TestObjectField> extends TestEndpointV2<
    Methods,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_13: Test3_13_V2 = "PASS"; // Method property is fine!

// Test 3.14: Check if it's specifically something about how ApiEndpoint is defined
// Let's directly check the actual ApiEndpoint type
type Test3_14_ActualApiEndpoint =
  ApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    string,
    SimpleObjectField
  > extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test3_14: Test3_14_ActualApiEndpoint = "PASS"; // We WANT ApiEndpoint with SimpleObjectField to work

// Test 3.15: Test if combining TFields with TExampleKey breaks variance
// This mimics the examples property: ExamplesList<InferFrom<TFields>, TExampleKey>
interface TestCombined<
  TExampleKey extends string,
  TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> {
  readonly fields: TFields;
  readonly examples: Record<
    TExampleKey,
    ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
  >;
}
type Test3_15_Combined =
  TestCombined<"default", TestObjectField> extends TestCombined<
    string,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_15: Test3_15_Combined = "PASS"; // We WANT combining TFields with TExampleKey to work

// Test 3.16: Check if Record<"default", T> extends Record<string, T>
type Test3_16_RecordKey =
  Record<"default", number> extends Record<string, number> ? "PASS" : "FAIL";
const test3_16: Test3_16_RecordKey = "PASS"; // We WANT specific key Record to extend generic key Record

// Test 3.17: Add the exact examples property from ApiEndpoint
interface TestWithExamples<
  TExampleKey extends string,
  TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> {
  readonly examples: ExamplesList<
    ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
    TExampleKey
  >;
}
type Test3_17_WithExamples =
  TestWithExamples<"default", TestObjectField> extends TestWithExamples<
    string,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_17: Test3_17_WithExamples = "PASS"; // We WANT the examples property structure to work

// Test 3.18: Test the ACTUAL ExamplesList mapped type
type Test3_18_MappedType = { [K in "default"]: number } extends {
  [K in string]: number;
}
  ? "PASS"
  : "FAIL";
const test3_18: Test3_18_MappedType = "PASS"; // We WANT specific mapped type to extend generic

// Test 3.19: Test the EXACT conditional structure from examples property
interface TestConditionalExamples<
  TExampleKey extends string,
  TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> {
  readonly examples: ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.RequestData>
  > extends never
    ? { requests?: never }
    : {
        requests: ExamplesList<
          ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
          TExampleKey
        >;
      };
}
type Test3_19_ConditionalExamples =
  TestConditionalExamples<
    "default",
    TestObjectField
  > extends TestConditionalExamples<
    string,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_19: Test3_19_ConditionalExamples = "PASS"; // We WANT the conditional examples structure to work

// Test 3.20: Test with ONLY TExampleKey specific, all others generic
type Test3_20_OnlyExampleKeySpecific =
  ApiEndpoint<
    Methods, // generic
    readonly UserRoleValue[], // generic
    string, // generic
    SimpleObjectField
  > extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test3_20: Test3_20_OnlyExampleKeySpecific = "PASS"; // We WANT this to work

// Test 3.21: Test with ONLY TMethod specific, all others generic
type Test3_21_OnlyMethodSpecific =
  ApiEndpoint<
    Methods.POST, // SPECIFIC
    readonly UserRoleValue[], // generic
    string, // generic
    SimpleObjectField
  > extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test3_21: Test3_21_OnlyMethodSpecific = "PASS"; // We WANT this to work

// Test 3.22: Test with ONLY TUserRoleValue specific, all others generic
type Test3_22_OnlyRolesSpecific =
  ApiEndpoint<
    Methods, // generic
    readonly ["app.api.user.userRoles.enums.userRole.admin"], // SPECIFIC tuple
    string, // generic
    SimpleObjectField
  > extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test3_22: Test3_22_OnlyRolesSpecific = "PASS"; // We WANT this to work

// Test 3.23: Test if using TScopedTranslationKey in function parameter breaks variance
interface TestWithFunctionParam<out TKey extends string> {
  readonly fn: () => {
    method(key: TKey): void;
  };
}
type Test3_23_FunctionParam =
  TestWithFunctionParam<"specific"> extends TestWithFunctionParam<string>
    ? "PASS"
    : "FAIL";
const test3_23: Test3_23_FunctionParam = "PASS"; // With 'out' annotation, TypeScript trusts the variance declaration

// Test 3.24: Test if NoInfer breaks variance
interface TestWithNoInfer<out TKey extends string> {
  readonly title: NoInfer<TKey>;
}
type Test3_24_NoInfer =
  TestWithNoInfer<"specific"> extends TestWithNoInfer<string> ? "PASS" : "FAIL";
const test3_24: Test3_24_NoInfer = "PASS"; // We WANT NoInfer to preserve variance

// Test 3.25: Minimal ApiEndpoint with just core properties
interface MinimalApiEndpoint<
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> {
  readonly method: TMethod;
  readonly allowedRoles: TUserRoleValue;
  readonly fields: TFields;
  readonly examples: ExamplesList<
    ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
    string
  >;
}
type Test3_25_MinimalApi =
  MinimalApiEndpoint<
    Methods.POST,
    readonly ["app.api.user.userRoles.enums.userRole.admin"],
    SimpleObjectField
  > extends MinimalApiEndpoint<
    Methods,
    readonly UserRoleValue[],
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_25: Test3_25_MinimalApi = "PASS"; // With 'out' variance, interface is covariant

// Test 3.26: Add the options property which uses TMethod in conditional
interface ApiEndpointWithOptions<
  out TMethod extends Methods,
  out TUserRoleValue extends readonly UserRoleValue[],
  out TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> extends MinimalApiEndpoint<TMethod, TUserRoleValue, TFields> {
  readonly options?: TMethod extends Methods.GET
    ? EndpointReadOptions<
        ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
        ExtractOutput<InferSchemaFromField<TFields, FieldUsage.ResponseData>>,
        ExtractOutput<
          InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
        >
      >
    : never;
}
type Test3_26_WithOptions =
  ApiEndpointWithOptions<
    Methods.POST,
    readonly ["app.api.user.userRoles.enums.userRole.admin"],
    SimpleObjectField
  > extends ApiEndpointWithOptions<
    Methods,
    readonly UserRoleValue[],
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_26: Test3_26_WithOptions = "PASS"; // With 'out' variance, interface is covariant

// Test 3.27: Add errorTypes and successTypes which use TScopedTranslationKey with NoInfer
interface ApiEndpointWithErrorTypes<
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> extends ApiEndpointWithOptions<TMethod, TUserRoleValue, TFields> {
  readonly errorTypes: Record<
    EndpointErrorTypes,
    {
      title: NoInfer<TScopedTranslationKey>;
      description: NoInfer<TScopedTranslationKey>;
    }
  >;
  readonly successTypes: {
    title: NoInfer<TScopedTranslationKey>;
    description: NoInfer<TScopedTranslationKey>;
  };
}
type Test3_27_WithErrorTypes =
  ApiEndpointWithErrorTypes<
    Methods.POST,
    readonly ["app.api.user.userRoles.enums.userRole.admin"],
    "app.api.someScope.title",
    SimpleObjectField
  > extends ApiEndpointWithErrorTypes<
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
    ? "PASS"
    : "FAIL";
const test3_27: Test3_27_WithErrorTypes = "PASS"; // With 'out' variance, interface is covariant

// Test 3.28: Test if mapped type key causes variance issue
type MappedRecord<TKey extends string, T> = {
  [K in TKey]: T;
};

// Test 3.28a: Does mapped type key preserve variance?
type Test3_28a_Specific = MappedRecord<"default", string>;
type Test3_28a_Generic = MappedRecord<string, string>;
type Test3_28a_Result = Test3_28a_Specific extends Test3_28a_Generic
  ? "PASS"
  : "FAIL";
const test3_28a: Test3_28a_Result = "PASS"; // We WANT this to pass

// Test 3.28b: Interface with out variance annotation and mapped type property
interface TestMappedVariance<TKey extends string> {
  readonly mapped: MappedRecord<TKey, string>;
}
type Test3_28b_Result =
  TestMappedVariance<"default"> extends TestMappedVariance<string>
    ? "PASS"
    : "FAIL";
const test3_28b: Test3_28b_Result = "PASS"; // TypeScript infers covariance for readonly properties

// Test 3.28c: Can we use index signature instead of mapped type?
// Note: Index signatures cannot use generic types, so we use a mapped type
type IndexSignatureRecord<TKey extends string, T> = {
  readonly [K in TKey]: T;
};
type Test3_28c_Result =
  IndexSignatureRecord<"default", string> extends IndexSignatureRecord<
    string,
    string
  >
    ? "PASS"
    : "FAIL";
const test3_28c: Test3_28c_Result = "PASS"; // We WANT this to pass

// Test 3.28d: Can we use Record utility type with variance annotation?
interface TestRecordVariance<TKey extends string> {
  readonly mapped: Record<TKey, string>;
}
type Test3_28d_Result =
  TestRecordVariance<"default"> extends TestRecordVariance<string>
    ? "PASS"
    : "FAIL";
const test3_28d: Test3_28d_Result = "PASS"; // TypeScript infers covariance for readonly properties

// Test 3.28e: Verify mapped type works correctly (index signatures can't use generics)
type ExamplesListIndex<TKey extends string, T> = {
  readonly [K in TKey]: T;
};
// Test with actual usage pattern from ApiEndpoint
interface MinimalWithIndexExamples<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> {
  readonly method: TMethod;
  readonly allowedRoles: TUserRoleValue;
  readonly fields: TFields;
  readonly examples: ExamplesListIndex<TExampleKey, { foo: string }>;
}
type Test3_28e_Result =
  MinimalWithIndexExamples<
    "default",
    Methods.POST,
    readonly ["app.api.user.userRoles.enums.userRole.admin"],
    SimpleObjectField
  > extends MinimalWithIndexExamples<
    string,
    Methods,
    readonly UserRoleValue[],
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, FieldUsageConfig>
    >
  >
    ? "PASS"
    : "FAIL";
const test3_28e: Test3_28e_Result = "PASS"; // TypeScript infers covariance when all uses are readonly!

// Test 3.29: Test actual CreateApiEndpoint assignability with all fixes applied
type Test3_29_Specific = CreateApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  "app.api.someScope.title",
  SimpleObjectField
>;
type Test3_29_Result = Test3_29_Specific extends CreateApiEndpointAny
  ? "PASS"
  : "FAIL";
const test3_29: Test3_29_Result = "PASS"; // We WANT CreateApiEndpoint to satisfy CreateApiEndpointAny!

// Test 3.30: Test if function parameter causes contravariance issue
interface TestFunctionParam<out TKey extends string> {
  readonly fn: {
    t(key: TKey): string;
  };
}
type Test3_30_Result =
  TestFunctionParam<"default"> extends TestFunctionParam<string>
    ? "PASS"
    : "FAIL";
const test3_30: Test3_30_Result = "PASS"; // We WANT this but it will FAIL due to contravariance
// Force type check: if it's "FAIL", this will error
type Test3_30_Check = Test3_30_Result extends "PASS" ? true : false;
const test3_30_check: Test3_30_Check = true; // Should pass if Test3_30_Result is "PASS"

// Test 3.31: Test if ApiEndpoint works with all fixes
type Test3_31_SpecificApi = ApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  "app.api.someScope.title",
  SimpleObjectField
>;
type Test3_31_GenericApi = ApiEndpoint<
  Methods,
  readonly UserRoleValue[],
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
>;
type Test3_31_Result = Test3_31_SpecificApi extends Test3_31_GenericApi
  ? "PASS"
  : "FAIL";
const test3_31: Test3_31_Result = "PASS"; // We WANT ApiEndpoint to work

// ============================================================================
// LEVEL 4: Isolate which type parameter causes the issue
// ============================================================================

// Test 4.1: Test with generic TExampleKey but specific other params
type Test4_1_GenericExample = CreateApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
>;
type Test4_1_Result = Test4_1_GenericExample extends CreateApiEndpointAny
  ? "PASS"
  : "FAIL";
const test4_1: Test4_1_Result = "PASS"; // Passes with variance!

// Test 4.2: Test with generic TMethod but specific other params
type Test4_2_GenericMethod = CreateApiEndpoint<
  Methods, // Generic
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
>;
type Test4_2_Result = Test4_2_GenericMethod extends CreateApiEndpointAny
  ? "PASS"
  : "FAIL";
const test4_2: Test4_2_Result = "PASS"; // Passes with variance!

// Test 4.3: Test with generic TUserRoleValue but specific other params
type Test4_3_GenericRoles = CreateApiEndpoint<
  Methods.POST,
  readonly UserRoleValue[], // Generic
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
>;
type Test4_3_Result = Test4_3_GenericRoles extends CreateApiEndpointAny
  ? "PASS"
  : "FAIL";
const test4_3: Test4_3_Result = "PASS"; // Should pass!

// Test 4.4: Tuple of UserRoleValue extends readonly UserRoleValue[]
type Test4_4_OnlyRoleIssue = CreateApiEndpoint<
  Methods,
  readonly ["app.api.user.userRoles.enums.userRole.admin"], // Tuple
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
>;
type Test4_4_Result = Test4_4_OnlyRoleIssue extends CreateApiEndpointAny
  ? "PASS"
  : "FAIL";
const test4_4: Test4_4_Result = "PASS"; // Passes with variance!

// ============================================================================
// LEVEL 5: Understanding tuple vs array type variance
// ============================================================================

// Test 5.1: Direct tuple to array assignability
type Test5_1_TupleToArray = readonly [
  "app.api.user.userRoles.enums.userRole.admin",
] extends readonly UserRoleValue[]
  ? "PASS"
  : "FAIL";
const test5_1: Test5_1_TupleToArray = "PASS"; // Tuples ARE assignable to arrays!

// Test 5.2: Tuple in a type without variance annotation
interface Test5_2_Container<T extends readonly UserRoleValue[]> {
  roles: T;
}
type Test5_2_WithTuple = Test5_2_Container<
  readonly ["app.api.user.userRoles.enums.userRole.admin"]
>;
type Test5_2_Result =
  Test5_2_WithTuple extends Test5_2_Container<readonly UserRoleValue[]>
    ? "PASS"
    : "FAIL";
const test5_2: Test5_2_Result = "PASS"; // Passes - TypeScript infers covariance when property is not modified

// Test 5.3: With 'out' variance annotation
interface Test5_3_ContainerOut<out T extends readonly UserRoleValue[]> {
  readonly roles: T;
}
type Test5_3_WithTuple = Test5_3_ContainerOut<
  readonly ["app.api.user.userRoles.enums.userRole.admin"]
>;
type Test5_3_Result =
  Test5_3_WithTuple extends Test5_3_ContainerOut<readonly UserRoleValue[]>
    ? "PASS"
    : "FAIL";
const test5_3: Test5_3_Result = "PASS"; // With 'out', it works!

// ============================================================================
// LEVEL 6: Test if ApiEndpoint 'out' variance fixes the issue
// ============================================================================

// Test 6.1: With the 'out' variance we added, does it work?
type Test6_1_WithOutVariance = ApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >
>;
type Test6_1_Result =
  Test6_1_WithOutVariance extends ApiEndpoint<
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
    ? "PASS"
    : "FAIL";
const test6_1: Test6_1_Result = "PASS"; // Should pass now with 'out'!

// ============================================================================
// LEVEL 7: But does CreateApiEndpoint work?
// ============================================================================

// Test 7.1: CreateApiEndpoint with specific types extends CreateApiEndpointAny
type Test7_1_CreateWithOut = CreateApiEndpoint<
  Methods.POST,
  readonly ["app.api.user.userRoles.enums.userRole.admin"],
  string,
  UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
>;
type Test7_1_Result = Test7_1_CreateWithOut extends CreateApiEndpointAny
  ? "PASS"
  : "FAIL";
const test7_1: Test7_1_Result = "PASS"; // Passes with interface extends + variance!

// Test 7.2: Check if the issue is in the intersection (&)
// CreateApiEndpoint = ApiEndpoint<...> & { additional properties }
// The intersection might not preserve variance

// ============================================================================
// LEVEL 8: Test the intersection behavior
// ============================================================================

// Test 8.1: Intersection preserves variance when base has 'out'
interface Test8_1_Base<out T extends readonly UserRoleValue[]> {
  readonly roles: T;
}
interface Test8_1_Extra {
  readonly extra: string;
}
type Test8_1_Intersection<T extends readonly UserRoleValue[]> =
  Test8_1_Base<T> & Test8_1_Extra;

type Test8_1_WithTuple = Test8_1_Intersection<
  readonly ["app.api.user.userRoles.enums.userRole.admin"]
>;
type Test8_1_Result =
  Test8_1_WithTuple extends Test8_1_Intersection<readonly UserRoleValue[]>
    ? "PASS"
    : "FAIL";
const test8_1: Test8_1_Result = "PASS"; // Intersection preserves variance from base interface!

// Test 8.2: Key insight - interface extends + 'out' variance annotations solve the issue
// By converting CreateApiEndpoint from type alias intersection to interface extends,
// and adding 'out' variance to all covariant type parameters, we enable proper
// type compatibility between specific and generic endpoint types

// ============================================================================
// LEVEL 9: Solution Summary
// ============================================================================
// Converting CreateApiEndpoint to an interface that extends ApiEndpoint (instead of intersection)
// plus adding 'out' variance annotations makes all assignability tests pass!

// Test 9.1: If CreateApiEndpointAny accepts the ACTUAL inferred types, will it work?
// The issue: createEndpoint with 'as const' creates:
//   readonly ["app.api.user.userRoles.enums.userRole.admin"]
// Not:
//   readonly UserRoleValue[]

// Solution: CreateApiEndpointAny should accept MORE GENERAL types that
// UnifiedField<string, z.ZodTypeAny> specific endpoint can be assigned to

export {
  test1_1,
  test1_2,
  test1_3,
  test1_4,
  test2_2,
  test2_3,
  test3_2,
  test3_3,
  test3_4,
  test3_5,
  test3_6,
  test3_7,
  test3_8,
  test3_10,
  test3_11,
  test3_12,
  test3_13,
  test3_14,
  test3_15,
  test3_16,
  test3_17,
  test3_18,
  test3_19,
  test3_20,
  test3_21,
  test3_22,
  test3_23,
  test3_24,
  test3_25,
  test3_26,
  test3_27,
  test3_28a,
  test3_28b,
  test3_28c,
  test3_28d,
  test3_28e,
  test3_29,
  test3_30,
  test3_30_check,
  test3_31,
  test4_1,
  test4_2,
  test4_3,
  test4_4,
  test5_1,
  test5_2,
  test5_3,
  test6_1,
  test7_1,
  test8_1,
};
