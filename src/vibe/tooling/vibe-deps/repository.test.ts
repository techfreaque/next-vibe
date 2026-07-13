/**
 * vibe-deps boundary classification unit tests.
 *
 * Pure-function coverage for the package-boundary logic that drives the
 * extraction lenses — getPackageOf (longest-root ownership) and
 * classifyEdgeByKey (out-of-package / cross-package / reverse-direction).
 */

import { describe, expect, it } from "bun:test";

import type { VibeDepsConfig } from "./config-types";
import { classifyEdgeByKey, getPackageOf } from "./repository";

const CONFIG: VibeDepsConfig = {
  packages: [
    { name: "vibe-core", roots: ["src/packages/vibe-core"] },
    {
      name: "vibe-ui",
      roots: ["src/packages/nvui/web", "src/packages/nvui/native"],
    },
    { name: "vibe-unified-ui", roots: ["src/packages/nvui/unified"] },
  ],
  allow: {
    "vibe-core": [],
    "vibe-ui": ["vibe-core"],
    "vibe-unified-ui": ["vibe-ui", "vibe-core"],
  },
  severity: {
    "out-of-package": "warn",
    "cross-package": "error",
    "reverse-direction": "error",
  },
};

const CORE = "src/packages/vibe-core/types.ts";
const UI = "src/packages/nvui/web/ui/button.tsx";
const UNIFIED = "src/packages/nvui/unified/form-fields/text/widget.tsx";
const APP = "src/user/auth/types.ts";

describe("getPackageOf", () => {
  it("maps files to their owning package", () => {
    expect(getPackageOf(CORE, CONFIG)).toBe("vibe-core");
    expect(getPackageOf(UI, CONFIG)).toBe("vibe-ui");
    expect(getPackageOf(UNIFIED, CONFIG)).toBe("vibe-unified-ui");
  });

  it("returns 'app' for non-package files", () => {
    expect(getPackageOf(APP, CONFIG)).toBe("app");
  });

  it("prefers the longest matching root (unified is not swallowed by a shorter prefix)", () => {
    // unified root is longer-specific than any ui root; ensure no mis-match.
    expect(getPackageOf(UNIFIED, CONFIG)).toBe("vibe-unified-ui");
  });
});

describe("classifyEdgeByKey", () => {
  it("flags a package importing ordinary app code as out-of-package", () => {
    expect(classifyEdgeByKey(UI, APP, CONFIG)).toBe("out-of-package");
    expect(classifyEdgeByKey(UNIFIED, APP, CONFIG)).toBe("out-of-package");
  });

  it("allows the legal layer direction", () => {
    expect(classifyEdgeByKey(UI, CORE, CONFIG)).toBeNull(); // ui → core
    expect(classifyEdgeByKey(UNIFIED, UI, CONFIG)).toBeNull(); // unified → ui
    expect(classifyEdgeByKey(UNIFIED, CORE, CONFIG)).toBeNull(); // unified → core
  });

  it("flags reverse-direction edges (lower layer importing higher)", () => {
    expect(classifyEdgeByKey(CORE, UI, CONFIG)).toBe("reverse-direction"); // core → ui
    expect(classifyEdgeByKey(UI, UNIFIED, CONFIG)).toBe("reverse-direction"); // ui → unified
  });

  it("ignores intra-package and app↔app edges", () => {
    const UI2 = "src/packages/nvui/web/ui/badge.tsx";
    const APP2 = "src/user/profile/repository.ts";
    expect(classifyEdgeByKey(UI, UI2, CONFIG)).toBeNull();
    expect(classifyEdgeByKey(APP, APP2, CONFIG)).toBeNull();
  });

  it("does not flag app importing a package", () => {
    // App consuming a package is fine — only edges leaving a package matter.
    expect(classifyEdgeByKey(APP, UI, CONFIG)).toBeNull();
  });
});
