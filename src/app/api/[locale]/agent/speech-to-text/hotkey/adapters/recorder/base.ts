/**
 * Base Recorder Implementation
 * Abstract base class for all platform-specific recorders
 */

/// <reference types="bun-types" />

import "server-only";

import type { Subprocess } from "bun";

import type { RecorderBackendType } from "../../enum";
import type { Recorder } from "../../types";
import { RecorderError } from "../../types";

/**
 * Abstract base recorder class
 * Provides common functionality for all recorder implementations
 */
export abstract class BaseRecorder implements Recorder {
  protected _process: Subprocess | undefined;
  protected _isRecording = false;
  protected _currentPath: string | null = null;

  constructor(protected readonly _backend: RecorderBackendType) {}

  /**
   * Backend type identifier
   */
  get backend(): RecorderBackendType {
    return this._backend;
  }

  /**
   * Check if recorder is currently active
   */
  get isRecording(): boolean {
    return this._isRecording;
  }

  /**
   * Current subprocess (if any)
   */
  get process(): Subprocess | undefined {
    return this._process;
  }

  /**
   * Start recording audio to destination file
   * Template method - calls abstract buildCommand
   */
  async start(destPath: string): Promise<void> {
    if (this._isRecording) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Recorder initialization error
      throw new RecorderError(
        "Recording already in progress",
        "RECORDING_IN_PROGRESS",
        {
          currentPath: this._currentPath,
        },
      );
    }

    await this.checkDependencies();

    const { command, args } = this.buildCommand(destPath);

    try {
      this._process = Bun.spawn([command, ...args], {
        stdin: "pipe",
        stdout: "ignore",
        stderr: "pipe",
      });

      this._isRecording = true;
      this._currentPath = destPath;

      // Monitor process for errors
      this.monitorProcess();
    } catch (error) {
      this._isRecording = false;
      this._currentPath = null;
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Recorder initialization error
      throw new RecorderError(
        `Failed to start recording: ${String(error)}`,
        "START_FAILED",
        {
          command,
          args: args.join(" "),
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  /**
   * Stop current recording
   */
  async stop(): Promise<void> {
    if (!this._isRecording || !this._process) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Recorder state error
      throw new RecorderError("No recording in progress", "NO_RECORDING", {});
    }

    try {
      await this.stopProcess(this._process);
      await this._process.exited;

      this._isRecording = false;
      this._currentPath = null;
      this._process = undefined;
    } catch (error) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Recorder stop error
      throw new RecorderError(
        `Failed to stop recording: ${String(error)}`,
        "STOP_FAILED",
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  /**
   * Monitor process for errors
   */
  private monitorProcess(): void {
    if (!this._process) {
      return;
    }

    const process = this._process;

    // Monitor stderr for errors
    if (process.stderr && typeof process.stderr !== "number") {
      const reader = process.stderr.getReader();
      void this.readStderr(reader).catch(() => {
        // Ignore errors in monitoring
      });
    }
  }

  /**
   * Read stderr stream
   */
  private async readStderr(
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ): Promise<void> {
    try {
      const decoder = new TextDecoder();
      let buffer = "";

      while (this._isRecording) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            this.handleStderrLine(line);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Handle stderr line - can be overridden by subclasses
   * @param _line - Stderr line to handle
   */
  // eslint-disable-next-line no-unused-vars -- Parameter provided for subclass override
  protected handleStderrLine(_line: string): void {
    // Subclasses can override to handle specific error patterns
  }

  /**
   * Abstract methods to be implemented by subclasses
   */
  protected abstract buildCommand(destPath: string): {
    command: string;
    args: readonly string[];
  };

  protected abstract checkDependencies(): Promise<void>;

  protected abstract stopProcess(process: Subprocess): Promise<void>;
}
