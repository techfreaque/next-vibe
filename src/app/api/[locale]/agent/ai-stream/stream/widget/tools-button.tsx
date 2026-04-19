"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Wrench } from "next-vibe-ui/ui/icons/Wrench";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useMemo } from "react";

import type { EnabledTool } from "@/app/api/[locale]/agent/chat/hooks/store";
import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { useToolsModalStore } from "@/app/api/[locale]/agent/tools/store";
import {
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { CountryLanguage } from "@/i18n/core/config";
import { scopedTranslation as aiStreamScopedTranslation } from "../i18n";

interface ToolsButtonProps {
  disabled?: boolean;
  locale: CountryLanguage;
  /** Pass enabledTools to show the actual count of available tools.
   *  When null/undefined, resolves from help endpoint. */
  enabledTools?: EnabledTool[] | null;
}

/**
 * Tools Button Component
 * Shows the number of available tools and opens the tool selector modal.
 *
 * Count shows total available tools for the user (role-filtered).
 * When enabledTools is passed: shows enabledTools.length
 * When not passed: reads totalCount from help endpoint (all tools available to user's role)
 */
export function ToolsButton({
  disabled = false,
  locale,
  enabledTools: enabledToolsProp,
}: ToolsButtonProps): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const openToolsModal = useToolsModalStore((state) => state.open);

  // Fetch tool count from help endpoint — cached with long staleTime
  const helpEndpoint = useEndpoint(
    helpDefinitions,
    useMemo(
      () => ({
        read: {
          queryOptions: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
      [],
    ),
    logger,
    user,
  );

  const totalToolCount = helpEndpoint.read?.data?.totalCount ?? 0;

  const activeToolCount = useMemo(() => {
    if (enabledToolsProp) {
      return enabledToolsProp.length;
    }
    return totalToolCount;
  }, [enabledToolsProp, totalToolCount]);

  const { t } = aiStreamScopedTranslation.scopedT(locale);

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
      title={t("toolsButton.title")}
    >
      <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <Span className="hidden @2xl:inline text-xs">
        {t("toolsButton.tools")}
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
