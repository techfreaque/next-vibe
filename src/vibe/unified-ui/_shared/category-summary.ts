import { z } from "zod";

const drill = z.object({
  alias: z.string().min(1),
  args: z.record(z.string(), z.string()).optional(),
  urlPathParams: z.record(z.string(), z.string()).optional(),
});

/** Domain endpoints send stable label keys. Their widgets translate those keys in the current locale. */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Preserve each domain’s exact Zod label union in the endpoint output.
export function categorySummarySchema<TLabel extends string>(
  label: z.ZodType<TLabel, TLabel>,
) {
  return z.object({
    from: z.iso.date(),
    to: z.iso.date(),
    kpis: z
      .array(
        z
          .object({
            label,
            value: z.number().nullable(),
            previous: z.number().nullable().optional(),
            invertDelta: z.boolean().optional(),
            format: z.enum(["number", "money", "percent"]),
            sparkline: z.array(z.number()).max(366).optional(),
            currency: z
              .string()
              .regex(/^[A-Z]{3}$/)
              .optional(),
            drill: drill.optional(),
          })
          .refine(
            (metric) => metric.format !== "money" || Boolean(metric.currency),
          ),
      )
      .max(6),
    attentionAvailable: z.boolean(),
    attention: z
      .array(
        z.object({
          label,
          count: z.number().int().nonnegative(),
          severity: z.enum(["danger", "warning", "info"]),
          drill,
        }),
      )
      .max(8),
    recent: z
      .array(
        z
          .object({
            title: z.string().optional(),
            label: label.optional(),
            detail: z
              .discriminatedUnion("kind", [
                z.object({
                  kind: z.literal("money"),
                  amount: z.number(),
                  currency: z.string().regex(/^[A-Z]{3}$/),
                }),
                z.object({ kind: z.literal("name"), value: z.string().min(1) }),
              ])
              .optional(),
            /** Who or what the row is about, e.g. the customer's display name. */
            subject: z.string().min(1).max(120).optional(),
            at: z.iso.datetime(),
            drill,
          })
          .refine((row) => Boolean(row.title || row.label)),
      )
      .max(8),
    /** Record counts for the landing's "Work with" shortcuts, keyed by tool alias. */
    destinationCounts: z
      .array(
        z.object({
          alias: z.string().min(1),
          count: z.number().int().nonnegative(),
        }),
      )
      .max(12)
      .optional(),
  });
}

export type CategorySummary<TLabel extends string> = z.output<
  ReturnType<typeof categorySummarySchema<TLabel>>
>;
