/**
 * Bun test preload file.
 *
 * Must run before ANY other import so that:
 *   1. loadEnvironment() loads .env and sets NEXT_PUBLIC_AGENT_* flags
 *      (including NEXT_PUBLIC_AGENT_UNBOTTLED) before env-availability.ts
 *      evaluates its singleton.
 *   2. "server-only" guard is satisfied without crashing.
 *
 * Usage (bunfig.toml in project root):
 *   [test]
 *   preload = ["./src/app/api/[locale]/agent/ai-stream/testing/setup-tests.ts"]
 */

// server-only guard: mark this as a server context
import "server-only";

// Load env vars (.env) and derive NEXT_PUBLIC_AGENT_* flags BEFORE any
// module that reads agentEnvAvailability is imported.
import { loadEnvironment } from "next-vibe/platforms/cli/runtime/environment";

loadEnvironment();

// No fixture-mode env flag exists anymore: fixture record/replay activates
// solely when a `fixtures` table row exists for the stream's threadId (seeded
// by the harness per case, on every instance). The engine reads/bumps it by
// threadId — the streamContext carried down the chain only supplies that id.
