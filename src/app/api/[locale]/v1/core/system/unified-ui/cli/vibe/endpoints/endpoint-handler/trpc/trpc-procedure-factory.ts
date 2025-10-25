/**
 * tRPC Procedure Factory
 * Converts ApiEndpoint definitions into tRPC procedures while preserving all metadata and business logic
 * Integrates with existing next-vibe systems (auth, validation, emails, etc.)
 *
 * @deprecated This file uses an outdated API and needs major refactoring
 * TODO: Update to use the new endpointHandler API
 */

import { z } from "zod";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { UnifiedField } from "../../endpoint-types/core/types";
import type {
  ApiEndpoint,
  CreateApiEndpoint,
} from "../../endpoint-types/endpoint/create";
import { createEndpointLogger } from "../logger/endpoint-logger";
// import { endpointHandler } from "../endpoint-handler"; // Unused for now
import type { ApiHandlerFunction, ApiHandlerOptions } from "../types";
import {
  authenticatedProcedure,
  createAdminProcedure,
  createCustomerProcedure,
  publicProcedure,
  requireRoles,
} from "./trpc";
import { createTRPCHandler } from "./trpc-handler";

/**
 * Create a tRPC procedure from an ApiEndpoint definition
 * Automatically selects the appropriate base procedure based on endpoint roles
 */
export function createTRPCProcedureFromEndpoint<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
>(
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
  >,
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue
  >,
  options?: {
    email?: ApiHandlerOptions<
      TRequestOutput,
      TResponseOutput,
      TUrlVariablesOutput,
      TExampleKey,
      TMethod,
      TUserRoleValue,
      TFields
    >["email"];
    sms?: ApiHandlerOptions<
      TRequestOutput,
      TResponseOutput,
      TUrlVariablesOutput,
      TExampleKey,
      TMethod,
      TUserRoleValue,
      TFields
    >["sms"];
  },
): any {
  // Create enhanced handler to get the tRPC procedure
  const trpcHandler = createTRPCHandler({
    endpoint: endpoint,

    handler: handler,
    email: options?.email,
    sms: options?.sms,
  });

  // Determine the base procedure based on endpoint roles
  const baseProcedure = selectBaseProcedure(endpoint.allowedRoles);

  // Create combined input schema that includes both request data and URL parameters

  const combinedInputSchema = createCombinedInputSchema(endpoint);

  // Create the appropriate tRPC procedure based on HTTP method
  switch (endpoint.method) {
    case Methods.GET:
      return baseProcedure
        .input(combinedInputSchema)
        .query(async ({ input, ctx }) => {
          // Split input into request data and URL variables
          const { urlVariables, requestData } = splitTRPCInput(
            input as {
              requestData: TRequestOutput;
              urlVariables?: TUrlVariablesOutput;
            },
          );

          // Update context with URL variables
          const enhancedCtx = {
            ...ctx,
            urlParams: urlVariables as Record<string, string>,
          };

          return await trpcHandler(
            { ...requestData, urlVariables },
            enhancedCtx,
          );
        });

    case Methods.POST:
    case Methods.PUT:
    case Methods.PATCH:
    case Methods.DELETE:
      return baseProcedure
        .input(combinedInputSchema)
        .mutation(async ({ input, ctx }) => {
          // Split input into request data and URL variables
          const { urlVariables, requestData } = splitTRPCInput(
            input as {
              requestData: TRequestOutput;
              urlVariables?: TUrlVariablesOutput;
            },
          );

          // Update context with URL variables
          const enhancedCtx = {
            ...ctx,
            urlParams: urlVariables as Record<string, string>,
          };

          return await trpcHandler(
            { ...requestData, urlVariables },
            enhancedCtx,
          );
        });

    default:
      // This should never happen in production as all supported methods are handled above
      return publicProcedure.query(() => {
        // eslint-disable-next-line no-restricted-syntax
        throw new Error("app.error.general.unsupported_method");
      });
  }
}

/**
 * Select the appropriate base tRPC procedure based on required roles
 */
