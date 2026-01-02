/**
 * Linux X11 Typer Implementation
 * Uses xdotool for direct typing or xclip for clipboard paste
 */
/// <reference types="bun-types" />

import "server-only";

import { TyperBackend } from "../../enum";
import { dependencyChecker, escapeShellString } from "../../utils/dependencies";
import { BaseTyper } from "./base";

/**
 * Linux X11 typer using xdotool (direct typing)
 */
export class LinuxX11XdotoolTyper extends BaseTyper {
  constructor(
    private readonly options: {
      readonly typingDelay?: number;
    } = {},
  ) {
    super(TyperBackend.XDOTOOL);
  }

  async checkDependencies(): Promise<boolean> {
    const hasXdotool = await dependencyChecker.which("xdotool");
    return hasXdotool !== null;
  }

  protected async insertTextImpl(text: string): Promise<void> {
    const args: string[] = ["type"];

    if (this.options.typingDelay === undefined) {
      args.push("--delay", "0");
    } else {
      args.push("--delay", String(this.options.typingDelay));
    }

    args.push("--", text);

    const proc = Bun.spawn(["xdotool", ...args], {
      stdout: "ignore",
      stderr: "pipe",
    });

    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text();
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(`xdotool failed: ${stderr}`);
    }
  }
}

/**
 * Linux X11 typer using xclip (clipboard + paste)
 * Fallback when xdotool is not available
 */
export class LinuxX11ClipboardTyper extends BaseTyper {
  constructor() {
    super(TyperBackend.XCLIP);
  }

  async checkDependencies(): Promise<boolean> {
    const hasXclip = await dependencyChecker.which("xclip");
    const hasXdotool = await dependencyChecker.which("xdotool");
    return hasXclip !== null && hasXdotool !== null;
  }

  protected async insertTextImpl(text: string): Promise<void> {
    // Step 1: Copy to clipboard
    const escapedText = escapeShellString(text);
    const copyProc = Bun.spawn([
      "bash",
      "-c",
      `printf '%s' "${escapedText}" | xclip -selection clipboard`,
    ]);

    const copyExitCode = await copyProc.exited;
    if (copyExitCode !== 0) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(`Failed to copy to clipboard (exit code: ${copyExitCode})`);
    }

    // Step 2: Paste using xdotool (Ctrl+V)
    const pasteProc = Bun.spawn(["xdotool", "key", "ctrl+v"], {
      stdout: "ignore",
      stderr: "pipe",
    });

    const pasteExitCode = await pasteProc.exited;
    if (pasteExitCode !== 0) {
      const stderr = await new Response(pasteProc.stderr).text();
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(`Failed to paste: ${stderr}`);
    }

    // Small delay to ensure paste completes
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 100);
    });
  }
}

/**
 * Factory function for Linux X11 typer
 */
export function createLinuxX11Typer(
  preferClipboard = false,
  options?: {
    readonly typingDelay?: number;
  },
): LinuxX11XdotoolTyper | LinuxX11ClipboardTyper {
  if (preferClipboard) {
    return new LinuxX11ClipboardTyper();
  }
  return new LinuxX11XdotoolTyper(options);
}
