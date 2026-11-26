import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { E2E_LOCALE, resolveE2EBaseUrl } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";
import { z } from "zod";

const days = [
  "2026-09-01T00:00:00.000Z",
  "2026-09-02T00:00:00.000Z",
  "2026-09-03T00:00:00.000Z",
];
const series = (values: number[]): { timestamp: string; value: number }[] =>
  values.map((value, index) => ({ timestamp: days[index]!, value }));
const signals = (values: boolean[]): { timestamp: string; fired: boolean }[] =>
  values.map((fired, index) => ({ timestamp: days[index]!, fired }));
const range = { from: days[0], to: days[2] };
const source = series([2, 6, 4]);
const b = series([4, 2, 1]);
const constant = series([4, 4, 4]);
const fields = [
  { timestamp: days[0], value: 40, meta: { paid: 0 } },
  { timestamp: days[1], value: 50, meta: { paid: "missing" } },
  { timestamp: days[2], value: 60, meta: { paid: 12 } },
];
const points = z.array(
  z.object({ timestamp: z.iso.datetime(), value: z.number() }),
);
const flags = z.array(
  z.object({ timestamp: z.iso.datetime(), fired: z.boolean() }),
);
const envelope = <TSchema extends z.ZodType>(data: TSchema) =>
  z.object({ success: z.literal(true), data });

describe("Analytics graph computation over HTTP", () => {
  const e2e = useE2E("analytics/series");
  e2e.it(
    "calculates aligned series, scalar metadata and threshold signals with an authorized session",
    async ({ loginAs,cleanup,uniqueEmail }) => {
      const email = uniqueEmail("series-operator");
      cleanup(async () => {
        const [owner] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email));
        if (owner) await deleteTestUser(owner.id);
      });
      const user = await createTestUser(email);
      expect(user.success).toBe(true);
      if (!user.success) return;
      await db
        .insert(userRoles)
        .values({ userId: user.data.user.id, role: UserRole.ADMIN })
        .onConflictDoNothing();
      const identity={...user.data.user,roles:[UserRole.ADMIN]};
      await loginAs(identity);
      const token=await createTestSessionToken(identity);
      expect(token.success).toBe(true);
      if (!token.success) return;
      const http = atlasRequest(token.data);
      const api = new URL("/api/" + E2E_LOCALE + "/analytics/", resolveE2EBaseUrl() ?? "http://localhost:3000").href;
      const compute = async (tool: string, input: Record<string, z.infer<ReturnType<typeof z.json>> | undefined>) => {
        const response = await http.post(api + tool, {
          data: z.json().parse({ ...input, range }),
        });
        expect(response.ok, tool).toBe(true);
        return response.json();
      };
      for (const row of [
        {
          tool: "indicators/window-sum",
          input: { source, size: 2 },
          values: [2, 8, 10],
        },
        {
          tool: "indicators/window-avg",
          input: { source, size: 2 },
          values: [2, 4, 5],
        },
        {
          tool: "indicators/window-min",
          input: { source, size: 2 },
          values: [2, 2, 4],
        },
        {
          tool: "indicators/window-max",
          input: { source, size: 2 },
          values: [2, 6, 6],
        },
        {
          tool: "indicators/ema",
          input: { source, period: 3 },
          values: [2, 4, 4],
        },
        {
          tool: "indicators/clamp",
          input: { source, min: 3, max: 5 },
          values: [3, 5, 4],
        },
        { tool: "indicators/delta", input: { source }, values: [4, -2] },
        {
          tool: "indicators/rsi",
          input: { source: series([3, 4, 5]), period: 2 },
          values: [100],
        },
        {
          tool: "transformers/ratio",
          input: { a: source, b },
          values: [0.5, 3, 4],
        },
        {
          tool: "transformers/merge",
          input: { a: source, b },
          values: [6, 8, 5],
        },
        {
          tool: "transformers/field-pick",
          input: { source: fields, field: "paid" },
          values: [0, 12],
        },
        {
          tool: "transformers/json-path",
          input: { source: fields, path: "meta.paid" },
          values: [0, 12],
        },
      ]) {
        const result = envelope(z.object({ result: points })).parse(
          await compute(row.tool, row.input),
        );
        expect(
          result.data.result.map((p) => p.value),
          row.tool,
        ).toEqual(row.values);
        if (
          row.tool === "transformers/field-pick" ||
          row.tool === "transformers/json-path"
        ) {
          expect(result.data.result.map((p) => p.timestamp)).toEqual([
            days[0],
            days[2],
          ]);
        }
      }
      const bands = envelope(
        z.object({ lower: points, middle: points, upper: points }),
      ).parse(
        await compute("indicators/bollinger", { source, period: 2, stdDev: 1 }),
      );
      expect(bands.data.lower.map((p) => p.value)).toEqual([2, 4]);
      expect(bands.data.middle.map((p) => p.value)).toEqual([4, 5]);
      expect(bands.data.upper.map((p) => p.value)).toEqual([6, 6]);
      const macd = envelope(
        z.object({ macd: points, signal: points, histogram: points }),
      ).parse(
        await compute("indicators/macd", {
          source: constant,
          fastPeriod: 2,
          slowPeriod: 4,
          signalPeriod: 2,
        }),
      );
      for (const output of Object.values(macd.data))
        expect(output.map((p) => p.value)).toEqual([0, 0, 0]);
      for (const row of [
        {
          tool: "threshold",
          input: { source, op: ">", value: 4 },
          expected: [false, true, false],
        },
        {
          tool: "crossover",
          input: { seriesA: source, seriesB: constant },
          expected: [false, true, false],
        },
        {
          tool: "drop",
          input: { source: series([10, 10, 3]), window: 2, dropPct: 0.5 },
          expected: [true],
        },
      ]) {
        const result = envelope(z.object({ signals: flags })).parse(
          await compute("evaluators/" + row.tool, row.input),
        );
        expect(
          result.data.signals.map((s) => s.fired),
          row.tool,
        ).toEqual(row.expected);
      }
      const first = signals([false, true, true]);
      const second = signals([true, true, false]);
      for (const row of [
        {
          tool: "and",
          input: { signals: [first, second] },
          expected: [false, true, false],
        },
        {
          tool: "or",
          input: { signals: [first, second] },
          expected: [true, true, true],
        },
        {
          tool: "not",
          input: { signal: first },
          expected: [true, false, false],
        },
      ]) {
        const result = envelope(z.object({ result: flags })).parse(
          await compute("evaluators/" + row.tool, row.input),
        );
        expect(
          result.data.result.map((s) => s.fired),
          row.tool,
        ).toEqual(row.expected);
      }
      for (const tool of [
        "transformers/field-pick",
        "transformers/json-path",
      ]) {
        const invalid = await http.post(api + tool, {
          data: { source, range },
        });
        expect(
          z.object({ success: z.literal(false) }).parse(await invalid.json())
            .success,
        ).toBe(false);
      }
    },
  );
});
