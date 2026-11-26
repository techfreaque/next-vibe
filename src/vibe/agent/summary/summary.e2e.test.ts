import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe,expect } from "vitest";
import { z } from "zod";

import { allModelDefinitions } from "../models/all-models";
import { ModelUtility } from "../models/enum";
import definition from "./definition";

describe("AI workspace summary",()=>{
  const e2e=useE2E("ai/admin-summary");
  e2e.it("reports current catalog counts and aggregate activity without private conversation content",async({loginAs})=>{
    const admin=await resolveTestAdminUser();
    await loginAs(admin);
    const token=await createTestSessionToken(admin);
    expect(token.success).toBe(true);
    if(!token.success) return;
    const response=await atlasRequest(token.data).get("/api/"+E2E_LOCALE+"/vibe/agent/summary");
    expect(response.status).toBe(200);
    const {data}=z.object({success:z.literal(true),data:definition.GET.responseSchema}).parse(await response.json());
    const models=allModelDefinitions.filter(d=>!d.utilities.includes(ModelUtility.LEGACY));
    expect(data.summary.kpis.find(k=>k.label==="models")?.value).toBe(models.length);
    expect(data.summary.kpis.find(k=>k.label==="providers")?.value).toBe(new Set(models.flatMap(m=>m.providers.map(p=>p.apiProvider))).size);
    expect(data.summary.kpis.find(k=>k.label==="conversations")?.value).toBeGreaterThanOrEqual(0);
    expect(data.summary.recent).toHaveLength(0);
  });
});
