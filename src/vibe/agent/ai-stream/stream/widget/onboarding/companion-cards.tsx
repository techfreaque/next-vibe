"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import { type JSX, useMemo } from "react";

import { COMPANION_SKILLS } from "../../../../skills/config";
import { scopedTranslation as skillsScopedTranslation } from "../../../../skills/i18n";
import type { AiStreamT } from "../../i18n";
import { DEFAULT_COMPANION_ID } from "./seed";

export interface CompanionCardData {
  id: string;
  name: string;
  about: string;
  icon: IconKey;
  /** A real line from this companion's answers: shows the voice, not a spec */
  voice: string | null;
  recommended: boolean;
}

/** Per-companion accent, so the two read as different people at a glance. */
const COMPANION_AVATARS: Record<string, string> = {
  thea: "bg-gradient-to-br from-amber-300/40 to-orange-500/25 text-amber-700 dark:from-amber-300/25 dark:to-orange-500/15 dark:text-amber-300",
  hermes:
    "bg-gradient-to-br from-sky-300/40 to-indigo-500/25 text-sky-700 dark:from-sky-300/25 dark:to-indigo-500/15 dark:text-sky-300",
};

const FALLBACK_AVATAR = "bg-primary/10 text-primary";

/** Card data for every built-in companion. */
export function useCompanionCards({
  locale,
  t,
}: {
  locale: CountryLanguage;
  t: AiStreamT;
}): CompanionCardData[] {
  return useMemo(() => {
    const { t: tSkills } = skillsScopedTranslation.scopedT(locale);
    return COMPANION_SKILLS.map((skill): CompanionCardData => {
      const known = skill.id === "thea" || skill.id === "hermes";
      return {
        id: skill.id,
        name: tSkills(skill.name),
        about:
          skill.id === "thea"
            ? t("onboarding.companion.about.thea")
            : skill.id === "hermes"
              ? t("onboarding.companion.about.hermes")
              : tSkills(skill.tagline),
        icon: skill.icon,
        voice: !known
          ? null
          : skill.id === "thea"
            ? t("onboarding.companion.voice.thea")
            : t("onboarding.companion.voice.hermes"),
        recommended: skill.id === DEFAULT_COMPANION_ID,
      };
    });
  }, [locale, t]);
}

export function CompanionCards({
  cards,
  selectedId,
  onSelect,
  onConfirm,
  compact = false,
  t,
}: {
  cards: readonly CompanionCardData[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Double-click / second press on the selected card continues. */
  onConfirm: () => void;
  /** Phones with the 18+ terms below: drop the quote so the terms fit */
  compact?: boolean;
  t: AiStreamT;
}): JSX.Element {
  return (
    <Div
      aria-label={t("onboarding.companion.groupLabel")}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {cards.map((card) => {
        const selected = card.id === selectedId;
        const avatar = COMPANION_AVATARS[card.id] ?? FALLBACK_AVATAR;
        return (
          <Button
            key={card.id}
            type="button"
            variant="ghost"
            size="unset"
            aria-pressed={selected}
            data-testid={`onboarding-companion-${card.id}`}
            onClick={() => (selected ? onConfirm() : onSelect(card.id))}
            className={cn(
              "group relative h-auto w-full flex-row items-start justify-start gap-3.5 whitespace-normal rounded-2xl border p-4 text-left font-normal",
              "transition-[border-color,background-color,box-shadow,transform] duration-150 motion-safe:active:scale-[0.99]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "sm:flex-col sm:gap-3 sm:p-5",
              // Same selected style as the goal tiles in step 2
              selected
                ? "border-primary bg-primary/[0.06] ring-1 ring-primary hover:bg-primary/[0.06] dark:bg-primary/[0.12] dark:hover:bg-primary/[0.12]"
                : "border-border bg-card hover:border-foreground/25 hover:bg-card hover:shadow-sm",
            )}
          >
            <Span
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14",
                avatar,
              )}
            >
              <Icon icon={card.icon} className="!size-6 sm:!size-7" />
            </Span>
            <Span className="flex min-w-0 flex-1 flex-col gap-1">
              <Span className="flex items-center gap-2 pr-7">
                <Span className="text-base font-semibold leading-tight text-foreground">
                  {card.name}
                </Span>
                {card.recommended ? (
                  <Span className="rounded-full bg-foreground/[0.07] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    {t("onboarding.companion.recommended")}
                  </Span>
                ) : null}
              </Span>
              <Span className="text-sm leading-snug text-muted-foreground">
                {card.about}
              </Span>
              {card.voice ? (
                <Span
                  className={cn(
                    "mt-1.5 border-l-2 border-foreground/15 pl-2.5 text-[13px] italic leading-snug text-foreground/80",
                    compact && "max-sm:hidden",
                  )}
                >
                  {card.voice}
                </Span>
              ) : null}
            </Span>
            {/* Radio marker: a single choice, not a link */}
            <Span
              aria-hidden="true"
              className={cn(
                "absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-foreground/25 group-hover:border-foreground/50",
              )}
            >
              {selected ? <Check className="!size-3" /> : null}
            </Span>
          </Button>
        );
      })}
    </Div>
  );
}
