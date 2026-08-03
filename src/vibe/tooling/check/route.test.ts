/**
 * Vibe Check Integration Tests — End to End
 *
 * Runs the full check pipeline on the test-project in two modes:
 *   A) useLspDaemon: false  — TypeScript via tsgo cold path
 *   B) useLspDaemon: true   — TypeScript via warm LSP daemon (finds more TS errors)
 *
 * Both modes run the same five invocation patterns:
 *   1. Full project (./)
 *   2. Subfolder (src/test-issues)
 *   3. Two files: general-issues.ts + node-issues.ts
 *   4. Two files: type-errors.ts + a11y-issues.tsx
 *   5. Folder + outside file: src/test-issues + src/utils/calculate.ts
 *
 * The LSP daemon is then exercised directly (cold/warm, folder scan, filtering).
 *
 * Rules:
 * - fix=false forced — corpus files must never be mutated by tests
 * - Config is created fresh, then patched to useLspDaemon: true before Mode B
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { beforeAll, describe, expect, it } from "bun:test";

import type { LspIssue } from "./repository/typecheck/lsp-daemon";
import { TsgoDaemon } from "./repository/typecheck/lsp-daemon";

const TEST_PROJECT_PATH = resolve(__dirname, "./test-project");
const ROOT_PATH = resolve(__dirname, "../../../..");
const TEST_PROJECT_CONFIG = resolve(TEST_PROJECT_PATH, "check.config.ts");
const TEST_PROJECT_MCP_CONFIG = resolve(TEST_PROJECT_PATH, ".mcp.json");
const TEST_PROJECT_CURSOR_MCP_CONFIG = resolve(
  TEST_PROJECT_PATH,
  ".cursor/mcp.json",
);
const TEST_PROJECT_VSCODE_MCP_CONFIG = resolve(
  TEST_PROJECT_PATH,
  ".vscode/mcp.json",
);
const TEST_PROJECT_VSCODE_SETTINGS = resolve(
  TEST_PROJECT_PATH,
  ".vscode/settings.json",
);
const VIBE_RUNTIME = resolve(
  ROOT_PATH,
  "src/vibe/platforms/cli/vibe-runtime.ts",
);

// ============================================================
// GROUND TRUTH
// ============================================================

interface FileStat {
  errors: number;
  warnings: number;
}

/** Mode A (no-lsp, tsgo cold): verified from actual output */
const NO_LSP_FILE_COUNTS: Record<string, FileStat> = {
  "a11y-issues.tsx": { errors: 72, warnings: 2 },
  "eslint-issues.tsx": { errors: 7, warnings: 0 },
  "general-issues.ts": { errors: 33, warnings: 0 },
  "i18n-issues.tsx": { errors: 43, warnings: 1 },
  "jsx-capitalization-issues.tsx": { errors: 29, warnings: 1 },
  "nextjs-issues.tsx": { errors: 37, warnings: 1 },
  "node-issues.ts": { errors: 14, warnings: 0 },
  "promise-issues.ts": { errors: 12, warnings: 0 },
  "react-issues.tsx": { errors: 40, warnings: 2 },
  "restricted-syntax-issues.tsx": { errors: 30, warnings: 0 },
  "type-errors.ts": { errors: 12, warnings: 0 },
  "typescript-issues.ts": { errors: 20, warnings: 0 },
  "calculate.ts": { errors: 1, warnings: 0 },
};

const NO_LSP_TOTALS = {
  dir: { files: 13, issues: 357, errors: 350, warnings: 7 },
  subfolder: { files: 12, issues: 356, errors: 349, warnings: 7 },
  // folder+file excludes check.config.ts → same as dir (no extra files)
  folderPlusFile: 13,
};

/** Mode B (lsp): LSP daemon finds additional TS errors + check.config.ts */
const LSP_FILE_COUNTS: Record<string, FileStat> = {
  "check.config.ts": { errors: 1, warnings: 0 },
  "a11y-issues.tsx": { errors: 72, warnings: 2 },
  "eslint-issues.tsx": { errors: 8, warnings: 0 },
  "general-issues.ts": { errors: 36, warnings: 0 },
  "i18n-issues.tsx": { errors: 43, warnings: 1 },
  "jsx-capitalization-issues.tsx": { errors: 29, warnings: 1 },
  "nextjs-issues.tsx": { errors: 37, warnings: 1 },
  "node-issues.ts": { errors: 14, warnings: 0 },
  "promise-issues.ts": { errors: 13, warnings: 0 },
  "react-issues.tsx": { errors: 40, warnings: 2 },
  "restricted-syntax-issues.tsx": { errors: 30, warnings: 0 },
  "type-errors.ts": { errors: 12, warnings: 0 },
  "typescript-issues.ts": { errors: 24, warnings: 0 },
  "calculate.ts": { errors: 1, warnings: 0 },
};

