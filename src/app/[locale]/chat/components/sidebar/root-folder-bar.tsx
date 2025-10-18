"use client";

import type { JSX } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/next-vibe-ui/web/ui";

import { getIconComponent } from "../../lib/config/icons";
import { getFolderDisplayName } from "../../lib/storage/thread-manager";
import type { ChatFolder, ChatState } from "../../lib/storage/types";
import {
  DEFAULT_FOLDER_CONFIGS,
  getFolderColor,
  getFolderIcon,
} from "../../lib/storage/types";

interface RootFolderBarProps {
  state: ChatState;
  activeFolderId: string | null;
  locale: CountryLanguage;
  onSelectFolder: (folderId: string) => void;
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
    zinc: "bg-zinc-600 text-white border-zinc-500",
  };

  return tooltipColorMap[color] || "";
}
/* eslint-enable i18next/no-literal-string */

export function RootFolderBar({
  state,
  activeFolderId,
  locale,
  onSelectFolder,
}: RootFolderBarProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get root folders in the order specified by state.rootFolderIds (user's custom order)
  const rootFolders = state.rootFolderIds
    .map((id) => state.folders[id])
    .filter((folder): folder is ChatFolder => folder !== undefined);

  const handleFolderClick = (folderId: string): void => {
    onSelectFolder(folderId);
  };

  return (
    <div className="overflow-x-auto bg-background/50">
      <div className="flex items-center gap-1 px-3 py-2 min-w-max">
        <TooltipProvider delayDuration={300}>
          {rootFolders.map((folder) => {
            const folderIcon = getFolderIcon(folder);
            const FolderIcon = getIconComponent(folderIcon);
            const folderDisplayName = getFolderDisplayName(folder, locale);
            const isActive = folder.id === activeFolderId;
            const folderColor = getFolderColor(folder.id);
            const colorClasses = getColorClasses(folderColor, isActive);

            const tooltipColorClasses = getTooltipColorClasses(folderColor);

            // Get description for default folders
            const folderConfig = DEFAULT_FOLDER_CONFIGS.find(
              (c) => c.id === folder.id,
            );
            const folderDescription = folderConfig
              ? t(folderConfig.descriptionKey)
              : null;

            return (
              <Tooltip key={folder.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-11 w-11 ${colorClasses}`}
                    onClick={() => handleFolderClick(folder.id)}
                    suppressHydrationWarning
                  >
                    <FolderIcon className="h-6 w-6 flex items-center justify-center" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className={tooltipColorClasses || undefined}
                >
                  <div className="text-center">
                    <p className="font-medium">{folderDisplayName}</p>
                    {folderDescription && (
                      <p className="text-xs opacity-90 mt-0.5">
                        {folderDescription}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
