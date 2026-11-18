import { describe, expect, it } from "bun:test";
import { Environment } from "next-vibe/env/env-util";

import { ADRIAN_RECORDING_ID, getDesignSamples } from "./design-samples";
import { getSkillSamples } from "./samples";
import { selectSkillPageDesign } from "./design-selection";

describe("skill landing design switch", () => {
  it("only enables named designs in development", () => {
    for (const design of ["A", "B", "C"]) {
      expect(selectSkillPageDesign(Environment.DEVELOPMENT, design)).toBe(design);
      expect(selectSkillPageDesign(Environment.PRODUCTION, design)).toBeNull();
      expect(selectSkillPageDesign(Environment.TEST, design)).toBeNull();
    }
    expect(selectSkillPageDesign(Environment.DEVELOPMENT, undefined)).toBeNull();
    expect(selectSkillPageDesign(Environment.DEVELOPMENT, "toString")).toBeNull();
  });
});

describe("landing page recordings", () => {
  it("only attributes a recording to its original skill and model", () => {
    expect(getDesignSamples(ADRIAN_RECORDING_ID, "Kimi K3", "fr-FR")[0]?.prompt).toContain("café");
    expect(getDesignSamples("adrian", "Kimi K3", "en-US")).toEqual([]);
    expect(getDesignSamples(ADRIAN_RECORDING_ID, "another model", "en-US")).toEqual([]);
    expect(getDesignSamples(null, null, "en-US")).toEqual([]);
    expect(getSkillSamples("thea", "en-US", "Kimi K3")?.length).toBeGreaterThan(0);
    expect(getSkillSamples("thea", "en-US", "another model")).toBeNull();
  });
});
