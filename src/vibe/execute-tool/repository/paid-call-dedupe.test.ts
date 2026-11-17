/**
 * Identical paid tool calls in one thread/turn run (and bill) once.
 *
 * PCD-1..4: createPaidCallDedupe join / reuse / re-run rules
 * PCD-5..7: paidCallKey scope (thread, paid tool, normalised args)
 * PCD-8:    executeGenericHandler integration - one handler run, duplicate
 *           reported with creditCost 0
 */

import "server-only";

import { describe, expect, it } from "bun:test";
import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";

import { defaultLocale } from "../../core/i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../../core/i18n/shared";
import type { GenericHandlerBase } from "../../core/route/handler";
import { fail, success } from "../../core/route/response.schema";
import { ErrorResponseTypes } from "../../core/route/response.schema";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { createEndpointLogger } from "../../logger/server";
import { Platform } from "../../platforms/platforms";
import { RouteExecutionExecutor } from "./core";
import {
  createPaidCallDedupe,
  normalizeToolArgs,
  paidCallKey,
  withZeroCreditCost,
} from "./paid-call-dedupe";

const logger = createEndpointLogger(false, defaultLocale);

const user: JwtPrivatePayloadType = {
  id: "11111111-1111-4111-8111-111111111111",
  leadId: "22222222-2222-4222-8222-222222222222",
  isPublic: false,
  roles: [UserPermissionRole.CUSTOMER],
};

