import "server-only";

import { getRawEnv } from "../../env/env-source";
import type { EndpointMeta } from "./endpoints-meta";

/** Evaluate the definition's alternative configuration sets without serializing secret values. */
export function isAdminToolConfigured(
  tool: Pick<EndpointMeta, "admin">,
): boolean {
  const alternatives = tool.admin?.configuredWhen;
  if (!alternatives?.length) {
    return true;
  }
  const env = getRawEnv();
  return alternatives.some(
    (keys) => keys.length > 0 && keys.every((key) => Boolean(env[key]?.trim())),
  );
}
