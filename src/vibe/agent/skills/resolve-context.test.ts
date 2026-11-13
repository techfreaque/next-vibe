import { describe, expect, it } from "bun:test";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import { THREAD_RENAME_ALIAS } from "../chat/threads/rename/constants";
import { resolveAgentContext } from "./resolve-context";

describe("resolveAgentContext housekeeping tools", () => {
  it("keeps rename-thread callable through a skill's availableTools whitelist", async () => {
    const result = await resolveAgentContext({
      skillId: "research-agent",
      skillFavoriteContext: { favorite: null, skill: null, customSkill: null },
      user: {
        isPublic: true,
        leadId: "00000000-0000-4000-8000-000000000001",
        roles: [UserPermissionRole.PUBLIC],
      },
      rootFolderId: DefaultFolderId.PRIVATE,
      logger: createEndpointLogger(false, defaultLocale),
    });
    expect(result.availableTools).not.toBeNull();
    expect(
      result.availableTools?.some((t) => t.toolId === THREAD_RENAME_ALIAS),
    ).toBe(true);
  });
});
