/**
 * Endpoint Handler Types
 *
 * Type definitions for the endpoint handler system
 *
 * IMPORTANT: Handler Flow Documentation & Type Definitions
 * =======================================================
 *
 * **Current Type System (with naming inconsistency):**
 * - TRequestInput: Validated request data (what Zod schemas produce)
 * - TRequestOutput: Raw request data (what Zod schemas consume)
 * - TResponseInput: Validated response data (what Zod schemas produce)
 * - TResponseOutput: Raw response data (what Zod schemas consume)
 * - TUrlVariablesInput: Validated URL parameters (what Zod schemas produce)
 * - TUrlVariablesOutput: Raw URL parameters (what Zod schemas consume)
 *
 * **Handler Flow:**
 * 1. External interfaces (Next.js, tRPC, CLI) receive raw data (TRequestOutput, TUrlVariablesOutput)
 * 2. Platform validation modules validate raw → validated using Zod schemas
 * 3. Domain handlers receive validated data (currently TRequestOutput, TUrlVariablesOutput)
 * 4. Domain handlers return validated response (TResponseOutput)
 * 5. Response gets validated and serialized for client
 *
 * **Schema Definitions:**
 * - requestSchema: z.ZodSchema<TRequestInput, z.ZodTypeDef, TRequestOutput>
 *   Takes TRequestOutput (raw) and produces TRequestInput (validated)
 * - responseSchema: z.ZodSchema<TResponseInput, z.ZodTypeDef, TResponseOutput>
 *   Takes TResponseOutput (raw) and produces TResponseInput (validated)
 * - requestUrlSchema: z.ZodSchema<TUrlVariablesInput, z.ZodTypeDef, TUrlVariablesOutput>
 *   Takes TUrlVariablesOutput (raw) and produces TUrlVariablesInput (validated)
 *
 * **Note:** The naming is counterintuitive but maintained for backward compatibility.
 * In practice, handlers receive the "Output" types which contain validated data.
 */

