"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Wrench } from "next-vibe-ui/ui/icons/Wrench";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React from "react";

import { getDefaultToolIds } from "@/app/api/[locale]/agent/chat/constants";
import type { EnabledTool } from "@/app/api/[locale]/agent/chat/hooks/store";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import { useToolsModalStore } from "@/app/api/[locale]/agent/tools/store";
import {
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ToolsButtonProps {
  disabled?: boolean;
  locale: CountryLanguage;
  /** Optional: pass enabledTools directly to use outside ChatBootProvider */
  enabledTools?: EnabledTool[] | null;
}

/**
 * Tools Button Component
 * Shows the number of active tools and opens the tool selector modal.
 * Works both inside ChatBootProvider (reads settings) and standalone (via props).
 */
export function ToolsButton({
  disabled = false,
  locale,
  enabledTools: enabledToolsProp,
}: ToolsButtonProps): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { settings } = useChatSettings(user, logger);
  const defaults = ChatSettingsRepositoryClient.getDefaults();
  const effectiveSettings = settings ?? defaults;

  // Compute enabledTools from settings (same logic as the old useChat hook)
  const computedEnabledTools = React.useMemo((): EnabledTool[] | null => {
    const { allowedTools, pinnedTools } = effectiveSettings;
    if (allowedTools === null && pinnedTools === null) {
      return null;
    }
    const allIds = new Set([
      ...(allowedTools ?? []).map((t) => t.toolId),
      ...(pinnedTools ?? []).map((t) => t.toolId),
    ]);
    return [...allIds].map((id) => {
      const allowed = allowedTools?.find((t) => t.toolId === id);
      const pinned = pinnedTools?.find((t) => t.toolId === id);
      return {
        id,
        requiresConfirmation:
          allowed?.requiresConfirmation ??
          pinned?.requiresConfirmation ??
          false,
        pinned:
          pinnedTools !== null
            ? pinnedTools.some((t) => t.toolId === id)
            : true,
      };
    });
  }, [effectiveSettings]);

  const enabledTools = enabledToolsProp ?? computedEnabledTools;
  const openToolsModal = useToolsModalStore((state) => state.open);
  // null = default: DEFAULT_TOOL_IDS are pinned (active)
  // customized: count tools with active=true
  const activeToolCount = enabledTools
    ? enabledTools.filter((tool) => tool.pinned).length
    : getDefaultToolIds().length;
  const { t } = simpleT(locale);

  return (
    <Button
      type="button"
      onClick={openToolsModal}
      disabled={disabled}
      variant="outline"
      size="sm"
      className={cn(
        "relative inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 h-8 sm:h-9 px-1.5 sm:px-2 md:px-3",
        activeToolCount > 0 && "border-primary/50 bg-primary/5",
      )}
      title={t("app.chat.toolsButton.title")}
    >
      <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <Span className="hidden @2xl:inline text-xs">
        {t("app.chat.toolsButton.tools")}
      </Span>
      {activeToolCount > 0 && (
        <Badge
          variant="default"
          className="h-4 min-w-4 sm:h-5 sm:min-w-5 px-1 sm:px-1.5 text-[10px] sm:text-xs font-medium bg-primary text-primary-foreground"
        >
          {activeToolCount}
        </Badge>
      )}
    </Button>
  );
}
