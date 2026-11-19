/**
 * CSRF rules: double-submit token, Fetch Metadata same-origin fallback,
 * cross-site cookie rejection and the Bearer-only skip.
 */

import { describe, expect, it } from "bun:test";
import { NextRequest } from "next-vibe/ui/lib/request";

import {
  AUTH_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/env/constants";

import { Methods } from "../definition/enums";
import { validateCsrf } from "./csrf";

const TOKEN = "a".repeat(32);
const SESSION_COOKIES = `${CSRF_TOKEN_COOKIE_NAME}=${TOKEN}; ${LEAD_ID_COOKIE_NAME}=lead; ${AUTH_TOKEN_COOKIE_NAME}=jwt`;

function req(headers: Record<string, string>): NextRequest {
  return new NextRequest(
    new URL("/api/en-US/leads/tracking", "https://unbottled.ai"),
    { method: "POST", headers },
  );
}

describe("validateCsrf", () => {
  it("accepts a matching token", () => {
    expect(
      validateCsrf(
        req({ cookie: SESSION_COOKIES, [CSRF_TOKEN_HEADER_NAME]: TOKEN }),
        Methods.POST,
      ),
    ).toEqual({ valid: true, checked: true });
  });

  it("accepts same-origin Fetch Metadata without a token", () => {
    expect(
      validateCsrf(
        req({ cookie: SESSION_COOKIES, "sec-fetch-site": "same-origin" }),
        Methods.POST,
      ),
    ).toEqual({
      valid: true,
      checked: true,
      fetchMetadataFallback: "csrf_header_missing",
    });
  });

  it("accepts same-origin Fetch Metadata with a stale token", () => {
    expect(
      validateCsrf(
        req({
          cookie: SESSION_COOKIES,
          "sec-fetch-site": "same-origin",
          [CSRF_TOKEN_HEADER_NAME]: "b".repeat(32),
        }),
        Methods.POST,
      ),
    ).toEqual({
      valid: true,
      checked: true,
      fetchMetadataFallback: "csrf_token_mismatch",
    });
  });

  it("rejects a missing token when Fetch Metadata is absent", () => {
    expect(
      validateCsrf(req({ cookie: SESSION_COOKIES }), Methods.POST),
    ).toEqual({ valid: false, reason: "csrf_header_missing" });
  });

  it("rejects a mismatched token when Fetch Metadata is absent", () => {
    expect(
      validateCsrf(
        req({
          cookie: SESSION_COOKIES,
          [CSRF_TOKEN_HEADER_NAME]: "b".repeat(32),
        }),
        Methods.POST,
      ),
    ).toEqual({ valid: false, reason: "csrf_token_mismatch" });
  });

  it("rejects same-site (subdomain) and none without a token", () => {
    for (const site of ["same-site", "none"]) {
      expect(
        validateCsrf(
          req({ cookie: SESSION_COOKIES, "sec-fetch-site": site }),
          Methods.POST,
        ),
      ).toEqual({ valid: false, reason: "csrf_header_missing" });
    }
  });

  it("rejects cross-site requests carrying session cookies, even with a token or bearer", () => {
    const crossSite: Record<string, string>[] = [
      { cookie: SESSION_COOKIES, "sec-fetch-site": "cross-site" },
      {
        cookie: `${AUTH_TOKEN_COOKIE_NAME}=jwt`,
        "sec-fetch-site": "cross-site",
      },
      {
        cookie: `${LEAD_ID_COOKIE_NAME}=lead`,
        "sec-fetch-site": "cross-site",
        authorization: "Bearer junk",
      },
    ];
    for (const headers of crossSite) {
      expect(validateCsrf(req(headers), Methods.POST)).toEqual({
        valid: false,
        reason: "csrf_cross_site",
      });
    }
  });

  it("allows cross-site requests without our cookies (embed mount call)", () => {
    expect(
      validateCsrf(req({ "sec-fetch-site": "cross-site" }), Methods.POST),
    ).toEqual({ valid: true, checked: false });
  });

  it("skips the token for Bearer auth but not for other Authorization schemes", () => {
    expect(
      validateCsrf(
        req({ cookie: SESSION_COOKIES, authorization: "Bearer jwt" }),
        Methods.POST,
      ),
    ).toEqual({ valid: true, checked: false });
    expect(
      validateCsrf(
        req({ cookie: SESSION_COOKIES, authorization: "Basic x" }),
        Methods.POST,
      ),
    ).toEqual({ valid: false, reason: "csrf_header_missing" });
  });

  it("allows clients without a csrf cookie (CLI, MCP, server)", () => {
    expect(validateCsrf(req({}), Methods.POST)).toEqual({
      valid: true,
      checked: false,
    });
  });

  it("does not check safe methods", () => {
    expect(
      validateCsrf(
        req({ cookie: SESSION_COOKIES, "sec-fetch-site": "cross-site" }),
        Methods.GET,
      ),
    ).toEqual({ valid: true, checked: false });
  });
});
