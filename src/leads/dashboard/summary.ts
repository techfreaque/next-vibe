import type { CategorySummary } from "next-vibe/unified-ui/_shared/category-summary";
import {
  analyticsWindowSchema,
  kpiSchema,
} from "next-vibe/unified-ui/analytics/schema";
import { z } from "zod";

export const recentLeadSchema = z.object({
  id: z.string().uuid(),
  businessName: z.string(),
  email: z.string(),
  status: z.string(),
  source: z.string(),
  createdAt: z.string(),
});

export const leadWindowSchema = z.object({
  window: analyticsWindowSchema,
  humanLeads: kpiSchema,
  botLeads: kpiSchema,
  signups: kpiSchema,
  payers: kpiSchema,
  flaggedNetworks: kpiSchema,
  humanTrend: z.array(z.number()),
  signupTrend: z.array(z.number()),
  botTrend: z.array(z.number()),
  payerTrend: z.array(z.number()),
  flaggedTrend: z.array(z.number()),
});

export const leadSummaryLabel = z.enum([
  "widget.humanLeads",
  "widget.signups",
  "widget.payers",
  "widget.flaggedNetworks",
  "widget.flaggedAttention",
]);

type Summary = CategorySummary<z.infer<typeof leadSummaryLabel>>;

export function summarizeLeads(
  data: {
    last7Days: z.output<typeof leadWindowSchema>;
    recentLeads: z.output<typeof recentLeadSchema>[];
  },
  unnamed: string,
): Summary {
  const snap = data.last7Days;
  return {
    from: snap.window.from,
    to: snap.window.to,
    kpis: [
      {
        label: "widget.humanLeads",
        ...snap.humanLeads,
        format: "number",
        sparkline: snap.humanTrend,
        drill: { alias: "acquisition-report" },
      },
      {
        label: "widget.signups",
        ...snap.signups,
        format: "number",
        sparkline: snap.signupTrend,
        drill: { alias: "funnel-report" },
      },
      {
        label: "widget.payers",
        ...snap.payers,
        format: "number",
        sparkline: snap.payerTrend,
        drill: { alias: "funnel-report" },
      },
      {
        label: "widget.flaggedNetworks",
        ...snap.flaggedNetworks,
        format: "number",
        sparkline: snap.flaggedTrend,
        drill: { alias: "abuse-report" },
      },
    ],
    attentionAvailable: true,
    attention:
      snap.flaggedNetworks.value > 0
        ? [
            {
              label: "widget.flaggedAttention",
              count: snap.flaggedNetworks.value,
              severity: "warning",
              drill: { alias: "abuse-report" },
            },
          ]
        : [],
    recent: data.recentLeads.slice(0, 5).map((lead) => ({
      title: lead.businessName.trim() || lead.email.trim() || unnamed,
      at: lead.createdAt,
      drill: { alias: "leads_id_GET", urlPathParams: { id: lead.id } },
    })),
  };
}
