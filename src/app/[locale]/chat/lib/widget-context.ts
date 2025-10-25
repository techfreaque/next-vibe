/**
 * Widget Context Helper
 * Creates WidgetRenderContext for rendering tool results in chat
 */

"use client";

import type { WidgetRenderContext } from "@/app/api/[locale]/v1/core/system/unified-ui/shared/widgets/types";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Create widget render context for chat UI
 */
export function createChatWidgetContext(
  locale: CountryLanguage,
  theme: "light" | "dark" = "dark",
  permissions: readonly string[] = [],
): WidgetRenderContext {
  return {
    locale,
    isInteractive: true,
    permissions,
    platform: "web",
    theme,
    onNavigate: (url: string): void => {
      // Open links in new tab
      // eslint-disable-next-line i18next/no-literal-string
      window.open(url, "_blank", "noopener,noreferrer");
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    onAction: async (action): Promise<void> => {
      // Handle widget actions (e.g., retry, edit, delete)
      // eslint-disable-next-line no-console, i18next/no-literal-string
      console.log("[Chat Widget] Action triggered:", action);
      // TODO: Implement action handlers when needed
    },
  };
}
