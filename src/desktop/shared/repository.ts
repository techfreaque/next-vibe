/**
 * Desktop Automation Shared Repository
 * Linux/KDE (Wayland): spectacle, ydotool, python3-pyatspi, qdbus6, kscreen-doctor.
 * Windows: PowerShell + built-in .NET (System.Windows.Forms, System.Drawing, UIAutomation).
 * Missing Linux deps are installed on first use via kdesu (native KDE auth dialog).
 * All tools use execFile (never exec) to prevent shell injection.
 */

import "server-only";

import { execFile as execFileCb } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";

import { getStorageAdapter } from "next-vibe/agent/chat/storage/index";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  type ContentBlock,
  type ContentResponse,
  createContentResponse,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";
import { v4 as uuid } from "uuid";

import type { DesktopT } from "../i18n";

const execFile = promisify(execFileCb);

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

function sessionEnv(): NodeJS.ProcessEnv {
  if (process.platform === "win32") {
    return { ...process.env };
  }
  return {
    ...process.env,
    DISPLAY: process.env.DISPLAY ?? ":0",
    WAYLAND_DISPLAY: process.env.WAYLAND_DISPLAY ?? "wayland-0",
    XDG_RUNTIME_DIR:
      process.env.XDG_RUNTIME_DIR ?? `/run/user/${process.getuid?.() ?? 1000}`,
  };
}

// ---------------------------------------------------------------------------
// Dep install via kdesu (native KDE auth dialog) → pkexec fallback (Linux)
// ---------------------------------------------------------------------------

const confirmedPresent = new Set<string>();
const KDESU = "/usr/lib/kf6/kdesu";

async function detectPackageManager(): Promise<
  "pacman" | "apt-get" | "dnf" | null
> {
  for (const pm of ["pacman", "apt-get", "dnf"] as const) {
    try {
      await execFile("which", [pm], { timeout: 3000 });
      return pm;
    } catch {
      // try next
    }
  }
  return null;
}

function buildInstallCmd(
  pm: "pacman" | "apt-get" | "dnf",
  pkg: string,
): string {
  if (pm === "pacman") {
    return `pacman -S --noconfirm --needed ${pkg}`;
  }
  if (pm === "apt-get") {
    return `apt-get install -y ${pkg}`;
  }
  return `dnf install -y ${pkg}`;
}

async function elevatedInstall(cmd: string): Promise<void> {
  if (existsSync(KDESU)) {
    await execFile(KDESU, ["-c", cmd], {
      timeout: 120_000,
      env: sessionEnv(),
    });
  } else {
    await execFile("pkexec", ["sh", "-c", cmd], {
      timeout: 120_000,
      env: sessionEnv(),
    });
  }
}

const PKG: Record<
  string,
  Partial<Record<"pacman" | "apt-get" | "dnf", string>>
> = {
  ydotool: { pacman: "ydotool", "apt-get": "ydotool", dnf: "ydotool" },
  grim: { pacman: "grim", "apt-get": "grim", dnf: "grim" },
  imagemagick: {
    pacman: "imagemagick",
    "apt-get": "imagemagick",
    dnf: "ImageMagick",
  },
  "python3-pyatspi": {
    pacman: "python-atspi",
    "apt-get": "python3-pyatspi",
    dnf: "python3-pyatspi",
  },
};

async function checkBinary(binary: string): Promise<boolean> {
  if (confirmedPresent.has(binary)) {
    return true;
  }
  try {
    const whichCmd = process.platform === "win32" ? "where" : "which";
    await execFile(whichCmd, [binary], { timeout: 3000 });
    confirmedPresent.add(binary);
    return true;
  } catch {
    return false;
  }
}

async function ensureBinary(
  binary: string,
  logger: EndpointLogger,
): Promise<boolean> {
  if (confirmedPresent.has(binary)) {
    return true;
  }

  try {
    await execFile("which", [binary], { timeout: 3000 });
    confirmedPresent.add(binary);
    return true;
  } catch {
    // not found
  }

  const pm = await detectPackageManager();
  if (!pm) {
    logger.warn(`[Desktop] No package manager found, cannot install ${binary}`);
    return false;
  }

  const pkg = PKG[binary]?.[pm] ?? binary;
  logger.info(
    `[Desktop] ${binary} missing - showing auth dialog to install ${pkg}`,
  );

  try {
    await elevatedInstall(buildInstallCmd(pm, pkg));
  } catch (err) {
    logger.warn(`[Desktop] install failed for ${pkg}: ${String(err)}`);
  }

  try {
    await execFile("which", [binary], { timeout: 3000 });
    confirmedPresent.add(binary);
    return true;
  } catch {
    return false;
  }
}

const YDOTOOL_SOCKET_PATH = `/run/user/${process.getuid?.() ?? 1000}/.ydotool_socket`;

async function ensureYdotool(logger: EndpointLogger): Promise<boolean> {
  const key = "ydotool";
  const installed = await ensureBinary(key, logger);
  if (!installed) {
    return false;
  }

  if (existsSync(YDOTOOL_SOCKET_PATH)) {
    confirmedPresent.add(key);
    return true;
  }

  logger.info(
    "[Desktop] ydotoold not running - starting via systemd user service",
  );
  try {
    await execFile(
      "systemctl",
      ["--user", "enable", "--now", "ydotool.service"],
      {
        timeout: 15_000,
        env: sessionEnv(),
      },
    );
  } catch {
    try {
      const { spawn } = await import("node:child_process");
      spawn("ydotoold", [], {
        detached: true,
        stdio: "ignore",
        env: sessionEnv(),
      }).unref();
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
    } catch (err) {
      logger.warn(`[Desktop] Failed to start ydotoold: ${String(err)}`);
    }
  }

  if (existsSync(YDOTOOL_SOCKET_PATH)) {
    return true;
  }

  logger.warn("[Desktop] ydotoold socket not found after start attempt");
  return false;
}

