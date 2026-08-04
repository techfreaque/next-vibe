// Testing infrastructure - error messages are for test debugging, not end users

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";

import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { defaultLocale } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isStreamingResponse,
} from "../../../core/route/response.schema";
import type { WidgetData } from "../../../core/utils/json";
import { parseError } from "../../../core/utils/parse-error";
import type { JwtPayloadType } from "../../../identity/auth/types";
import { UserPermissionRole } from "../../../identity/roles/enum";
import { createEndpointLogger } from "../../../logger/server";
import { Platform } from "../../../platforms/platforms";
import { scopedTranslation } from "../test/i18n";

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
  toolExecutionContext,
}: {
  endpoint: TEndpoint;
  user?: JwtPayloadType;
  instanceId?: string;
  /**
   * The execution's stream context — carries the fixture chain (threadId) so
   * the whole chain (AI providers, media tools, remote dispatch) records and
   * replays under the test case's thread. Explicit, never ambient. Non-AI
   * setup callers pass an explicit thread-less makeHeadlessContext(u, u).
   * Pass undefined for pure validation/auth tests that don't touch AI infra.
   */
  toolExecutionContext: ToolExecutionContext | undefined;
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
    const logger = createEndpointLogger(false, defaultLocale);

    const { runEndpointByName } =
      await import("../../../execute-tool/repository/run-endpoint-by-name");
    const rawToolName =
      endpoint.aliases?.[0] ?? `${endpoint.path.join("_")}_${endpoint.method}`;
    const toolName = rawToolName.replaceAll(/\[([^\]]+)\]/g, "$1");

    // Execute using the shared route execution infrastructure. The caller's
    // toolExecutionContext (fixture chain, threadId) rides straight through — the
    // whole AI/media/remote chain records and replays under it. Non-AI setup
    // callers pass an explicit thread-less root (makeHeadlessContext(u,u)),
    // which routes any incidental external call live.
    const result = await runEndpointByName({
      toolName,
      instanceId,
      input: {
        ...(data as Record<string, WidgetData>),
        ...(urlPathParams as Record<string, WidgetData>),
      },
      user: testUser,
      locale: defaultLocale,
      logger,
      platform: Platform.NEXT_API,
      toolExecutionContext:
        toolExecutionContext ??
        makeHeadlessContext(undefined, undefined, "UTC"),
    });

    const { t } = scopedTranslation.scopedT(defaultLocale);
    // Handle streaming responses (convert to error for tests)
    if (isStreamingResponse(result)) {
      return fail({
        message: t("errors.streamingUnsupported"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Validate response against endpoint schema if available.
    // Skip for ContentResponse (mixed content blocks) — it bypasses the typed schema.
    const { isContentResponse } =
      await import("../../../core/route/response.schema");
    const isContentData =
      result.success &&
      isContentResponse(result.data as Parameters<typeof isContentResponse>[0]);
    if (endpoint.responseSchema && result.success && !isContentData) {
      const parseResult = endpoint.responseSchema.safeParse(result.data);
      if (!parseResult.success) {
        return fail({
          message: t("errors.responseSchemaFailed", {
            path: endpoint.path.join("/"),
            issues: parseResult.error.issues
              .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
              .join(", "),
          }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
    }

    return result;
  } catch (error) {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    return fail({
      message: t("errors.requestFailed", { detail: parseError(error).message }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
