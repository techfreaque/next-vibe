import type { pathToAliasMap } from "@/generated/endpoints/alias-map-dev";

import type { EndpointMeta } from "../core/definition/endpoints-meta";
import type { CategoryDefinitionSerialized } from "./category-types";
import { erpCategories } from "./erp-company-scope";

type WorkflowAlias = keyof typeof pathToAliasMap;

export const erpInvoiceCreate =
  "payment_invoice_create_POST" satisfies WorkflowAlias;

export const erpEntryPoints = {
  company: "companies-list",
  createCompany: "companies_create_POST",
  accounting: "accounting-dashboard",
} satisfies Record<string, WorkflowAlias>;

export const erpDocumentNavigation = {
  sales: [
    { key: "invoices", alias: "payment-invoice-list" },
    { key: "estimates", alias: "payment-estimate-list" },
  ],
  purchases: [{ key: "bills", alias: "payment-bill-list" }],
} as const satisfies Record<
  string,
  readonly { key: string; alias: WorkflowAlias }[]
>;

type ErpWorkflow =
  | {
      key: "sales" | "expenses" | "bank" | "close" | "exports";
      primary: WorkflowAlias;
      secondary: WorkflowAlias;
    }
  | {
      key: "receivables" | "payables" | "stock" | "tax";
      primary: WorkflowAlias;
      secondary?: never;
    };

export const erpWorkflows: readonly ErpWorkflow[] = [
  {
    key: "sales",
    primary: erpInvoiceCreate,
    secondary: "payment-invoice-list",
  },
  {
    key: "expenses",
    primary: "payment_bill_create_POST",
    secondary: "payment-bill-list",
  },
  { key: "receivables", primary: "coa-receivables-aging" },
  { key: "payables", primary: "coa-payables-aging" },
  {
    key: "bank",
    primary: "bank-statement-import",
    secondary: "bank-statement-lines",
  },
  { key: "stock", primary: "inventory-dashboard" },
  { key: "tax", primary: "coa-tax-report" },
  {
    key: "exports",
    primary: "coa-posting-review",
    secondary: "coa-journal-export",
  },
  {
    key: "close",
    primary: "coa-period-list",
    secondary: "coa-trial-balance",
  },
];

/** Intersect curated destinations with the same role- and platform-filtered catalog used for browsing. */
export function getErpWorkflowAliases(
  webCatalog: readonly EndpointMeta[],
): string[] {
  const available = new Set(
    webCatalog.flatMap((tool) => [tool.toolName, ...tool.aliases]),
  );
  const destinations = [
    ...Object.values(erpEntryPoints),
    ...erpWorkflows.flatMap(({ primary, secondary }) =>
      secondary ? [primary, secondary] : [primary],
    ),
  ];
  return destinations.filter((alias) => available.has(alias));
}

export function getErpNavigationAliases(
  categories: readonly CategoryDefinitionSerialized[],
  webCatalog: readonly EndpointMeta[],
): string[] {
  const available = new Set(
    webCatalog.flatMap((tool) => [tool.toolName, ...tool.aliases]),
  );
  const defaults = categories.flatMap((category) =>
    erpCategories.has(category.key)
      ? [
          category.defaultEntryAlias,
          ...Object.values(category.subcategories ?? {}).map(
            (subcategory) => subcategory.defaultEntryAlias,
          ),
        ]
      : [],
  );
  return [
    ...Object.values(erpDocumentNavigation).flatMap((group) =>
      group.map((item) => item.alias),
    ),
    ...defaults,
  ].filter(
    (alias): alias is string => alias !== undefined && available.has(alias),
  );
}
