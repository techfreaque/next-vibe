/**
 * tRPC Procedure Factory
 * Converts ApiEndpoint definitions into tRPC procedures while preserving all metadata and business logic
 * Integrates with existing next-vibe systems (auth, validation, emails, etc.)
 *
 * @deprecated This file uses an outdated API and needs major refactoring
 * TODO: Update to use the new endpointHandler API
 */

import { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { createTRPCHandler } from "../trpc/handler";
import { createEndpointLogger } from "../shared/logger/endpoint";
import type {
  ApiHandlerFunction,
  ApiHandlerOptions,
} from "../shared/types/handler";
import {
  authenticatedProcedure,
  createAdminProcedure,
  createCustomerProcedure,
  publicProcedure,
  requireRoles,
} from "./trpc-trpc";
// import { endpointHandler } from "../endpoint-handler"; // Unused for now

/**
 * Create a tRPC procedure from an ApiEndpoint definition
 * Automatically selects the appropriate base procedure based on endpoint roles
 */
export function createTRPCProcedureFromEndpoint<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // Create enhanced handler to get the tRPC procedure

  const trpcHandler = createTRPCHandler({
    endpoint: endpoint,

    handler: handler,
    email: options?.email,
    sms: options?.sms,
  });

  // Determine the base procedure based on endpoint roles
  // Using en-GLOBAL as default since this is deprecated code
  const baseProcedure = selectBaseProcedure(endpoint.allowedRoles, "en-GLOBAL");

  // Create combined input schema that includes both request data and URL parameters

  const combinedInputSchema = createCombinedInputSchema(endpoint);

  // Create the appropriate tRPC procedure based on HTTP method
  switch (endpoint.method) {
    case Methods.GET:
      return baseProcedure
        .input(combinedInputSchema)
        .query(async ({ input, ctx }) => {
          // Split input into request data and URL variables
          const { urlPathParams, requestData } = splitTRPCInput(
            input as {
              requestData: TRequestOutput;
              urlPathParams?: TUrlVariablesOutput;
            },
          );

          // Update context with URL variables
          const enhancedCtx = {
            ...ctx,
            urlPathParams: urlPathParams as Record<string, string>,
          };

          return await trpcHandler(
            { ...requestData, urlPathParams },
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
          const { urlPathParams, requestData } = splitTRPCInput(
            input as {
              requestData: TRequestOutput;
              urlPathParams?: TUrlVariablesOutput;
            },
          );

          // Update context with URL variables
          const enhancedCtx = {
            ...ctx,
            urlPathParams: urlPathParams as Record<string, string>,
          };

          return await trpcHandler(
            { ...requestData, urlPathParams },
            enhancedCtx,
          );
        });

    default:
      // This should never happen in production as all supported methods are handled above

      return publicProcedure.query(() => {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- tRPC procedure factory exhaustiveness check requires throwing for unsupported methods
        throw new Error("app.error.general.unsupported_method");
      });
  }
}

/**
 * Select the appropriate base tRPC procedure based on required roles
 */
function selectBaseProcedure<
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
>(
  allowedRoles: TUserRoleValue,
  locale: CountryLanguage,
):
  | typeof publicProcedure
  | typeof authenticatedProcedure
  | ReturnType<typeof authenticatedProcedure.use> {
  const logger = createEndpointLogger(false, Date.now(), locale);

  // If PUBLIC role is allowed, use public procedure
  if (allowedRoles.includes(UserRole.PUBLIC)) {
    return publicProcedure;
  }

  // If only ADMIN role is allowed, use admin procedure
  if (allowedRoles.length === 1 && allowedRoles.includes(UserRole.ADMIN)) {
    return createAdminProcedure(logger);
  }

  // If ADMIN is included with other roles, use admin procedure
  if (allowedRoles.includes(UserRole.ADMIN)) {
    return createAdminProcedure(logger);
  }

  // If CUSTOMER role is allowed, use customer procedure
  if (allowedRoles.includes(UserRole.CUSTOMER)) {
    return createCustomerProcedure(logger);
  }

  // For specific roles, create a custom procedure with role requirements
  if (allowedRoles.length > 0) {
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
    CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      TFields,
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
    >
  >,
  TFields = Record<string, never>,
>(
  endpoints: T,
  handlers: Record<
    keyof T,
    ApiHandlerFunction<
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      readonly (typeof UserRoleValue)[]
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
        readonly (typeof UserRoleValue)[],
        TFields
      >["email"];
      sms?: ApiHandlerOptions<
        Record<string, string | number | boolean>,
        Record<string, string | number | boolean>,
        Record<string, string | number | boolean>,
        string,
        Methods,
        readonly (typeof UserRoleValue)[],
        TFields
      >["sms"];
    }
  >,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<keyof T, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const procedures: Record<keyof T, any> = {} as Record<keyof T, any>;

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
    CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      Record<string, never>,
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
    >
  >;
  handlers?: Record<
    string,
    ApiHandlerFunction<
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      readonly (typeof UserRoleValue)[]
    >
  >;
  email?: Record<string, Record<string, string | number | boolean>>;
  sms?: Record<string, Record<string, string | number | boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Record<string, any> {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    infer _TFields,
    any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
    any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
    any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
    any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
    any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
    any // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
  >
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    : never;
};

/**
 * Route file structure for validation
 */
export interface RouteFileStructure {
  definitions?: Record<
    string,
    CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      Record<string, never>,
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
      any // eslint-disable-line @typescript-eslint/no-explicit-any -- Complex tRPC generic requires flexible type parameters
    >
  >;
  handlers?: Record<
    string,
    ApiHandlerFunction<
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      Record<string, string | number | boolean>,
      readonly (typeof UserRoleValue)[]
    >
  >;
  email?: Record<string, Record<string, string | number | boolean>>;
  sms?: Record<string, Record<string, string | number | boolean>>;
}

/**
 * Utility to validate that a route file has the correct structure for tRPC conversion
 */
export function validateRouteFileForTRPC(routeFile: RouteFileStructure & Record<string, unknown>): {
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
  const hasAnyHandler = httpMethods.some((method) => method in routeFile);

  if (!hasAnyHandler) {
    errors.push("app.error.general.no_http_handlers");
  }

  // For the new endpoint system, we require tools export from endpointsHandler
  // The route is valid if it has HTTP method handlers AND tools export
  const hasEndpointsHandler =
    "GET" in routeFile ||
    "POST" in routeFile ||
    "PUT" in routeFile ||
    "PATCH" in routeFile ||
    "DELETE" in routeFile;

  const hasToolsExport = "tools" in routeFile;

  if (hasEndpointsHandler && hasToolsExport) {
    // This is a new-style endpoint with tools.trpc export, valid for tRPC generation
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  }

  if (hasEndpointsHandler && !hasToolsExport) {
    // Has handlers but no tools export - likely a simple Next.js route, not valid for tRPC
    errors.push("app.error.general.missing_tools_export");
  }

  // Check for old-style tRPC export (legacy support)
  if ("trpc" in routeFile) {
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
 * 1. When URL parameters are present: Creates a schema with both requestData and urlPathParams
 * 2. When no URL parameters: Creates a schema with requestData and optional urlPathParams
 * 3. Uses z.object() to create a new composite schema that properly validates both parts
 *
 * Schema structure:
 * - requestData: The original request schema (required)
 * - urlPathParams: The URL parameters schema (optional when not present)
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
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
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
  if (endpoint.requestUrlPathParamsSchema) {
    // Create a combined schema that includes both request data and URL variables
    // We use z.object to create a new schema that merges both
    return z.object({
      requestData: endpoint.requestSchema,
      urlPathParams: endpoint.requestUrlPathParamsSchema,
    });
  }

  // No URL parameters, just wrap the request schema in a consistent format
  return z.object({
    requestData: endpoint.requestSchema,
    urlPathParams: z.undefined().optional(),
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
 * @param input - The combined input containing requestData and optional urlPathParams
 * @returns An object with separated urlPathParams and requestData
 */
function splitTRPCInput<TRequest, TUrlVariables>(input: {
  requestData: TRequest;
  urlPathParams?: TUrlVariables;
}): { urlPathParams: TUrlVariables; requestData: TRequest } {
  const urlPathParams = input.urlPathParams ?? ({} as TUrlVariables);
  const requestData = input.requestData;

  return { urlPathParams, requestData };
}
