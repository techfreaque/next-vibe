import { describe, expect, it } from "bun:test";

import { pickSkillVariant } from "./pick-variant";

const variants = [
  { id: "native-image", isDefault: false },
  { id: "budget", isDefault: true },
];

describe("pickSkillVariant", () => {
  it("returns the named variant", () => {
    expect(pickSkillVariant(variants, "native-image")?.id).toBe("native-image");
  });

  it("falls back to the default variant when none is named", () => {
    expect(pickSkillVariant(variants, null)?.id).toBe("budget");
  });

  it("falls back to the default variant for a removed variant id", () => {
    expect(pickSkillVariant(variants, "kimi")?.id).toBe("budget");
  });

  it("falls back to the first variant when none is default", () => {
    expect(pickSkillVariant([{ id: "a" }, { id: "b" }], "gone")?.id).toBe("a");
  });

  it("returns null without variants", () => {
    expect(pickSkillVariant([], "budget")).toBeNull();
    expect(pickSkillVariant(undefined, "budget")).toBeNull();
  });
});
