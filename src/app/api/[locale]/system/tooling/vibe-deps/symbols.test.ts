/**
 * Symbol extraction + usage unit tests for vibe deps.
 *
 * Locks the parsing of exported symbols + static methods and the usage index that
 * drives unused-public-surface detection.
 */

import { describe, expect, it } from "bun:test";

import {
  buildUsageIndex,
  extractSymbols,
  type SymbolDef,
  usageFor,
} from "./symbols";

const REPO_SRC = `
import "server-only";

export class WidgetRepository {
  static async execute(): Promise<void> {}
  static async helperUsed(): Promise<void> {}
  private static internalThing(): void {}
}

export function topLevelFn(): void {}
export const SOME_CONST = 42;
export type SomeType = { a: number };
`;

const CALLER_SRC = `
import { WidgetRepository } from "./repo";
WidgetRepository.execute();
WidgetRepository.helperUsed();
topLevelFn();
`;

describe("extractSymbols", () => {
  const syms = extractSymbols("src/x/repo.ts", REPO_SRC);

  it("extracts exported class/function/const/type", () => {
    const byName = new Map(syms.map((s) => [s.name, s.kind]));
    expect(byName.get("WidgetRepository")).toBe("class");
    expect(byName.get("topLevelFn")).toBe("function");
    expect(byName.get("SOME_CONST")).toBe("const");
    expect(byName.get("SomeType")).toBe("type");
  });

  it("extracts PUBLIC static methods with their owning class (skips private)", () => {
    const statics = syms.filter((s) => s.kind === "static-method");
    const names = statics.map((s) => s.name).toSorted();
    // `internalThing` is `private static` — not cross-file public surface, so
    // it is intentionally excluded (a private static can never be "dead public").
    expect(names).toEqual(["execute", "helperUsed"]);
    expect(statics.every((s) => s.owner === "WidgetRepository")).toBe(true);
  });

  it("does not emit a static method for the constructor", () => {
    expect(syms.some((s) => s.name === "constructor")).toBe(false);
  });
});

describe("usageFor", () => {
  const sources = new Map([
    ["src/x/repo.ts", REPO_SRC],
    ["src/y/caller.ts", CALLER_SRC],
  ]);
  const index = buildUsageIndex(sources);
  const syms = extractSymbols("src/x/repo.ts", REPO_SRC);
  const find = (name: string): SymbolDef =>
    syms.find((s) => s.name === name)!;

  it("counts a used static method via Owner.method", () => {
    expect(usageFor(find("execute"), index).usageCount).toBe(1);
    expect(usageFor(find("helperUsed"), index).usageCount).toBe(1);
  });

  it("counts a used top-level function, excluding its own file", () => {
    expect(usageFor(find("topLevelFn"), index).usageCount).toBe(1);
  });

  it("reports unused const/type as zero", () => {
    expect(usageFor(find("SOME_CONST"), index).usageCount).toBe(0);
    expect(usageFor(find("SomeType"), index).usageCount).toBe(0);
  });

  it("treats a static method reached via a DYNAMIC class ref as used", () => {
    // A class pulled off a module object (`mod.WidgetRepository`) then called
    // (`.execute()`) never writes the literal `WidgetRepository.execute`, so the
    // member scan alone would miss it. dynamicClassRefs must keep it alive.
    const dynSources = new Map([
      ["src/x/repo.ts", REPO_SRC],
      [
        "src/y/dynamic.ts",
        `const mod = await import("./repo");\n` +
          `const R = mod.WidgetRepository;\n` +
          `await R.execute();\n`,
      ],
    ]);
    const dynIndex = buildUsageIndex(dynSources);
    expect(dynIndex.dynamicClassRefs.has("WidgetRepository")).toBe(true);
    // Even helperUsed — not called by qualified name in dynamic.ts — is treated
    // as reachable because its owning class is dynamically referenced.
    expect(usageFor(find("helperUsed"), dynIndex).usageCount).toBeGreaterThan(0);
  });
});