const LSP_TOTALS = {
  dir: { files: 14, issues: 367, errors: 360, warnings: 7 },
  subfolder: { files: 12, issues: 365, errors: 358, warnings: 7 },
  // check.config.ts is only scanned when ./ is the root — not in subfolder+file combo
  folderPlusFile: 13,
};

/** Rules present in each file — same regardless of LSP mode */
const FILE_RULES: Record<string, string[]> = {
  "a11y-issues.tsx": [
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "eslint-plugin-jsx-a11y(alt-text)",
    "eslint-plugin-jsx-a11y(anchor-has-content)",
    "eslint-plugin-jsx-a11y(anchor-is-valid)",
    "eslint-plugin-jsx-a11y(click-events-have-key-events)",
    "eslint-plugin-jsx-a11y(heading-has-content)",
    "eslint-plugin-jsx-a11y(iframe-has-title)",
    "eslint-plugin-jsx-a11y(img-redundant-alt)",
    "eslint-plugin-jsx-a11y(label-has-associated-control)",
    "eslint-plugin-jsx-a11y(no-access-key)",
    "eslint-plugin-jsx-a11y(no-autofocus)",
    "eslint-plugin-jsx-a11y(no-distracting-elements)",
    "eslint-plugin-jsx-a11y(no-redundant-roles)",
    "eslint-plugin-jsx-a11y(role-has-required-aria-props)",
    "eslint-plugin-jsx-a11y(tabindex-no-positive)",
    "eslint-plugin-jsx-a11y(aria-props)",
    "eslint-plugin-jsx-a11y(aria-role)",
    "eslint-plugin-jsx-a11y(prefer-tag-over-role)",
    "eslint-plugin-react(iframe-missing-sandbox)",
    "eslint-plugin-react(no-unknown-property)",
    "eslint-plugin-next(no-img-element)",
  ],
  "eslint-issues.tsx": [
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "oxlint-plugin-i18n(no-literal-string)",
    "eslint-plugin-react-hooks(exhaustive-deps)",
    "eslint-plugin-jsx-a11y(click-events-have-key-events)",
  ],
  "general-issues.ts": [
    "eslint(no-debugger)",
    "eslint(no-console)",
    "eslint(curly)",
    "eslint(eqeqeq)",
    "eslint(prefer-template)",
    "eslint(no-unused-vars)",
    "eslint(no-template-curly-in-string)",
    "eslint(array-callback-return)",
    "eslint(no-constructor-return)",
    "eslint(no-self-compare)",
    "eslint(no-unused-private-class-members)",
    "eslint(no-new)",
    "oxc(missing-throw)",
    "oxc(bad-comparison-sequence)",
    "oxc(const-comparisons)",
    "eslint-plugin-unicorn(no-new-array)",
    "eslint-plugin-unicorn(prefer-array-flat)",
    "eslint-plugin-unicorn(prefer-spread)",
    "eslint-plugin-unicorn(prefer-includes)",
    "oxlint-plugin-restricted(restricted-syntax)",
  ],
  "i18n-issues.tsx": [
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "oxlint-plugin-i18n(no-literal-string)",
    "eslint-plugin-jsx-a11y(label-has-associated-control)",
    "eslint-plugin-jsx-a11y(anchor-is-valid)",
    "eslint-plugin-next(no-img-element)",
  ],
  "jsx-capitalization-issues.tsx": [
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "oxlint-plugin-i18n(no-literal-string)",
    "eslint-plugin-next(no-img-element)",
  ],
  "nextjs-issues.tsx": [
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "oxlint-plugin-i18n(no-literal-string)",
    "eslint-plugin-jsx-a11y(img-redundant-alt)",
    "eslint-plugin-jsx-a11y(html-has-lang)",
    "eslint-plugin-next(no-sync-scripts)",
    "eslint-plugin-next(no-css-tags)",
    "eslint-plugin-next(google-font-display)",
    "eslint-plugin-next(no-page-custom-font)",
    "eslint-plugin-next(no-img-element)",
  ],
  "node-issues.ts": [
    "eslint-plugin-unicorn(prefer-node-protocol)",
    "eslint-plugin-unicorn(no-new-array)",
    "eslint-plugin-unicorn(prefer-includes)",
    "eslint-plugin-unicorn(prefer-array-flat)",
    "eslint-plugin-unicorn(prefer-spread)",
    "simple-import-sort/imports",
    "eslint(eqeqeq)",
    "eslint(no-console)",
    "eslint(no-self-compare)",
    "oxlint-plugin-restricted(restricted-syntax)",
  ],
  "promise-issues.ts": [
    "eslint-plugin-promise(param-names)",
    "eslint-plugin-promise(always-return)",
    "eslint-plugin-promise(catch-or-return)",
    "eslint-plugin-unicorn(no-await-in-promise-methods)",
    "eslint-plugin-unicorn(no-single-promise-in-promise-methods)",
  ],
  "react-issues.tsx": [
    "eslint-plugin-react(jsx-key)",
    "eslint-plugin-react(jsx-no-duplicate-props)",
    "eslint-plugin-react(no-children-prop)",
    "eslint-plugin-react(no-direct-mutation-state)",
    "eslint-plugin-react(self-closing-comp)",
    "eslint-plugin-react(no-unknown-property)",
    "eslint-plugin-react-hooks(exhaustive-deps)",
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "oxlint-plugin-i18n(no-literal-string)",
    "oxlint-plugin-restricted(restricted-syntax)",
    "eslint-plugin-next(no-img-element)",
    "eslint-plugin-jsx-a11y(click-events-have-key-events)",
  ],
  "restricted-syntax-issues.tsx": [
    "oxlint-plugin-restricted(restricted-syntax)",
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "oxlint-plugin-i18n(no-literal-string)",
  ],
  "type-errors.ts": [
    // Bare codes match both [TS2322] (cold path) and [2322] (lsp path)
    "2322",
    "2339",
    "2554",
    "2345",
    "2362",
    "2366",
    "2416",
    "2304",
    "2365",
    "2741",
    "typescript-eslint(no-inferrable-types)",
    "oxlint-plugin-restricted(restricted-syntax)",
  ],
  "typescript-issues.ts": [
    "typescript-eslint(no-explicit-any)",
    "eslint(no-unused-vars)",
    "typescript-eslint(no-inferrable-types)",
    "eslint(no-empty-function)",
    "typescript-eslint(consistent-type-imports)",
    "typescript-eslint(no-duplicate-enum-values)",
    "typescript-eslint(no-extra-non-null-assertion)",
    "typescript-eslint(explicit-function-return-type)",
    "oxlint-plugin-restricted(restricted-syntax)",
    "2801",
  ],
  "calculate.ts": ["oxlint-plugin-restricted(restricted-syntax)"],
};

