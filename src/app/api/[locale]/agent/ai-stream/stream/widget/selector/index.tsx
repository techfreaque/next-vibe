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
import { useMemo, useSyncExternalStore } from "react";

// Returns false on server (SSR), true on client after hydration.
// Used to prevent skill content from rendering during SSR, avoiding hydration mismatches
// when React Query fetches data server-side but the client starts with no cache.
function useIsClient(): boolean {
  return useSyncExternalStore(
    (cb) => cb,
    () => true,
    () => false,
  );
}

import { TOUR_DATA_ATTRS } from "@/app/[locale]/threads/[...path]/_components/welcome-tour/tour-attrs";
import { useTourState } from "@/app/api/[locale]/agent/chat/tour-state";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import {
  getChatModelById,
  type ChatModelId,
} from "@/app/api/[locale]/agent/ai-stream/models";
import {
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";

import type { SkillGetResponseOutput } from "../../../../chat/skills/[id]/definition";
import { useSkill } from "../../../../chat/skills/[id]/hooks";
import { SelectorContent } from "./selector-content";

interface SelectorProps {
  skillId: string;
  modelId: ChatModelId | null | undefined;
  locale: CountryLanguage;
  buttonClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialSkillData?: SkillGetResponseOutput | null;
}

export function Selector({
  skillId,
  modelId,
  locale,
  buttonClassName,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialSkillData,
}: SelectorProps): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();

  const tourModelSelectorOpen = useTourState((s) => s.modelSelectorOpen);
  const tourIsActive = useTourState((s) => s.isActive);
  const setModelSelectorOpen = useTourState((s) => s.setModelSelectorOpen);

  // Use controlled state if provided, otherwise use tour state
  const popoverOpen = controlledOnOpenChange
    ? controlledOpen
    : tourModelSelectorOpen;

  // When tour controls the popover, block Radix close requests while tour is active
  const setPopoverOpen = controlledOnOpenChange
    ? controlledOnOpenChange
    : (open: boolean): void => {
        if (!open && tourIsActive && tourModelSelectorOpen) {
          return;
        }
        setModelSelectorOpen(open);
      };

  const isClient = useIsClient();
  const isModelOnly = skillId === NO_SKILL_ID;
  const currentCharaterHook = useSkill(
    isModelOnly ? undefined : skillId,
    user,
    logger,
    initialSkillData,
  );
  const currentSkill = currentCharaterHook.read?.data ?? null;
  const currentModel = useMemo(() => getChatModelById(modelId), [modelId]);
  const modelSupportsTools = currentModel?.supportsTools ?? false;

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
          {/* Skill icon/name/separator - not rendered on SSR to avoid hydration mismatch.
              React Query fetches skill data server-side but the client starts with no cache,
              causing a structural child mismatch. useIsClient() returns false on SSR / initial
              hydration render and true only after the client has mounted. */}
          {!isModelOnly && isClient && currentSkill?.icon && (
            <Span className="flex items-center justify-center w-5 h-5 shrink-0">
              <Icon icon={currentSkill.icon} className="h-4 w-4" />
            </Span>
          )}

          {!isModelOnly && isClient && currentSkill?.name && (
            <Span
              className={cn(
                "max-w-[80px] @xl:max-w-[100px] truncate",
                modelSupportsTools ? "hidden @md:inline" : "hidden @xs:inline",
              )}
            >
              {currentSkill.name}
            </Span>
          )}

          {!isModelOnly && isClient && currentSkill && (
            <Span
              className={cn(
                modelSupportsTools ? "hidden @md:inline" : "inline",
              )}
            >
              +
            </Span>
          )}

          {/* Model icon */}
          <Span className="flex items-center justify-center w-5 h-5 shrink-0">
            {currentModel?.icon ? (
              <Icon icon={currentModel.icon} className="h-4 w-4" />
            ) : null}
          </Span>

          {/* Model name - hidden when container is too narrow, shown earlier when no tools */}
          <Span
            className={cn(
              "max-w-[80px] @xl:max-w-[105px] @2xl:max-w-[140px] truncate",
              modelSupportsTools ? "hidden @xl:inline" : "hidden @md:inline",
            )}
            suppressHydrationWarning
          >
            {currentModel?.name}
          </Span>

          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[480px] max-w-[calc(100vw-10px)] max-h-[85dvh] overflow-y-auto"
        align="start"
        side="top"
        sideOffset={8}
        avoidCollisions={true}
        collisionPadding={8}
      >
        {/* Only render content when popover is open - so we don't fetch data until needed */}
        {popoverOpen && <SelectorContent locale={locale} />}
      </PopoverContent>
    </Popover>
  );
}
