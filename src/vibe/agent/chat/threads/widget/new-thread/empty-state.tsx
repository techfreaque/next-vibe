"use client";

import { platform } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Compass } from "next-vibe/ui/components/icons/Compass";
import { Flame } from "next-vibe/ui/components/icons/Flame";
import { Image } from "next-vibe/ui/components/icons/Image";
import { Lightbulb } from "next-vibe/ui/components/icons/Lightbulb";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { JSX } from "react";

import { DOM_IDS, LAYOUT } from "@/_pages/chat/lib/config/constants";

import { useChatInputStore } from "../../../../ai-stream/stream/hooks/input-store";
import { getDefaultFolderConfig } from "../../../config";
import { useTourState } from "../../../tour-state";
import { useChatNavigationStore } from "../../../hooks/use-chat-navigation-store";
import { scopedTranslation } from "../../i18n";

const STARTERS = [
  { id: "explain", icon: Lightbulb },
  { id: "search", icon: Search },
  { id: "image", icon: Image },
  { id: "honest", icon: Flame },
] as const;

interface ChatEmptyStateProps {
  locale: CountryLanguage;
  inputHeight: number;
}

/**
 * Empty state display for new threads.
 * Centered layout with folder-specific colors.
 */
export function ChatEmptyState({
  locale,
  inputHeight,
}: ChatEmptyStateProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);
  const setInput = useChatInputStore((s) => s.setInput);
  const requestTour = useTourState((s) => s.requestTour);

  const folderConfig = getDefaultFolderConfig(rootFolderId);
  const color = folderConfig?.color || "blue";

  // Map color names to Tailwind classes
  const getColorClasses = (
    variant: "bg" | "border" | "text" | "hover-bg",
  ): string => {
    const colorMap: Record<
      string,
      Record<"bg" | "border" | "text" | "hover-bg", string>
    > = {
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
        text: "text-primary",
        "hover-bg": "hover:bg-blue-500/10",
      },
      green: {
        bg: "bg-green-500/20",
        border: "border-green-500/50",
        text: "text-green-500",
        "hover-bg": "hover:bg-green-500/10",
      },
    };

    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  const getTitle = (): string => {
    switch (rootFolderId) {
      case "private":
        return t("widget.suggestedPrompts.privateTitle");
      case "shared":
        return t("widget.suggestedPrompts.sharedTitle");
      case "incognito":
        return t("widget.suggestedPrompts.incognitoTitle");
      case "public":
        return t("widget.suggestedPrompts.publicTitle");
      case "cron":
        return t("widget.suggestedPrompts.backgroundTitle");
      default:
        return t("widget.suggestedPrompts.title");
    }
  };

  const getDescription = (): string => {
    switch (rootFolderId) {
      case "private":
        return t("widget.suggestedPrompts.privateDescription");
      case "shared":
        return t("widget.suggestedPrompts.sharedDescription");
      case "incognito":
        return t("widget.suggestedPrompts.incognitoDescription");
      case "public":
        return t("widget.suggestedPrompts.publicDescription");
      case "cron":
        return t("widget.suggestedPrompts.backgroundDescription");
      default:
        return "";
    }
  };

  return (
    <Div
      className="absolute inset-0 overflow-y-auto"
      id={DOM_IDS.MESSAGES_CONTAINER}
    >
      <Div
        style={
          platform.isReactNative
            ? { paddingBottom: LAYOUT.MESSAGES_BOTTOM_PADDING }
            : {
                paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
              }
        }
      >
        <Div className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-20">
          {/* Where you are: folder + what it means for your data */}
          <Div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${getColorClasses("bg")}`}
          >
            <Div className={getColorClasses("text")}>
              <Icon
                icon={folderConfig?.icon || "message-circle"}
                className="h-7 w-7"
              />
            </Div>
          </Div>
          <H1 className="mb-2 text-balance text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            {getTitle()}
          </H1>
          <P className="mb-8 max-w-md text-balance text-center text-sm text-muted-foreground sm:text-base">
            {getDescription()}
          </P>

          {/* What to do now: tap a starter, it lands in the message box */}
          {rootFolderId !== "cron" && (
            <Div className="flex w-full flex-col gap-3">
              <Span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("widget.suggestedPrompts.tryOne")}
              </Span>
              <Div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {STARTERS.map(({ id, icon: StarterIcon }) => (
                  <Button
                    key={id}
                    type="button"
                    variant="outline"
                    data-starter={id}
                    className="h-auto justify-start gap-3 whitespace-normal rounded-xl bg-card px-3.5 py-3 text-left font-normal shadow-sm hover:border-primary/40 hover:bg-card"
                    onClick={() =>
                      setInput(
                        t(`widget.suggestedPrompts.starters.${id}.prompt`),
                      )
                    }
                  >
                    <Span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getColorClasses("bg")} ${getColorClasses("text")}`}
                    >
                      <StarterIcon className="h-4 w-4" />
                    </Span>
                    <Span className="flex min-w-0 flex-col">
                      <Span className="text-sm font-medium">
                        {t(`widget.suggestedPrompts.starters.${id}.label`)}
                      </Span>
                      <Span className="line-clamp-2 text-xs text-muted-foreground">
                        {t(`widget.suggestedPrompts.starters.${id}.prompt`)}
                      </Span>
                    </Span>
                  </Button>
                ))}
              </Div>

              {/* How to change who answers + optional tour */}
              <Div className="mt-3 flex flex-col items-center gap-1 text-center">
                <P className="text-xs text-muted-foreground">
                  {t("widget.suggestedPrompts.switchHint")}
                </P>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={requestTour}
                >
                  <Compass className="h-3.5 w-3.5" />
                  {t("widget.suggestedPrompts.takeTour")}
                </Button>
              </Div>
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}
