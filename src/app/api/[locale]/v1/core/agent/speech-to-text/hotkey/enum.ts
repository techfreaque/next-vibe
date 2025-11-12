/**
 * Speech-to-Text Hotkey Enums
 * Platform and action type definitions with full type safety
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

/**
 * Platform enum for OS detection
 */
export const {
  enum: Platform,
  options: PlatformOptions,
  Value: PlatformValue,
} = createEnumOptions({
  MACOS: "app.api.v1.core.agent.speechToText.hotkey.platforms.macos",
  LINUX_WAYLAND:
    "app.api.v1.core.agent.speechToText.hotkey.platforms.linuxWayland",
  LINUX_X11: "app.api.v1.core.agent.speechToText.hotkey.platforms.linuxX11",
  WINDOWS: "app.api.v1.core.agent.speechToText.hotkey.platforms.windows",
} as const);

/**
 * Recording status enum
 */
export const {
  enum: RecordingStatus,
  options: RecordingStatusOptions,
  Value: RecordingStatusValue,
} = createEnumOptions({
  IDLE: "app.api.v1.core.agent.speechToText.hotkey.status.idle",
  RECORDING: "app.api.v1.core.agent.speechToText.hotkey.status.recording",
  PROCESSING: "app.api.v1.core.agent.speechToText.hotkey.status.processing",
  COMPLETED: "app.api.v1.core.agent.speechToText.hotkey.status.completed",
  ERROR: "app.api.v1.core.agent.speechToText.hotkey.status.error",
} as const);

/**
 * Action type enum for CLI commands
 */
export const {
  enum: HotkeyAction,
  options: HotkeyActionOptions,
  Value: HotkeyActionValue,
} = createEnumOptions({
  START: "app.api.v1.core.agent.speechToText.hotkey.actions.start",
  STOP: "app.api.v1.core.agent.speechToText.hotkey.actions.stop",
  TOGGLE: "app.api.v1.core.agent.speechToText.hotkey.actions.toggle",
  STATUS: "app.api.v1.core.agent.speechToText.hotkey.actions.status",
} as const);

/**
 * Recorder backend type enum
 */
export const {
  enum: RecorderBackend,
  options: RecorderBackendOptions,
  Value: RecorderBackendValue,
} = createEnumOptions({
  FFMPEG_AVFOUNDATION:
    "app.api.v1.core.agent.speechToText.hotkey.recorderBackends.ffmpegAvfoundation",
  FFMPEG_PULSE:
    "app.api.v1.core.agent.speechToText.hotkey.recorderBackends.ffmpegPulse",
  FFMPEG_ALSA:
    "app.api.v1.core.agent.speechToText.hotkey.recorderBackends.ffmpegAlsa",
  FFMPEG_DSHOW:
    "app.api.v1.core.agent.speechToText.hotkey.recorderBackends.ffmpegDshow",
  WF_RECORDER:
    "app.api.v1.core.agent.speechToText.hotkey.recorderBackends.wfRecorder",
  ARECORD: "app.api.v1.core.agent.speechToText.hotkey.recorderBackends.arecord",
} as const);

/**
 * Typer backend type enum
 */
export const {
  enum: TyperBackend,
  options: TyperBackendOptions,
  Value: TyperBackendValue,
} = createEnumOptions({
  APPLESCRIPT:
    "app.api.v1.core.agent.speechToText.hotkey.typerBackends.applescript",
  WTYPE: "app.api.v1.core.agent.speechToText.hotkey.typerBackends.wtype",
  XDOTOOL: "app.api.v1.core.agent.speechToText.hotkey.typerBackends.xdotool",
  WL_CLIPBOARD:
    "app.api.v1.core.agent.speechToText.hotkey.typerBackends.wlClipboard",
  XCLIP: "app.api.v1.core.agent.speechToText.hotkey.typerBackends.xclip",
  POWERSHELL:
    "app.api.v1.core.agent.speechToText.hotkey.typerBackends.powershell",
} as const);

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
