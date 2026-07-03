/**
 * System Prompt Fragment Types
 *
 * Each fragment lives in a single flat file:
 *   <module>/system-prompt.ts   - fragment definition + server-only data loader
 *
 * Priority: lower = earlier in the section.
 * Built-ins use multiples of 100. Module fragments use gaps (e.g. 150, 250).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

/**
 * Standard params passed to every server-side fragment data loader.
 * All loaders accept this same shape - they ignore fields they don't need.
 * This is the superset of all per-loader params so builder.ts can call them uniformly.
 */
export interface SystemPromptServerParams {
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  skillId: string | null | undefined;
  isIncognito: boolean;
  isExposedFolder: boolean;
  /** Model-pipe relay receiver — blank this instance's own identity fragment. */
  suppressSelfIdentity?: boolean;
  excludeMemories?: boolean;
  /** Whether running in headless mode (no human present) */
  headless?: boolean;
  /** Sub-agent nesting depth (0 = top-level, 1+ = sub-agent) */
  subAgentDepth: number;
  /** Whether in voice call mode (TTS autoplay) */
  callMode?: boolean;
  /** Extra per-request instructions to append */
  extraInstructions?: string;
  /** Last user message content - used for vector search context injection */
  lastUserMessage?: string;
  /** Resolved memory token limit from cascade: favorite → skill → settings → null (use default) */
  memoryLimit?: number | null;
  /** Resolved media generation capabilities for the current request */
  mediaCapabilities?: MediaCapabilitiesParams;
}

/** Resolved media generation model info passed from stream-setup to the system prompt fragment. */
export interface MediaCapabilitiesParams {
  /** Native outputs of the primary LLM (e.g. ["image"] for image-native models) */
  nativeOutputs: string[];
  imageGenModelName: string | null;
  musicGenModelName: string | null;
  videoGenModelName: string | null;
  /** true when the chat model IS the image gen model (same model ID) - tool is redundant */
  imageGenIsSameAsChatModel: boolean;
  /** true when the chat model IS the music gen model (same model ID) - tool is redundant */
  musicGenIsSameAsChatModel: boolean;
  /** true when the chat model IS the video gen model (same model ID) - tool is redundant */
  videoGenIsSameAsChatModel: boolean;
}

/**
 * A fragment that contributes content to the leading or trailing system prompt.
 * Return null from build() to omit the fragment entirely.
 */
export interface SystemPromptFragment<TData> {
  id: string;
  placement: "leading" | "trailing";
  priority: number;
  build: (data: TData) => string | null;
}

/**
 * Opaque shape of a fragment as seen from a dynamic module import.
 */
// oxlint-disable-next-line typescript/no-explicit-any
export type PromptFragmentModuleEntry = SystemPromptFragment<any>;

/** Shape of a dynamically-imported prompt module (each named export is a fragment). */
export type PromptFragmentModule = Record<string, PromptFragmentModuleEntry>;
