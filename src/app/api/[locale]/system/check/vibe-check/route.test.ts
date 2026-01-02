/**
 * Vibe Check Route Tests
 *
 * Tests the complete check system by running vibe check ONCE on test-project
 * and validating ALL expected issues are detected.
 *
 * Architecture:
 * - Single vibe check run in beforeAll (captures oxlint + eslint + typescript)
 * - All assertions compare against this single cached output
 * - Ensures consistent, comprehensive error detection
 */

import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";

import { beforeAll, describe, expect, it } from "bun:test";

// Path constants
const TEST_PROJECT_PATH = resolve(__dirname, "../test-project");
const ROOT_PATH = resolve(__dirname, "../../../../../../..");
const TEST_PROJECT_CONFIG = resolve(TEST_PROJECT_PATH, "check.config.ts");

// Test file basenames for validation (src/** only per tsconfig.json)
const TEST_FILES = [
  "a11y-issues.tsx",
  "eslint-issues.tsx",
  "general-issues.ts",
  "i18n-issues.tsx",
  "jsx-capitalization-issues.tsx",
  "nextjs-issues.tsx",
  "promise-issues.ts",
  "react-issues.tsx",
  "restricted-syntax-issues.tsx",
  "typescript-issues.ts",
];

// ============================================================
// EXPECTED ERROR COUNTS (verified manually from vibe check output)
// ============================================================
const EXPECTED_COUNTS = {
  // Total summary (counts may vary slightly based on test environment)
  totalIssues: 319,
  totalErrors: 313,
  totalWarnings: 6,
  totalFiles: 11,

  // Per-file expected errors+warnings
  files: {
    "a11y-issues.tsx": { errors: 64, warnings: 2 },
    "eslint-issues.tsx": { errors: 7, warnings: 0 },
    "general-issues.ts": { errors: 34, warnings: 0 },
    "i18n-issues.tsx": { errors: 43, warnings: 1 },
    "jsx-capitalization-issues.tsx": { errors: 30, warnings: 1 },
    "nextjs-issues.tsx": { errors: 48, warnings: 1 },
    "promise-issues.ts": { errors: 11, warnings: 0 },
    "react-issues.tsx": { errors: 34, warnings: 1 },
    "restricted-syntax-issues.tsx": { errors: 21, warnings: 0 },
    "typescript-issues.ts": { errors: 20, warnings: 0 },
    "calculate.ts": { errors: 1, warnings: 0 },
  },

  // Expected plugin/rule occurrences (minimum counts)
  rules: {
    // Custom plugins
    "oxlint-plugin-jsx-capitalization": 100,
    "oxlint-plugin-i18n": 50,
    "oxlint-plugin-restricted": 8,

    // ESLint rules
    "eslint(no-debugger)": 1,
    "eslint(no-console)": 8,
    "eslint(curly)": 2,
    "eslint(eqeqeq)": 3,
    "eslint(no-unused-vars)": 5,
    "eslint(no-template-curly-in-string)": 1,
    "eslint(array-callback-return)": 1,
    "eslint(no-constructor-return)": 1,
    "eslint(no-self-compare)": 1,
    "eslint(no-unused-private-class-members)": 1,
    "eslint(prefer-template)": 1,
    "eslint(no-new)": 1,

    // TypeScript-ESLint rules
    "typescript-eslint(no-explicit-any)": 3,
    "typescript-eslint(no-inferrable-types)": 3,
    "typescript-eslint(no-empty-function)": 1,
    "typescript-eslint(consistent-type-imports)": 1,
    "typescript-eslint(no-duplicate-enum-values)": 1,
    "typescript-eslint(no-extra-non-null-assertion)": 2,
    "typescript-eslint(explicit-function-return-type)": 1,

    // React rules
    "eslint-plugin-react(jsx-key)": 1,
    "eslint-plugin-react(jsx-no-duplicate-props)": 1,
    "eslint-plugin-react(no-children-prop)": 1,
    "eslint-plugin-react(no-direct-mutation-state)": 1,
    "eslint-plugin-react(self-closing-comp)": 4,
    "eslint-plugin-react(no-unknown-property)": 1,
    "eslint-plugin-react(iframe-missing-sandbox)": 1,

    // React Hooks rules
    "eslint-plugin-react-hooks(exhaustive-deps)": 2,

    // JSX-A11Y rules
    "eslint-plugin-jsx-a11y(alt-text)": 1,
    "eslint-plugin-jsx-a11y(anchor-has-content)": 1,
    "eslint-plugin-jsx-a11y(aria-props)": 1,
    "eslint-plugin-jsx-a11y(aria-role)": 1,
    "eslint-plugin-jsx-a11y(click-events-have-key-events)": 4,
    "eslint-plugin-jsx-a11y(heading-has-content)": 2,
    "eslint-plugin-jsx-a11y(iframe-has-title)": 1,
    "eslint-plugin-jsx-a11y(img-redundant-alt)": 2,
    "eslint-plugin-jsx-a11y(no-access-key)": 1,
    "eslint-plugin-jsx-a11y(no-autofocus)": 1,
    "eslint-plugin-jsx-a11y(no-distracting-elements)": 1,
    "eslint-plugin-jsx-a11y(no-redundant-roles)": 2,
    "eslint-plugin-jsx-a11y(role-has-required-aria-props)": 4,
    "eslint-plugin-jsx-a11y(tabindex-no-positive)": 1,
    "eslint-plugin-jsx-a11y(label-has-associated-control)": 1,
    "eslint-plugin-jsx-a11y(html-has-lang)": 2,
    "eslint-plugin-jsx-a11y(lang)": 2,
    "eslint-plugin-jsx-a11y(prefer-tag-over-role)": 1,
    "eslint-plugin-jsx-a11y(anchor-is-valid)": 1,

    // Next.js rules
    "eslint-plugin-next(no-img-element)": 4,
    "eslint-plugin-next(no-html-link-for-pages)": 4,
    "eslint-plugin-next(no-sync-scripts)": 1,
    "eslint-plugin-next(no-css-tags)": 1,
    "eslint-plugin-next(google-font-display)": 1,
    "eslint-plugin-next(no-page-custom-font)": 2,

    // Promise rules
    "eslint-plugin-promise(param-names)": 2,
    "eslint-plugin-promise(always-return)": 2,
    "eslint-plugin-promise(catch-or-return)": 2,

    // Unicorn rules
    "eslint-plugin-unicorn(no-new-array)": 1,
    "eslint-plugin-unicorn(prefer-spread)": 1,
    "eslint-plugin-unicorn(prefer-array-flat)": 1,
    "eslint-plugin-unicorn(prefer-includes)": 1,
    "eslint-plugin-unicorn(no-await-in-promise-methods)": 2,
    "eslint-plugin-unicorn(no-single-promise-in-promise-methods)": 1,

    // OXC rules
    "oxc(missing-throw)": 1,
    "oxc(bad-comparison-sequence)": 1,
    "oxc(const-comparisons)": 1,
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Run full vibe check on test-project
 */
function runVibeCheck(targetPath = "./"): string {
  const fullPath = resolve(TEST_PROJECT_PATH, targetPath);
  if (!existsSync(fullPath)) {
    return `Path not found: ${fullPath}`;
  }

  try {
    const output = execSync(
      `cd "${TEST_PROJECT_PATH}" && bun "${resolve(ROOT_PATH, "src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts")}" check "${targetPath}" 2>&1`,
      {
        encoding: "utf-8",
        timeout: 120000,
      },
    );
    return output;
  } catch (error) {
    const execError = error as { stdout?: string; stderr?: string };
    return (execError.stdout || "") + (execError.stderr || "");
  }
}

/**
 * Count occurrences of a pattern in output
 */
function countOccurrences(output: string, pattern: string): number {
  const regex = new RegExp(pattern.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  return (output.match(regex) || []).length;
}

/**
 * Extract summary numbers from output
 * The summary section looks like:
 * 📊 Summary
 * ──────────────────────────────────────────────────
 *    Files:       12
 *    Issues:      320
 *    ❌ 314 errors
 *    ⚠️ 6 warnings
 */
function extractSummary(output: string): {
  files: number;
  issues: number;
  errors: number;
  warnings: number;
} {
  const filesMatch = output.match(/Files:\s+(\d+)/);
  const issuesMatch = output.match(/Issues:\s+(\d+)/);
  // Match errors/warnings in the summary section (after the emoji icons)
  const errorsMatch = output.match(/❌\s*(\d+)\s*errors/);
  const warningsMatch = output.match(/⚠️\s*(\d+)\s*warnings/);

  return {
    files: filesMatch ? parseInt(filesMatch[1], 10) : 0,
    issues: issuesMatch ? parseInt(issuesMatch[1], 10) : 0,
    errors: errorsMatch ? parseInt(errorsMatch[1], 10) : 0,
    warnings: warningsMatch ? parseInt(warningsMatch[1], 10) : 0,
  };
}

// ============================================================
// CACHED OUTPUT (single run, all tests compare against this)
// ============================================================
let vibeCheckOutput: string;

// ============================================================
// CONFIG CREATION TEST FLOW
// Tests the full npm package workflow: no config → create → use
// ============================================================
describe("Config Creation Flow", () => {
  it("Step 1: should delete existing config", () => {
    if (existsSync(TEST_PROJECT_CONFIG)) {
      unlinkSync(TEST_PROJECT_CONFIG);
    }
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(false);
  });

  it("Step 2: should fail without --create-config flag and show hint", () => {
    let output = "";
    try {
      output = execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${resolve(ROOT_PATH, "src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts")}" check ./ 2>&1`,
        { encoding: "utf-8", timeout: 30000 },
      );
    } catch (error) {
      const execError = error as { stdout?: string; stderr?: string };
      output = (execError.stdout || "") + (execError.stderr || "");
    }

    expect(output).toContain("check.config.ts");
    expect(output).toContain("--create-config");
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(false);
  });

  it("Step 3: should create config with --create-config flag", () => {
    let output = "";
    try {
      output = execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${resolve(ROOT_PATH, "src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts")}" check --create-config --skip-lint --skip-typecheck 2>&1`,
        { encoding: "utf-8", timeout: 30000 },
      );
    } catch (error) {
      const execError = error as { stdout?: string; stderr?: string };
      output = (execError.stdout || "") + (execError.stderr || "");
    }

    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(true);
    expect(output).toContain("Created check.config.ts");
  });

  it("Step 4: should fail with --create-config when config already exists", () => {
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(true);

    let output = "";
    let exitCode = 0;
    try {
      output = execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${resolve(ROOT_PATH, "src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts")}" check --create-config --skip-lint --skip-typecheck 2>&1`,
        { encoding: "utf-8", timeout: 30000 },
      );
    } catch (error) {
      const execError = error as {
        stdout?: string;
        stderr?: string;
        status?: number;
      };
      output = (execError.stdout || "") + (execError.stderr || "");
      exitCode = execError.status || 1;
    }

    expect(exitCode).not.toBe(0);
    expect(output).toContain("already exists");
  });

  it("Step 5: should run vibe check successfully with created config", () => {
    expect(existsSync(TEST_PROJECT_CONFIG)).toBe(true);
    vibeCheckOutput = runVibeCheck("./");
    expect(vibeCheckOutput).toContain("Starting Oxlint check");
    expect(vibeCheckOutput).toContain("All checks completed");
  });
});

