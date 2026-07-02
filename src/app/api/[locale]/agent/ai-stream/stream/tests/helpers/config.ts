/**
 * Shared suite configuration for the AI-stream integration test library.
 *
 * `ModeConfig` describes one matrix cell (transport × loop location × tool
 * source); `describeStreamSuite(cfg)` in route-base.test.ts instantiates the
 * whole T-tree from it. Everything in tests/helpers/* is parameterized by this
 * config so the same assertions run identically in every mode.
 */

import "server-only";

import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

export interface ModeConfig {
  /** Human-readable label used in describe() title */
  label: string;
  /** Prefix for setFetchCacheContext - e.g. "regular-", "direct-", "queue-", "unbottled-" */
  cachePrefix: string;
  /**
   * When set, the AI calls remote tools via two patterns depending on tool type:
   *
   * **Meta-tools** (`tool-help`, `execute-tool`): always bare name + `instanceId` param.
   *   e.g. `execute-tool(toolName='tool-help', instanceId='hermes')`
   *   The `instanceId__tool-help` prefix form is NOT the expected pattern for meta-tools.
   *
   * **Pinned tools** (everything else): appear as `instanceId__toolName` in the tool list.
   *   The AI calls them via `execute-tool(toolName='generate_image', instanceId='hermes')`
   *   in test context (where no pinned tools are registered).
   *
   * Assertions verify execute-tool calls with correct instanceId in args.
   * When not set, the AI calls tools directly by plain name (no prefix ever).
   */
  remoteInstanceId?: string;
  /**
   * Per-mode setup called after the shared beforeAll (user resolution + credits).
   * Use this for remote connection setup, credential patching, etc.
   */
  setup?: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /**
   * Per-mode teardown called in afterAll.
   */
  teardown?: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /**
   * For queue mode: a real pulse function that executes pending tasks.
   *
   * Queue WAIT flow (per spec):
   *   1. runTestStream → AI calls execute-tool(wait) → stream aborts → thread 'waiting'
   *   2. Assert thread is 'waiting' + tool message is 'pending'
   *   3. await cfg.pulse(threadId) → polls for remote task completion → fires revival
   *      directly in-process (bypassing server cron race) → thread → 'idle'
   *   4. Re-fetch messages → assert backfilled result + AI final response
   *
   * @param threadId - the thread ID for which to run revival
   */
  pulse?: (threadId: string) => Promise<void>;
  /**
   * When true, add T-SYS: assert the AI stream's system prompt came from the LOCAL
   * instance (not the remote). The local system prompt contains the local instance
   * ID; the AI's response to "What is your instance ID?" must match.
   *
   * Set this for all remote relay suites where loopLocation='server' but the
   * system prompt should be built on the client (local) side.
   */
  assertSystemPromptFromLocal?: boolean;
  /**
   * REMOTE-folder suites: the system prompt must come from THIS remote
   * instance — the loop, tools and prompt all live there ("as if on remote").
   * T-SYS asserts the AI reports this instance ID instead of the local one.
   * Mutually exclusive with assertSystemPromptFromLocal.
   */
  systemPromptInstanceId?: string;
  /**
   * Run only cheap, fast tests: skips T4 (music+video), T8 (parallel image),
   * T9 (preCalls image injection). T2 is replaced with a tool-help call that
   * sets the same shared state. Pure cost lever — every test that runs
   * asserts identically in every mode.
   */
  cheapMode?: boolean;
  /**
   * Override the root folder used for all runStream calls in this mode.
   * When set, streams go into this root folder instead of BACKGROUND.
   * Used by remote-chat-root suite which runs streams inside REMOTE/hermes subfolder.
   */
  rootFolderIdOverride?: DefaultFolderId;
  /**
   * Override the sub-folder UUID used for all runStream calls in this mode.
   * Must be used together with rootFolderIdOverride.
   * Set after connection setup when the remote/hermes subfolder UUID is known.
   */
  subFolderIdOverride?: string;
  /**
   * When true, add T-RELAY: assert the remote (hermes) wallet balance decreased
   * after T1, proving the stream actually ran on the remote instance via relay
   * and was NOT served locally. Use for UNBOTTLED inference-provider mode and
   * any relay mode where the loop cost should land on the remote wallet.
   */
  assertRelayRan?: boolean;
  /**
   * Remote folder on hermes where relayed threads should land.
   * When set alongside assertRelayRan, T-RELAY also verifies the thread exists
   * in this folder on the hermes prod DB. Get this from beforeAll after connecting.
   */
  hermesThreadFolderId?: string;
}

/**
 * Billing-model derivation: is the LOCAL testUser wallet exempt from
 * per-step deduction asserts because the whole loop moved to the remote?
 *
 * Remote-folder relay (rootFolderIdOverride=REMOTE) bills ONLY the side that
 * runs the loop — the local wallet must not be charged for the turn, so local
 * deduction asserts are meaningless there (and a LOCAL-NOT-BILLED guard runs
 * instead, see T1).
 *
 * Inference-provider relays bill BOTH sides of the chain (the provider bills
 * its own markup, the local side bills the user), so neither assertRelayRan
 * nor systemPromptInstanceId alone may skip the local-wallet asserts — those
 * suites assert the remote decrease (T-RELAY) AND the local deduction.
 */
export function deriveLoopRunsRemote(cfg: ModeConfig): boolean {
  return cfg.rootFolderIdOverride === DefaultFolderId.REMOTE;
}
