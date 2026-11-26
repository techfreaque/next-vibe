import { describe, expect, it } from "bun:test";

import { endpointsMeta } from "@/generated/endpoints/meta/en";

import { classifyAdminCatalog, getAdminToolRole } from "./admin-classification";
import type { CategoryDefinitionSerialized } from "./category-types";

const documents: CategoryDefinitionSerialized = {
  key: "documents",
  label: "Documents",
  labels: {},
  group: "business",
  icon: "file-text",
  order: 1,
  adminPathPrefixes: ["payment"],
  subcategories: {
    invoices: {
      icon: "file-text",
      label: "Invoices",
      labels: {},
      order: 1,
      adminPathPrefixes: ["payment/invoice"],
    },
  },
};

describe("admin category placement", () => {
  it("places a tool only when its complete path prefix matches", () => {
    const original = endpointsMeta.find(
      ({ toolName }) => toolName === "payment-invoice-list",
    );
    expect(original).toBeDefined();
    if (!original) {
      return;
    }
    const similar = { ...original, path: ["payment-history"] };
    const child = { ...original, path: ["payment", "invoice", "new-report"] };
    const [invoice, report, other] = classifyAdminCatalog(
      [original, child, similar],
      [documents],
    );
    expect(invoice?.category).toBe("documents");
    expect(report?.subCategory).toBe("invoices");
    expect(other).toBe(similar);
    expect(original.category).toBe("payments");
    expect(classifyAdminCatalog([original], [])).toEqual([original]);
    expect(classifyAdminCatalog([], [documents])).toEqual([]);
  });

  it("prefers exact paths at equal length and leaves neighboring endpoints in place", () => {
    const payment = endpointsMeta.find(
      ({ toolName }) => toolName === "payment_GET",
    );
    const settlement = endpointsMeta.find(
      ({ toolName }) => toolName === "processor-accounting",
    );
    expect(payment).toBeDefined();
    expect(settlement).toBeDefined();
    if (!payment || !settlement) {
      return;
    }
    const account: CategoryDefinitionSerialized = {
      ...documents,
      key: "accountSettings",
      adminPaths: ["subscription"],
      adminPathPrefixes: undefined,
      subcategories: {
        billing: {
          icon: "credit-card",
          order: 1,
          label: "Billing",
          labels: {},
          adminPaths: ["payment"],
        },
      },
    };
    const company = {
      ...payment,
      path: ["subscription", "company", "[companyId]", "list"],
    };
    const personal = { ...payment, path: ["subscription"] };
    const results = classifyAdminCatalog(
      [payment, settlement, personal, company],
      [documents, account],
    );
    expect(
      results.map(({ category, subCategory }) => [category, subCategory]),
    ).toEqual([
      ["accountSettings", "billing"],
      ["documents", ""],
      ["accountSettings", ""],
      [company.category, company.subCategory],
    ]);
    expect(results[0]?.allowedRoles).toEqual(payment.allowedRoles);
    expect(results[3]).toBe(company);
  });
});

describe("admin tool roles", () => {
  it("keeps record actions with their entities and collapses graph nodes and background jobs", () => {
    expect(getAdminToolRole({ method: "GET", path: ["v1", "models"] })).toBe(
      "developer",
    );
    expect(
      getAdminToolRole({
        method: "GET",
        path: ["products", "catalog", "list"],
      }),
    ).toBe("destination");
    expect(
      getAdminToolRole({
        method: "POST",
        path: ["products", "catalog", "create"],
      }),
    ).toBe("create");
    expect(
      getAdminToolRole({
        method: "GET",
        path: ["payment", "invoice", "[invoiceId]", "get"],
      }),
    ).toBe("record");
    expect(
      getAdminToolRole({ method: "POST", path: ["vibe", "tasks", "cleanup"] }),
    ).toBe("automation");
    expect(
      getAdminToolRole({
        method: "POST",
        path: ["analytics", "indicators", "ema"],
      }),
    ).toBe("developer");
    expect(
      getAdminToolRole({
        method: "POST",
        path: ["products", "new"],
        admin: { role: "create" },
      }),
    ).toBe("create");
  });
});
