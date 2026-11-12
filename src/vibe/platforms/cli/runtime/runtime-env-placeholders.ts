/**
 * Sentinel format shared between build-time placeholder injection and
 * start-time patching.
 *
 * The Docker prod build sets VIBE_BUILD_PLACEHOLDER_ENV=true only on the
 * Next.js build command (see Dockerfile). While that flag is set,
 * environment.ts overwrites every NEXT_PUBLIC_* value already present in
 * process.env with `runtimeEnvPlaceholder(key)` before Next.js bundles it,
 * so no public config or the secrets that derive NEXT_PUBLIC_AGENT_* need to
 * reach the build. At container start, patchRuntimeEnvPlaceholders
 * (server/server/start/runtime-env-patch.ts) discovers every NEXT_PUBLIC_*
 * key present in that container's real runtime env and replaces its
 * sentinel in the compiled .next-prod bundle with the real value. One
 * image, patched differently per instance, no rebuild.
 *
 * Both sides derive the key list from whatever is already prefixed
 * NEXT_PUBLIC_ in process.env - only the sentinel format itself needs to
 * stay in sync, which is why it lives here.
 */
const SENTINEL_PREFIX = "__VIBE_RUNTIME_ENV_";

export function runtimeEnvPlaceholder(key: string): string {
  return `${SENTINEL_PREFIX}${key}__`;
}

/**
 * The env handed to the `next build` child. In a placeholder build
 * (VIBE_BUILD_PLACEHOLDER_ENV=true) every NEXT_PUBLIC_* value becomes its
 * sentinel; otherwise `env` is returned unchanged (local/dev/Hermes builds).
 *
 * The early pass in environment.ts is not enough on its own: modules that
 * evaluate after it write NEXT_PUBLIC_* back into process.env (defineEnv's
 * writeEnvToProcess turns stripped sentinels into schema defaults such as
 * NEXT_PUBLIC_APP_URL=http://localhost:3000 and NEXT_PUBLIC_VIBE_MODE=dev;
 * agent/env.ts writes the NEXT_PUBLIC_AGENT_* flags). Next.js inlines
 * whatever the child sees, so the sentinels must be applied at the spawn.
 */
export function withRuntimeEnvPlaceholders(
  env: NodeJS.ProcessEnv,
): NodeJS.ProcessEnv {
  if (env["VIBE_BUILD_PLACEHOLDER_ENV"] !== "true") {
    return env;
  }
  const out: NodeJS.ProcessEnv = { ...env };
  for (const key of Object.keys(out)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      out[key] = runtimeEnvPlaceholder(key);
    }
  }
  return out;
}

/** True when a value is one of the sentinels above - used to exempt exactly those fields from schema validation, never the whole env object. */
export function isRuntimeEnvPlaceholder(value: string): boolean {
  return value.startsWith(SENTINEL_PREFIX);
}
