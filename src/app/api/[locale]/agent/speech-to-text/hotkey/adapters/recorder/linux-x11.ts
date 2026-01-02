/**
 * Linux X11 Recorder Implementation
 * Uses ffmpeg with PulseAudio/ALSA for audio capture
 */
/// <reference types="bun-types" />

import "server-only";

import type { Subprocess } from "bun";

import { RecorderBackend } from "../../enum";
import { dependencyChecker } from "../../utils/dependencies";
import { BaseRecorder } from "./base";

/**
 * Linux X11 recorder using ffmpeg + PulseAudio
 */
export class LinuxX11FfmpegPulseRecorder extends BaseRecorder {
  constructor(
    private readonly options: {
      readonly device?: string;
      readonly sampleRate?: number;
      readonly channels?: 1 | 2;
      readonly codec?: string;
    } = {},
  ) {
    super(RecorderBackend.FFMPEG_PULSE);
  }

  protected async checkDependencies(): Promise<void> {
    await dependencyChecker.ensure("ffmpeg", "ffmpeg");
  }

  protected buildCommand(destPath: string): {
    command: string;
    args: readonly string[];
  } {
    const device = this.options.device || "default";
    const sampleRate = this.options.sampleRate || 16000;
    const channels = this.options.channels || 1;
    const codec = this.options.codec || "pcm_s16le";

    const args: string[] = [
      "-f",
      "pulse",
      "-i",
      device,
      "-ac",
      String(channels),
      "-ar",
      String(sampleRate),
      "-c:a",
      codec,
      "-y",
      destPath,
    ];

    return {
      command: "ffmpeg",
      args: args as readonly string[],
    };
  }

  protected stopProcess(process: Subprocess): Promise<void> {
    process.kill("SIGINT");
    return Promise.resolve();
  }

  protected override handleStderrLine(line: string): void {
    if (line.toLowerCase().includes("error") || line.toLowerCase().includes("fatal")) {
      // Error will be handled by the session/repository logger
      // Storing for potential error reporting
    }
  }
}

/**
 * Linux X11 recorder using ffmpeg + ALSA
 * Alternative when PulseAudio is not available
 */
export class LinuxX11FfmpegAlsaRecorder extends BaseRecorder {
  constructor(
    private readonly options: {
      readonly device?: string;
      readonly sampleRate?: number;
      readonly channels?: 1 | 2;
      readonly codec?: string;
    } = {},
  ) {
    super(RecorderBackend.FFMPEG_ALSA);
  }

  protected async checkDependencies(): Promise<void> {
    await dependencyChecker.ensure("ffmpeg", "ffmpeg");
  }

  protected buildCommand(destPath: string): {
    command: string;
    args: readonly string[];
  } {
    const device = this.options.device || "default";
    const sampleRate = this.options.sampleRate || 16000;
    const channels = this.options.channels || 1;
    const codec = this.options.codec || "pcm_s16le";

    const args: string[] = [
      "-f",
      "alsa",
      "-i",
      device,
      "-ac",
      String(channels),
      "-ar",
      String(sampleRate),
      "-c:a",
      codec,
      "-y",
      destPath,
    ];

    return {
      command: "ffmpeg",
      args: args as readonly string[],
    };
  }

  protected stopProcess(process: Subprocess): Promise<void> {
    process.kill("SIGINT");
    return Promise.resolve();
  }

  protected override handleStderrLine(line: string): void {
    if (line.toLowerCase().includes("error") || line.toLowerCase().includes("fatal")) {
      // Error will be handled by the session/repository logger
      // Storing for potential error reporting
    }
  }
}

/**
 * Factory function for Linux X11 recorder
 */
export function createLinuxX11Recorder(
  preferAlsa = false,
  options?: {
    readonly device?: string;
    readonly sampleRate?: number;
    readonly channels?: 1 | 2;
    readonly codec?: string;
  },
): LinuxX11FfmpegPulseRecorder | LinuxX11FfmpegAlsaRecorder {
  if (preferAlsa) {
    return new LinuxX11FfmpegAlsaRecorder(options);
  }
  return new LinuxX11FfmpegPulseRecorder(options);
}
