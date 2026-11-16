/**
 * Incognito threads: execute-tool must stay callable. It is in the default
 * incognito tool set and the only way the AI reaches discoverable tools
 * (generate_image, rename-thread); denying it made "generate an image" fail
 * with Forbidden in every incognito chat (prod 2026-11-14/16). The tools it
 * must not reach are still refused per TARGET.
 */

import { describe, expect, it } from "bun:test";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { EXECUTE_TOOL_ALIAS } from "next-vibe/execute-tool/constants";
import { ExecuteToolGuards } from "next-vibe/execute-tool/repository/guards";

import { CORTEX_READ_ALIAS } from "../cortex/constants";
import { IMAGE_GEN_ALIAS } from "../image-generation/constants";
import {
  FOLDER_BLOCKED_CALLBACK_MODES,
  FOLDER_DENIED_TOOL_IDS,
} from "./config";

const incognito = {
  availableTools: null,
  deniedToolIds: new Set(FOLDER_DENIED_TOOL_IDS[DefaultFolderId.INCOGNITO]),
};

describe("incognito tool permissions", () => {
  it("lets the AI call execute-tool and media tools", () => {
    expect(
      ExecuteToolGuards.checkToolPermission(EXECUTE_TOOL_ALIAS, incognito),
    ).toBeNull();
    expect(
      ExecuteToolGuards.checkToolPermission(IMAGE_GEN_ALIAS, incognito),
    ).toBeNull();
  });

  it("still refuses server-side-only targets and async callback modes", () => {
    expect(
      ExecuteToolGuards.checkToolPermission(CORTEX_READ_ALIAS, incognito),
    ).toBe("denied");
    expect(
      ExecuteToolGuards.checkToolPermission("execute-task", incognito),
    ).toBe("denied");
    expect(FOLDER_BLOCKED_CALLBACK_MODES[DefaultFolderId.INCOGNITO]).toEqual([
      "detach",
      "wakeUp",
    ]);
  });
});
