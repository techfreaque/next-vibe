/**
 * Platform Detection Implementation
 * Detects OS and display server with full type safety
 */

import "server-only";

import type {
  PlatformCapabilities,
  PlatformDetector as IPlatformDetector,
  PlatformType,
  RecorderBackendType,
  TyperBackendType,
} from "../types";
import { Platform, RecorderBackend, TyperBackend } from "../enum";
import { dependencyChecker } from "./dependencies";

/**
 * Platform detector implementation
 */
class PlatformDetectorImpl implements IPlatformDetector {
  private cachedPlatform: PlatformType | null = null;

  /**
   * Detect current platform
   */
  detect(): PlatformType {
    if (this.cachedPlatform) {
      return this.cachedPlatform;
    }

    const platform = this.detectPlatform();
    this.cachedPlatform = platform;
    return platform;
  }

  /**
   * Internal platform detection logic
   */
  private detectPlatform(): PlatformType {
    if (process.platform === "darwin") {
      return Platform.MACOS;
    }

    if (process.platform === "win32") {
      return Platform.WINDOWS;
    }

    if (process.platform === "linux") {
      if (this.isWayland()) {
        return Platform.LINUX_WAYLAND;
      }
      if (this.isX11()) {
        return Platform.LINUX_X11;
      }
      // Default to X11 if detection fails
      return Platform.LINUX_X11;
    }

    // Fallback for unknown platforms
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Platform detection error
    throw new Error(`Unsupported platform: ${process.platform}`);
  }

  /**
   * Check if running on Linux with Wayland
   */
  isWayland(): boolean {
    return (
      process.platform === "linux" &&
      (!!process.env.WAYLAND_DISPLAY ||
        process.env.XDG_SESSION_TYPE === "wayland")
    );
  }

  /**
   * Check if running on Linux with X11
   */
  isX11(): boolean {
    return (
      process.platform === "linux" &&
      (!!process.env.DISPLAY || process.env.XDG_SESSION_TYPE === "x11")
    );
  }

  /**
   * Get platform-specific information
   */
  getPlatformInfo(): {
    platform: PlatformType;
    displayServer: "wayland" | "x11" | "aqua" | "windows" | "unknown";
    nodeProcess: string;
  } {
    const platform = this.detect();
    let displayServer: "wayland" | "x11" | "aqua" | "windows" | "unknown" =
      "unknown";

    if (platform === Platform.MACOS) {
      displayServer = "aqua";
    } else if (platform === Platform.WINDOWS) {
      displayServer = "windows";
    } else if (platform === Platform.LINUX_WAYLAND) {
      displayServer = "wayland";
    } else if (platform === Platform.LINUX_X11) {
      displayServer = "x11";
    }

    return {
      platform,
      displayServer,
      nodeProcess: process.platform,
    };
  }
}

/**
 * Singleton instance
 */
export const platformDetector: IPlatformDetector = new PlatformDetectorImpl();

/**
 * Get platform capabilities and recommendations
 */
export async function getPlatformCapabilities(): Promise<PlatformCapabilities> {
  const platform = platformDetector.detect();

  switch (platform) {
    case Platform.MACOS:
      return {
        platform,
        availableRecorders: [RecorderBackend.FFMPEG_AVFOUNDATION] as const,
        availableTypers: [TyperBackend.APPLESCRIPT] as const,
        recommendedRecorder: RecorderBackend.FFMPEG_AVFOUNDATION,
        recommendedTyper: TyperBackend.APPLESCRIPT,
        requiresPermissions: [
          "Microphone",
          "Accessibility (for keyboard simulation)",
        ] as const,
      };

    case Platform.LINUX_WAYLAND: {
      const availableRecorders: RecorderBackendType[] = [];
      const availableTypers: TyperBackendType[] = [];

      // Check recorders
      if (await dependencyChecker.which("wf-recorder")) {
        availableRecorders.push(RecorderBackend.WF_RECORDER);
      }
      if (await dependencyChecker.which("ffmpeg")) {
        availableRecorders.push(RecorderBackend.FFMPEG_PULSE);
      }

      // Check typers
      if (await dependencyChecker.which("wtype")) {
        availableTypers.push(TyperBackend.WTYPE);
      }
      if (await dependencyChecker.which("wl-copy")) {
        availableTypers.push(TyperBackend.WL_CLIPBOARD);
      }

      return {
        platform,
        availableRecorders: availableRecorders as readonly RecorderBackendType[],
        availableTypers: availableTypers as readonly TyperBackendType[],
        recommendedRecorder:
          availableRecorders[0] || RecorderBackend.WF_RECORDER,
        recommendedTyper: availableTypers[0] || TyperBackend.WTYPE,
        requiresPermissions: ["PipeWire audio access"] as const,
      };
    }

    case Platform.LINUX_X11: {
      const availableRecorders: RecorderBackendType[] = [];
      const availableTypers: TyperBackendType[] = [];

      // Check recorders
      if (await dependencyChecker.which("ffmpeg")) {
        availableRecorders.push(
          RecorderBackend.FFMPEG_PULSE,
          RecorderBackend.FFMPEG_ALSA,
        );
      }
      if (await dependencyChecker.which("arecord")) {
        availableRecorders.push(RecorderBackend.ARECORD);
      }

      // Check typers
      if (await dependencyChecker.which("xdotool")) {
        availableTypers.push(TyperBackend.XDOTOOL);
      }
      if (await dependencyChecker.which("xclip")) {
        availableTypers.push(TyperBackend.XCLIP);
      }

      return {
        platform,
        availableRecorders: availableRecorders as readonly RecorderBackendType[],
        availableTypers: availableTypers as readonly TyperBackendType[],
        recommendedRecorder:
          availableRecorders[0] || RecorderBackend.FFMPEG_PULSE,
        recommendedTyper: availableTypers[0] || TyperBackend.XDOTOOL,
        requiresPermissions: ["PulseAudio/ALSA access"] as const,
      };
    }

    case Platform.WINDOWS:
      return {
        platform,
        availableRecorders: [RecorderBackend.FFMPEG_DSHOW] as const,
        availableTypers: [TyperBackend.POWERSHELL] as const,
        recommendedRecorder: RecorderBackend.FFMPEG_DSHOW,
        recommendedTyper: TyperBackend.POWERSHELL,
        requiresPermissions: ["Microphone"] as const,
      };

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = platform;
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Platform detection error
      throw new Error(`Unknown platform: ${String(_exhaustive)}`);
    }
  }
}