function selectBaseProcedure<TUserRoleValue extends readonly string[]>(
  allowedRoles: TUserRoleValue,
):
  | typeof publicProcedure
  | typeof authenticatedProcedure
  | typeof customerProcedure {
  // If PUBLIC role is allowed, use public procedure
  if (allowedRoles.includes(UserRole.PUBLIC)) {
    return publicProcedure;
  }

  // If only ADMIN role is allowed, use admin procedure
  if (allowedRoles.length === 1 && allowedRoles.includes(UserRole.ADMIN)) {
    return adminProcedure;
  }

  // If ADMIN is included with other roles, use admin procedure
  if (allowedRoles.includes(UserRole.ADMIN)) {
    return adminProcedure;
  }

  // If CUSTOMER role is allowed, use customer procedure
  if (allowedRoles.includes(UserRole.CUSTOMER)) {
    return customerProcedure;
  }

  // For specific roles, create a custom procedure with role requirements
  if (allowedRoles.length > 0) {
    const logger = createEndpointLogger(false, Date.now(), "en-GLOBAL");
    return authenticatedProcedure.use(requireRoles(allowedRoles, logger));
  }

  // Default to authenticated procedure
  return authenticatedProcedure;
}

/**
 * Create multiple tRPC procedures from an endpoints object
 * Handles the common pattern of { GET: endpoint, POST: endpoint, etc. }
 */
export function createTRPCProceduresFromEndpoints<
  T extends Record<
    string,
    CreateApiEndpoint<string, Methods, readonly string[], any>
  >,
>(
  endpoints: T,
  handlers: Record<
    keyof T,
    ApiHandlerFunction<
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      readonly string[]
    >
  >,
  options?: Record<
    keyof T,
    {
      email?: ApiHandlerOptions<
        Record<string, string | number | boolean>,
        Record<string, string | number | boolean>,
        Record<string, string | number | boolean>,
        string,
        Methods,
        readonly string[],
        any
      >["email"];
      sms?: ApiHandlerOptions<
        Record<string, string | number | boolean>,
        Record<string, string | number | boolean>,
        Record<string, string | number | boolean>,
        string,
        Methods,
        readonly string[],
        any
      >["sms"];
    }
  >,
): Record<
  keyof T,
  ReturnType<typeof publicProcedure.query | typeof publicProcedure.mutation>
> {
  const procedures: Record<
    keyof T,
    ReturnType<typeof publicProcedure.query | typeof publicProcedure.mutation>
  > = {} as Record<
    keyof T,
    ReturnType<typeof publicProcedure.query | typeof publicProcedure.mutation>
  >;

  for (const [method, endpoint] of Object.entries(endpoints)) {
    if (endpoint && handlers[method as keyof T]) {
      const handler = handlers[method as keyof T];
      const procedureOptions = options?.[method as keyof T];

      procedures[method as keyof T] = createTRPCProcedureFromEndpoint(
        endpoint,
        handler,
        procedureOptions,
      );
    }
  }

  return procedures;
}

/**
 * Helper to create tRPC procedures from a route file's exports
 * Expects the route file to export handlers and optionally email/sms configs
 */
export function createTRPCProceduresFromRouteExports(routeExports: {
  definitions?: Record<
    string,
    CreateApiEndpoint<string, Methods, readonly string[], any>
  >;
  handlers?: Record<
    string,
    ApiHandlerFunction<
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      readonly string[]
    >
  >;
  email?: Record<string, Record<string, string | number | boolean>>;
  sms?: Record<string, Record<string, string | number | boolean>>;
}): Record<
  string,
  ReturnType<typeof publicProcedure.query | typeof publicProcedure.mutation>
> {
  const { definitions, handlers, email, sms } = routeExports;

  if (!definitions || !handlers) {
    return {};
  }

  const options: Record<
    string,
    {
      email?: Record<string, string | number | boolean>;
      sms?: Record<string, string | number | boolean>;
    }
  > = {};

  // Map email and sms configs to handlers
  if (email) {
    for (const [method, emailConfig] of Object.entries(email)) {
      options[method] = { email: emailConfig };
    }
  }

  if (sms) {
    for (const [method, smsConfig] of Object.entries(sms)) {
      options[method] = {
        ...options[method],
        sms: smsConfig,
      };
    }
  }

  return createTRPCProceduresFromEndpoints(definitions, handlers, options);
}

/**
 * Type helper to extract procedure types from endpoints
 */
