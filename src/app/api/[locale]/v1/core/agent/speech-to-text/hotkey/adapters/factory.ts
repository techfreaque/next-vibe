/**
 * Adapter Factory
 * Creates platform-specific recorder and typer instances with full type safety
 */

import "server-only";

import { Platform } from "../enum";
import type { PlatformType } from "../types";
import type {
  Recorder,
  RecorderFactoryOptions,
  Typer,
  TyperFactoryOptions,
} from "../types";
import { platformDetector } from "../utils/platform";
import { createMacRecorder } from "./recorder/mac";
import {
  createLinuxWaylandRecorder,
} from "./recorder/linux-wayland";
import { createLinuxX11Recorder } from "./recorder/linux-x11";
import { createWindowsRecorder } from "./recorder/windows";
import { createMacTyper } from "./typer/mac";
import { createLinuxWaylandTyper } from "./typer/linux-wayland";
import { createLinuxX11Typer } from "./typer/linux-x11";
import { createWindowsTyper } from "./typer/windows";

/**
 * Create recorder for specific platform
 */
export function createRecorder(options?: RecorderFactoryOptions): Recorder {
  const platform = options?.platform || platformDetector.detect();

  switch (platform) {
    case Platform.MACOS:
      return createMacRecorder({
        device: options?.device,
        sampleRate: options?.sampleRate,
        channels: options?.channels,
        codec: options?.codec,
      });

    case Platform.LINUX_WAYLAND:
      return createLinuxWaylandRecorder(false, {
        device: options?.device,
        sampleRate: options?.sampleRate,
        channels: options?.channels,
        codec: options?.codec,
      });

    case Platform.LINUX_X11:
      return createLinuxX11Recorder(false, {
        device: options?.device,
        sampleRate: options?.sampleRate,
        channels: options?.channels,
        codec: options?.codec,
      });

    case Platform.WINDOWS:
      return createWindowsRecorder({
        device: options?.device,
        sampleRate: options?.sampleRate,
        channels: options?.channels,
        codec: options?.codec,
      });

    default:
      // This should never happen due to TypeScript exhaustiveness checking
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Adapter factory initialization error
      throw new Error(`Unsupported platform: ${String(platform)}`);
  }
}

/**
 * Create typer for specific platform
 */
export function createTyper(options?: TyperFactoryOptions): Typer {
  const platform = options?.platform || platformDetector.detect();

  switch (platform) {
    case Platform.MACOS:
      return createMacTyper();

    case Platform.LINUX_WAYLAND:
      return createLinuxWaylandTyper(
        options?.preferClipboard,
        {
          typingDelay: options?.typingDelay,
        },
      );

    case Platform.LINUX_X11:
      return createLinuxX11Typer(
        options?.preferClipboard,
        {
          typingDelay: options?.typingDelay,
        },
      );

    case Platform.WINDOWS:
      return createWindowsTyper();

    default:
      // This should never happen due to TypeScript exhaustiveness checking
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Adapter factory initialization error
      throw new Error(`Unsupported platform: ${String(platform)}`);
  }
}

/**
 * Create both recorder and typer for current platform
 */
export function createAdapters(options?: {
  readonly recorderOptions?: RecorderFactoryOptions;
  readonly typerOptions?: TyperFactoryOptions;
}): {
  readonly recorder: Recorder;
  readonly typer: Typer;
  readonly platform: PlatformType;
} {
  const platform = platformDetector.detect();

  return {
    recorder: createRecorder({
      ...options?.recorderOptions,
      platform,
    }),
    typer: createTyper({
      ...options?.typerOptions,
      platform,
    }),
    platform,
  };
}

/**
 * Auto-detect best adapters for current platform
 * Checks dependencies and selects optimal implementations
 */
export async function createBestAdapters(): Promise<{
  readonly recorder: Recorder;
  readonly typer: Typer;
  readonly platform: PlatformType;
}> {
  const platform = platformDetector.detect();

  // For now, use defaults - could be enhanced to check which tools are available
  const { recorder, typer } = createAdapters();

  // Verify dependencies
  const typerDepsOk = await typer.checkDependencies();

  if (!typerDepsOk) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Adapter factory initialization error
    throw new Error(
      `Typer dependencies not available for ${String(platform)}. Please install required tools.`,
    );
  }

  return {
    recorder,
    typer,
    platform,
  };
}
