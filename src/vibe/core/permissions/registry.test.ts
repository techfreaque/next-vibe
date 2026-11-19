import { describe, expect, it } from "bun:test";

import { UserRole } from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";
import { permissionsRegistry } from "./registry";

describe("Cron access for web-disabled endpoints", () => {
  it("requires the endpoint to opt in", () => {
    expect(
      permissionsRegistry.checkPlatformAccess(
        [UserRole.ADMIN, UserRole.WEB_OFF],
        Platform.CRON,
      ).allowed,
    ).toBe(false);
  });

  it("admits a cron opt-in and preserves the web restriction", () => {
    const roles = [UserRole.ADMIN, UserRole.WEB_OFF, UserRole.CRON_ALLOWED];
    expect(
      permissionsRegistry.checkPlatformAccess(roles, Platform.CRON).allowed,
    ).toBe(true);
    expect(
      permissionsRegistry.checkPlatformAccess(roles, Platform.NEXT_API).allowed,
    ).toBe(false);
  });
});
