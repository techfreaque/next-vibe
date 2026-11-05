// Testing infrastructure - messages are for the developer running the suites

/**
 * E2E runner — every *.e2e.test.ts in its own `bun test` process, then the
 * coverage report.
 *
 *   bun src/vibe/tooling/testing/e2e/run.ts [filter...] [--min=N]
 *
 * One process per file: Playwright's Chromium does not survive a second spec
 * file in the same `bun test` process (the earlier file's teardown reaps it),
 * so later suites fail with "browser has been closed". `filter` args keep only
 * spec paths containing one of them.
 */

import { Glob } from "bun";

const args = process.argv.slice(2);
const filters = args.filter((arg) => !arg.startsWith("--"));
const reportArgs = args.filter((arg) => arg.startsWith("--min="));

const specs = [...new Glob("src/**/*.e2e.test.ts").scanSync(".")]
  .map((path) => path.replaceAll("\\", "/"))
  .filter(
    (path) =>
      filters.length === 0 || filters.some((filter) => path.includes(filter)),
  )
  .toSorted();

const failed: string[] = [];
for (const [index, spec] of specs.entries()) {
  process.stdout.write(`\n[e2e ${index + 1}/${specs.length}] ${spec}\n`);
  const run = Bun.spawnSync(["bun", "test", "--isolate", spec], {
    stdout: "inherit",
    stderr: "inherit",
  });
  if (run.exitCode !== 0) {
    failed.push(spec);
  }
}

const report = Bun.spawnSync(
  ["bun", "src/vibe/tooling/testing/e2e/coverage-report.ts", ...reportArgs],
  { stdout: "inherit", stderr: "inherit" },
);

process.stdout.write(
  `\n[e2e] ${specs.length - failed.length}/${specs.length} spec files passed\n`,
);
for (const spec of failed) {
  process.stdout.write(`  ✗ ${spec}\n`);
}
process.exit(failed.length > 0 || report.exitCode !== 0 ? 1 : 0);
