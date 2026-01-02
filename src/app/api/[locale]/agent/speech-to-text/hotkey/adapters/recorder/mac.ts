/**
 * macOS Recorder Implementation
 * Uses ffmpeg with AVFoundation for audio capture
 */
/// <reference types="bun-types" />

import "server-only";

import type { Subprocess } from "bun";

import { RecorderBackend } from "../../enum";
import { dependencyChecker } from "../../utils/dependencies";
import { BaseRecorder } from "./base";

/**
 * macOS recorder using ffmpeg + AVFoundation
 */
export class MacRecorder extends BaseRecorder {
  constructor(
    private readonly options: {
      readonly device?: string;
      readonly sampleRate?: number;
      readonly channels?: 1 | 2;
      readonly codec?: string;
    } = {},
  ) {
    super(RecorderBackend.FFMPEG_AVFOUNDATION);
  }

  protected async checkDependencies(): Promise<void> {
    await dependencyChecker.ensure("ffmpeg", "ffmpeg");
  }

  protected buildCommand(destPath: string): {
    command: string;
    args: readonly string[];
  } {
    const device = this.options.device || ":0"; // Default audio input
    const sampleRate = this.options.sampleRate || 16000;
    const channels = this.options.channels || 1;
    const codec = this.options.codec || "pcm_s16le";

    const args: string[] = [
      "-f",
      "avfoundation",
      "-i",
      device,
      "-ac",
      String(channels),
      "-ar",
      String(sampleRate),
      "-c:a",
      codec,
      "-y", // Overwrite output file
      destPath,
    ];

    return {
      command: "ffmpeg",
      args: args as readonly string[],
    };
  }

  protected stopProcess(process: Subprocess): Promise<void> {
    // Send SIGINT (Ctrl+C) to gracefully stop ffmpeg
    process.kill("SIGINT");
    return Promise.resolve();
  }

  protected override handleStderrLine(line: string): void {
    // FFmpeg outputs progress to stderr, which is normal
    // Only log if it contains "error" or "fatal"
    if (line.toLowerCase().includes("error") || line.toLowerCase().includes("fatal")) {
      // Error will be handled by the session/repository logger
      // Storing for potential error reporting
    }
  }
}

/**
 * Factory function for macOS recorder
 */
export function createMacRecorder(options?: {
  readonly device?: string;
  readonly sampleRate?: number;
  readonly channels?: 1 | 2;
  readonly codec?: string;
}): MacRecorder {
  return new MacRecorder(options);
}
