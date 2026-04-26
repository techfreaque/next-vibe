/**
 * System Prompt Fragment Types
 *
 * Each fragment lives in its module's system-prompt/ folder:
 *   <module>/system-prompt/prompt.ts   - isomorphic build fn (pure, no DB, no server imports)
 *   <module>/system-prompt/server.ts   - server-only data loader (import "server-only")
 *   <module>/system-prompt/client.ts   - React hook returning the same data shape
 *
 * Types flow outward from prompt.ts: the PromptData type declared there is the
 * contract that both server.ts and client.ts must satisfy.
 *
 * Priority: lower = earlier in the section.
 * Built-ins use multiples of 100. Module fragments use gaps (e.g. 150, 250).
 */

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

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
  excludeMemories?: boolean;
  /** Whether running in headless mode (no human present) */
  headless?: boolean;
  /** Sub-agent nesting depth (0 = top-level, 1+ = sub-agent) */
  subAgentDepth: number;
  /** Whether in voice call mode (TTS autoplay) */
  callMode?: boolean;
  /** Extra per-request instructions to append */
  extraInstructions?: string;
  /** Last user message content — used for vector search context injection */
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
 * Standard params passed to every client-side fragment data hook.
 * All hooks accept this same shape - they ignore fields they don't need.
 */
export interface SystemPromptClientParams {
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Whether private/authenticated fetching is enabled */
  enabled: boolean;
  /** Whether private data (non-exposed folders) should be fetched */
  enabledPrivate: boolean;
  /** Active skill ID, if any */
  skillId?: string | null;
  rootFolderId: DefaultFolderId;
  subFolderId?: string | null;
  /** Whether in voice call mode */
  callMode?: boolean;
  /** Extra per-request instructions to append */
  extraInstructions?: string;
  /** Whether running headless */
  headless?: boolean;
  /** Sub-agent nesting depth (0 = top-level, 1+ = sub-agent) */
  subAgentDepth: number;
}

/**
 * A fragment that contributes content to the leading or trailing system prompt.
 *
 * TData - the data type this fragment needs. Must be derivable from params
 * already loaded by builder.ts (server) / hook.ts (client). Never do async
 * work inside `build` - that belongs in server.ts / client.ts.
 *
 * placement:
 * - "leading"  - static system prompt, sent as the `system` param. Cacheable.
 * - "trailing" - dynamic system message, injected before [Context:] each turn.
 */
export interface SystemPromptFragment<TData> {
  id: string;
  placement: "leading" | "trailing";
  priority: number;
  condition?: (data: TData) => boolean;
  build: (data: TData) => string | null;
}