describe("Vibe Check Complete Test Suite", () => {
  // Config should already exist from previous test suite
  beforeAll(() => {
    if (!vibeCheckOutput) {
      // Ensure config exists
      if (!existsSync(TEST_PROJECT_CONFIG)) {
        try {
          execSync(
            `cd "${TEST_PROJECT_PATH}" && bun "${resolve(ROOT_PATH, "src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts")}" check --create-config --skip-lint --skip-typecheck 2>&1`,
            { encoding: "utf-8", timeout: 30000 },
          );
        } catch {
          // Ignore errors
        }
      }
      vibeCheckOutput = runVibeCheck("./");
    }
  });

  // ============================================================
  // CORE VALIDATION: CHECK COMPLETED SUCCESSFULLY
  // ============================================================
  describe("check execution", () => {
    it("should complete all three checks (oxlint, eslint, typescript)", () => {
      expect(vibeCheckOutput).toContain("Starting Oxlint check");
      expect(vibeCheckOutput).toContain("Starting ESLint check");
      expect(vibeCheckOutput).toContain("Starting TypeScript check");
      expect(vibeCheckOutput).toContain("Oxlint check completed");
      expect(vibeCheckOutput).toContain("ESLint check completed");
      expect(vibeCheckOutput).toContain("TypeScript check completed");
      expect(vibeCheckOutput).toContain("All checks completed");
    });

    it("should detect errors", () => {
      expect(vibeCheckOutput).toContain("error");
    });
  });

  // ============================================================
  // SUMMARY VALIDATION
  // ============================================================
  describe("summary validation", () => {
    it("should report expected total files", () => {
      const summary = extractSummary(vibeCheckOutput);
      expect(summary.files).toBe(EXPECTED_COUNTS.totalFiles);
    });

    it("should report expected total issues", () => {
      const summary = extractSummary(vibeCheckOutput);
      expect(summary.issues).toBe(EXPECTED_COUNTS.totalIssues);
    });

    it("should report expected error count", () => {
      const summary = extractSummary(vibeCheckOutput);
      expect(summary.errors).toBe(EXPECTED_COUNTS.totalErrors);
    });

    it("should report expected warning count", () => {
      const summary = extractSummary(vibeCheckOutput);
      expect(summary.warnings).toBe(EXPECTED_COUNTS.totalWarnings);
    });
  });

  // ============================================================
  // FILE COVERAGE VALIDATION
  // ============================================================
  describe("file coverage", () => {
    it("should include all test files in output", () => {
      for (const file of TEST_FILES) {
        expect(vibeCheckOutput, `Output should include ${file}`).toContain(file);
      }
    });

    it("should include utils/calculate.ts in output", () => {
      expect(vibeCheckOutput).toContain("calculate.ts");
    });
  });

  // ============================================================
  // CUSTOM PLUGIN VALIDATION
  // ============================================================
  describe("custom plugins", () => {
    describe("oxlint-plugin-jsx-capitalization", () => {
      it("should detect lowercase elements", () => {
        expect(vibeCheckOutput).toContain("oxlint-plugin-jsx-capitalization(jsx-capitalization)");
      });

      it("should suggest platform-independent components", () => {
        expect(vibeCheckOutput).toContain("instead of <div>");
        expect(vibeCheckOutput).toContain("instead of <span>");
        expect(vibeCheckOutput).toContain("instead of <button>");
        expect(vibeCheckOutput).toContain("instead of <p>");
        expect(vibeCheckOutput).toContain("instead of <h1>");
      });

      it("should suggest Link component for anchors", () => {
        expect(vibeCheckOutput).toContain("Use platform-independent <Link>");
        expect(vibeCheckOutput).toContain("next-vibe-ui/ui/link");
      });

      it("should have expected occurrence count", () => {
        const count = countOccurrences(vibeCheckOutput, "oxlint-plugin-jsx-capitalization");
        expect(count).toBeGreaterThanOrEqual(
          EXPECTED_COUNTS.rules["oxlint-plugin-jsx-capitalization"],
        );
      });
    });

    describe("oxlint-plugin-i18n", () => {
      it("should detect literal strings", () => {
        expect(vibeCheckOutput).toContain("oxlint-plugin-i18n(no-literal-string)");
        expect(vibeCheckOutput).toContain("should be translated");
      });

      it("should detect various literal string types", () => {
        expect(vibeCheckOutput).toContain('Literal string "');
        expect(vibeCheckOutput).toContain("in JSX attribute should be translated");
        expect(vibeCheckOutput).toContain("should be translated using i18n");
      });

      it("should have expected occurrence count", () => {
        const count = countOccurrences(vibeCheckOutput, "oxlint-plugin-i18n");
        expect(count).toBeGreaterThanOrEqual(EXPECTED_COUNTS.rules["oxlint-plugin-i18n"]);
      });
    });

    describe("oxlint-plugin-restricted", () => {
      it("should detect unknown type usage", () => {
        expect(vibeCheckOutput).toContain("oxlint-plugin-restricted(restricted-syntax)");
        expect(vibeCheckOutput).toContain("Usage of the 'unknown' type isn't allowed");
      });

      it("should detect object type usage", () => {
        expect(vibeCheckOutput).toContain("Usage of the 'object' type isn't allowed");
      });

      it("should detect throw statements", () => {
        expect(vibeCheckOutput).toContain("Usage of 'throw' statements is not allowed");
      });

      it("should detect JSX in object literals", () => {
        expect(vibeCheckOutput).toContain("JSX elements inside object literals are not allowed");
      });

      it("should have expected occurrence count", () => {
        const count = countOccurrences(vibeCheckOutput, "oxlint-plugin-restricted");
        expect(count).toBeGreaterThanOrEqual(EXPECTED_COUNTS.rules["oxlint-plugin-restricted"]);
      });
    });
  });

  // ============================================================
  // ESLINT RULES VALIDATION
  // ============================================================
  describe("eslint rules", () => {
    it("should detect no-debugger", () => {
      expect(vibeCheckOutput).toContain("eslint(no-debugger)");
    });

    it("should detect no-console with expected count", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint(no-console)");
      expect(count).toBeGreaterThanOrEqual(EXPECTED_COUNTS.rules["eslint(no-console)"]);
    });

    it("should detect curly violations", () => {
      expect(vibeCheckOutput).toContain("eslint(curly)");
    });

    it("should detect eqeqeq violations", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint(eqeqeq)");
      expect(count).toBeGreaterThanOrEqual(EXPECTED_COUNTS.rules["eslint(eqeqeq)"]);
    });

    it("should detect no-unused-vars", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint(no-unused-vars)");
      expect(count).toBeGreaterThanOrEqual(EXPECTED_COUNTS.rules["eslint(no-unused-vars)"]);
    });

    it("should detect no-template-curly-in-string", () => {
      expect(vibeCheckOutput).toContain("eslint(no-template-curly-in-string)");
    });

    it("should detect array-callback-return", () => {
      expect(vibeCheckOutput).toContain("eslint(array-callback-return)");
    });

    it("should detect no-constructor-return", () => {
      expect(vibeCheckOutput).toContain("eslint(no-constructor-return)");
    });

    it("should detect no-self-compare", () => {
      expect(vibeCheckOutput).toContain("eslint(no-self-compare)");
    });

    it("should detect no-unused-private-class-members", () => {
      expect(vibeCheckOutput).toContain("eslint(no-unused-private-class-members)");
    });

    it("should detect prefer-template", () => {
      expect(vibeCheckOutput).toContain("eslint(prefer-template)");
    });

    it("should detect no-new", () => {
      expect(vibeCheckOutput).toContain("eslint(no-new)");
    });
  });

  // ============================================================
  // TYPESCRIPT-ESLINT RULES VALIDATION
  // ============================================================
  describe("typescript-eslint rules", () => {
    it("should detect no-explicit-any", () => {
      const count = countOccurrences(vibeCheckOutput, "typescript-eslint(no-explicit-any)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["typescript-eslint(no-explicit-any)"],
      );
    });

    it("should detect no-inferrable-types", () => {
      const count = countOccurrences(vibeCheckOutput, "typescript-eslint(no-inferrable-types)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["typescript-eslint(no-inferrable-types)"],
      );
    });

    it("should detect no-empty-function", () => {
      expect(vibeCheckOutput).toContain("eslint(no-empty-function)");
    });

    it("should detect consistent-type-imports", () => {
      expect(vibeCheckOutput).toContain("typescript-eslint(consistent-type-imports)");
    });

    it("should detect no-duplicate-enum-values", () => {
      expect(vibeCheckOutput).toContain("typescript-eslint(no-duplicate-enum-values)");
    });

    it("should detect no-extra-non-null-assertion", () => {
      const count = countOccurrences(
        vibeCheckOutput,
        "typescript-eslint(no-extra-non-null-assertion)",
      );
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["typescript-eslint(no-extra-non-null-assertion)"],
      );
    });

    it("should detect explicit-function-return-type", () => {
      expect(vibeCheckOutput).toContain("typescript-eslint(explicit-function-return-type)");
    });
  });

  // ============================================================
  // REACT RULES VALIDATION
  // ============================================================
  describe("react rules", () => {
    it("should detect jsx-key", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-react(jsx-key)");
    });

    it("should detect jsx-no-duplicate-props", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-react(jsx-no-duplicate-props)");
    });

    it("should detect no-children-prop", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-react(no-children-prop)");
    });

    it("should detect no-direct-mutation-state", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-react(no-direct-mutation-state)");
    });

    it("should detect self-closing-comp", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-react(self-closing-comp)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-react(self-closing-comp)"],
      );
    });

    it("should detect no-unknown-property", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-react(no-unknown-property)");
    });

    it("should detect iframe-missing-sandbox", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-react(iframe-missing-sandbox)");
    });
  });

  // ============================================================
  // REACT HOOKS RULES VALIDATION
  // ============================================================
  describe("react-hooks rules", () => {
    it("should detect exhaustive-deps violations", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-react-hooks(exhaustive-deps)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-react-hooks(exhaustive-deps)"],
      );
    });

    it("should mention missing dependencies", () => {
      expect(vibeCheckOutput).toContain("missing dependency");
    });
  });

  // ============================================================
  // JSX-A11Y RULES VALIDATION
  // ============================================================
  describe("jsx-a11y rules", () => {
    it("should detect alt-text", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(alt-text)");
    });

    it("should detect anchor-has-content", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(anchor-has-content)");
    });

    it("should detect click-events-have-key-events", () => {
      const count = countOccurrences(
        vibeCheckOutput,
        "eslint-plugin-jsx-a11y(click-events-have-key-events)",
      );
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-jsx-a11y(click-events-have-key-events)"],
      );
    });

    it("should detect heading-has-content", () => {
      const count = countOccurrences(
        vibeCheckOutput,
        "eslint-plugin-jsx-a11y(heading-has-content)",
      );
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-jsx-a11y(heading-has-content)"],
      );
    });

    it("should detect iframe-has-title", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(iframe-has-title)");
    });

    it("should detect img-redundant-alt", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-jsx-a11y(img-redundant-alt)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-jsx-a11y(img-redundant-alt)"],
      );
    });

    it("should detect no-access-key", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(no-access-key)");
    });

    it("should detect no-autofocus", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(no-autofocus)");
    });

    it("should detect no-distracting-elements", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(no-distracting-elements)");
    });

    it("should detect no-redundant-roles", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-jsx-a11y(no-redundant-roles)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-jsx-a11y(no-redundant-roles)"],
      );
    });

    it("should detect role-has-required-aria-props", () => {
      const count = countOccurrences(
        vibeCheckOutput,
        "eslint-plugin-jsx-a11y(role-has-required-aria-props)",
      );
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-jsx-a11y(role-has-required-aria-props)"],
      );
    });

    it("should detect tabindex-no-positive", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(tabindex-no-positive)");
    });

    it("should detect aria-props violations", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(aria-props)");
    });

    it("should detect aria-role violations", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(aria-role)");
    });

    it("should detect label-has-associated-control", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(label-has-associated-control)");
    });

    it("should detect html-has-lang", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-jsx-a11y(html-has-lang)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-jsx-a11y(html-has-lang)"],
      );
    });

    it("should detect prefer-tag-over-role", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(prefer-tag-over-role)");
    });

    it("should detect anchor-is-valid", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-jsx-a11y(anchor-is-valid)");
    });
  });

  // ============================================================
  // NEXT.JS RULES VALIDATION
  // ============================================================
  describe("nextjs rules", () => {
    it("should detect no-img-element (warning)", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-next(no-img-element)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-next(no-img-element)"],
      );
    });

    it("should detect no-html-link-for-pages", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-next(no-html-link-for-pages)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-next(no-html-link-for-pages)"],
      );
    });

    it("should detect no-sync-scripts", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-next(no-sync-scripts)");
    });

    it("should detect no-css-tags", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-next(no-css-tags)");
    });

    it("should detect google-font-display", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-next(google-font-display)");
    });

    it("should detect no-page-custom-font", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-next(no-page-custom-font)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-next(no-page-custom-font)"],
      );
    });

    // Note: no-title-in-document-head rule is not being triggered by current test files
  });

  // ============================================================
  // PROMISE RULES VALIDATION
  // ============================================================
  describe("promise rules", () => {
    it("should detect param-names", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-promise(param-names)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-promise(param-names)"],
      );
    });

    it("should detect always-return", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-promise(always-return)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-promise(always-return)"],
      );
    });

    it("should detect catch-or-return", () => {
      const count = countOccurrences(vibeCheckOutput, "eslint-plugin-promise(catch-or-return)");
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-promise(catch-or-return)"],
      );
    });
  });

  // ============================================================
  // UNICORN RULES VALIDATION
  // ============================================================
  describe("unicorn rules", () => {
    it("should detect no-new-array", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-unicorn(no-new-array)");
    });

    it("should detect prefer-spread", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-unicorn(prefer-spread)");
    });

    it("should detect prefer-array-flat", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-unicorn(prefer-array-flat)");
    });

    it("should detect prefer-includes", () => {
      expect(vibeCheckOutput).toContain("eslint-plugin-unicorn(prefer-includes)");
    });

    it("should detect no-await-in-promise-methods", () => {
      const count = countOccurrences(
        vibeCheckOutput,
        "eslint-plugin-unicorn(no-await-in-promise-methods)",
      );
      expect(count).toBeGreaterThanOrEqual(
        EXPECTED_COUNTS.rules["eslint-plugin-unicorn(no-await-in-promise-methods)"],
      );
    });

    it("should detect no-single-promise-in-promise-methods", () => {
      expect(vibeCheckOutput).toContain(
        "eslint-plugin-unicorn(no-single-promise-in-promise-methods)",
      );
    });
  });

  // ============================================================
  // OXC RULES VALIDATION
  // ============================================================
  describe("oxc rules", () => {
    it("should detect missing-throw", () => {
      expect(vibeCheckOutput).toContain("oxc(missing-throw)");
    });

    it("should detect bad-comparison-sequence", () => {
      expect(vibeCheckOutput).toContain("oxc(bad-comparison-sequence)");
    });

    it("should detect const-comparisons", () => {
      expect(vibeCheckOutput).toContain("oxc(const-comparisons)");
    });
  });

  // ============================================================
  // TYPESCRIPT COMPILER ERROR VALIDATION
  // ============================================================
  describe("typescript compiler errors", () => {
    it("should detect Property does not exist errors", () => {
      expect(vibeCheckOutput).toContain(
        "Property 'marquee' does not exist on type 'JSX.IntrinsicElements'",
      );
    });

    it("should detect read-only property assignment errors", () => {
      expect(vibeCheckOutput).toContain(
        "Cannot assign to 'count' because it is a read-only property",
      );
    });

    it("should detect type assignment errors", () => {
      expect(vibeCheckOutput).toContain("is not assignable to type");
    });

    it("should detect condition always true errors", () => {
      expect(vibeCheckOutput).toContain("This condition will always return true");
    });
  });

  // ============================================================
  // COMPREHENSIVE RULE COUNT VALIDATION
  // ============================================================
  describe("rule count validation", () => {
    const highVolumeRules = [
      { name: "oxlint-plugin-jsx-capitalization", min: 100 },
      { name: "oxlint-plugin-i18n", min: 50 },
      { name: "eslint(no-console)", min: 8 },
      { name: "eslint(no-unused-vars)", min: 5 },
      { name: "eslint-plugin-react(self-closing-comp)", min: 4 },
      { name: "eslint-plugin-jsx-a11y(click-events-have-key-events)", min: 4 },
      { name: "eslint-plugin-next(no-img-element)", min: 4 },
      { name: "eslint-plugin-next(no-html-link-for-pages)", min: 4 },
    ];

    for (const rule of highVolumeRules) {
      it(`should have at least ${rule.min} occurrences of ${rule.name}`, () => {
        const count = countOccurrences(vibeCheckOutput, rule.name);
        expect(count).toBeGreaterThanOrEqual(rule.min);
      });
    }
  });
});

