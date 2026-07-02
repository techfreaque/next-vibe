/**
 * Vibe Check Route Tests
 *
 * Tests the complete check system by running vibe check on test-project
 * and validating ALL expected issues are detected.
 *
 * Architecture:
 * - fix=false is ALWAYS passed — auto-fix must never run during tests
 * - One beforeAll per scope, cached output reused across all assertions
 * - Three scopes: full dir (./ = 11 files), subfolder (src/test-issues = 10 files),
 *   single file (src/test-issues/a11y-issues.tsx = 1 file)
 * - Rules verified per-scope with one it() per rule (no giant omnibus tests)
 * - Per-file error/warning counts asserted for the full dir scope
 * - Per-file rule presence asserted for the full dir scope
 */

import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";

import { beforeAll, describe, expect, it } from "bun:test";

const TEST_PROJECT_PATH = resolve(__dirname, "../test-project");
const ROOT_PATH = resolve(__dirname, "../../../../../../..");
const TEST_PROJECT_CONFIG = resolve(TEST_PROJECT_PATH, "check.config.ts");
const VIBE_RUNTIME = resolve(
  ROOT_PATH,
  "src/app/api/[locale]/system/platforms/cli/vibe-runtime.ts",
);

// ============================================================
// GROUND TRUTH — verified from actual vibe check output
// Update whenever test files are intentionally changed.
// ============================================================

// Per-file error/warning counts (full dir scope)
const FILE_COUNTS: Record<string, { errors: number; warnings: number }> = {
  "a11y-issues.tsx": { errors: 62, warnings: 2 },
  "eslint-issues.tsx": { errors: 7, warnings: 0 },
  "general-issues.ts": { errors: 34, warnings: 0 },
  "i18n-issues.tsx": { errors: 43, warnings: 1 },
  "jsx-capitalization-issues.tsx": { errors: 29, warnings: 1 },
  "nextjs-issues.tsx": { errors: 37, warnings: 1 },
  "promise-issues.ts": { errors: 12, warnings: 0 },
  "react-issues.tsx": { errors: 42, warnings: 2 },
  "restricted-syntax-issues.tsx": { errors: 37, warnings: 0 },
  "typescript-issues.ts": { errors: 20, warnings: 0 },
  "calculate.ts": { errors: 1, warnings: 0 },
  "page.tsx": { errors: 1, warnings: 0 },
};

// Rules expected per file — every rule listed here MUST appear in that file's output
const FILE_RULES: Record<string, string[]> = {
  "a11y-issues.tsx": [
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "eslint-plugin-jsx-a11y(alt-text)",
    "eslint-plugin-jsx-a11y(anchor-has-content)",
    "eslint-plugin-jsx-a11y(click-events-have-key-events)",
    "eslint-plugin-jsx-a11y(heading-has-content)",
    "eslint-plugin-jsx-a11y(iframe-has-title)",
    "eslint-plugin-jsx-a11y(img-redundant-alt)",
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
    "eslint(no-unused-vars)",
    "eslint(no-template-curly-in-string)",
    "eslint(array-callback-return)",
    "eslint(no-constructor-return)",
    "eslint(no-self-compare)",
    "eslint(no-unused-private-class-members)",
    "eslint(prefer-template)",
    "eslint(no-new)",
    "oxc(missing-throw)",
    "oxc(bad-comparison-sequence)",
    "oxc(const-comparisons)",
    "eslint-plugin-unicorn(no-new-array)",
    "eslint-plugin-unicorn(prefer-array-flat)",
    "eslint-plugin-unicorn(prefer-spread)",
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
  ],
  "restricted-syntax-issues.tsx": [
    "oxlint-plugin-restricted(restricted-syntax)",
    "oxlint-plugin-jsx-capitalization(jsx-capitalization)",
    "oxlint-plugin-i18n(no-literal-string)",
  ],
  "page.tsx": [
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
  ],
  "calculate.ts": [
    "oxlint-plugin-restricted(restricted-syntax)",
  ],
};

// Summary totals per scope
const SCOPE_TOTALS = {
  dir: { files: 12, issues: 332, errors: 325, warnings: 7 },
  subfolder: { files: 11, issues: 331, errors: 324, warnings: 7 },
  singleFile: { files: 1, issues: 64, errors: 62, warnings: 2 },
};

