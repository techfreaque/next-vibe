#!/usr/bin/env node
/* eslint-disable i18next/no-literal-string */
/* eslint-disable no-console */
import { Command } from "commander";

import { release } from "./commands/release.js";

const program = new Command();

program
  .name("release-tool")
  .description("CLI tool for managing package releases")
  .version("1.0.0");

program
  .command("release")
  .description("Run the release process")
  .option("-c, --config <path>", "Path to release config file")
  .option(
    "--ci",
    "Run in CI mode (no interactive prompts, use ciReleaseCommand)",
  )
  .option("--force-update", "Force update all dependencies without prompting")
  .action(
    async (options: {
      config?: string;
      ci?: boolean;
      forceUpdate?: boolean;
    }) => {
      try {
        await release(
          options.config,
          options.ci || false,
          options.forceUpdate || false,
        );
        // eslint-disable-next-line i18next/no-literal-string
        process.stdout.write("Release process completed successfully.\n");
        process.exit(0);
      } catch (error) {
        // eslint-disable-next-line i18next/no-literal-string
        const errorMsg = error instanceof Error ? error.message : String(error);
        process.stderr.write(`Error during release process: ${errorMsg}\n`);
        process.exit(1);
      }
    },
  );

// Default command when no subcommand is provided
program.action(async () => {
  try {
    await release();
    // eslint-disable-next-line i18next/no-literal-string
    process.stdout.write("Release process completed successfully.\n");
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line i18next/no-literal-string
    const errorMsg = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Error during release process: ${errorMsg}\n`);
    process.exit(1);
  }
});

program.parse();

export type * from "./types/index.js";
