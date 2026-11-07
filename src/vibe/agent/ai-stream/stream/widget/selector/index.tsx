"use client";
import { Button } from "next-vibe/ui/components/button";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe/ui/components/popover";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
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

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";

import { useTourState } from "../../../../chat/tour-state";
import type { SkillGetResponseOutput } from "../../../../skills/[id]/definition";
import { useSkill } from "../../../../skills/[id]/hooks";
import { NO_SKILL_ID } from "../../../../skills/constants";
import { type ChatModelId, getChatModelById } from "../../../models";
import { TOUR_DATA_ATTRS } from "../chat-ui/welcome-tour/tour-attrs";
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

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={"sm"}
          className={cn(
            "h-9 min-w-0 max-w-full justify-start gap-2 rounded-lg px-1.5 text-sm font-normal hover:bg-accent touch-manipulation",
            buttonClassName,
          )}
          data-tour={TOUR_DATA_ATTRS.MODEL_SELECTOR}
          suppressHydrationWarning
        >
          {/* Avatar: the character if one is active, otherwise the model.
              Skill data is client-only (see useIsClient) to avoid hydration mismatch. */}
          <Span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            {!isModelOnly && isClient && currentSkill?.icon ? (
              <Icon icon={currentSkill.icon} className="h-3.5 w-3.5" />
            ) : currentModel?.icon ? (
              <Icon icon={currentModel.icon} className="h-3.5 w-3.5" />
            ) : null}
          </Span>

          {/* Who + which brain - truncates, never disappears */}
          <Span
            className="flex min-w-0 items-baseline gap-1.5"
            suppressHydrationWarning
          >
            {!isModelOnly && isClient && currentSkill?.name ? (
              <>
                <Span className="truncate font-medium">
                  {currentSkill.name}
                </Span>
                <Span className="min-w-0 truncate text-xs text-muted-foreground">
                  {currentModel?.name}
                </Span>
              </>
            ) : (
              <Span className="truncate font-medium">{currentModel?.name}</Span>
            )}
          </Span>

          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
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
