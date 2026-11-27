import { describe, expect, it } from "bun:test";

import type { EndpointMeta } from "../../../core/definition/endpoints-meta";
import type { JwtPayloadType } from "../../../identity/auth/types";
import { UserPermissionRole } from "../../../identity/roles/enum";
import {
  isAiToolEnabled,
  isToolDiscoverable,
  isToolPinnedByDefault,
  mergeWebPins,
  normalizeToolPreferences,
  withToolPreference,
} from "./tool-preferences";

const tool: EndpointMeta = {
  toolName: "fixture-tool",
  method: "GET",
  path: ["fixture"],
  allowedRoles: [UserPermissionRole.ADMIN],
  aliases: ["fixture-tool"],
  title: "Fixture",
  titleShort: "Fixture",
  description: "A fixture tool",
  icon: "search",
  category: "test",
  subCategory: "",
  tags: [],
};

describe("tool navigation preferences", () => {
  it("merges sparse choices over the legacy list without replacing other surfaces", () => {
    const prefs = withToolPreference(
      withToolPreference(
        {},
        { key: "webPins", toolId: "fixture-tool", value: false },
      ),
      { key: "chatPins", toolId: "fixture-tool", value: true },
    );
    expect(
      mergeWebPins(["fixture-tool", "retired-tool"], prefs.webPins),
    ).toEqual(["retired-tool"]);
    expect(mergeWebPins([], prefs.webPins)).toEqual([]);
    expect(mergeWebPins(["new-default"], prefs.webPins)).toEqual([
      "new-default",
    ]);
    expect(prefs.chatPins?.["fixture-tool"]).toBe(true);
  });

  it("normalizes role-independent alias preferences without dropping removed IDs", () => {
    const prefs = normalizeToolPreferences({
      webHidden: { "import-leads": true, "retired-tool": true },
    });
    expect(prefs.webHidden).toEqual({
      "leads-import": true,
      "retired-tool": true,
    });
  });

  it("inherits category placement and allows an explicit endpoint override", () => {
    const category = { web: false, chat: true, aiEnabled: false };
    expect(isToolDiscoverable(tool, category, "web")).toBe(false);
    expect(isToolDiscoverable(tool, category, "chat")).toBe(true);
    expect(
      isToolDiscoverable(
        { ...tool, admin: { hidden: true } },
        { web: true },
        "web",
      ),
    ).toBe(false);
    expect(
      isToolDiscoverable(
        { ...tool, admin: { hidden: true }, navigation: { web: true } },
        category,
        "web",
      ),
    ).toBe(true);
    expect(isAiToolEnabled(tool, category, {})).toBe(false);
    expect(
      isAiToolEnabled(tool, category, { aiEnabled: { "fixture-tool": true } }),
    ).toBe(true);
    expect(
      isAiToolEnabled({ ...tool, navigation: { aiEnabled: true } }, category, {
        aiEnabled: { "fixture-tool": false },
      }),
    ).toBe(false);
  });

  it("applies role defaults with explicit empty endpoint pins", () => {
    const viewer: JwtPayloadType = {
      id: "user",
      leadId: "lead",
      isPublic: false,
      roles: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    };
    const category = { defaultWebPinned: [UserPermissionRole.ADMIN] };
    expect(isToolPinnedByDefault(tool, category, "web", viewer)).toBe(true);
    expect(
      isToolPinnedByDefault(
        { ...tool, defaultWebPinned: [] },
        category,
        "web",
        viewer,
      ),
    ).toBe(false);
    expect(isToolPinnedByDefault(tool, category, "chat", viewer)).toBe(false);
  });
});
