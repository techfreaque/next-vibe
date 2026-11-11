import { describe, expect, test } from "bun:test";

import { Platform } from "next-vibe/platforms/platforms";

import { keepsExplicitMediaModel } from "./media-generation";

describe("keepsExplicitMediaModel", () => {
  const isKnownModel = (model: string): boolean =>
    model === "real-model-id" || model === "another-real-id";

  test("AI caller keeps a known, deliberate model id", () => {
    expect(
      keepsExplicitMediaModel(Platform.AI, "real-model-id", isKnownModel),
    ).toBe(true);
  });

  test("MCP caller keeps a known, deliberate model id", () => {
    expect(
      keepsExplicitMediaModel(Platform.MCP, "another-real-id", isKnownModel),
    ).toBe(true);
  });

  test("AI caller with no model falls through to defaults", () => {
    expect(
      keepsExplicitMediaModel(Platform.AI, undefined, isKnownModel),
    ).toBe(false);
  });

  test("AI caller with a blank model falls through to defaults", () => {
    expect(keepsExplicitMediaModel(Platform.AI, "", isKnownModel)).toBe(false);
  });

  test("AI caller with an unknown placeholder id falls through to defaults", () => {
    expect(
      keepsExplicitMediaModel(Platform.AI, "stale-example-id", isKnownModel),
    ).toBe(false);
  });

  test("human CLI caller keeps any explicit id without model validation", () => {
    expect(
      keepsExplicitMediaModel(Platform.CLI, "anything-at-all", isKnownModel),
    ).toBe(true);
  });

  test("human CLI caller with no model falls through to defaults", () => {
    expect(
      keepsExplicitMediaModel(Platform.CLI, undefined, isKnownModel),
    ).toBe(false);
  });
});
