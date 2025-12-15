/* eslint-disable i18next/no-literal-string */
// Testing infrastructure - error messages are for test debugging, not end users

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isStreamingResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { routeExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import type { UserRoleValue } from "../../../../user/user-roles/enum";

/**
 * Call the API handler directly via the vibe runtime executor
 * Uses routeExecutionExecutor which is the same infrastructure used by CLI, MCP, and AI tools
 */
export async function sendTestRequest<
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields extends UnifiedField<z.ZodTypeAny>,
  TRequestInput = Record<string, string | number | boolean | null>,
  TUrlVariablesInput = Record<string, string | number | boolean | null>,
>({
  endpoint,
  data,
  urlPathParams,
  user,
}: {
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
  data: TRequestOutput;
  urlPathParams: TUrlVariablesOutput;
  user: JwtPayloadType;
}): Promise<ResponseType<TResponseOutput>> {
  // Create default user based on endpoint configuration if not provided
  const testUser: JwtPayloadType =
    user ??
    (endpoint.requiresAuthentication()
      ? {
          isPublic: false,
          id: "00000000-0000-0000-0000-000000000001",
          leadId: "00000000-0000-0000-0000-000000000002",
        }
      : {
          isPublic: true,
          leadId: "00000000-0000-0000-0000-000000000002",
        });

  try {
    // Create a test logger
    const logger = createEndpointLogger(false, Date.now(), defaultLocale);

    // Build the tool name from endpoint path and method
    // Format: "user/public/login/POST"
    const toolName = `${endpoint.path.join("/")}/${endpoint.method}`;

    // Execute using the shared route execution executor
    // This is the same infrastructure used by CLI, MCP, and AI tools
    const result = await routeExecutionExecutor.executeGenericHandler<
      TRequestOutput,
      TUrlVariablesOutput,
      TResponseOutput
    >({
      toolName,
      data,
      urlPathParams,
      user: testUser,
      locale: defaultLocale,
      logger,
      platform: Platform.CLI, // Use CLI platform for testing
    });

    // Handle streaming responses (convert to error for tests)
    if (isStreamingResponse(result)) {
      return fail({
        message: "app.api.system.check.testing.test.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: "Streaming responses are not supported in tests",
        },
      });
    }

    // Validate response against endpoint schema if available
    if (endpoint.responseSchema && result.success) {
      const parseResult = endpoint.responseSchema.safeParse(result.data);
      if (!parseResult.success) {
        return fail({
          message: "app.api.system.check.testing.test.errors.internal.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            endpoint: endpoint.path.join("/"),
            errors: parseResult.error.issues
              .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
              .join(", "),
          },
        });
      }
    }

    return result;
  } catch (error) {
    return fail({
      message: "app.api.system.check.testing.test.errors.internal.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parseError(error).message },
    });
  }
}