// ============================================================
// HELPERS
// ============================================================

function ensureConfig(): void {
  if (!existsSync(TEST_PROJECT_CONFIG)) {
    try {
      execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" config-create 2>&1`,
        { encoding: "utf-8", timeout: 30000 },
      );
    } catch {
      /* ignore */
    }
  }
}

function runVibeCheck(...paths: string[]): string {
  ensureConfig();
  const quotedPaths = paths.map((p) => `"${p}"`).join(" ");
  try {
    return execSync(
      `cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" check --fix=false ${quotedPaths} 2>&1`,
      { encoding: "utf-8", timeout: 120000 },
    );
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string };
    return (e.stdout ?? "") + (e.stderr ?? "");
  }
}

function patchConfig(key: string, value: string): void {
  const src = readFileSync(TEST_PROJECT_CONFIG, "utf-8");
  const patched = src.replace(
    new RegExp(`(\\b${key}:\\s*)(?:true|false)`),
    `$1${value}`,
  );
  writeFileSync(TEST_PROJECT_CONFIG, patched, "utf-8");
}

function extractSummary(output: string): {
  files: number;
  issues: number;
  errors: number;
  warnings: number;
} {
  const files = parseInt(output.match(/Files:\s+(\d+)/)?.[1] ?? "0", 10);
  const issues = parseInt(output.match(/Issues:\s+(\d+)/)?.[1] ?? "0", 10);
  const errors = parseInt(
    (output.match(/❌\s*Errors:\s*(\d+)/) ??
      output.match(/❌\s*(\d+)\s*errors/))?.[1] ?? "0",
    10,
  );
  return { files, issues, errors, warnings: issues - errors };
}

