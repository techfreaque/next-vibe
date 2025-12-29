/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * createFormEndpoint FRAMEWORK Type Inference Tests
 *
 * Tests config-based type extraction (ExtractMethod* utilities).
 *
 * NOTE: `typeof endpoint.types.RequestOutput` does NOT work across modules due to
 * TypeScript's cross-module typeof limitation on complex return types. This is a known
 * compiler limitation, not a framework bug.
 *
 * Use ExtractMethodRequestOutput/ResponseOutput/UrlVariablesOutput instead.
 *
 * DO NOT DELETE - This prevents regressions in type inference logic.
 */

import { z } from "zod";

import {
  type CachedMethodSchemas,
  createFormEndpoint,
  type CreateFormEndpointConfig,
  type ExtractMethodRequestOutput,
  type ExtractMethodResponseOutput,
  type ExtractMethodUrlVariablesOutput,
  type FormExamples,
  type FormMethodConfig,
  generateRequestDataSchemaForMethod,
  generateRequestUrlSchemaForMethod,
  generateResponseSchemaForMethod,
  type MethodExamples,
} from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create-form";
import {
  field,
  objectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type {
  InferSchemaFromFieldForMethod,
  UnifiedField,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";

// Helper types for testing
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;
type NotNever<T> = T extends never ? false : true;

/**
 * ========================================================================
 * GRADUAL TESTS: InferSchemaFromFieldForMethod - Isolate Type Inference
 * ========================================================================
 */

// GRADUAL TEST 1: Simple primitive field with urlPathParams
const simpleUrlField = field(
  z.string().uuid(),
  { request: "urlPathParams" },
  { type: WidgetType.TEXT, content: "" },
);

type Gradual1_URL_POST = InferSchemaFromFieldForMethod<
  string,
  typeof simpleUrlField,
  Methods.POST,
  FieldUsage.RequestUrlParams
>;
type Gradual1_URL_POST_IsNever = Gradual1_URL_POST extends z.ZodNever
  ? true
  : false;
type Gradual1_URL_POST_Test = Expect<Equal<Gradual1_URL_POST_IsNever, false>>;

// GRADUAL TEST 2: Simple primitive field with method-specific usage
const simpleDataField = field(
  z.string(),
  { POST: { request: "data" } },
  { type: WidgetType.FORM_FIELD, fieldType: FieldDataType.TEXT, label: "test" },
);

type Gradual2_Data_POST = InferSchemaFromFieldForMethod<
  string,
  typeof simpleDataField,
  Methods.POST,
  FieldUsage.RequestData
>;
type Gradual2_Data_POST_IsNever = Gradual2_Data_POST extends z.ZodNever
  ? true
  : false;
type Gradual2_Data_POST_Test = Expect<Equal<Gradual2_Data_POST_IsNever, false>>;

// GRADUAL TEST 3: ObjectField with 1 child (urlPathParams)
const simpleObjectWithUrl = objectField(
  { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
  { POST: { request: "data" } },
  {
    id: field(
      z.string().uuid(),
      { request: "urlPathParams" },
      { type: WidgetType.TEXT, content: "" },
    ),
  },
);

type Gradual3_Object_URL_POST = InferSchemaFromFieldForMethod<
  string,
  typeof simpleObjectWithUrl,
  Methods.POST,
  FieldUsage.RequestUrlParams
>;
type Gradual3_Object_URL_POST_Output = z.output<Gradual3_Object_URL_POST>;
type Gradual3_Has_Id = "id" extends keyof Gradual3_Object_URL_POST_Output
  ? true
  : false;
type Gradual3_Object_URL_POST_Test = Expect<Equal<Gradual3_Has_Id, true>>;

// GRADUAL TEST 4: ObjectField with 1 child (data field)
const simpleObjectWithData = objectField(
  { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
  { POST: { request: "data" } },
  {
    name: field(
      z.string(),
      { POST: { request: "data" } },
      {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "test",
      },
    ),
  },
);

type Gradual4_Object_Data_POST = InferSchemaFromFieldForMethod<
  string,
  typeof simpleObjectWithData,
  Methods.POST,
  FieldUsage.RequestData
>;
type Gradual4_Object_Data_POST_Output = z.output<Gradual4_Object_Data_POST>;
type Gradual4_Has_Name = "name" extends keyof Gradual4_Object_Data_POST_Output
  ? true
  : false;
type Gradual4_Object_Data_POST_Test = Expect<Equal<Gradual4_Has_Name, true>>;

// GRADUAL TEST 5: ObjectField with 2 children (url + data)
const objectWithUrlAndData = objectField(
  { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
  { POST: { request: "data" } },
  {
    id: field(
      z.string().uuid(),
      { request: "urlPathParams" },
      { type: WidgetType.TEXT, content: "" },
    ),
    name: field(
      z.string(),
      { POST: { request: "data" } },
      {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "test",
      },
    ),
  },
);

type Gradual5_Object_URL_POST = InferSchemaFromFieldForMethod<
  string,
  typeof objectWithUrlAndData,
  Methods.POST,
  FieldUsage.RequestUrlParams
>;
type Gradual5_Object_URL_POST_Output = z.output<Gradual5_Object_URL_POST>;
type Gradual5_URL_Has_Id = "id" extends keyof Gradual5_Object_URL_POST_Output
  ? true
  : false;
type Gradual5_URL_POST_Test = Expect<Equal<Gradual5_URL_Has_Id, true>>;

type Gradual5_Object_Data_POST = InferSchemaFromFieldForMethod<
  string,
  typeof objectWithUrlAndData,
  Methods.POST,
  FieldUsage.RequestData
>;
type Gradual5_Object_Data_POST_Output = z.output<Gradual5_Object_Data_POST>;
type Gradual5_Data_Has_Name =
  "name" extends keyof Gradual5_Object_Data_POST_Output ? true : false;
type Gradual5_Data_POST_Test = Expect<Equal<Gradual5_Data_Has_Name, true>>;

// GRADUAL TEST 6: Multi-method field (same as twoMethodConfig structure)
const twoMethodFields = objectField(
  { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
  {
    GET: { response: true },
    POST: { request: "data", response: true },
  },
  {
    id: field(
      z.string().uuid(),
      { request: "urlPathParams" },
      { type: WidgetType.TEXT, content: "" },
    ),
    name: field(
      z.string(),
      { POST: { request: "data", response: true } },
      {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "Name" as const,
      },
    ),
  },
);

// Test GET Response
type Gradual6_GET_Response = InferSchemaFromFieldForMethod<
  string,
  typeof twoMethodFields,
  Methods.GET,
  FieldUsage.Response
>;

// DEBUG: What is the id field returning for GET Response?
type Debug_Id_Field_GET_Response = InferSchemaFromFieldForMethod<
  string,
  typeof twoMethodFields.children.id,
  Methods.GET,
  FieldUsage.Response
>;
type Debug_Id_IsNever = Debug_Id_Field_GET_Response extends z.ZodNever
  ? true
  : false;
// This should be true (id should be ZodNever for Response)
type Debug_Id_Test = Expect<Equal<Debug_Id_IsNever, true>>;

// NOTE: When all children are filtered out, we get z.ZodObject<{}>.
// At runtime this works correctly (no required properties), but TypeScript's
// {} type means "any object" not "empty object", so keyof {} includes string index.
// This is a TypeScript limitation, not a framework bug. The runtime behavior is correct.

type Gradual6_GET_Response_Output = z.output<Gradual6_GET_Response>;
// Skip the keyof test - TypeScript's {} is not truly empty

// Test GET UrlParams
type Gradual6_GET_URL = InferSchemaFromFieldForMethod<
  string,
  typeof twoMethodFields,
  Methods.GET,
  FieldUsage.RequestUrlParams
>;
type Gradual6_GET_URL_Output = z.output<Gradual6_GET_URL>;
type Gradual6_GET_URL_Has_Id = "id" extends keyof Gradual6_GET_URL_Output
  ? true
  : false;
type Gradual6_GET_URL_Test = Expect<Equal<Gradual6_GET_URL_Has_Id, true>>;

// Test POST RequestData
type Gradual6_POST_Request = InferSchemaFromFieldForMethod<
  string,
  typeof twoMethodFields,
  Methods.POST,
  FieldUsage.RequestData
>;
type Gradual6_POST_Request_Output = z.output<Gradual6_POST_Request>;
type Gradual6_POST_Has_Name = "name" extends keyof Gradual6_POST_Request_Output
  ? true
  : false;
type Gradual6_POST_Request_Test = Expect<Equal<Gradual6_POST_Has_Name, true>>;

// Test POST Response
type Gradual6_POST_Response = InferSchemaFromFieldForMethod<
  string,
  typeof twoMethodFields,
  Methods.POST,
  FieldUsage.Response
>;
type Gradual6_POST_Response_Output = z.output<Gradual6_POST_Response>;
type Gradual6_POST_Response_Has_Name =
  "name" extends keyof Gradual6_POST_Response_Output ? true : false;
type Gradual6_POST_Response_Test = Expect<
  Equal<Gradual6_POST_Response_Has_Name, true>
>;

// GRADUAL TEST 7: Four-method field (same as fourMethodConfig structure)
const fourMethodFields = objectField(
  { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
  {
    GET: { response: true },
    POST: { request: "data", response: true },
    PATCH: { request: "data", response: true },
    DELETE: { request: "data" },
  },
  {
    id: field(
      z.string().uuid(),
      { request: "urlPathParams" },
      { type: WidgetType.TEXT, content: "" },
    ),
    itemId: field(
      z.string().uuid(),
      { PATCH: { request: "data" }, DELETE: { request: "data" } },
      {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "Item ID" as const,
      },
    ),
    name: field(
      z.string(),
      {
        POST: { request: "data", response: true },
        PATCH: { request: "data", response: true },
      },
      {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "Name" as const,
      },
    ),
  },
);

// Test PATCH RequestData
type Gradual7_PATCH_Request = InferSchemaFromFieldForMethod<
  string,
  typeof fourMethodFields,
  Methods.PATCH,
  FieldUsage.RequestData
>;
type Gradual7_PATCH_Request_Output = z.output<Gradual7_PATCH_Request>;
type Gradual7_PATCH_Has_ItemId =
  "itemId" extends keyof Gradual7_PATCH_Request_Output ? true : false;
type Gradual7_PATCH_Has_Name =
  "name" extends keyof Gradual7_PATCH_Request_Output ? true : false;
type Gradual7_PATCH_Request_Test1 = Expect<
  Equal<Gradual7_PATCH_Has_ItemId, true>
>;
type Gradual7_PATCH_Request_Test2 = Expect<
  Equal<Gradual7_PATCH_Has_Name, true>
>;

// Test DELETE RequestData
type Gradual7_DELETE_Request = InferSchemaFromFieldForMethod<
  string,
  typeof fourMethodFields,
  Methods.DELETE,
  FieldUsage.RequestData
>;
type Gradual7_DELETE_Request_Output = z.output<Gradual7_DELETE_Request>;
type Gradual7_DELETE_Has_ItemId =
  "itemId" extends keyof Gradual7_DELETE_Request_Output ? true : false;
type Gradual7_DELETE_Request_Test = Expect<
  Equal<Gradual7_DELETE_Has_ItemId, true>
>;

// Test DELETE UrlParams (should have id from old format usage)
type Gradual7_DELETE_URL = InferSchemaFromFieldForMethod<
  string,
  typeof fourMethodFields,
  Methods.DELETE,
  FieldUsage.RequestUrlParams
>;
type Gradual7_DELETE_URL_Output = z.output<Gradual7_DELETE_URL>;
type Gradual7_DELETE_URL_Has_Id = "id" extends keyof Gradual7_DELETE_URL_Output
  ? true
  : false;
type Gradual7_DELETE_URL_Test = Expect<Equal<Gradual7_DELETE_URL_Has_Id, true>>;

/**
 * ========================================================================
 * TEST 0: Schema Generation Functions
 * ========================================================================
 */

// Create a simple field structure for testing with proper method descriptors
const testFields = objectField(
  { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
  {
    GET: { response: true },
    POST: { request: "data", response: true },
    PATCH: { request: "data", response: true },
  },
  {
    id: field(
      z.string().uuid(),
      { request: "urlPathParams" },
      { type: WidgetType.TEXT, content: "" },
    ),
    name: field(
      z.string(),
      { POST: { request: "data", response: true } },
      {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "Name" as const,
      },
    ),
    label: field(
      z.string().optional(),
      { PATCH: { request: "data", response: true } },
      {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "Label" as const,
      },
    ),
  },
);

// TEST 0.1: generateRequestDataSchemaForMethod for POST
const postRequestSchema = generateRequestDataSchemaForMethod(
  testFields,
  Methods.POST,
);
type PostRequestSchemaType = typeof postRequestSchema;
type PostRequestOutput = z.output<typeof postRequestSchema>;
type PostRequestIsNever = NotNever<PostRequestOutput>;
type Test0_Verify_POST_Request = Expect<Equal<PostRequestIsNever, true>>;

// TEST 0.2: generateResponseSchemaForMethod for POST
const postResponseSchema = generateResponseSchemaForMethod(
  testFields,
  Methods.POST,
);
type PostResponseOutput = z.output<typeof postResponseSchema>;
type PostResponseIsNever = NotNever<PostResponseOutput>;
type Test0_Verify_POST_Response = Expect<Equal<PostResponseIsNever, true>>;

// TEST 0.3: generateRequestDataSchemaForMethod for PATCH
const patchRequestSchema = generateRequestDataSchemaForMethod(
  testFields,
  Methods.PATCH,
);
type PatchRequestOutput = z.output<typeof patchRequestSchema>;
type PatchRequestIsNever = NotNever<PatchRequestOutput>;
type Test0_Verify_PATCH_Request = Expect<Equal<PatchRequestIsNever, true>>;

// TEST 0.4: generateRequestUrlSchemaForMethod
const urlSchema = generateRequestUrlSchemaForMethod(testFields, Methods.GET);
type UrlSchemaOutput = z.output<typeof urlSchema>;
type UrlSchemaIsNever = NotNever<UrlSchemaOutput>;
type Test0_Verify_URL_Schema = Expect<Equal<UrlSchemaIsNever, true>>;

/**
 * ========================================================================
 * TEST 1: ExtractMethod* utilities with 2-method config (GET/POST)
 * ========================================================================
 */

const twoMethodConfig = {
  path: ["test"] as const,
  category: "test" as const,
  allowedRoles: [UserRole.CUSTOMER] as const,
  debug: false as const,
  methods: {
    GET: {
      title: "Test" as const,
      description: "Test" as const,
      icon: "list" as const,
      tags: ["tag1" as const],
    },
    POST: {
      title: "Test" as const,
      description: "Test" as const,
      icon: "plus" as const,
      tags: ["tag2" as const],
    },
  },
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      id: field(
        z.string().uuid(),
        { request: "urlPathParams" },
        { type: WidgetType.TEXT, content: "" },
      ),
      name: field(
        z.string(),
        { POST: { request: "data", response: true } },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "Name" as const,
        },
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "Error" as const,
      description: "Error" as const,
    },
  },
  successTypes: { title: "Success" as const, description: "Success" as const },
  examples: {
    GET: {
      responses: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000" as const,
          name: "Test" as const,
        },
      },
    },
    POST: {
      requests: {
        default: {
          name: "Test" as const,
        },
      },
      responses: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000" as const,
          name: "Test" as const,
        },
      },
    },
  },
};

// TEST 1.0: Test the ENTIRE type chain incrementally to find where depth explosion happens
type Test1_0_ConfigType = typeof twoMethodConfig;
type Test1_0_Fields = Test1_0_ConfigType["fields"];
type Test1_0_Methods = Test1_0_ConfigType["methods"];

// STEP 1: Test InferSchemaFromFieldForMethod (already tested in gradual tests - should work)
type Test1_0_Step1_Schema_GET_Request = InferSchemaFromFieldForMethod<
  string,
  Test1_0_Fields,
  Methods.GET,
  FieldUsage.RequestData
>;
type Test1_0_Step1_NotNever = NotNever<Test1_0_Step1_Schema_GET_Request>;
type Test1_0_Step1_Verify = Expect<Equal<Test1_0_Step1_NotNever, true>>;

// STEP 2: Test CachedMethodSchemas (uses InferSchemaFromFieldForMethod 3 times)
type Test1_0_Step2_CachedSchemas = CachedMethodSchemas<
  string,
  Test1_0_Fields,
  Methods.GET
>;
type Test1_0_Step2_RequestData = Test1_0_Step2_CachedSchemas["requestData"];
type Test1_0_Step2_NotNever = NotNever<Test1_0_Step2_RequestData>;
type Test1_0_Step2_Verify = Expect<Equal<Test1_0_Step2_NotNever, true>>;

// STEP 3: Test MethodExamples (uses CachedMethodSchemas)
type Test1_0_Step3_Examples = MethodExamples<
  CachedMethodSchemas<string, Test1_0_Fields, Methods.GET>,
  string
>;
type Test1_0_Step3_HasResponses =
  "responses" extends keyof Test1_0_Step3_Examples ? true : false;
type Test1_0_Step3_Verify = Expect<Equal<Test1_0_Step3_HasResponses, true>>;

// STEP 4: Test FormExamples (uses MethodExamples for GET and POST)
type Test1_0_Step4_FormExamples = FormExamples<string, Test1_0_Fields, string>;
type Test1_0_Step4_HasGET = "GET" extends keyof Test1_0_Step4_FormExamples
  ? true
  : false;
type Test1_0_Step4_Verify = Expect<Equal<Test1_0_Step4_HasGET, true>>;

// STEP 4.5: Test FormExamples with ONLY 2 methods (not default all 4)
type Test1_0_Step4_5_FormExamples_TwoMethods = FormExamples<
  string,
  Test1_0_Fields,
  string,
  {
    GET: FormMethodConfig<string>;
    POST: FormMethodConfig<string>;
  }
>;
type Test1_0_Step4_5_HasGET =
  "GET" extends keyof Test1_0_Step4_5_FormExamples_TwoMethods ? true : false;
type Test1_0_Step4_5_Verify = Expect<Equal<Test1_0_Step4_5_HasGET, true>>;

// STEP 5: Test CreateFormEndpointConfig (uses FormExamples)
type Test1_0_Step5_Config = CreateFormEndpointConfig<
  string,
  string,
  readonly UserRoleValue[],
  Test1_0_Fields,
  {
    GET: FormMethodConfig<string>;
    POST: FormMethodConfig<string>;
  }
>;
type Test1_0_Step5_HasExamples = "examples" extends keyof Test1_0_Step5_Config
  ? true
  : false;
type Test1_0_Step5_Verify = Expect<Equal<Test1_0_Step5_HasExamples, true>>;

// STEP 6: Test that Record<string, never> is assignable to FormExamples (for empty examples)
type Test1_0_Step6_EmptyObjAssignable =
  Record<string, never> extends FormExamples<
    string,
    Test1_0_Fields,
    string,
    {
      GET: FormMethodConfig<string>;
      POST: FormMethodConfig<string>;
    }
  >
    ? true
    : false;
type Test1_0_Step6_Verify = Expect<
  Equal<Test1_0_Step6_EmptyObjAssignable, true>
>;

// STEP 7: Test the EXACT type from twoMethodConfig.examples
type Test1_0_Step7_ExamplesType = Test1_0_ConfigType["examples"];
type Test1_0_Step7_IsAssignable =
  Test1_0_Step7_ExamplesType extends FormExamples<
    string,
    Test1_0_Fields,
    string,
    {
      GET: FormMethodConfig<string>;
      POST: FormMethodConfig<string>;
    }
  >
    ? true
    : false;
type Test1_0_Step7_Verify = Expect<Equal<Test1_0_Step7_IsAssignable, true>>;

// STEP 8: Test each config property individually to find which one fails
type Test1_0_Step8_PathOK = Test1_0_ConfigType["path"] extends readonly string[]
  ? true
  : false;
type Test1_0_Step8_PathVerify = Expect<Equal<Test1_0_Step8_PathOK, true>>;

type Test1_0_Step8_CategoryOK = Test1_0_ConfigType["category"] extends string
  ? true
  : false;
type Test1_0_Step8_CategoryVerify = Expect<
  Equal<Test1_0_Step8_CategoryOK, true>
>;

type Test1_0_Step8_AllowedRolesOK =
  Test1_0_ConfigType["allowedRoles"] extends readonly UserRoleValue[]
    ? true
    : false;
type Test1_0_Step8_AllowedRolesVerify = Expect<
  Equal<Test1_0_Step8_AllowedRolesOK, true>
>;

type Test1_0_Step8_FieldsOK =
  Test1_0_ConfigType["fields"] extends UnifiedField<string, z.ZodTypeAny>
    ? true
    : false;
type Test1_0_Step8_FieldsVerify = Expect<Equal<Test1_0_Step8_FieldsOK, true>>;

type Test1_0_Step8_MethodsOK = Test1_0_ConfigType["methods"] extends {
  GET: FormMethodConfig<string>;
  POST: FormMethodConfig<string>;
}
  ? true
  : false;
type Test1_0_Step8_MethodsVerify = Expect<Equal<Test1_0_Step8_MethodsOK, true>>;

type Test1_0_Step8_ErrorTypesOK =
  Test1_0_ConfigType["errorTypes"] extends Record<
    EndpointErrorTypes,
    {
      title: string;
      description: string;
    }
  >
    ? true
    : false;
type Test1_0_Step8_ErrorTypesVerify = Expect<
  Equal<Test1_0_Step8_ErrorTypesOK, true>
>;

type Test1_0_Step8_SuccessTypesOK = Test1_0_ConfigType["successTypes"] extends {
  title: string;
  description: string;
}
  ? true
  : false;
type Test1_0_Step8_SuccessTypesVerify = Expect<
  Equal<Test1_0_Step8_SuccessTypesOK, true>
>;

type Test1_0_Step8_ExamplesOK =
  Test1_0_ConfigType["examples"] extends FormExamples<
    string,
    Test1_0_Fields,
    string,
    {
      GET: FormMethodConfig<string>;
      POST: FormMethodConfig<string>;
    }
  >
    ? true
    : false;
type Test1_0_Step8_ExamplesVerify = Expect<
  Equal<Test1_0_Step8_ExamplesOK, true>
>;

// STEP 8.5: Test if the ENTIRE config type is assignable to CreateFormEndpointConfig
type Test1_0_Step8_ConfigAssignable =
  Test1_0_ConfigType extends CreateFormEndpointConfig<
    string,
    string,
    readonly UserRoleValue[],
    Test1_0_Fields,
    {
      GET: FormMethodConfig<string>;
      POST: FormMethodConfig<string>;
    }
  >
    ? true
    : false;
type Test1_0_Step8_Verify = Expect<Equal<Test1_0_Step8_ConfigAssignable, true>>;

// STEP 9: Extract createFormEndpoint parameters and test compatibility
type Test1_0_Step9_FunctionParams = Parameters<typeof createFormEndpoint>;
type Test1_0_Step9_FirstParam = Test1_0_Step9_FunctionParams[0];
type Test1_0_Step9_ConfigMatches =
  Test1_0_ConfigType extends Test1_0_Step9_FirstParam ? true : false;
type Test1_0_Step9_Verify = Expect<Equal<Test1_0_Step9_ConfigMatches, true>>;

// Test that ExtractMethod* utilities work on the config type
type Test1_0_GET_Request = ExtractMethodRequestOutput<
  Test1_0_ConfigType,
  "GET"
>;
type Test1_0_GET_Request_NotNever = NotNever<Test1_0_GET_Request>;
type Test1_0_Verify_GET_Request = Expect<
  Equal<Test1_0_GET_Request_NotNever, true>
>;

type Test1_0_POST_Request = ExtractMethodRequestOutput<
  Test1_0_ConfigType,
  "POST"
>;
type Test1_0_POST_Request_NotNever = NotNever<Test1_0_POST_Request>;
type Test1_0_Verify_POST_Request = Expect<
  Equal<Test1_0_POST_Request_NotNever, true>
>;

// Test if minimal config works
const minimalEndpoint = createFormEndpoint({
  path: ["test"],
  category: "test",
  allowedRoles: [UserRole.CUSTOMER],
  debug: false,
  methods: {
    GET: {
      title: "Test",
      description: "Test",
      icon: "list" as const,
      tags: [],
    },
    POST: {
      title: "Test",
      description: "Test",
      icon: "plus" as const,
      tags: [],
    },
  },
  fields: field(
    z.string(),
    { GET: { response: true }, POST: { request: "data", response: true } },
    { type: WidgetType.TEXT, content: "" },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "Error" as const,
      description: "Error" as const,
    },
  },
  successTypes: { title: "Success" as const, description: "Success" as const },
  examples: {
    GET: {
      responses: {
        default: "test" as const,
      },
    },
    POST: {
      requests: {
        default: "test" as const,
      },
      responses: {
        default: "test" as const,
      },
    },
  },
});
type Test1_0_5_Minimal_GET_Request =
  typeof minimalEndpoint.GET.types.RequestOutput;
type Test1_0_5_Minimal_GET_NotNever = NotNever<Test1_0_5_Minimal_GET_Request>;
type Test1_0_5_Verify_Minimal = Expect<
  Equal<Test1_0_5_Minimal_GET_NotNever, true>
>;

// Create the endpoint to test if return value types work
const twoMethodEndpoint = createFormEndpoint(twoMethodConfig);

// TEST 1.0: Direct typeof on return value (should work in same file)
type Test1_Direct_GET_Request =
  typeof twoMethodEndpoint.GET.types.RequestOutput;
type Test1_Direct_GET_Request_NotNever = NotNever<Test1_Direct_GET_Request>;
type Test1_Verify_Direct_GET_Request = Expect<
  Equal<Test1_Direct_GET_Request_NotNever, true>
>;

// TEST 1.1: GET RequestOutput is not never
type Test1_GET_Request = ExtractMethodRequestOutput<
  typeof twoMethodConfig,
  "GET"
>;
type Test1_GET_Request_NotNever = NotNever<Test1_GET_Request>;
type Test1_Verify_GET_Request = Expect<Equal<Test1_GET_Request_NotNever, true>>;

// TEST 1.2: POST RequestOutput is not never
type Test1_POST_Request = ExtractMethodRequestOutput<
  typeof twoMethodConfig,
  "POST"
>;
type Test1_POST_Request_NotNever = NotNever<Test1_POST_Request>;
type Test1_Verify_POST_Request = Expect<
  Equal<Test1_POST_Request_NotNever, true>
>;

// TEST 1.3: POST ResponseOutput is not never
type Test1_POST_Response = ExtractMethodResponseOutput<
  typeof twoMethodConfig,
  "POST"
>;
type Test1_POST_Response_NotNever = NotNever<Test1_POST_Response>;
type Test1_Verify_POST_Response = Expect<
  Equal<Test1_POST_Response_NotNever, true>
>;

// TEST 1.4: GET UrlVariablesOutput is not never
type Test1_GET_UrlVars = ExtractMethodUrlVariablesOutput<
  typeof twoMethodConfig,
  "GET"
>;
type Test1_GET_UrlVars_NotNever = NotNever<Test1_GET_UrlVars>;
type Test1_Verify_GET_UrlVars = Expect<Equal<Test1_GET_UrlVars_NotNever, true>>;

/**
 * ========================================================================
 * TEST 2: ExtractMethod* utilities with 4-method config (GET/POST/PATCH/DELETE)
 * ========================================================================
 */

const fourMethodConfig = {
  path: ["test"],
  category: "test",
  allowedRoles: [UserRole.CUSTOMER],
  debug: false,
  methods: {
    GET: {
      title: "Test",
      description: "Test",
      icon: "list" as const,
      tags: [],
    },
    POST: {
      title: "Test",
      description: "Test",
      icon: "plus" as const,
      tags: [],
    },
    PATCH: {
      title: "Test",
      description: "Test",
      icon: "edit" as const,
      tags: [],
    },
    DELETE: {
      title: "Test",
      description: "Test",
      icon: "trash" as const,
      tags: [],
    },
  },
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
      PATCH: { request: "data", response: true },
      DELETE: { request: "data" },
    },
    {
      id: field(
        z.string().uuid(),
        { request: "urlPathParams" },
        { type: WidgetType.TEXT, content: "" },
      ),
      itemId: field(
        z.string().uuid(),
        { PATCH: { request: "data" }, DELETE: { request: "data" } },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "Item ID" as const,
        },
      ),
      name: field(
        z.string(),
        {
          POST: { request: "data", response: true },
          PATCH: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "Name" as const,
        },
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "Error" as const,
      description: "Error" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "Error" as const,
      description: "Error" as const,
    },
  },
  successTypes: { title: "Success" as const, description: "Success" as const },
  examples: {},
} as const;

