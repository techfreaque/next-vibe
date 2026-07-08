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
  /** Cache prefix = ONE fixture folder for the whole test file (e.g. "cheap-",
   *  "direct-cheap-"). Replay is ordinal-driven within this folder. */
  cachePrefix: string;
  /**
   * Suite-wide FixtureContext options merged into every case's context by
   * route-base's setCaseFixture: strict = throw on any uncached external
   * call; interceptLocalhostPorts = treat these localhost ports as external
   * (remote-mode suites whose "provider" is a localhost server).
   */
  fixtureStrict?: boolean;
  fixtureInterceptLocalhostPorts?: number[];
  /**
   * Cheap variant: media-gen steps swap to cortex/tool-help equivalents with
   * the same observable thread shape. Every callback mode and folder
   * assertion still runs — only the operation is cheaper.
   */
  cheapMode?: boolean;
  /** TEMPORARY DEBUG: throw right after T1 so fixture-replay iteration is fast. */
  stopAfterFirstCase?: boolean;
  /**
   * Queue mode: streams end in 'waiting' and a cron pulse revives them.
   * Called with the threadId after each dispatch; the helper polls revival.
   */
  pulse?: (threadId: string) => Promise<void>;
  /**
   * Tools-remote: every tool call is wrapped as
   * execute-tool(toolName, instanceId=<this>) so the tool executes on the
   * remote instance. Prompt wrapping + remote-call assertions key off this.
   */
  remoteInstanceId?: string;
  /**
   * REMOTE-folder suites: the instance id whose system prompt + tools the AI
   * must be running with — T-SYS asserts self-instance-id reports THIS id,
   * no matter where the loop runs.
   */
  systemPromptInstanceId?: string;
  /**
   * Inference-provider suites: the system prompt is built on the LOCAL
   * instance (client-owned model pipe) — T-SYS asserts the LOCAL id.
   */
  assertSystemPromptFromLocal?: boolean;
  /**
   * Inference-provider relay suites: after each stream, wait for the relayed
   * assistant reply to arrive as message events before asserting (the caller
   * flips idle when the relay HTTP call returns, the reply lands async).
   * No-op for REMOTE-folder suites — their mirror wait covers it.
   */
  assertRelayRan?: boolean;
  /** Suite root override — REMOTE for remote-folder suites. */
  rootFolderIdOverride?: DefaultFolderId;
  /** REMOTE-folder suites: instance subfolder id resolved by cfg.setup. */
  subFolderIdOverride?: string;
  /** Per-suite setup (connect to hermes, credits, folders) — runs in beforeAll. */
  setup?: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /** Mirrored teardown — runs in afterAll. */
  teardown?: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /**
   * Remote-folder LOOP-LOCAL topology: the thread lives in the caller's
   * REMOTE/<instance>/tests/<case> folder but the LOOP runs HERE (the
   * stream forces loopInstanceId="self"). System prompt + tools still come
   * from the REMOTE — tool calls round-trip via execute-tool(instanceId),
   * so self-instance-id reports the remote. The LOCAL wallet is billed.
   */
  forceLocalLoop?: boolean;
  /**
   * Same-instance suite + LIVE hermes thread mirror: after every stream the
   * thread must ALSO exist on hermes at REMOTE/<selfInstanceId>/tests/<case>
   * (thread-sync mirroring, chunk relay, folder placement). The suite's setup
   * must connect to hermes with threads/chat sync enabled.
   */
  assertMirrorOnHermes?: boolean;

  /**
   * The transport leg the relay MUST have actually used. Asserted in T-RELAY
   * against the REMOTE CONNECTION row's attested `lastTransportUsed` —
   * written by the transport primitive that actually carried the dispatch
   * (pushRemoteEvent legs / callToolDirect), never by configuration.
   */
  expectRelayTransport?: "direct-http" | "reverse-ws";
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
  return (
    cfg.rootFolderIdOverride === DefaultFolderId.REMOTE && !cfg.forceLocalLoop
  );
}
