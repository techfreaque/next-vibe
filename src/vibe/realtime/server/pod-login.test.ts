import { describe, expect, it } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { isPodLoginResource, requirePodLogin } from "./pod-login";

const logger = createEndpointLogger(false, defaultLocale);

describe("pod login boundary", () => {
  it("allows the login form and its endpoints with the correct methods", () => {
    expect(isPodLoginResource("GET", "/de-DE/user/login")).toBe(true);
    expect(isPodLoginResource("GET", "/_next/static/chunks/main.js")).toBe(true);
    expect(isPodLoginResource("GET", "/api/en-US/user/public/login/options")).toBe(true);
    expect(isPodLoginResource("POST", "/api/en-US/user/public/login")).toBe(true);
    expect(isPodLoginResource("GET", "/fr-FR/user/verify-email/header.signature")).toBe(true);
    expect(isPodLoginResource("POST", "/api/fr-FR/user/public/verify-email")).toBe(true);
    expect(isPodLoginResource("POST", "/en-US/user/login")).toBe(false);
    expect(isPodLoginResource("POST", "/api/en-US/user/public/signup")).toBe(false);
  });

  it("returns the visitor to the requested tool after login", async () => {
    const url = new URL("https://pod.example/pl-PL/tools?q=brave");
    const res = await requirePodLogin(new Request(url), url, logger);
    expect(res?.status).toBe(303);
    const target = new URL(res?.headers.get("location") ?? "", url);
    expect(target.pathname).toBe("/pl-PL/user/login");
    expect(target.searchParams.get("callbackUrl")).toBe("/pl-PL/tools?q=brave");
  });

  it("requires credentials for guest API calls and socket upgrades", async () => {
    const api = new URL("https://pod.example/api/en-US/vibe/help-tool");
    expect((await requirePodLogin(new Request(api), api, logger))?.status).toBe(401);
    const ws = new URL("https://pod.example/ws");
    const req = new Request(ws, { headers: { upgrade: "websocket" } });
    expect((await requirePodLogin(req, ws, logger))?.status).toBe(401);
  });
});
