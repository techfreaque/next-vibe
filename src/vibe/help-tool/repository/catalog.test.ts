import { describe, expect, test } from "bun:test";

import {
  copyCatalogSearchParams,
  parseToolsInitialState,
  readEndpointSearchParams,
} from "@/_pages/tools/initial-state";

import companyGet from "@/companies/[companyId]/get/definition";
import {
  readWorkspaceCompanyCookie,
  resolveWorkspaceCompany,
} from "@/companies/_shared/workspace-company";
import { CATEGORY_REGISTRY } from "@/generated/categories/registry";
import { endpointsMeta } from "@/generated/endpoints/meta/en";
import invoiceCreate from "@/payment/invoice/create/definition";
import invoiceList from "@/payment/invoice/list/definition";

import type { EndpointMeta } from "../../core/definition/endpoints-meta";
import type { JwtPayloadType } from "../../identity/auth/types";
import { PlatformMarker, UserPermissionRole } from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";
import {
  applyWorkspaceCompany,
  applyWorkspaceCompanyToEntry,
  readWorkspaceCompanyOverride,
} from "../erp-company-scope";
import {
  erpEntryPoints,
  erpWorkflows,
  getErpNavigationAliases,
  getErpWorkflowAliases,
} from "../erp-workflows";
import {
  buildCategories,
  filterCatalogCategory,
  filterMetaForUser,
  getRecordSearchTargets,
  resolveEffectiveUser,
  searchCatalog,
} from "./meta-filter";

const adminUser: JwtPayloadType = {
  isPublic: false,
  id: "410c31af-c008-4752-8c76-164846cf526c",
  leadId: "804d1fee-4b72-4d7b-8913-8a3871502221",
  roles: [UserPermissionRole.ADMIN],
};

const catalogItem: EndpointMeta = {
  toolName: "billing-documents",
  aliases: ["invoice-list"],
  method: "GET",
  path: ["invoice", "list"],
  allowedRoles: [UserPermissionRole.ADMIN],
  title: "Documents commerciaux",
  titleShort: "Factures",
  description: "Lists invoices.",
  icon: "list",
  category: "finance",
  subCategory: "Invoices",
  tags: [],
};

