import { z } from "zod";

export const DEFAULT_TURN_STEP_LIMIT = 50;
export const MIN_TURN_STEP_LIMIT = 5;
export const MAX_TURN_STEP_LIMIT = 500;
export const turnStepLimitSchema = z
  .number()
  .int()
  .min(MIN_TURN_STEP_LIMIT)
  .max(MAX_TURN_STEP_LIMIT);

export const CHAT_SETTINGS_GET_ALIAS = "chat-settings" as const;
export const CHAT_SETTINGS_UPDATE_ALIAS = "chat-settings-update" as const;
