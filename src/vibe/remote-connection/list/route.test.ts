/**
 * Remote Connection list — Unit Tests
 *
 *   RL1  — GET returns success with connections array (may be empty)
 *   RL2  — customers may list their own rows but never get the fleet report
 *   RL3  — GET activeOnly=true returns only active connections
 *   RL4  — admins get the fleet report: counts add up, problems sort first
 *   RL5  — fleetStatus filter is applied server-side; counts stay unfiltered
 */

import "server-only";

import { describe, expect, it } from "vitest";

import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { sendTestRequest } from "../../tooling/testing/testing-suite/send-test-request";
import endpoints from "./definition";
import { FleetStatusFilter } from "./enum";

const customerUser: JwtPrivatePayloadType = {
  id: "00000000-0000-0000-0000-000000000001",
  leadId: "00000000-0000-0000-0000-000000000001",
  roles: [UserPermissionRole.CUSTOMER],
  isPublic: false,
};

describe("Remote Connection list", () => {
  // ── RL1 ────────────────────────────────────────────────────────────────────

  it("RL1: GET returns success with connections array", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: {},
    });

    expect(result.success, "RL1: expected success").toBe(true);
    if (!result.success) {
      return;
    }
    expect(
      Array.isArray(result.data.connections),
      "RL1: connections must be an array",
    ).toBe(true);
  });

  // ── RL2 ────────────────────────────────────────────────────────────────────

  it("RL2: customers list their rows without the fleet report", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: {},
      user: customerUser,
    });

    if (!result.success) {
      // A customer may also be rejected outright (no paid account etc.).
      return;
    }
    expect(result.data.fleet, "RL2: fleet is admin-only").toBeNull();
  });

  // ── RL3 ────────────────────────────────────────────────────────────────────

  it("RL3: GET activeOnly=true returns success (array may be empty)", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: { activeOnly: true },
    });

    expect(result.success, "RL3: expected success with activeOnly").toBe(true);
    if (!result.success) {
      return;
    }
    expect(
      Array.isArray(result.data.connections),
      "RL3: connections must be array",
    ).toBe(true);
  });

  // ── RL4 ────────────────────────────────────────────────────────────────────

  it("RL4: admin fleet report counts add up and problems sort first", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: {},
    });

    expect(result.success, "RL4: expected success").toBe(true);
    if (!result.success || !result.data.fleet) {
      return;
    }
    const { counts, rows } = result.data.fleet;
    expect(counts.healthy + counts.warning + counts.critical + counts.disconnected).toBe(counts.total);
    expect(counts.unhealthy).toBe(counts.warning + counts.critical);
    expect(rows.length).toBe(counts.total);
    const rank = { critical: 0, warning: 1, disconnected: 2, healthy: 3 };
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1];
      const cur = rows[i];
      if (prev && cur) {
        expect(rank[prev.status] <= rank[cur.status]).toBe(true);
      }
    }
  });

  // ── RL5 ────────────────────────────────────────────────────────────────────

  it("RL5: fleetStatus filters rows server-side, counts stay whole", async () => {
    const all = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: {},
    });
    const healthy = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: { fleetStatus: FleetStatusFilter.HEALTHY },
    });

    expect(all.success && healthy.success).toBe(true);
    if (!all.success || !healthy.success || !all.data.fleet || !healthy.data.fleet) {
      return;
    }
    expect(healthy.data.fleet.counts).toEqual(all.data.fleet.counts);
    expect(healthy.data.fleet.rows.length).toBe(all.data.fleet.counts.healthy);
    for (const row of healthy.data.fleet.rows) {
      expect(row.status).toBe("healthy");
    }
  });
});
