// Testing infrastructure - error messages are for test debugging, not end users

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isStreamingResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { z } from "zod";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type {
  CreateApiEndpoint,
  InferResponseOutput,
} from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type { EndpointEventsMap } from "@/app/api/[locale]/system/unified-interface/websocket/structured-events";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import {
  UserPermissionRole,
  type UserRoleValue,
} from "../../../../user/user-roles/enum";
import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../../unified-interface/unified-ui/widgets/_shared/types";
import { scopedTranslation } from "../../i18n";

/**
 * Call the API handler directly via the vibe runtime executor
 * Uses RouteExecutionExecutor which is the same infrastructure used by CLI, MCP, and AI tools
 */
export async function sendTestRequest<
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
  TEvents extends EndpointEventsMap<InferResponseOutput<TFields>>,
>({
  endpoint,
  data,
  urlPathParams,
  user,
}: {
  endpoint: CreateApiEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields,
    TEvents
  >;
  data?: CreateApiEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields,
    TEvents
  >["types"]["RequestOutput"];
  urlPathParams?: CreateApiEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields,
    TEvents
  >["types"]["UrlVariablesOutput"];
  user: JwtPayloadType;
}): Promise<
  ResponseType<
    CreateApiEndpoint<
      TMethod,
      TUserRoleValue,
      TScopedTranslationKey,
      TFields,
      TEvents
    >["types"]["ResponseOutput"]
  >
> {
  // Use provided user or resolve the real admin user from DB
  let testUser: JwtPayloadType;
  if (user) {
    testUser = user;
  } else if (endpoint.requiresAuthentication()) {
    const { resolveTestAdminUser } = await import("./resolve-test-user");
    testUser = await resolveTestAdminUser();
  } else {
    // Resolve the admin user to get a valid leadId, then create a public variant
    const { resolveTestAdminUser } = await import("./resolve-test-user");
    const admin = await resolveTestAdminUser();
    testUser = {
      isPublic: true,
      leadId: admin.leadId,
      roles: [UserPermissionRole.PUBLIC],
    };
  }

  try {
    // Create a test logger
    const logger = createEndpointLogger(false, Date.now(), defaultLocale);

    // Build the tool name from endpoint path and method
    // Format: "user_public_login_POST" (underscores match generated route-handlers.ts)
    // Strip brackets from path params: "[id]" → "id"
    const toolName = `${endpoint.path.map((s) => s.replace(/^\[|\]$/g, "")).join("_")}_${endpoint.method}`;

    // Execute using the shared route execution executor
    // This is the same infrastructure used by CLI, MCP, and AI tools
    const result = await RouteExecutionExecutor.executeGenericHandler<
      typeof endpoint.types.ResponseOutput
    >({
      toolName,
      data: data as Record<string, WidgetData>,
      urlPathParams: urlPathParams as Record<string, WidgetData> | undefined,
      user: testUser,
      locale: defaultLocale,
      logger,
      platform: Platform.CLI, // Use CLI platform for testing
      streamContext: {
        rootFolderId: DefaultFolderId.BACKGROUND,
        threadId: undefined,
        aiMessageId: undefined,
        skillId: undefined,
        headless: undefined,
        subAgentDepth: 0,
        currentToolMessageId: undefined,
        callerToolCallId: undefined,
        pendingToolMessages: undefined,
        pendingTimeoutMs: undefined,
        leafMessageId: undefined,
        waitingForRemoteResult: undefined,
        favoriteId: undefined,
        abortSignal: new AbortController().signal,
        callerCallbackMode: undefined,
        onEscalatedTaskCancel: undefined,
        escalateToTask: undefined,
        isRevival: undefined,

        providerOverride: undefined,
      },
    });

    const { t } = scopedTranslation.scopedT(defaultLocale);
    // Handle streaming responses (convert to error for tests)
    if (isStreamingResponse(result)) {
      return fail({
        message: t("testing.test.errors.internal.title"),
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
          message: t("testing.test.errors.internal.title"),
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
    const { t } = scopedTranslation.scopedT(defaultLocale);
    return fail({
      message: t("testing.test.errors.internal.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parseError(error).message },
    });
  }
}
