import { describe, expect, it } from "bun:test";

import { filterIssues, matchesFilter, parseFilters } from "./filter-utils";

describe("parseFilters", () => {
  it("should return empty array for undefined filter", () => {
    expect(parseFilters(undefined)).toEqual([]);
  });

  it("should return empty array for empty string", () => {
    expect(parseFilters("")).toEqual([]);
  });

  it("should handle single string filter", () => {
    const patterns = parseFilters("test");
    expect(patterns.length).toBe(1);
  });

  it("should handle array of filters", () => {
    const patterns = parseFilters(["filter1", "filter2"]);
    expect(patterns.length).toBe(2);
  });

  it("should handle explicit regex with slashes and flags", () => {
    const patterns = parseFilters(String.raw`/test\.ts$/i`);
    expect(patterns.length).toBe(1);
    expect(patterns[0].test("foo.test.ts")).toBe(true);
    expect(patterns[0].test("FOO.TEST.TS")).toBe(true);
    expect(patterns[0].test("foo.ts")).toBe(false);
  });

  it("should handle glob pattern *.test.ts", () => {
    const patterns = parseFilters("*.test.ts");
    expect(patterns.length).toBe(1);
    expect(patterns[0].test("foo.test.ts")).toBe(true);
    expect(patterns[0].test("bar.test.ts")).toBe(true);
    expect(patterns[0].test("foo.ts")).toBe(false);
    // Patterns without slashes are recursive, so they match in any directory
    expect(patterns[0].test("src/foo.test.ts")).toBe(true);
  });

  it("should handle glob pattern src/*.tsx", () => {
    const patterns = parseFilters("src/*.tsx");
    expect(patterns.length).toBe(1);
    expect(patterns[0].test("src/foo.tsx")).toBe(true);
    expect(patterns[0].test("src/components/button.tsx")).toBe(false);
  });

  it("should handle glob pattern src/**/*.tsx", () => {
    const patterns = parseFilters("src/**/*.tsx");
    expect(patterns.length).toBe(1);
    expect(patterns[0].test("src/foo.tsx")).toBe(true);
    expect(patterns[0].test("src/components/button.tsx")).toBe(true);
    expect(patterns[0].test("src/app/pages/home.tsx")).toBe(true);
    expect(patterns[0].test("app/foo.tsx")).toBe(false);
  });

  it("should handle glob pattern with ? wildcard", () => {
    const patterns = parseFilters("file?.ts");
    expect(patterns.length).toBe(1);
    expect(patterns[0].test("file1.ts")).toBe(true);
    expect(patterns[0].test("fileA.ts")).toBe(true);
    expect(patterns[0].test("file12.ts")).toBe(false);
  });

  it("should treat bare regex as regex if it has regex syntax", () => {
    const patterns = parseFilters("\\w+\\.test\\.ts$");
    expect(patterns.length).toBe(1);
    expect(patterns[0].test("foo.test.ts")).toBe(true);
    expect(patterns[0].test("bar.test.ts")).toBe(true);
  });

  it("should treat plain text as case-insensitive substring match", () => {
    const patterns = parseFilters("unused");
    expect(patterns.length).toBe(1);
    expect(patterns[0].test("unused-variable")).toBe(true);
    expect(patterns[0].test("UNUSED")).toBe(true);
    expect(patterns[0].test("no-unused-vars")).toBe(true);
  });

  it("should handle multiple filters with OR logic", () => {
    const patterns = parseFilters(["*.test.ts", "*.spec.ts"]);
    expect(patterns.length).toBe(2);
    expect(patterns[0].test("foo.test.ts")).toBe(true);
    expect(patterns[1].test("foo.spec.ts")).toBe(true);
  });
});

describe("matchesFilter", () => {
  it("should match all issues when no patterns", () => {
    const issue = { file: "src/foo.ts", message: "error", rule: "no-unused" };
    expect(matchesFilter(issue, [])).toBe(true);
  });

  it("should match file path against pattern", () => {
    const issue = { file: "src/foo.test.ts", message: "error", rule: "test" };
    const patterns = parseFilters("*.test.ts");
    expect(matchesFilter(issue, patterns)).toBe(true);
  });

  it("should match message against pattern", () => {
    const issue = {
      file: "src/foo.ts",
      message: "variable is unused",
      rule: "no-unused",
    };
    const patterns = parseFilters("unused");
    expect(matchesFilter(issue, patterns)).toBe(true);
  });

  it("should match rule against pattern", () => {
    const issue = {
      file: "src/foo.ts",
      message: "error",
      rule: "no-unused-vars",
    };
    const patterns = parseFilters("no-unused");
    expect(matchesFilter(issue, patterns)).toBe(true);
  });

  it("should support multiple patterns with OR logic", () => {
    const issue = { file: "src/foo.ts", message: "error", rule: "eslint" };
    const patterns = parseFilters(["oxlint", "eslint"]);
    expect(matchesFilter(issue, patterns)).toBe(true);
  });

  it("should not match when pattern doesn't match anything", () => {
    const issue = { file: "src/foo.ts", message: "error", rule: "test" };
    const patterns = parseFilters("nonexistent");
    expect(matchesFilter(issue, patterns)).toBe(false);
  });
});

