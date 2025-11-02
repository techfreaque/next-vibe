/**
 * Stripe Provider Aggregator Route
 * Aggregates Stripe CLI routes for tRPC router
 * Note: Webhook route is not included as it handles raw POST requests
 */

import { tools as cliTools } from "./cli/route";

// Aggregate tools from all stripe sub-routes
export const tools = {
  trpc: {
    cli: cliTools.trpc,
  },
};
