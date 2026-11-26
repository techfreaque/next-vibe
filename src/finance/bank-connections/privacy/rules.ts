import { z } from "zod";

export const disposition = z.enum(["business", "private"]);
export const privacyMode = z.enum(["mixed", "business"]);
export const retentionDays = z.number().int().min(1).max(30);
const fieldSchema = z.enum(["counterparty", "iban", "description"]);

export const privacyRuleSchema = z
  .object({
    field: fieldSchema,
    match: z.enum(["equals", "contains", "startsWith"]),
    literal: z.string().trim().min(3).max(200),
    result: disposition,
    supplierId: z.uuid().optional(),
  })
  .refine(({ result, supplierId }) => result === "business" || !supplierId)
  .refine(
    ({ field, match, literal }) =>
      field !== "iban" ||
      (match === "equals" &&
        /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/i.test(
          literal.replaceAll(/\s/g, ""),
        )),
  );

export const privacyRulesSchema = z.array(privacyRuleSchema).max(40);
export type PrivacyRule = z.infer<typeof privacyRuleSchema>;
export type PrivacyMode = z.infer<typeof privacyMode>;
export type Disposition = z.infer<typeof disposition>;

export function normalizeMatch(value: string, iban = false): string {
  const normalized = value.normalize("NFKC").toUpperCase().trim();
  return iban
    ? normalized.replaceAll(/\s/g, "")
    : normalized.replaceAll(/\s+/g, " ");
}

export function privacyRuleMatches(
  rule: PrivacyRule,
  row: {
    counterparty?: string;
    counterpartyIban?: string;
    description?: string;
  },
): boolean {
  const iban = rule.field === "iban";
  const raw = rule.field === "iban" ? row.counterpartyIban : row[rule.field];
  if (!raw) {
    return false;
  }
  const input = normalizeMatch(raw, iban);
  const pattern = normalizeMatch(rule.literal, iban);
  switch (rule.match) {
    case "equals":
      return input === pattern;
    case "contains":
      return input.includes(pattern);
    case "startsWith":
      return input.startsWith(pattern);
  }
}

/** undefined means no configured attribution; null means an ambiguous match. */
export function matchingSupplier(
  rules: readonly PrivacyRule[],
  row: Parameters<typeof privacyRuleMatches>[1],
): string | null | undefined {
  const ids = new Set(
    rules.flatMap((rule) =>
      rule.result === "business" &&
      rule.supplierId &&
      privacyRuleMatches(rule, row)
        ? [rule.supplierId]
        : [],
    ),
  );
  return ids.size > 1 ? null : ids.values().next().value;
}

export function classifyBankRow(
  mode: PrivacyMode,
  rules: readonly PrivacyRule[],
  row: Parameters<typeof privacyRuleMatches>[1],
): Disposition | "review" {
  const results = new Set(
    rules
      .filter((rule) => privacyRuleMatches(rule, row))
      .map(({ result }) => result),
  );
  if (results.has("private")) {
    return "private";
  }
  return results.has("business") || mode === "business" ? "business" : "review";
}
