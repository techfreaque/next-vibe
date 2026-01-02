/**
 * Windows Recorder Implementation
 * Uses ffmpeg with DirectShow for audio capture
 */
/// <reference types="bun-types" />

import "server-only";

import type { Subprocess } from "bun";

import { RecorderBackend } from "../../enum";
import { dependencyChecker } from "../../utils/dependencies";
import { BaseRecorder } from "./base";

/**
 * Windows recorder using ffmpeg + DirectShow
 */
export class WindowsRecorder extends BaseRecorder {
  constructor(
    private readonly options: {
      readonly device?: string;
      readonly sampleRate?: number;
      readonly channels?: 1 | 2;
      readonly codec?: string;
    } = {},
  ) {
    super(RecorderBackend.FFMPEG_DSHOW);
  }

  protected async checkDependencies(): Promise<void> {
    await dependencyChecker.ensure("ffmpeg", "ffmpeg");
  }

  protected buildCommand(destPath: string): {
    command: string;
    args: readonly string[];
  } {
    const device = this.options.device || "audio=Microphone (Default)";
    const sampleRate = this.options.sampleRate || 16000;
    const channels = this.options.channels || 1;
    const codec = this.options.codec || "pcm_s16le";

    const args: string[] = [
      "-f",
      "dshow",
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

  protected async stopProcess(process: Subprocess): Promise<void> {
    // On Windows, send 'q' to stdin to gracefully quit ffmpeg
    try {
      if (
        process.stdin &&
        typeof process.stdin !== "number" &&
        "getWriter" in process.stdin &&
        typeof (
          process.stdin as {
            getWriter?: () => WritableStreamDefaultWriter<Uint8Array>;
          }
        ).getWriter === "function"
      ) {
        const stdinStream = process.stdin as {
          getWriter: () => WritableStreamDefaultWriter<Uint8Array>;
        };
        const writer = stdinStream.getWriter();
        await writer.write(new TextEncoder().encode("q"));
        writer.releaseLock();
      }
    } catch {
      // If stdin write fails, kill the process
      process.kill();
    }
  }

  protected override handleStderrLine(line: string): void {
    if (line.toLowerCase().includes("error") || line.toLowerCase().includes("fatal")) {
      // Error will be handled by the session/repository logger
      // Storing for potential error reporting
    }
  }
}

/**
 * Factory function for Windows recorder
 */
export function createWindowsRecorder(options?: {
  readonly device?: string;
  readonly sampleRate?: number;
  readonly channels?: 1 | 2;
  readonly codec?: string;
}): WindowsRecorder {
  return new WindowsRecorder(options);
}
