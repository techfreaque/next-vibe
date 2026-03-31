"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { BookOpen } from "next-vibe-ui/ui/icons/BookOpen";
import { Briefcase } from "next-vibe-ui/ui/icons/Briefcase";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Flame } from "next-vibe-ui/ui/icons/Flame";
import { Heart } from "next-vibe-ui/ui/icons/Heart";
import { PenTool } from "next-vibe-ui/ui/icons/PenTool";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Users } from "next-vibe-ui/ui/icons/Users";
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
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import type { UserPermissionRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import { ChatFavoritesRepositoryClient } from "@/app/api/[locale]/agent/chat/favorites/repository-client";
import { useFavoriteCreate } from "@/app/api/[locale]/agent/chat/favorites/create/hooks";
import favoritesDefinition from "@/app/api/[locale]/agent/chat/favorites/definition";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/types";
import { ModelId } from "@/app/api/[locale]/agent/models/models";
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
  | "creative"
  | "learning"
  | "health"
  | "controversial"
  | "roleplay";

const USE_CASE_IDS: UseCase[] = [
  "coding",
  "research",
  "writing",
  "business",
  "creative",
  "learning",
  "health",
  "controversial",
  "roleplay",
];

type UseCaseIcon = React.ComponentType<{ className?: string }>;

const USE_CASE_ICONS: Record<UseCase, UseCaseIcon> = {
  coding: Code,
  research: Search,
  writing: PenTool,
  business: Briefcase,
  creative: Sparkles,
  learning: BookOpen,
  health: Heart,
  controversial: Flame,
  roleplay: Users,
};

const USE_CASE_SKILL_IDS: Record<UseCase, string[]> = {
  coding: ["vibe-coder", "coder"],
  research: ["researcher", "data-analyst"],
  writing: ["writer", "editor"],
  business: ["business-advisor", "financial-advisor"],
  creative: ["storyteller", "creative"],
  learning: ["tutor", "teacher"],
  health: ["health-wellness", "career-coach"],
  controversial: ["uncensored", "philosopher"],
  roleplay: ["roleplay-skill", "character-creator"],
};

interface SeededEntry {
  id: string;
  skillId: string;
  variantId: string | null;
  modelSelection: ModelSelectionSimple | null;
}

interface SeedResult {
  firstCompanionId: string | null;
  entries: SeededEntry[];
}

async function seedFavorites(
  companionId: string,
  selected: Set<UseCase>,
  addFavorite: ReturnType<typeof useFavoriteCreate>["addFavorite"],
  userRoles: readonly (typeof UserPermissionRoleValue)[],
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
      voiceId: companion.voiceId,
      modelSelection: variant.modelSelection ?? null,
    });
    if (id) {
      if (variant.isDefault ?? false) {
        firstCompanionId = id;
      }
      entries.push({
        id,
        skillId: companionId,
        variantId: variant.id,
        modelSelection: variant.modelSelection ?? null,
      });
    }
  }

  // Fallback: if no variant was marked default, use the first one created
  if (!firstCompanionId && entries.length > 0) {
    firstCompanionId = entries[0]!.id;
  }

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

      const skill = DEFAULT_SKILLS.find((s) => s.id === skillId);
      if (!skill) {
        continue;
      }

      // Skip skills the user doesn't have the required role for
      if (
        skill.userRole &&
        skill.userRole.length > 0 &&
        !skill.userRole.some((r) => userRoles.includes(r))
      ) {
        continue;
      }

      const skillVariants = skill.variants ?? [];
      if (skillVariants.length > 0) {
        for (const variant of skillVariants) {
          const id = await addFavorite({
            skillId,
            variantId: variant.id,
            modelSelection: variant.modelSelection ?? null,
          });
          if (id) {
            entries.push({
              id,
              skillId,
              variantId: variant.id,
              modelSelection: variant.modelSelection ?? null,
            });
          }
        }
      } else {
        const id = await addFavorite({
          skillId,
          modelSelection: null,
        });
        if (id) {
          entries.push({
            id,
            skillId,
            variantId: null,
            modelSelection: null,
          });
        }
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
  const userRoles = user.roles;

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
        const variant = entry.variantId
          ? skill?.variants?.find((v) => v.id === entry.variantId)
          : undefined;
        const effectiveModelSelection = variant?.modelSelection ?? null;
        return ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
          {
            id: entry.id,
            skillId: entry.skillId,
            variantId: entry.variantId,
            customIcon: skill?.icon ?? null,
            voiceId: skill?.voiceId ?? null,
            modelSelection: entry.modelSelection,
            position: index,
          },
          effectiveModelSelection,
          skill?.icon ?? null,
          skill?.name ? tSkill(skill.name) : null,
          skill?.tagline ? tSkill(skill.tagline) : null,
          skill?.description ? tSkill(skill.description) : null,
          firstId,
          skill?.voiceId ?? null,
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
        userRoles,
      );
      applyOptimisticFavorites(entries, firstCompanionId);
      onDone();
      try {
        if (firstCompanionId) {
          const defaultEntry = entries.find((e) => e.id === firstCompanionId);
          const activeModelId =
            defaultEntry?.modelSelection?.selectionType ===
            ModelSelectionType.MANUAL
              ? defaultEntry.modelSelection.manualModelId
              : ModelId.KIMI_K2_5;
          const companion = COMPANION_SKILLS.find((c) => c.id === companionId);
          const voice = settings?.voiceId ?? companion?.voiceId;
          if (voice) {
            setActiveFavorite(
              firstCompanionId,
              companionId,
              activeModelId,
              voice,
            );
          }
        }
      } catch (e) {
        logger.error(
          "Failed to set active favorite after onboarding",
          e instanceof Error ? e.message : String(e),
        );
      }
    } catch (e) {
      logger.error(
        "Onboarding seeding failed",
        e instanceof Error ? e.message : String(e),
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    selected,
    companionId,
    addFavorite,
    applyOptimisticFavorites,
    setActiveFavorite,
    settings?.voiceId,
    onDone,
    userRoles,
    logger,
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
      <Div className="grid grid-cols-3 gap-2 mb-5 shrink-0">
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
  const IconComp = USE_CASE_ICONS[useCase];
  const skillCount = USE_CASE_SKILL_IDS[useCase].length;

  return (
    <Div
      className={cn(
        "relative flex flex-col p-2.5 rounded-xl border-2 transition-all cursor-pointer",
        "hover:shadow-sm active:scale-[0.99]",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-card hover:border-primary/40",
      )}
      onClick={onToggle}
    >
      {/* Checkbox top-right */}
      <Div
        className={cn(
          "absolute top-2 right-2 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0",
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/40",
        )}
      >
        {isSelected && (
          <Check className="h-2.5 w-2.5 text-primary-foreground" />
        )}
      </Div>

      {/* Icon top-left */}
      <IconComp
        className={cn(
          "h-5 w-5 mb-1.5",
          isSelected ? "text-primary" : "text-muted-foreground",
        )}
      />

      {/* Label */}
      <Span className="text-xs font-medium leading-tight pr-5">
        {t(`onboarding.usecases.${useCase}.label`)}
      </Span>

      {/* Skill count badge */}
      <Span className="text-[10px] text-muted-foreground mt-1">
        {skillCount} {skillCount === 1 ? "skill" : "skills"}
      </Span>
    </Div>
  );
}
