/**
 * Desktop Automation Shared Repository
 * Wayland/KDE native: spectacle, ydotool, python3-pyatspi, qdbus6, kscreen-doctor.
 * Missing deps are installed on first use via kdesu (native KDE auth dialog).
 * All tools use execFile (never exec) to prevent shell injection.
 */

import "server-only";

import { execFile as execFileCb } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  type ContentBlock,
  type ContentResponse,
  createContentResponse,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { DesktopT } from "../i18n";

const execFile = promisify(execFileCb);

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

function sessionEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    DISPLAY: process.env.DISPLAY ?? ":0",
    WAYLAND_DISPLAY: process.env.WAYLAND_DISPLAY ?? "wayland-0",
    XDG_RUNTIME_DIR:
      process.env.XDG_RUNTIME_DIR ?? `/run/user/${process.getuid?.() ?? 1000}`,
  };
}

// ---------------------------------------------------------------------------
// Dep install via kdesu (native KDE auth dialog) → pkexec fallback
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
    await execFile("which", [binary], { timeout: 3000 });
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

export function checkLinux(t: DesktopT): ResponseType<never> | null {
  if (process.platform === "win32") {
    return fail({
      message: t("repository.windowsNotSupported"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
  if (process.platform === "darwin") {
    return fail({
      message: t("repository.macosNotSupported"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
  if (process.platform !== "linux") {
    return fail({
      message: t("repository.platformNotSupported"),
      messageParams: { platform: process.platform },
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
  return null;
}

// ---------------------------------------------------------------------------
// execFile wrapper
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
// Monitor listing - kscreen-doctor (KDE) with xrandr fallback
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

export async function listMonitors(
  logger: EndpointLogger,
): Promise<MonitorInfo[]> {
  const now = Date.now();
  if (monitorCache && now - monitorCache.ts < MONITOR_CACHE_TTL_MS) {
    return monitorCache.monitors;
  }

  const monitors: MonitorInfo[] = [];

  // Try kscreen-doctor (KDE/Wayland native)
  try {
    const r = await execFile("kscreen-doctor", ["-o"], {
      timeout: 5000,
      env: sessionEnv(),
    });
    let idx = 0;
    for (const line of r.stdout.split("\n")) {
      // Match "Output: N NAME ... geometry X,Y WxH"
      const geoMatch = /geometry\s+(\d+),(\d+)\s+(\d+)x(\d+)/i.exec(line);
      const nameMatch = /Output:\s+\d+\s+(\S+)/i.exec(line);
      if (geoMatch && nameMatch) {
        monitors.push({
          name: nameMatch[1],
          x: parseInt(geoMatch[1], 10),
          y: parseInt(geoMatch[2], 10),
          width: parseInt(geoMatch[3], 10),
          height: parseInt(geoMatch[4], 10),
          index: idx++,
          primary: idx === 1,
        });
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
// AT-SPI2 bus address detection (Wayland)
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
  const sockPath = `/run/user/${uid}/at-spi/bus`;
  if (existsSync(sockPath)) {
    const addr = `unix:path=${sockPath}`;
    atSpiBusAddressCache = { addr, ts: now };
    return addr;
  }

  atSpiBusAddressCache = { addr: null, ts: now };
  return undefined;
}

// ---------------------------------------------------------------------------
// Image helpers - dimensions + downscaling via ImageMagick
// ---------------------------------------------------------------------------

async function getImageDimensions(
  path: string,
): Promise<{ width: number; height: number } | null> {
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
// Screenshot - spectacle (KDE/Wayland native), fallback grim
// ---------------------------------------------------------------------------

export interface ScreenshotResult {
  success: boolean;
  imagePath?: string;
  imageData?: string;
  width?: number;
  height?: number;
  monitorName?: string;
  originalWidth?: number;
  originalHeight?: number;
  error?: string;
  executionId: string;
}

export class DesktopScreenshotRepository {
  static async takeScreenshot(
    data: {
      outputPath?: string;
      screen?: number;
      monitorName?: string;
      maxWidth?: number;
    },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ScreenshotResult> | ContentResponse> {
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<ScreenshotResult>;
    }

    const executionId = makeExecutionId();
    const outputPath =
      data.outputPath ?? `/tmp/desktop-screenshot-${executionId}.png`;

    // Resolve monitor name and geometry from name
    let resolvedMonitorName: string | undefined;
    let monitorGeometry:
      | { x: number; y: number; width: number; height: number }
      | undefined;

    if (data.monitorName) {
      const monitors = await listMonitors(logger);
      const match = monitors.find(
        (m) => m.name.toLowerCase() === data.monitorName!.toLowerCase(),
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
          `[Desktop] Monitor "${data.monitorName}" not found, capturing all`,
        );
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

        // Get screenshot dimensions to compute the scale factor
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
          // Get xrandr virtual screen size
          const xrandrResult = await runCommand("xrandr", [], t, logger);
          if (!isCommandError(xrandrResult) && imgW > 0 && imgH > 0) {
            const screenMatch = /current (\d+) x (\d+)/.exec(
              xrandrResult.stdout,
            );
            if (screenMatch) {
              const xrandrW = parseInt(screenMatch[1] ?? "0", 10);
              const xrandrH = parseInt(screenMatch[2] ?? "0", 10);
              if (xrandrW > 0 && xrandrH > 0) {
                scaleX = imgW / xrandrW;
                scaleY = imgH / xrandrH;
              }
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
          monitorName: resolvedMonitorName,
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
// Accessibility tree - python3-pyatspi (works on Wayland via AT-SPI2)
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

export class DesktopAccessibilityRepository {
  static async getAccessibilityTree(
    data: { appName?: string; maxDepth?: number; includeActions?: boolean },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<AccessibilityTreeResult>> {
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<AccessibilityTreeResult>;
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

    const args = [scriptPath];
    if (data.appName) {
      args.push(data.appName);
    }
    if (data.maxDepth !== undefined) {
      args.push(String(data.maxDepth));
    }

    const atSpiBusAddr = await getAtSpiBusAddress();
    const atSpiEnv: NodeJS.ProcessEnv = {
      ...sessionEnv(),
      ...(atSpiBusAddr
        ? {
            AT_SPI_BUS_ADDRESS: atSpiBusAddr,
            DBUS_SESSION_BUS_ADDRESS:
              process.env.DBUS_SESSION_BUS_ADDRESS ?? atSpiBusAddr,
          }
        : {}),
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

    const tree = timedOut
      ? `${stdout.trim()}\n\n[WARNING: Query timed out - output may be incomplete]`
      : stdout.trim();

    return success({
      success: true,
      tree,
      appName: data.appName,
      nodeCount,
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

function resolveKeyArgs(keyExpr: string): string[] {
  const parts = keyExpr.split("+").map((p) => p.trim());
  const codes: number[] = parts
    .map((p) => KEY_MAP[p] ?? KEY_MAP[p.toLowerCase()] ?? 0)
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
// Mouse / keyboard - ydotool (Wayland, /dev/uinput)
// ---------------------------------------------------------------------------

export interface SimpleResult {
  success: boolean;
  error?: string;
  executionId: string;
}

export class DesktopInputRepository {
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
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
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
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
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
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
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
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
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
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
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
// Window management - qdbus6 (KDE Plasma DBus, Wayland native)
// ---------------------------------------------------------------------------

export interface FocusedWindowResult {
  success: boolean;
  windowId?: string;
  windowTitle?: string;
  pid?: number;
  error?: string;
  executionId: string;
}

export interface WindowInfo {
  windowId: string;
  desktopId: string;
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

export class DesktopWindowRepository {
  static async getFocusedWindow(
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<FocusedWindowResult>> {
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<FocusedWindowResult>;
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
    pid: w.pid
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

    let parsed: { uuid?: string; caption?: string; pid?: number };
    try {
      parsed = JSON.parse(jsonLine) as {
        uuid?: string;
        caption?: string;
        pid?: number;
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

    return success({ success: true, windowId, windowTitle, pid, executionId });
  }

  static async listWindows(
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ListWindowsResult>> {
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<ListWindowsResult>;
    }

    const executionId = makeExecutionId();

    const script = `
print("KWIN_LIST_START_${executionId}");
var wins = workspace.windowList();
for (var i = 0; i < wins.length; i++) {
  var w = wins[i];
  print(JSON.stringify({
    uuid: String(w.internalId),
    title: w.caption,
    pid: w.pid,
    x: Math.round(w.x),
    y: Math.round(w.y),
    width: Math.round(w.width),
    height: Math.round(w.height),
    desktop: w.desktops && w.desktops[0] ? String(w.desktops[0]) : "0",
    minimized: w.minimized,
    skipTaskbar: w.skipTaskbar
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
              desktop?: string;
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
                desktopId: w.desktop ?? "0",
              });
            }
          } catch {
            /* skip non-JSON lines */
          }
        }
      }
    }

    return success({ success: true, windows, executionId });
  }

  static async focusWindow(
    data: { windowId?: string; pid?: number; title?: string },
    t: DesktopT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SimpleResult>> {
    const platformErr = checkLinux(t);
    if (platformErr) {
      return platformErr as ResponseType<SimpleResult>;
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
}
