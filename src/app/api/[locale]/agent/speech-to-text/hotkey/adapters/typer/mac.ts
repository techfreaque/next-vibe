/**
 * macOS Typer Implementation
 * Uses AppleScript with clipboard for reliable text insertion
 */
/// <reference types="bun-types" />

import "server-only";

import { TyperBackend } from "../../enum";
import { dependencyChecker, escapeShellString } from "../../utils/dependencies";
import { BaseTyper } from "./base";

/**
 * macOS typer using AppleScript clipboard + paste
 * Most reliable method across all macOS applications
 */
export class MacTyper extends BaseTyper {
  constructor(
    private readonly options: {
      readonly useDirectTyping?: boolean;
    } = {},
  ) {
    super(TyperBackend.APPLESCRIPT);
  }

  async checkDependencies(): Promise<boolean> {
    // pbcopy and osascript are built into macOS
    const hasPbcopy = await dependencyChecker.which("pbcopy");
    const hasOsascript = await dependencyChecker.which("osascript");
    return hasPbcopy !== null && hasOsascript !== null;
  }

  protected async insertTextImpl(text: string): Promise<void> {
    // Step 1: Copy text to clipboard using pbcopy
    const escapedText = escapeShellString(text);
    const copyProc = Bun.spawn([
      "bash",
      "-c",
      `printf '%s' "${escapedText}" | pbcopy`,
    ]);

    const copyExitCode = await copyProc.exited;
    if (copyExitCode !== 0) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(
        `Failed to copy text to clipboard (exit code: ${copyExitCode})`,
      );
    }

    // Step 2: Use AppleScript to paste (Command+V)
    const appleScript = `
      tell application "System Events"
        keystroke "v" using command down
      end tell
    `;

    const pasteProc = Bun.spawn(["osascript", "-e", appleScript], {
      stdout: "ignore",
      stderr: "pipe",
    });

    const pasteExitCode = await pasteProc.exited;
    if (pasteExitCode !== 0) {
      const stderr = await new Response(pasteProc.stderr).text();
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(`Failed to paste text: ${stderr}`);
    }

    // Small delay to ensure paste completes
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
  }
}

/**
 * Factory function for macOS typer
 */
export function createMacTyper(options?: {
  readonly useDirectTyping?: boolean;
}): MacTyper {
  return new MacTyper(options);
}