/**
 * Check if all required dependencies are available for the platform
 */
export async function checkPlatformDependencies(
  platform: PlatformType,
): Promise<{
  readonly available: boolean;
  readonly missing: readonly string[];
  readonly recommendations: readonly string[];
}> {
  const missing: string[] = [];
  const recommendations: string[] = [];

  switch (platform) {
    case Platform.MACOS: {
      if (!(await dependencyChecker.which("ffmpeg"))) {
        missing.push("ffmpeg");
        recommendations.push("Install with: brew install ffmpeg");
      }
      break;
    }

    case Platform.LINUX_WAYLAND: {
      const hasWfRecorder = await dependencyChecker.which("wf-recorder");
      const hasFfmpeg = await dependencyChecker.which("ffmpeg");
      const hasWtype = await dependencyChecker.which("wtype");
      const hasWlClipboard = await dependencyChecker.which("wl-copy");

      if (!hasWfRecorder && !hasFfmpeg) {
        missing.push("wf-recorder or ffmpeg");
        recommendations.push(
          "Install with: sudo apt install wf-recorder (or ffmpeg)",
        );
      }

      if (!hasWtype && !hasWlClipboard) {
        missing.push("wtype or wl-clipboard");
        recommendations.push(
          "Install with: sudo apt install wtype (or wl-clipboard)",
        );
      }
      break;
    }

    case Platform.LINUX_X11: {
      const hasFfmpeg = await dependencyChecker.which("ffmpeg");
      const hasArecord = await dependencyChecker.which("arecord");
      const hasXdotool = await dependencyChecker.which("xdotool");
      const hasXclip = await dependencyChecker.which("xclip");

      if (!hasFfmpeg && !hasArecord) {
        missing.push("ffmpeg or arecord");
        recommendations.push(
          "Install with: sudo apt install ffmpeg (or alsa-utils)",
        );
      }

      if (!hasXdotool && !hasXclip) {
        missing.push("xdotool or xclip");
        recommendations.push(
          "Install with: sudo apt install xdotool (or xclip)",
        );
      }
      break;
    }

    case Platform.WINDOWS: {
      if (!(await dependencyChecker.which("ffmpeg"))) {
        missing.push("ffmpeg");
        recommendations.push(
          "Install ffmpeg and add to PATH. Download from: https://ffmpeg.org/download.html",
        );
      }
      break;
    }

    default: {
      const _exhaustive: never = platform;
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Platform detection error
      throw new Error(`Unknown platform: ${String(_exhaustive)}`);
    }
  }

  return {
    available: missing.length === 0,
    missing: missing as readonly string[],
    recommendations: recommendations as readonly string[],
  };
}

/**
 * Get user-friendly platform name
 */
export function getPlatformName(platform: PlatformType): string {
  switch (platform) {
    case Platform.MACOS:
      return "macOS";
    case Platform.LINUX_WAYLAND:
      return "Linux (Wayland)";
    case Platform.LINUX_X11:
      return "Linux (X11)";
    case Platform.WINDOWS:
      return "Windows";
    default: {
      const _exhaustive: never = platform;
      return _exhaustive;
    }
  }
}
