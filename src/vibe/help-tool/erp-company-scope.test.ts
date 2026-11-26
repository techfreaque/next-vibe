import { describe, expect, it } from "vitest";

import companySubscriptions from "@/subscription/company/[companyId]/list/definition";
import productCreate from "@/products/catalog/create/definition";
import productList from "@/products/catalog/list/definition";
import report from "@/chart-of-accounts/reports/receivables-aging/definition";
import { resolveWorkspaceCompany } from "@/companies/_shared/workspace-company";

import { applyWorkspaceCompany, readWorkspaceCompanyOverride } from "./erp-company-scope";

const currentId = "00000000-0000-4000-8000-000000000001";
const savedId = "00000000-0000-4000-8000-000000000002";

describe("ERP workspace scope", () => {
  it("merges company defaults into nested request data and company paths", () => {
    const filter = applyWorkspaceCompany(productList.GET, { data: { filters: { search: "studio" } } }, currentId);
    expect(filter.data).toEqual({ filters: { companyId: currentId, search: "studio" } });
    const draft = applyWorkspaceCompany(productCreate.POST, { data: { details: { name: "Sample" } } }, currentId);
    expect(draft.data).toEqual({ details: { companyId: currentId, name: "Sample" } });
    expect(applyWorkspaceCompany(companySubscriptions.GET, {}, currentId).urlPathParams)
      .toEqual({ companyId: currentId });
  });

  it("preserves explicit record-company links and ignores stale saved defaults", () => {
    const inputs = { data: { companyId: savedId } };
    expect(applyWorkspaceCompany(report.GET, inputs, currentId)).toBe(inputs);
    expect(readWorkspaceCompanyOverride(report.GET, inputs)).toBe(savedId);
    const companies = [
      { id: currentId, name: "Demo Company", currency: "EUR" },
      { id: savedId, name: "Studio Two", currency: "EUR" },
    ];
    expect(resolveWorkspaceCompany(companies, savedId)?.id).toBe(savedId);
    expect(resolveWorkspaceCompany(companies, "former-company")?.id).toBe(currentId);
    expect(resolveWorkspaceCompany([], savedId)).toBeUndefined();
  });
});
