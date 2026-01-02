"use client";

import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React from "react";

import { DOM_IDS, LAYOUT } from "@/app/[locale]/chat/lib/config/constants";
import { getDefaultFolderConfig } from "@/app/api/[locale]/agent/chat/config";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ChatEmptyStateProps {
  locale: CountryLanguage;
  inputHeight: number;
}

/**
 * Empty state display for new threads.
 * Centered layout with folder-specific colors.
 */
export function ChatEmptyState({ locale, inputHeight }: ChatEmptyStateProps): JSX.Element {
  const { t } = simpleT(locale);
  const { currentRootFolderId: rootFolderId } = useChatContext();

  const folderConfig = getDefaultFolderConfig(rootFolderId);
  const color = folderConfig?.color || "blue";

  // Map color names to Tailwind classes
  const getColorClasses = (variant: "bg" | "border" | "text" | "hover-bg"): string => {
    const colorMap: Record<string, Record<"bg" | "border" | "text" | "hover-bg", string>> = {
      sky: {
        bg: "bg-sky-500/20",
        border: "border-sky-500/50",
        text: "text-sky-500",
        "hover-bg": "hover:bg-sky-500/15",
      },
      purple: {
        bg: "bg-purple-500/20",
        border: "border-purple-500/50",
        text: "text-purple-500",
        "hover-bg": "hover:bg-purple-500/10",
      },
      teal: {
        bg: "bg-teal-500/20",
        border: "border-teal-500/50",
        text: "text-teal-500",
        "hover-bg": "hover:bg-teal-500/10",
      },
      amber: {
        bg: "bg-amber-500/20",
        border: "border-amber-500/50",
        text: "text-amber-500",
        "hover-bg": "hover:bg-amber-500/10",
      },
      blue: {
        bg: "bg-blue-500/20",
        border: "border-blue-500/50",
        text: "text-blue-500",
        "hover-bg": "hover:bg-blue-500/10",
      },
    };

    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  const getTitle = (): string => {
    switch (rootFolderId) {
      case "private":
        return t("app.chat.suggestedPrompts.privateTitle");
      case "shared":
        return t("app.chat.suggestedPrompts.sharedTitle");
      case "incognito":
        return t("app.chat.suggestedPrompts.incognitoTitle");
      case "public":
        return t("app.chat.suggestedPrompts.publicTitle");
      default:
        return t("app.chat.suggestedPrompts.title");
    }
  };

  const getDescription = (): string => {
    switch (rootFolderId) {
      case "private":
        return t("app.chat.suggestedPrompts.privateDescription");
      case "shared":
        return t("app.chat.suggestedPrompts.sharedDescription");
      case "incognito":
        return t("app.chat.suggestedPrompts.incognitoDescription");
      case "public":
        return t("app.chat.suggestedPrompts.publicDescription");
      default:
        return "";
    }
  };

  return (
    <Div className="h-screen h-max-screen overflow-y-auto" id={DOM_IDS.MESSAGES_CONTAINER}>
      <Div
        style={
          platform.isReactNative
            ? { paddingBottom: LAYOUT.MESSAGES_BOTTOM_PADDING }
            : {
                paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
              }
        }
      >
        <Div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pt-20 flex flex-col items-center">
          {/* Folder icon */}
          <Div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${getColorClasses("bg")}`}
          >
            <Div className={`text-4xl ${getColorClasses("text")}`}>
              {React.createElement(getIconComponent(folderConfig?.icon || "message-circle"))}
            </Div>
          </Div>

          {/* Title and description */}
          <H1 className="text-3xl font-bold mb-2 text-center">{getTitle()}</H1>
          <P className="text-muted-foreground text-center mb-8">{getDescription()}</P>
        </Div>
      </Div>
    </Div>
  );
}
