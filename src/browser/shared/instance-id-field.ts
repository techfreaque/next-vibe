/**
 * Shared instanceId request field for browser tools.
 * CLI-only: hidden from all other platforms.
 * Non-CLI platforms resolve the instance ID in the repository.
 */

import { FieldDataType, WidgetType } from "next-vibe/core/definition/enums";
import { Platform } from "next-vibe/platforms/platforms";
import { requestField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";

export const browserInstanceIdField = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "shared.instanceId.label",
  description: "shared.instanceId.description",
  placeholder: "shared.instanceId.placeholder",
  columns: 12,
  schema: z
    .string()
    .optional()
    .describe(
      "Browser session ID. Each unique ID gets its own isolated tab. Leave empty to use the default session.",
    ),
  hiddenForPlatforms: [
    Platform.AI,
    Platform.MCP,
    Platform.REMOTE_SKILL,
    Platform.TRPC,
    Platform.NEXT_PAGE,
    Platform.CRON,
    Platform.ELECTRON,
    Platform.FRAME,
  ],
});