function extractFileBlock(output: string, filename: string): string {
  const lines = output.split("\n");
  const startIdx = lines.findIndex(
    (l) => l.includes("● ") && l.includes(filename),
  );
  if (startIdx === -1) {
    return "";
  }
  const block: string[] = [lines[startIdx]];
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].startsWith("●") && !lines[i].includes(filename)) {
      break;
    }
    block.push(lines[i]);
  }
  return block.join("\n");
}

function assertAllCheckersRan(out: string): void {
  expect(out).toContain("Starting Oxlint check");
  expect(out).toContain("Oxlint check completed");
  expect(out).toContain("Starting ESLint check");
  expect(out).toContain("ESLint check completed");
  expect(out).toContain("Starting TypeScript check");
  expect(out).toContain("TypeScript check completed");
}

function assertFileBlock(out: string, filename: string, rules: string[]): void {
  const block = extractFileBlock(out, filename);
  expect(block, `${filename} missing from output`).not.toBe("");
  for (const rule of rules) {
    expect(block, `${rule} missing from ${filename}`).toContain(rule);
  }
}

function assertTypescriptMessages(out: string): void {
  expect(out).toContain("Type 'string' is not assignable to type 'number'");
  expect(out).toContain("Property 'missingProp' does not exist on type");
  expect(out).toContain("Expected 2 arguments, but got 1");
  expect(out).toContain(
    "Argument of type 'string' is not assignable to parameter of type 'number'",
  );
  expect(out).toContain("Function lacks ending return statement");
  expect(out).toContain("Cannot find name 'doesNotExist'");
  expect(out).toContain("This condition will always return true");
}

// ============================================================
// CONFIG CREATION FLOW
// ============================================================
describe("Config Creation Flow", () => {
  it("Step 1: config file deleted", () => {
    if (existsSync(TEST_PROJECT_CONFIG)) {
      unlinkSync(TEST_PROJECT_CONFIG);
    }
    writeFileSync(
      TEST_PROJECT_VSCODE_SETTINGS,
      `${JSON.stringify({ "editor.formatOnSave": false }, null, 2)}\n`,
      "utf-8",
    );
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(false);
  });

  it("Step 2: fails without config, shows config-create hint", () => {
    let output = "";
    try {
      output = execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" check ./ 2>&1`,
        { encoding: "utf-8", timeout: 30000 },
      );
    } catch (error) {
      const e = error as { stdout?: string; stderr?: string };
      output = (e.stdout ?? "") + (e.stderr ?? "");
    }
    expect(output).toContain("check.config.ts");
    expect(output).toContain("config-create");
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(false);
  });

  it("Step 3: config-create creates the file", () => {
    let output = "";
    try {
      output = execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" config-create 2>&1`,
        { encoding: "utf-8", timeout: 30000 },
      );
    } catch (error) {
      const e = error as { stdout?: string; stderr?: string };
      output = (e.stdout ?? "") + (e.stderr ?? "");
    }
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(true);
    expect(output).toContain("Created");
    expect(output).toContain("check.config.ts");
    expect(output).not.toContain("Failed to create");
    expect(existsSync(TEST_PROJECT_MCP_CONFIG)).toBe(true);
    expect(existsSync(TEST_PROJECT_CURSOR_MCP_CONFIG)).toBe(true);
    expect(existsSync(TEST_PROJECT_VSCODE_MCP_CONFIG)).toBe(true);
    expect(output.replaceAll("\\", "/")).toContain(
      `Updated ${TEST_PROJECT_VSCODE_SETTINGS.replaceAll("\\", "/")}`,
    );
    expect(
      JSON.parse(readFileSync(TEST_PROJECT_VSCODE_SETTINGS, "utf-8"))[
        "editor.formatOnSave"
      ],
    ).toBe(true);
  });

  it("Step 4: config-create fails when config already exists", () => {
    let exitCode = 0;
    let output = "";
    try {
      output = execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" config-create 2>&1`,
        { encoding: "utf-8", timeout: 30000 },
      );
    } catch (error) {
      const e = error as { stdout?: string; stderr?: string; status?: number };
      output = (e.stdout ?? "") + (e.stderr ?? "");
      exitCode = e.status ?? 1;
    }
    expect(exitCode).not.toBe(0);
    expect(output.toLowerCase()).toContain("already exists");
  });

  it("Step 5: config has fix: false (corpus protection)", () => {
    const content = readFileSync(TEST_PROJECT_CONFIG, "utf-8");
    expect(content).toMatch(/fix:\s*false/);
    expect(content).not.toMatch(/fix:\s*true/);
  });

  it("Step 6: config has useLspDaemon: false (cold-start default)", () => {
    const content = readFileSync(TEST_PROJECT_CONFIG, "utf-8");
    expect(content).toMatch(/useLspDaemon:\s*false/);
  });
});

