/**
 * Linux Wayland Typer Implementation
 * Uses wtype for direct typing or wl-clipboard for paste
 */
/// <reference types="bun-types" />


import "server-only";

import { TyperBackend } from "../../enum";
import { dependencyChecker, escapeShellString } from "../../utils/dependencies";
import { BaseTyper } from "./base";

/**
 * Linux Wayland typer using wtype (direct typing)
 */
export class LinuxWaylandWtypeTyper extends BaseTyper {
  constructor(
    private readonly options: {
      readonly typingDelay?: number;
    } = {},
  ) {
    super(TyperBackend.WTYPE);
  }

  async checkDependencies(): Promise<boolean> {
    const hasWtype = await dependencyChecker.which("wtype");
    return hasWtype !== null;
  }

  protected async insertTextImpl(text: string): Promise<void> {
    const args: string[] = [];

    if (this.options.typingDelay) {
      args.push("-s", String(this.options.typingDelay));
    }

    args.push("--", text);

    const proc = Bun.spawn(["wtype", ...args], {
      stdout: "ignore",
      stderr: "pipe",
    });

    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text();
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(`wtype failed: ${stderr}`);
    }
  }
}

/**
 * Linux Wayland typer using wl-clipboard (clipboard + paste)
 * Fallback when wtype is not available
 */
export class LinuxWaylandClipboardTyper extends BaseTyper {
  constructor() {
    super(TyperBackend.WL_CLIPBOARD);
  }

  async checkDependencies(): Promise<boolean> {
    const hasWlCopy = await dependencyChecker.which("wl-copy");
    const hasWtype = await dependencyChecker.which("wtype");
    return hasWlCopy !== null && hasWtype !== null;
  }

  protected async insertTextImpl(text: string): Promise<void> {
    // Step 1: Copy to clipboard
    const escapedText = escapeShellString(text);
    const copyProc = Bun.spawn([
      "bash",
      "-c",
      `printf '%s' "${escapedText}" | wl-copy`,
    ]);

    const copyExitCode = await copyProc.exited;
    if (copyExitCode !== 0) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(`Failed to copy to clipboard (exit code: ${copyExitCode})`);
    }

    // Step 2: Paste using wtype (Ctrl+V)
    const pasteProc = Bun.spawn(["wtype", "-M", "ctrl", "v", "-m", "ctrl"], {
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
 * Factory function for Linux Wayland typer
 */
export function createLinuxWaylandTyper(
  preferClipboard = false,
  options?: {
    readonly typingDelay?: number;
  },
): LinuxWaylandWtypeTyper | LinuxWaylandClipboardTyper {
  if (preferClipboard) {
    return new LinuxWaylandClipboardTyper();
  }
  return new LinuxWaylandWtypeTyper(options);
}
