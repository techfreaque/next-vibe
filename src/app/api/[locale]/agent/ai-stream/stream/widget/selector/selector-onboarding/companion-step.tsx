"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import { type JSX } from "react";

import {
  type Skill,
  COMPANION_SKILLS,
} from "@/app/api/[locale]/agent/chat/skills/config";
import { scopedTranslation as skillsScopedTranslation } from "@/app/api/[locale]/agent/chat/skills/i18n";
import { cn } from "@/app/api/[locale]/shared/utils";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { scopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import type { AiStreamT } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { getModelById, ModelId } from "@/app/api/[locale]/agent/models/models";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { useWidgetUser } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { CountryLanguage } from "@/i18n/core/config";

export type BudgetTier = "smart" | "brilliant" | "max";

const BUDGET_TIERS: BudgetTier[] = ["smart", "brilliant", "max"];

function getBudgetModelHints(
  isAdmin: boolean,
  claudeCodeAvailable: boolean,
): Record<BudgetTier, string> {
  const useClaudeCode = isAdmin && claudeCodeAvailable;
  return {
    smart: getModelById(ModelId.KIMI_K2_5).name,
    brilliant: useClaudeCode
      ? getModelById(ModelId.CLAUDE_CODE_SONNET).name
      : getModelById(ModelId.CLAUDE_SONNET_4_6).name,
    max: useClaudeCode
      ? getModelById(ModelId.CLAUDE_CODE_OPUS).name
      : getModelById(ModelId.CLAUDE_OPUS_4_6).name,
  };
}

interface CompanionStepProps {
  selectedId: string | null;
  selectedBudget: BudgetTier;
  locale: CountryLanguage;
  setSelectedId: (id: string | null) => void;
  setSelectedBudget: (tier: BudgetTier) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function CompanionStep({
  selectedId,
  selectedBudget,
  locale,
  setSelectedId,
  setSelectedBudget,
  onContinue,
  onBack,
}: CompanionStepProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const envAvailability = useEnvAvailability();
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const budgetModelHints = getBudgetModelHints(
    isAdmin,
    envAvailability.claudeCode,
  );

  return (
    <Div className="flex flex-col p-5 overflow-y-auto">
      {/* Back button */}
      <Div className="mb-2 shrink-0">
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
      <Div className="mb-5 shrink-0">
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

      {/* Divider */}
      <Div className="border-t border-border mb-5 shrink-0" />

      {/* Budget section */}
      <Div className="mb-5 shrink-0">
        <H3 className="text-base font-semibold mb-1">
          {t("onboarding.companion.budgetTitle")}
        </H3>
        <P className="text-xs text-muted-foreground mb-3">
          {t("onboarding.companion.budgetSubtitle")}
        </P>

        <Div className="flex flex-col gap-2">
          {BUDGET_TIERS.map((tier) => (
            <BudgetCard
              key={tier}
              tier={tier}
              modelHint={budgetModelHints[tier]}
              isSelected={selectedBudget === tier}
              onSelect={() => setSelectedBudget(tier)}
              t={t}
            />
          ))}
        </Div>
      </Div>

      {/* Action */}
      <Div className="shrink-0">
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

interface BudgetCardProps {
  tier: BudgetTier;
  modelHint: string;
  isSelected: boolean;
  onSelect: () => void;
  t: AiStreamT;
}

function BudgetCard({
  tier,
  modelHint,
  isSelected,
  onSelect,
  t,
}: BudgetCardProps): JSX.Element {
  return (
    <Div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
        "hover:shadow-sm active:scale-[0.99]",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-card hover:border-primary/40",
      )}
      onClick={onSelect}
    >
      <Div
        className={cn(
          "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
          isSelected ? "border-primary" : "border-muted-foreground/40",
        )}
      >
        {isSelected && <Div className="w-2 h-2 rounded-full bg-primary" />}
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-baseline gap-2">
          <Span className="text-sm font-semibold">
            {t(`onboarding.companion.budget.${tier}.label`)}
          </Span>
          <Span className="text-xs text-muted-foreground/60">{modelHint}</Span>
        </Div>
        <P className="text-xs text-muted-foreground">
          {t(`onboarding.companion.budget.${tier}.desc`)}
        </P>
      </Div>
    </Div>
  );
}
