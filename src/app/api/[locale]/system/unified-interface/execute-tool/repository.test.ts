// oxlint-disable oxlint-plugin-restricted/restricted-syntax
/**
 * Route Execute Repository — remote wire-handler unit tests
 *
 * ET-INCOMING-* : handleIncomingToolRequest — user resolution, execute() call,
 *                 result relayed back to requester via remote-event relay
 * ET-RESULT-*   : handleToolResult — missing-taskId drop, completePendingCall
 *
 * Dependencies are spied (not module-mocked) so the rest of each module's
 * exports stay intact — the bun test runner replaces whole modules on vi.mock,
 * which would break unrelated consumers of cron/db and pending-calls.
 */

import "server-only";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createEndpointLogger } from "@/app/api/[locale]/system/logger/server";
import * as pendingCalls from "@/app/api/[locale]/system/unified-interface/execute-tool/pending-calls";
import * as resolveTaskUser from "@/app/api/[locale]/system/unified-interface/tasks/cron/resolve-task-user";
import * as wsEmitter from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import { RouteExecuteRepository } from "./repository";

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, defaultLocale);
}

type IncomingProps = Parameters<
  typeof RouteExecuteRepository.handleIncomingToolRequest
>[0];
type ResultProps = Parameters<
  typeof RouteExecuteRepository.handleToolResult
>[0];

function makeIncomingProps(
  overrides: Pick<IncomingProps, "requestData" | "payload"> & {
    logger?: ReturnType<typeof createEndpointLogger>;
  },
): IncomingProps {
  return {
    instanceId: "atlas",
    user: ownerUser,
    locale: defaultLocale,
    isServer: true,
    logger: overrides.logger ?? makeLogger(),
    requestData: overrides.requestData,
    payload: overrides.payload,
    responseData: {},
    urlPathParams: undefined,
  };
}

function makeResultProps(
  overrides: Pick<ResultProps, "responseData"> & {
    logger?: ReturnType<typeof createEndpointLogger>;
  },
): ResultProps {
  return {
    instanceId: "atlas",
    user: ownerUser,
    locale: defaultLocale,
    isServer: true,
    logger: overrides.logger ?? makeLogger(),
    responseData: overrides.responseData,
    requestData: {},
    urlPathParams: undefined,
    payload: undefined,
  };
}

const USER_ID = "22222222-2222-2222-2222-222222222222";

const ownerUser: JwtPrivatePayloadType = {
  id: USER_ID,
  leadId: USER_ID,
  isPublic: false,
  roles: [],
};

describe("RouteExecuteRepository remote handlers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── handleIncomingToolRequest ────────────────────────────────────────────

  it("ET-INCOMING-NO-USER: unresolved owner drops the request, no execute, no emit", async () => {
    vi.spyOn(resolveTaskUser, "resolveTaskOwnerUser").mockResolvedValue(null);
    const executeSpy = vi.spyOn(RouteExecuteRepository, "execute");
    const publishWsSpy = vi
      .spyOn(wsEmitter, "publishWsEvent")
      .mockImplementation(() => undefined);

    await RouteExecuteRepository.handleIncomingToolRequest(
      makeIncomingProps({
        requestData: {
          toolName: "bash",
          input: { command: "echo hi" },
          instanceId: undefined,
          callbackMode: "wait",
        },
        payload: { callId: "call-1", userId: USER_ID, locale: defaultLocale },
      }),
    );

    expect(executeSpy).not.toHaveBeenCalled();
    expect(publishWsSpy).not.toHaveBeenCalled();
  });

  it("ET-INCOMING-EXECUTE: resolved owner runs execute() locally and relays result via emitter keyed by callId", async () => {
    vi.spyOn(resolveTaskUser, "resolveTaskOwnerUser").mockResolvedValue({
      user: ownerUser,
      owner: { kind: "user", id: USER_ID },
    } as unknown as Awaited<
      ReturnType<typeof resolveTaskUser.resolveTaskOwnerUser>
    >);
    const executeSpy = vi
      .spyOn(RouteExecuteRepository, "execute")
      .mockResolvedValue({ success: true, data: { result: { ok: true } } });
    // Spy on publishWsEvent (called by createEndpointEmitter for local delivery)
    const publishWsSpy = vi
      .spyOn(wsEmitter, "publishWsEvent")
      .mockImplementation(() => undefined);

    await RouteExecuteRepository.handleIncomingToolRequest(
      makeIncomingProps({
        requestData: {
          toolName: "bash",
          input: { command: "echo hi" },
          instanceId: undefined,
          callbackMode: "wait",
        },
        payload: { callId: "call-42", userId: USER_ID, locale: defaultLocale },
      }),
    );

    expect(executeSpy).toHaveBeenCalledTimes(1);
    const execData = executeSpy.mock.calls[0]![0] as {
      toolName: string;
      instanceId: string | undefined;
    };
    // Receiver runs the tool LOCALLY — never re-dispatch to another instance.
    expect(execData.toolName).toBe("bash");
    expect(execData.instanceId).toBeUndefined();

    // Result relayed via emitter — publishWsEvent called with user channel
    expect(publishWsSpy).toHaveBeenCalledTimes(1);
    const msg = publishWsSpy.mock.calls[0]![0] as {
      channel: string;
      event: string;
      data: { eventName: string; responseData: { taskId: string } };
    };
    expect(msg.channel).toBe(`user/${USER_ID}`);
    expect(msg.event).toBe("__event__");
    expect(msg.data.eventName).toBe("tool-execute-result");
    expect(msg.data.responseData.taskId).toBe("call-42");
  });

  // ── handleToolResult ─────────────────────────────────────────────────────

  it("ET-RESULT-NO-TASKID: missing taskId drops without completing any pending call", async () => {
    const completeSpy = vi
      .spyOn(pendingCalls, "completePendingCall")
      .mockReturnValue({ kind: "unknown" });

    await RouteExecuteRepository.handleToolResult(
      makeResultProps({
        responseData: {
          taskId: undefined,
          result: { ok: true },
          hint: undefined,
        },
      }),
    );
    expect(completeSpy).not.toHaveBeenCalled();
  });

  it("ET-RESULT-COMPLETE: valid taskId completes the pending call as completed", async () => {
    const completeSpy = vi
      .spyOn(pendingCalls, "completePendingCall")
      .mockReturnValue({
        kind: "completed",
        revival: null,
        threadId: null,
        toolMessageId: null,
      });

    await RouteExecuteRepository.handleToolResult(
      makeResultProps({
        responseData: {
          taskId: "call-7",
          result: { value: 1 },
          hint: undefined,
        },
      }),
    );
    expect(completeSpy).toHaveBeenCalledTimes(1);
    const [callId, result] = completeSpy.mock.calls[0]!;
    expect(callId).toBe("call-7");
    expect(result).toEqual({ status: "completed", output: { value: 1 } });
  });

  it("ET-RESULT-FAILED: hint present marks the pending call failed", async () => {
    const completeSpy = vi
      .spyOn(pendingCalls, "completePendingCall")
      .mockReturnValue({ kind: "unknown" });

    await RouteExecuteRepository.handleToolResult(
      makeResultProps({
        responseData: { taskId: "call-9", result: null, hint: "boom" },
      }),
    );
    expect(completeSpy).toHaveBeenCalledTimes(1);
    const [, result] = completeSpy.mock.calls[0]!;
    expect(result).toEqual({ status: "failed", output: null });
  });
});
