import type { z } from "zod";

interface AtlasRequest {
  data: z.infer<ReturnType<typeof z.json>>;
  headers?: Record<string, string>;
}

/** Real HTTP to the test harness's Atlas URL. No cookie jar or external redirects. */
export async function postAtlasFixture(
  url: string,
  { data, headers }: AtlasRequest,
): Promise<Response> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("content-type", "application/json");
  // oxlint-disable-next-line restricted/no-raw-fetch -- real Atlas HTTP fixture
  return fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: typeof data === "string" ? data : JSON.stringify(data),
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
}
