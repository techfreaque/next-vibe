import { describe, expect, it } from "bun:test";

import { defaultLocale } from "../core/i18n/core/config";
import healthDefinition from "../platforms/web/health/definition";
import { RemoteTransport } from "./transport";

describe("Remote HTTP transport", () => {
  it("sends GET input in the query string without a request body", async () => {
    const server = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      fetch(request) {
        const url = new URL(request.url);
        expect(url.pathname).toBe(
          `/api/${defaultLocale}/vibe/platforms/web/health`,
        );
        expect(url.searchParams.get("detailed")).toBe("true");
        expect(url.searchParams.get("includeDatabase")).toBe("false");
        expect(request.body).toBeNull();
        return Response.json({ success: true, data: {} });
      },
    });

    try {
      const result = await RemoteTransport.callEndpointDirect({
        connection: { remoteUrl: server.url.origin, token: "test-token" },
        definition: healthDefinition.GET,
        locale: defaultLocale,
        input: {
          detailed: true,
          includeDatabase: false,
          includeTasks: false,
          includeSystem: false,
        },
      });
      expect(result.networkError).toBe(false);
      expect(result.status).toBe(200);
    } finally {
      await server.stop(true);
    }
  });
});

describe("Remote session rejection", () => {
  it("recognizes an explicit authentication failure", () => {
    expect(RemoteTransport.isSessionRejected(401, undefined)).toBe(true);
  });

  it("recognizes legacy public authorization denials", () => {
    expect(
      RemoteTransport.isSessionRejected(
        403,
        "User public lacks required roles: Customer, Admin (has: Public)",
      ),
    ).toBe(true);
  });

  it("keeps authenticated denials, network errors and server failures retryable", () => {
    expect(
      RemoteTransport.isSessionRejected(
        403,
        "User account-id lacks required roles: Admin (has: Customer)",
      ),
    ).toBe(false);
    expect(RemoteTransport.isSessionRejected(403, undefined)).toBe(false);
    expect(RemoteTransport.isSessionRejected(0, undefined)).toBe(false);
    expect(RemoteTransport.isSessionRejected(503, undefined)).toBe(false);
  });
});
