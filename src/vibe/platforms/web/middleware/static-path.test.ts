/**
 * The static-file shortcut in the middleware must only 404 bare-root files
 * (/missing-icon.png). Locale-prefixed pages AND locale-prefixed API routes
 * with an extension (chat files: /api/{locale}/.../files/{threadId}/{id}.png)
 * must reach their route handler.
 */

import { describe, expect, it } from "bun:test";
import { NextRequest } from "next-vibe/ui/lib/request";

import { AUTH_TOKEN_COOKIE_NAME, LEAD_ID_COOKIE_NAME } from "@/env/constants";

import { coreEnv } from "../../../core/env";
import { Environment } from "../../../env/env-util";
import { middleware } from "./index";
import { applyResponseIdentityCookies } from "./utils";

const options = {
  supportedLocales: ["en-GLOBAL", "en-US", "de-DE", "pl-PL"] as const,
  defaultLocale: "en-GLOBAL" as const,
  allowMixedLocales: true,
};

async function statusFor(path: string): Promise<{
  status: number;
  passthrough: boolean;
}> {
  const res = await middleware(
    new NextRequest(new URL(path, "http://localhost:3000")),
    { ...options, supportedLocales: [...options.supportedLocales] },
  );
  return {
    status: res.status,
    passthrough: res.headers.get("x-middleware-next") === "1",
  };
}

describe("middleware static-file shortcut", () => {
  it("passes chat files under /api/{locale}/ through to the handler", async () => {
    const r = await statusFor(
      "/api/en-GLOBAL/vibe/agent/chat/threads/files/0f3994b5-958f-41cf-984d-7bcc6bc8be50/60c1684f-c488-4d6d-9269-57636ce36684.png",
    );
    expect(r.passthrough).toBe(true);
    expect(r.status).not.toBe(404);
  });

  it("passes locale-prefixed files through", async () => {
    expect((await statusFor("/en-US/files/thread/image.png")).passthrough).toBe(
      true,
    );
  });

  it("still 404s bare-root files with no static match", async () => {
    expect((await statusFor("/missing-icon.png")).status).toBe(404);
  });

  it("does not localize missing Vite source modules in development", async () => {
    const result = await statusFor("/src/moved-module.tsx?t=12");
    expect(result.status).toBe(
      coreEnv.NODE_ENV === Environment.DEVELOPMENT ? 404 : 307,
    );
  });
});

describe("middleware identity cookies", () => {
  it("gives the current render the same new lead as the next browser request", () => {
    const headers = new Headers({
      cookie: `layout=wide; ${LEAD_ID_COOKIE_NAME}=old`,
    });
    applyResponseIdentityCookies(headers, [
      `${LEAD_ID_COOKIE_NAME}=new; Path=/; HttpOnly`,
      `${AUTH_TOKEN_COOKIE_NAME}=session; Path=/; HttpOnly`,
      "layout=compact; Path=/",
    ]);
    expect(headers.get("cookie")).toBe(
      `layout=wide; ${LEAD_ID_COOKIE_NAME}=new; ${AUTH_TOKEN_COOKIE_NAME}=session`,
    );
  });
});
