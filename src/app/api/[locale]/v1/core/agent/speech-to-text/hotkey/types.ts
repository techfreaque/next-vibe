/**
 * Speech-to-Text Hotkey Type Definitions
 * Complete type safety for all components
 */

/// <reference types="bun-types" />

import type { Subprocess } from "bun";

import type {
  PlatformType,
  RecorderBackendType,
  RecordingStatusType,
  TyperBackendType,
} from "./enum";

// Re-export types from enum for external use
export type { PlatformType, RecorderBackendType, TyperBackendType };

/**
 * Audio recorder interface
 * Handles platform-specific audio recording
 */
export interface Recorder {
  /**
   * Start recording audio to destination file
   * @param destPath - Absolute path to save audio file
   * @throws {RecorderError} If recording fails to start
   */
  start(destPath: string): Promise<void>;

  /**
   * Stop current recording
   * @throws {RecorderError} If no recording is active
   */
  stop(): Promise<void>;

  /**
   * Check if recorder is currently active
   */
  readonly isRecording: boolean;

  /**
   * Backend type identifier
   */
  readonly backend: RecorderBackendType;

  /**
   * Current subprocess (if any)
   */
  readonly process: Subprocess | undefined;
}

/**
 * Text insertion interface
 * Handles platform-specific text insertion at cursor
 */
export interface Typer {
  /**
   * Insert text at current cursor position
   * @param text - Text to insert
   * @throws {TyperError} If insertion fails
   */
  insertText(text: string): Promise<void>;

  /**
   * Check if required dependencies are available
   * @returns true if typer can function
   */
  checkDependencies(): Promise<boolean>;

  /**
   * Backend type identifier
   */
  readonly backend: TyperBackendType;
}

/**
 * Speech-to-text function signature
 * Used by session to transcribe audio files
 */
export interface SttFunction {
  (audioPath: string): Promise<string>;
}

/**
 * Audio post-processing function signature
 * Optional transformation of recorded audio
 */
export interface AudioPostProcessor {
  (audioPath: string): Promise<string>;
}

/**
 * Platform detector interface
 * Determines current OS and display server
 */
export interface PlatformDetector {
  /**
   * Detect current platform
   */
  detect(): PlatformType;

  /**
   * Check if running on Linux with Wayland
   */
  isWayland(): boolean;

  /**
   * Check if running on Linux with X11
   */
  isX11(): boolean;
}

/**
 * Dependency checker interface
 * Verifies required system tools are available
 */
export interface DependencyChecker {
  /**
   * Check if a command exists in PATH
   * @param command - Command name to check
   * @returns Path to command or null if not found
   */
  which(command: string): Promise<string | null>;

  /**
   * Ensure a command exists, throw if not found
   * @param command - Command name to check
   * @param friendlyName - User-friendly name for error messages
   * @throws {DependencyError} If command not found
   */
  ensure(command: string, friendlyName: string): Promise<void>;

  /**
   * Check multiple dependencies at once
   * @param dependencies - Map of command to friendly name
   * @returns Map of command to availability status
   */
  checkMultiple(
    dependencies: Record<string, string>,
  ): Promise<Record<string, boolean>>;
}

/**
 * Configuration for speech hotkey session
 */
export interface SpeechHotkeyConfig {
  /**
   * Audio recorder implementation
   */
  readonly recorder: Recorder;

  /**
   * Text typer implementation
   */
  readonly typer: Typer;

  /**
   * Speech-to-text function
   */
  readonly stt: SttFunction;

  /**
   * Temporary directory for audio files
   * @default /tmp on Unix, %TEMP% on Windows
   */
  readonly tmpDir?: string;

  /**
   * Optional audio post-processing
   */
  readonly postProcess?: AudioPostProcessor;

  /**
   * Text to insert before transcription
   * @default ""
   */
  readonly insertPrefix?: string;

  /**
   * Text to insert after transcription
   * @default " "
   */
  readonly insertSuffix?: string;

  /**
   * Maximum recording duration in milliseconds
   * @default 300000 (5 minutes)
   */
  readonly maxRecordingDuration?: number;

  /**
   * Auto-cleanup temporary files
   * @default true
   */
  readonly autoCleanup?: boolean;
}

/**
 * Speech hotkey session state
 */
export interface SessionState {
  /**
   * Current recording status
   */
  readonly status: RecordingStatusType;

  /**
   * Path to current recording file (if recording)
   */
  readonly currentRecordingPath: string | null;

