import { describe, expect, test } from "bun:test";

import {
  copyCatalogSearchParams,
  parseToolsInitialState,
  readEndpointSearchParams,
} from "@/_pages/tools/initial-state";

import type { EndpointMeta } from "../../core/definition/endpoints-meta";
import type { JwtPayloadType } from "../../identity/auth/types";
import { PlatformMarker, UserPermissionRole } from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";
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

  test("uses preferred names or secondary aliases for authorized GET record destinations", () => {
    expect(
      getRecordSearchTargets(
        ["billing-documents", "invoice-list", "invoice-send", "missing"].map(
          (alias) => ({ recordSearch: { alias, field: "search" } }),
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
