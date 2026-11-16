/**
 * GET /llms.txt - root route (served outside [locale] on Next and TanStack;
 * shells are generated from src/_pages/_root/<file>/root-route.ts).
 * `?locale=de-DE` returns the same map for another site locale.
 */

import { llmsTxtResponse } from "./build-llms";

export function GET(request: Request): Promise<Response> {
  return llmsTxtResponse(request, "short");
}