describe("admin catalog", () => {
  test("finds an unpinned tool by its localized short title and honors web and role boundaries", () => {
    const tools: EndpointMeta[] = [
      catalogItem,
      {
        ...catalogItem,
        toolName: "cli-only",
        allowedRoles: [UserPermissionRole.ADMIN, PlatformMarker.WEB_OFF],
      },
      {
        ...catalogItem,
        toolName: "another-tool",
        titleShort: "Documents",
        description: "Listes de factures.",
      },
    ];
    const webTools = filterMetaForUser(tools, Platform.NEXT_PAGE, adminUser);

    expect(
      searchCatalog(webTools, "factures", (item) => item.toolName).map(
        (item) => item.toolName,
      ),
    ).toEqual(["billing-documents", "another-tool"]);
    expect(
      filterMetaForUser(
        tools,
        Platform.NEXT_PAGE,
        resolveEffectiveUser(adminUser, UserPermissionRole.CUSTOMER),
      ),
    ).toEqual([]);
  });

  test("resolves every ERP shortcut to a web endpoint administrators can open", () => {
    const available = getErpWorkflowAliases(
      filterMetaForUser(endpointsMeta, Platform.NEXT_PAGE, adminUser),
    );

    expect(available).toEqual([
      ...Object.values(erpEntryPoints),
      ...erpWorkflows.flatMap(({ primary, secondary }) =>
        secondary ? [primary, secondary] : [primary],
      ),
    ]);
  });

  test("uses authorized generated defaults for workstation navigation", () => {
    const adminWeb = filterMetaForUser(
      endpointsMeta,
      Platform.NEXT_PAGE,
      adminUser,
    );
    const adminNav = getErpNavigationAliases(CATEGORY_REGISTRY, adminWeb);
    expect(adminNav).toContain("accounting-dashboard");
    expect(adminNav).toContain("inventory-dashboard");
    expect(adminNav).toContain("payment-invoice-list");
    expect(adminNav).toContain("payment-estimate-list");
    expect(adminNav).toContain("payment-bill-list");
    expect(adminNav).not.toContain("ai-stream");

    const customer = resolveEffectiveUser(
      adminUser,
      UserPermissionRole.CUSTOMER,
    );
    const customerWeb = filterMetaForUser(
      endpointsMeta,
      Platform.NEXT_PAGE,
      customer,
    );
    expect(
      getErpNavigationAliases(CATEGORY_REGISTRY, customerWeb),
    ).not.toContain("accounting-dashboard");
  });

  test("does not expose documents absent from the role-filtered catalog", () => {
    const document: EndpointMeta = {
      ...catalogItem,
      toolName: "invoice-records",
      aliases: ["payment-invoice-list"],
      allowedRoles: [UserPermissionRole.ADMIN],
    };
    expect(getErpNavigationAliases([], [document])).toEqual([
      "payment-invoice-list",
    ]);
    expect(
      getErpNavigationAliases(
        [],
        filterMetaForUser(
          [document],
          Platform.NEXT_PAGE,
          resolveEffectiveUser(adminUser, UserPermissionRole.CUSTOMER),
        ),
      ),
    ).toEqual([]);
  });

  test("restores the full-catalog mode without sending it to the endpoint", () => {
    const params = new URLSearchParams(
      "catalog=all&arg.companyId=chosen&sf=web",
    );
    expect(copyCatalogSearchParams(params).get("catalog")).toBe("all");
    expect(readEndpointSearchParams(params)).toEqual({ companyId: "chosen" });
    expect(parseToolsInitialState(params)).toEqual({ statsFilter: "web" });
  });

  test("keeps web-disabled and role-filtered destinations out of the ERP shortcuts", () => {
    const tools: EndpointMeta[] = [
      {
        ...catalogItem,
        toolName: "accounting-dashboard",
        aliases: [],
        allowedRoles: [UserPermissionRole.ADMIN, PlatformMarker.WEB_OFF],
      },
      {
        ...catalogItem,
        toolName: "supplier-bills",
        aliases: ["payment-bill-list"],
      },
    ];

    expect(
      getErpWorkflowAliases(
        filterMetaForUser(tools, Platform.NEXT_PAGE, adminUser),
      ),
    ).toEqual(["payment-bill-list"]);
    for (const role of [
      UserPermissionRole.CUSTOMER,
      UserPermissionRole.PUBLIC,
    ]) {
      expect(
        getErpWorkflowAliases(
          filterMetaForUser(
            tools,
            Platform.NEXT_PAGE,
            resolveEffectiveUser(adminUser, role),
          ),
        ),
      ).toEqual([]);
    }
  });

  test("uses preferred names or secondary aliases for authorized GET record destinations", () => {
    expect(
      getRecordSearchTargets(
        ["billing-documents", "invoice-list", "invoice-send", "missing"].map(
          (alias) => ({
            recordSearch: { alias, field: "search" },
          }),
        ),
        [
          catalogItem,
          {
            ...catalogItem,
            toolName: "invoice-send",
            aliases: [],
            method: "POST",
          },
        ],
      ),
    ).toEqual([
      { alias: "billing-documents", field: "search", label: "Factures" },
      { alias: "invoice-list", field: "search", label: "Factures" },
    ]);
  });

  test("builds category counts and applies parent and subcategory together", () => {
    const tools: EndpointMeta[] = [
      catalogItem,
      { ...catalogItem, toolName: "bill-list", subCategory: "Bills" },
      { ...catalogItem, toolName: "archive", category: "archive" },
    ];

    expect(buildCategories(tools)).toEqual([
      { name: "archive", count: 1 },
      {
        name: "finance",
        count: 2,
        subCategories: [
          { name: "Bills", count: 1 },
          { name: "Invoices", count: 1 },
        ],
      },
    ]);
    expect(filterCatalogCategory(tools, "finance", "Invoices", true)).toEqual([
      catalogItem,
    ]);
  });

  test("retains catalog filters independently of endpoint arguments and accepts legacy links", () => {
    const route = new URLSearchParams({
      q: "Factures",
      sf: "web",
      cat: "finance",
      sub: "Invoices",
      p: "2",
      ps: "25",
      prod: "1",
      "arg.page": "4",
      "arg.q": "recipient@example.com",
      id: "legacy-id",
    });
    expect(parseToolsInitialState(copyCatalogSearchParams(route))).toEqual({
      statsFilter: "web",
      query: "Factures",
      category: "finance",
      subCategory: "Invoices",
      page: 2,
      pageSize: 25,
      includeProdOnly: true,
    });
    expect(readEndpointSearchParams(route)).toEqual({
      page: "4",
      q: "recipient@example.com",
      id: "legacy-id",
    });
    expect(
      parseToolsInitialState(
        new URLSearchParams("cat=finance&p=5junk&ps=1001"),
      ),
    ).toEqual({
      statsFilter: "web",
      category: "finance",
    });
  });
});

