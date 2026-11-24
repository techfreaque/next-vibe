import type { ModelMessage } from "ai";
import { z } from "zod";

export const cacheControlSchema = z.object({
  type: z.literal("ephemeral"),
  ttl: z.enum(["5m", "1h"]).optional(),
});
export type CacheControl = z.infer<typeof cacheControlSchema>;

export function cacheOptions(control: CacheControl | undefined): {
  providerOptions?: {
    openrouter: { cacheControl: CacheControl };
    openaiCompatible: { cache_control: CacheControl };
  };
} {
  if (!control) {
    return {};
  }
  return {
    providerOptions: {
      openrouter: { cacheControl: control },
      openaiCompatible: { cache_control: control },
    },
  };
}

export interface ClientPromptCache {
  control?: CacheControl;
  tools: ReadonlyMap<string, CacheControl>;
  messages: readonly ModelMessage[];
}