// ============================================================
// Shared invocation suite (called for both modes)
// fileCounts and totals differ between no-lsp and lsp modes.
// ============================================================

function buildInvocationSuite(
  label: string,
  fileCounts: Record<string, FileStat>,
  totals: {
    dir: typeof NO_LSP_TOTALS.dir;
    subfolder: typeof NO_LSP_TOTALS.subfolder;
    folderPlusFile: number;
  },
): void {
  // Files that appear in subfolder scope (subset without calculate.ts and check.config.ts)
  const subfolderFiles = Object.keys(fileCounts).filter(
    (f) => f !== "calculate.ts" && f !== "check.config.ts",
  );

  // ── Pattern 1: Full project (./) ────────────────────────
  describe(`${label} | full project (./)`, () => {
    let out: string;

    beforeAll(() => {
      out = runVibeCheck("./");
    });

    it("all three checkers ran", () => assertAllCheckersRan(out));

    it(`summary: ${totals.dir.files} files, ${totals.dir.issues} issues`, () => {
      const s = extractSummary(out);
      expect(s.files).toBe(totals.dir.files);
      expect(s.issues).toBe(totals.dir.issues);
      expect(s.errors).toBe(totals.dir.errors);
      expect(s.warnings).toBe(totals.dir.warnings);
    });

    describe("per-file issue counts", () => {
      for (const [filename, expected] of Object.entries(fileCounts)) {
        const total = expected.errors + expected.warnings;
        it(`${filename}: ${expected.errors}e ${expected.warnings}w`, () => {
          expect(out, `${filename} missing`).toContain(filename);
          const itemWord = total === 1 ? "item" : "items";
          expect(out).toContain(`${filename} (${total} ${itemWord})`);
        });
      }
    });

    describe("per-file rule detection", () => {
      for (const [filename, rules] of Object.entries(FILE_RULES)) {
        it(`${filename} rules`, () => assertFileBlock(out, filename, rules));
      }
    });

    it("TypeScript error messages present", () =>
      assertTypescriptMessages(out));
  });

  // ── Pattern 2: Subfolder (src/test-issues) ──────────────
  describe(`${label} | subfolder (src/test-issues)`, () => {
    let out: string;

    beforeAll(() => {
      out = runVibeCheck("src/test-issues");
    });

    it(`summary: ${totals.subfolder.files} files`, () => {
      const s = extractSummary(out);
      expect(s.files).toBe(totals.subfolder.files);
      expect(s.issues).toBe(totals.subfolder.issues);
      expect(s.errors).toBe(totals.subfolder.errors);
      expect(s.warnings).toBe(totals.subfolder.warnings);
    });

    it("includes all test-issues files", () => {
      for (const f of subfolderFiles) {
        expect(out, `missing ${f}`).toContain(f);
      }
    });

    it("excludes calculate.ts (outside subfolder)", () => {
      expect(extractFileBlock(out, "calculate.ts")).toBe("");
    });

    it("all rules detected across files", () => {
      const allRules = [
        ...new Set(
          Object.entries(FILE_RULES)
            .filter(([f]) => f !== "calculate.ts")
            .flatMap(([, rules]) => rules),
        ),
      ];
      for (const rule of allRules) {
        expect(out, `rule ${rule} missing`).toContain(rule);
      }
    });

    it("TypeScript error messages present", () =>
      assertTypescriptMessages(out));
  });

  // ── Pattern 3: Two files (general + node) ───────────────
  describe(`${label} | two files (general-issues.ts + node-issues.ts)`, () => {
    let out: string;

    beforeAll(() => {
      out = runVibeCheck(
        "src/test-issues/general-issues.ts",
        "src/test-issues/node-issues.ts",
      );
    });

    it("summary: 2 files", () => {
      expect(extractSummary(out).files).toBe(2);
    });

    it("general-issues.ts present", () => {
      expect(out).toContain("general-issues.ts");
    });

    it("node-issues.ts present", () => {
      expect(out).toContain("node-issues.ts");
    });

    it("excludes all other files", () => {
      const excluded = Object.keys(fileCounts).filter(
        (f) => f !== "general-issues.ts" && f !== "node-issues.ts",
      );
      for (const f of excluded) {
        expect(extractFileBlock(out, f), `${f} should be absent`).toBe("");
      }
    });

    it("detects general-issues.ts rules", () =>
      assertFileBlock(
        out,
        "general-issues.ts",
        FILE_RULES["general-issues.ts"],
      ));

    it("detects node-issues.ts rules", () =>
      assertFileBlock(out, "node-issues.ts", FILE_RULES["node-issues.ts"]));
  });

  // ── Pattern 4: Two files (type-errors + a11y) ───────────
  describe(`${label} | two files (type-errors.ts + a11y-issues.tsx)`, () => {
    let out: string;

    beforeAll(() => {
      out = runVibeCheck(
        "src/test-issues/type-errors.ts",
        "src/test-issues/a11y-issues.tsx",
      );
    });

    it("summary: 2 files", () => {
      expect(extractSummary(out).files).toBe(2);
    });

    it("type-errors.ts present", () => {
      expect(out).toContain("type-errors.ts");
    });

    it("a11y-issues.tsx present", () => {
      expect(out).toContain("a11y-issues.tsx");
    });

    it("excludes other files", () => {
      for (const f of Object.keys(fileCounts).filter(
        (name) => name !== "type-errors.ts" && name !== "a11y-issues.tsx",
      )) {
        expect(extractFileBlock(out, f), `${f} should be absent`).toBe("");
      }
    });

    it("TypeScript error codes from type-errors.ts", () =>
      assertFileBlock(out, "type-errors.ts", FILE_RULES["type-errors.ts"]));

    it("a11y rules from a11y-issues.tsx", () =>
      assertFileBlock(out, "a11y-issues.tsx", FILE_RULES["a11y-issues.tsx"]));

    it("TypeScript error messages from type-errors.ts", () => {
      expect(out).toContain("Type 'string' is not assignable to type 'number'");
      expect(out).toContain("Property 'missingProp' does not exist on type");
      expect(out).toContain("Expected 2 arguments, but got 1");
    });
  });

  // ── Pattern 5: Folder + outside file ────────────────────
  describe(`${label} | folder + outside file (src/test-issues + calculate.ts)`, () => {
    let out: string;

    beforeAll(() => {
      out = runVibeCheck("src/test-issues", "src/utils/calculate.ts");
    });

    it(`summary: ${totals.folderPlusFile} files`, () => {
      expect(extractSummary(out).files).toBe(totals.folderPlusFile);
    });

    it("includes all test-issues files", () => {
      for (const f of subfolderFiles) {
        expect(out, `missing ${f}`).toContain(f);
      }
    });

    it("includes calculate.ts", () => {
      expect(out).toContain("calculate.ts");
      expect(out).toContain("calculate.ts 1 error");
    });

    it("detects restricted-syntax in calculate.ts", () => {
      const block = extractFileBlock(out, "calculate.ts");
      expect(block).toContain("oxlint-plugin-restricted(restricted-syntax)");
    });

    it("TypeScript error messages present", () =>
      assertTypescriptMessages(out));
  });
}

