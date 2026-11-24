import { afterEach, expect, it, mock, type Mock, spyOn } from "bun:test";
import { DrizzleQueryError } from "drizzle-orm";
import { NextRequest } from "next-vibe/ui/lib/request";

import { AUTH_TOKEN_COOKIE_NAME, LEAD_ID_COOKIE_NAME } from "@/env/constants";
import * as geo from "@/leads/geo/lookup";
import { proxy } from "@/proxy";

import { defaultLocale } from "../../../core/i18n/core/config";
import * as leadOps from "../../../identity/lead/middleware-ops";
import { createLeadId } from "../../../identity/middleware/lead-id";
import * as serverLogger from "../../../logger/server";
import type { EndpointLogger } from "../../../logger/types";
import { middleware } from "./index";
import {
  DEGRADED_PUBLIC_DOCUMENT_HEADER,
  forwardDegradedPublicDocument,
} from "./public-document";

const options = {
  defaultLocale,
  allowMixedLocales: true,
  supportedLocales: [defaultLocale],
};
const requestId = crypto.randomUUID();

function request(path: string, method = "GET", cookie = ""): NextRequest {
  return new NextRequest(new URL(path, "https://example.test"), {
    method,
    headers: {
      cookie,
      "x-request-id": requestId,
      [DEGRADED_PUBLIC_DOCUMENT_HEADER]: "1",
    },
  });
}

function captureErrors(): Mock<EndpointLogger["error"]> {
  const logger = serverLogger.createEndpointLogger(false, defaultLocale);
  const report = mock(logger.error).mockImplementation(() => undefined);
  spyOn(serverLogger, "createEndpointLogger").mockReturnValue({
    ...logger,
    error: report,
  });
  return report;
}

afterEach(() => {
  mock.restore();
});

it("limits public fallback to anonymous read-only documents and keeps real DB errors visible", async () => {
  const report = captureErrors();
  const create = spyOn(leadOps, "createAnonymousLead");
  for (const [path, method, cookie, operation, reason, status] of [
    ["/en-US/story", "GET", "", "insert", "Query read timeout", 200],
    [
      "/en-US/story/blog/uncensored-llm-api",
      "GET",
      "",
      "insert",
      "Query read timeout",
      200,
    ],
    [
      "/en-US/models/model",
      "HEAD",
      `${LEAD_ID_COOKIE_NAME}=invalid`,
      "select",
      "timeout exceeded when trying to connect",
      200,
    ],
    ["/en-US/docs/api", "GET", "", "insert", "constraint error", 500],
    [
      "/en-US/docs/api",
      "GET",
      `${AUTH_TOKEN_COOKIE_NAME}=session`,
      "select",
      "Query read timeout",
      503,
    ],
    ["/en-US/story", "POST", "", "insert", "Query read timeout", 503],
    ["/en-US/story?id=private", "GET", "", "insert", "Query read timeout", 503],
    ["/en-US/user/signup", "GET", "", "insert", "Query read timeout", 503],
    ["/en-US/subscription/buy", "GET", "", "insert", "Query read timeout", 503],
    [
      "/api/en-US/user/public/login",
      "POST",
      "",
      "insert",
      "Query read timeout",
      503,
    ],
  ] as const) {
    create.mockRejectedValueOnce(
      new DrizzleQueryError(
        `${operation} example`,
        ["private-input"],
        new Error(reason),
      ),
    );
    const incoming = request(path, method, cookie);
    const response = await middleware(incoming, {
      ...options,
      supportedLocales: ["en-US"],
    });
    expect(response.status).toBe(status);
    expect(response.headers.has("x-middleware-next")).toBe(status === 200);
    expect(response.headers.has("set-cookie")).toBe(false);
    expect(response.headers.get("Retry-After")).toBe(
      status === 503 ? "5" : null,
    );
    expect(response.headers.get("Cache-Control")).toBe(
      status === 200 ? "private, no-store" : "no-store",
    );
    expect(report).toHaveBeenLastCalledWith(
      "Anonymous lead creation failed in middleware",
      expect.objectContaining({
        stage: operation === "select" ? "lookup" : "insert",
        method,
        status,
        requestId,
        renderWithoutLead: status === 200,
      }),
    );
    expect(JSON.stringify(report.mock.lastCall)).not.toContain("private-input");
  }
});

it("forwards only the proxy's decision and preserves an unverified guest cookie", async () => {
  captureErrors();
  const validate = spyOn(leadOps, "validateLeadIdExists").mockRejectedValue(
    new Error("Guest lead database deadline exceeded"),
  );
  const create = spyOn(leadOps, "createAnonymousLead");
  const cookie = `${LEAD_ID_COOKIE_NAME}=${crypto.randomUUID()}`;
  for (const path of [
    "/en-US/story",
    "/en-US/user/signup",
    "/en-US/subscription/buy",
    "/api/en-US/user/public/signup",
    "/api/en-US/payment/create",
  ]) {
    const incoming = request(
      path,
      path.startsWith("/api/") ? "POST" : "GET",
      cookie,
    );
    const response = await proxy(incoming);
    const headers = new Headers(incoming.headers);
    const degraded = path === "/en-US/story";
    expect(response.status).toBe(degraded ? 200 : 503);
    expect(forwardDegradedPublicDocument(headers, response)).toBe(degraded);
    expect(
      response.headers.get(
        `x-middleware-request-${DEGRADED_PUBLIC_DOCUMENT_HEADER}`,
      ),
    ).toBe(degraded ? "1" : null);
    expect(response.headers.has("set-cookie")).toBe(false);
  }
  expect(create).not.toHaveBeenCalled();
  validate.mockResolvedValue(true);
  const incoming = request(
    "/en-US/story",
    "HEAD",
    `${cookie}; lead_locale=en-US`,
  );
  const normal = await proxy(incoming);
  expect(normal.status).toBe(200);
  expect(
    normal.headers.has(
      `x-middleware-request-${DEGRADED_PUBLIC_DOCUMENT_HEADER}`,
    ),
  ).toBe(false);
  const headers = new Headers(incoming.headers);
  expect(forwardDegradedPublicDocument(headers, normal)).toBe(false);
  expect(headers.has(DEGRADED_PUBLIC_DOCUMENT_HEADER)).toBe(false);
});

it("bounds a cold geo lookup before the insert starts", async () => {
  captureErrors();
  spyOn(geo, "geoCountryForIp").mockReturnValue(new Promise(() => undefined));
  const create = spyOn(leadOps, "createAnonymousLead");
  const start = performance.now();
  const response = await createLeadId(
    request("/en-US/story"),
    defaultLocale,
    start + 30,
  );
  expect(response.status).toBe(200);
  expect(performance.now() - start).toBeLessThan(500);
  expect(create).not.toHaveBeenCalled();
});