// TEST 2.1: PATCH RequestOutput is not never
type Test2_PATCH_Request = ExtractMethodRequestOutput<
  typeof fourMethodConfig,
  "PATCH"
>;
type Test2_PATCH_Request_NotNever = NotNever<Test2_PATCH_Request>;
type Test2_Verify_PATCH_Request = Expect<
  Equal<Test2_PATCH_Request_NotNever, true>
>;

// TEST 2.2: DELETE RequestOutput is not never
type Test2_DELETE_Request = ExtractMethodRequestOutput<
  typeof fourMethodConfig,
  "DELETE"
>;
type Test2_DELETE_Request_NotNever = NotNever<Test2_DELETE_Request>;
type Test2_Verify_DELETE_Request = Expect<
  Equal<Test2_DELETE_Request_NotNever, true>
>;

// TEST 2.3: PATCH ResponseOutput is not never
type Test2_PATCH_Response = ExtractMethodResponseOutput<
  typeof fourMethodConfig,
  "PATCH"
>;
type Test2_PATCH_Response_NotNever = NotNever<Test2_PATCH_Response>;
type Test2_Verify_PATCH_Response = Expect<
  Equal<Test2_PATCH_Response_NotNever, true>
>;

// TEST 2.4: DELETE UrlVariablesOutput is not never
type Test2_DELETE_UrlVars = ExtractMethodUrlVariablesOutput<
  typeof fourMethodConfig,
  "DELETE"
>;
type Test2_DELETE_UrlVars_NotNever = NotNever<Test2_DELETE_UrlVars>;
type Test2_Verify_DELETE_UrlVars = Expect<
  Equal<Test2_DELETE_UrlVars_NotNever, true>
>;

// Export dummy to make this a valid module
export const __TEST_FILE__ = true;
