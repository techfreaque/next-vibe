import { describe, expect, it } from "bun:test";

import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "../../../core/execution-context";
import { defaultLocale } from "../../../core/i18n/core/config";
import { ExecuteToolGuards } from "../../../execute-tool/repository/guards";
import { HelpRepository } from "../../../help-tool/repository";
import { createEndpointLogger } from "../../../logger/server";
import { Platform } from "../../../platforms/platforms";
import { createE2ECreditUser } from "../../ai-stream/testing/e2e-credit-user";
import { resolveAgentContext } from "../../skills/resolve-context";
import { WEB_SEARCH_ALIAS } from "../../web-search/constants";
import { scopedTranslation } from "./i18n";
import { ChatSettingsRepository } from "./repository";
import type { ToolPreferencePatch } from "./tool-preferences";

describe("persisted tool preferences", () => {
  it("merges concurrent changes and applies the AI choice in help and execution", async () => {
    const account = await createE2ECreditUser("tool-preferences", 0);
    const { user } = account;
    const logger = createEndpointLogger(false, defaultLocale);
    const { t } = scopedTranslation.scopedT(defaultLocale);
    const write = (
      toolPreference: ToolPreferencePatch,
    ): ReturnType<typeof ChatSettingsRepository.upsertSettings> =>
      ChatSettingsRepository.upsertSettings(
        { toolPreference, turnStepLimit: undefined },
        user,
        logger,
        t,
      );

    try {
      const results = await Promise.all([
        write({ toolId: WEB_SEARCH_ALIAS, key: "webHidden", value: true }),
        write({ toolId: WEB_SEARCH_ALIAS, key: "chatPins", value: true }),
        write({ toolId: WEB_SEARCH_ALIAS, key: "aiEnabled", value: false }),
      ]);
      expect(results.every((result) => result.success)).toBe(true);
      const settings = await ChatSettingsRepository.getSettings(
        user,
        logger,
        t,
      );
      expect(settings.success && settings.data.toolPreferences).toMatchObject({
        webHidden: { [WEB_SEARCH_ALIAS]: true },
        chatPins: { [WEB_SEARCH_ALIAS]: true },
        aiEnabled: { [WEB_SEARCH_ALIAS]: false },
      });

      const context = await resolveAgentContext({
        user,
        rootFolderId: DefaultFolderId.PRIVATE,
        logger,
      });
      expect(
        ExecuteToolGuards.checkToolPermission(WEB_SEARCH_ALIAS, context),
      ).toBe("denied");
      const discovery = await HelpRepository.getTools(
        { query: WEB_SEARCH_ALIAS, page: undefined, pageSize: 10 },
        user,
        defaultLocale,
        Platform.AI,
        logger,
        rootlessToolExecutionContext(),
      );
      expect(discovery.success).toBe(true);
      expect(
        discovery.success &&
          discovery.data.tools.some(({ name }) => name === WEB_SEARCH_ALIAS),
      ).toBe(false);

      const legacyWrite = await ChatSettingsRepository.upsertSettings(
        { webPinnedTools: [], turnStepLimit: undefined },
        user,
        logger,
        t,
      );
      expect(legacyWrite.success).toBe(true);
      const saved = await ChatSettingsRepository.getSettings(user, logger, t);
      expect(saved.success && saved.data.webPinnedTools).toEqual([]);
      expect(
        saved.success &&
          saved.data.toolPreferences?.chatPins?.[WEB_SEARCH_ALIAS],
      ).toBe(true);
    } finally {
      await account.remove();
    }
  }, 30_000);
});
