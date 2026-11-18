"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Flame } from "next-vibe/ui/components/icons/Flame";
import { Image as ImageIcon } from "next-vibe/ui/components/icons/Image";
import { MessageCircle } from "next-vibe/ui/components/icons/MessageCircle";
import { Span } from "next-vibe/ui/components/span";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { DEFAULT_SKILLS } from "../../../../skills/config";
import { scopedTranslation as skillsScopedTranslation } from "../../../../skills/i18n";
import type { AiStreamT } from "../../i18n";

export type GoalId = "uncensored" | "media" | "coding" | "chat";

export interface GoalConfig {
  id: GoalId;
  /** Built-in skills this goal adds (default variant each). */
  skillIds: readonly string[];
  /** Skill that answers the first prompt; null = the companion answers. */
  leadSkillId: string | null;
  /** Companion mode that answers instead (keeps the companion just picked). */
  companionVariantId: string | null;
  icon: IconComponent;
  tone: string;
  /** Selects an uncensored model: the 18+ confirmation follows. */
  adultsOnly: boolean;
}

export const GOALS: readonly GoalConfig[] = [
  {
    id: "uncensored",
    skillIds: ["uncensored", "debater", "uncensored-writer"],
    leadSkillId: null,
    companionVariantId: "uncensored",
    icon: Flame,
    adultsOnly: true,
    tone: "bg-rose-500/12 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300",
  },
  {
    id: "media",
    skillIds: ["creative", "storyteller"],
    leadSkillId: "creative",
    companionVariantId: null,
    icon: ImageIcon,
    adultsOnly: false,
    tone: "bg-violet-500/12 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300",
  },
  {
    id: "coding",
    skillIds: ["coder", "hacker"],
    leadSkillId: "coder",
    companionVariantId: null,
    icon: Code,
    adultsOnly: false,
    tone: "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  {
    id: "chat",
    skillIds: [],
    leadSkillId: null,
    companionVariantId: null,
    icon: MessageCircle,
    adultsOnly: false,
    tone: "bg-sky-500/12 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  },
];

export const DEFAULT_GOAL_ID: GoalId = "chat";

/** Localized names of the skills a goal adds, e.g. "Uncensored, Debater". */
export function goalSkillNames(
  goal: GoalConfig,
  locale: CountryLanguage,
): string[] {
  const { t: tSkills } = skillsScopedTranslation.scopedT(locale);
  return goal.skillIds.flatMap((id) => {
    const skill = DEFAULT_SKILLS.find((s) => s.id === id);
    return skill ? [tSkills(skill.name)] : [];
  });
}

export function GoalTiles({
  selectedId,
  onSelect,
  onConfirm,
  companionName,
  collapsed = false,
  onExpand,
  t,
}: {
  selectedId: GoalId;
  onSelect: (id: GoalId) => void;
  /** Second press on the selected tile continues. */
  onConfirm: () => void;
  companionName: string;
  /** Only the picked tile, as one row with "Change" (keeps the 18+ terms in view) */
  collapsed?: boolean;
  onExpand?: () => void;
  t: AiStreamT;
}): JSX.Element {
  const goals = collapsed ? GOALS.filter((g) => g.id === selectedId) : GOALS;
  return (
    <Div
      aria-label={t("onboarding.goal.groupLabel")}
      className={cn(
        "grid gap-2.5 sm:gap-3",
        collapsed ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      {goals.map((goal) => {
        const selected = goal.id === selectedId;
        const GoalIcon = goal.icon;
        const body = t(`onboarding.goal.tiles.${goal.id}.body`, {
          companion: companionName,
        });
        const badge = goal.adultsOnly ? (
          <Span className="rounded-full bg-rose-500/12 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-700 dark:bg-rose-400/15 dark:text-rose-300">
            {t("onboarding.goal.adultsOnly")}
          </Span>
        ) : null;
        const icon = (
          <Span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              goal.tone,
            )}
          >
            <GoalIcon className="!size-[18px]" />
          </Span>
        );

        if (collapsed) {
          return (
            <Div
              key={goal.id}
              data-testid={`onboarding-goal-${goal.id}`}
              className="flex items-center gap-3 rounded-2xl border border-primary bg-primary/[0.06] p-3 ring-1 ring-primary sm:p-4 dark:bg-primary/[0.12]"
            >
              {icon}
              <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Span className="flex flex-wrap items-center gap-2 text-sm font-semibold leading-tight text-foreground">
                  {t(`onboarding.goal.tiles.${goal.id}.title`)}
                  {badge}
                </Span>
                <Span className="text-xs leading-snug text-muted-foreground">
                  {body}
                </Span>
              </Div>
              <Button
                type="button"
                variant="ghost"
                size="unset"
                onClick={onExpand}
                className="h-9 shrink-0 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground hover:bg-accent"
              >
                {t("onboarding.goal.change")}
              </Button>
            </Div>
          );
        }

        return (
          <Button
            key={goal.id}
            type="button"
            variant="ghost"
            size="unset"
            aria-pressed={selected}
            data-testid={`onboarding-goal-${goal.id}`}
            onClick={() => (selected ? onConfirm() : onSelect(goal.id))}
            className={cn(
              "group relative h-auto w-full flex-col items-start justify-start gap-2.5 whitespace-normal rounded-2xl border p-3.5 text-left font-normal sm:p-4",
              "transition-[border-color,background-color,box-shadow,transform] duration-150 motion-safe:active:scale-[0.99]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              selected
                ? "border-primary bg-primary/[0.06] ring-1 ring-primary hover:bg-primary/[0.06] dark:bg-primary/[0.12] dark:hover:bg-primary/[0.12]"
                : "border-border bg-card hover:border-foreground/25 hover:bg-card hover:shadow-sm",
            )}
          >
            {/* Icon row: icon, 18+ badge, radio marker on the right */}
            <Span className="flex w-full items-center gap-2">
              {icon}
              {badge}
              <Span
                aria-hidden="true"
                className={cn(
                  "ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/25 group-hover:border-foreground/50",
                )}
              >
                {selected ? <Check className="!size-3" /> : null}
              </Span>
            </Span>
            <Span className="flex flex-col gap-0.5">
              <Span className="text-sm font-semibold leading-tight text-foreground">
                {t(`onboarding.goal.tiles.${goal.id}.title`)}
              </Span>
              <Span className="text-xs leading-snug text-muted-foreground">
                {body}
              </Span>
            </Span>
          </Button>
        );
      })}
    </Div>
  );
}
