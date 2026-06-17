// Testing infrastructure - error messages are for test debugging, not end users

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isStreamingResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import { UserPermissionRole } from "../../../../user/user-roles/enum";
import type { CreateApiEndpointAny } from "../../../unified-interface/shared/types/endpoint-base";
import { scopedTranslation } from "../../i18n";

/**
 * Call the API handler directly via the vibe runtime executor
 * Uses RouteExecutionExecutor which is the same infrastructure used by CLI, MCP, and AI tools
 */
export async function sendTestRequest<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  data,
  urlPathParams,
  user,
  instanceId,
}: {
  endpoint: TEndpoint;
  user?: JwtPayloadType;
  instanceId?: string;
} & (TEndpoint["types"]["RequestOutput"] extends never
  ? { data?: never }
  : { data: TEndpoint["types"]["RequestOutput"] }) &
  (TEndpoint["types"]["UrlVariablesOutput"] extends never
    ? { urlPathParams?: never }
    : { urlPathParams: TEndpoint["types"]["UrlVariablesOutput"] })): Promise<
  ResponseType<TEndpoint["types"]["ResponseOutput"]>
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

    const { RouteExecuteRepository } =
      await import("@/app/api/[locale]/system/unified-interface/execute-tool/repository");

    // Execute using the shared route execution infrastructure
    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: endpoint,
      instanceId,
      input: data,
      urlPathParams: urlPathParams,
      user: testUser,
      locale: defaultLocale,
      logger,
      platform: Platform.NEXT_API,
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
