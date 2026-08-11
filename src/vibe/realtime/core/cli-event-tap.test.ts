// oxlint-disable restricted/no-unknown, oxlint-plugin-restricted/no-throw
/**
 * startCliEventTap — unit tests for in-process CLI event delivery.
 *
 * TAP-DELIVER-*  : an emit from the same endpoint reaches the subscriber.
 * TAP-MERGE-*    : successive partials accumulate via the cache-merger, so a
 *                  later event never discards an earlier one's fields.
 * TAP-FILTER-*   : events from a DIFFERENT endpoint are ignored (nested calls).
 * TAP-PRESENCE-* : observing never registers a broadcast target...
 * TAP-RESTORE-*  : ...and never disturbs one that already exists.
 *
 * The last two are the load-bearing ones. The tap observes; it does not become
 * the transport. That is what lets realtime work with NO ws server at all, while
 * a running ws server keeps delivering to browsers during a CLI command.
 */

import "server-only";

import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultLocale } from "../../core/i18n/core/config";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { createEndpointLogger } from "../../logger/server";

import vibeCheckEndpoints from "@/vibe/tooling/check/definition";

import { startCliEventTap } from "./cli-event-tap";
import { createEndpointEmitter } from "./emitter";
import {
  clearLocalBroadcast,
  getLocalBroadcast,
  type LocalBroadcastTarget,
  registerLocalBroadcast,
} from "./local-broadcast";

const USER_ID = "11111111-1111-1111-1111-111111111111";
const user: JwtPrivatePayloadType = {
  id: USER_ID,
  leadId: USER_ID,
  isPublic: false,
  roles: [],
};

function makeLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, defaultLocale);
}

afterEach(() => {
  clearLocalBroadcast();
});

describe("startCliEventTap", () => {
  it("TAP-DELIVER-1: an emit on the tapped endpoint reaches the subscriber", () => {
    const logger = makeLogger();
    const tap = startCliEventTap({
      endpoint: vibeCheckEndpoints.POST,
      logger,
    });
    const seen: WidgetData[] = [];
    tap.onUpdate((data) => seen.push(data));

    const emit = createEndpointEmitter(vibeCheckEndpoints.POST, logger, user);
    emit("check-progress", {
      responseData: {
        totalIssues: 0,
        totalFiles: 0,
        phases: [{ id: "oxlint", tool: "Oxlint", status: "running" }],
        isComplete: false,
      },
    });

    expect(seen).toHaveLength(1);
    expect(tap.current()).toMatchObject({ isComplete: false });
    tap.stop();
  });

  it("TAP-MERGE-1: successive partials accumulate instead of replacing", () => {
    const logger = makeLogger();
    const tap = startCliEventTap({
      endpoint: vibeCheckEndpoints.POST,
      logger,
    });
    const emit = createEndpointEmitter(vibeCheckEndpoints.POST, logger, user);

    emit("check-progress", {
      responseData: {
        totalIssues: 0,
        totalFiles: 0,
        phases: [
          { id: "oxlint", tool: "Oxlint", status: "running" },
          { id: "eslint", tool: "ESLint", status: "running" },
        ],
        isComplete: false,
      },
    });
    // Second event carries only the oxlint row — eslint must survive, which is
    // what makes id-keyed phase merging (not array replacement) the right model.
    emit("check-progress", {
      responseData: {
        totalIssues: 7,
        totalFiles: 1,
        phases: [{ id: "oxlint", tool: "Oxlint", status: "done", issues: 7 }],
      },
    });

    const merged = tap.current();
    expect(merged).toMatchObject({
      totalIssues: 7,
      // The first event's isComplete survives an event that never mentions it.
      isComplete: false,
      phases: [
        { id: "oxlint", status: "done", issues: 7 },
        // Untouched by the second event — proves id-keyed merge, not replace.
        { id: "eslint", status: "running" },
      ],
    });
    tap.stop();
  });

  it("TAP-FILTER-1: events from another endpoint are ignored", async () => {
    const logger = makeLogger();
    const tap = startCliEventTap({
      endpoint: vibeCheckEndpoints.POST,
      logger,
    });
    const seen: WidgetData[] = [];
    tap.onUpdate((data) => seen.push(data));

    const creditsDefinition = (await import("@/credits/definition")).default;
    const emitCredits = createEndpointEmitter(
      creditsDefinition.GET,
      logger,
      user,
    );
    emitCredits("credits-balance-updated", {
      responseData: {
        total: 5,
        expiring: 0,
        permanent: 5,
        earned: 0,
        free: 0,
        expiresAt: null,
        capacity: 100,
      },
    });

    expect(seen).toHaveLength(0);
    tap.stop();
  });

  it("TAP-PRESENCE-1: observing does not register a broadcast target", () => {
    // The tap must NOT become the transport: if it did, a WS proxy running in
    // another process would stop receiving events for the duration of a CLI
    // command, silently breaking every browser subscriber.
    clearLocalBroadcast();
    const tap = startCliEventTap({
      endpoint: vibeCheckEndpoints.POST,
      logger: makeLogger(),
    });
    expect(getLocalBroadcast()).toBeNull();
    tap.stop();
  });

  it("TAP-RESTORE-1: an existing broadcast target is untouched", () => {
    const previous: LocalBroadcastTarget = {
      broadcastToAll: vi.fn(),
      broadcastBatch: vi.fn(),
      getChannelSize: (): number => 3,
      closeConnectorSocket: vi.fn(),
    };
    registerLocalBroadcast(previous);

    const tap = startCliEventTap({
      endpoint: vibeCheckEndpoints.POST,
      logger: makeLogger(),
    });
    expect(getLocalBroadcast()).toBe(previous);
    tap.stop();
    expect(getLocalBroadcast()).toBe(previous);
  });

  it("TAP-DELIVER-2: a chained target still receives events", () => {
    const chained = vi.fn();
    const previous: LocalBroadcastTarget = {
      broadcastToAll: chained,
      broadcastBatch: vi.fn(),
      getChannelSize: (): number => 1,
      closeConnectorSocket: vi.fn(),
    };
    registerLocalBroadcast(previous);

    const logger = makeLogger();
    const tap = startCliEventTap({
      endpoint: vibeCheckEndpoints.POST,
      logger,
    });
    const emit = createEndpointEmitter(vibeCheckEndpoints.POST, logger, user);
    emit("check-progress", {
      responseData: { totalIssues: 0, totalFiles: 0, isComplete: true },
    });

    // The real proxy still receives delivery while we observe — observing and
    // delivering are independent paths.
    expect(chained).toHaveBeenCalledTimes(1);
    expect(tap.current()).toMatchObject({ isComplete: true });
    tap.stop();
  });
});
