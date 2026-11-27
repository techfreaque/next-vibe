import { describe, expect, test } from "bun:test";

import {
  copyCatalogSearchParams,
  parseToolsInitialState,
  readEndpointSearchParams,
} from "@/_pages/tools/initial-state";
import {
  readWorkspaceCompanyCookie,
  resolveWorkspaceCompany,
} from "@/companies/_shared/workspace-company";
import companyGet from "@/companies/[companyId]/get/definition";
import { endpointsMeta } from "@/generated/endpoints/meta/en";
import invoiceCreate from "@/payment/invoice/create/definition";
import invoiceList from "@/payment/invoice/list/definition";

import type { EndpointMeta } from "../../core/definition/endpoints-meta";
import type { JwtPayloadType } from "../../identity/auth/types";
import { PlatformMarker, UserPermissionRole } from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";
import {
  buildAdminCatalogDestinations,
  getAdminCategoryLandings,
} from "../admin-catalog-model";
import type { CategoryDefinitionSerialized } from "../category-types";
import {
  applyWorkspaceCompany,
  applyWorkspaceCompanyToEntry,
  readWorkspaceCompanyOverride,
} from "../erp-company-scope";
import {
  buildCategories,
  filterCatalogCategory,
  filterMetaForUser,
  getRecordSearchTargets,
  rankWorkspaceMatches,
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

function searchWorkspaceCatalog(query: string): EndpointMeta[] {
  return rankWorkspaceMatches(
    searchCatalog(endpointsMeta, query, (tool) => tool.toolName),
    query,
  );
}

describe("admin catalog", () => {
  test("leads with the customer invoice list for a business term and keeps specific actions reachable", () => {
    expect(searchWorkspaceCatalog("invoice")[0]?.toolName).toBe(
      "payment-invoice-list",
    );
    expect(searchWorkspaceCatalog("invoice-share")[0]?.toolName).toBe(
      "invoice-share",
    );
    expect(searchWorkspaceCatalog("Duplicate Invoice")[0]?.path.at(-1)).toBe(
      "duplicate",
    );
  });
  test("requires every catalog query term and ranks the exact title first", () => {
    const tools = [
      { ...catalogItem, toolName: "trialing", title: "Trialing accounts" },
      {
        ...catalogItem,
        toolName: "revenue-trial-history",
        description: "Starting balance",
      },
      { ...catalogItem, toolName: "coa-trial-balance", title: "Trial balance" },
    ];
    expect(
      searchCatalog(tools, "trial balance", (r) => r.toolName).map(
        (r) => r.toolName,
      ),
    ).toEqual(["coa-trial-balance", "revenue-trial-history"]);
  });
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

  test("restores the full-catalog mode without sending it to the endpoint", () => {
    const params = new URLSearchParams(
      "catalog=all&arg.companyId=chosen&sf=web",
    );
    expect(copyCatalogSearchParams(params).get("catalog")).toBe("all");
    expect(readEndpointSearchParams(params)).toEqual({ companyId: "chosen" });
    expect(parseToolsInitialState(params)).toEqual({
      statsFilter: "web",
      catalogNavigation: true,
    });
  });

  test("lists each authorized GET record search by alias and field once", () => {
    expect(
      getRecordSearchTargets(
        [
          { alias: "billing-documents", field: "search" },
          { alias: "invoice-list", field: "search" },
          { alias: "invoice-list", field: "search" },
          { alias: "invoice-list", field: "invoiceNumber" },
          { alias: "invoice-send", field: "search" },
          { alias: "missing", field: "search" },
        ].map((recordSearch) => ({ recordSearch })),
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
      { alias: "invoice-list", field: "invoiceNumber", label: "Factures" },
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
      catalogNavigation: true,
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
      catalogNavigation: true,
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

  test("chooses the remembered authorized company or the first accessible company", () => {
    expect(resolveWorkspaceCompany([companyA, companyB], companyB.id)).toBe(
      companyB,
    );
    expect(resolveWorkspaceCompany([companyA, companyB], "removed")).toBe(
      companyA,
    );
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

describe("platform admin landing metadata", () => {
  const category: CategoryDefinitionSerialized = {
    key: "billing",
    label: "Fakturácia",
    labels: { "sk-SK": "Fakturácia" },
    group: "billing",
    icon: "receipt",
    order: 1,
    landing: {
      actions: ["fixture-removed", "fixture-admin", "fixture-bill"],
      heading: { "sk-SK": "Fakturácia" },
      destinationDescriptions: {
        "fixture-bill": { "sk-SK": "Skontrolujte doručené faktúry." },
      },
      destinations: ["fixture-bill", "fixture-invoice", "fixture-admin"],
      overview: { alias: "fixture-removed", scope: "company" },
    },
    descriptions: { "sk-SK": "Prehľad fakturácie a dodávateľských dokladov." },
    createActions: ["fixture-create"],
  };
  const operations: EndpointMeta[] = [
    {
      ...catalogItem,
      category: "billing",
      toolName: "fixture-only-admin",
      aliases: ["fixture-admin"],
      title: "Spravovať fakturáciu",
      titleShort: "",
    },
    {
      ...catalogItem,
      category: "billing",
      toolName: "fixture-invoice",
      aliases: ["fixture-bill"],
      title: "Dodávateľské faktúry",
      titleShort: "",
      allowedRoles: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    },
  ];

  test("adds new permitted tools and drops removed declarations and orphan routes", () => {
    const adminOps = filterMetaForUser(
      operations,
      Platform.NEXT_PAGE,
      adminUser,
    );
    const initial = getAdminCategoryLandings([category], adminOps).billing;
    expect(initial?.actions).toEqual([]);
    expect(initial?.destinations).toEqual([
      { alias: "fixture-bill", title: "Dodávateľské faktúry" },
      { alias: "fixture-admin", title: "Spravovať fakturáciu" },
    ]);
    expect(
      getAdminCategoryLandings([category], adminOps).billing?.overview,
    ).toBeUndefined();
    const added = {
      ...catalogItem,
      category: "billing",
      toolName: "fixture-new",
      aliases: ["fixture-removed"],
      title: "Nový nástroj",
      titleShort: "",
    };
    const current = [...adminOps, added];
    expect(
      getAdminCategoryLandings([category], current).billing?.destinations.map(
        ({ alias }) => alias,
      ),
    ).toContain("fixture-removed");
    expect(
      getAdminCategoryLandings([category], current).billing?.overview?.alias,
    ).toBe("fixture-removed");
    expect(
      buildAdminCatalogDestinations(current)["fixture-removed"]?.category,
    ).toBe("billing");
    expect(
      buildAdminCatalogDestinations(current)["fixture-new"]?.category,
    ).toBe("billing");
    expect(
      buildAdminCatalogDestinations([
        {
          ...added,
          path: ["fixture", "report"],
          aliases: ["fixture-a", "fixture-b"],
        },
      ])["fixture/report/GET"]?.category,
    ).toBe("billing");
    expect(
      buildAdminCatalogDestinations([
        { ...added, aliases: ["fixture-a", "fixture-b"] },
      ])["fixture-b"]?.category,
    ).toBe("billing");
    expect(
      buildAdminCatalogDestinations(adminOps)["fixture-removed"],
    ).toBeUndefined();
  });

  test("keeps the embedded summary out of destinations under each of its aliases", () => {
    const landing = getAdminCategoryLandings(
      [
        {
          ...category,
          landing: {
            summary: { alias: "fixture-bill", scope: "platform" },
            overview: { alias: "fixture-admin", scope: "platform" },
            destinations: ["fixture-invoice", "fixture-bill"],
          },
        },
      ],
      operations,
    ).billing;
    expect(landing?.summary?.alias).toBe("fixture-bill");
    expect(landing?.destinations.map(({ alias }) => alias)).toEqual([
      "fixture-admin",
    ]);
  });
  test("fills undeclared landing destinations from the current permitted definitions", () => {
    const newList: EndpointMeta = {
      ...catalogItem,
      category: "billing",
      toolName: "fixture-account-list",
      aliases: [],
      titleShort: "Settlement accounts",
      path: ["settlements", "list"],
    };
    const undeclared = {
      ...category,
      landing: { ...category.landing, destinations: undefined },
    };
    const withList = getAdminCategoryLandings(
      [undeclared],
      [...operations, newList],
    );
    expect(withList.billing?.destinations).toContainEqual({
      alias: newList.toolName,
      title: "Settlement accounts",
    });
    const afterRemoval = getAdminCategoryLandings([undeclared], operations);
    expect(
      afterRemoval.billing?.destinations.map(({ alias }) => alias),
    ).not.toContain(newList.toolName);
    // A curated landing shows only its declared shortcuts.
    const curated = getAdminCategoryLandings(
      [category],
      [...operations, newList],
    );
    expect(
      curated.billing?.destinations.map(({ alias }) => alias),
    ).not.toContain(newList.toolName);
  });

  test("drops denied actions per effective role and leaves a permitted peer visible", () => {
    const customer = resolveEffectiveUser(
      adminUser,
      UserPermissionRole.CUSTOMER,
    );
    const web = filterMetaForUser(operations, Platform.NEXT_PAGE, customer);
    const landing = getAdminCategoryLandings([category], web).billing;
    expect(landing?.actions).toEqual([]);
    expect(landing?.destinations).toEqual([
      { alias: "fixture-bill", title: "Dodávateľské faktúry" },
    ]);
    expect(buildAdminCatalogDestinations(web)["fixture-admin"]).toBeUndefined();
    expect(buildAdminCatalogDestinations(web)["fixture-bill"]?.category).toBe(
      "billing",
    );
  });

  test("localizes the landing and suppresses records, hidden links and undeclared create actions", () => {
    const extraTools: EndpointMeta[] = [
      {
        ...catalogItem,
        category: "billing",
        toolName: "fixture-create",
        aliases: [],
        path: ["fixture", "create"],
        method: "POST",
      },
      {
        ...catalogItem,
        category: "billing",
        toolName: "fixture-record",
        aliases: [],
        path: ["fixture", "[id]"],
      },
      {
        ...catalogItem,
        category: "billing",
        toolName: "fixture-sync",
        aliases: [],
        path: ["fixture", "sync"],
        method: "POST",
      },
      {
        ...catalogItem,
        category: "billing",
        toolName: "fixture-debug",
        aliases: [],
        path: ["fixture", "debug"],
      },
      {
        ...catalogItem,
        category: "billing",
        toolName: "fixture-hidden",
        aliases: [],
        admin: { hidden: true },
      },
    ];
    const landing = getAdminCategoryLandings(
      [category],
      [...operations, ...extraTools],
      "sk-SK",
    ).billing;
    expect(landing?.description).toBe(
      "Prehľad fakturácie a dodávateľských dokladov.",
    );
    expect(landing?.heading).toBe("Fakturácia");
    expect(landing?.actions.map(({ alias }) => alias)).toEqual([
      "fixture-create",
    ]);
    expect(landing?.destinations[0]?.description).toBe(
      "Skontrolujte doručené faktúry.",
    );
    expect(landing?.destinations.map(({ alias }) => alias)).toEqual([
      "fixture-bill",
      "fixture-admin",
    ]);
    expect(landing?.createActions.map(({ alias }) => alias)).toEqual([
      "fixture-create",
    ]);
    expect(landing?.automations.map(({ alias }) => alias)).toEqual([
      "fixture-sync",
    ]);
    expect(landing?.developerCount).toBe(1);
  });

  test("excludes destructive, actor-only and system tools from declared landing actions", () => {
    const hidden = {
      ...catalogItem,
      category: "billing",
      toolName: "fixture-automation",
      titleShort: "Automate",
      aliases: [],
      path: ["fixtures", "sync"],
      method: "POST",
    };
    const tools = [
      hidden,
      { ...hidden, toolName: "fixture-dev", path: ["fixtures", "debug"] },
      {
        ...hidden,
        toolName: "fixture-remove",
        path: ["fixtures", "remove"],
        method: "DELETE",
      },
      {
        ...hidden,
        toolName: "fixture-actor",
        path: ["fixtures", "create"],
        category: "accountSettings",
      },
    ];
    const landing = getAdminCategoryLandings(
      [
        {
          ...category,
          landing: { actions: tools.map(({ toolName }) => toolName) },
        },
      ],
      [...operations, ...tools],
    ).billing;
    expect(landing?.actions).toEqual([]);
  });
});
