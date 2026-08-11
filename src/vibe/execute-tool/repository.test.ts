// oxlint-disable restricted/no-unknown
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
import { defaultLocale } from "../core/i18n/core/config";
import type { JwtPrivatePayloadType } from "../identity/auth/types";
import { createEndpointLogger } from "../logger/server";
import {
  clearLocalBroadcast,
  registerLocalBroadcast,
} from "../realtime/core/local-broadcast";
import * as resolveTaskUser from "../tasks/cron/resolve-task-user";

import { RouteExecuteRepository } from "./repository";
import { handleIncomingToolRequest } from "./repository/incoming";
import { PendingCalls } from "./repository/pending-calls";
import { handleToolResult } from "./repository/result-handler";

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, defaultLocale);
}

type IncomingProps = Parameters<typeof handleIncomingToolRequest>[0];
type ResultProps = Parameters<typeof handleToolResult>[0];

function makeIncomingProps(
  overrides: Pick<IncomingProps, "requestData" | "payload"> & {
    logger?: ReturnType<typeof createEndpointLogger>;
  },
): IncomingProps {
  return {
    instanceId: "atlas",
    originInstanceId: "test-origin",
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
    originInstanceId: "test-origin",
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
    const broadcastToAll = vi.fn();
    registerLocalBroadcast({
      broadcastToAll,
      broadcastBatch: vi.fn(),
      getChannelSize: vi.fn(() => 1),
      closeConnectorSocket: vi.fn(),
    });

    await handleIncomingToolRequest(
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

    clearLocalBroadcast();
    expect(executeSpy).not.toHaveBeenCalled();
    expect(broadcastToAll).not.toHaveBeenCalled();
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
    const broadcastToAll = vi.fn();
    registerLocalBroadcast({
      broadcastToAll,
      broadcastBatch: vi.fn(),
      getChannelSize: vi.fn(() => 1),
      closeConnectorSocket: vi.fn(),
    });

    await handleIncomingToolRequest(
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

    // The WAIT branch acks delivery immediately and runs the tool in the
    // background — poll until the result emit lands.
    for (let i = 0; i < 100 && broadcastToAll.mock.calls.length === 0; i++) {
      await new Promise((resolve) => {
        setTimeout(resolve, 20);
      });
    }
    clearLocalBroadcast();
    expect(executeSpy).toHaveBeenCalledTimes(1);
    const execData = executeSpy.mock.calls[0]![0] as {
      toolName: string;
      instanceId: string | undefined;
    };
    // Receiver runs the tool LOCALLY — never re-dispatch to another instance.
    expect(execData.toolName).toBe("bash");
    expect(execData.instanceId).toBeUndefined();

    // Result relayed via emitter — broadcastToAll called with user channel
    expect(broadcastToAll).toHaveBeenCalledTimes(1);
    const [channel, event, data] = broadcastToAll.mock.calls[0] as [
      string,
      string,
      { eventName: string; responseData: { taskId: string } },
    ];
    // User events ride per-endpoint channels: user/{uid}/ws-<endpoint>.
    expect(channel).toBe(`user/${USER_ID}/ws-vibe-execute-tool-POST`);
    expect(event).toBe("__event__");
    expect(data.eventName).toBe("tool-execute-result");
    expect(data.responseData.taskId).toBe("call-42");
  });

  // ── handleToolResult ─────────────────────────────────────────────────────

  it("ET-RESULT-NO-TASKID: missing taskId drops without completing any pending call", async () => {
    const completeSpy = vi
      .spyOn(PendingCalls, "complete")
      .mockReturnValue({ kind: "unknown" });

    await handleToolResult(
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
    const completeSpy = vi.spyOn(PendingCalls, "complete").mockReturnValue({
      kind: "completed",
      threadId: null,
      toolMessageId: null,
    });

    await handleToolResult(
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

  it("ET-RESULT-FAILED: hint present marks the pending call failed and surfaces the message", async () => {
    const completeSpy = vi
      .spyOn(PendingCalls, "complete")
      .mockReturnValue({ kind: "unknown" });

    await handleToolResult(
      makeResultProps({
        responseData: { taskId: "call-9", result: null, hint: "boom" },
      }),
    );
    expect(completeSpy).toHaveBeenCalledTimes(1);
    const [, result] = completeSpy.mock.calls[0]!;
    // Failure fidelity: the peer's fail() message rides `hint` and must
    // surface as output.message so the requester sees the real remote error.
    expect(result).toEqual({ status: "failed", output: { message: "boom" } });
  });
});