import type { NextRequest, NextResponse } from "next/server";
import type { SmsFunctionType } from "next-vibe/server/sms/utils";
import type {
  ResponseType,
  StreamingResponse,
} from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/definition";
import type {
  UserRole,
  UserRoleValue,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "../../../../../../user/auth/definition";
import type { Methods } from "../endpoint-types/core/enums";
import type { UnifiedField } from "../endpoint-types/core/types";
import type { CreateApiEndpoint } from "../endpoint-types/endpoint/create";
import type { CliHandlerReturnType } from "./cli/types";
import type { EndpointLogger } from "./logger";
import type { NextHandlerReturnType } from "./next/types";
import type { TrpcHandlerReturnType } from "./trpc/types";

/**
 * Type helper to infer JWT payload type based on user roles
 * - Only PUBLIC role in roles → JWTPublicPayloadType
 * - No PUBLIC role in roles → JwtPayloadType
 * - Mixed roles (includes PUBLIC + others) → JwtPayloadType (union)
 */
export type InferJwtPayloadType<TUserRoleValue extends typeof UserRoleValue> =
  TUserRoleValue extends typeof UserRole.PUBLIC
    ? JWTPublicPayloadType
    : JwtPayloadType;

/**
 * Type helper for arrays of user roles
 */
export type InferJwtPayloadTypeFromRoles<
  TRoles extends readonly (typeof UserRoleValue)[],
> = TRoles["length"] extends 1
  ? TRoles[0] extends typeof UserRole.PUBLIC
    ? JWTPublicPayloadType
    : JwtPrivatePayloadType
  : TRoles[number] extends typeof UserRole.PUBLIC
    ? JwtPayloadType
    : JwtPrivatePayloadType;

/**
 * Extract methods that exist in the definitions object
 */
export type ExtractMethods<T> = {
  [K in keyof T]: K extends Methods ? K : never;
}[keyof T];

/**
 * Extract complete endpoint type information from an ApiEndpoint
 */
export type ExtractEndpointTypeInfo<T> = T extends {
  types: {
    RequestInput: infer TRequestInput;
    RequestOutput: infer TRequestOutput;
    ResponseInput: infer TResponseInput;
    ResponseOutput: infer TResponseOutput;
    UrlVariablesInput: infer TUrlVariablesInput;
    UrlVariablesOutput: infer TUrlVariablesOutput;
  };
  method: infer TMethod;
  allowedRoles: infer TUserRoleValue;
}
  ? {
      requestInput: TRequestInput;
      requestOutput: TRequestOutput;
      responseInput: TResponseInput;
      responseOutput: TResponseOutput;
      urlVariablesInput: TUrlVariablesInput;
      urlVariablesOutput: TUrlVariablesOutput;
      method: TMethod;
      userRoleValue: TUserRoleValue;
    }
  : never;

/**
 * Handler configuration for a single method with proper typing
 * Handlers receive validated data (OUTPUT types) from Zod
 * and return validated response data (OUTPUT types)
 */
export interface MethodHandlerConfig<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> {
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue
  >;
  email?: EmailHandler<TRequestOutput, TResponseOutput, TUrlVariablesOutput>[];
  sms?: SMSHandler<TRequestOutput, TResponseOutput, TUrlVariablesOutput>[];
}

/**
 * Type-safe configuration that enforces handler types match endpoint types
 * Uses conditional types to extract exact types from each endpoint
 * Only requires handlers for methods that exist in the endpoint definition
 * Handlers receive OUTPUT types (validated data) and return OUTPUT types
 */
export type EndpointHandlerConfig<T> = {
  endpoint: T;
} & {
  [K in Methods]?: K extends keyof T
    ? T[K] extends {
        types: {
          RequestOutput: infer TRequestOutput;
          ResponseOutput: infer TResponseOutput;
          UrlVariablesOutput: infer TUrlVariablesOutput;
        };
        allowedRoles: infer TUserRoleValue extends
          readonly (typeof UserRoleValue)[];
      }
      ? MethodHandlerConfig<
          TRequestOutput,
          TResponseOutput,
          TUrlVariablesOutput,
          TUserRoleValue
        >
      : never
    : never;
};

/**
 * Return type for endpointsHandler with proper Next.js handler types
 * CLI handlers receive RAW input data (TRequestOutput, TUrlVariablesOutput)
 * tRPC handlers receive RAW input data (TRequestOutput, TUrlVariablesOutput)
 * Next.js handlers work with raw request objects
 * All return VALIDATED response data (TResponseOutput)
 */
export type EndpointsHandlerReturn<T> = {
  [K in keyof T]: (
    request: NextRequest,
    context: {
      params: Promise<Record<string, string> & { locale: CountryLanguage }>;
    },
  ) => Promise<
    NextResponse<ResponseType<Record<string, string | number | boolean>>>
  >;
} & {
  tools: {
    trpc: {
      [K in keyof T as K extends Methods
        ? K
        : never]: T[K] extends CreateApiEndpoint<
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        infer _TExampleKey,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        infer _TMethod,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        infer _TUserRoleValue,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        infer _TFields
      >
        ? (
            input: (T[K] extends { types: { RequestOutput: infer TReqOut } }
              ? TReqOut
              : Record<string, never>) & {
              urlVariables?: T[K] extends {
                types: { UrlVariablesOutput: infer TUrlOut };
              }
                ? TUrlOut
                : never;
            },
          ) => Promise<
            T[K] extends { types: { ResponseOutput: infer TResOut } }
              ? TResOut
              : never
          >
        : never;
    };
    cli: Record<
      string,
      CliHandlerReturnType<
        Record<string, string | number | boolean>,
        Record<string, string | number | boolean>,
        Record<string, string | number | boolean>,
        readonly (typeof UserRoleValue)[]
      >
    >;
  };
  definitions: T;
  methods: ExtractMethods<T>[];
};

/**
 * API handler props - handlers receive OUTPUT types (validated data)
 */
export interface ApiHandlerProps<
  TRequestOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> {
  /** Request data (validated by Zod schema) */
  data: TRequestOutput;

  /** URL variables (validated by Zod schema) */
  urlVariables: TUrlVariablesOutput;

  /** Authenticated user - type inferred from endpoint roles */
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>;

  /** Server translation function */
  t: TFunction;

  /** Locale */
  locale: CountryLanguage;

  /** Original request object */
  request: NextRequest;

  /** Logger instance for structured logging */
  logger: EndpointLogger;
}

/**
 * API handler function type - receives validated data and returns validated response
 * Note: In our schema system, TRequestInput is the validated data (what handlers should receive)
 * but the current interface uses TRequestOutput for backward compatibility
 *
 * Can return either:
 * - ResponseType<TResponseOutput> for standard JSON responses
 * - StreamingResponse for streaming endpoints (e.g., AI chat)
 */
export type ApiHandlerFunction<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> = (
  props: ApiHandlerProps<TRequestOutput, TUrlVariablesOutput, TUserRoleValue>,
) =>
  | Promise<ResponseType<TResponseOutput> | StreamingResponse>
  | ResponseType<TResponseOutput>
  | StreamingResponse;

/**
 * Email handler configuration
 */
export interface EmailHandler<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> {
  /** Email rendering function */
  render: EmailFunctionType<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput
  >;

  /** Whether to ignore errors during email sending */
  ignoreErrors?: boolean;
}

/**
 * SMS handler configuration
 */
export interface SMSHandler<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> {
  /** SMS rendering function */
  render: SmsFunctionType<TRequestOutput, TResponseOutput, TUrlVariablesOutput>;

  /** Whether to ignore errors during SMS sending */
  ignoreErrors?: boolean;
}

/**
 * API handler options - handlers receive OUTPUT types and return OUTPUT types
 */
export interface ApiHandlerOptions<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields,
> {
  /** API endpoint definition */
  endpoint: CreateApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>;

  /** Handler function - receives OUTPUT types, returns OUTPUT types */
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue
  >;

  /** Email handlers (optional) */
  email?:
    | {
        afterHandlerEmails?: EmailHandler<
          TRequestOutput,
          TResponseOutput,
          TUrlVariablesOutput
        >[];
      }
    | undefined;
  /** SMS handlers (optional) */
  sms?: {
    afterHandlerSms?: SMSHandler<
      TRequestOutput,
      TResponseOutput,
      TUrlVariablesOutput
    >[];
  };
}

/**
 * Enhanced API handler return type that supports both Next.js and tRPC
 */
export type EndpointHandlerReturn<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> = {
  [K in TMethod]: NextHandlerReturnType<TResponseOutput, TUrlVariablesOutput>;
} & {
  /** Tools object for endpointsHandler compatibility */
  tools: {
    trpc: TrpcHandlerReturnType<
      TRequestOutput,
      TResponseOutput,
      TUrlVariablesOutput
    >;
    cli: CliHandlerReturnType<
      TRequestOutput,
      TResponseOutput,
      TUrlVariablesOutput,
      TUserRoleValue
    >;
  };
};