export type ExtractTRPCProcedures<T> = {
  [K in keyof T]: T[K] extends ApiEndpoint<
    string,
    Methods,
    readonly string[],
    any
  >
    ? T[K]["method"] extends Methods.GET
      ? ReturnType<typeof publicProcedure.query>
      : ReturnType<typeof publicProcedure.mutation>
    : never;
};

/**
 * Route file structure for validation
 */
export interface RouteFileStructure {
  definitions?: Record<
    string,
    CreateApiEndpoint<string, Methods, readonly string[], any>
  >;
  handlers?: Record<
    string,
    ApiHandlerFunction<
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      readonly string[]
    >
  >;
  email?: Record<string, Record<string, string | number | boolean>>;
  sms?: Record<string, Record<string, string | number | boolean>>;
}

/**
 * Utility to validate that a route file has the correct structure for tRPC conversion
 */
export function validateRouteFileForTRPC(routeFile: RouteFileStructure): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for handler exports (GET, POST, etc.)
  const httpMethods = [
    Methods.GET,
    Methods.POST,
    Methods.PUT,
    Methods.PATCH,
    Methods.DELETE,
  ];
  const hasAnyHandler = httpMethods.some((method) => routeFile[method]);

  if (!hasAnyHandler) {
    errors.push("app.error.general.no_http_handlers");
  }

  // For the new endpoint system, we don't require definitions or trpc exports
  // The route is valid if it has HTTP method handlers from endpointsHandler
  const hasEndpointsHandler =
    "GET" in routeFile ||
    "POST" in routeFile ||
    "PUT" in routeFile ||
    "PATCH" in routeFile ||
    "DELETE" in routeFile;

  if (hasEndpointsHandler) {
    // This is a new-style endpoint, which is valid for tRPC generation
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }

  // Check for old-style tRPC export (legacy support)
  if (routeFile.trpc) {
    return {
      isValid: true,
      errors: [],
      warnings: ["app.error.general.legacy_trpc_format"],
    };
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create a combined input schema that includes both request data and URL parameters
 */
/**
 * Create a combined input schema that includes both request data and URL parameters
 *
 * SCHEMA MERGING IMPLEMENTATION:
 * This function properly merges the request schema with URL parameters schema to create
 * a unified input schema for tRPC procedures. It handles endpoints both with and without
 * URL parameters by wrapping them in a consistent structure.
 *
 * The merging approach:
 * 1. When URL parameters are present: Creates a schema with both requestData and urlVariables
 * 2. When no URL parameters: Creates a schema with requestData and optional urlVariables
 * 3. Uses z.object() to create a new composite schema that properly validates both parts
 *
 * Schema structure:
 * - requestData: The original request schema (required)
 * - urlVariables: The URL parameters schema (optional when not present)
 *
 * This approach ensures type safety and proper validation for both request body data
 * and URL parameters in tRPC procedures, resolving the complex type merging issues
 * that were previously handled inadequately.
 */
function createCombinedInputSchema<
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
>(
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
  >,
): z.ZodTypeAny {
  // Check if endpoint has URL parameters
  if (endpoint.requestUrlParamsSchema) {
    // Create a combined schema that includes both request data and URL variables
    // We use z.object to create a new schema that merges both
    return z.object({
      requestData: endpoint.requestSchema,
      urlVariables: endpoint.requestUrlParamsSchema,
    });
  }

  // No URL parameters, just wrap the request schema in a consistent format
  return z.object({
    requestData: endpoint.requestSchema,
    urlVariables: z.undefined().optional(),
  });
}

/**
 * Split tRPC input into request data and URL variables
 *
 * This function extracts the request data and URL variables from the combined
 * input schema created by createCombinedInputSchema. It handles the case where
 * URL variables might be undefined and provides a consistent interface for
 * accessing both types of data.
 *
 * @param input - The combined input containing requestData and optional urlVariables
 * @returns An object with separated urlVariables and requestData
 */
function splitTRPCInput<TRequest, TUrlVariables>(input: {
  requestData: TRequest;
  urlVariables?: TUrlVariables;
}): { urlVariables: TUrlVariables; requestData: TRequest } {
  const urlVariables = input.urlVariables ?? ({} as TUrlVariables);
  const requestData = input.requestData;

  return { urlVariables, requestData };
}
