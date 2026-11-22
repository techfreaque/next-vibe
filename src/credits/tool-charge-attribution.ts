import "server-only";

import { FETCH_URL_ALIAS } from "next-vibe/agent/fetch-url-content/constants";
import { BRAVE_SEARCH_ALIAS } from "next-vibe/agent/web-search/brave/constants";
import { WEB_SEARCH_ALIAS } from "next-vibe/agent/web-search/constants";
import { SearchProviderDB } from "next-vibe/agent/web-search/enum";
import { KAGI_ALIAS } from "next-vibe/agent/web-search/kagi/constants";
import { resolveSearchProvider } from "next-vibe/agent/web-search/provider";
import { z } from "zod";

import {
  TOOL_COST_PROVIDERS,
  type ToolChargeAttribution,
} from "./tool-cost-providers";

const FIXED_TOOL_SERVICES = new Map<string, ToolChargeAttribution>([
  [FETCH_URL_ALIAS, TOOL_COST_PROVIDERS.SCRAPPEY],
  [BRAVE_SEARCH_ALIAS, TOOL_COST_PROVIDERS.BRAVE],
  [KAGI_ALIAS, TOOL_COST_PROVIDERS.KAGI],
]);

export const toolChargeRequestSchema = z.object({
  provider: z.enum(SearchProviderDB).optional(),
});

export function resolveToolChargeAttribution(
  feature: string,
  requestData: z.output<typeof toolChargeRequestSchema> | undefined,
): ToolChargeAttribution | undefined {
  if (feature === WEB_SEARCH_ALIAS) {
    return requestData?.provider
      ? resolveSearchProvider(requestData.provider)?.creditAttribution
      : undefined;
  }
  return FIXED_TOOL_SERVICES.get(feature);
}
