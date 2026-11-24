import { beforeEach, expect, mock, spyOn, test } from "bun:test";

import { REQUEST_ID_HEADER_NAME } from "@/env/constants";

import type { EndpointLogger } from "../../../../logger/types";
import { fetchServerFunction } from "./server-function-fetch";

const logError = mock<EndpointLogger["error"]>();
void mock.module("../../../../logger/client", () => ({
  createClientLogger: (): Pick<EndpointLogger, "error"> => ({
    error: logError,
  }),
}));
void mock.module("next-vibe/ui/lib/location", () => ({
  getCurrentPathname: (): string => "/de-DE/threads/incognito/new",
}));
void mock.module("next-vibe/ui/lib/dom", () => ({
  getVisibilityState: (): DocumentVisibilityState => "visible",
}));
void mock.module("next-vibe/ui/lib/media", () => ({
  isOnline: (): boolean => true,
}));

const url = "/_serverFn/long-server-function-id?payload=private";

beforeEach(() => {
  logError.mockClear();
});

test("retries a lost GET connection once and reports it with the original request ID", async () => {
  const fetch = spyOn(globalThis, "fetch")
    .mockRejectedValueOnce(new TypeError("Failed to fetch"))
    .mockResolvedValueOnce(new Response("loader data"));

  try {
    const result = await fetchServerFunction(url, {
      method: "GET",
      headers: { accept: "application/json" },
    });
    expect(await result.text()).toBe("loader data");
    const requestIds = fetch.mock.calls.map(([input, init]) => {
      expect(input).toBe(url);
      const headers = new Headers(init?.headers);
      expect(headers.get("accept")).toBe("application/json");
      return headers.get(REQUEST_ID_HEADER_NAME);
    });
    expect(requestIds).toHaveLength(2);
    expect(requestIds[0]).toBeTruthy();
    expect(requestIds[1]).toBeTruthy();
    expect(requestIds[0]).not.toBe(requestIds[1]);
    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(
      "[TanStack] Server function request lost connection",
      expect.any(TypeError),
      expect.objectContaining({
        requestId: requestIds[0],
        retrying: true,
        path: "/_serverFn/:id",
        online: true,
        visibility: "visible",
      }),
    );
  } finally {
    fetch.mockRestore();
  }
});

test("passes the second connection failure to the route boundary", async () => {
  const failure = new TypeError("Failed to fetch");
  const fetch = spyOn(globalThis, "fetch").mockRejectedValue(failure);
  try {
    await expect(fetchServerFunction(url)).rejects.toBe(failure);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledTimes(2);
    expect(logError.mock.calls[1]?.[2]).toMatchObject({ retrying: false });
  } finally {
    fetch.mockRestore();
  }
});

test("preserves HTTP errors and never replays writes or a cancelled request", async () => {
  const response = new Response("service unavailable", { status: 503 });
  const failure = new TypeError("Failed to fetch");
  const fetch = spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(response)
    .mockRejectedValue(failure);
  try {
    await expect(fetchServerFunction(url)).resolves.toBe(response);
    await expect(
      fetchServerFunction(url, { method: "POST", body: "body" }),
    ).rejects.toBe(failure);
    await expect(
      fetchServerFunction(url, { signal: AbortSignal.abort() }),
    ).rejects.toBe(failure);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError.mock.calls[0]?.[2]).toMatchObject({
      method: "POST",
      retrying: false,
    });
  } finally {
    fetch.mockRestore();
  }
});
