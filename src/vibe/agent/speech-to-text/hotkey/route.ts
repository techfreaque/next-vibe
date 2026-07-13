/**
 * Speech-to-Text Hotkey Route Handler
 * Handles CLI-triggered hotkey-based speech-to-text with daemon mode
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { SttHotkeyRepository } from "./repository";

/**
 * Export route handler and tools
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t }) =>
      SttHotkeyRepository.handleHotkeyAction(data, user, locale, logger, t),
  },
});
