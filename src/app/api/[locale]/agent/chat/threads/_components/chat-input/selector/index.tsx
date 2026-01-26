"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import { TOUR_DATA_ATTRS } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-config";
import { useTourState } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-state-context";
import { NO_CHARACTER_ID } from "@/app/api/[locale]/agent/chat/characters/config";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import {
  type ModelId,
  modelOptions,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { SelectorContent } from "./selector-content";

interface SelectorProps {
  characterId: string;
  modelId: ModelId;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  buttonClassName?: string;
}

export function Selector({
  characterId,
  modelId,
  locale,
  user,
  logger,
  buttonClassName,
}: SelectorProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get characters from chat context (already fetched by useChat)
  const chat = useChatContext();
  const characters = chat.characters;

  // Tour state
  const tourIsActive = useTourState((state) => state.isActive);
  const tourOpen = useTourState((state) => state.modelSelectorOpen);
  const setTourOpen = useTourState((state) => state.setModelSelectorOpen);

  // Local state
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<
    "story" | "pick" | "specialists"
  >("story");
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  // Use tour state if active
  const open = tourIsActive ? tourOpen : popoverOpen;

  // Handle open state changes
  const handleOpenChange = useCallback(
    (newOpen: boolean): void => {
      if (tourIsActive) {
        setTourOpen(newOpen);
      } else {
        setPopoverOpen(newOpen);
      }
    },
    [tourIsActive, setTourOpen],
  );

  // Close modal
  const handleClose = useCallback((): void => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Get current character and model for display
  const currentCharacter = useMemo(
    () => characters[characterId] ?? null,
    [characters, characterId],
  );
  const currentModel = useMemo(() => modelOptions[modelId], [modelId]);
  const modelSupportsTools = currentModel?.supportsTools ?? false;
  const isModelOnly = characterId === NO_CHARACTER_ID;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={"sm"}
          className={cn(
            "h-auto min-h-9 gap-1.5 px-2 py-1.5 hover:bg-accent text-sm font-normal touch-manipulation",
            modelSupportsTools ? "@md:gap-2 @md:px-3" : "gap-2 px-3",
            buttonClassName,
          )}
          data-tour={TOUR_DATA_ATTRS.MODEL_SELECTOR}
          suppressHydrationWarning
        >
          {/* Character icon - hidden for model-only */}
          {!isModelOnly && (
            <Span className="flex items-center justify-center w-5 h-5 shrink-0">
              {currentCharacter ? (
                <Icon icon={currentCharacter.icon} className="h-4 w-4" />
              ) : null}
            </Span>
          )}

          {/* Character name - hidden when container is narrow, always shown when no tools, hidden for model-only */}
          {!isModelOnly && (
            <Span
              className={cn(
                "max-w-[80px] @xl:max-w-[100px] truncate",
                modelSupportsTools ? "hidden @md:inline" : "hidden @xs:inline",
              )}
            >
              {currentCharacter?.content?.name
                ? t(currentCharacter.content.name)
                : ""}
            </Span>
          )}

          {/* Separator - hidden when container is narrow, always shown when no tools, hidden for model-only */}
          {!isModelOnly && (
            <Span
              className={cn(
                "text-muted-foreground/50",
                modelSupportsTools ? "hidden @md:inline" : "inline",
              )}
            >
              +
            </Span>
          )}

          {/* Model icon */}
          <Span className="flex items-center justify-center w-5 h-5 shrink-0 opacity-70">
            {currentModel?.icon ? (
              <Icon icon={currentModel.icon} className="h-4 w-4" />
            ) : null}
          </Span>

          {/* Model name - hidden when container is too narrow, shown earlier when no tools */}
          <Span
            className={cn(
              "max-w-[80px] @xl:max-w-[105px] @2xl:max-w-[140px] truncate text-muted-foreground",
              modelSupportsTools ? "hidden @xl:inline" : "hidden @md:inline",
            )}
          >
            {currentModel?.name}
          </Span>

          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "p-0 w-screen sm:w-[480px] sm:max-w-[520px]",
          // Ensure popover appears above tour overlay (z-index 10000) when tour is active
          tourIsActive && "z-[10001]",
        )}
        align="start"
        side="top"
        sideOffset={8}
      >
        {/* Only render content when popover is open - this is where all data fetching happens */}
        {open && (
          <SelectorContent
            characterId={characterId}
            locale={locale}
            user={user}
            logger={logger}
            onClose={handleClose}
            onboardingStep={onboardingStep}
            onOnboardingStepChange={setOnboardingStep}
            isOnboardingActive={isOnboardingActive}
            onOnboardingActiveChange={setIsOnboardingActive}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
