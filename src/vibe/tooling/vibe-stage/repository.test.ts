/**
 * vibe-stage camelCase-rename classification unit tests.
 *
 * Pure-function coverage for allLinesAreCamelCaseRenames — the hunk classifier
 * that decides whether a diff is nothing but camelCase identifier renames and
 * may therefore be auto-staged.
 */

import { describe, expect, it } from "bun:test";

import {
  allLinesAreCamelCaseRenames,
  allLinesAreMarkdownTableReflow,
  allLinesAreWhitespaceOnly,
} from "./repository";

/** Build a `--unified=0` changed-line block from paired old/new lines. */
function hunk(pairs: Array<[string, string]>): string[] {
  return [
    ...pairs.map(([oldLine]) => `-${oldLine}`),
    ...pairs.map(([, newLine]) => `+${newLine}`),
  ];
}

describe("allLinesAreCamelCaseRenames", () => {
  it("accepts a camelCase → camelCase rename", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const userName = resolve();", "  const displayName = resolve();"]]),
      ),
    ).toBe(true);
  });

  it("accepts a single all-lowercase word as camelCase", () => {
    expect(
      allLinesAreCamelCaseRenames(hunk([["  return single;", "  return item;"]])),
    ).toBe(true);
  });

  it("accepts several renames on one line", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const fooBar = bazQux(fooBar);", "  const newBar = newQux(newBar);"]]),
      ),
    ).toBe(true);
  });

  it("accepts a multi-line hunk of renames", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([
          ["  const userName = a;", "  const displayName = a;"],
          ["  log(userName);", "  log(displayName);"],
        ]),
      ),
    ).toBe(true);
  });

  // ── Cross-case is never a rename ────────────────────────────────────────
  it("rejects snake_case → camelCase (cross-case)", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const user_name = a;", "  const userName = a;"]]),
      ),
    ).toBe(false);
  });

  it("rejects camelCase → PascalCase (cross-case)", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const userName = a;", "  const UserName = a;"]]),
      ),
    ).toBe(false);
  });

  it("rejects camelCase → CONSTANT_CASE (cross-case)", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const userName = a;", "  const USER_NAME = a;"]]),
      ),
    ).toBe(false);
  });

  it("rejects camelCase → kebab-case (cross-case)", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const userName = a;", "  const user-name = a;"]]),
      ),
    ).toBe(false);
  });

  // ── Keyword / literal swaps are semantic edits, not renames ─────────────
  it("rejects a keyword swap that looks like a one-word rename", () => {
    expect(
      allLinesAreCamelCaseRenames(hunk([["  const a = 1;", "  let a = 1;"]])),
    ).toBe(false);
  });

  it("rejects a boolean literal flip", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const enabled = true;", "  const enabled = false;"]]),
      ),
    ).toBe(false);
  });

  it("rejects a primitive type change", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  let id: string;", "  let id: number;"]]),
      ),
    ).toBe(false);
  });

  // ── String contents are data, not references ───────────────────────────
  it("rejects a rename inside a string literal", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([['  t("userName");', '  t("displayName");']]),
      ),
    ).toBe(false);
  });

  it("accepts a rename outside a string while the string is untouched", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([
          ['  const userName = t("user.name");', '  const displayName = t("user.name");'],
        ]),
      ),
    ).toBe(true);
  });

  // ── Structural changes are not renames ─────────────────────────────────
  it("rejects a numeric literal change", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const limit = 10;", "  const limit = 20;"]]),
      ),
    ).toBe(false);
  });

  it("rejects an added call argument", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  doThing(userName);", "  doThing(userName, extra);"]]),
      ),
    ).toBe(false);
  });

  it("rejects an indentation-only reflow", () => {
    expect(
      allLinesAreCamelCaseRenames(
        hunk([["  const userName = a;", "    const userName = a;"]]),
      ),
    ).toBe(false);
  });

  it("rejects unbalanced add/remove counts", () => {
    expect(
      allLinesAreCamelCaseRenames([
        "-  const userName = a;",
        "+  const displayName = a;",
        "+  const extra = b;",
      ]),
    ).toBe(false);
  });

  it("rejects a pure addition", () => {
    expect(allLinesAreCamelCaseRenames(["+  const userName = a;"])).toBe(false);
  });

  it("rejects an empty hunk", () => {
    expect(allLinesAreCamelCaseRenames([])).toBe(false);
  });
});

