import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { PackageJson } from "../types/index.js";
import { logger } from "./logger.js";
import { runSnykMonitor, runSnykTest } from "./snyk.js";

/**
 * Runs tests for the given package path.
 */
export function runTests(packagePath: string): void {
  const pkgPath = `${packagePath}/package.json`;
  if (!existsSync(pkgPath)) {
    logger(`No package.json found in ${packagePath}, skipping tests.`);
    return;
  }

  const packageJson = JSON.parse(readFileSync(pkgPath, "utf8")) as PackageJson;
  if (!packageJson.scripts?.["test"]) {
    logger(
      `No test script found in package.json at ${pkgPath}, skipping tests.`,
    );
    return;
  }

  try {
    execSync(`yarn test`, { stdio: "inherit", cwd: packagePath });
  } catch {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(`Tests failed in ${packagePath}`);
  }
}

export const lint = (cwd: string): void => {
  let lintOutput = "";
  try {
    // Use the local eslint binary directly from node_modules
    const eslintPath = join(cwd, "node_modules", ".bin", "eslint");

    // Check if eslint exists and use it directly
    if (existsSync(eslintPath)) {
      lintOutput = execSync(`${eslintPath} --fix`, {
        encoding: "utf8",
        // eslint-disable-next-line node/no-process-env
        env: { ...process.env, FORCE_COLOR: "1" },
        cwd: cwd,
      });
    } else {
      // Fall back to yarn lint if eslint binary not found
      lintOutput = execSync(`yarn lint`, {
        encoding: "utf8",
        // eslint-disable-next-line node/no-process-env
        env: { ...process.env, FORCE_COLOR: "1" },
        cwd: cwd,
      });
    }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "stdout" in error &&
      error.stdout
    ) {
      lintOutput =
        (error as { stdout?: string | Buffer }).stdout?.toString() ?? "";
    } else if (error instanceof Error) {
      lintOutput = error.message;
    } else {
      lintOutput = "Unknown linting error.";
    }
    // eslint-disable-next-line no-console
    console.error(`\n${lintOutput}`);
    // eslint-disable-next-line no-console
    console.error(
      `%c[release-tool][ERROR] Linting errors detected in ${cwd}. Aborting release.`,
      "color: red; font-size: larger;",
    );
    // If there is any lint output (e.g. warnings), print it at the bottom
    if (lintOutput.trim().length > 0) {
      logger(`\n${lintOutput}`);
    }
    process.exit(1);
  }
};

export const typecheck = (cwd: string): void => {
  // Check if tsconfig.json exists in the package directory
  const tsconfigPath = join(cwd, "tsconfig.json");
  if (!existsSync(tsconfigPath)) {
    logger(`No tsconfig.json found in ${cwd}, skipping typecheck.`);
    return;
  }

  try {
    // Try to use local TypeScript binary first
    const tscPath = join(cwd, "node_modules", ".bin", "tsc");

    if (existsSync(tscPath)) {
      // Use local tsc binary with --noEmit flag for type checking only
      execSync(`${tscPath} --noEmit`, {
        stdio: "inherit",
        cwd,
        // eslint-disable-next-line node/no-process-env
        env: { ...process.env, FORCE_COLOR: "1" },
      });
    } else {
      // Fall back to yarn/npm script if available
      const packageJson = JSON.parse(
        readFileSync(join(cwd, "package.json"), "utf8"),
      ) as PackageJson;
      if (packageJson.scripts?.["typecheck"]) {
        execSync(`yarn typecheck`, { stdio: "inherit", cwd });
      } else {
        // Try global tsc as last resort
        execSync(`tsc --noEmit`, {
          stdio: "inherit",
          cwd,
          // eslint-disable-next-line node/no-process-env
          env: { ...process.env, FORCE_COLOR: "1" },
        });
      }
    }
    logger(`TypeScript type checking passed for ${cwd}`);
  } catch {
    // eslint-disable-next-line no-console
    console.error(
      `%c[release-tool][ERROR] TypeScript type checking failed in ${cwd}. Aborting release.`,
      "color: red; font-size: larger;",
    );
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(`TypeScript type checking failed in ${cwd}`);
  }
};

export const build = (cwd: string): void => {
  execSync(`yarn build`, { stdio: "inherit", cwd });
};

/**
 * Runs Snyk vulnerability test for a package (local mode)
 */
export function snykTest(cwd: string): void {
  const packageJson = getPackageJson(cwd);
  runSnykTest(cwd, packageJson.name);
}

/**
 * Runs Snyk monitor to upload to dashboard (CI mode)
 */
export function snykMonitor(cwd: string): void {
  const packageJson = getPackageJson(cwd);
  runSnykMonitor(cwd, packageJson.name);
}

/**
 * Gets package.json from a directory
 */
function getPackageJson(cwd: string): PackageJson {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(`No package.json found in ${cwd}`);
  }
  return JSON.parse(readFileSync(pkgPath, "utf8")) as PackageJson;
}
