/**
 * Speech Hotkey Session Management
 * Manages recording lifecycle and text insertion with full type safety
 */

import "server-only";

import { RecordingStatus } from "./enum";
import type {
  AsyncEventGenerator,
  SessionState,
  SpeechHotkeyConfig,
  SpeechHotkeyEvent,
  TempFileHandle,
} from "./types";
import { SessionError } from "./types";
import {
  deleteFile,
  fileExists,
  generateTempFilePath,
  validateAudioFile,
} from "./utils/dependencies";

/**
 * Speech Hotkey Session
 * Main class for managing recording and transcription lifecycle
 */
export class SpeechHotkeySession {
  private readonly config: Required<SpeechHotkeyConfig>;
  private state: SessionState;
  private tempFiles: Set<string> = new Set();

  constructor(config: SpeechHotkeyConfig) {
    // Set defaults for optional config
    this.config = {
      recorder: config.recorder,
      typer: config.typer,
      stt: config.stt,
      tmpDir: config.tmpDir || this.getDefaultTmpDir(),
      postProcess: config.postProcess,
      insertPrefix: config.insertPrefix || "",
      insertSuffix: config.insertSuffix || " ",
      maxRecordingDuration: config.maxRecordingDuration || 300000, // 5 minutes
      autoCleanup: config.autoCleanup !== false,
    } as Required<SpeechHotkeyConfig>;

    // Initialize state
    this.state = {
      status: RecordingStatus.IDLE,
      currentRecordingPath: null,
      recordingStartedAt: null,
      lastTranscription: null,
      lastError: null,
      recordingCount: 0,
      sessionStartedAt: Date.now(),
    };
  }

  /**
   * Get default temp directory based on platform
   */
  private getDefaultTmpDir(): string {
    if (process.platform === "win32") {
      return process.env.TEMP || process.env.TMP || "C:\\Windows\\Temp";
    }
    return process.env.TMPDIR || "/tmp";
  }

  /**
   * Get current session state (readonly)
   */
  get currentState(): Readonly<SessionState> {
    return { ...this.state };
  }

  /**
   * Check if currently recording
   */
  get isRecording(): boolean {
    return this.state.status === RecordingStatus.RECORDING;
  }

  /**
   * Start recording audio
   */
  async start(): Promise<void> {
    if (this.isRecording) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Session state error
      throw new SessionError(
        "Recording already in progress",
        "ALREADY_RECORDING",
        this.state,
      );
    }

    // Generate temp file path
    const audioPath = generateTempFilePath("stt_recording", "wav", this.config.tmpDir);

