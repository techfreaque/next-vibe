/**
 * chat-settings server access.
 *
 * `allowedClientRoles: [PUBLIC]` routes a public caller to the CLIENT handler
 * (browser storage). The server permission check used to honor it too, so a
 * public caller (failed/garbage bearer falls back to a public payload) reached
 * `upsertSettings` with no `user.id`: NOT NULL violation on chat_settings.user_id,
 * 500 (prod 2026-11-16, pentester script). Server execution must answer 403.
 */

import { permissionsRegistry } from "next-vibe/core/permissions/registry";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type {
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { beforeAll, describe, expect, it } from "vitest";

import definitions from "./definition";

const TEST_TIMEOUT = 60_000;

describe("chat-settings server access", () => {
  let adminUser: JwtPrivatePayloadType;
  let publicUser: JWTPublicPayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
    publicUser = {
      isPublic: true,
      leadId: adminUser.leadId,
      roles: [UserPermissionRole.PUBLIC],
    };
  });

  it("client-route roles never authorize server execution", () => {
    expect(
      permissionsRegistry.validateEndpointAccess(
        definitions.POST,
        publicUser,
        Platform.NEXT_API,
      ).allowed,
    ).toBe(false);
    // A client-side definition load may still render it for the client route.
    expect(
      permissionsRegistry.validateEndpointAccess(
        definitions.POST,
        publicUser,
        Platform.NEXT_API,
        { clientRoute: true },
      ).allowed,
    ).toBe(true);
    expect(
      permissionsRegistry.filterEndpointsByPermissions(
        [definitions.GET, definitions.POST],
        publicUser,
        Platform.AI,
      ),
    ).toHaveLength(0);
  });

  it(
    "public POST with an empty payload is 403, not a 500",
    async () => {
      const response = await sendTestRequest({
        endpoint: definitions.POST,
        data: {},
        user: publicUser,
        toolExecutionContext: undefined,
      });
      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.errorType).toBe(ErrorResponseTypes.FORBIDDEN);
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "public GET is 403",
    async () => {
      const response = await sendTestRequest({
        endpoint: definitions.GET,
        user: publicUser,
        toolExecutionContext: undefined,
      });
      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.errorType).toBe(ErrorResponseTypes.FORBIDDEN);
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "private user with an empty payload saves nothing and succeeds",
    async () => {
      const before = await sendTestRequest({
        endpoint: definitions.GET,
        user: adminUser,
        toolExecutionContext: undefined,
      });
      expect(before.success).toBe(true);

      const response = await sendTestRequest({
        endpoint: definitions.POST,
        data: {},
        user: adminUser,
        toolExecutionContext: undefined,
      });
      expect(response.success).toBe(true);

      const after = await sendTestRequest({
        endpoint: definitions.GET,
        user: adminUser,
        toolExecutionContext: undefined,
      });
      expect(after.success).toBe(true);
      if (before.success && after.success) {
        expect(after.data.selectedModel).toBe(before.data.selectedModel);
        expect(after.data.selectedSkill).toBe(before.data.selectedSkill);
        expect(after.data.dreamerEnabled).toBe(before.data.dreamerEnabled);
      }
    },
    TEST_TIMEOUT,
  );
});
