// Keep the example outside page.tsx so the TanStack client import stripper
// does not treat the example's imports as imports of the page.
export const ROUTE_CODE = `import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";
import definitions from "./definition";
import { explainToMyBoss } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: { handler: ({ data, logger }) => explainToMyBoss(data, logger) },
});`;
