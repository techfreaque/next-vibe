/**
 * Speech-to-Text Hotkey Route Handler
 * Handles CLI-triggered hotkey-based speech-to-text with daemon mode
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { SttHotkeyRepository } from "./repository";

/**
 * Export route handler and tools
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      SttHotkeyRepository.handleHotkeyAction(data, user, locale, logger),
  },
});