async function ensurePyAtspi(logger: EndpointLogger): Promise<boolean> {
  const key = "python3-pyatspi";
  if (confirmedPresent.has(key)) {
    return true;
  }

  try {
    await execFile("python3", ["-c", "import pyatspi"], { timeout: 5000 });
    confirmedPresent.add(key);
    return true;
  } catch {
    // not available
  }

  const pm = await detectPackageManager();
  if (!pm) {
    return false;
  }

  const pkg = PKG[key]?.[pm] ?? "python3-pyatspi";
  logger.info(
    `[Desktop] pyatspi missing - showing auth dialog to install ${pkg}`,
  );

  try {
    await elevatedInstall(buildInstallCmd(pm, pkg));
  } catch (err) {
    logger.warn(`[Desktop] install failed for ${pkg}: ${String(err)}`);
  }

  try {
    await execFile("python3", ["-c", "import pyatspi"], { timeout: 5000 });
    confirmedPresent.add(key);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Platform guard
// ---------------------------------------------------------------------------

export function checkPlatformSupported(
  t: DesktopT,
): ResponseType<never> | null {
  if (process.platform === "darwin") {
    return fail({
      message: t("repository.macosNotSupported"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
  if (process.platform !== "linux" && process.platform !== "win32") {
    return fail({
      message: t("repository.platformNotSupported"),
      messageParams: { platform: process.platform },
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
  return null;
}

// ---------------------------------------------------------------------------
// execFile wrapper (Linux paths)
// ---------------------------------------------------------------------------

export async function runCommand(
  file: string,
  args: string[],
  t: DesktopT,
  logger: EndpointLogger,
  opts?: { timeout?: number },
): Promise<{ stdout: string; stderr: string } | ResponseType<never>> {
  try {
    const result = await execFile(file, args, {
      timeout: opts?.timeout ?? 30_000,
      env: sessionEnv(),
    });
    return { stdout: result.stdout, stderr: result.stderr };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(`[Desktop] Command failed: ${file}`, { args, message });
    return fail({
      message: t("repository.commandFailed"),
      messageParams: { error: message },
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

export function isCommandError<T>(
  result: { stdout: string; stderr: string } | ResponseType<T>,
): result is ResponseType<T> {
  return "data" in result || ("message" in result && !("stdout" in result));
}

function missingDepFail<T>(t: DesktopT, dep: string): ResponseType<T> {
  return fail({
    message: t("repository.missingDep"),
    messageParams: { dep },
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
  }) as ResponseType<T>;
}

function makeExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Windows: PowerShell runner
// ---------------------------------------------------------------------------

async function runPowerShell(
  script: string,
  t: DesktopT,
  logger: EndpointLogger,
  opts?: { timeout?: number },
): Promise<{ stdout: string; stderr: string } | ResponseType<never>> {
  const executionId = makeExecutionId();
  const tmpDir =
    process.env["TEMP"] ?? process.env["TMP"] ?? "C:\\Windows\\Temp";
  const scriptPath = `${tmpDir}\\vibe-desktop-${executionId}.ps1`;

  try {
    const { writeFileSync } = await import("node:fs");
    writeFileSync(scriptPath, script, "utf-8");
  } catch (err) {
    return fail({
      message: t("repository.commandFailed"),
      messageParams: { error: `Failed to write script: ${String(err)}` },
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  try {
    const r = await execFile(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        scriptPath,
      ],
      { timeout: opts?.timeout ?? 30_000, env: { ...process.env } },
    );
    return { stdout: r.stdout, stderr: r.stderr };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("[Desktop/Windows] PowerShell script failed", { message });
    return fail({
      message: t("repository.commandFailed"),
      messageParams: { error: message },
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  } finally {
    try {
      const { unlinkSync } = await import("node:fs");
      unlinkSync(scriptPath);
    } catch {
      /* non-fatal */
    }
  }
}

// ---------------------------------------------------------------------------
// Windows: shared P/Invoke type definition (user32.dll)
// Included at the top of every PowerShell script that needs Win32 APIs.
// ---------------------------------------------------------------------------

const WIN_API_TYPEDEF = `Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;
[StructLayout(LayoutKind.Sequential)]
public struct WinRect { public int Left, Top, Right, Bottom; }
public static class WinApi {
  [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, IntPtr extra);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
  [DllImport("user32.dll")] public static extern void mouse_event(int dwFlags, int dx, int dy, int cButtons, IntPtr extra);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll", CharSet = CharSet.Auto)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out WinRect lpRect);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
  public const byte VK_LWIN = 0x5B;
  public const byte VK_LCONTROL = 0xA2;
  public const byte VK_LMENU = 0xA4;
  public const byte VK_LSHIFT = 0xA0;
  public const uint KEYEVENTF_KEYUP = 0x0002;
  public const int MOUSEEVENTF_LEFTDOWN = 0x0002;
  public const int MOUSEEVENTF_LEFTUP = 0x0004;
  public const int MOUSEEVENTF_RIGHTDOWN = 0x0008;
  public const int MOUSEEVENTF_RIGHTUP = 0x0010;
  public const int MOUSEEVENTF_MIDDLEDOWN = 0x0020;
  public const int MOUSEEVENTF_MIDDLEUP = 0x0040;
  public const int MOUSEEVENTF_WHEEL = 0x0800;
  public const int MOUSEEVENTF_HWHEEL = 0x1000;
  public const int SW_RESTORE = 9;
}
"@
`;

// ---------------------------------------------------------------------------
// Windows: Virtual Key code map for press-key
// ---------------------------------------------------------------------------

function buildWinVkMap(): Record<string, number> {
  const m: Record<string, number> = {
    escape: 0x1b,
    esc: 0x1b,
    return: 0x0d,
    enter: 0x0d,
    backspace: 0x08,
    tab: 0x09,
    space: 0x20,
    " ": 0x20,
    home: 0x24,
    end: 0x23,
    prior: 0x21,
    pageup: 0x21,
    next: 0x22,
    pagedown: 0x22,
    insert: 0x2d,
    delete: 0x2e,
    del: 0x2e,
    left: 0x25,
    arrowleft: 0x25,
    right: 0x27,
    arrowright: 0x27,
    up: 0x26,
    arrowup: 0x26,
    down: 0x28,
    arrowdown: 0x28,
    // Modifiers
    ctrl: 0xa2,
    control: 0xa2,
    control_l: 0xa2,
    control_r: 0xa3,
    alt: 0xa4,
    alt_l: 0xa4,
    alt_r: 0xa5,
    shift: 0xa0,
    shift_l: 0xa0,
    shift_r: 0xa1,
    super: 0x5b,
    super_l: 0x5b,
    win: 0x5b,
    meta: 0x5b,
    meta_l: 0x5b,
    caps_lock: 0x14,
    // Function keys
    f1: 0x70,
    f2: 0x71,
    f3: 0x72,
    f4: 0x73,
    f5: 0x74,
    f6: 0x75,
    f7: 0x76,
    f8: 0x77,
    f9: 0x78,
    f10: 0x79,
    f11: 0x7a,
    f12: 0x7b,
    // OEM keys
    minus: 0xbd,
    equal: 0xbb,
    bracketleft: 0xdb,
    bracketright: 0xdd,
    backslash: 0xdc,
    semicolon: 0xba,
    apostrophe: 0xde,
    grave: 0xc0,
    comma: 0xbc,
    period: 0xbe,
    slash: 0xbf,
  };
  for (let i = 0; i < 26; i++) {
    m["abcdefghijklmnopqrstuvwxyz"[i] ?? ""] = 0x41 + i;
  }
  for (let i = 0; i < 10; i++) {
    m[String(i)] = 0x30 + i;
  }
  return m;
}

const WIN_VK_MAP = buildWinVkMap();

function buildWindowsKeyScript(keyExpr: string): string | null {
  const parts = keyExpr.split("+").map((p) => p.trim());
  const codes: number[] = [];
  for (const part of parts) {
    const vk =
      WIN_VK_MAP[part.toLowerCase()] ??
      WIN_VK_MAP[part] ??
      WIN_VK_MAP[part.toUpperCase()];
    if (vk === undefined) {
      return null;
    }
    codes.push(vk);
  }
  if (codes.length === 0) {
    return null;
  }

  const pressLines = codes.map(
    (c) => `[WinApi]::keybd_event(${c}, 0, 0, [IntPtr]::Zero)`,
  );
  const releaseLines = [...codes]
    .toReversed()
    .map(
      (c) =>
        `[WinApi]::keybd_event(${c}, 0, [WinApi]::KEYEVENTF_KEYUP, [IntPtr]::Zero)`,
    );

  return [
    WIN_API_TYPEDEF,
    ...pressLines,
    "[System.Threading.Thread]::Sleep(30)",
    ...releaseLines,
    'Write-Output "OK"',
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Monitor listing - kscreen-doctor (KDE) with xrandr fallback (Linux)
//                  PowerShell System.Windows.Forms.Screen (Windows)
// ---------------------------------------------------------------------------

export interface MonitorInfo {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  primary: boolean;
}

let monitorCache: { monitors: MonitorInfo[]; ts: number } | null = null;
const MONITOR_CACHE_TTL_MS = 10_000;

async function listMonitorsWindows(
  logger: EndpointLogger,
): Promise<MonitorInfo[]> {
  const monitors: MonitorInfo[] = [];
  const script = [
    "Add-Type -AssemblyName System.Windows.Forms",
    "$idx = 0",
    "foreach ($s in [System.Windows.Forms.Screen]::AllScreens) {",
    "  @{index=$idx;name=$s.DeviceName;x=$s.Bounds.X;y=$s.Bounds.Y;width=$s.Bounds.Width;height=$s.Bounds.Height;primary=[int]$s.Primary} | ConvertTo-Json -Compress",
    "  $idx++",
    "}",
  ].join("\n");

  try {
    const r = await execFile(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        script,
      ],
      { timeout: 10_000, env: { ...process.env } },
    );
    for (const line of r.stdout.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("{")) {
        continue;
      }
      try {
        const obj = JSON.parse(trimmed) as {
          index?: number;
          name?: string;
          x?: number;
          y?: number;
          width?: number;
          height?: number;
          primary?: number;
        };
        if (obj.name && obj.width) {
          monitors.push({
            name: obj.name,
            x: obj.x ?? 0,
            y: obj.y ?? 0,
            width: obj.width,
            height: obj.height ?? 1080,
            index: obj.index ?? monitors.length,
            primary: (obj.primary ?? 0) === 1,
          });
        }
      } catch {
        /* skip non-JSON lines */
      }
    }
  } catch (err) {
    logger.warn(`[Desktop/Windows] Monitor listing failed: ${String(err)}`);
  }

  if (monitors.length === 0) {
    monitors.push({
      name: "\\\\.\\DISPLAY1",
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
      index: 0,
      primary: true,
    });
  }
  return monitors;
}

export async function listMonitors(
  logger: EndpointLogger,
): Promise<MonitorInfo[]> {
  const now = Date.now();
  if (monitorCache && now - monitorCache.ts < MONITOR_CACHE_TTL_MS) {
    return monitorCache.monitors;
  }

  if (process.platform === "win32") {
    const monitors = await listMonitorsWindows(logger);
    monitorCache = { monitors, ts: now };
    return monitors;
  }

  const monitors: MonitorInfo[] = [];

  // Try kscreen-doctor (KDE/Wayland native)
  // Output format (multi-line):
  //   Output: N NAME uuid
  //     Geometry: X,Y WxH
  try {
    const r = await execFile("kscreen-doctor", ["-o"], {
      timeout: 5000,
      env: sessionEnv(),
    });
    // Strip ANSI escape codes before parsing
    // eslint-disable-next-line no-control-regex
    const clean = r.stdout.replace(/\x1b\[[0-9;]*m/g, "");
    const lines = clean.split("\n");
    let pendingName: string | null = null;
    let idx = 0;
    for (const line of lines) {
      const nameMatch = /^\s*Output:\s+\d+\s+(\S+)/.exec(line);
      if (nameMatch) {
        pendingName = nameMatch[1];
        continue;
      }
      if (pendingName) {
        const geoMatch = /^\s*Geometry:\s+(\d+),(\d+)\s+(\d+)x(\d+)/.exec(line);
        if (geoMatch) {
          monitors.push({
            name: pendingName,
            x: parseInt(geoMatch[1], 10),
            y: parseInt(geoMatch[2], 10),
            width: parseInt(geoMatch[3], 10),
            height: parseInt(geoMatch[4], 10),
            index: idx,
            primary: idx === 0,
          });
          idx++;
          pendingName = null;
        }
      }
    }
  } catch {
    logger.warn("[Desktop] kscreen-doctor not available, trying xrandr");
  }

  // Fallback: xrandr --listmonitors
  if (monitors.length === 0) {
    try {
      const r = await execFile("xrandr", ["--listmonitors"], {
        timeout: 5000,
        env: sessionEnv(),
      });
      // Format: " 0: +*DP-1 2560/597x1440/336+0+0"
      let idx = 0;
      for (const line of r.stdout.split("\n")) {
        const m =
          /^\s*\d+:\s+\+(\*?)(\S+)\s+(\d+)\/\d+x(\d+)\/\d+\+(\d+)\+(\d+)/.exec(
            line,
          );
        if (m) {
          monitors.push({
            name: m[2],
            x: parseInt(m[5], 10),
            y: parseInt(m[6], 10),
            width: parseInt(m[3], 10),
            height: parseInt(m[4], 10),
            index: idx++,
            primary: m[1] === "*",
          });
        }
      }
    } catch {
      logger.warn("[Desktop] xrandr also not available for monitor listing");
    }
  }

  // Last resort: synthetic single monitor
  if (monitors.length === 0) {
    monitors.push({
      name: "primary",
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
      index: 0,
      primary: true,
    });
  }

  monitorCache = { monitors, ts: now };
  return monitors;
}

export function invalidateMonitorCache(): void {
  monitorCache = null;
}

// ---------------------------------------------------------------------------
// AT-SPI2 bus address detection (Linux/Wayland)
// ---------------------------------------------------------------------------

let atSpiBusAddressCache: { addr: string | null; ts: number } | null = null;
const ATSPI_CACHE_TTL_MS = 30_000;

async function getAtSpiBusAddress(): Promise<string | undefined> {
  const now = Date.now();
  if (
    atSpiBusAddressCache &&
    now - atSpiBusAddressCache.ts < ATSPI_CACHE_TTL_MS
  ) {
    return atSpiBusAddressCache.addr ?? undefined;
  }

  if (process.env.AT_SPI_BUS_ADDRESS) {
    atSpiBusAddressCache = { addr: process.env.AT_SPI_BUS_ADDRESS, ts: now };
    return process.env.AT_SPI_BUS_ADDRESS;
  }

  try {
    const r = await execFile(
      "qdbus6",
      ["org.a11y.Bus", "/org/a11y/bus", "org.a11y.Bus.GetAddress"],
      { timeout: 3000, env: sessionEnv() },
    );
    const addr = r.stdout.trim();
    if (addr.startsWith("unix:")) {
      atSpiBusAddressCache = { addr, ts: now };
      return addr;
    }
  } catch {
    // not available
  }

  const uid = process.getuid?.() ?? 1000;
  const atSpiDir = `/run/user/${uid}/at-spi`;
  // Socket may be named bus, bus_0, bus_1, etc. — pick the first match.
  try {
    const { readdirSync } = await import("node:fs");
    const entries = readdirSync(atSpiDir).filter((e) => e.startsWith("bus"));
    if (entries.length > 0) {
      const sockPath = `${atSpiDir}/${entries[0]}`;
      const addr = `unix:path=${sockPath}`;
      atSpiBusAddressCache = { addr, ts: now };
      return addr;
    }
  } catch {
    // directory missing or unreadable
  }

  // Don't cache null — retry on next call so transient failures self-heal.
  return undefined;
}

// ---------------------------------------------------------------------------
// Image helpers - dimensions + downscaling
// Linux: ImageMagick (identify / magick)
// Windows: System.Drawing + ImageMagick fallback
// ---------------------------------------------------------------------------

async function getImageDimensions(
  path: string,
): Promise<{ width: number; height: number } | null> {
  if (process.platform === "win32") {
    const psPath = path.replace(/'/g, "''");
    const script = `Add-Type -AssemblyName System.Drawing; $i=[System.Drawing.Image]::FromFile('${psPath}'); Write-Output "$($i.Width)x$($i.Height)"; $i.Dispose()`;
    try {
      const r = await execFile(
        "powershell.exe",
        [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          script,
        ],
        { timeout: 5000, env: { ...process.env } },
      );
      const m = /^(\d+)x(\d+)/.exec(r.stdout.trim());
      if (m) {
        return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  for (const [cmd, args] of [
    ["identify", ["-format", "%wx%h", path]],
    ["magick", ["identify", "-format", "%wx%h", path]],
  ] as [string, string[]][]) {
    try {
      const r = await execFile(cmd, args, { timeout: 5000, env: sessionEnv() });
      const m = /^(\d+)x(\d+)/.exec(r.stdout.trim());
      if (m) {
        return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
      }
    } catch {
      // try next
    }
  }
  return null;
}

async function downscaleImage(
  inputPath: string,
  outputPath: string,
  maxWidth: number,
  logger: EndpointLogger,
): Promise<boolean> {
  if (process.platform === "win32") {
    // Try ImageMagick first, fall back to System.Drawing
    for (const [cmd, args] of [
      ["magick", [inputPath, "-resize", `${maxWidth}x>`, outputPath]],
      ["convert", [inputPath, "-resize", `${maxWidth}x>`, outputPath]],
    ] as [string, string[]][]) {
      try {
        await execFile(cmd, args, {
          timeout: 30_000,
          env: { ...process.env },
        });
        return true;
      } catch {
        /* try next */
      }
    }
    const psIn = inputPath.replace(/'/g, "''");
    const psOut = outputPath.replace(/'/g, "''");
    const script = `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('${psIn}')
$nw = ${maxWidth}
$nh = [int]($img.Height * $nw / $img.Width)
$bmp = New-Object System.Drawing.Bitmap($nw, $nh)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $nw, $nh)
$g.Dispose(); $img.Dispose()
$bmp.Save('${psOut}', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "OK"
`.trim();
    try {
      await execFile(
        "powershell.exe",
        [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          script,
        ],
        { timeout: 30_000, env: { ...process.env } },
      );
      return true;
    } catch (err) {
      logger.warn(`[Desktop/Windows] Downscale failed: ${String(err)}`);
      return false;
    }
  }

  // Try magick (IM7+) then convert (IM6)
  for (const [cmd, args] of [
    ["magick", [inputPath, "-resize", `${maxWidth}x>`, outputPath]],
    ["convert", [inputPath, "-resize", `${maxWidth}x>`, outputPath]],
  ] as [string, string[]][]) {
    try {
      await execFile(cmd, args, { timeout: 30_000, env: sessionEnv() });
      return true;
    } catch {
      // try next
    }
  }

  // Try installing imagemagick then retry
  await ensureBinary("imagemagick", logger);
  for (const cmd of ["magick", "convert"]) {
    try {
      await execFile(cmd, [inputPath, "-resize", `${maxWidth}x>`, outputPath], {
        timeout: 30_000,
        env: sessionEnv(),
      });
      return true;
    } catch {
      // give up
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Screenshot
// Linux:   spectacle (KDE/Wayland native), fallback grim
// Windows: PowerShell + System.Drawing.Graphics.CopyFromScreen
// ---------------------------------------------------------------------------

export interface ScreenshotResult {
  success: boolean;
  imagePath?: string;
  imageData?: string;
  width?: number;
  height?: number;
  capturedMonitor?: string;
  originalWidth?: number;
  originalHeight?: number;
  error?: string;
  executionId: string;
}

export class DesktopScreenshotRepository {
  private static async takeScreenshotWindows(
    data: {
      outputPath?: string;
      screen?: number;
      monitorName?: string;
      maxWidth?: number;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ScreenshotResult> | ContentResponse> {
    const executionId = makeExecutionId();
    const monitors = await listMonitors(logger);

    let targetMonitor: MonitorInfo | undefined;
    if (data.monitorName) {
      targetMonitor = monitors.find(
        (m) => m.name.toLowerCase() === data.monitorName!.toLowerCase(),
      );
      if (!targetMonitor) {
        return fail({
          message: t("repository.commandFailed"),
          messageParams: {
            error: `Monitor "${data.monitorName}" not found`,
          },
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    } else if (data.screen !== undefined) {
      targetMonitor = monitors[data.screen];
      if (!targetMonitor) {
        return fail({
          message: t("repository.commandFailed"),
          messageParams: {
            error: `Screen index ${data.screen} out of range`,
          },
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    } else {
      targetMonitor = monitors.find((m) => m.primary) ?? monitors[0];
    }

    const { x, y, width, height } = targetMonitor;
    const resolvedMonitorName = targetMonitor?.name;

    const tmpDir =
      process.env["TEMP"] ?? process.env["TMP"] ?? "C:\\Windows\\Temp";
    const rawOutputPath =
      data.outputPath ?? `${tmpDir}\\vibe-screenshot-${executionId}.png`;
    const psOutputPath = rawOutputPath.replace(/'/g, "''");

    const captureScript = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(${width}, ${height})
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen(${x}, ${y}, 0, 0, [System.Drawing.Size]::new(${width}, ${height}))
$g.Dispose()
$bmp.Save('${psOutputPath}', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "OK"
`.trim();

    const captureResult = await runPowerShell(captureScript, t, logger);
    if (isCommandError(captureResult)) {
      return captureResult as ResponseType<ScreenshotResult>;
    }

    try {
      const { readFileSync } = await import("node:fs");

      const origDims = await getImageDimensions(rawOutputPath);
      let finalPath = rawOutputPath;
      let finalDims = origDims;

      if (data.maxWidth && origDims && origDims.width > data.maxWidth) {
        const scaledPath = `${tmpDir}\\vibe-screenshot-scaled-${executionId}.png`;
        const scaled = await downscaleImage(
          rawOutputPath,
          scaledPath,
          data.maxWidth,
          logger,
        );
        if (scaled) {
          finalPath = scaledPath;
          finalDims = await getImageDimensions(scaledPath);
        }
      }

      const buf = readFileSync(finalPath);
      const imageData = buf.toString("base64");

      try {
        const { unlinkSync } = await import("node:fs");
        if (!data.outputPath) {
          unlinkSync(rawOutputPath);
          if (finalPath !== rawOutputPath) {
            unlinkSync(finalPath);
          }
        } else if (finalPath !== rawOutputPath) {
          unlinkSync(finalPath);
        }
      } catch {
        /* non-fatal */
      }

      const monitorLabel = resolvedMonitorName ?? "all monitors";
      const dimensionLabel = origDims
        ? finalDims &&
          (finalDims.width !== origDims.width ||
            finalDims.height !== origDims.height)
          ? `${origDims.width}×${origDims.height} → ${finalDims.width}×${finalDims.height}`
          : `${origDims.width}×${origDims.height}`
        : "captured";

      if (data.outputPath) {
        return success({
          success: true,
          imagePath: data.outputPath,
          imageData,
          width: finalDims?.width,
          height: finalDims?.height,
          originalWidth: origDims?.width,
          originalHeight: origDims?.height,
          capturedMonitor: resolvedMonitorName,
          executionId,
        });
      }

      const blocks: ContentBlock[] = [
        {
          type: "text",
          text: `Screenshot: ${monitorLabel} (${dimensionLabel})`,
        },
        { type: "image", data: imageData, mimeType: "image/png" },
      ];
      return createContentResponse(blocks);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error("[Desktop/Windows] Failed to read screenshot file", {
        rawOutputPath,
        message,
      });
      return fail({
        message: t("repository.screenshotFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async takeScreenshot(
    data: {
      outputPath?: string;
      screen?: number;
      monitorName?: string;
      maxWidth?: number;
    },
    t: DesktopT,
    logger: EndpointLogger,
    threadId?: string,
  ): Promise<ResponseType<ScreenshotResult> | ContentResponse> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<ScreenshotResult>;
    }

    if (process.platform === "win32") {
      return DesktopScreenshotRepository.takeScreenshotWindows(data, t, logger);
    }

    const executionId = makeExecutionId();
    const outputPath =
      data.outputPath ?? `/tmp/desktop-screenshot-${executionId}.png`;

    // Resolve monitor name and geometry.
    // If neither monitorName nor screen is specified, default to the primary monitor.
    let resolvedMonitorName: string | undefined;
    let monitorGeometry:
      | { x: number; y: number; width: number; height: number }
      | undefined;
    let allMonitors: MonitorInfo[] = [];

    {
      const monitors = await listMonitors(logger);
      allMonitors = monitors;
      let targetName = data.monitorName;

      if (!targetName && data.screen === undefined) {
        // Default: primary monitor
        const primary = monitors.find((m) => m.primary) ?? monitors[0];
        if (primary) {
          targetName = primary.name;
        }
      } else if (!targetName && data.screen !== undefined) {
        const byIdx = monitors[data.screen];
        if (byIdx) {
          targetName = byIdx.name;
        }
      }

      if (targetName) {
        const match = monitors.find(
          (m) => m.name.toLowerCase() === targetName!.toLowerCase(),
        );
        if (match) {
          resolvedMonitorName = match.name;
          monitorGeometry = {
            x: match.x,
            y: match.y,
            width: match.width,
            height: match.height,
          };
        } else {
          logger.warn(
            `[Desktop] Monitor "${targetName}" not found, capturing all`,
          );
        }
      }
    }

    // Use grim (Wayland-native, supports -o <output> for per-monitor).
    // If grim unavailable: spectacle full-desktop + ImageMagick crop for per-monitor.
    // Only try to auto-install grim when spectacle is also unavailable.
    const hasGrim = await checkBinary("grim");
    const hasSpectacle = await checkBinary("spectacle");
    let captureResult: { stdout: string; stderr: string } | ResponseType<never>;

    if (hasGrim) {
      const args: string[] = [];
      if (resolvedMonitorName) {
        args.push("-o", resolvedMonitorName);
      }
      args.push(outputPath);
      captureResult = await runCommand("grim", args, t, logger);
    } else if (hasSpectacle) {
      // Spectacle fallback: capture full desktop then crop if needed
      const fullPath = monitorGeometry
        ? `/tmp/desktop-screenshot-full-${executionId}.png`
        : outputPath;
      const spectacleArgs = ["-b", "--nonotify", "-f", "-o", fullPath];
      captureResult = await runCommand("spectacle", spectacleArgs, t, logger);

      if (!isCommandError(captureResult) && monitorGeometry) {
        // Crop to monitor geometry using ImageMagick (binary: magick).
        // Spectacle captures at Wayland HiDPI compositor scale; derive scale factor
        // from actual screenshot dimensions vs xrandr logical screen size.
        const hasMagick = await checkBinary("magick");
        if (!hasMagick) {
          await ensureBinary("imagemagick", logger);
        }
        const { x, y, width, height } = monitorGeometry;

        // Get screenshot dimensions to compute the scale factor.
        // Compare the full screenshot pixel dimensions against the logical
        // bounding box of all monitors (from the same source as monitorGeometry)
        // to avoid mixing coordinate spaces between kscreen-doctor and xrandr.
        const dimResult = await runCommand(
          "magick",
          ["identify", "-ping", "-format", "%w %h", fullPath],
          t,
          logger,
        );
        let scaleX = 1;
        let scaleY = 1;
        if (!isCommandError(dimResult)) {
          const parts = dimResult.stdout.trim().split(" ");
          const imgW = parseInt(parts[0] ?? "0", 10);
          const imgH = parseInt(parts[1] ?? "0", 10);
          if (imgW > 0 && imgH > 0 && allMonitors.length > 0) {
            // Compute bounding box of all monitors in logical coordinates
            let logicalMaxX = 0;
            let logicalMaxY = 0;
            for (const m of allMonitors) {
              const right = m.x + m.width;
              const bottom = m.y + m.height;
              if (right > logicalMaxX) {
                logicalMaxX = right;
              }
              if (bottom > logicalMaxY) {
                logicalMaxY = bottom;
              }
            }
            if (logicalMaxX > 0 && logicalMaxY > 0) {
              scaleX = imgW / logicalMaxX;
              scaleY = imgH / logicalMaxY;
            }
          }
        }

        const cropX = Math.round(x * scaleX);
        const cropY = Math.round(y * scaleY);
        const cropW = Math.round(width * scaleX);
        const cropH = Math.round(height * scaleY);

        const cropResult = await runCommand(
          "magick",
          [
            fullPath,
            "-crop",
            `${cropW}x${cropH}+${cropX}+${cropY}`,
            "+repage",
            outputPath,
          ],
          t,
          logger,
        );
        try {
          const { unlinkSync } = await import("node:fs");
          unlinkSync(fullPath);
        } catch {
          /* non-fatal */
        }
        if (isCommandError(cropResult)) {
          // Crop failed - return full screenshot instead
          logger.warn(
            "[Desktop] ImageMagick crop failed, returning full desktop screenshot",
          );
          captureResult = await runCommand(
            "spectacle",
            ["-b", "--nonotify", "-f", "-o", outputPath],
            t,
            logger,
          );
        }
      }
    } else {
      // Last resort: try to install grim
      const grimOk = await ensureBinary("grim", logger);
      if (!grimOk) {
        return missingDepFail(t, "grim");
      }
      const args: string[] = [];
      if (resolvedMonitorName) {
        args.push("-o", resolvedMonitorName);
      }
      args.push(outputPath);
      captureResult = await runCommand("grim", args, t, logger);
    }

    if (isCommandError(captureResult)) {
      return captureResult as ResponseType<ScreenshotResult>;
    }

    try {
      const { readFileSync } = await import("node:fs");

      const origDims = await getImageDimensions(outputPath);
      let finalPath = outputPath;
      let finalDims = origDims;

      if (data.maxWidth && origDims && origDims.width > data.maxWidth) {
        const scaledPath = `/tmp/desktop-screenshot-scaled-${executionId}.png`;
        const scaled = await downscaleImage(
          outputPath,
          scaledPath,
          data.maxWidth,
          logger,
        );
        if (scaled) {
          finalPath = scaledPath;
          finalDims = await getImageDimensions(scaledPath);
        }
      }

      const buf = readFileSync(finalPath);
      const imageData = buf.toString("base64");

      try {
        const { unlinkSync } = await import("node:fs");
        if (!data.outputPath) {
          unlinkSync(outputPath);
          if (finalPath !== outputPath) {
            unlinkSync(finalPath);
          }
        } else if (finalPath !== outputPath) {
          unlinkSync(finalPath);
        }
      } catch {
        /* non-fatal */
      }

      const monitorLabel = resolvedMonitorName ?? "all monitors";
      const dimensionLabel = origDims
        ? finalDims &&
          (finalDims.width !== origDims.width ||
            finalDims.height !== origDims.height)
          ? `${origDims.width}×${origDims.height} → ${finalDims.width}×${finalDims.height}`
          : `${origDims.width}×${origDims.height}`
        : "captured";

      if (data.outputPath) {
        return success({
          success: true,
          imagePath: data.outputPath,
          imageData,
          width: finalDims?.width,
          height: finalDims?.height,
          originalWidth: origDims?.width,
          originalHeight: origDims?.height,
          capturedMonitor: resolvedMonitorName,
          executionId,
        });
      }

      try {
        const storage = getStorageAdapter();
        const uploaded = await storage.uploadFile(buf, {
          filename: `desktop-screenshot-${executionId}.png`,
          mimeType: "image/png",
          threadId: threadId || uuid(),
        });
        return success({
          success: true,
          imageUrl: uploaded.url,
          width: finalDims?.width,
          height: finalDims?.height,
          originalWidth: origDims?.width,
          originalHeight: origDims?.height,
          capturedMonitor: resolvedMonitorName,
          executionId,
        });
      } catch {
        // Fall back to inline base64 content response if upload fails
      }

      const blocks: ContentBlock[] = [
        {
          type: "text",
          text: `Screenshot: ${monitorLabel} (${dimensionLabel})`,
        },
        { type: "image" as const, data: imageData, mimeType: "image/png" },
      ];
      return createContentResponse(blocks);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error("[Desktop] Failed to read screenshot file", {
        outputPath,
        message,
      });
      return fail({
        message: t("repository.screenshotFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Accessibility tree
// Linux:   python3-pyatspi (works on Wayland via AT-SPI2)
// Windows: PowerShell UIAutomationClient (.NET)
// ---------------------------------------------------------------------------

export interface AccessibilityTreeResult {
  success: boolean;
  tree?: string;
  appName?: string;
  nodeCount?: number;
  truncated?: boolean;
  error?: string;
  executionId: string;
}

function buildPyAtSpiScript(includeActions: boolean): string {
  const actionsBlock = includeActions
    ? `
    try:
        n_actions = node.queryAction().nActions if hasattr(node, 'queryAction') else 0
        if n_actions > 0:
            acts = [node.queryAction().getName(i) for i in range(n_actions)]
            line += ' actions=[' + ','.join(acts) + ']'
    except Exception:
        pass`
    : "";

  return `
import sys
import os
import pyatspi

app_name = sys.argv[1] if len(sys.argv) > 1 else None
max_depth = int(sys.argv[2]) if len(sys.argv) > 2 else 5
node_count = [0]

def dump_node(node, depth=0, max_depth=5):
    if depth > max_depth:
        return
    node_count[0] += 1
    try:
        role = node.getRoleName() if hasattr(node, 'getRoleName') else str(node.role)
    except Exception:
        role = 'unknown'
    name = ''
    try:
        name = node.name or ''
    except Exception:
        pass
    desc = ''
    try:
        desc = node.description or ''
    except Exception:
        pass
    line = '  ' * depth + '[' + role + '] ' + repr(name)
    if desc:
        line += ' desc=' + repr(desc)
    try:
        text_iface = node.queryText()
        text_content = text_iface.getText(0, -1)
        if text_content and len(text_content) <= 200:
            line += ' text=' + repr(text_content)
    except Exception:
        pass${actionsBlock}
    try:
        bounds = node.queryComponent().getExtents(pyatspi.DESKTOP_COORDS)
        if bounds.width > 0 and bounds.height > 0:
            line += ' bbox=(' + str(bounds.x) + ',' + str(bounds.y) + ',' + str(bounds.width) + 'x' + str(bounds.height) + ')'
    except Exception:
        pass
    print(line)
    try:
        for child in node:
            dump_node(child, depth + 1, max_depth)
    except Exception:
        pass

desktop = pyatspi.Registry.getDesktop(0)
for app in desktop:
    if app_name and app_name.lower() not in (app.name or '').lower():
        continue
    try:
        print('=== APP: ' + (app.name or 'unknown') + ' ===')
        dump_node(app, 0, max_depth)
    except Exception as e:
        print('=== APP: ' + (app.name or 'unknown') + ' ERROR: ' + str(e) + ' ===')

print('NODE_COUNT:' + str(node_count[0]))
`.trim();
}

function buildWinUiaScript(appName: string, maxDepth: number): string {
  const safeAppName = appName.replace(/'/g, "''");
  return `
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
$AppName = '${safeAppName}'
$MaxDepth = ${maxDepth}
$count = 0
function DumpNode($node, $depth) {
  if ($depth -gt $MaxDepth) { return }
  $script:count++
  $name = try { $node.Current.Name } catch { "" }
  $role = try { $node.Current.ControlType.ProgrammaticName -replace "ControlType\\.",""} catch { "Unknown" }
  $line = "  " * $depth + "[$role] '$name'"
  $text = ""
  try {
    $vp = $node.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern)
    $text = $vp.Current.Value
  } catch {}
  if ($text) { $line += " text='$text'" }
  try {
    $b = $node.Current.BoundingRectangle
    if ($b.Width -gt 0) { $line += " bbox=($([int]$b.X),$([int]$b.Y),$([int]$b.Width)x$([int]$b.Height))" }
  } catch {}
  Write-Output $line
  try {
    $children = $node.FindAll(
      [System.Windows.Automation.TreeScope]::Children,
      [System.Windows.Automation.Condition]::TrueCondition
    )
    foreach ($c in $children) { DumpNode $c ($depth + 1) }
  } catch {}
}
$root = [System.Windows.Automation.AutomationElement]::RootElement
$apps = $root.FindAll(
  [System.Windows.Automation.TreeScope]::Children,
  [System.Windows.Automation.Condition]::TrueCondition
)
foreach ($app in $apps) {
  $appNameVal = try { $app.Current.Name } catch { "" }
  if ($AppName -and -not $appNameVal.ToLower().Contains($AppName.ToLower())) { continue }
  Write-Output "=== APP: $appNameVal ==="
  DumpNode $app 0
}
Write-Output "NODE_COUNT:$count"
`.trim();
}

export class DesktopAccessibilityRepository {
  private static async getAccessibilityTreeWindows(
    data: { appName?: string; maxDepth?: number; includeActions?: boolean },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<AccessibilityTreeResult>> {
    const executionId = makeExecutionId();
    const script = buildWinUiaScript(data.appName ?? "", data.maxDepth ?? 5);

    let stdout = "";
    let timedOut = false;

    const result = await runPowerShell(script, t, logger, { timeout: 20_000 });
    if (isCommandError(result)) {
      if (
        "message" in result &&
        typeof result.message === "string" &&
        (result.message.includes("ETIMEDOUT") ||
          result.message.includes("killed"))
      ) {
        timedOut = true;
      } else {
        return result as ResponseType<AccessibilityTreeResult>;
      }
    } else {
      stdout = result.stdout;
    }

    let nodeCount: number | undefined;
    const nodeCountMatch = /NODE_COUNT:(\d+)/.exec(stdout);
    if (nodeCountMatch) {
      nodeCount = parseInt(nodeCountMatch[1], 10);
      stdout = stdout.replace(/NODE_COUNT:\d+\n?/, "");
    }

    let tree = timedOut
      ? `${stdout.trim()}\n\n[WARNING: Query timed out - output may be incomplete]`
      : stdout.trim();

    if (data.appName && (!nodeCount || nodeCount === 0) && !timedOut) {
      tree = `[No accessibility data found for "${data.appName}"]\n\nThe app may not expose UI Automation. Try running with elevated privileges or check if the app supports UIA.`;
    }

    return success({
      success: true,
      tree,
      appName: data.appName,
      nodeCount: nodeCount ?? 0,
      truncated: timedOut,
      executionId,
    });
  }

  static async getAccessibilityTree(
    data: { appName?: string; maxDepth?: number; includeActions?: boolean },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<AccessibilityTreeResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<AccessibilityTreeResult>;
    }

    if (process.platform === "win32") {
      return DesktopAccessibilityRepository.getAccessibilityTreeWindows(
        data,
        t,
        logger,
      );
    }

    const executionId = makeExecutionId();

    const pyOk = await ensurePyAtspi(logger);
    if (!pyOk) {
      return missingDepFail(t, "python3-pyatspi");
    }

    const scriptPath = `/tmp/desktop-atspi-${executionId}.py`;
    const includeActions = data.includeActions ?? false;

    try {
      const { writeFileSync } = await import("node:fs");
      writeFileSync(scriptPath, buildPyAtSpiScript(includeActions), "utf-8");
    } catch (err) {
      logger.error("[Desktop] Failed to write atspi script", {
        message: String(err),
      });
      return fail({
        message: t("repository.accessibilityFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Always pass both positional args so maxDepth isn't misread as appName.
    // Empty string = no filter (Python: `if app_name and ...` skips empty).
    const args = [scriptPath, data.appName ?? "", String(data.maxDepth ?? 5)];

    const atSpiBusAddr = await getAtSpiBusAddress();
    const atSpiEnv: NodeJS.ProcessEnv = {
      ...sessionEnv(),
      // Only override AT_SPI_BUS_ADDRESS; keep DBUS_SESSION_BUS_ADDRESS as the
      // main session bus so qdbus6 and other tools inside pyatspi still work.
      ...(atSpiBusAddr ? { AT_SPI_BUS_ADDRESS: atSpiBusAddr } : {}),
    };

    let stdout = "";
    let timedOut = false;

    try {
      const r = await execFile("python3", args, {
        timeout: 15_000,
        env: atSpiEnv,
        maxBuffer: 5 * 1024 * 1024,
      });
      stdout = r.stdout;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("ETIMEDOUT") || message.includes("killed")) {
        timedOut = true;
        if (
          err !== null &&
          typeof err === "object" &&
          "stdout" in err &&
          typeof err.stdout === "string"
        ) {
          stdout = err.stdout;
        }
      } else {
        try {
          const { unlinkSync } = await import("node:fs");
          unlinkSync(scriptPath);
        } catch {
          /* non-fatal */
        }
        return fail({
          message: t("repository.accessibilityFailed"),
          messageParams: { error: message },
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    try {
      const { unlinkSync } = await import("node:fs");
      unlinkSync(scriptPath);
    } catch {
      /* non-fatal */
    }

    let nodeCount: number | undefined;
    const nodeCountMatch = /NODE_COUNT:(\d+)/.exec(stdout);
    if (nodeCountMatch) {
      nodeCount = parseInt(nodeCountMatch[1], 10);
      stdout = stdout.replace(/NODE_COUNT:\d+\n?/, "");
    }

    let tree = timedOut
      ? `${stdout.trim()}\n\n[WARNING: Query timed out - output may be incomplete]`
      : stdout.trim();

    // If a specific app was requested but the tree is empty, add a helpful hint
    if (data.appName && (!nodeCount || nodeCount === 0) && !timedOut) {
      tree = `[No accessibility data found for "${data.appName}"]\n\nThe app may not have AT-SPI accessibility enabled.\n- Firefox: go to about:config → set accessibility.force_disabled = -1 → restart\n- Electron apps: launch with --enable-accessibility flag\n- Other apps: check if they expose AT-SPI (some require a11y settings enabled)`;
    }

    return success({
      success: true,
      tree,
      appName: data.appName,
      nodeCount: nodeCount ?? 0,
      truncated: timedOut,
      executionId,
    });
  }
}

// ---------------------------------------------------------------------------
// Key name → Linux keycode map (from /usr/include/linux/input-event-codes.h)
// ---------------------------------------------------------------------------

const KEY_MAP: Record<string, number> = {
  Escape: 1,
  Esc: 1,
  "1": 2,
  "2": 3,
  "3": 4,
  "4": 5,
  "5": 6,
  "6": 7,
  "7": 8,
  "8": 9,
  "9": 10,
  "0": 11,
  minus: 12,
  equal: 13,
  BackSpace: 14,
  Tab: 15,
  q: 16,
  w: 17,
  e: 18,
  r: 19,
  t: 20,
  y: 21,
  u: 22,
  i: 23,
  o: 24,
  p: 25,
  bracketleft: 26,
  bracketright: 27,
  Return: 28,
  Enter: 28,
  Control_L: 29,
  ctrl: 29,
  a: 30,
  s: 31,
  d: 32,
  f: 33,
  g: 34,
  h: 35,
  j: 36,
  k: 37,
  l: 38,
  semicolon: 39,
  apostrophe: 40,
  grave: 41,
  Shift_L: 42,
  shift: 42,
  backslash: 43,
  z: 44,
  x: 45,
  c: 46,
  v: 47,
  b: 48,
  n: 49,
  m: 50,
  comma: 51,
  period: 52,
  slash: 53,
  Shift_R: 54,
  KP_Multiply: 55,
  Alt_L: 56,
  alt: 56,
  space: 57,
  " ": 57,
  Caps_Lock: 58,
  F1: 59,
  F2: 60,
  F3: 61,
  F4: 62,
  F5: 63,
  F6: 64,
  F7: 65,
  F8: 66,
  F9: 67,
  F10: 68,
  Num_Lock: 69,
  Scroll_Lock: 70,
  F11: 87,
  F12: 88,
  Home: 102,
  Up: 103,
  Prior: 104,
  Left: 105,
  Right: 106,
  End: 107,
  Down: 108,
  Next: 109,
  Insert: 110,
  Delete: 111,
  Super_L: 125,
  super: 125,
  Meta_L: 125,
  Alt_R: 100,
  Control_R: 97,
  PageUp: 104,
  PageDown: 109,
  ArrowUp: 103,
  ArrowDown: 108,
  ArrowLeft: 105,
  ArrowRight: 106,
};

function resolveKeyCode(part: string): number {
  return (
    KEY_MAP[part] ??
    KEY_MAP[part.toLowerCase()] ??
    KEY_MAP[part.toUpperCase()] ??
    KEY_MAP[part.charAt(0).toUpperCase() + part.slice(1)] ??
    0
  );
}

function resolveKeyArgs(keyExpr: string): string[] {
  const parts = keyExpr.split("+").map((p) => p.trim());
  const codes: number[] = parts
    .map((p) => resolveKeyCode(p))
    .filter((c) => c > 0);
  if (codes.length === 0) {
    return [];
  }
  return [
    ...codes.map((c) => `${c}:1`),
    ...codes.toReversed().map((c) => `${c}:0`),
  ];
}

// ---------------------------------------------------------------------------
// Mouse / keyboard
// Linux:   ydotool (Wayland, /dev/uinput)
// Windows: PowerShell + user32 P/Invoke (mouse_event / keybd_event)
// ---------------------------------------------------------------------------

export interface SimpleResult {
  success: boolean;
  error?: string;
  executionId: string;
}

export class DesktopInputRepository {
  private static async clickWindows(
    data: {
      x: number;
      y: number;
      button?: "left" | "middle" | "right";
      doubleClick?: boolean;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const executionId = makeExecutionId();
    const btnDown =
      data.button === "right"
        ? "[WinApi]::MOUSEEVENTF_RIGHTDOWN"
        : data.button === "middle"
          ? "[WinApi]::MOUSEEVENTF_MIDDLEDOWN"
          : "[WinApi]::MOUSEEVENTF_LEFTDOWN";
    const btnUp =
      data.button === "right"
        ? "[WinApi]::MOUSEEVENTF_RIGHTUP"
        : data.button === "middle"
          ? "[WinApi]::MOUSEEVENTF_MIDDLEUP"
          : "[WinApi]::MOUSEEVENTF_LEFTUP";
    const times = data.doubleClick ? 2 : 1;

    const clickLines: string[] = [];
    for (let i = 0; i < times; i++) {
      clickLines.push(
        `[WinApi]::mouse_event(${btnDown}, 0, 0, 0, [IntPtr]::Zero)`,
        "[System.Threading.Thread]::Sleep(30)",
        `[WinApi]::mouse_event(${btnUp}, 0, 0, 0, [IntPtr]::Zero)`,
      );
      if (data.doubleClick && i === 0) {
        clickLines.push("[System.Threading.Thread]::Sleep(80)");
      }
    }

    const script = [
      WIN_API_TYPEDEF,
      `[WinApi]::SetCursorPos(${data.x}, ${data.y})`,
      "[System.Threading.Thread]::Sleep(50)",
      ...clickLines,
      'Write-Output "OK"',
    ].join("\n");

    const result = await runPowerShell(script, t, logger);
    if (isCommandError(result)) {
      return result as ResponseType<SimpleResult>;
    }
    return success({ success: true, executionId });
  }

  private static async typeTextWindows(
    data: {
      text: string;
      delay?: number;
      windowId?: string;
      windowTitle?: string;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const executionId = makeExecutionId();

    if (data.windowId ?? data.windowTitle) {
      await DesktopWindowRepository.focusWindow(
        { windowId: data.windowId, title: data.windowTitle },
        t,
        logger,
      );
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 300);
      });
    }

    // Use base64 encoding to safely pass arbitrary text to PowerShell
    const b64 = Buffer.from(data.text, "utf-8").toString("base64");
    const script = `
Add-Type -AssemblyName System.Windows.Forms
$text = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${b64}'))
$prev = [System.Windows.Forms.Clipboard]::GetText()
[System.Windows.Forms.Clipboard]::SetText($text)
[System.Windows.Forms.SendKeys]::SendWait('^v')
[System.Threading.Thread]::Sleep(300)
if ($prev) { [System.Windows.Forms.Clipboard]::SetText($prev) } else { [System.Windows.Forms.Clipboard]::Clear() }
Write-Output "OK"
`.trim();

    const result = await runPowerShell(script, t, logger);
    if (isCommandError(result)) {
      return result as ResponseType<SimpleResult>;
    }
    return success({ success: true, executionId });
  }

  private static async pressKeyWindows(
    data: {
      key: string;
      repeat?: number;
      delay?: number;
      windowId?: string;
      windowTitle?: string;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const executionId = makeExecutionId();

    if (data.windowId ?? data.windowTitle) {
      await DesktopWindowRepository.focusWindow(
        { windowId: data.windowId, title: data.windowTitle },
        t,
        logger,
      );
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 300);
      });
    }

    const keyScript = buildWindowsKeyScript(data.key);
    if (!keyScript) {
      return fail({
        message: t("repository.commandFailed"),
        messageParams: { error: `Unknown key name: ${data.key}` },
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const repeat = data.repeat ?? 1;
    for (let i = 0; i < repeat; i++) {
      const result = await runPowerShell(keyScript, t, logger);
      if (isCommandError(result)) {
        return result as ResponseType<SimpleResult>;
      }
      if (repeat > 1 && data.delay) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, data.delay);
        });
      }
    }

    return success({ success: true, executionId });
  }

  private static async moveMouseWindows(
    data: { x: number; y: number },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const executionId = makeExecutionId();
    const script = [
      WIN_API_TYPEDEF,
      `[WinApi]::SetCursorPos(${data.x}, ${data.y}) | Out-Null`,
      'Write-Output "OK"',
    ].join("\n");
    const result = await runPowerShell(script, t, logger);
    if (isCommandError(result)) {
      return result as ResponseType<SimpleResult>;
    }
    return success({ success: true, executionId });
  }

  private static async scrollWindows(
    data: {
      x?: number;
      y?: number;
      direction: "up" | "down" | "left" | "right";
      amount?: number;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const executionId = makeExecutionId();
    const amount = data.amount ?? 3;
    const isVertical = data.direction === "up" || data.direction === "down";
    const sign = data.direction === "up" || data.direction === "left" ? 1 : -1;
    const delta = sign * amount * 120;
    const flag = isVertical
      ? "[WinApi]::MOUSEEVENTF_WHEEL"
      : "[WinApi]::MOUSEEVENTF_HWHEEL";

    const lines: string[] = [WIN_API_TYPEDEF];
    if (data.x !== undefined && data.y !== undefined) {
      lines.push(
        `[WinApi]::SetCursorPos(${data.x}, ${data.y}) | Out-Null`,
        "[System.Threading.Thread]::Sleep(50)",
      );
    }
    lines.push(
      `[WinApi]::mouse_event(${flag}, 0, 0, ${delta}, [IntPtr]::Zero)`,
      'Write-Output "OK"',
    );

    const result = await runPowerShell(lines.join("\n"), t, logger);
    if (isCommandError(result)) {
      return result as ResponseType<SimpleResult>;
    }
    return success({ success: true, executionId });
  }

  static async click(
    data: {
      x: number;
      y: number;
      button?: "left" | "middle" | "right";
      doubleClick?: boolean;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
    }

    if (process.platform === "win32") {
      return DesktopInputRepository.clickWindows(data, t, logger);
    }

    const ok = await ensureYdotool(logger);
    if (!ok) {
      return missingDepFail(t, "ydotool");
    }

    const executionId = makeExecutionId();

    const moveResult = await runCommand(
      "ydotool",
      ["mousemove", "--absolute", "-x", String(data.x), "-y", String(data.y)],
      t,
      logger,
    );
    if (isCommandError(moveResult)) {
      return moveResult as ResponseType<SimpleResult>;
    }

    const btnHex =
      data.button === "right"
        ? "0x02"
        : data.button === "middle"
          ? "0x01"
          : "0x00";
    const times = data.doubleClick ? 2 : 1;
    for (let i = 0; i < times; i++) {
      const clickResult = await runCommand(
        "ydotool",
        ["click", btnHex],
        t,
        logger,
      );
      if (isCommandError(clickResult)) {
        return clickResult as ResponseType<SimpleResult>;
      }
    }

    return success({ success: true, executionId });
  }

  static async typeText(
    data: {
      text: string;
      delay?: number;
      windowId?: string;
      windowTitle?: string;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
    }

    if (process.platform === "win32") {
      return DesktopInputRepository.typeTextWindows(data, t, logger);
    }

    const ok = await ensureYdotool(logger);
    if (!ok) {
      return missingDepFail(t, "ydotool");
    }

    const executionId = makeExecutionId();

    if (data.windowId ?? data.windowTitle) {
      const isKRunner = data.windowTitle?.toLowerCase() === "krunner";
      if (isKRunner) {
        await execFile("qdbus6", ["org.kde.krunner", "/App", "display"], {
          timeout: 5000,
          env: sessionEnv(),
        }).catch(() => {
          /* ignore */
        });
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 600);
        });
      } else {
        await DesktopWindowRepository.focusWindow(
          { windowId: data.windowId, title: data.windowTitle },
          t,
          logger,
        );
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 300);
        });
      }
    }

    const delay = data.delay ?? 20;
    const result = await runCommand(
      "ydotool",
      ["type", `--key-delay=${delay}`, "--", data.text],
      t,
      logger,
    );
    if (isCommandError(result)) {
      return result as ResponseType<SimpleResult>;
    }

    return success({ success: true, executionId });
  }

  static async pressKey(
    data: {
      key: string;
      repeat?: number;
      delay?: number;
      windowId?: string;
      windowTitle?: string;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
    }

    if (process.platform === "win32") {
      return DesktopInputRepository.pressKeyWindows(data, t, logger);
    }

    const ok = await ensureYdotool(logger);
    if (!ok) {
      return missingDepFail(t, "ydotool");
    }

    const executionId = makeExecutionId();

    if (data.windowId ?? data.windowTitle) {
      await DesktopWindowRepository.focusWindow(
        { windowId: data.windowId, title: data.windowTitle },
        t,
        logger,
      );
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 300);
      });
    }

    const keyArgs = resolveKeyArgs(data.key);
    if (keyArgs.length === 0) {
      return fail({
        message: t("repository.commandFailed"),
        messageParams: { error: `Unknown key name: ${data.key}` },
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const args = ["key"];
    if (data.delay !== undefined) {
      args.push("--key-delay", String(data.delay));
    }
    args.push(...keyArgs);

    const repeat = data.repeat ?? 1;
    for (let i = 0; i < repeat; i++) {
      const result = await runCommand("ydotool", args, t, logger);
      if (isCommandError(result)) {
        return result as ResponseType<SimpleResult>;
      }
    }

    return success({ success: true, executionId });
  }

  static async moveMouse(
    data: { x: number; y: number },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
    }

    if (process.platform === "win32") {
      return DesktopInputRepository.moveMouseWindows(data, t, logger);
    }

    const ok = await ensureYdotool(logger);
    if (!ok) {
      return missingDepFail(t, "ydotool");
    }

    const executionId = makeExecutionId();
    const result = await runCommand(
      "ydotool",
      ["mousemove", "--absolute", "-x", String(data.x), "-y", String(data.y)],
      t,
      logger,
    );
    if (isCommandError(result)) {
      return result as ResponseType<SimpleResult>;
    }

    return success({ success: true, executionId });
  }

  static async scroll(
    data: {
      x?: number;
      y?: number;
      direction: "up" | "down" | "left" | "right";
      amount?: number;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
    }

    if (process.platform === "win32") {
      return DesktopInputRepository.scrollWindows(data, t, logger);
    }

    const ok = await ensureYdotool(logger);
    if (!ok) {
      return missingDepFail(t, "ydotool");
    }

    const executionId = makeExecutionId();
    const amount = data.amount ?? 3;

    if (data.x !== undefined && data.y !== undefined) {
      const moveResult = await runCommand(
        "ydotool",
        ["mousemove", "--absolute", "-x", String(data.x), "-y", String(data.y)],
        t,
        logger,
      );
      if (isCommandError(moveResult)) {
        return moveResult as ResponseType<SimpleResult>;
      }
    }

    const isVertical = data.direction === "up" || data.direction === "down";
    const sign = data.direction === "up" || data.direction === "left" ? 1 : -1;
    const scrollArgs = isVertical
      ? ["mousemove", "--wheel", "--", "0", String(sign * amount)]
      : ["mousemove", "--wheel", "--", String(sign * amount), "0"];

    const scrollResult = await runCommand("ydotool", scrollArgs, t, logger);
    if (isCommandError(scrollResult)) {
      return scrollResult as ResponseType<SimpleResult>;
    }

    return success({ success: true, executionId });
  }
}

// ---------------------------------------------------------------------------
// Window management
// Linux:   qdbus6 (KDE Plasma DBus, Wayland native)
// Windows: PowerShell Get-Process + user32 P/Invoke
// ---------------------------------------------------------------------------

export interface FocusedWindowResult {
  success: boolean;
  windowId?: string;
  windowTitle?: string;
  pid?: number;
  width?: number;
  height?: number;
  monitor?: string;
  error?: string;
  executionId: string;
}

export interface WindowInfo {
  windowId: string;
  monitor: string;
  pid: number;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}

export interface ListWindowsResult {
  success: boolean;
  windows?: WindowInfo[];
  error?: string;
  executionId: string;
}

export interface MoveWindowToMonitorResult {
  success: boolean;
  movedTo?: string;
  windowTitle?: string;
  error?: string;
  executionId: string;
}

export class DesktopWindowRepository {
  private static async getFocusedWindowWindows(
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<FocusedWindowResult>> {
    const executionId = makeExecutionId();
    const script = `
${WIN_API_TYPEDEF}
$h = [WinApi]::GetForegroundWindow()
$sb = New-Object System.Text.StringBuilder(512)
[WinApi]::GetWindowText($h, $sb, 512) | Out-Null
$pid = 0u
[WinApi]::GetWindowThreadProcessId($h, [ref]$pid) | Out-Null
@{windowId=$h.ToInt64().ToString();title=$sb.ToString();pid=[int]$pid} | ConvertTo-Json -Compress
`.trim();

    const result = await runPowerShell(script, t, logger);
    if (isCommandError(result)) {
      return result as ResponseType<FocusedWindowResult>;
    }

    try {
      const parsed = JSON.parse(result.stdout.trim()) as {
        windowId?: string;
        title?: string;
        pid?: number;
      };
      return success({
        success: true,
        windowId: parsed.windowId ?? "",
        windowTitle: parsed.title,
        pid: parsed.pid ?? 0,
        executionId,
      });
    } catch {
      return fail({
        message: t("repository.commandFailed", {
          error: "Failed to parse focused window output",
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async listWindowsWindows(
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ListWindowsResult>> {
    const executionId = makeExecutionId();
    const script = `
${WIN_API_TYPEDEF}
Get-Process | Where-Object { $_.MainWindowTitle -ne "" -and $_.MainWindowHandle -ne [IntPtr]::Zero } | ForEach-Object {
  $r = New-Object WinRect
  [WinApi]::GetWindowRect($_.MainWindowHandle, [ref]$r) | Out-Null
  @{
    windowId = $_.MainWindowHandle.ToInt64().ToString()
    pid      = $_.Id
    title    = $_.MainWindowTitle
    x        = $r.Left
    y        = $r.Top
    width    = $r.Right - $r.Left
    height   = $r.Bottom - $r.Top
  } | ConvertTo-Json -Compress
}
`.trim();

    const result = await runPowerShell(script, t, logger);
    if (isCommandError(result)) {
      return result as ResponseType<ListWindowsResult>;
    }

    const windows: WindowInfo[] = [];
    for (const line of result.stdout.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("{")) {
        continue;
      }
      try {
        const w = JSON.parse(trimmed) as {
          windowId?: string;
          pid?: number;
          title?: string;
          x?: number;
          y?: number;
          width?: number;
          height?: number;
        };
        if (w.windowId) {
          windows.push({
            windowId: w.windowId,
            title: w.title ?? "",
            pid: w.pid ?? 0,
            x: w.x ?? 0,
            y: w.y ?? 0,
            width: w.width ?? 0,
            height: w.height ?? 0,
            monitor: "",
          });
        }
      } catch {
        /* skip non-JSON lines */
      }
    }

    if (windows.length > 0) {
      const monitors = await listMonitors(logger);
      for (const win of windows) {
        const cx = win.x + win.width / 2;
        const cy = win.y + win.height / 2;
        const hit = monitors.find(
          (m) =>
            cx >= m.x && cx < m.x + m.width && cy >= m.y && cy < m.y + m.height,
        );
        win.monitor = hit?.name ?? "";
      }
    }

    return success({ success: true, windows, executionId });
  }

  private static async focusWindowWindows(
    data: { windowId?: string; pid?: number; title?: string },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const executionId = makeExecutionId();

    let handle = data.windowId;

    if (!handle) {
      const listResult = await DesktopWindowRepository.listWindowsWindows(
        t,
        logger,
      );
      if (!listResult.success || !listResult.data.windows) {
        return fail({
          message: t("repository.commandFailed"),
          messageParams: { error: "Could not list windows" },
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const match = listResult.data.windows.find((w: WindowInfo) =>
        data.pid !== undefined
          ? w.pid === data.pid
          : w.title.toLowerCase().includes((data.title ?? "").toLowerCase()),
      );
      if (!match) {
        return fail({
          message: t("repository.commandFailed"),
          messageParams: {
            error: data.pid
              ? `No window with PID ${data.pid}`
              : `No window with title containing "${data.title}"`,
          },
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      handle = match.windowId;
    }

    const handleLong = String(BigInt(handle));
    const script = `
${WIN_API_TYPEDEF}
$h = [IntPtr]::new([long]${handleLong})
[WinApi]::ShowWindow($h, [WinApi]::SW_RESTORE) | Out-Null
[System.Threading.Thread]::Sleep(150)
[WinApi]::SetForegroundWindow($h) | Out-Null
Write-Output "OK"
`.trim();

    const result = await runPowerShell(script, t, logger);
    if (isCommandError(result)) {
      return result as ResponseType<SimpleResult>;
    }
    return success({ success: true, executionId });
  }

  private static async moveWindowToMonitorWindows(
    data: {
      windowId?: string;
      pid?: number;
      title?: string;
      monitorName?: string;
      monitorIndex?: number;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MoveWindowToMonitorResult>> {
    const executionId = makeExecutionId();

    if (data.monitorName === undefined && data.monitorIndex === undefined) {
      return fail({
        message: t("repository.commandFailed", {
          error: "Provide monitorName or monitorIndex",
        }),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const monitors = await listMonitors(logger);
    let targetMonitor: MonitorInfo | undefined;
    if (data.monitorName) {
      targetMonitor = monitors.find(
        (m) => m.name.toLowerCase() === data.monitorName!.toLowerCase(),
      );
    } else if (data.monitorIndex !== undefined) {
      targetMonitor = monitors[data.monitorIndex];
    }

    if (!targetMonitor) {
      return fail({
        message: t("repository.commandFailed", {
          error: `Monitor not found: ${data.monitorName ?? data.monitorIndex}`,
        }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    let handle = data.windowId;
    let windowTitle: string | undefined;

    if (!handle) {
      const listResult = await DesktopWindowRepository.listWindowsWindows(
        t,
        logger,
      );
      if (!listResult.success || !listResult.data.windows) {
        return fail({
          message: t("repository.commandFailed", {
            error: "Could not list windows",
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const match = listResult.data.windows.find((w: WindowInfo) =>
        data.pid !== undefined
          ? w.pid === data.pid
          : w.title.toLowerCase().includes((data.title ?? "").toLowerCase()),
      );
      if (!match) {
        return fail({
          message: t("repository.commandFailed", {
            error: data.pid
              ? `No window with PID ${data.pid}`
              : `No window with title containing "${data.title}"`,
          }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      handle = match.windowId;
      windowTitle = match.title;
    }

    const { x: mx, y: my, name: monName } = targetMonitor;
    const targetX = mx + 40;
    const targetY = my + 40;
    const handleLong = String(BigInt(handle));

    const script = `
${WIN_API_TYPEDEF}
$h = [IntPtr]::new([long]${handleLong})
$r = New-Object WinRect
[WinApi]::GetWindowRect($h, [ref]$r) | Out-Null
$w = $r.Right - $r.Left
$ht = $r.Bottom - $r.Top
[WinApi]::ShowWindow($h, [WinApi]::SW_RESTORE) | Out-Null
[WinApi]::MoveWindow($h, ${targetX}, ${targetY}, $w, $ht, $true) | Out-Null
[WinApi]::SetForegroundWindow($h) | Out-Null
Write-Output "OK"
`.trim();

    const result = await runPowerShell(script, t, logger);
    if (isCommandError(result)) {
      return result as ResponseType<MoveWindowToMonitorResult>;
    }

    return success({
      success: true,
      movedTo: monName,
      windowTitle,
      executionId,
    });
  }

  static async getFocusedWindow(
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<FocusedWindowResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<FocusedWindowResult>;
    }

    if (process.platform === "win32") {
      return DesktopWindowRepository.getFocusedWindowWindows(t, logger);
    }

    const executionId = makeExecutionId();

    // Use KWin scripting to get active window without requiring user interaction.
    // queryWindowInfo() requires a click; workspace.activeWindow does not.
    const script = `
var w = workspace.activeWindow;
if (w) {
  print("KWIN_ACTIVE_START_${executionId}");
  print(JSON.stringify({
    uuid: String(w.internalId),
    caption: w.caption,
    pid: w.pid,
    x: Math.round(w.x),
    y: Math.round(w.y),
    width: Math.round(w.width),
    height: Math.round(w.height)
  }));
  print("KWIN_ACTIVE_END_${executionId}");
} else {
  print("KWIN_ACTIVE_NONE_${executionId}");
}
`.trim();

    const scriptPath = `/tmp/kwin-active-${executionId}.js`;
    const { writeFileSync, unlinkSync } = await import("node:fs");
    writeFileSync(scriptPath, script, "utf-8");

    const loadResult = await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        "/Scripting",
        "org.kde.kwin.Scripting.loadScript",
        scriptPath,
      ],
      t,
      logger,
    );

    if (isCommandError(loadResult)) {
      try {
        unlinkSync(scriptPath);
      } catch {
        /* non-fatal */
      }
      return loadResult as ResponseType<FocusedWindowResult>;
    }

    const scriptId = loadResult.stdout.trim();

    await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        `/Scripting/Script${scriptId}`,
        "org.kde.kwin.Script.run",
      ],
      t,
      logger,
    );

    try {
      unlinkSync(scriptPath);
    } catch {
      /* non-fatal */
    }

    await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        `/Scripting/Script${scriptId}`,
        "org.kde.kwin.Script.stop",
      ],
      t,
      logger,
    );

    const journalResult = await runCommand(
      "journalctl",
      ["--user", "-n", "100", "--no-pager", "-o", "cat", "_COMM=kwin_wayland"],
      t,
      logger,
    );

    if (isCommandError(journalResult)) {
      return journalResult as ResponseType<FocusedWindowResult>;
    }

    const lines = journalResult.stdout.split("\n");
    const noneIdx = lines.findLastIndex(
      (l) => l.trim() === `KWIN_ACTIVE_NONE_${executionId}`,
    );
    if (noneIdx >= 0) {
      return fail({
        message: t("repository.commandFailed", {
          error: "No active window",
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const startIdx = lines.findLastIndex(
      (l) => l.trim() === `KWIN_ACTIVE_START_${executionId}`,
    );
    if (startIdx < 0) {
      return fail({
        message: t("repository.commandFailed", {
          error: "KWin script produced no output",
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const jsonLine = lines[startIdx + 1]?.trim();
    if (!jsonLine) {
      return fail({
        message: t("repository.commandFailed", {
          error: "No window data in KWin script output",
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    let parsed: {
      uuid?: string;
      caption?: string;
      pid?: number;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
    try {
      parsed = JSON.parse(jsonLine) as {
        uuid?: string;
        caption?: string;
        pid?: number;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
      };
    } catch {
      return fail({
        message: t("repository.commandFailed", { error: jsonLine }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const windowId = parsed.uuid ?? "";
    const windowTitle = parsed.caption;
    const pid =
      parsed.pid !== undefined && parsed.pid > 0 ? parsed.pid : undefined;
    const winWidth =
      parsed.width && parsed.width > 0 ? parsed.width : undefined;
    const winHeight =
      parsed.height && parsed.height > 0 ? parsed.height : undefined;

    // Determine which monitor the focused window is on using its center point
    let monitor: string | undefined;
    if (
      parsed.x !== undefined &&
      parsed.y !== undefined &&
      winWidth !== undefined &&
      winHeight !== undefined
    ) {
      const monitors = await listMonitors(logger);
      const cx = parsed.x + winWidth / 2;
      const cy = parsed.y + winHeight / 2;
      const hit = monitors.find(
        (m) =>
          cx >= m.x && cx < m.x + m.width && cy >= m.y && cy < m.y + m.height,
      );
      monitor = hit?.name;
    }

    return success({
      success: true,
      windowId,
      windowTitle,
      pid,
      width: winWidth,
      height: winHeight,
      monitor,
      executionId,
    });
  }

  static async listWindows(
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ListWindowsResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<ListWindowsResult>;
    }

    if (process.platform === "win32") {
      return DesktopWindowRepository.listWindowsWindows(t, logger);
    }

    const executionId = makeExecutionId();

    const script = `
print("KWIN_LIST_START_${executionId}");
var wins = workspace.windowList();
for (var i = 0; i < wins.length; i++) {
  var w = wins[i];
  if (w.skipTaskbar || !w.caption) continue;
  print(JSON.stringify({
    uuid: String(w.internalId),
    title: w.caption,
    pid: w.pid,
    x: Math.round(w.x),
    y: Math.round(w.y),
    width: Math.round(w.width),
    height: Math.round(w.height),
    minimized: w.minimized
  }));
}
print("KWIN_LIST_END_${executionId}");
`.trim();

    const scriptPath = `/tmp/kwin-list-${executionId}.js`;
    const { writeFileSync, unlinkSync } = await import("node:fs");
    writeFileSync(scriptPath, script, "utf-8");

    const loadResult = await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        "/Scripting",
        "org.kde.kwin.Scripting.loadScript",
        scriptPath,
      ],
      t,
      logger,
    );

    if (isCommandError(loadResult)) {
      try {
        unlinkSync(scriptPath);
      } catch {
        /* non-fatal */
      }
      return loadResult as ResponseType<ListWindowsResult>;
    }

    const scriptId = loadResult.stdout.trim();

    await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        `/Scripting/Script${scriptId}`,
        "org.kde.kwin.Script.run",
      ],
      t,
      logger,
    );

    try {
      unlinkSync(scriptPath);
    } catch {
      /* non-fatal */
    }

    await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        `/Scripting/Script${scriptId}`,
        "org.kde.kwin.Script.stop",
      ],
      t,
      logger,
    );

    const journalResult = await runCommand(
      "journalctl",
      ["--user", "-n", "500", "--no-pager", "-o", "cat", "_COMM=kwin_wayland"],
      t,
      logger,
    );

    const windows: WindowInfo[] = [];

    if (!isCommandError(journalResult)) {
      const lines = journalResult.stdout.split("\n");
      const markerIdx = lines.findLastIndex(
        (l) => l.trim() === `KWIN_LIST_START_${executionId}`,
      );
      if (markerIdx >= 0) {
        for (const line of lines.slice(markerIdx + 1)) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("{")) {
            break;
          }
          try {
            const w = JSON.parse(trimmed) as {
              uuid?: string;
              title?: string;
              pid?: number;
              x?: number;
              y?: number;
              width?: number;
              height?: number;
            };
            if (w.uuid) {
              windows.push({
                windowId: w.uuid,
                title: w.title ?? "",
                pid: w.pid ?? 0,
                x: w.x ?? 0,
                y: w.y ?? 0,
                width: w.width ?? 0,
                height: w.height ?? 0,
                monitor: "",
              });
            }
          } catch {
            /* skip non-JSON lines */
          }
        }
      }
    }

    // Annotate each window with the monitor it primarily lives on.
    // Window coords from KWin are in logical kscreen space; monitor coords
    // from listMonitors (xrandr) are also logical — they match directly.
    if (windows.length > 0) {
      const monitors = await listMonitors(logger);
      for (const win of windows) {
        const cx = win.x + win.width / 2;
        const cy = win.y + win.height / 2;
        // Find monitor whose rect contains the window center
        const hit = monitors.find(
          (m) =>
            cx >= m.x && cx < m.x + m.width && cy >= m.y && cy < m.y + m.height,
        );
        win.monitor = hit?.name ?? "";
      }
    }

    return success({ success: true, windows, executionId });
  }

  static async focusWindow(
    data: { windowId?: string; pid?: number; title?: string },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
    }

    if (process.platform === "win32") {
      return DesktopWindowRepository.focusWindowWindows(data, t, logger);
    }

    const executionId = makeExecutionId();

    if (!data.windowId && data.pid === undefined && !data.title) {
      return fail({
        message: t("repository.focusWindowRequiresIdentifier"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    let targetId = data.windowId;

    if (!targetId) {
      const listResult = await DesktopWindowRepository.listWindows(t, logger);
      if (!listResult.success || !listResult.data.windows) {
        return fail({
          message: t("repository.commandFailed"),
          messageParams: { error: "Could not list windows" },
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const match = listResult.data.windows.find((w: WindowInfo) =>
        data.pid !== undefined
          ? w.pid === data.pid
          : w.title.toLowerCase().includes((data.title ?? "").toLowerCase()),
      );
      if (!match) {
        return fail({
          message: t("repository.commandFailed"),
          messageParams: {
            error: data.pid
              ? `No window with PID ${data.pid}`
              : `No window with title containing "${data.title}"`,
          },
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      targetId = match.windowId;
    }

    const resolvedId: string = targetId;

    const script = `
var wins = workspace.windowList();
for (var i = 0; i < wins.length; i++) {
  if (String(wins[i].internalId) === "${resolvedId.replace(/[^a-zA-Z0-9{}\\-]/g, "")}") {
    workspace.activeWindow = wins[i];
    break;
  }
}
`.trim();

    const scriptPath = `/tmp/kwin-focus-${executionId}.js`;
    const { writeFileSync, unlinkSync } = await import("node:fs");
    writeFileSync(scriptPath, script, "utf-8");

    const loadResult = await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        "/Scripting",
        "org.kde.kwin.Scripting.loadScript",
        scriptPath,
      ],
      t,
      logger,
    );

    if (isCommandError(loadResult)) {
      try {
        unlinkSync(scriptPath);
      } catch {
        /* non-fatal */
      }
      return loadResult as ResponseType<SimpleResult>;
    }

    const scriptId = loadResult.stdout.trim();
    await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        `/Scripting/Script${scriptId}`,
        "org.kde.kwin.Script.run",
      ],
      t,
      logger,
    );
    try {
      unlinkSync(scriptPath);
    } catch {
      /* non-fatal */
    }
    await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        `/Scripting/Script${scriptId}`,
        "org.kde.kwin.Script.stop",
      ],
      t,
      logger,
    );

    return success({ success: true, executionId });
  }

  static async moveWindowToMonitor(
    data: {
      windowId?: string;
      pid?: number;
      title?: string;
      monitorName?: string;
      monitorIndex?: number;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MoveWindowToMonitorResult>> {
    const platformErr = checkPlatformSupported(t);
    if (platformErr) {
      return platformErr as ResponseType<MoveWindowToMonitorResult>;
    }

    if (process.platform === "win32") {
      return DesktopWindowRepository.moveWindowToMonitorWindows(
        data,
        t,
        logger,
      );
    }

    const executionId = makeExecutionId();

    if (!data.windowId && data.pid === undefined && !data.title) {
      return fail({
        message: t("repository.focusWindowRequiresIdentifier"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    if (data.monitorName === undefined && data.monitorIndex === undefined) {
      return fail({
        message: t("repository.commandFailed", {
          error: "Provide monitorName or monitorIndex",
        }),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const monitors = await listMonitors(logger);
    let targetMonitor: MonitorInfo | undefined;
    if (data.monitorName) {
      targetMonitor = monitors.find(
        (m) => m.name.toLowerCase() === data.monitorName!.toLowerCase(),
      );
    } else if (data.monitorIndex !== undefined) {
      targetMonitor = monitors[data.monitorIndex];
    }

    if (!targetMonitor) {
      return fail({
        message: t("repository.commandFailed", {
          error: `Monitor not found: ${data.monitorName ?? data.monitorIndex}`,
        }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    let targetId = data.windowId;
    let windowTitle: string | undefined;

    if (!targetId) {
      const listResult = await DesktopWindowRepository.listWindows(t, logger);
      if (!listResult.success || !listResult.data.windows) {
        return fail({
          message: t("repository.commandFailed", {
            error: "Could not list windows",
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const match = listResult.data.windows.find((w: WindowInfo) =>
        data.pid !== undefined
          ? w.pid === data.pid
          : w.title.toLowerCase().includes((data.title ?? "").toLowerCase()),
      );
      if (!match) {
        return fail({
          message: t("repository.commandFailed", {
            error: data.pid
              ? `No window with PID ${data.pid}`
              : `No window with title containing "${data.title}"`,
          }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      targetId = match.windowId;
      windowTitle = match.title;
    }

    const resolvedId: string = targetId;
    const {
      x: mx,
      y: my,
      width: mw,
      height: mh,
      name: monName,
    } = targetMonitor;
    const targetX = mx + Math.round(mw / 4);
    const targetY = my + Math.round(mh / 4);

    const safeId = resolvedId.replace(/[^a-zA-Z0-9{}-]/g, "");
    // Use object literal instead of Qt.rect() — Qt is not available in the
    // KWin scripting context on KDE Plasma 6+. Object literals work natively.
    // Also call setMaximize(false, false) first: maximized windows ignore
    // frameGeometry assignments silently.
    const script = `
var wins = workspace.windowList();
for (var i = 0; i < wins.length; i++) {
  var w = wins[i];
  if (String(w.internalId) === "${safeId}") {
    if (w.maximizable) { w.setMaximize(false, false); }
    w.frameGeometry = {x: ${targetX}, y: ${targetY}, width: w.frameGeometry.width, height: w.frameGeometry.height};
    workspace.activeWindow = w;
    break;
  }
}
`.trim();

    const scriptPath = `/tmp/kwin-move-${executionId}.js`;
    const { writeFileSync, unlinkSync } = await import("node:fs");
    writeFileSync(scriptPath, script, "utf-8");

    const loadResult = await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        "/Scripting",
        "org.kde.kwin.Scripting.loadScript",
        scriptPath,
      ],
      t,
      logger,
    );

    if (isCommandError(loadResult)) {
      try {
        unlinkSync(scriptPath);
      } catch {
        /* non-fatal */
      }
      return loadResult as ResponseType<MoveWindowToMonitorResult>;
    }

    const scriptId = loadResult.stdout.trim();
    await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        `/Scripting/Script${scriptId}`,
        "org.kde.kwin.Script.run",
      ],
      t,
      logger,
    );
    try {
      unlinkSync(scriptPath);
    } catch {
      /* non-fatal */
    }
    await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        `/Scripting/Script${scriptId}`,
        "org.kde.kwin.Script.stop",
      ],
      t,
      logger,
    );

    // Verify the move by running a second KWin script that reads final position,
    // then checking via journalctl. Use a unique marker so we only match this run.
    const verifyMarker = `KWIN_VERIFY_${executionId}`;
    const verifyScript = `
var wins = workspace.windowList();
for (var i = 0; i < wins.length; i++) {
  var w = wins[i];
  if (String(w.internalId) === "${safeId}") {
    print("${verifyMarker}:x=" + Math.round(w.x) + ":y=" + Math.round(w.y));
    break;
  }
}
`.trim();
    const verifyPath = `/tmp/kwin-verify-${executionId}.js`;
    writeFileSync(verifyPath, verifyScript, "utf-8");

    const vLoadResult = await runCommand(
      "qdbus6",
      [
        "org.kde.KWin",
        "/Scripting",
        "org.kde.kwin.Scripting.loadScript",
        verifyPath,
      ],
      t,
      logger,
    );

    let verified = false;
    if (!isCommandError(vLoadResult)) {
      const vScriptId = vLoadResult.stdout.trim();
      await runCommand(
        "qdbus6",
        [
          "org.kde.KWin",
          `/Scripting/Script${vScriptId}`,
          "org.kde.kwin.Script.run",
        ],
        t,
        logger,
      );
      try {
        unlinkSync(verifyPath);
      } catch {
        /* non-fatal */
      }
      await runCommand(
        "qdbus6",
        [
          "org.kde.KWin",
          `/Scripting/Script${vScriptId}`,
          "org.kde.kwin.Script.stop",
        ],
        t,
        logger,
      );

      const journalResult = await runCommand(
        "journalctl",
        [
          "--user",
          "-n",
          "500",
          "--no-pager",
          "-o",
          "cat",
          "_COMM=kwin_wayland",
        ],
        t,
        logger,
      );

      if (!isCommandError(journalResult)) {
        const markerLine = journalResult.stdout
          .split("\n")
          .findLast((l) => l.startsWith(verifyMarker));
        if (markerLine) {
          const xMatch = /:x=(-?\d+)/.exec(markerLine);
          const yMatch = /:y=(-?\d+)/.exec(markerLine);
          if (xMatch && yMatch) {
            const finalX = parseInt(xMatch[1], 10);
            const finalY = parseInt(yMatch[1], 10);
            // Window top-left must be within target monitor bounds (50px tolerance)
            verified =
              finalX >= mx - 50 &&
              finalX < mx + mw + 50 &&
              finalY >= my - 50 &&
              finalY < my + mh + 50;
          }
        }
      }
    } else {
      try {
        unlinkSync(verifyPath);
      } catch {
        /* non-fatal */
      }
    }

    if (!verified) {
      return fail({
        message: t("repository.commandFailed", {
          error: `Window move did not take effect — window did not reach monitor ${monName}`,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success({
      success: true,
      movedTo: monName,
      windowTitle,
      executionId,
    });
  }
}
