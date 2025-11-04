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
import type {
  ResponseType,
  StreamingResponse,
} from "next-vibe/shared/types/response.schema";

import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/types";
import type { SmsFunctionType } from "@/app/api/[locale]/v1/core/sms/utils";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { CliHandlerReturnType } from "../../cli/executor-types";
import type {
  IMCPProtocolHandler,
  IMCPTransport,
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcResponse,
  MCPErrorCode,
  MCPInitializeParams,
  MCPInitializeResult,
  MCPMethod,
  MCPToolCallParams,
  MCPToolCallResult,
  MCPToolsListParams,
  MCPToolsListResult,
} from "../../mcp/types";
import type { NextHandlerReturnType } from "../../next-api/types";
import type { TrpcHandlerReturnType } from "../../trpc/types";
import type { CreateApiEndpoint } from "../endpoint/create";
import type { EndpointLogger } from "../logger/endpoint";
import type { Methods } from "./enums";
import { type UserRole } from "../../../../user/db";

// Re-export MCP types for convenience
export type {
  IMCPProtocolHandler,
  IMCPTransport,
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcResponse,
  MCPInitializeParams,
  MCPInitializeResult,
  MCPToolCallParams,
  MCPToolCallResult,
  MCPToolsListParams,
  MCPToolsListResult,
};
export { MCPErrorCode, MCPMethod };

// Re-export handler return types for convenience
export type {
  CliHandlerReturnType,
  NextHandlerReturnType,
  TrpcHandlerReturnType,
};

/**
 * Route module structure returned from dynamic imports
 * This is the standard structure created by endpointsHandler
 */
type DefaultRequestData = Record<string, string | number | boolean | null>;

/**
 * Helper type to extract response output type from endpoint, with fallback
 */
type ExtractResponseOutput<TEndpoint> = TEndpoint extends {
  types: { ResponseOutput: infer R };
}
  ? R
  : DefaultRequestData;

/**
 * Helper type to extract request output type from endpoint, with fallback
 */
type ExtractRequestOutput<TEndpoint> = TEndpoint extends {
  types: { RequestOutput: infer R };
}
  ? R
  : DefaultRequestData;

/**
 * Helper type to extract URL variables input type from endpoint, with fallback
 */
type ExtractUrlVariablesInput<TEndpoint> = TEndpoint extends {
  types: { UrlVariablesInput: infer U };
}
  ? U
  : DefaultRequestData;

/**
 * Helper type to extract URL variables output type from endpoint, with fallback
 */
type ExtractUrlVariablesOutput<TEndpoint> = TEndpoint extends {
  types: { UrlVariablesOutput: infer U };
}
  ? U
  : DefaultRequestData;

/**
 * Helper type to extract allowed roles from endpoint, with fallback
 */
type ExtractAllowedRoles<TEndpoint> = TEndpoint extends {
  allowedRoles: infer Roles extends readonly (typeof UserRoleValue)[];
}
  ? Roles
  : readonly (typeof UserRoleValue)[];

export interface RouteModule<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  > = CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  >,
> {
  // HTTP method handlers (GET, POST, PUT, PATCH, DELETE)
  readonly GET?: NextHandlerReturnType<
    ExtractResponseOutput<TEndpoint>,
    ExtractUrlVariablesInput<TEndpoint>
  >;
  readonly POST?: NextHandlerReturnType<
    ExtractResponseOutput<TEndpoint>,
    ExtractUrlVariablesInput<TEndpoint>
  >;
  readonly PUT?: NextHandlerReturnType<
    ExtractResponseOutput<TEndpoint>,
    ExtractUrlVariablesInput<TEndpoint>
  >;
  readonly PATCH?: NextHandlerReturnType<
    ExtractResponseOutput<TEndpoint>,
    ExtractUrlVariablesInput<TEndpoint>
  >;
  readonly DELETE?: NextHandlerReturnType<
    ExtractResponseOutput<TEndpoint>,
    ExtractUrlVariablesInput<TEndpoint>
  >;

  readonly tools?: {
    readonly definitions?: {
      readonly [K in Methods]?: TEndpoint;
    };
    readonly cli?:
      | CliHandlerReturnType<
          ExtractRequestOutput<TEndpoint>,
          ExtractResponseOutput<TEndpoint>,
          ExtractUrlVariablesOutput<TEndpoint>,
          ExtractAllowedRoles<TEndpoint>
        >
      | {
          readonly [key: string]: CliHandlerReturnType<
            ExtractRequestOutput<TEndpoint>,
            ExtractResponseOutput<TEndpoint>,
            ExtractUrlVariablesOutput<TEndpoint>,
            ExtractAllowedRoles<TEndpoint>
          >;
        };
    readonly trpc?: TrpcHandlerReturnType<
      ExtractRequestOutput<TEndpoint>,
      ExtractResponseOutput<TEndpoint>,
      ExtractUrlVariablesOutput<TEndpoint>
    >;
  };
}

/**
 * Definition module structure for definition.ts files
 */
export interface DefinitionModule<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  > = CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    DefaultRequestData
  >,
> {
  default?: Record<string, TEndpoint>;
}

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
 *
 * Logic:
 * - Exclude<TRoles[number], "PUBLIC"> removes "PUBLIC" from the union
 * - If the result is never, then ONLY PUBLIC was in the array → JWTPublicPayloadType
 * - If TRoles[number] includes "PUBLIC" (check with Extract) → JwtPayloadType (mixed)
 * - Otherwise → JwtPrivatePayloadType (no PUBLIC, guaranteed authenticated)
 */
export type InferJwtPayloadTypeFromRoles<
  TRoles extends readonly (typeof UserRoleValue)[],
> =
  Exclude<TRoles[number], typeof UserRole.PUBLIC> extends never
    ? JWTPublicPayloadType
    : Extract<TRoles[number], typeof UserRole.PUBLIC> extends never
      ? JwtPrivatePayloadType
      : JwtPayloadType;

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
      urlPathParamsInput: TUrlVariablesInput;
      urlPathParamsOutput: TUrlVariablesOutput;
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
          RequestOutput: infer TReqOut;
          ResponseOutput: infer TResOut;
          UrlVariablesOutput: infer TUrlOut;
        };
        allowedRoles: readonly (typeof UserRoleValue)[];
      }
      ? MethodHandlerConfig<TReqOut, TResOut, TUrlOut, T[K]["allowedRoles"]>
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
              urlPathParams?: T[K] extends {
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
  urlPathParams: TUrlVariablesOutput;

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
 *
 * Type parameters with inferred defaults:
 * - TRequestInput/Output: Inferred from endpoint.types.RequestInput/RequestOutput
 * - TResponseInput/Output: Inferred from endpoint.types.ResponseInput/ResponseOutput
 * - TUrlVariablesInput/Output: Inferred from endpoint.types.UrlVariablesInput/UrlVariablesOutput
 */
export interface ApiHandlerOptions<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields,
  TRequestInput = TRequestOutput,
  TResponseInput = TResponseOutput,
  TUrlVariablesInput = TUrlVariablesOutput,
> {
  /** API endpoint definition */
  endpoint: CreateApiEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields,
    TRequestInput,
    TRequestOutput,
    TResponseInput,
    TResponseOutput,
    TUrlVariablesInput,
    TUrlVariablesOutput
  >;

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
