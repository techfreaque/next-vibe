/**
 * System Prompt Fragment Types
 *
 * Each fragment lives in a single flat file:
 *   <module>/system-prompt.ts   - fragment definition only, build() fetches inline
 *
 * Priority: lower = earlier in the section.
 * Built-ins use multiples of 100. Module fragments use gaps (e.g. 150, 250).
 */

import type {
  DefaultFolderId,
  ToolExecutionContext,
} from "next-vibe/agent/chat/config";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

/** Remote instance connection info — pre-fetched once, shared by 3 fragments. */
export interface RemoteInstancesContext {
  remoteConnections: Array<{ instanceId: string }>;
  instanceId: string | null | undefined;
  knownInstanceIds: string[];
  isAdmin: boolean;
  appName: string;
  appUrl: string;
  isLocalMode: boolean;
  isDev: boolean;
  totalModelCount: number;
  sshConnectionCount: number;
}

/**
 * Standard params passed to every fragment's build() function.
 * Fields used by multiple fragments are pre-fetched by loadAllPromptFragments
 * and passed here so each fragment reads without re-fetching.
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
  /**
   * Relay RECEIVER only: the caller instance id that OWNS this thread. When set,
   * thread-mutating housekeeping tools (rename-thread) must round-trip to the
   * caller — the fragment prefixes the tool name `<caller>__rename-thread` so the
   * rename lands on the OWNER, not this executor's local copy.
   */
  relayCallerInstanceId?: string | null;
  excludeMemories?: boolean;
  /** Whether running in headless mode (no human present) */
  headless?: boolean;
  /** Sub-agent nesting depth (0 = top-level, 1+ = sub-agent) */
  subAgentDepth: number;
  /** Whether in voice call mode (TTS autoplay) */
  callMode?: boolean;
  /** Extra per-request instructions to append */
  extraInstructions?: string;
  /**
   * Fired user-message embed. The cortex fragment awaits it before its vector
   * search so the just-written message's stored vector is present (no race, no
   * blocking the message write). Absent → nothing to await.
   */
  messageEmbedReady?: Promise<void>;
  /** Active thread ID — passed to fragments that need thread context (e.g. rename) */
  threadId?: string | null;
  /** Incognito only: client-sent current thread title (no DB row exists to read it from). */
  incognitoThreadTitle?: string | null;
  /** Incognito only: client-sent current thread description. */
  incognitoThreadDescription?: string | null;
  /** Resolved memory token limit from cascade: favorite → skill → settings → null (use default) */
  memoryLimit?: number | null;
  /** Resolved media generation capabilities for the current request */
  mediaCapabilities?: MediaCapabilitiesParams;
  /** Fixture thread id — cortex vector-search embeddings bind it. */
  toolExecutionContext: ToolExecutionContext;
  /** Pre-fetched: whether user has no memories and no tasks (used by bootstrap + guest fragments). */
  isFreshUser?: boolean;
  /** Pre-computed app name from i18n config (used by identity, platform, bootstrap, guest fragments). */
  appName?: string;
  /** Pre-fetched remote instances + SSH context (used by system-context, remote-instances, ssh-connections fragments). */
  remoteInstancesContext?: RemoteInstancesContext;
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
  /** Capabilities of the resolved video gen model */
  videoGenCapabilities: {
    supportedDurations?: readonly string[];
    supportedAspectRatios?: readonly string[];
    supportedResolutions?: readonly string[];
    supportedFrameImages?: readonly string[];
    allowedPassthroughParameters?: readonly string[];
  } | null;
}

/**
 * A fragment that contributes content to the leading or trailing system prompt.
 * build() receives the full params and fetches what it needs inline.
 * Return null to omit the fragment entirely.
 */
export interface SystemPromptFragment {
  id: string;
  placement: "leading" | "trailing";
  priority: number;
  build: (params: SystemPromptServerParams) => Promise<string | null>;
}

/** Shape of a dynamically-imported prompt module (each named export is a fragment). */
export type PromptFragmentModule = Record<string, SystemPromptFragment>;
