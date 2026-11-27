import { mkdirSync, mkdtempSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve, sep } from "node:path";

export function testRoot(): string {
  const dir = join(homedir(), ".cache", "vibe-coding-agent-tests");
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  return dir;
}

const created: string[] = [];

export function testDir(prefix: string): string {
  const dir = mkdtempSync(join(testRoot(), prefix));
  created.push(dir);
  return dir;
}

/** Archive only the folders this test process created. */
export function removeTestDirs(): void {
  const root = resolve(testRoot()) + sep;
  const archive = join(
    process.cwd(),
    ".tmp",
    "todelete",
    "vibe-coding-agent-tests",
  );
  mkdirSync(archive, { recursive: true });
  for (const dir of created.splice(0)) {
    if (resolve(dir).startsWith(root)) {
      const destination = join(
        archive,
        `${new Date()
          .toISOString()
          .replaceAll(":", "-")}-${crypto.randomUUID()}`,
      );
      renameSync(dir, destination);
    }
  }
}