describe("allLinesAreWhitespaceOnly", () => {
  it("accepts a single-line re-indent", () => {
    expect(
      allLinesAreWhitespaceOnly(["-            });", "+          });"]),
    ).toBe(true);
  });

  it("accepts a multi-line block reflow", () => {
    expect(
      allLinesAreWhitespaceOnly([
        "-        <NavigationStackProvider>",
        "-          <EndpointRenderer",
        "+          <NavigationStackProvider>",
        "+            <EndpointRenderer",
      ]),
    ).toBe(true);
  });

  it("rejects a pair with a real content change alongside the reflow", () => {
    expect(
      allLinesAreWhitespaceOnly([
        "-        const userName = a;",
        "+          const displayName = a;",
      ]),
    ).toBe(false);
  });

  it("rejects a pair that is byte-identical (not actually a diff)", () => {
    expect(
      allLinesAreWhitespaceOnly(["-        const a = 1;", "+        const a = 1;"]),
    ).toBe(false);
  });

  it("rejects a pair of all-whitespace lines", () => {
    expect(allLinesAreWhitespaceOnly(["-    ", "+  "])).toBe(false);
  });

  it("rejects unbalanced add/remove counts", () => {
    expect(
      allLinesAreWhitespaceOnly([
        "-        const a = 1;",
        "+          const a = 1;",
        "+          const b = 2;",
      ]),
    ).toBe(false);
  });

  it("rejects a pure addition", () => {
    expect(allLinesAreWhitespaceOnly(["+          const a = 1;"])).toBe(false);
  });

  it("rejects an empty hunk", () => {
    expect(allLinesAreWhitespaceOnly([])).toBe(false);
  });

  it("accepts a multi-line call collapsed onto one line (same tokens, different line count)", () => {
    expect(
      allLinesAreWhitespaceOnly([
        "-      reportToServer(",
        "-        level,",
        "-        message,",
        "-        error,",
        "-      );",
        "+      reportToServer(level, message, error);",
      ]),
    ).toBe(true);
  });

  it("accepts a collapse where the multi-line form has a trailing comma", () => {
    expect(
      allLinesAreWhitespaceOnly([
        "-      reportToServer(",
        "-        level,",
        "-        message,",
        "-        error,",
        "-        tabId,",
        "-      );",
        "+      reportToServer(level, message, error, tabId);",
      ]),
    ).toBe(true);
  });

  it("rejects a collapse that also drops an argument", () => {
    expect(
      allLinesAreWhitespaceOnly([
        "-      reportToServer(",
        "-        level,",
        "-        message,",
        "-        error,",
        "-        tabId,",
        "-      );",
        "+      reportToServer(level, message, error);",
      ]),
    ).toBe(false);
  });

  it("accepts a single line expanded across multiple lines", () => {
    expect(
      allLinesAreWhitespaceOnly([
        "-      onEvent: async ({ requestData, locale, user }) => {",
        "+      onEvent: async ({",
        "+        requestData,",
        "+        locale,",
        "+        user,",
        "+      }) => {",
      ]),
    ).toBe(true);
  });

  it("rejects a spacing change inside a string literal (real content, not layout)", () => {
    expect(
      allLinesAreWhitespaceOnly([
        '-  t("click  here");',
        '+  t("click here");',
      ]),
    ).toBe(false);
  });

  it("accepts reflow around an untouched string literal", () => {
    expect(
      allLinesAreWhitespaceOnly([
        '-  const msg =    t("click here");',
        '+  const msg = t("click here");',
      ]),
    ).toBe(true);
  });
});

describe("allLinesAreMarkdownTableReflow", () => {
  it("accepts a column-width realignment across header, separator, and data rows", () => {
    expect(
      allLinesAreMarkdownTableReflow([
        "-| Instance   | CLI flags          | Role                                |",
        "-| ---------- | ------------------ | ------------------------------------ |",
        "-| **Atlas**  | _(no flags)_       | Dev/coding instance. You live here. |",
        "+| Instance   | CLI flags           | Role                                |",
        "+| ---------- | ------------------- | ------------------------------------ |",
        "+| **Atlas**  | _(no flags)_        | Dev/coding instance. You live here. |",
      ]),
    ).toBe(true);
  });

  it("rejects a cell content change disguised as realignment", () => {
    expect(
      allLinesAreMarkdownTableReflow([
        "-| Instance   | Role       |",
        "+| Instance   | Function   |",
      ]),
    ).toBe(false);
  });

  it("rejects an alignment-colon change on a separator row", () => {
    expect(
      allLinesAreMarkdownTableReflow(["-| --- |", "+| ---: |"]),
    ).toBe(false);
  });

  it("rejects a non-table line", () => {
    expect(
      allLinesAreMarkdownTableReflow(["-const a = 1;", "+const a = 2;"]),
    ).toBe(false);
  });

  it("rejects unbalanced row counts", () => {
    expect(
      allLinesAreMarkdownTableReflow([
        "-| a | b |",
        "+| a | b |",
        "+| c | d |",
      ]),
    ).toBe(false);
  });

  it("rejects an empty hunk", () => {
    expect(allLinesAreMarkdownTableReflow([])).toBe(false);
  });
});
