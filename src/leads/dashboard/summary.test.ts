import { expect, test } from "vitest";

import { summarizeLeads } from "./summary";

const counter = { value: 14, previous: 10 };
const comparativeSnapshot = {
  window: { from: "2026-11-10", to: "2026-11-16", previousFrom: "2026-11-03", previousTo: "2026-11-09", bucket: "day" as const },
  humanLeads: counter, botLeads: { value: 5, previous: 7 }, signups: counter, payers: counter,
  flaggedNetworks: { value: 2, previous: 0 },
  humanTrend: [4, 10], signupTrend: [], botTrend: [], payerTrend: [], flaggedTrend: [1, 1],
};

test("preserves dashboard windows, comparisons and count scopes", () => {
  const result = summarizeLeads({ last7Days: comparativeSnapshot, recentLeads: [] }, "Unnamed lead");
  expect(result.from).toBe("2026-11-10");
  expect(result.kpis[0]).toMatchObject({ value: 14, previous: 10, sparkline: [4, 10] });
  expect(result.attention).toEqual([{ label: "widget.flaggedAttention", count: 2, severity: "warning", drill: { alias: "abuse-report" } }]);
});

test("unidentified recent leads link by UUID without showing it as identity", () => {
  const id = "bdbc9643-02ae-4b87-bee3-bbc12128338d";
  const result = summarizeLeads({
    last7Days: { ...comparativeSnapshot, flaggedNetworks: { value: 0, previous: null } },
    recentLeads: [{ id, email: "", businessName: " ", status: "new", source: "website", createdAt: "2026-11-10T12:00:00.000Z" }],
  }, "Unnamed lead");
  expect(result.attention).toEqual([]);
  expect(result.recent[0]).toMatchObject({ title: "Unnamed lead", drill: { urlPathParams: { id } } });
});
