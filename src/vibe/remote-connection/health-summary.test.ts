import { describe, expect, it } from "bun:test";

import { assessConnectionHealth, type HealthInputRow } from "./health-summary";
import { STALE_SYNC_MS } from "./health-types";

const now = Date.parse("2026-11-22T13:00:00Z");
const peer: HealthInputRow = {
  isActive: true,
  isReverseEntry: true,
  hasToken: true,
  lastSyncedAt: null,
  transportMode: "reverse-ws",
  lastTransportUsed: "reverse-ws",
  sentCapabilitiesVersion: null,
  lastContactAt: new Date(now),
};

describe("remote connection sync age", () => {
  it("keeps a recent successful sync healthy", () => {
    expect(
      assessConnectionHealth(
        {
          ...peer,
          lastSyncedAt: new Date(now - STALE_SYNC_MS + 1),
        },
        "current",
        false,
        now,
      ),
    ).toEqual({ status: "healthy", issues: [] });
  });

  it("warns at the age threshold even when the peer contacted us recently", () => {
    expect(
      assessConnectionHealth(
        {
          ...peer,
          lastSyncedAt: new Date(now - STALE_SYNC_MS),
        },
        "current",
        false,
        now,
      ),
    ).toEqual({ status: "warning", issues: ["staleSync"] });
  });

  it("keeps first-sync and disconnected states distinct", () => {
    expect(assessConnectionHealth(peer, "current", false, now)).toEqual({
      status: "warning",
      issues: ["neverSynced"],
    });
    expect(
      assessConnectionHealth(
        { ...peer, isActive: false },
        "current",
        false,
        now,
      ),
    ).toEqual({
      status: "disconnected",
      issues: ["inactive"],
    });
  });

  it("keeps stale peers with missing credentials critical", () => {
    expect(
      assessConnectionHealth(
        {
          ...peer,
          hasToken: false,
          lastSyncedAt: new Date(now - STALE_SYNC_MS),
        },
        "current",
        false,
        now,
      ),
    ).toEqual({ status: "critical", issues: ["noToken", "staleSync"] });
  });
});
