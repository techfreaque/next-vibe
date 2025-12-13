/**
 * Speech-to-Text Hotkey Daemon
 * Continuously listens for keyboard shortcuts to toggle STT recording
 */

/// <reference types="bun-types" />

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "./enum";
import { platformDetector } from "./utils/platform";

/**
 * Platform-specific hotkey detection configuration
 */
interface HotkeyConfig {
  readonly command: string;
  readonly args: readonly string[];
}

/**
 * Get platform-specific hotkey monitoring command
 */
function getHotkeyMonitor(): HotkeyConfig {
  const platform = platformDetector.detect();

  // Default hotkey: Ctrl+Shift+Space (cross-platform)
  switch (platform) {
    case Platform.MACOS:
      // Use AppleScript to monitor keyboard shortcuts
      return {
        command: "osascript",
        args: [
          "-e",
          `
          on run
            tell application "System Events"
              repeat
                -- Check for Ctrl+Shift+Space
                if (key code 49 using {control down, shift down}) then
                  return "TOGGLE"
                end if
                delay 0.1
              end repeat
            end tell
          end run
          `,
        ] as const,
      };

    case Platform.LINUX_WAYLAND:
      // For Wayland, use a simple keybinding approach
      // Users should set up their DE's keyboard shortcuts to call: vibe stt toggle
      // Or we use stdin for manual triggering
      return {
        command: "sh",
        args: [
          "-c",
          `
          echo "================================" >&2
          echo "STT Hotkey Daemon (Wayland)" >&2
          echo "================================" >&2
          echo "" >&2
          echo "Wayland doesn't allow direct keyboard monitoring." >&2
          echo "Set up a keyboard shortcut in your DE settings:" >&2
          echo "" >&2
          echo "  Command: vibe stt toggle" >&2
          echo "  Shortcut: Ctrl+Shift+Space (or your preference)" >&2
          echo "" >&2
          echo "OR press ENTER in this terminal to toggle:" >&2
          echo "" >&2
          echo "Ready - waiting for input..." >&2
          while true; do
            if read -r line; then
              echo "TOGGLE"
              echo "Received toggle command" >&2
            fi
          done
          `,
        ] as const,
      };

    case Platform.LINUX_X11:
      // Use xbindkeys or fallback to signal file
      return {
        command: "sh",
        args: [
          "-c",
          `
          # Check if xbindkeys is available
          if command -v xbindkeys >/dev/null 2>&1; then
            # Create temp xbindkeys config
            XBINDKEYS_CONFIG="/tmp/vibe-stt-xbindkeys-$USER"
            cat > "$XBINDKEYS_CONFIG" << 'EOF'
"echo TOGGLE"
  Control+Shift+space
EOF
            xbindkeys -f "$XBINDKEYS_CONFIG" -n
          else
            # Fallback to signal file method
            SIGNAL_FILE="/tmp/vibe-stt-toggle-$USER"
            rm -f "$SIGNAL_FILE"
            echo "Hotkey daemon running. xbindkeys not found, using signal file."
            echo "To toggle STT: touch $SIGNAL_FILE"
            while true; do
              if [ -f "$SIGNAL_FILE" ]; then
                echo "TOGGLE"
                rm -f "$SIGNAL_FILE"
              fi
              sleep 0.1
            done
          fi
          `,
        ] as const,
      };

    case Platform.WINDOWS:
      // Use PowerShell to monitor keyboard
      return {
        command: "powershell",
        args: [
          "-Command",
          `
          Add-Type -TypeDefinition @"
          using System;
          using System.Runtime.InteropServices;
          public class KeyboardHook {
              [DllImport("user32.dll")]
              public static extern short GetAsyncKeyState(int vKey);
          }
"@
          while ($true) {
              # Check for Ctrl (0x11) + Shift (0x10) + Space (0x20)
              if (([KeyboardHook]::GetAsyncKeyState(0x11) -band 0x8000) -and
                  ([KeyboardHook]::GetAsyncKeyState(0x10) -band 0x8000) -and
                  ([KeyboardHook]::GetAsyncKeyState(0x20) -band 0x8000)) {
                  Write-Output "TOGGLE"
                  Start-Sleep -Milliseconds 500
              }
              Start-Sleep -Milliseconds 100
          }
          `,
        ] as const,
      };

    default: {
      const _exhaustive: never = platform;
      return _exhaustive;
    }
  }
}

/**
 * Start hotkey daemon that never returns
 * Listens for keyboard shortcuts and toggles STT recording
 */
export async function startHotkeyDaemon(
  logger: EndpointLogger,
  onToggle: () => Promise<void>,
): Promise<never> {
  logger.info("Starting STT hotkey daemon", {
    platform: platformDetector.detect(),
  });

  const config = getHotkeyMonitor();
  const proc = Bun.spawn([config.command, ...config.args], {
    stdout: "pipe",
    stderr: "inherit",
    stdin: "inherit",
  });

  // Monitor stdout for hotkey events
  const reader = proc.stdout.getReader();
  const decoder = new TextDecoder();

  logger.info("Daemon process started, monitoring for TOGGLE events");

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        logger.warn("Stdout stream ended");
        break;
      }

      const output = decoder.decode(value);
      logger.debug("Received output chunk", { output, length: output.length });
      const lines = output.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();
        logger.debug("Processing line", { line: trimmed });

        if (trimmed === "TOGGLE") {
          logger.info("Hotkey detected, toggling STT");
          try {
            await onToggle();
          } catch (error) {
            // Enhanced error logging
            const errorDetails: Record<
              string,
              string | number | boolean | null | undefined
            > = {
              errorType: typeof error,
              errorName: error instanceof Error ? error.name : "unknown",
              errorMessage:
                error instanceof Error ? error.message : String(error),
              errorStack: error instanceof Error ? error.stack : undefined,
            };

            // Try to get more details from the error object
            if (error && typeof error === "object") {
              try {
                errorDetails.errorJson = JSON.stringify(error);
              } catch {
                errorDetails.errorJson = "Could not serialize error";
              }
            }

            logger.error("Failed to toggle STT", errorDetails);
          }
        } else if (trimmed) {
          // Log all output for visibility
          logger.info("Shell output", { output: trimmed });
        }
      }
    }
  } finally {
    reader.releaseLock();
    proc.kill();
  }

  // This should never be reached, but TypeScript needs it
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Daemon termination
  throw new Error("Hotkey daemon terminated unexpectedly");
}
