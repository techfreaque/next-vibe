/**
 * Core Client Environment
 */

import { getCurrentOrigin } from "next-vibe/ui/lib/location";
import { z } from "zod";

import { defineEnvClient } from "../env/define-env-client";
import { isHermesDev, isPreviewMode } from "../env/detect";
import { Environment, VibeMode, VibeModeValues } from "../env/env-util";

const isServer = typeof window === "undefined";
const isBrowser = !isServer && typeof document !== "undefined";

export const platform = { isServer, isReactNative: false, isBrowser };

/**
 * Rewrite a localhost app URL's port to match the local instance this process
 * actually targets, server-side only. `--hermes`/`--preview` tool commands run
 * against the Hermes instance, NOT Atlas (:3000) — and this URL seeds the
 * realtime hub address (localHubWsUrl in keyed-signal.ts). Getting it wrong
 * means a cross-process WS subscription (e.g. a remote one-shot `ai-run` waiting
 * for Thea's result) joins the WRONG hub and hangs forever. Hermes dev is :3002;
 * Hermes prod (`vibe --hermes start/build`) honours PREVIEW_PORT, default :3001.
 * Mirrors the same rewrite in core/env.ts. Non-localhost hosts are left as-is.
 */
function applyLocalInstancePort(raw: string): string {
  if (!isPreviewMode) {
    return raw;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
      return raw;
    }
    parsed.port = isHermesDev
      ? "3002"
      : (process.env["PREVIEW_PORT"] ?? "3001");
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return raw;
  }
}

export const {
  envClient: coreClientEnv,
  schema: coreClientEnvSchema,
  examples: coreClientEnvExamples,
} = defineEnvClient({
  NODE_ENV: {
    schema: z.enum(Environment).default(Environment.DEVELOPMENT),
    value: process.env.NODE_ENV,
    example: "development",
  },
  NEXT_PUBLIC_APP_URL: {
    schema: z
      .string()
      .url()
      .default("http://localhost:3000")
      .transform((s) =>
        isBrowser ? getCurrentOrigin() : applyLocalInstancePort(s),
      ),
    value: process.env.NEXT_PUBLIC_APP_URL,
    example: "http://localhost:3000",
  },
  NEXT_PUBLIC_PROJECT_URL: {
    // eslint-disable-next-line i18next/no-literal-string
    schema: z.string().url().default("https://unbottled.ai"),
    value: process.env.NEXT_PUBLIC_PROJECT_URL,
    example: "https://unbottled.ai",
    comment:
      "Project URL - defaults to https://unbottled.ai. Override to use your own domain.",
    commented: true,
  },
  NEXT_PUBLIC_VIBE_MODE: {
    schema: z.enum(VibeModeValues).default(VibeMode.DEV),
    value: process.env.NEXT_PUBLIC_VIBE_MODE,
    example: VibeMode.DEV,
    comment:
      "Instance mode. 'agent' = personal local instance (no auth wall, no payments). 'cloud' = SaaS deployment (auth, payments, receive-only sync). 'dev' = Atlas coding instance (default).",
  },
  NEXT_PUBLIC_DEBUG_PRODUCTION: {
    schema: z
      .string()
      .optional()
      .default("false")
      .transform((v) => v === "true"),
    value: process.env.NEXT_PUBLIC_DEBUG_PRODUCTION,
    example: "false",
  },
});