describe("filterIssues", () => {
  const issues = [
    {
      file: "src/foo.test.ts",
      message: "unused var",
      severity: "error",
      rule: "no-unused",
    },
    {
      file: "src/bar.ts",
      message: "missing type",
      severity: "warning",
      rule: "no-implicit-any",
    },
    {
      file: "src/components/button.tsx",
      message: "unused import",
      severity: "error",
      rule: "no-unused",
    },
    {
      file: "test/helper.test.ts",
      message: "console found",
      severity: "warning",
      rule: "no-console",
    },
  ];

  it("should return all issues when no filter", () => {
    const result = filterIssues(issues, undefined);
    expect(result.length).toBe(4);
  });

  it("should filter by glob pattern *.test.ts", () => {
    const result = filterIssues(issues, "*.test.ts");
    // *.test.ts is recursive, so it matches all .test.ts files
    expect(result.length).toBe(2);
    expect(result.map((r) => r.file).toSorted()).toEqual([
      "src/foo.test.ts",
      "test/helper.test.ts",
    ]);
  });

  it("should filter by glob pattern src/**/*", () => {
    const result = filterIssues(issues, "src/**/*");
    expect(result.length).toBe(3);
    expect(result.map((i) => i.file).toSorted()).toEqual([
      "src/bar.ts",
      "src/components/button.tsx",
      "src/foo.test.ts",
    ]);
  });

  it("should filter by rule name", () => {
    const result = filterIssues(issues, "no-unused");
    expect(result.length).toBe(2);
    expect(result[0].rule).toBe("no-unused");
    expect(result[1].rule).toBe("no-unused");
  });

  it("should filter by error message", () => {
    const result = filterIssues(issues, "unused");
    expect(result.length).toBe(2);
  });

  it("should support multiple filters", () => {
    const result = filterIssues(issues, ["*.test.ts", "no-console"]);
    expect(result.length).toBe(2);
  });

  it("should be case insensitive for text matching", () => {
    const result = filterIssues(issues, "UNUSED");
    expect(result.length).toBe(2);
  });

  it("should filter by regex pattern", () => {
    const result = filterIssues(issues, String.raw`/test\.ts$/`);
    expect(result.length).toBe(2);
    expect(result.every((i) => i.file.includes("test.ts"))).toBe(true);
  });

  it("should handle complex glob patterns", () => {
    const result = filterIssues(issues, "**/*.tsx");
    expect(result.length).toBe(1);
    expect(result[0].file).toBe("src/components/button.tsx");
  });
});

describe("edge cases", () => {
  it("should handle filters with special regex characters in literal context", () => {
    const patterns = parseFilters("@types/node");
    expect(patterns.length).toBe(1);
    const issue = {
      file: "node_modules/@types/node/index.d.ts",
      message: "error",
      rule: "test",
    };
    expect(matchesFilter(issue, patterns)).toBe(true);
  });

  it("should handle empty filter array", () => {
    const result = filterIssues([], "*.test.ts");
    expect(result.length).toBe(0);
  });

  it("should handle issues without optional fields", () => {
    const issue = { file: "src/foo.ts", message: "error" };
    const patterns = parseFilters("error");
    expect(matchesFilter(issue, patterns)).toBe(true);
  });

  it("should handle whitespace in filter", () => {
    const patterns = parseFilters("  unused  ");
    expect(patterns.length).toBe(1);
    const issue = {
      file: "src/foo.ts",
      message: "variable unused",
      rule: "no-unused",
    };
    expect(matchesFilter(issue, patterns)).toBe(true);
  });

  it("should skip empty filters in arrays", () => {
    const patterns = parseFilters(["", "test", ""]);
    expect(patterns.length).toBe(1);
  });
});
