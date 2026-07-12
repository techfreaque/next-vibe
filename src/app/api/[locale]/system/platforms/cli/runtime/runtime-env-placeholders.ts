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

/** True when a value is one of the sentinels above - used to exempt exactly those fields from schema validation, never the whole env object. */
export function isRuntimeEnvPlaceholder(value: string): boolean {
  return value.startsWith(SENTINEL_PREFIX);
}