function streamContext(threadId: string, runId: string): ToolExecutionContext {
  return {
    ...makeHeadlessContext(undefined, threadId, "UTC"),
    streamRunId: runId,
  };
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe("createPaidCallDedupe", () => {
  it("PCD-1: joins a parallel identical call: one run", async () => {
    const dedupe = createPaidCallDedupe<{ n: number }>();
    let runs = 0;
    const execute = async (): Promise<{ n: number }> => {
      runs += 1;
      await sleep(20);
      return { n: runs };
    };
    const call = (): ReturnType<typeof dedupe.run> =>
      dedupe.run({
        key: "k",
        runId: "run-1",
        execute,
        isReusable: () => true,
        logger,
        toolName: "web-search",
      });
    const [a, b] = await Promise.all([call(), call()]);
    expect(runs).toBe(1);
    expect(a).toEqual({ result: { n: 1 }, duplicate: false });
    expect(b).toEqual({ result: { n: 1 }, duplicate: true });
  });

  it("PCD-2: reuses a settled success in the same run, re-runs in a new run", async () => {
    const dedupe = createPaidCallDedupe<{ n: number }>();
    let runs = 0;
    const call = (runId: string): ReturnType<typeof dedupe.run> =>
      dedupe.run({
        key: "k",
        runId,
        execute: async () => {
          runs += 1;
          return { n: runs };
        },
        isReusable: () => true,
        logger,
        toolName: "web-search",
      });
    await call("run-1");
    const again = await call("run-1");
    expect(runs).toBe(1);
    expect(again.duplicate).toBe(true);

    const nextTurn = await call("run-2");
    expect(runs).toBe(2);
    expect(nextTurn).toEqual({ result: { n: 2 }, duplicate: false });
  });

  it("PCD-3: a settled failure is not reused (a retry runs)", async () => {
    const dedupe = createPaidCallDedupe<{ ok: boolean }>();
    let runs = 0;
    const call = (): ReturnType<typeof dedupe.run> =>
      dedupe.run({
        key: "k",
        runId: "run-1",
        execute: async () => {
          runs += 1;
          return { ok: runs > 1 };
        },
        isReusable: (r) => r.ok,
        logger,
        toolName: "web-search",
      });
    expect((await call()).result.ok).toBe(false);
    const retry = await call();
    expect(runs).toBe(2);
    expect(retry).toEqual({ result: { ok: true }, duplicate: false });
  });

  it("PCD-4: no key = always runs; no run id = in-flight join only", async () => {
    const dedupe = createPaidCallDedupe<number>();
    let runs = 0;
    const execute = async (): Promise<number> => {
      runs += 1;
      return runs;
    };
    await dedupe.run({
      key: null,
      runId: "run-1",
      execute,
      isReusable: () => true,
      logger,
      toolName: "x",
    });
    await dedupe.run({
      key: null,
      runId: "run-1",
      execute,
      isReusable: () => true,
      logger,
      toolName: "x",
    });
    expect(runs).toBe(2);

    await dedupe.run({
      key: "k",
      runId: undefined,
      execute,
      isReusable: () => true,
      logger,
      toolName: "x",
    });
    await dedupe.run({
      key: "k",
      runId: undefined,
      execute,
      isReusable: () => true,
      logger,
      toolName: "x",
    });
    expect(runs).toBe(4);
  });
});

describe("paidCallKey", () => {
  const base = {
    data: { query: "NASA Artemis" },
    urlPathParams: {},
    user,
  };

  it("PCD-5: no thread = no dedupe (tool page, CLI, MCP)", async () => {
    const key = await paidCallKey({
      ...base,
      toolName: "web-search",
      toolExecutionContext: makeHeadlessContext(undefined, undefined, "UTC"),
    });
    expect(key).toBeNull();
  });

  it("PCD-6: only paid tools get a key", async () => {
    const ctx = streamContext("thread-1", "run-1");
    expect(
      await paidCallKey({ ...base, toolName: "web-search", toolExecutionContext: ctx }),
    ).not.toBeNull();
    expect(
      await paidCallKey({ ...base, toolName: "generate_image", toolExecutionContext: ctx }),
    ).not.toBeNull();
    expect(
      await paidCallKey({ ...base, toolName: "rename-thread", toolExecutionContext: ctx }),
    ).toBeNull();
  });

  it("PCD-7: normalised args; different args, thread or caller differ", async () => {
    const ctx = streamContext("thread-1", "run-1");
    const key = await paidCallKey({
      ...base,
      toolName: "web-search",
      toolExecutionContext: ctx,
    });
    expect(
      await paidCallKey({
        ...base,
        data: { query: "  NASA   Artemis ", count: null },
        toolName: "web-search",
        toolExecutionContext: ctx,
      }),
    ).toBe(key);
    expect(
      await paidCallKey({
        ...base,
        data: { query: "NASA Orion" },
        toolName: "web-search",
        toolExecutionContext: ctx,
      }),
    ).not.toBe(key);
    expect(
      await paidCallKey({
        ...base,
        toolName: "web-search",
        toolExecutionContext: streamContext("thread-2", "run-1"),
      }),
    ).not.toBe(key);
    expect(
      await paidCallKey({
        ...base,
        user: { ...user, id: "33333333-3333-4333-8333-333333333333" },
        toolName: "web-search",
        toolExecutionContext: ctx,
      }),
    ).not.toBe(key);
  });

  it("normalizeToolArgs sorts keys and drops empties", () => {
    expect(normalizeToolArgs({ b: " x ", a: [1, ""], c: undefined })).toEqual({
      a: [1, ""],
      b: "x",
    });
    expect(withZeroCreditCost({ imageUrl: "/f.png", creditCost: 2.6 })).toEqual({
      imageUrl: "/f.png",
      creditCost: 0,
    });
    expect(withZeroCreditCost({ results: [] })).toEqual({ results: [] });
  });
});

describe("executeGenericHandler", () => {
  it("PCD-8: identical parallel paid calls run the handler once", async () => {
    let runs = 0;
    const handler: GenericHandlerBase = async () => {
      runs += 1;
      await sleep(20);
      return success({ imageUrl: "/f.png", creditCost: 2.6 });
    };
    const ctx = streamContext("thread-pcd-8", "run-pcd-8");
    const call = (): ReturnType<
      typeof RouteExecutionExecutor.executeGenericHandler
    > =>
      RouteExecutionExecutor.executeGenericHandler({
        toolName: "generate_image",
        data: { prompt: "A Coca-Cola can" },
        urlPathParams: {},
        user,
        locale: defaultLocale,
        logger,
        platform: Platform.AI,
        toolExecutionContext: ctx,
        preloadedHandler: handler,
      });
    const [first, second] = await Promise.all([call(), call()]);
    expect(runs).toBe(1);
    expect(first.success && first.data).toEqual({
      imageUrl: "/f.png",
      creditCost: 2.6,
    });
    expect(second.success && second.data).toEqual({
      imageUrl: "/f.png",
      creditCost: 0,
    });
  });

  it("PCD-9: a failed paid call is retried, not reused", async () => {
    let runs = 0;
    const handler: GenericHandlerBase = async () => {
      runs += 1;
      return fail({
        message: sharedScopedTranslation
          .scopedT(defaultLocale)
          .t("errorTypes.internal_error"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    };
    const ctx = streamContext("thread-pcd-9", "run-pcd-9");
    const call = (): ReturnType<
      typeof RouteExecutionExecutor.executeGenericHandler
    > =>
      RouteExecutionExecutor.executeGenericHandler({
        toolName: "web-search",
        data: { query: "x" },
        urlPathParams: {},
        user,
        locale: defaultLocale,
        logger,
        platform: Platform.AI,
        toolExecutionContext: ctx,
        preloadedHandler: handler,
      });
    await call();
    await call();
    expect(runs).toBe(2);
  });
});