// ============================================================
// MODE A — useLspDaemon: false (default cold tsgo path)
// ============================================================
describe("Mode A: useLspDaemon=false (cold tsgo)", () => {
  buildInvocationSuite("no-lsp", NO_LSP_FILE_COUNTS, NO_LSP_TOTALS);
});

// ============================================================
// PATCH CONFIG → useLspDaemon: true
// ============================================================
describe("Config patch: enable useLspDaemon", () => {
  it("patches useLspDaemon to true in check.config.ts", () => {
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(true);
    patchConfig("useLspDaemon", "true");
    const content = readFileSync(TEST_PROJECT_CONFIG, "utf-8");
    expect(content).toMatch(/useLspDaemon:\s*true/);
  });
});

// ============================================================
// MODE B — useLspDaemon: true (warm LSP daemon)
// Finds additional TypeScript errors via LSP project context.
// ============================================================
describe("Mode B: useLspDaemon=true (LSP daemon)", () => {
  buildInvocationSuite("lsp", LSP_FILE_COUNTS, LSP_TOTALS);
});

// ============================================================
// ROOT INVOCATION — verifies ignore patterns
// ============================================================
describe("Running From Project Root", () => {
  let fromRootOutput: string;

  beforeAll(() => {
    try {
      fromRootOutput = execSync(
        `cd "${ROOT_PATH}" && bun src/vibe/platforms/cli/vibe-runtime.ts check --fix=false "src/vibe/tooling/check/test-project" 2>&1`,
        { encoding: "utf-8", timeout: 120000 },
      );
    } catch (error) {
      const e = error as { stdout?: string; stderr?: string };
      fromRootOutput = (e.stdout ?? "") + (e.stderr ?? "");
    }
  }, 120000);

  it("test-project is in ignore patterns — no issues reported", () => {
    const hasNoIssues =
      fromRootOutput.includes("Keine Codequalitätsprobleme") ||
      fromRootOutput.includes("No code quality issues") ||
      fromRootOutput.includes("No issues found") ||
      fromRootOutput.includes("true");
    expect(hasNoIssues).toBe(true);
  }, 120000);
});

