/**
 * Windows Typer Implementation
 * Uses PowerShell for clipboard and SendKeys
 */
/// <reference types="bun-types" />


import "server-only";

import { TyperBackend } from "../../enum";
import { dependencyChecker } from "../../utils/dependencies";
import { BaseTyper } from "./base";

/**
 * Windows typer using PowerShell clipboard + SendKeys
 */
export class WindowsTyper extends BaseTyper {
  constructor() {
    super(TyperBackend.POWERSHELL);
  }

  async checkDependencies(): Promise<boolean> {
    // PowerShell is built into Windows
    const hasPowershell = await dependencyChecker.which("powershell");
    return hasPowershell !== null;
  }

  protected async insertTextImpl(text: string): Promise<void> {
    // Escape single quotes for PowerShell
    const escapedText = text.replaceAll('\'', "''");

    // Step 1: Set clipboard using PowerShell
    const setClipCommand = `Set-Clipboard -Value '${escapedText}'`;
    const setClipProc = Bun.spawn(
      ["powershell", "-NoProfile", "-Command", setClipCommand],
      {
        stdout: "ignore",
        stderr: "pipe",
      },
    );

    const setClipExitCode = await setClipProc.exited;
    if (setClipExitCode !== 0) {
      const stderr = await new Response(setClipProc.stderr).text();
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(`Failed to set clipboard: ${stderr}`);
    }

    // Step 2: Send Ctrl+V using PowerShell SendKeys
    const pasteCommand = `
      $ws = New-Object -ComObject wscript.shell;
      $processes = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 };
      if ($processes.Length -gt 0) {
        $ws.AppActivate($processes[0].Id) | Out-Null;
        Start-Sleep -Milliseconds 100;
        $ws.SendKeys('^v');
      }
    `;

    const pasteProc = Bun.spawn(
      ["powershell", "-NoProfile", "-Command", pasteCommand],
      {
        stdout: "ignore",
        stderr: "pipe",
      },
    );

    const pasteExitCode = await pasteProc.exited;
    if (pasteExitCode !== 0) {
      const stderr = await new Response(pasteProc.stderr).text();
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Typer execution error
      throw new Error(`Failed to paste: ${stderr}`);
    }

    // Small delay to ensure paste completes
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 150);
    });
  }
}

/**
 * Factory function for Windows typer
 */
export function createWindowsTyper(): WindowsTyper {
  return new WindowsTyper();
}