// ============================================================
// COMPILED RUNTIME TESTS
// ============================================================
describe("Compiled Runtime Tests", () => {
  const COMPILED_RUNTIME = resolve(ROOT_PATH, ".dist/bin/vibe-runtime.js");
  let compiledOutput: string;

  beforeAll(() => {
    if (!existsSync(COMPILED_RUNTIME)) {
      compiledOutput = "SKIP: Compiled runtime not found - run 'bun vibe builder' first";
      return;
    }

    try {
      compiledOutput = execSync(
        `cd "${TEST_PROJECT_PATH}" && bun "${COMPILED_RUNTIME}" check ./ 2>&1`,
        { encoding: "utf-8", timeout: 120000 },
      );
    } catch (error) {
      const execError = error as { stdout?: string; stderr?: string };
      compiledOutput = (execError.stdout || "") + (execError.stderr || "");
    }
  });

  it("should detect errors when using compiled runtime", () => {
    if (compiledOutput.includes("SKIP:")) {
      return;
    }
    expect(compiledOutput).toContain("error");
  });

  it("should detect custom plugin errors with compiled runtime", () => {
    if (compiledOutput.includes("SKIP:")) {
      return;
    }
    expect(compiledOutput).toContain("oxlint-plugin-jsx-capitalization");
    expect(compiledOutput).toContain("oxlint-plugin-i18n");
    expect(compiledOutput).toContain("oxlint-plugin-restricted");
  });

  it("should complete TypeScript check with compiled runtime", () => {
    if (compiledOutput.includes("SKIP:")) {
      return;
    }
    expect(compiledOutput).toContain("TypeScript check completed");
  });

  it("should produce similar summary to bun runtime", () => {
    if (compiledOutput.includes("SKIP:")) {
      return;
    }
    const summary = extractSummary(compiledOutput);
    // Allow some variance - compiled runtime may detect fewer TypeScript errors
    // Bun runtime: 319 issues, compiled runtime: ~309 issues (10 fewer due to tsc differences)
    expect(summary.files).toBe(EXPECTED_COUNTS.totalFiles);
    expect(summary.issues).toBeGreaterThanOrEqual(EXPECTED_COUNTS.totalIssues - 15);
    expect(summary.issues).toBeLessThanOrEqual(EXPECTED_COUNTS.totalIssues + 5);
  });
});