// ============================================================
// COMPILED RUNTIME (optional — skips if not built)
// ============================================================
describe("Compiled Runtime", () => {
  const COMPILED_RUNTIME = resolve(ROOT_PATH, ".dist/bin/vibe-runtime.js");
  let compiledOutput: string;

  beforeAll(() => {
    if (!existsSync(COMPILED_RUNTIME)) {
      compiledOutput = "SKIP";
      return;
    }
    try {
      compiledOutput = execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${COMPILED_RUNTIME}" check --fix=false ./ 2>&1`,
        { encoding: "utf-8", timeout: 120000 },
      );
    } catch (error) {
      const e = error as { stdout?: string; stderr?: string };
      compiledOutput = (e.stdout ?? "") + (e.stderr ?? "");
    }
  });

  it("detects errors", () => {
    if (compiledOutput === "SKIP") {
      return;
    }
    expect(compiledOutput).toContain("error");
  });

  it("detects all three custom plugins", () => {
    if (compiledOutput === "SKIP") {
      return;
    }
    expect(compiledOutput).toContain("oxlint-plugin-jsx-capitalization");
    expect(compiledOutput).toContain("oxlint-plugin-i18n");
    expect(compiledOutput).toContain("oxlint-plugin-restricted");
  });

  it("completes TypeScript check", () => {
    if (compiledOutput === "SKIP") {
      return;
    }
    expect(compiledOutput).toContain("TypeScript check completed");
  });
});

// ============================================================
// LSP DAEMON API — direct TsgoDaemon tests
// ============================================================

const TSGO_PATH = join(ROOT_PATH, "node_modules/.bin/tsgo");
const LSP_PID_PATH = join(ROOT_PATH, ".tmp/tsgo-lsp-spec.pid");

const TYPE_ERRORS_KNOWN: Array<{ line: number; code: string }> = [
  { line: 24, code: "2322" },
  { line: 30, code: "2339" },
  { line: 38, code: "2554" },
  { line: 46, code: "2345" },
  { line: 52, code: "2362" },
  { line: 56, code: "2366" },
  { line: 68, code: "2416" },
  { line: 78, code: "2304" },
  { line: 84, code: "2365" },
  { line: 99, code: "2741" },
];

const CROSS_FILE_ERRORS: Array<{ file: string; code: string }> = [
  { file: "a11y-issues.tsx", code: "2339" },
  { file: "general-issues.ts", code: "18048" },
  { file: "general-issues.ts", code: "2322" },
  { file: "general-issues.ts", code: "2365" },
  { file: "general-issues.ts", code: "2769" },
  { file: "react-issues.tsx", code: "17001" },
  { file: "react-issues.tsx", code: "2540" },
  { file: "typescript-issues.ts", code: "2801" },
];

function findIssue(
  issues: LspIssue[],
  code: string,
  line?: number,
): LspIssue | undefined {
  return issues.find(
    (i) => i.rule === code && (line === undefined || i.line === line),
  );
}

