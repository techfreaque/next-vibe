/**
 * Vibe Frame — Package / Library Entry Point
 *
 * ESM library export. Does NOT auto-initialize or expose on window.
 * Import this when using vibe-frame as an npm package in a bundled app.
 *
 * Usage:
 *   import { VibeFrame, subscribeConfig } from "next-vibe/vibe-frame";
 *   VibeFrame.mount({ serverUrl, endpoint, target });
 *
 * For <script> tag usage with declarative config, use the IIFE bundle instead:
 *   <script src="/vibe-frame/vibe-frame.js"></script>
 */

export type { FrameBridge, ParentBridge } from "./bridge";
export { createFrameBridge, createParentBridge } from "./bridge";
export { getConfig, subscribeConfig, VibeFrame } from "./embed";
export { setupTrigger } from "./triggers";
export type {
  BridgeAction,
  BridgeActionMap,
  BridgeCall,
  BridgeResponse,
  CookieData,
  CookieOptions,
  FrameDisplayFrequency,
  FrameDisplayMode,
  FrameError,
  FrameHydrationData,
  FrameMountConfig,
  FrameTheme,
  FrameToParentMessage,
  FrameTriggerConfig,
  FrameTriggerType,
  ParentToFrameMessage,
  PayloadFor,
  ResponseFor,
  VibeFrameBatchConfig,
  VibeFrameGlobalConfig,
  VibeFrameInstance,
  VibeFrameIntegrationConfig,
  VibeFramePublicAPI,
  VibeFrameSharedOptions,
} from "./types";
export { DEFAULT_SANDBOX, generateFrameId } from "./types";
