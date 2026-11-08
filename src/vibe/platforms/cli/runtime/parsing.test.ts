import { describe, expect, it } from "bun:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { resolveInputPath } from "./input-path";
import { CliInputParser } from "./parsing";

describe("CliInputParser.parseCliArgumentsSimple", () => {
  it("keeps everything after -- positional, flags included", () => {
    const parsed = CliInputParser.parseCliArgumentsSimple([
      "--name",
      "x",
      "--",
      "git",
      "--version",
    ]);
    expect(parsed.positionalArgs).toEqual(["git", "--version"]);
    expect(parsed.namedArgs).toEqual({ name: "x" });
  });

  it("parses numbers and booleans when the endpoint is unknown", () => {
    const parsed = CliInputParser.parseCliArgumentsSimple([
      "--count=3",
      "--flag=true",
    ]);
    expect(parsed.namedArgs).toEqual({ count: 3, flag: true });
  });
});

describe("resolveInputPath", () => {
  it("falls back to the invocation directory for a relative file", () => {
    const invocation = mkdtempSync(join(tmpdir(), "vibe-invocation-"));
    const root = mkdtempSync(join(tmpdir(), "vibe-root-"));
    writeFileSync(join(invocation, "note.txt"), "hi");
    expect(resolveInputPath("note.txt", invocation, root)).toBe(
      join(invocation, "note.txt"),
    );
  });

  it("prefers the project root when the file exists there", () => {
    const invocation = mkdtempSync(join(tmpdir(), "vibe-invocation-"));
    const root = mkdtempSync(join(tmpdir(), "vibe-root-"));
    writeFileSync(join(root, "note.txt"), "hi");
    writeFileSync(join(invocation, "note.txt"), "other");
    expect(resolveInputPath("note.txt", invocation, root)).toBe(
      join(root, "note.txt"),
    );
  });

  it("names the project-root path when the file exists nowhere", () => {
    const invocation = mkdtempSync(join(tmpdir(), "vibe-invocation-"));
    const root = mkdtempSync(join(tmpdir(), "vibe-root-"));
    expect(resolveInputPath("missing.txt", invocation, root)).toBe(
      join(root, "missing.txt"),
    );
  });
});
