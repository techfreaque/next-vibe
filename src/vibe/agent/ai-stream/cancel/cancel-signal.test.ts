/**
 * Cancel delivery + incognito fallback reap.
 *
 * Regression for prod (e_SA9N, 2026-11-25): an incognito cancel only fired the
 * hub signal and answered "cancelled". No confirmation the stream stopped, no
 * reap, so when the signal missed the stream the stop button spun until the
 * client's 15s safety timeout (and a tool call possibly ran 31s after cancel).
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterEach, describe, expect, it } from "vitest";

import {
  AbortReason,
  isStreamAbort,
} from "../repository/core/constants";
import {
  type LocalStreamRun,
  LocalStreamRuns,
} from "../repository/core/local-stream-runs";
import {
  cancelIncognitoStream,
  decideIncognitoReap,
  deliverStreamCancel,
} from "./cancel-signal";

const logger = createEndpointLogger(false, defaultLocale);
const LEAD_ID = "00000000-0000-4000-8000-0000000000c1";
const publicUser: JwtPayloadType = {
  isPublic: true,
  leadId: LEAD_ID,
  roles: [UserPermissionRole.PUBLIC],
};

const cleanups: Array<() => void> = [];
afterEach(() => {
  while (cleanups.length > 0) {
    cleanups.pop()?.();
  }
});

function registerRun(threadId: string): {
  controller: AbortController;
  deregister: () => void;
} {
  const controller = new AbortController();
  const deregister = LocalStreamRuns.register({
    threadId,
    runId: `run-${threadId}`,
    ownerKey: LEAD_ID,
    controller,
  });
  cleanups.push(deregister);
  return { controller, deregister };
}

function noopDeliver(): void {
  // The hub signal is out of scope here: the local path must work without it.
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("deliverStreamCancel", () => {
  it("signals the hub AND aborts a local run directly", () => {
    const threadId = crypto.randomUUID();
    const { controller } = registerRun(threadId);
    const delivered: string[] = [];

    const result = deliverStreamCancel(threadId, publicUser, logger, (id) => {
      delivered.push(id);
    });

    expect(delivered).toEqual([threadId]);
    expect(result.abortedNow).toBe(true);
    expect(controller.signal.aborted).toBe(true);
    const reason: Error = controller.signal.reason;
    expect(isStreamAbort(reason)).toBe(true);
    expect(isStreamAbort(reason) ? reason.reason : null).toBe(
      AbortReason.USER_CANCELLED,
    );
  });

  it("is idempotent and leaves other threads alone", () => {
    const threadId = crypto.randomUUID();
    const other = registerRun(crypto.randomUUID());
    registerRun(threadId);

    expect(
      deliverStreamCancel(threadId, publicUser, logger, noopDeliver).abortedNow,
    ).toBe(true);
    const second = deliverStreamCancel(
      threadId,
      publicUser,
      logger,
      noopDeliver,
    );
    expect(second.run).not.toBeNull();
    expect(second.abortedNow).toBe(false);
    expect(other.controller.signal.aborted).toBe(false);
  });

  it("returns no run when this process does not own the stream", () => {
    const result = deliverStreamCancel(
      crypto.randomUUID(),
      publicUser,
      logger,
      noopDeliver,
    );
    expect(result.run).toBeNull();
    expect(result.abortedNow).toBe(false);
  });
});

describe("LocalStreamRuns.register", () => {
  it("a stale deregister never evicts a newer run on the same thread", () => {
    const threadId = crypto.randomUUID();
    const first = registerRun(threadId);
    const second = registerRun(threadId);
    first.deregister();
    expect(LocalStreamRuns.get(threadId)?.controller).toBe(second.controller);
    second.deregister();
    expect(LocalStreamRuns.get(threadId)).toBeNull();
  });
});

describe("decideIncognitoReap", () => {
  const makeRun = (registeredAt: number, aborted: boolean): LocalStreamRun => {
    const controller = new AbortController();
    if (aborted) {
      controller.abort();
    }
    return {
      threadId: "t",
      runId: "r",
      ownerKey: LEAD_ID,
      registeredAt,
      controller,
    };
  };

  it("finalized: the cancelled run deregistered", () => {
    const run = makeRun(1, true);
    expect(
      decideIncognitoReap({ cancelled: run, current: null, cancelledAt: 2 }),
    ).toBe("finalized");
  });

  it("finalized: the cancelled run is gone and a newer one is live", () => {
    expect(
      decideIncognitoReap({
        cancelled: makeRun(1, true),
        current: makeRun(5, false),
        cancelledAt: 2,
      }),
    ).toBe("finalized");
  });

  it("stuck-local: the cancelled run is still registered", () => {
    const run = makeRun(1, true);
    expect(
      decideIncognitoReap({ cancelled: run, current: run, cancelledAt: 2 }),
    ).toBe("stuck-local");
  });

  it("newer-stream: no run at cancel time, a live run started after", () => {
    expect(
      decideIncognitoReap({
        cancelled: null,
        current: makeRun(5, false),
        cancelledAt: 2,
      }),
    ).toBe("newer-stream");
  });

  it("stuck-local: a run registered after the cancel but already aborted", () => {
    expect(
      decideIncognitoReap({
        cancelled: null,
        current: makeRun(5, true),
        cancelledAt: 2,
      }),
    ).toBe("stuck-local");
  });

  it("no-local-run: nothing registered here", () => {
    expect(
      decideIncognitoReap({ cancelled: null, current: null, cancelledAt: 2 }),
    ).toBe("no-local-run");
  });
});

describe("cancelIncognitoStream", () => {
  it("does not emit when the aborted run finalizes in time", async () => {
    const threadId = crypto.randomUUID();
    const { controller, deregister } = registerRun(threadId);
    // The run's own finalizer: abort -> finalize (emits itself) -> deregister.
    controller.signal.addEventListener("abort", () => {
      setTimeout(deregister, 5);
    });
    let emitted = 0;

    const result = cancelIncognitoStream({
      threadId,
      user: publicUser,
      logger,
      emitFinished: () => {
        emitted += 1;
      },
      deliver: noopDeliver,
      reapDelayMs: 40,
    });

    expect(result.abortedNow).toBe(true);
    await sleep(80);
    expect(emitted).toBe(0);
  });

  it("emits stream-finished when the cancelled run never finalizes", async () => {
    const threadId = crypto.randomUUID();
    registerRun(threadId);
    let emitted = 0;

    cancelIncognitoStream({
      threadId,
      user: publicUser,
      logger,
      emitFinished: () => {
        emitted += 1;
      },
      deliver: noopDeliver,
      reapDelayMs: 20,
    });

    expect(emitted).toBe(0);
    await sleep(60);
    expect(emitted).toBe(1);
  });

  it("emits the fallback when no local run owns the thread", async () => {
    let emitted = 0;
    cancelIncognitoStream({
      threadId: crypto.randomUUID(),
      user: publicUser,
      logger,
      emitFinished: () => {
        emitted += 1;
      },
      deliver: noopDeliver,
      reapDelayMs: 20,
    });
    await sleep(60);
    expect(emitted).toBe(1);
  });

  it("does not unlock a newer stream started after the cancel", async () => {
    const threadId = crypto.randomUUID();
    let emitted = 0;
    cancelIncognitoStream({
      threadId,
      user: publicUser,
      logger,
      emitFinished: () => {
        emitted += 1;
      },
      deliver: noopDeliver,
      reapDelayMs: 30,
    });
    await sleep(5);
    registerRun(threadId);
    await sleep(60);
    expect(emitted).toBe(0);
  });
});
