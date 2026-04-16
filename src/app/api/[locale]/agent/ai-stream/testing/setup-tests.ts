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
import { loadEnvironment } from "@/app/api/[locale]/system/unified-interface/cli/runtime/environment";

loadEnvironment();
