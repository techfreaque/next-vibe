/* eslint-disable i18next/no-literal-string */
import "server-only";

import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/system-prompt/types";

import { listMonitors } from "./shared/repository";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SupportedDesktopEnv = "kde" | "windows";

export enum DesktopPlatform {
  LINUX = "linux",
  MACOS = "darwin",
  WINDOWS = "win32",
  UNKNOWN = "unknown",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPlatform(): DesktopPlatform {
  switch (process.platform) {
    case "linux":
      return DesktopPlatform.LINUX;
    case "darwin":
      return DesktopPlatform.MACOS;
    case "win32":
      return DesktopPlatform.WINDOWS;
    default:
      return DesktopPlatform.UNKNOWN;
  }
}

function detectDesktopEnv(): SupportedDesktopEnv | null {
  if (process.platform === "win32") {
    return "windows";
  }
  if (process.platform !== "linux") {
    return null;
  }
  const xdg = (process.env.XDG_CURRENT_DESKTOP ?? "").toLowerCase();
  const session = (process.env.DESKTOP_SESSION ?? "").toLowerCase();
  if (xdg.includes("kde") || session.includes("plasma")) {
    return "kde";
  }
  return null;
}

// ─── Fragment ──────────────────────────────────────────────────────────────────

export const desktopFragment: SystemPromptFragment = {
  id: "desktop",
  placement: "leading",
  priority: 65,
  build: async (params) => {
    const isAdmin =
      !params.user.isPublic &&
      params.user.roles.includes(UserPermissionRole.ADMIN);

    if (!isAdmin) {
      return null;
    }

    const platform = getPlatform();
    const desktopEnv = detectDesktopEnv();

    if (!desktopEnv) {
      const platformLabel =
        platform === DesktopPlatform.MACOS
          ? "macOS"
          : platform === DesktopPlatform.LINUX
            ? "Linux (unsupported desktop env)"
            : platform;

      return `## Desktop Control — Not Available
Platform: ${platformLabel}. Desktop automation tools exist but don't support this environment yet.
Supported: Linux/KDE (Wayland), Windows. macOS support is planned.
Don't attempt to use \`desktop_*\` tools — they will fail.`;
    }

    let monitors: Array<{
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      primary: boolean;
    }> = [];
    try {
      monitors = await listMonitors(params.logger);
    } catch {
      // non-fatal — fragment still renders without monitor list
    }

    const primary = monitors.find((m) => m.primary);
    const monitorLines = monitors
      .map((m) => {
        const tag = m.primary ? " [PRIMARY]" : "";
        return `  ${m.name}${tag}: ${m.width}×${m.height} @(${m.x},${m.y})`;
      })
      .join("\n");

    const monitorBlock =
      monitors.length > 0 ? `\nMonitors:\n${monitorLines}` : "";

    const defaultMonitor = primary?.name ?? monitors[0]?.name ?? "primary";

    if (desktopEnv === "windows") {
      return `## Desktop Control — Windows${monitorBlock}

You can fully control this desktop via PowerShell. Act fast — don't narrate, just do.

**Windows shortcuts & power-user knowledge:**
- **Win+D** → show/hide desktop. **Win+L** → lock screen.
- **Alt+F4** → close focused window. **Win+Tab** → Task View (virtual desktops).
- **Win+Left/Right** → snap window to half screen. **Win+Up/Down** → maximize/minimize.
- **Ctrl+Alt+Delete** → security screen. **Win+R** → Run dialog (launch apps by name).
- **windowId** values are Win32 HWND handles (decimal integers from \`list-windows\`).
- \`type-text\` uses clipboard paste internally — clipboard is restored after typing.
- \`press-key\` format: "ctrl+c", "win+d", "alt+f4", "f5", "escape", "enter".
- \`get-accessibility-tree\` uses UIAutomation — works on most native Windows apps.

**Tool names** (use \`tool-help\` to get schema before first call to each):
| Tool | Key params |
|------|-----------|
| \`desktop_take-screenshot_POST\` | \`monitorName\` (default: ${defaultMonitor}) |
| \`desktop_list-windows_POST\` | — returns windowId (HWND), title, monitor per window |
| \`desktop_list-monitors_POST\` | — live monitor layout |
| \`desktop_get-focused-window_POST\` | — active window id/title |
| \`desktop_focus-window_POST\` | \`windowId\` or \`title\` or \`pid\` |
| \`desktop_move-window-to-monitor_POST\` | \`windowId\`/\`title\`/\`pid\` + \`monitorName\`/\`monitorIndex\` |
| \`desktop_get-accessibility-tree_POST\` | \`appName\`, \`maxDepth\` (3–5) |
| \`desktop_click_POST\` | \`x\`, \`y\` (logical pixels, absolute) |
| \`desktop_type-text_POST\` | \`text\` |
| \`desktop_press-key_POST\` | \`key\` (e.g. "ctrl+c", "win+d", "alt+f4") |
| \`desktop_move-mouse_POST\` | \`x\`, \`y\` |
| \`desktop_scroll_POST\` | \`x\`, \`y\`, \`direction\`, \`amount\` |

**Rules:**
- Coordinates are logical pixels (DPI-scaled). Use monitor positions above for multi-monitor math.
- Screenshot after every interaction to verify state. Use \`monitorName\` to target the right screen.
- To find click targets: \`get-accessibility-tree\` → read bbox → click center.
- \`list-windows\` first when you need a windowId — it includes which monitor each window is on.
- Parallel tool calls where safe (e.g. screenshot + list-windows simultaneously).`;
    }

    const kdeSection =
      desktopEnv === "kde"
        ? `
**KDE shortcuts & power-user knowledge:**
- **Alt+F2** → KRunner (launch apps, run commands, calc, unit convert). Fastest way to open anything.
- **Alt+F4** → close focused window. **Super+D** → show desktop.
- **Super+PageUp/Down** → maximize/minimize. **Super+Left/Right** → snap window to half screen.
- **Ctrl+F1–F4** → switch virtual desktops.
- **KRunner commands:** type \`=2+2\` to calculate, \`define word\` to look up, \`shell: cmd\` to run a terminal command.
- **System Settings:** \`systemsettings\` or Alt+F2 → "System Settings".
- **kscreen-doctor -o** → live monitor layout with scale/rotation. \`kscreen-doctor output.NAME.enable\` to toggle a monitor.
- **qdbus6 org.kde.KWin\` → KWin scripting bus. Use it for advanced window management.
- **kdesu\` → GUI sudo dialog (triggers a polkit prompt). Better than CLI sudo for GUI apps.
- **Dolphin** = file manager. **Konsole** = terminal. **Spectacle** = screenshot tool.
- **kwriteconfig6 / kreadconfig6** → read/write KDE config files without restarting apps.
- Notification popups appear bottom-right; interact with \`click\` at that region or dismiss with \`press-key\` Escape.`
        : "";

    return `## Desktop Control — Linux/${desktopEnv.toUpperCase()} Wayland${monitorBlock}

You can fully control this desktop. Act fast — don't narrate, just do.${kdeSection}

**Tool names** (use \`tool-help\` to get schema before first call to each):
| Tool | Key params |
|------|-----------|
| \`desktop_take-screenshot_POST\` | \`monitorName\` (default: ${defaultMonitor}) |
| \`desktop_list-windows_POST\` | — returns windowId, title, monitor per window |
| \`desktop_list-monitors_POST\` | — live monitor layout |
| \`desktop_get-focused-window_POST\` | — active window id/title |
| \`desktop_focus-window_POST\` | \`windowId\` or \`title\` or \`pid\` |
| \`desktop_move-window-to-monitor_POST\` | \`windowId\`/\`title\`/\`pid\` + \`monitorName\`/\`monitorIndex\` |
| \`desktop_get-accessibility-tree_POST\` | \`appName\`, \`maxDepth\` (3–5) |
| \`desktop_click_POST\` | \`x\`, \`y\` (logical pixels, absolute) |
| \`desktop_type-text_POST\` | \`text\` |
| \`desktop_press-key_POST\` | \`key\` (e.g. "ctrl+c", "super+d", "alt+f2") |
| \`desktop_move-mouse_POST\` | \`x\`, \`y\` |
| \`desktop_scroll_POST\` | \`x\`, \`y\`, \`direction\`, \`amount\` |

**Rules:**
- Coordinates are logical pixels matching monitor positions above.
- Screenshot after every interaction to verify state. Use \`monitorName\` to target the right screen.
- To find click targets: \`get-accessibility-tree\` → read bbox → click center.
- \`list-windows\` first when you need a windowId — it includes which monitor each window is on.
- Parallel tool calls where safe (e.g. screenshot + list-windows simultaneously).`;
  },
};
