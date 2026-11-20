import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "bun:test";

import { Command } from "commander";

import { resolveInputPath } from "./input-path";
import { CliInputParser } from "./parsing";

describe("CliInputParser.normalizeRemoteFlag", () => {
  const parse = (args: string[]): { remote: string; command?: string } => {
    const program = new Command()
      .option("--hermes")
      .option("--remote [instanceId]")
      .argument("[command]")
      .argument("[args...]")
      .allowUnknownOption();
    program.parse(
      CliInputParser.normalizeRemoteFlag(args, (arg) => arg === "user-update"),
      { from: "user" },
    );
    return {
      remote: program.opts<{ remote: string }>().remote,
      command: program.args[0],
    };
  };

  it("preserves the command after bare --remote", () => {
    expect(parse(["--hermes", "--remote", "user-update", "--id=demo"])).toEqual({
      remote: "thea",
      command: "user-update",
    });
  });

  it("accepts explicit labels with equals or a space", () => {
    expect(parse(["--remote=user-update", "user-update"])).toEqual({
      remote: "user-update",
      command: "user-update",
    });
    expect(parse(["--remote", "peer", "user-update"])).toEqual({
      remote: "peer",
      command: "user-update",
    });
  });

  it("leaves literals after -- unchanged", () => {
    const args = ["user-update", "--", "--remote", "user-update"];
    expect(CliInputParser.normalizeRemoteFlag(args, () => true)).toEqual(args);
  });
});

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
