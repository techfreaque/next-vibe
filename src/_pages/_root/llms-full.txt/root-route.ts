/**
 * GET /llms-full.txt - /llms.txt plus the complete chat and media model list.
 */

import { llmsTxtResponse } from "../llms.txt/build-llms";

export function GET(request: Request): Promise<Response> {
  return llmsTxtResponse(request, "full");
}