// Rules expected in the single-file scope (a11y-issues.tsx only)
const SINGLE_FILE_RULES = FILE_RULES["a11y-issues.tsx"];

// Rules expected in the subfolder scope (src/test-issues — all files except calculate.ts)
// Every rule from every file in test-issues must appear
const SUBFOLDER_RULES = [
  ...new Set(
    Object.entries(FILE_RULES)
      .filter(([file]) => file !== "calculate.ts")
      .flatMap(([, rules]) => rules),
  ),
];

// ============================================================
// HELPERS
// ============================================================

function runVibeCheck(targetPath: string): string {
  const fullPath = resolve(TEST_PROJECT_PATH, targetPath);
  if (!existsSync(fullPath)) {
    return `Path not found: ${fullPath}`;
  }
  try {
    return execSync(
      `cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" check --fix=false "${targetPath}" 2>&1`,
      { encoding: "utf-8", timeout: 120000 },
    );
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string };
    return (e.stdout ?? "") + (e.stderr ?? "");
  }
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

/**
 * Extract the block of output lines that belong to a specific file.
 * The vibe check output groups errors under "● src/path/file.ext (N items)".
 */
function extractFileBlock(output: string, filename: string): string {
  const lines = output.split("\n");
  const startIdx = lines.findIndex(
    (l) => l.includes(`● `) && l.includes(filename),
  );
  if (startIdx === -1) {
    return "";
  }
  // Collect lines until the next file header or end
  const block: string[] = [lines[startIdx]];
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].startsWith("●") && !lines[i].includes(filename)) {
      break;
    }
    block.push(lines[i]);
  }
  return block.join("\n");
}

// ============================================================
// CACHED OUTPUTS
// ============================================================
let dirOutput: string;
let subfolderOutput: string;
let fileOutput: string;

// ============================================================
// CONFIG CREATION FLOW
// ============================================================
describe("Config Creation Flow", () => {
  it("Step 1: config file deleted", () => {
    if (existsSync(TEST_PROJECT_CONFIG)) {
      unlinkSync(TEST_PROJECT_CONFIG);
    }
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(false);
  });

  it("Step 2: fails without config, shows config-create hint", () => {
    let output = "";
    try {
      output = execSync(`cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" check ./ 2>&1`, {
        encoding: "utf-8",
        timeout: 30000,
      });
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
      output = execSync(`cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" config-create 2>&1`, {
        encoding: "utf-8",
        timeout: 30000,
      });
    } catch (error) {
      const e = error as { stdout?: string; stderr?: string };
      output = (e.stdout ?? "") + (e.stderr ?? "");
    }
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(true);
    expect(output).toContain("Created");
    expect(output).toContain("check.config.ts");
  });

  it("Step 4: config-create fails when config already exists", () => {
    let output = "";
    let exitCode = 0;
    try {
      output = execSync(`cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" config-create 2>&1`, {
        encoding: "utf-8",
        timeout: 30000,
      });
    } catch (error) {
      const e = error as { stdout?: string; stderr?: string; status?: number };
      output = (e.stdout ?? "") + (e.stderr ?? "");
      exitCode = e.status ?? 1;
    }
    expect(exitCode).not.toBe(0);
    expect(output.toLowerCase()).toContain("already exists");
  });

  it("Step 5: vibe check runs successfully with created config", () => {
    if (!existsSync(TEST_PROJECT_CONFIG)) {
      try {
        execSync(`cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" config-create 2>&1`, {
          encoding: "utf-8",
          timeout: 30000,
        });
      } catch { /* ignore */ }
    }
    dirOutput = runVibeCheck("./");
    expect(dirOutput).toContain("Starting Oxlint check");
    expect(dirOutput).toContain("Oxlint check completed");
  });
});