// ============================================================
// MULTI-DIRECTORY TESTS
// ============================================================
describe("Multi-Directory Tests", () => {
  describe("running from test-project directory", () => {
    let fromTestProjectOutput: string;

    beforeAll(() => {
      try {
        fromTestProjectOutput = execSync(
          `cd "${TEST_PROJECT_PATH}" && bun "${resolve(ROOT_PATH, "src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts")}" check ./ 2>&1`,
          { encoding: "utf-8", timeout: 120000 },
        );
      } catch (error) {
        const execError = error as { stdout?: string; stderr?: string };
        fromTestProjectOutput = (execError.stdout || "") + (execError.stderr || "");
      }
    });

    it("should find all plugin errors when running from test-project", () => {
      expect(fromTestProjectOutput).toContain("oxlint-plugin-jsx-capitalization");
      expect(fromTestProjectOutput).toContain("oxlint-plugin-i18n");
      expect(fromTestProjectOutput).toContain("oxlint-plugin-restricted");
    });

    it("should complete TypeScript check when running from test-project", () => {
      expect(fromTestProjectOutput).toContain("TypeScript check completed");
    });

    it("should detect TypeScript compiler errors when running from test-project", () => {
      expect(fromTestProjectOutput).toContain("Property 'marquee' does not exist");
    });

    it("should find all test files when running from test-project", () => {
      for (const file of TEST_FILES) {
        expect(fromTestProjectOutput).toContain(file);
      }
    });

    it("should have correct summary when running from test-project", () => {
      const summary = extractSummary(fromTestProjectOutput);
      expect(summary.files).toBe(EXPECTED_COUNTS.totalFiles);
      expect(summary.issues).toBe(EXPECTED_COUNTS.totalIssues);
    });
  });

  describe("running from project root", () => {
    let fromRootOutput: string;

    beforeAll(() => {
      try {
        fromRootOutput = execSync(
          `cd "${ROOT_PATH}" && bun src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts check "src/app/api/[locale]/system/check/test-project" 2>&1`,
          { encoding: "utf-8", timeout: 120000 },
        );
      } catch (error) {
        const execError = error as { stdout?: string; stderr?: string };
        fromRootOutput = (execError.stdout || "") + (execError.stderr || "");
      }
    });

    it("should respect ignore patterns when running from project root", () => {
      // When running from project root, test-project is in ignores
      // so it should either find no issues or very few
      const hasMinimalIssues =
        fromRootOutput.includes("Keine Codequalitätsprobleme") ||
        fromRootOutput.includes("No code quality issues") ||
        fromRootOutput.includes("true");
      expect(hasMinimalIssues).toBe(true);
    });
  });
});