    try {
      // Start recording
      await this.config.recorder.start(audioPath);

      // Update state
      this.state = {
        ...this.state,
        status: RecordingStatus.RECORDING,
        currentRecordingPath: audioPath,
        recordingStartedAt: Date.now(),
        lastError: null,
      };

      // Track temp file
      this.tempFiles.add(audioPath);

      // Set timeout for max recording duration
      if (this.config.maxRecordingDuration > 0) {
        setTimeout(() => {
          if (this.isRecording) {
            void this.stop().catch(() => {
              // Auto-stop on timeout, ignore errors
            });
          }
        }, this.config.maxRecordingDuration);
      }
    } catch (error) {
      this.state = {
        ...this.state,
        status: RecordingStatus.ERROR,
        lastError: error instanceof Error ? error : new Error(String(error)),
      };
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Session error
      throw new SessionError(
        `Failed to start recording: ${String(error)}`,
        "START_FAILED",
        this.state,
      );
    }
  }

  /**
   * Stop recording and return audio file path
   */
  async stop(): Promise<string> {
    if (!this.isRecording) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Session state error
      throw new SessionError(
        "No recording in progress",
        "NOT_RECORDING",
        this.state,
      );
    }

    const audioPath = this.state.currentRecordingPath;
    if (!audioPath) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Session state error
      throw new SessionError(
        "Recording path not found",
        "INVALID_STATE",
        this.state,
      );
    }

    try {
      // Stop recorder
      await this.config.recorder.stop();

      // Update state
      this.state = {
        ...this.state,
        status: RecordingStatus.IDLE,
        currentRecordingPath: null,
        recordingStartedAt: null,
        recordingCount: this.state.recordingCount + 1,
      };

      // Validate audio file
      const isValid = await validateAudioFile(audioPath);
      if (!isValid) {
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Session validation error
        throw new Error("Invalid or empty audio file");
      }

      return audioPath;
    } catch (error) {
      this.state = {
        ...this.state,
        status: RecordingStatus.ERROR,
        lastError: error instanceof Error ? error : new Error(String(error)),
      };
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Session error
      throw new SessionError(
        `Failed to stop recording: ${String(error)}`,
        "STOP_FAILED",
        this.state,
      );
    }
  }

  /**
   * Stop recording, transcribe, and insert text at cursor
   */
  async stopAndInsert(): Promise<string> {
    // Stop recording and get audio file
    const audioPath = await this.stop();

    try {
      // Update state to processing
      this.state = {
        ...this.state,
        status: RecordingStatus.PROCESSING,
      };

      // Post-process audio if configured
      const processedPath = this.config.postProcess
        ? await this.config.postProcess(audioPath)
        : audioPath;

      // Track processed file if different
      if (processedPath !== audioPath) {
        this.tempFiles.add(processedPath);
      }

      // Transcribe audio
      const transcription = await this.config.stt(processedPath);

      // Build final text with prefix/suffix
      const finalText = `${this.config.insertPrefix}${transcription}${this.config.insertSuffix}`;

      // Insert text at cursor
      await this.config.typer.insertText(finalText);

      // Update state
      this.state = {
        ...this.state,
        status: RecordingStatus.COMPLETED,
        lastTranscription: finalText,
        lastError: null,
      };

      // Cleanup if auto-cleanup enabled
      if (this.config.autoCleanup) {
        await this.cleanupTempFile(audioPath);
        if (processedPath !== audioPath) {
          await this.cleanupTempFile(processedPath);
        }
      }

      return finalText;
    } catch (error) {
      // Enhanced error details for debugging
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorName = error instanceof Error ? error.name : "UnknownError";

      this.state = {
        ...this.state,
        status: RecordingStatus.ERROR,
        lastError: error instanceof Error ? error : new Error(String(error)),
      };

      // Cleanup on error if auto-cleanup enabled
      if (this.config.autoCleanup) {
        await this.cleanupTempFile(audioPath);
      }

      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Session error
      throw new SessionError(
        `Failed to transcribe and insert: ${errorName}: ${errorMessage}${errorStack ? `\n${errorStack}` : ""}`,
        "INSERT_FAILED",
        this.state,
      );
    }
  }

  /**
   * Toggle recording on/off
   */
  async toggle(): Promise<boolean> {
    if (this.isRecording) {
      await this.stopAndInsert();
      return false;
    }
      await this.start();
      return true;
    
  }

  /**
   * Create event stream for session lifecycle
   */
  async *createEventStream(): AsyncEventGenerator {
    let lastStatus = this.state.status;

    while (true) {
      const currentStatus = this.state.status;

      // Emit status change event
      if (currentStatus !== lastStatus) {
        const event: SpeechHotkeyEvent = {
          type: "status_change",
          status: currentStatus,
          timestamp: Date.now(),
          metadata: {
            previousStatus: lastStatus,
            recordingCount: this.state.recordingCount,
          },
        };
        yield event;
        lastStatus = currentStatus;
      }

      // Emit specific events based on status
      if (currentStatus === RecordingStatus.RECORDING && this.state.recordingStartedAt) {
        yield {
          type: "recording_started",
          status: currentStatus,
          timestamp: this.state.recordingStartedAt,
          metadata: {
            path: this.state.currentRecordingPath || "",
          },
        };
      }

      if (currentStatus === RecordingStatus.COMPLETED && this.state.lastTranscription) {
        yield {
          type: "text_inserted",
          status: currentStatus,
          timestamp: Date.now(),
          text: this.state.lastTranscription,
        };
      }

      if (currentStatus === RecordingStatus.ERROR && this.state.lastError) {
        yield {
          type: "error",
          status: currentStatus,
          timestamp: Date.now(),
          error: {
            message: this.state.lastError.message,
            code: "SESSION_ERROR",
            details: {
              name: this.state.lastError.name,
              message: this.state.lastError.message,
            },
          },
        };
      }

      // Wait before checking again
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 100);
      });
    }
  }

  /**
   * Cleanup a specific temp file
   */
  private async cleanupTempFile(path: string): Promise<void> {
    try {
      if (await fileExists(path)) {
        await deleteFile(path);
        this.tempFiles.delete(path);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  /**
   * Cleanup all temp files
   */
  async cleanup(): Promise<void> {
    const cleanupPromises = [...this.tempFiles].map((path) =>
      this.cleanupTempFile(path),
    );
    await Promise.all(cleanupPromises);
    this.tempFiles.clear();
  }

  /**
   * Get temp file handle for manual cleanup control
   */
  getTempFileHandle(path: string): TempFileHandle {
    return {
      path,
      cleanup: async () => {
        await this.cleanupTempFile(path);
      },
    };
  }

  /**
   * Reset session state
   */
  reset(): void {
    this.state = {
      status: RecordingStatus.IDLE,
      currentRecordingPath: null,
      recordingStartedAt: null,
      lastTranscription: null,
      lastError: null,
      recordingCount: 0,
      sessionStartedAt: Date.now(),
    };
  }
}

/**
 * Create a new speech hotkey session
 */
export function createSession(config: SpeechHotkeyConfig): SpeechHotkeySession {
  return new SpeechHotkeySession(config);
}