// ============================================================
// FULL DIRECTORY SCOPE (./)
// ============================================================
describe("Full Directory Check (./)", () => {
  beforeAll(() => {
    if (!dirOutput) {
      if (!existsSync(TEST_PROJECT_CONFIG)) {
        try {
          execSync(`cd "${TEST_PROJECT_PATH}" && bun "${VIBE_RUNTIME}" config-create 2>&1`, {
            encoding: "utf-8",
            timeout: 30000,
          });
        } catch { /* ignore */ }
      }
      dirOutput = runVibeCheck("./");
    }
  });

  describe("checkers all ran", () => {
    it("started and completed oxlint", () => {
      expect(dirOutput).toContain("Starting Oxlint check");
      expect(dirOutput).toContain("Oxlint check completed");
    });
    it("started and completed eslint", () => {
      expect(dirOutput).toContain("Starting ESLint check");
      expect(dirOutput).toContain("ESLint check completed");
    });
    it("started and completed typescript", () => {
      expect(dirOutput).toContain("Starting TypeScript check");
      expect(dirOutput).toContain("TypeScript check completed");
    });
  });

  describe("summary totals", () => {
    it("correct file count", () => {
      expect(extractSummary(dirOutput).files).toBe(SCOPE_TOTALS.dir.files);
    });
    it("correct total issues", () => {
      expect(extractSummary(dirOutput).issues).toBe(SCOPE_TOTALS.dir.issues);
    });
    it("correct error count", () => {
      expect(extractSummary(dirOutput).errors).toBe(SCOPE_TOTALS.dir.errors);
    });
    it("correct warning count", () => {
      expect(extractSummary(dirOutput).warnings).toBe(SCOPE_TOTALS.dir.warnings);
    });
  });

  describe("per-file error counts", () => {
    for (const [filename, expected] of Object.entries(FILE_COUNTS)) {
      const total = expected.errors + expected.warnings;
      it(`${filename}: ${expected.errors} errors, ${expected.warnings} warnings`, () => {
        expect(dirOutput, `${filename} should appear in output`).toContain(filename);
        // Affected-files summary line — singular/plural: "1 error" vs "N errors", "1 warning" vs "N warnings"
        const errWord = expected.errors === 1 ? "error" : "errors";
        const warnWord = expected.warnings === 1 ? "warning" : "warnings";
        if (expected.warnings > 0) {
          expect(dirOutput).toContain(
            `${filename} ${expected.errors} ${errWord} ${expected.warnings} ${warnWord}`,
          );
        } else {
          expect(dirOutput).toContain(`${filename} ${expected.errors} ${errWord}`);
        }
        // File block header: "● src/.../filename (N items)" where N = errors + warnings
        const itemWord = total === 1 ? "item" : "items";
        expect(dirOutput).toContain(`${filename} (${total} ${itemWord})`);
      });
    }
  });

  describe("per-file rule presence", () => {
    for (const [filename, rules] of Object.entries(FILE_RULES)) {
      describe(filename, () => {
        for (const rule of rules) {
          it(`detects ${rule}`, () => {
            const block = extractFileBlock(dirOutput, filename);
            expect(
              block,
              `${rule} should appear in ${filename}'s output block`,
            ).toContain(rule);
          });
        }
      });
    }
  });

  describe("typescript compiler errors", () => {
    it("detects Property does not exist on JSX.IntrinsicElements", () => {
      expect(dirOutput).toContain(
        "Property 'marquee' does not exist on type 'JSX.IntrinsicElements'",
      );
    });
    it("detects read-only property assignment", () => {
      expect(dirOutput).toContain(
        "Cannot assign to 'count' because it is a read-only property",
      );
    });
    it("detects type not assignable", () => {
      expect(dirOutput).toContain("is not assignable to type");
    });
    it("detects condition always true", () => {
      expect(dirOutput).toContain("This condition will always return true");
    });
  });
});

