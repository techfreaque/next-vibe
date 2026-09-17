/**
 * Shared instanceId request field for browser tools.
 *
 * Available on every platform, including MCP. Without an explicit
 * instanceId, `BrowserRepository.executeTool` (repository.ts) falls back to
 * `loggerEnv.VIBE_PID` for any non-CLI caller - a single constant for the
 * whole server process, so every MCP connection shares one tab by default.
 * That's fine for a single interactive session, but concurrent MCP callers
 * (e.g. several agents in the same session) that skip this field will steal
 * each other's active tab mid-navigation. Any caller - CLI or MCP - that
 * passes a unique value here gets its own isolated tab instead.
 *
 * (Previously hidden for MCP via `hiddenForPlatforms: [Platform.MCP]`, on
 * the assumption that MCP already isolated sessions per connection. It
 * doesn't - see the shared VIBE_PID fallback above - so hiding this field
 * only removed the one way an MCP caller could opt into isolation.)
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
    Platform.REMOTE_SKILL,
    Platform.TRPC,
    Platform.NEXT_PAGE,
    Platform.CRON,
    Platform.ELECTRON,
    Platform.FRAME,
  ],
});
