import { describe, expect, it } from "vitest";

import { classifyBankRow, matchingSupplier, privacyRuleSchema } from "./rules";

describe("mixed bank feed rules", () => {
  it("holds an unmatched row and never assumes known counterparties are business", () => {
    const row = { counterparty: "Example supplier", description: "Invoice 42" };
    expect(classifyBankRow("mixed", [], row)).toBe("review");
    expect(classifyBankRow("business", [], row)).toBe("business");
    expect(
      classifyBankRow(
        "mixed",
        [
          {
            field: "counterparty",
            match: "equals",
            literal: "example  SUPPLIER",
            result: "business",
          },
        ],
        row,
      ),
    ).toBe("business");
  });

  it("prefers private when rules conflict and treats wildcards literally", () => {
    const row = {
      counterparty: "Example supplier",
      description: "Personal payment",
    };
    expect(
      classifyBankRow(
        "business",
        [
          {
            field: "counterparty",
            match: "equals",
            literal: "Example supplier",
            result: "business",
          },
          {
            field: "description",
            match: "startsWith",
            literal: "personal",
            result: "private",
          },
        ],
        row,
      ),
    ).toBe("private");
    expect(
      classifyBankRow(
        "mixed",
        [
          {
            field: "description",
            match: "contains",
            literal: ".*.",
            result: "business",
          },
        ],
        row,
      ),
    ).toBe("review");
  });

  it("supports exact case-insensitive IBAN matching and rejects patterns", () => {
    const rule = {
      field: "iban",
      match: "equals",
      literal: "DE00 1234 5678 0000 0000 00",
      result: "private",
    } as const;
    expect(privacyRuleSchema.safeParse(rule).success).toBe(true);
    expect(
      privacyRuleSchema.safeParse({ ...rule, match: "contains" }).success,
    ).toBe(false);
    expect(
      classifyBankRow("mixed", [rule], {
        counterpartyIban: "de00123456780000000000",
      }),
    ).toBe("private");
  });
  it("attributes an explicit alias only when every matching supplier rule agrees", () => {
    const supplierId = "00000000-0000-4000-8000-000000000001";
    const anotherId = "00000000-0000-4000-8000-000000000002";
    const alias = privacyRuleSchema.parse({
      field: "counterparty",
      match: "equals",
      literal: "E2E alias",
      result: "business",
      supplierId,
    });
    const description = privacyRuleSchema.parse({
      field: "description",
      match: "startsWith",
      literal: "Hosting",
      result: "business",
      supplierId,
    });
    const row = { counterparty: "E2E alias", description: "Hosting service" };
    expect(matchingSupplier([alias, description], row)).toBe(supplierId);
    expect(
      matchingSupplier([alias, { ...description, supplierId: anotherId }], row),
    ).toBeNull();
    expect(
      matchingSupplier([alias, description], {
        description: "Unknown account",
      }),
    ).toBeUndefined();
    expect(
      privacyRuleSchema.safeParse({ ...alias, result: "private" }).success,
    ).toBe(false);
  });
});
