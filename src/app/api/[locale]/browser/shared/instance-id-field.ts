/**
 * Shared instanceId request field for browser tools.
 * CLI-only: hidden from all other platforms.
 * Non-CLI platforms resolve the instance ID in the repository.
 */

import { z } from "zod";

import { requestField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";

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
