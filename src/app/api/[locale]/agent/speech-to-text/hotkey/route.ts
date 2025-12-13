/**
 * Speech-to-Text Hotkey Route Handler
 * Handles CLI-triggered hotkey-based speech-to-text with daemon mode
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { startHotkeyDaemon } from "./daemon";
import endpoints from "./definition";
import { HotkeyAction } from "./enum";
import { sttHotkeyRepository } from "./repository";

/**
 * Export route handler and tools
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      // Regular API call with explicit action
      if (data.action) {
        return await sttHotkeyRepository.handleHotkeyAction(
          data,
          user,
          locale,
          logger,
        );
      }

      // No action provided - start daemon mode (for CLI usage)
      logger.info(
        "Starting STT hotkey daemon (press Ctrl+Shift+Space to toggle)",
      );

      // Start daemon that never returns
      // This will keep the CLI running and listening for hotkeys
      return await startHotkeyDaemon(logger, async () => {
        // Toggle STT on hotkey press
        await sttHotkeyRepository.handleHotkeyAction(
          { ...data, action: HotkeyAction.TOGGLE },
          user,
          locale,
          logger,
        );
      });
    },
  },
});
