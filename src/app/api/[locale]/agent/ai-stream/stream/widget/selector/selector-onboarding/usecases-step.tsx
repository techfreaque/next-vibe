"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Briefcase } from "next-vibe-ui/ui/icons/Briefcase";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { BookOpen } from "next-vibe-ui/ui/icons/BookOpen";
import { PenTool } from "next-vibe-ui/ui/icons/PenTool";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import { type JSX, useCallback, useState } from "react";
import { success } from "next-vibe/shared/types/response.schema";

import { scopedTranslation } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import type { AiStreamT } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import {
  COMPANION_SKILLS,
  DEFAULT_SKILLS,
} from "@/app/api/[locale]/agent/chat/skills/config";
import { scopedTranslation as skillsScopedTranslation } from "@/app/api/[locale]/agent/chat/skills/i18n";
import type { FiltersModelSelection } from "@/app/api/[locale]/agent/chat/skills/create/definition";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SpeedLevel,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { ChatFavoritesRepositoryClient } from "@/app/api/[locale]/agent/chat/favorites/repository-client";
import { useFavoriteCreate } from "@/app/api/[locale]/agent/chat/favorites/create/hooks";
import favoritesDefinition from "@/app/api/[locale]/agent/chat/favorites/definition";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/types";
import { getModelById, ModelId } from "@/app/api/[locale]/agent/models/models";
import { cn } from "@/app/api/[locale]/shared/utils";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import {
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { CountryLanguage } from "@/i18n/core/config";

export type UseCase =
  | "coding"
  | "research"
  | "writing"
  | "business"
  | "learning";

const USE_CASE_IDS: UseCase[] = [
  "coding",
  "research",
  "writing",
  "business",
  "learning",
];

type UseCaseIcon = React.ComponentType<{ className?: string }>;

const USE_CASE_ICONS: Record<UseCase, UseCaseIcon> = {
  coding: Code,
  research: Search,
  writing: PenTool,
  business: Briefcase,
  learning: BookOpen,
};

const USE_CASE_SKILL_IDS: Record<UseCase, string[]> = {
  coding: ["vibe-coder", "coder"],
  research: ["researcher", "data-analyst"],
  writing: ["writer", "editor"],
  business: ["business-advisor", "product-manager"],
  learning: ["tutor", "socraticQuestioner"],
};

function getSpecialistModelSelection(
  modelSelection: ModelSelectionSimple,
): FiltersModelSelection {
  // Determine a minimum intelligence floor based on the selected companion model
  let intelligenceMin: (typeof IntelligenceLevel)[keyof typeof IntelligenceLevel] =
    IntelligenceLevel.SMART;
  if (
    modelSelection.selectionType === ModelSelectionType.MANUAL &&
    modelSelection.manualModelId
  ) {
    const model = getModelById(modelSelection.manualModelId);
    if (model?.intelligence === IntelligenceLevel.BRILLIANT) {
      intelligenceMin = IntelligenceLevel.BRILLIANT;
    }
  }

  return {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: intelligenceMin,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: {
      min: SpeedLevel.BALANCED,
      max: SpeedLevel.THOROUGH,
    },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  };
}

interface SeededEntry {
  id: string;
  skillId: string;
  variantId: string | null;
  modelSelection: ModelSelectionSimple;
}

interface SeedResult {
  firstCompanionId: string | null;
  entries: SeededEntry[];
}

async function seedFavorites(
  companionId: string,
  selected: Set<UseCase>,
  addFavorite: ReturnType<typeof useFavoriteCreate>["addFavorite"],
): Promise<SeedResult> {
  const companion = COMPANION_SKILLS.find((c) => c.id === companionId);
  if (!companion) {
    return { firstCompanionId: null, entries: [] };
  }

  const entries: SeededEntry[] = [];
  let firstCompanionId: string | null = null;

  // Create one favorite per companion variant
  const variants = companion.variants ?? [];
  for (const variant of variants) {
    const id = await addFavorite({
      skillId: companionId,
      variantId: variant.id,
      icon: companion.icon,
      voice: companion.voice,
      modelSelection: variant.modelSelection,
    });
    if (id) {
      if (variant.isDefault ?? false) {
        firstCompanionId = id;
      }
      entries.push({
        id,
        skillId: companionId,
        variantId: variant.id,
        modelSelection: variant.modelSelection,
      });
    }
  }

  // Fallback: if no variant was marked default, use the first one created
  if (!firstCompanionId && entries.length > 0) {
    firstCompanionId = entries[0]!.id;
  }

  const defaultModelSelection =
    entries.find((e) => e.id === firstCompanionId)?.modelSelection ??
    companion.modelSelection;
  const specialistModelSelection = getSpecialistModelSelection(
    defaultModelSelection,
  );
  const seededSkillIds = new Set<string>();

  for (const useCase of USE_CASE_IDS) {
    if (!selected.has(useCase)) {
      continue;
    }
    for (const skillId of USE_CASE_SKILL_IDS[useCase]) {
      if (seededSkillIds.has(skillId)) {
        continue;
      }
      seededSkillIds.add(skillId);
      const id = await addFavorite({
        skillId,
        modelSelection: specialistModelSelection,
      });
      if (id) {
        entries.push({
          id,
          skillId,
          variantId: null,
          modelSelection: specialistModelSelection,
        });
      }
    }
  }

  return { firstCompanionId, entries };
}

interface UsecasesStepProps {
  companionId: string;
  locale: CountryLanguage;
  onDone: () => void;
  onBack: () => void;
}

export function UsecasesStep({
  companionId,
  locale,
  onDone,
  onBack,
}: UsecasesStepProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [selected, setSelected] = useState<Set<UseCase>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { settings, setActiveFavorite } = useChatSettings(user, logger);
  const { addFavorite } = useFavoriteCreate(user, logger);
  const envAvailability = useEnvAvailability();

  const noProviderAvailable =
    !envAvailability.claudeCode && !envAvailability.openRouter;

  const toggleUseCase = useCallback((id: UseCase) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const applyOptimisticFavorites = useCallback(
    (entries: SeededEntry[], firstId: string | null) => {
      const { t: tSkill } = skillsScopedTranslation.scopedT(locale);
      const cards = entries.map((entry, index) => {
        const skill = DEFAULT_SKILLS.find((s) => s.id === entry.skillId);
        return ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
          {
            id: entry.id,
            skillId: entry.skillId,
            variantId: entry.variantId,
            customIcon: skill?.icon ?? null,
            voice: skill?.voice ?? null,
            modelSelection: entry.modelSelection,
            position: index,
          },
          skill?.modelSelection ?? null,
          skill?.icon ?? null,
          skill?.name ? tSkill(skill.name) : null,
          skill?.tagline ? tSkill(skill.tagline) : null,
          skill?.description ? tSkill(skill.description) : null,
          firstId,
          skill?.voice ?? null,
          locale,
          user,
        );
      });
      apiClient.updateEndpointData(
        favoritesDefinition.GET,
        logger,
        (oldData) => {
          const base = oldData?.success
            ? oldData.data
            : {
                totalCount: null,
                matchedCount: null,
                currentPage: null,
                totalPages: null,
                hint: null,
                favorites: [],
              };
          return success({ ...base, favorites: cards });
        },
      );
    },
    [logger, locale, user],
  );

  const handleStart = useCallback(async () => {
    setIsSaving(true);
    try {
      const { firstCompanionId, entries } = await seedFavorites(
        companionId,
        selected,
        addFavorite,
      );
      applyOptimisticFavorites(entries, firstCompanionId);
      onDone();
      if (firstCompanionId && settings?.ttsVoice) {
        const defaultEntry = entries.find((e) => e.id === firstCompanionId);
        const activeModelId =
          defaultEntry?.modelSelection.selectionType ===
          ModelSelectionType.MANUAL
            ? defaultEntry.modelSelection.manualModelId
            : ModelId.KIMI_K2_5;
        setActiveFavorite(
          firstCompanionId,
          companionId,
          activeModelId,
          settings.ttsVoice,
        );
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    selected,
    companionId,
    addFavorite,
    applyOptimisticFavorites,
    setActiveFavorite,
    settings?.ttsVoice,
    onDone,
  ]);

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
          disabled={isSaving}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("onboarding.back")}
        </Button>
      </Div>

      {/* Header */}
      <Div className="mb-4 shrink-0">
        <H3 className="text-base font-semibold mb-1">
          {t("onboarding.usecases.title")}
        </H3>
        <P className="text-xs text-muted-foreground">
          {t("onboarding.usecases.subtitle")}
        </P>
      </Div>

      {/* Use-case grid */}
      <Div className="grid grid-cols-2 gap-2 mb-5 shrink-0">
        {USE_CASE_IDS.map((uc) => (
          <UseCaseCard
            key={uc}
            useCase={uc}
            isSelected={selected.has(uc)}
            onToggle={() => toggleUseCase(uc)}
            t={t}
          />
        ))}
      </Div>

      {/* No provider error */}
      {noProviderAvailable && (
        <Div className="flex items-center gap-2 p-3 mb-3 bg-destructive/10 border-2 border-destructive/30 rounded-xl shrink-0">
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          <Span className="text-xs font-medium text-destructive">
            {t("onboarding.usecases.noProviderAvailable")}
          </Span>
        </Div>
      )}

      {/* Hint when nothing selected */}
      {selected.size === 0 && !noProviderAvailable && (
        <P className="text-xs text-muted-foreground text-center mb-3 shrink-0">
          {t("onboarding.usecases.hintNoneSelected")}
        </P>
      )}

      {/* Start button */}
      <Div className="shrink-0">
        <Button
          type="button"
          className="w-full h-11 text-base"
          disabled={isSaving || noProviderAvailable}
          onClick={handleStart}
        >
          {isSaving
            ? t("onboarding.usecases.saving")
            : t("onboarding.usecases.start")}
        </Button>
      </Div>
    </Div>
  );
}

interface UseCaseCardProps {
  useCase: UseCase;
  isSelected: boolean;
  onToggle: () => void;
  t: AiStreamT;
}

function UseCaseCard({
  useCase,
  isSelected,
  onToggle,
  t,
}: UseCaseCardProps): JSX.Element {
  return (
    <Div
      className={cn(
        "flex items-start gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer",
        "hover:shadow-sm active:scale-[0.99]",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-card hover:border-primary/40",
      )}
      onClick={onToggle}
    >
      <Div
        className={cn(
          "w-4 h-4 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors",
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/40",
        )}
      >
        {isSelected && (
          <Check className="h-2.5 w-2.5 text-primary-foreground" />
        )}
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-1.5 mb-0.5">
          {(() => {
            const IconComp = USE_CASE_ICONS[useCase];
            return (
              <IconComp className="h-4 w-4 text-muted-foreground shrink-0" />
            );
          })()}
          <Span className="text-sm font-medium">
            {t(`onboarding.usecases.${useCase}.label`)}
          </Span>
        </Div>
        <P className="text-xs text-muted-foreground leading-snug">
          {t(`onboarding.usecases.${useCase}.hint`)}
        </P>
      </Div>
    </Div>
  );
}