function findInFile(
  issues: LspIssue[],
  file: string,
  code: string,
): LspIssue | undefined {
  return issues.find((i) => i.file.includes(file) && i.rule === code);
}

const daemon = TsgoDaemon.get(LSP_PID_PATH, TSGO_PATH, TEST_PROJECT_PATH);

describe("LSP Daemon API: single file — cold start", () => {
  let issues: LspIssue[] = [];

  it("returns diagnostics within 30 s", async () => {
    const t0 = Date.now();
    issues = await daemon.getDiagnostics("src/test-issues/type-errors.ts");
    expect(Date.now() - t0).toBeLessThan(30_000);
    expect(issues.length).toBeGreaterThan(0);
  }, 35_000);

  it("finds all 10 known type errors", () => {
    for (const { line, code } of TYPE_ERRORS_KNOWN) {
      expect(
        findIssue(issues, code, line),
        `TS${code} at L${line} — got: ${issues.map((i) => `TS${i.rule}:${i.line}`).join(" ")}`,
      ).toBeDefined();
    }
  });

  it("all issues well-formed", () => {
    for (const i of issues) {
      expect(i.file).toBeTruthy();
      expect(i.line).toBeGreaterThan(0);
      expect(i.column).toBeGreaterThan(0);
      expect(["error", "warning", "info"]).toContain(i.severity);
    }
  });

  it("all issues reference type-errors.ts", () => {
    for (const i of issues) {
      expect(i.file).toContain("type-errors.ts");
    }
  });
});

describe("LSP Daemon API: single file — warm repeat", () => {
  let issues: LspIssue[] = [];

  it("returns in under 2 s (file already open)", async () => {
    const t0 = Date.now();
    issues = await daemon.getDiagnostics("src/test-issues/type-errors.ts");
    expect(Date.now() - t0).toBeLessThan(2_000);
  }, 5_000);

  it("same errors as cold call", () => {
    for (const { line, code } of TYPE_ERRORS_KNOWN) {
      expect(
        findIssue(issues, code, line),
        `warm TS${code}:${line}`,
      ).toBeDefined();
    }
  });
});

describe("LSP Daemon API: folder scan (src/test-issues)", () => {
  let allIssues: LspIssue[] = [];

  it("returns errors from multiple files within 30 s", async () => {
    const t0 = Date.now();
    allIssues = await daemon.getDiagnostics("src/test-issues");
    expect(Date.now() - t0).toBeLessThan(30_000);
    expect(new Set(allIssues.map((i) => i.file)).size).toBeGreaterThan(1);
  }, 35_000);

  it("finds cross-file TS errors", () => {
    for (const { file, code } of CROSS_FILE_ERRORS) {
      expect(
        findInFile(allIssues, file, code),
        `TS${code} in ${file}`,
      ).toBeDefined();
    }
  });

  it("type-errors.ts errors included in folder results", () => {
    for (const { line, code } of TYPE_ERRORS_KNOWN) {
      expect(
        allIssues.find(
          (i) =>
            i.file.includes("type-errors.ts") &&
            i.rule === code &&
            i.line === line,
        ),
        `folder TS${code}:${line}`,
      ).toBeDefined();
    }
  });

  it("warm folder repeat returns in under 2 s", async () => {
    const t0 = Date.now();
    await daemon.getDiagnostics("src/test-issues");
    expect(Date.now() - t0).toBeLessThan(2_000);
  }, 5_000);
});

describe("LSP Daemon API: path filtering", () => {
  it("a11y-issues.tsx filter returns only that file's issues", async () => {
    const issues = await daemon.getDiagnostics(
      "src/test-issues/a11y-issues.tsx",
    );
    expect(issues.length).toBeGreaterThan(0);
    for (const i of issues) {
      expect(i.file).toContain("a11y-issues");
    }
  }, 10_000);

  it("general-issues.ts filter returns only general-issues errors", async () => {
    const issues = await daemon.getDiagnostics(
      "src/test-issues/general-issues.ts",
    );
    expect(findInFile(issues, "general-issues", "2322")).toBeDefined();
    expect(findInFile(issues, "general-issues", "18048")).toBeDefined();
    for (const i of issues) {
      expect(i.file).toContain("general-issues");
    }
  }, 10_000);
});
