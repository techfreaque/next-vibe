/**
 * Validate a gated call's input BEFORE it is parked for confirmation.
 *
 * The requiresConfirmation gate used to park any call, valid or not: the user
 * approved a contact-form call whose input could never run (name missing,
 * subject not an option), and only then did the target reject it (prod
 * 2026-11-27, "[ConfirmedExecution] Tool execution failed"). A call that
 * cannot run must not reach the confirmation dialog; the model gets the
 * validation error now and can correct the call.
 *
 * Same steps the route handler runs before its own validation, so a call that
 * passes here passes there: requestDefaults patch, URL-param split, the role-
 * and platform-filtered request schema, and the lenient-caller repairs inside
 * validateHandlerRequestData.
 */

import "server-only";

import type { z } from "zod";

import { getFullPath } from "../../core/core-utils/path";
import { validateHandlerRequestData } from "../../core/route/request-validator";
import type { ErrorResponseType } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import { filterUserPermissionRoles } from "../../identity/roles/enum";
import { generateRoleFilteredRequestSchema } from "../../unified-ui/_shared/utils";
import { resolveCallerRequestDefaults } from "./transport/wire";
import type { RouteExecuteContext } from "./types";

export async function validateBeforeConfirmation(params: {
  ctx: RouteExecuteContext;
  input: Record<string, WidgetData>;
}): Promise<ErrorResponseType | null> {
  const { ctx } = params;
  const path = getFullPath(ctx.toolName);
  if (path === null) {
    return null;
  }
  const { getEndpoint } = await import("@/generated/endpoints/endpoint");
  const endpoint = await getEndpoint(path);
  if (!endpoint) {
    return null;
  }

  const input =
    (await resolveCallerRequestDefaults({
      ctx,
      toolName: ctx.toolName,
      input: params.input,
    })) ?? {};

  const urlSchema: z.ZodType = endpoint.requestUrlPathParamsSchema;
  let urlPathParams: Record<string, WidgetData> = ctx.urlPathParams ?? {};
  let requestData: Record<string, WidgetData> = input;
  if (ctx.urlPathParams === undefined) {
    const parsed = urlSchema.safeParse(input);
    const urlKeys = new Set(
      parsed.success &&
        typeof parsed.data === "object" &&
        parsed.data !== null &&
        !Array.isArray(parsed.data)
        ? Object.keys(parsed.data)
        : [],
    );
    urlPathParams = Object.fromEntries(
      Object.entries(input).filter(([key]) => urlKeys.has(key)),
    );
    requestData = Object.fromEntries(
      Object.entries(input).filter(([key]) => !urlKeys.has(key)),
    );
  }

  const requestSchema: z.ZodType = generateRoleFilteredRequestSchema(
    endpoint.fields,
    filterUserPermissionRoles(ctx.user.roles),
    ctx.platform,
  );
  const result = validateHandlerRequestData(
    { requestSchema, requestUrlPathParamsSchema: urlSchema },
    {
      method: endpoint.method,
      requestData,
      urlParameters: urlPathParams,
      locale: ctx.locale,
      endpointPath: `${endpoint.path.join("/")}/${endpoint.method}`,
    },
    ctx.logger,
    ctx.platform,
    endpoint,
  );
  return result.success ? null : result;
}
