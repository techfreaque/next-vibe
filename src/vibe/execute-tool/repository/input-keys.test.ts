/**
 * Unknown argument names never vanish silently.
 *
 * IK-1..3: auditInputKeys / isEveryKeyUnknown (pure)
 * IK-4..6: executeGenericHandler names dropped keys (prod 2026-11-26:
 *          credits/admin-add received an empty body)
 */

import "server-only";

import { describe, expect, it } from "bun:test";
import { makeHeadlessContext } from "next-vibe/core/execution-context";
import { z } from "zod";

import { defaultLocale } from "../../core/i18n/core/config";
import type { GenericHandlerBase } from "../../core/route/handler";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { createEndpointLogger } from "../../logger/server";
import { scopedTranslation as aiTranslation } from "../../platforms/ai/i18n";
import { Platform } from "../../platforms/platforms";
import { RouteExecutionExecutor } from "./core";
import { auditInputKeys, isEveryKeyUnknown } from "./input-keys";

const logger = createEndpointLogger(false, defaultLocale);

const admin: JwtPrivatePayloadType = {
  id: "11111111-1111-4111-8111-111111111111",
  leadId: "22222222-2222-4222-8222-222222222222",
  isPublic: false,
  roles: [UserPermissionRole.ADMIN],
};

const definition = {
  requestSchema: z.object({ targetUserId: z.string(), amount: z.number() }),
  requestUrlPathParamsSchema: z.object({ id: z.string() }),
};

describe("auditInputKeys", () => {
  it("IK-1: declared keys pass", () => {
    expect(
      auditInputKeys({
        definition,
        data: { targetUserId: "u", amount: 1 },
        urlPathParams: { id: "x" },
      }),
    ).toBeNull();
  });

  it("IK-2: misnamed keys are named next to the expected ones", () => {
    const audit = auditInputKeys({
      definition,
      data: { email: "secret@example.com", credits: 5 },
      urlPathParams: {},
    });
    expect(audit).toEqual({
      unknownKeys: ["credits", "email"],
      expectedKeys: ["amount", "id", "targetUserId"],
      knownKeyCount: 0,
    });
    expect(audit && isEveryKeyUnknown(audit)).toBe(true);
  });

  it("IK-3: a no-argument endpoint is never 'every key unknown'", () => {
    const audit = auditInputKeys({
      definition: {
        requestSchema: z.object({}),
        requestUrlPathParamsSchema: z.object({}),
      },
      data: { random_string: "x" },
      urlPathParams: {},
    });
    expect(audit?.unknownKeys).toEqual(["random_string"]);
    expect(audit && isEveryKeyUnknown(audit)).toBe(false);
  });
});

describe("executeGenericHandler unknown keys", () => {
  const run = (params: {
    data: Record<string, string | number>;
    platform: Platform;
    handler: GenericHandlerBase;
  }): ReturnType<typeof RouteExecutionExecutor.executeGenericHandler> =>
    RouteExecutionExecutor.executeGenericHandler({
      toolName: "grant-credits",
      data: params.data,
      urlPathParams: {},
      user: admin,
      locale: defaultLocale,
      logger,
      platform: params.platform,
      toolExecutionContext: makeHeadlessContext(undefined, undefined, "UTC"),
      preloadedHandler: params.handler,
    });

  it("IK-4: no argument reaches the target -> fail before running it", async () => {
    let runs = 0;
    const result = await run({
      data: { email: "secret@example.com", credits: 5 },
      platform: Platform.NEXT_API,
      handler: async () => {
        runs += 1;
        return success({});
      },
    });
    expect(runs).toBe(0);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorType.errorKey).toBe(
        ErrorResponseTypes.VALIDATION_ERROR.errorKey,
      );
      expect(result.message).toContain("credits, email");
      expect(result.message).toContain("targetUserId");
      expect(result.message).not.toContain("secret@example.com");
    }
  });

  it("IK-5: stored cron inputs still run", async () => {
    let runs = 0;
    await run({
      data: { email: "x@example.com" },
      platform: Platform.CRON,
      handler: async () => {
        runs += 1;
        return success({});
      },
    });
    expect(runs).toBe(1);
  });

  it("IK-6: a validation failure names the dropped keys", async () => {
    const { t } = aiTranslation.scopedT(defaultLocale);
    const targetMessage = t("executeTool.post.errors.validation.description");
    const result = await run({
      data: { targetUserId: "u", credits: 5 },
      platform: Platform.CLI,
      handler: async () =>
        fail({
          message: targetMessage,
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        }),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain("credits");
      expect(result.cause?.message).toBe(targetMessage);
    }
  });
});