describe("workspace company", () => {
  const companyA = {
    id: "ea44bb33-684e-459d-aae8-48988ab62a78",
    name: "First company",
    currency: "EUR",
  };
  const companyB = {
    id: "3354c479-5419-4cc9-96fa-5237e648cb57",
    name: "Second company",
    currency: "PLN",
  };

  test("chooses only an authorized remembered company or the only accessible company", () => {
    expect(resolveWorkspaceCompany([companyA, companyB], companyB.id)).toBe(
      companyB,
    );
    expect(
      resolveWorkspaceCompany([companyA, companyB], "removed"),
    ).toBeUndefined();
    expect(resolveWorkspaceCompany([companyA], "removed")).toBe(companyA);
    expect(resolveWorkspaceCompany([], companyA.id)).toBeUndefined();
    expect(
      readWorkspaceCompanyCookie(
        `${adminUser.id}.${companyA.id}`,
        adminUser.id,
      ),
    ).toBe(companyA.id);
    expect(
      readWorkspaceCompanyCookie(`different-user.${companyA.id}`, adminUser.id),
    ).toBeUndefined();
  });

  test("defaults URL and request scope without discarding or overriding explicit inputs", () => {
    const filter = { data: { search: "Invoice 01" } };
    expect(applyWorkspaceCompany(invoiceList.GET, filter, companyA.id)).toEqual(
      {
        data: { search: "Invoice 01", companyId: companyA.id },
      },
    );
    expect(applyWorkspaceCompany(companyGet.GET, {}, companyA.id)).toEqual({
      urlPathParams: { companyId: companyA.id },
    });
    const modal = {
      endpoint: invoiceCreate.POST,
      params: { data: { currency: "EUR" } },
      timestamp: 1,
      renderInModal: true,
    };
    expect(applyWorkspaceCompanyToEntry(modal, companyA.id)).toEqual({
      ...modal,
      params: { data: { currency: "EUR", companyId: companyA.id } },
    });
    const explicit = { data: { companyId: companyB.id } };
    expect(applyWorkspaceCompany(invoiceList.GET, explicit, companyA.id)).toBe(
      explicit,
    );
    const pathExplicit = { urlPathParams: { companyId: companyB.id } };
    expect(
      applyWorkspaceCompany(companyGet.GET, pathExplicit, companyA.id),
    ).toBe(pathExplicit);
    expect(readWorkspaceCompanyOverride(invoiceList.GET, explicit)).toBe(
      companyB.id,
    );
    expect(readWorkspaceCompanyOverride(companyGet.GET, pathExplicit)).toBe(
      companyB.id,
    );
    expect(
      readWorkspaceCompanyOverride(companyGet.GET, explicit),
    ).toBeUndefined();
    expect(applyWorkspaceCompany(invoiceList.GET, explicit)).toBe(explicit);
  });
});
