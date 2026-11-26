import { describe, expect, it } from "bun:test";
import { z } from "zod";

import { dateSchema } from "../../../core/definition/common.schema";
import taskExecute from "../../../tasks/execute/definition";
import { reviveRemoteResultDates } from "./result";

const timestamp = "2024-01-15T10:00:00.000Z";

describe("reviveRemoteResultDates", () => {
  it("restores the execute-task timestamp from JSON before formatting", () => {
    const wire = {
      success: true,
      taskId: "db-health",
      taskName: "Database Health Check",
      executedAt: timestamp,
      duration: 150,
      status: "status.completed",
    };

    expect(
      reviveRemoteResultDates(wire, taskExecute.POST.responseSchema),
    ).toEqual({
      ...wire,
      executedAt: new Date(timestamp),
    });
  });

  it("restores nested dates and preserves text and fields from the peer", () => {
    const schema = z.array(
      z.object({ executedAt: dateSchema, note: z.string() }),
    );
    const wire = [{ executedAt: timestamp, note: timestamp, newerField: true }];

    expect(reviveRemoteResultDates(wire, schema)).toEqual([
      { executedAt: new Date(timestamp), note: timestamp, newerField: true },
    ]);
  });

  it("preserves results from unknown tools or an incompatible peer", () => {
    const wire = { executedAt: timestamp };
    const schema = z.object({ executedAt: dateSchema, name: z.string() });

    expect(reviveRemoteResultDates(wire, undefined)).toBe(wire);
    expect(reviveRemoteResultDates(wire, schema)).toBe(wire);
  });
});
