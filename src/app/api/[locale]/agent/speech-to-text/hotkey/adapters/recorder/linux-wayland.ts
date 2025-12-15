/**
 * Linux Wayland Recorder Implementation
 * Uses wf-recorder with PipeWire for audio capture
 */
/// <reference types="bun-types" />


import "server-only";

import type { Subprocess } from "bun";

import { RecorderBackend } from "../../enum";
import { dependencyChecker } from "../../utils/dependencies";
import { BaseRecorder } from "./base";

/**
 * Linux Wayland recorder using wf-recorder
 */
export class LinuxWaylandRecorder extends BaseRecorder {
  constructor(
    private readonly options: {
      readonly source?: string;
      readonly codec?: string;
    } = {},
  ) {
    super(RecorderBackend.WF_RECORDER);
  }

  protected async checkDependencies(): Promise<void> {
    await dependencyChecker.ensure("wf-recorder", "wf-recorder");
  }

  protected buildCommand(destPath: string): {
    command: string;
    args: readonly string[];
  } {
    const source = this.options.source || "default";
    const codec = this.options.codec || "audio";

    const args: string[] = [
      "--audio", // Audio-only mode
      "-a", // Audio source flag
      source,
      "-c",
      codec,
      "-f",
      destPath,
    ];

    return {
      command: "wf-recorder",
      args: args as readonly string[],
    };
  }

  protected stopProcess(process: Subprocess): Promise<void> {
    // Send SIGINT to gracefully stop wf-recorder
    process.kill("SIGINT");
    return Promise.resolve();
  }

  protected override handleStderrLine(line: string): void {
    if (line.toLowerCase().includes("error") || line.toLowerCase().includes("failed")) {
      // Error will be handled by the session/repository logger
      // Storing for potential error reporting
    }
  }
}

/**
 * Linux Wayland recorder using ffmpeg + PulseAudio
 * Fallback option when wf-recorder is not available
 */
export class LinuxWaylandFfmpegRecorder extends BaseRecorder {
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
 * Factory function for Linux Wayland recorder
 */
export function createLinuxWaylandRecorder(
  preferFfmpeg = false,
  options?: {
    readonly source?: string;
    readonly device?: string;
    readonly sampleRate?: number;
    readonly channels?: 1 | 2;
    readonly codec?: string;
  },
): LinuxWaylandRecorder | LinuxWaylandFfmpegRecorder {
  if (preferFfmpeg) {
    return new LinuxWaylandFfmpegRecorder(options);
  }
  return new LinuxWaylandRecorder(options);
}