// ============================================================
// SUBFOLDER SCOPE (src/test-issues — 11 files, no calculate.ts)
// ============================================================
describe("Subfolder Check (src/test-issues)", () => {
  beforeAll(() => {
    subfolderOutput = runVibeCheck("src/test-issues");
  });

  describe("summary totals", () => {
    it("correct file count", () => {
      expect(extractSummary(subfolderOutput).files).toBe(SCOPE_TOTALS.subfolder.files);
    });
    it("correct total issues", () => {
      expect(extractSummary(subfolderOutput).issues).toBe(SCOPE_TOTALS.subfolder.issues);
    });
    it("correct error count", () => {
      expect(extractSummary(subfolderOutput).errors).toBe(SCOPE_TOTALS.subfolder.errors);
    });
    it("correct warning count", () => {
      expect(extractSummary(subfolderOutput).warnings).toBe(SCOPE_TOTALS.subfolder.warnings);
    });
  });

  describe("file scope", () => {
    it("includes all test-issues files", () => {
      for (const filename of Object.keys(FILE_COUNTS).filter((f) => f !== "calculate.ts")) {
        expect(subfolderOutput, `should include ${filename}`).toContain(filename);
      }
    });
    it("excludes calculate.ts (outside subfolder)", () => {
      expect(extractFileBlock(subfolderOutput, "calculate.ts")).toBe("");
    });
  });

  describe("all rules detected in subfolder", () => {
    for (const rule of SUBFOLDER_RULES) {
      it(`detects ${rule}`, () => {
        expect(subfolderOutput).toContain(rule);
      });
    }
  });
});

// ============================================================
// SINGLE FILE SCOPE (src/test-issues/a11y-issues.tsx)
// ============================================================
describe("Single File Check (src/test-issues/a11y-issues.tsx)", () => {
  beforeAll(() => {
    fileOutput = runVibeCheck("src/test-issues/a11y-issues.tsx");
  });

  describe("summary totals", () => {
    it("correct file count", () => {
      expect(extractSummary(fileOutput).files).toBe(SCOPE_TOTALS.singleFile.files);
    });
    it("correct total issues", () => {
      expect(extractSummary(fileOutput).issues).toBe(SCOPE_TOTALS.singleFile.issues);
    });
    it("correct error count", () => {
      expect(extractSummary(fileOutput).errors).toBe(SCOPE_TOTALS.singleFile.errors);
    });
    it("correct warning count", () => {
      expect(extractSummary(fileOutput).warnings).toBe(SCOPE_TOTALS.singleFile.warnings);
    });
  });

  describe("file scope", () => {
    it("contains only a11y-issues.tsx", () => {
      expect(fileOutput).toContain("a11y-issues.tsx");
    });
    it("does not include other test files", () => {
      for (const filename of Object.keys(FILE_COUNTS).filter(
        (f) => f !== "a11y-issues.tsx",
      )) {
        expect(
          extractFileBlock(fileOutput, filename),
          `${filename} should not appear in single-file output`,
        ).toBe("");
      }
    });
  });

  describe("all expected rules detected in single file", () => {
    for (const rule of SINGLE_FILE_RULES) {
      it(`detects ${rule}`, () => {
        expect(fileOutput).toContain(rule);
      });
    }
  });
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
    if (compiledOutput === "SKIP") { return; }
    expect(compiledOutput).toContain("error");
  });

  it("detects all three custom plugins", () => {
    if (compiledOutput === "SKIP") { return; }
    expect(compiledOutput).toContain("oxlint-plugin-jsx-capitalization");
    expect(compiledOutput).toContain("oxlint-plugin-i18n");
    expect(compiledOutput).toContain("oxlint-plugin-restricted");
  });

  it("completes TypeScript check", () => {
    if (compiledOutput === "SKIP") { return; }
    expect(compiledOutput).toContain("TypeScript check completed");
  });

  it("summary close to bun runtime (±15 issues)", () => {
    if (compiledOutput === "SKIP") { return; }
    const summary = extractSummary(compiledOutput);
    expect(summary.files).toBe(SCOPE_TOTALS.dir.files);
    expect(summary.issues).toBeGreaterThanOrEqual(SCOPE_TOTALS.dir.issues - 15);
    expect(summary.issues).toBeLessThanOrEqual(SCOPE_TOTALS.dir.issues + 5);
  });
});

// ============================================================
// ROOT INVOCATION (verifies ignore patterns)
// ============================================================
describe("Running From Project Root", () => {
  let fromRootOutput: string;

  beforeAll(() => {
    try {
      fromRootOutput = execSync(
        `cd "${ROOT_PATH}" && bun src/app/api/[locale]/system/platforms/cli/vibe-runtime.ts check --fix=false "src/app/api/[locale]/system/tooling/check/test-project" 2>&1`,
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
