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
import { useMemo } from "react";

import { TOUR_DATA_ATTRS } from "@/app/[locale]/threads/[...path]/_components/welcome-tour/tour-attrs";
import { useTourState } from "@/app/[locale]/threads/[...path]/_components/welcome-tour/tour-state-context";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import {
  getModelById,
  type ModelId,
} from "@/app/api/[locale]/agent/models/models";
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
  modelId: ModelId;
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
  // Tour state (for uncontrolled mode)
  const tourPopoverOpen = useTourState((state) => state.modelSelectorOpen);
  const setTourPopoverOpen = useTourState(
    (state) => state.setModelSelectorOpen,
  );

  // Use controlled state if provided, otherwise use tour state, otherwise use local state
  const popoverOpen = controlledOnOpenChange ? controlledOpen : tourPopoverOpen;
  const setPopoverOpen = controlledOnOpenChange ?? setTourPopoverOpen;
  const isModelOnly = skillId === NO_SKILL_ID;
  const currentCharaterHook = useSkill(
    isModelOnly ? undefined : skillId,
    user,
    logger,
    initialSkillData,
  );
  const currentSkill = currentCharaterHook.read?.data ?? null;
  const currentModel = useMemo(() => getModelById(modelId), [modelId]);
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
          {/* Skill icon - hidden for model-only */}
          {!isModelOnly && currentSkill?.icon && (
            <Span className="flex items-center justify-center w-5 h-5 shrink-0">
              {currentSkill ? (
                <Icon icon={currentSkill.icon} className="h-4 w-4" />
              ) : null}
            </Span>
          )}

          {/* Skill name - hidden when container is narrow, always shown when no tools, hidden for model-only */}
          {!isModelOnly && currentSkill?.name && (
            <Span
              className={cn(
                "max-w-[80px] @xl:max-w-[100px] truncate",
                modelSupportsTools ? "hidden @md:inline" : "hidden @xs:inline",
              )}
            >
              {currentSkill.name}
            </Span>
          )}

          {/* Separator - hidden when container is narrow, always shown when no tools, hidden for model-only */}
          {!isModelOnly && currentSkill && (
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
            suppressHydrationWarning
          >
            {currentModel?.name}
          </Span>

          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[480px] max-w-[calc(100vw-10px)] mx-[5px] max-h-[85dvh] overflow-y-auto"
        align="start"
        side="top"
        sideOffset={8}
      >
        {/* Only render content when popover is open - so we don't fetch data until needed */}
        {popoverOpen && <SelectorContent locale={locale} />}
      </PopoverContent>
    </Popover>
  );
}
