// oxlint-disable oxlint-plugin-restricted/restricted-syntax
/**
 * Remote Event Bridge Repository — unit tests
 *
 * REB-REPO-RECEIVE-* : receive() HTTP entry — eventName routing + received:true
 * REB-REPO-HANDLE-*  : handleRemoteEvent() — guards, echo-drop, dispatch
 *
 * dispatchRemoteEvent and RemoteConnectionRepository.getLocalInstanceId are
 * stubbed via vi.mock so the tests assert routing behaviour without a live DB
 * or a registered target route.
 */

import "server-only";

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { createEndpointLogger } from "@/app/api/[locale]/system/logger/server";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import type { AnyEndpointEventEnvelope } from "../structured-events";
import type { RemoteEventBridgeRepository as RemoteEventBridgeRepositoryType } from "./repository";

// ── Mocks ───────────────────────────────────────────────────────────────────

const dispatchRemoteEvent = vi.fn(async (): Promise<void> => undefined);
const getLocalInstanceId = vi.fn(async (): Promise<string> => "self-instance");

vi.mock(
  "@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/registry",
  () => ({
    dispatchRemoteEvent: (...args: unknown[]): Promise<void> =>
      dispatchRemoteEvent(...(args as [])),
    registerRemoteEventHandlers: (): void => undefined,
  }),
);

vi.mock("@/app/api/[locale]/remote-connection/repository", () => ({
  RemoteConnectionRepository: {
    getLocalInstanceId: (...args: unknown[]): Promise<string> =>
      getLocalInstanceId(...(args as [])),
  },
}));

// Import AFTER the mocks so the repository binds to the stubbed modules.
let RemoteEventBridgeRepository: typeof RemoteEventBridgeRepositoryType;

beforeAll(async (): Promise<void> => {
  ({ RemoteEventBridgeRepository } = await import("./repository"));
});

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, defaultLocale);
}

const USER_ID = "11111111-1111-1111-1111-111111111111";

const user: JwtPrivatePayloadType = {
  id: USER_ID,
  leadId: USER_ID,
  isPublic: false,
  roles: [],
};

function makeEnvelope(
  overrides?: Partial<AnyEndpointEventEnvelope>,
): AnyEndpointEventEnvelope {
  return {
    endpointPath: ["agent", "chat", "threads", "[threadId]", "messages"],
    endpointMethod: "GET",
    eventName: "content-done",
    responseData: { messages: [] },
    requestData: {},
    urlPathParams: { threadId: "t1" },
    payload: undefined,
    ...overrides,
  };
}

describe("RemoteEventBridgeRepository", () => {
  beforeEach(() => {
    dispatchRemoteEvent.mockClear();
    getLocalInstanceId.mockClear();
  });

  // ── receive() ───────────────────────────────────────────────────────────

  it("REB-REPO-RECEIVE-EVENT: known eventName dispatches and returns received:true", async () => {
    const result = await RemoteEventBridgeRepository.receive(
      {
        eventName: "remote-event",
        leadId: USER_ID,
        payload: {
          originInstanceId: "hermes",
          syncDomain: "cache",
          envelope: makeEnvelope(),
        },
      },
      user,
      makeLogger(),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.received).toBe(true);
    }
    expect(dispatchRemoteEvent).toHaveBeenCalledTimes(1);
  });

  it("REB-REPO-RECEIVE-UNKNOWN: unknown eventName ignored, still received:true, no dispatch", async () => {
    const result = await RemoteEventBridgeRepository.receive(
      {
        eventName: "totally-unknown-event",
        leadId: USER_ID,
        payload: {},
      },
      user,
      makeLogger(),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.received).toBe(true);
    }
    expect(dispatchRemoteEvent).not.toHaveBeenCalled();
  });

  // ── handleRemoteEvent() ──────────────────────────────────────────────────

  it("REB-REPO-HANDLE-MISSING-FIELDS: empty envelope returns early, no dispatch", async () => {
    await RemoteEventBridgeRepository.handleRemoteEvent(
      {},
      USER_ID,
      makeLogger(),
    );
    expect(dispatchRemoteEvent).not.toHaveBeenCalled();
  });

  it("REB-REPO-HANDLE-MISSING-ORIGIN: envelope without originInstanceId is dropped", async () => {
    await RemoteEventBridgeRepository.handleRemoteEvent(
      { envelope: makeEnvelope() },
      USER_ID,
      makeLogger(),
    );
    expect(dispatchRemoteEvent).not.toHaveBeenCalled();
  });

  it("REB-REPO-HANDLE-NO-USER: null userId skips dispatch", async () => {
    await RemoteEventBridgeRepository.handleRemoteEvent(
      { originInstanceId: "hermes", envelope: makeEnvelope() },
      null,
      makeLogger(),
    );
    expect(dispatchRemoteEvent).not.toHaveBeenCalled();
  });

  it("REB-REPO-HANDLE-ECHO-DROP: self-origin event is dropped (echo guard)", async () => {
    getLocalInstanceId.mockResolvedValueOnce("self-instance");
    await RemoteEventBridgeRepository.handleRemoteEvent(
      { originInstanceId: "self-instance", envelope: makeEnvelope() },
      USER_ID,
      makeLogger(),
    );
    expect(getLocalInstanceId).toHaveBeenCalledWith(USER_ID);
    expect(dispatchRemoteEvent).not.toHaveBeenCalled();
  });

  it("REB-REPO-HANDLE-DISPATCH: foreign-origin valid envelope dispatches to target route", async () => {
    getLocalInstanceId.mockResolvedValueOnce("self-instance");
    const envelope = makeEnvelope();
    await RemoteEventBridgeRepository.handleRemoteEvent(
      { originInstanceId: "hermes", syncDomain: "threads", envelope },
      USER_ID,
      makeLogger(),
    );
    expect(dispatchRemoteEvent).toHaveBeenCalledTimes(1);
    const callArgs = dispatchRemoteEvent.mock.calls[0] as unknown[];
    expect(callArgs[0]).toEqual(envelope.endpointPath);
    expect(callArgs[1]).toBe(envelope.endpointMethod);
    expect(callArgs[2]).toBe(envelope);
  });
});