  /**
   * Recording start timestamp
   */
  readonly recordingStartedAt: number | null;

  /**
   * Last transcription result
   */
  readonly lastTranscription: string | null;

  /**
   * Last error (if any)
   */
  readonly lastError: Error | null;

  /**
   * Total recordings in this session
   */
  readonly recordingCount: number;

  /**
   * Session start timestamp
   */
  readonly sessionStartedAt: number;
}

/**
 * Event emitted during hotkey session
 */
export interface SpeechHotkeyEvent {
  /**
   * Event type
   */
  readonly type:
    | "status_change"
    | "recording_started"
    | "recording_stopped"
    | "processing_started"
    | "processing_completed"
    | "text_inserted"
    | "error"
    | "cleanup";

  /**
   * Current status
   */
  readonly status: RecordingStatusType;

  /**
   * Event timestamp
   */
  readonly timestamp: number;

  /**
   * Optional transcription text
   */
  readonly text?: string;

  /**
   * Optional error information
   */
  readonly error?: {
    readonly message: string;
    readonly code?: string;
    readonly details?: Record<string, string | number | boolean>;
  };

  /**
   * Optional metadata
   */
  readonly metadata?: Record<string, string | number | boolean>;
}

/**
 * Options for recorder factory
 */
export interface RecorderFactoryOptions {
  /**
   * Platform to create recorder for
   */
  readonly platform: PlatformType;

  /**
   * Preferred backend (if supported on platform)
   */
  readonly preferredBackend?: RecorderBackendType;

  /**
   * Device identifier (platform-specific)
   */
  readonly device?: string;

  /**
   * Sample rate in Hz
   * @default 16000
   */
  readonly sampleRate?: number;

  /**
   * Number of audio channels
   * @default 1 (mono)
   */
  readonly channels?: 1 | 2;

  /**
   * Audio codec
   * @default "pcm_s16le"
   */
  readonly codec?: string;
}

/**
 * Options for typer factory
 */
export interface TyperFactoryOptions {
  /**
   * Platform to create typer for
   */
  readonly platform: PlatformType;

  /**
   * Preferred backend (if supported on platform)
   */
  readonly preferredBackend?: TyperBackendType;

  /**
   * Prefer clipboard-based insertion over direct typing
   * @default false
   */
  readonly preferClipboard?: boolean;

  /**
   * Typing delay in milliseconds (for xdotool/wtype)
   * @default 0
   */
  readonly typingDelay?: number;
}

/**
 * Recorder error class
 */
export class RecorderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, string | number | boolean | null>,
  ) {
    super(message);
    this.name = "RecorderError";
  }
}

/**
 * Typer error class
 */
export class TyperError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, string | number | boolean | null>,
  ) {
    super(message);
    this.name = "TyperError";
  }
}

/**
 * Dependency error class
 */
export class DependencyError extends Error {
  constructor(
    message: string,
    public readonly command: string,
    public readonly friendlyName: string,
  ) {
    super(message);
    this.name = "DependencyError";
  }
}

/**
 * Session error class
 */
export class SessionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly state?: Partial<SessionState>,
  ) {
    super(message);
    this.name = "SessionError";
  }
}

/**
 * Utility type for async generator
 */
export type AsyncEventGenerator = AsyncGenerator<
  SpeechHotkeyEvent,
  void,
  undefined
>;

/**
 * Command execution result
 */
export interface CommandResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * Spawn options with full type safety
 */
export interface SpawnOptions {
  readonly cwd?: string;
  readonly env?: Record<string, string>;
  readonly stdin?: "pipe" | "inherit" | "ignore";
  readonly stdout?: "pipe" | "inherit" | "ignore";
  readonly stderr?: "pipe" | "inherit" | "ignore";
}

/**
 * Audio file metadata
 */
export interface AudioMetadata {
  readonly path: string;
  readonly format: string;
  readonly duration: number;
  readonly sampleRate: number;
  readonly channels: number;
  readonly size: number;
  readonly createdAt: number;
}

/**
 * Temporary file handle
 */
export interface TempFileHandle {
  readonly path: string;
  readonly cleanup: () => Promise<void>;
}

/**
 * Platform capabilities
 */
export interface PlatformCapabilities {
  readonly platform: PlatformType;
  readonly availableRecorders: readonly RecorderBackendType[];
  readonly availableTypers: readonly TyperBackendType[];
  readonly recommendedRecorder: RecorderBackendType;
  readonly recommendedTyper: TyperBackendType;
  readonly requiresPermissions: readonly string[];
}
