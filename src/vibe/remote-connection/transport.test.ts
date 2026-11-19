import { describe, expect, it } from "bun:test";

import { RemoteTransport } from "./transport";

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
