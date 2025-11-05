"use client";

import { Button } from "next-vibe-ui//ui/button";
import { Div } from "next-vibe-ui//ui/div";
import { P } from "next-vibe-ui//ui/typography";
import { Tooltip } from "next-vibe-ui//ui/tooltip";
import { TooltipContent } from "next-vibe-ui//ui/tooltip";
import { TooltipProvider } from "next-vibe-ui//ui/tooltip";
import { TooltipTrigger } from "next-vibe-ui//ui/tooltip";
import type { JSX } from "react";
import React, { useCallback } from "react";

import {
  DEFAULT_FOLDER_CONFIGS,
  DEFAULT_FOLDER_IDS,
  isDefaultFolderId,
} from "@/app/api/[locale]/v1/core/agent/chat/config";
import { getIconComponent } from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface RootFolderBarProps {
  activeFolderId: string | null;
  locale: CountryLanguage;
  onSelectFolder: (folderId: string) => void;
  isAuthenticated: boolean;
}

/**
 * Get color classes for a folder based on its color
 */
/* eslint-disable i18next/no-literal-string */
function getColorClasses(color: string | null, isActive: boolean): string {
  if (!color) {
    return isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent";
  }

  // Map color names to Tailwind classes (softer colors)
  const colorMap: Record<string, { active: string; hover: string }> = {
    sky: {
      active:
        "bg-sky-500/15 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20",
      hover: "hover:bg-sky-500/10 hover:text-sky-600",
    },
    teal: {
      active:
        "bg-teal-500/15 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20",
      hover: "hover:bg-teal-500/10 hover:text-teal-600",
    },
    amber: {
      active:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20",
      hover: "hover:bg-amber-500/10 hover:text-amber-600",
    },
    purple: {
      active:
        "bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20",
      hover: "hover:bg-purple-500/10 hover:text-purple-600",
    },
    zinc: {
      active:
        "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-500/20",
      hover: "hover:bg-zinc-500/10 hover:text-zinc-600",
    },
  };

  const classes = colorMap[color];
  if (!classes) {
    return isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent";
  }

  return isActive ? classes.active : classes.hover;
}

/**
 * Get tooltip color classes based on folder color
 */
function getTooltipColorClasses(color: string | null): string {
  if (!color) {
    return "";
  }

  const tooltipColorMap: Record<string, string> = {
    sky: "bg-sky-600 text-white border-sky-500",
    teal: "bg-teal-600 text-white border-teal-500",
    amber: "bg-amber-600 text-white border-amber-500",
    purple: "bg-purple-600 text-white border-purple-500",
    zinc: "bg-zinc-600 text-white border-zinc-500",
  };

  return tooltipColorMap[color] || "";
}
/* eslint-enable i18next/no-literal-string */

export function RootFolderBar({
  activeFolderId,
  locale,
  onSelectFolder,
  isAuthenticated,
}: RootFolderBarProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get root folders from DEFAULT_FOLDER_CONFIGS
  // Show all folders to all users, but disable PRIVATE and SHARED for public users
  const rootFolders = DEFAULT_FOLDER_CONFIGS;

  // Check if a folder is accessible to the current user
  const isFolderAccessible = useCallback(
    (folderId: string): boolean => {
      if (isAuthenticated) {
        return true; // Authenticated users can access all folders
      }
      // Public users can only access PUBLIC and INCOGNITO folders
      return (
        folderId === DEFAULT_FOLDER_IDS.PUBLIC ||
        folderId === DEFAULT_FOLDER_IDS.INCOGNITO
      );
    },
    [isAuthenticated],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      const folderId = event.currentTarget.dataset.folderId;
      if (folderId && isDefaultFolderId(folderId)) {
        // Only allow navigation if folder is accessible
        if (isFolderAccessible(folderId)) {
          onSelectFolder(folderId);
        }
      }
    },
    [onSelectFolder, isFolderAccessible],
  );

  return (
    <Div className="overflow-x-auto">
      <Div className="flex items-center gap-1 px-3 py-2 min-w-max">
        <TooltipProvider delayDuration={300}>
          {rootFolders.map((folderConfig) => {
            const FolderIcon = getIconComponent(folderConfig.icon);
            const folderDisplayName = t(folderConfig.translationKey);
            const isActive = folderConfig.id === activeFolderId;
            const folderColor = folderConfig.color;
            const isAccessible = isFolderAccessible(folderConfig.id);
            const colorClasses = getColorClasses(folderColor, isActive);

            const tooltipColorClasses = getTooltipColorClasses(folderColor);

            const folderDescription = t(folderConfig.descriptionKey);

            return (
              <Tooltip key={folderConfig.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-11 w-11 ${colorClasses}`}
                    data-folder-id={folderConfig.id}
                    onClick={handleClick}
                    disabled={!isAccessible}
                    suppressHydrationWarning
                  >
                    <FolderIcon className="h-6 w-6 flex items-center justify-center" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className={tooltipColorClasses || undefined}
                >
                  <Div className="text-center">
                    <P className="font-medium">{folderDisplayName}</P>
                    <P className="text-xs opacity-90 mt-0.5">
                      {folderDescription}
                    </P>
                    {!isAccessible && (
                      <P className="text-xs opacity-70 mt-1 font-medium">
                        {t("app.chat.common.loginRequired")}
                      </P>
                    )}
                  </Div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </Div>
    </Div>
  );
}
