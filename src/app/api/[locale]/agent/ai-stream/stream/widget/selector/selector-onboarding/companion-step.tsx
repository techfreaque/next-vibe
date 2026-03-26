"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import { type JSX } from "react";

import { scopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import {
  type Skill,
  COMPANION_SKILLS,
} from "@/app/api/[locale]/agent/chat/skills/config";
import { scopedTranslation as skillsScopedTranslation } from "@/app/api/[locale]/agent/chat/skills/i18n";
import { cn } from "@/app/api/[locale]/shared/utils";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";

interface CompanionStepProps {
  selectedId: string | null;
  locale: CountryLanguage;
  setSelectedId: (id: string | null) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function CompanionStep({
  selectedId,
  locale,
  setSelectedId,
  onContinue,
  onBack,
}: CompanionStepProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col">
      {/* Content */}
      <Div className="p-5 pb-3 flex flex-col gap-5">
        {/* Back button */}
        <Div className="shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground px-0 h-8"
            onClick={onBack}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("onboarding.back")}
          </Button>
        </Div>

        {/* Companion section */}
        <Div className="shrink-0">
          <H3 className="text-base font-semibold mb-1">
            {t("onboarding.companion.title")}
          </H3>
          <P className="text-xs text-muted-foreground mb-3">
            {t("onboarding.companion.subtitle")}
          </P>

          <Div className="grid grid-cols-2 gap-3">
            {COMPANION_SKILLS.map((skill) => (
              <CompanionCard
                key={skill.id}
                skill={skill}
                isSelected={selectedId === skill.id}
                onSelect={() => setSelectedId(skill.id)}
                locale={locale}
              />
            ))}
          </Div>
        </Div>
      </Div>

      {/* Sticky CTA */}
      <Div className="sticky bottom-0 px-5 py-3 border-t border-border bg-popover">
        <Button
          type="button"
          className="w-full h-11 text-base gap-2"
          disabled={!selectedId}
          onClick={onContinue}
        >
          {selectedId
            ? t("onboarding.companion.next")
            : t("onboarding.companion.selectFirst")}
          {selectedId && <ArrowRight className="h-4 w-4" />}
        </Button>
      </Div>
    </Div>
  );
}

interface CompanionCardProps {
  skill: Skill;
  isSelected: boolean;
  onSelect: () => void;
  locale: CountryLanguage;
}

function CompanionCard({
  skill,
  isSelected,
  onSelect,
  locale,
}: CompanionCardProps): JSX.Element {
  const { t } = skillsScopedTranslation.scopedT(locale);

  return (
    <Div
      className={cn(
        "flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer",
        "hover:shadow-lg active:scale-[0.98]",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
        "group",
      )}
      onClick={onSelect}
    >
      <Div className="flex justify-center mb-3 relative">
        <Div
          className={cn(
            "w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary/10",
            "flex items-center justify-center ring-2 transition-all shadow-sm",
            isSelected
              ? "ring-primary"
              : "ring-transparent group-hover:ring-primary/40",
          )}
        >
          <Icon icon={skill.icon} className="h-7 w-7 text-primary" />
        </Div>
        {isSelected && (
          <Div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Check className="h-3 w-3 text-primary-foreground" />
          </Div>
        )}
      </Div>

      <Span className="text-base font-bold text-center mb-1">
        {t(skill.name)}
      </Span>
      <Span className="text-xs font-medium text-primary text-center mb-1">
        {t(skill.tagline)}
      </Span>
      <P className="text-xs text-muted-foreground text-center leading-relaxed">
        {t(skill.description)}
      </P>
    </Div>
  );
}
