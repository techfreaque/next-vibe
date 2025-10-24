/**
 * Core Endpoint Type Definitions
 *
 * Clean, DRY endpoint system with complete type inference from the 6 core types.
 * No legacy compatibility - this is the single source of truth.
 *
 * Features:
 * - Complete type inference from Zod schemas
 * - Zero any/unknown types
 * - Strict field enforcement
 * - Production-ready error handling
 * - Support for all 5 interfaces
 */

import type { z } from "zod";

import {
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { Methods } from "../core/enums";
import type {
  EndpointErrorTypes,
  ExamplesList,
  ExtractInput,
  ExtractOutput,
  InferSchemaFromField,
  UnifiedField,
} from "../core/types";
import { FieldUsage } from "../core/types";
import { generateSchemaForUsage as generateSchemaFromUtils } from "../fields/utils";
import type { LifecycleActions } from "../types";

// Extract schema type directly from field, bypassing complex field structure
type ExtractSchemaType<F> = F extends { schema: z.ZodType<infer T> }
  ? T
  : never;

/**
 * Validation mode for forms
 */
export type ValidationMode =
  | "onChange"
  | "onBlur"
  | "onSubmit"
  | "onTouched"
  | "all";

/**
 * Core endpoint definition with complete type inference from TFields:
 * All Input/Output types are automatically inferred from the unified field structure:
 * - TRequestInput/Output: Inferred from fields with FieldUsage.RequestData
 * - TResponseInput/Output: Inferred from fields with FieldUsage.Response
 * - TUrlVariablesInput/Output: Inferred from fields with FieldUsage.RequestUrlParams
 *
 * Features:
 * - Zero any/unknown types - all types are properly inferred from TFields
 * - Strict field enforcement - missing required fields cause TypeScript errors
 * - Complete type safety with proper error handling
 * - Support for all 5 consumption interfaces
 * - Simplified type parameters - only 4 core types needed
 */
export interface ApiEndpoint<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
> {
  // Core endpoint metadata - all required for type safety
  readonly method: TMethod;
  readonly path: readonly string[];
  readonly allowedRoles: TUserRoleValue;

  readonly title: TranslationKey;
  readonly description: TranslationKey;
  readonly category: TranslationKey;
  readonly tags: readonly TranslationKey[];

  readonly debug?: boolean;
  readonly aliases?: readonly string[];
  readonly cli?: {
    // TODO: use keyof TRequestInput, TResponseInput, TUrlVariablesInput
    firstCliArgKey?: string;
  };

  // Unified fields for schema generation
  readonly fields: TFields;

  lifecycle?: LifecycleActions;

  readonly examples: (ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.RequestData>
  > extends undefined
    ? { requests?: undefined }
    : ExtractInput<
          InferSchemaFromField<TFields, FieldUsage.RequestData>
        > extends never
      ? {
          requests?: undefined;
        }
      : {
          requests: ExamplesList<
            ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>,
            TExampleKey
          >;
        }) &
    (ExtractInput<
      InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
    > extends undefined
      ? { urlPathVariables?: undefined }
      : ExtractInput<
            InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
          > extends never
        ? {
            urlPathVariables?: undefined;
          }
        : {
            urlPathVariables: ExamplesList<
              ExtractInput<
                InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
              >,
              TExampleKey
            >;
          }) &
    (ExtractInput<
      InferSchemaFromField<TFields, FieldUsage.Response>
    > extends undefined
      ? { responses?: undefined }
      : ExtractInput<
            InferSchemaFromField<TFields, FieldUsage.Response>
          > extends never
        ? {
            responses?: undefined;
          }
        : {
            responses: ExamplesList<
              ExtractInput<InferSchemaFromField<TFields, FieldUsage.Response>>,
              TExampleKey
            >;
          });

  // Additional configuration - optional
  // readonly config: EndpointConfig;

  // Error handling configuration
  readonly errorTypes: Record<
    EndpointErrorTypes,
    {
      title: TranslationKey;
      description: TranslationKey;
    }
  >;

  // Success handling configuration
  readonly successTypes: {
    title: TranslationKey;
    description: TranslationKey;
  };
}

// --- COMPILE-TIME TYPE INFERENCE FROM UNIFIED FIELDS ---
// Ergonomic system that prevents requestData + requestUrlParams conflicts

// Extract core properties from UnifiedField - handle all the extra properties
export type ExtractFieldCore<F> = F extends {
  type: "primitive";
  schema: infer Schema;
  usage: infer Usage;
}
  ? { type: "primitive"; schema: Schema; usage: Usage }
  : F extends { type: "object"; children: infer Children }
    ? { type: "object"; children: Children }
    : F extends { type: "array"; child: infer Child; usage: infer Usage }
      ? { type: "array"; child: Child; usage: Usage }
      : never;

// --- MAINTAINABLE SUB-TYPES FOR FIELD INFERENCE ---

// Extract field core structure
type FieldCore<F> = ExtractFieldCore<F>;

// Usage checking helpers
type HasResponseUsage<U> = U extends { response: true } ? true : false;
type HasRequestDataUsage<U> = U extends { request: "data" } ? true : false;
type HasRequestUrlParamsUsage<U> = U extends { request: "urlParams" }
  ? true
  : false;

// Direct field type inference that forces evaluation
export type InferFieldType<F, Usage extends FieldUsage> =
  FieldCore<F> extends { type: "primitive"; usage: infer U }
    ? Usage extends FieldUsage.Response
      ? HasResponseUsage<U> extends true
        ? ExtractSchemaType<F>
        : never
      : Usage extends FieldUsage.RequestData
        ? HasRequestDataUsage<U> extends true
          ? ExtractSchemaType<F>
          : never
        : Usage extends FieldUsage.RequestUrlParams
          ? HasRequestUrlParamsUsage<U> extends true
            ? ExtractSchemaType<F>
            : never
          : never
    : FieldCore<F> extends { type: "object"; children: infer C }
      ? InferObjectType<C, Usage>
      : FieldCore<F> extends {
            type: "array";
            child: infer Child;
            usage: infer U;
          }
        ? Usage extends FieldUsage.Response
          ? HasResponseUsage<U> extends true
            ? Array<InferFieldType<Child, Usage>>
            : never
          : Usage extends FieldUsage.RequestData
            ? HasRequestDataUsage<U> extends true
              ? Array<InferFieldType<Child, Usage>>
              : never
            : Usage extends FieldUsage.RequestUrlParams
              ? HasRequestUrlParamsUsage<U> extends true
                ? Array<InferFieldType<Child, Usage>>
                : never
              : never
        : never;

// Fixed object type inference - filter out never fields and remove readonly
// Uses flexible constraint that accepts both readonly and mutable properties
type InferObjectType<C, Usage extends FieldUsage> =
  C extends Record<string, UnifiedField<z.ZodTypeAny>>
    ? {
        -readonly [K in keyof C as InferFieldType<C[K], Usage> extends never
          ? never
          : K]: InferFieldType<C[K], Usage>;
      }
    : never;

// --- SCHEMA GENERATION FROM UNIFIED FIELDS ---
// Use the proper generateSchemaForUsage function from utils
const generateSchemaForUsage = generateSchemaFromUtils;

// Schema generation that preserves actual Zod types for proper input/output inference
// CRITICAL: These functions must preserve the actual schema types for z.input<>/z.output<>
function generateRequestDataSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestData> {
  return generateSchemaForUsage(
    field,
    FieldUsage.RequestData,
  ) as InferSchemaFromField<F, FieldUsage.RequestData>;
}

function generateRequestUrlSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.RequestUrlParams> {
  return generateSchemaForUsage(
    field,
    FieldUsage.RequestUrlParams,
  ) as InferSchemaFromField<F, FieldUsage.RequestUrlParams>;
}

function generateResponseSchema<F>(
  field: F,
): InferSchemaFromField<F, FieldUsage.Response> {
  return generateSchemaForUsage(
    field,
    FieldUsage.Response,
  ) as InferSchemaFromField<F, FieldUsage.Response>;
}

export type CreateApiEndpoint<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
  RequestInput = ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.RequestData>
  >,
  RequestOutput = InferFieldType<TFields, FieldUsage.RequestData>,
  ResponseInput = ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.Response>
  >,
  ResponseOutput = InferFieldType<TFields, FieldUsage.Response>,
  UrlVariablesInput = ExtractInput<
    InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
  >,
  UrlVariablesOutput = InferFieldType<TFields, FieldUsage.RequestUrlParams>,
> = ApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields> & {
  readonly requestSchema: InferSchemaFromField<TFields, FieldUsage.RequestData>;
  readonly requestUrlParamsSchema: InferSchemaFromField<
    TFields,
    FieldUsage.RequestUrlParams
  >;
  readonly responseSchema: InferSchemaFromField<TFields, FieldUsage.Response>;

  readonly requiresAuthentication: () => boolean;
  readonly types: {
    RequestInput: RequestInput;
    RequestOutput: RequestOutput;
    ResponseInput: ResponseInput;
    ResponseOutput: ResponseOutput;
    UrlVariablesInput: UrlVariablesInput;
    UrlVariablesOutput: UrlVariablesOutput;
  };

  // Direct type access - no need for complex inference
  readonly TRequestInput: RequestInput;
  readonly TRequestOutput: RequestOutput;
  readonly TResponseInput: ResponseInput;
  readonly TResponseOutput: ResponseOutput;
  readonly TUrlVariablesInput: UrlVariablesInput;
  readonly TUrlVariablesOutput: UrlVariablesOutput;
};
/**
 * Return type for createEndpoint with full type inference from fields
 */
export type CreateEndpointReturnInMethod<
  TFields,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
> = {
  readonly [KMethod in TMethod]: CreateApiEndpoint<
    TExampleKey,
    KMethod,
    TUserRoleValue,
    TFields
  >;
};

/**
 * Create an endpoint definition with perfect type inference from unified fields
 * Returns both legacy format and new destructured format for maximum compatibility
 */
export function createEndpoint<
  const TFields,
  const TExampleKey extends string,
  const TMethod extends Methods,
  const TUserRoleValue extends readonly string[],
>(
  config: ApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>,
): CreateEndpointReturnInMethod<TFields, TExampleKey, TMethod, TUserRoleValue> {
  // Generate schemas from unified fields with type assertions for better TypeScript display
  const requestSchema = generateRequestDataSchema(
    config.fields,
  ) as InferSchemaFromField<TFields, FieldUsage.RequestData>;
  const responseSchema = generateResponseSchema(
    config.fields,
  ) as InferSchemaFromField<TFields, FieldUsage.Response>;
  const requestUrlSchema = generateRequestUrlSchema(
    config.fields,
  ) as InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>;

  function requiresAuthentication(): boolean {
    // Endpoint requires authentication if PUBLIC role is NOT in the allowed roles
    return !config.allowedRoles.includes(UserRole.PUBLIC);
  }

  // Create endpoint with proper type inference - preserve actual schema types for input/output differentiation
  const endpointDefinition: CreateApiEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields
  > = {
    method: config.method,
    path: config.path,
    title: config.title,
    description: config.description,
    category: config.category,
    tags: config.tags,
    fields: config.fields,
    allowedRoles: config.allowedRoles,
    examples: config.examples,
    errorTypes: config.errorTypes,
    successTypes: config.successTypes,
    debug: config.debug,
    aliases: config.aliases,
    cli: config.cli,
    requestSchema,
    responseSchema,
    requestUrlParamsSchema: requestUrlSchema,
    requiresAuthentication,
    types: {
      RequestInput: undefined! as ExtractInput<
        InferSchemaFromField<TFields, FieldUsage.RequestData>
      >,
      RequestOutput: undefined! as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.RequestData>
      >,
      ResponseInput: undefined! as ExtractInput<
        InferSchemaFromField<TFields, FieldUsage.Response>
      >,
      ResponseOutput: undefined! as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.Response>
      >,
      UrlVariablesInput: undefined! as ExtractInput<
        InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
      >,
      UrlVariablesOutput: undefined! as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
      >,
    },
    // Direct type access - no need for complex inference
    TRequestInput: undefined! as ExtractInput<
      InferSchemaFromField<TFields, FieldUsage.RequestData>
    >,
    TRequestOutput: undefined! as ExtractOutput<
      InferSchemaFromField<TFields, FieldUsage.RequestData>
    >,
    TResponseInput: undefined! as ExtractInput<
      InferSchemaFromField<TFields, FieldUsage.Response>
    >,
    TResponseOutput: undefined! as ExtractOutput<
      InferSchemaFromField<TFields, FieldUsage.Response>
    >,
    TUrlVariablesInput: undefined! as ExtractInput<
      InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
    >,
    TUrlVariablesOutput: undefined! as ExtractOutput<
      InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
    >,
  };

  // Return the method-keyed object with proper type inference
  return {
    [config.method]: endpointDefinition,
  } as CreateEndpointReturnInMethod<TFields, TExampleKey, TMethod, TUserRoleValue>;
}
