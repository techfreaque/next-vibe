/**
 * Speech-to-Text Hotkey Enums
 * Platform and action type definitions with full type safety
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "../i18n";

/**
 * Platform enum for OS detection
 */
export const {
  enum: Platform,
  options: PlatformOptions,
  Value: PlatformValue,
} = createEnumOptions(scopedTranslation, {
  MACOS: "hotkey.platforms.macos",
  LINUX_WAYLAND: "hotkey.platforms.linuxWayland",
  LINUX_X11: "hotkey.platforms.linuxX11",
  WINDOWS: "hotkey.platforms.windows",
});

/**
 * Recording status enum
 */
export const {
  enum: RecordingStatus,
  options: RecordingStatusOptions,
  Value: RecordingStatusValue,
} = createEnumOptions(scopedTranslation, {
  IDLE: "hotkey.status.idle",
  RECORDING: "hotkey.status.recording",
  PROCESSING: "hotkey.status.processing",
  COMPLETED: "hotkey.status.completed",
  ERROR: "hotkey.status.error",
});

/**
 * Action type enum for CLI commands
 */
export const {
  enum: HotkeyAction,
  options: HotkeyActionOptions,
  Value: HotkeyActionValue,
} = createEnumOptions(scopedTranslation, {
  START: "hotkey.actions.start",
  STOP: "hotkey.actions.stop",
  TOGGLE: "hotkey.actions.toggle",
  STATUS: "hotkey.actions.status",
});

/**
 * Recorder backend type enum
 */
export const {
  enum: RecorderBackend,
  options: RecorderBackendOptions,
  Value: RecorderBackendValue,
} = createEnumOptions(scopedTranslation, {
  FFMPEG_AVFOUNDATION: "hotkey.recorderBackends.ffmpegAvfoundation",
  FFMPEG_PULSE: "hotkey.recorderBackends.ffmpegPulse",
  FFMPEG_ALSA: "hotkey.recorderBackends.ffmpegAlsa",
  FFMPEG_DSHOW: "hotkey.recorderBackends.ffmpegDshow",
  WF_RECORDER: "hotkey.recorderBackends.wfRecorder",
  ARECORD: "hotkey.recorderBackends.arecord",
});

/**
 * Typer backend type enum
 */
export const {
  enum: TyperBackend,
  options: TyperBackendOptions,
  Value: TyperBackendValue,
} = createEnumOptions(scopedTranslation, {
  APPLESCRIPT: "hotkey.typerBackends.applescript",
  WTYPE: "hotkey.typerBackends.wtype",
  XDOTOOL: "hotkey.typerBackends.xdotool",
  WL_CLIPBOARD: "hotkey.typerBackends.wlClipboard",
  XCLIP: "hotkey.typerBackends.xclip",
  POWERSHELL: "hotkey.typerBackends.powershell",
});

/**
 * Type exports for type safety
 */
export type PlatformType = (typeof Platform)[keyof typeof Platform];
export type RecordingStatusType =
  (typeof RecordingStatus)[keyof typeof RecordingStatus];
export type HotkeyActionType = (typeof HotkeyAction)[keyof typeof HotkeyAction];
export type RecorderBackendType =
  (typeof RecorderBackend)[keyof typeof RecorderBackend];
export type TyperBackendType = (typeof TyperBackend)[keyof typeof TyperBackend];
