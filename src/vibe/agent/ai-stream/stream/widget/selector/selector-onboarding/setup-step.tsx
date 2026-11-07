"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { success } from "next-vibe/core/route/response.schema";
import type { UserPermissionRoleValue } from "next-vibe/identity/roles/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Briefcase } from "next-vibe/ui/components/icons/Briefcase";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Code } from "next-vibe/ui/components/icons/Code";
import { Flame } from "next-vibe/ui/components/icons/Flame";
import { Heart } from "next-vibe/ui/components/icons/Heart";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { PenTool } from "next-vibe/ui/components/icons/PenTool";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { type JSX, useCallback, useState } from "react";

import { useChatSettings } from "../../../../../chat/settings/hooks";
import { formatSkillId, parseSkillId } from "../../../../../chat/slugify";
import type { AgentEnvAvailability } from "../../../../../env-availability";
import { useProviderAvailability } from "../../../../../env-availability-store";
import {
  COMPANION_SKILLS,
  DEFAULT_SKILLS,
  type Skill,
} from "../../../../../skills/config";
import { ModelSelectionType } from "../../../../../skills/enum";
import { useFavoriteCreate } from "../../../../../skills/favorites/create/hooks";
import favoritesDefinition from "../../../../../skills/favorites/definition";
import { ChatFavoritesRepositoryClient } from "../../../../../skills/favorites/repository-client";
import { scopedTranslation as skillsScopedTranslation } from "../../../../../skills/i18n";
import {
  DEFAULT_CHAT_MODEL_ID,
  DEFAULT_CHAT_MODEL_SELECTION,
} from "../../../../constants";
import {
  ChatModelId,
  type ChatModelSelection,
  getBestChatModel,
} from "../../../../models";
import type { AiStreamT } from "../../../i18n";
import { scopedTranslation } from "../../../i18n";

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
  controversial: ["uncensored", "philosopher", "4chan", "neet"],
  roleplay: ["roleplay-skill", "character-creator"],
};

interface SeededEntry {
  id: string;
  /** Merged format: "skillSlug" or "skillSlug__variantId" */
  skillId: string;
  modelSelection: ChatModelSelection | null;
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
  availability: AgentEnvAvailability,
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
      skillId: formatSkillId(companionId, variant.id),
      icon: companion.icon,
      modelSelection: variant.modelSelection,
      voiceModelSelection: variant.voiceModelSelection,
      sttModelSelection: variant.sttModelSelection,
      imageVisionModelSelection: variant.imageVisionModelSelection,
      videoVisionModelSelection: variant.videoVisionModelSelection,
      audioVisionModelSelection: variant.audioVisionModelSelection,
      imageGenModelSelection: variant.imageGenModelSelection,
      musicGenModelSelection: variant.musicGenModelSelection,
      videoGenModelSelection: variant.videoGenModelSelection,
    });
    if (id) {
      if (variant.isDefault ?? false) {
        firstCompanionId = id;
      }
      entries.push({
        id,
        skillId: formatSkillId(companionId, variant.id),
        modelSelection: variant.modelSelection ?? null,
      });
    }
  }

  // Fallback: if no variant was marked default, use the first one created
  if (!firstCompanionId && entries.length > 0) {
    firstCompanionId = entries[0]!.id;
  }

  const seededSkillIds = new Set<string>();

  // Always seed vibe-coder for admins on local instances
  const isAdmin = userRoles.includes(UserPermissionRole.ADMIN);
  if (isAdmin && availability.claudeCode) {
    const vibeCoderSkill = DEFAULT_SKILLS.find((s) => s.id === "vibe-coder");
    if (vibeCoderSkill && !seededSkillIds.has("vibe-coder")) {
      seededSkillIds.add("vibe-coder");
      for (const variant of vibeCoderSkill.variants ?? []) {
        const id = await addFavorite({
          skillId: formatSkillId("vibe-coder", variant.id),
          icon: vibeCoderSkill.icon,
          modelSelection: variant.modelSelection,
          voiceModelSelection: variant.voiceModelSelection,
          sttModelSelection: variant.sttModelSelection,
          imageVisionModelSelection: variant.imageVisionModelSelection,
          videoVisionModelSelection: variant.videoVisionModelSelection,
          audioVisionModelSelection: variant.audioVisionModelSelection,
          imageGenModelSelection: variant.imageGenModelSelection,
          musicGenModelSelection: variant.musicGenModelSelection,
          videoGenModelSelection: variant.videoGenModelSelection,
        });
        if (id) {
          entries.push({
            id,
            skillId: formatSkillId("vibe-coder", variant.id),
            modelSelection: variant.modelSelection ?? null,
          });
        }
      }
    }
  }

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
            skillId: formatSkillId(skillId, variant.id),
            icon: skill.icon,
            modelSelection: variant.modelSelection,
            voiceModelSelection: variant.voiceModelSelection,
            sttModelSelection: variant.sttModelSelection,
            imageVisionModelSelection: variant.imageVisionModelSelection,
            videoVisionModelSelection: variant.videoVisionModelSelection,
            audioVisionModelSelection: variant.audioVisionModelSelection,
            imageGenModelSelection: variant.imageGenModelSelection,
            musicGenModelSelection: variant.musicGenModelSelection,
            videoGenModelSelection: variant.videoGenModelSelection,
          });
          if (id) {
            entries.push({
              id,
              skillId: formatSkillId(skillId, variant.id),
              modelSelection: variant.modelSelection ?? null,
            });
          }
        }
      } else {
        const fallbackVariant =
          skill.variants.find((v) => v.isDefault) ?? skill.variants[0];
        const id = await addFavorite({
          skillId,
          icon: skill.icon,
          modelSelection: fallbackVariant?.modelSelection,
          voiceModelSelection: fallbackVariant?.voiceModelSelection,
          sttModelSelection: fallbackVariant?.sttModelSelection,
          imageVisionModelSelection: fallbackVariant?.imageVisionModelSelection,
          videoVisionModelSelection: fallbackVariant?.videoVisionModelSelection,
          audioVisionModelSelection: fallbackVariant?.audioVisionModelSelection,
          imageGenModelSelection: fallbackVariant?.imageGenModelSelection,
          musicGenModelSelection: fallbackVariant?.musicGenModelSelection,
          videoGenModelSelection: fallbackVariant?.videoGenModelSelection,
        });
        if (id) {
          entries.push({
            id,
            skillId,
            modelSelection: fallbackVariant?.modelSelection ?? null,
          });
        }
      }
    }
  }

  return { firstCompanionId, entries };
}

interface SetupStepProps {
  locale: CountryLanguage;
  onDone: (firstCompanionId: string | null) => void;
}

/**
 * Single-screen first-run setup inside the model selector.
 * Companion is preselected so one tap on "Start chatting" is enough;
 * specialists are optional chips. Guests see an inline note, not a blocking step.
 */
export function SetupStep({ locale, onDone }: SetupStepProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [companionId, setCompanionId] = useState<string | null>(
    COMPANION_SKILLS[0]?.id ?? null,
  );
  const [selected, setSelected] = useState<Set<UseCase>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const availability = useProviderAvailability();
  const { setActiveFavorite } = useChatSettings(user, logger);
  const { addFavorite } = useFavoriteCreate(user, logger);
  const noProviderAvailable =
    !availability.claudeCode &&
    !availability.openRouter &&
    !availability.unbottledSystem &&
    !availability.uncensoredAI &&
    !availability.freedomGPT &&
    !availability.gabAI &&
    !availability.veniceAI &&
    !availability.nanoGPT;
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
        const { skillId: entryBaseId, variantId: entryVariantId } =
          parseSkillId(entry.skillId);
        const skill = DEFAULT_SKILLS.find((s) => s.id === entryBaseId);
        const variant = entryVariantId
          ? skill?.variants?.find((v) => v.id === entryVariantId)
          : undefined;
        const effectiveModelSelection = variant?.modelSelection ?? null;
        const skillVoiceSel =
          variant?.voiceModelSelection ??
          (skill
            ? (skill.variants.find((v) => v.isDefault) ?? skill.variants[0])
                ?.voiceModelSelection
            : null) ??
          null;
        return ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
          {
            id: entry.id,
            skillId: entry.skillId, // merged format
            customIcon: skill?.icon ?? null,
            voiceModelSelection: skillVoiceSel,
            modelSelection: entry.modelSelection,
            position: index,
          },
          effectiveModelSelection,
          skill?.icon ?? null,
          skill?.name ? tSkill(skill.name) : null,
          skill?.tagline ? tSkill(skill.tagline) : null,
          skill?.description ? tSkill(skill.description) : null,
          firstId,
          skillVoiceSel,
          locale,
          user,
          availability,
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
    [logger, locale, user, availability],
  );

  const handleStart = useCallback(async () => {
    if (!companionId) {
      return;
    }
    setIsSaving(true);
    try {
      const { firstCompanionId, entries } = await seedFavorites(
        companionId,
        selected,
        addFavorite,
        userRoles,
        availability,
      );
      applyOptimisticFavorites(entries, firstCompanionId);
      onDone(firstCompanionId);
      try {
        if (firstCompanionId) {
          const defaultEntry = entries.find((e) => e.id === firstCompanionId);
          const sel = defaultEntry?.modelSelection;
          const resolvedAnyId =
            sel?.selectionType === ModelSelectionType.MANUAL
              ? sel.manualModelId
              : sel
                ? (getBestChatModel(sel, user, availability)?.id ??
                  getBestChatModel(
                    DEFAULT_CHAT_MODEL_SELECTION,
                    user,
                    availability,
                  )?.id)
                : getBestChatModel(
                    DEFAULT_CHAT_MODEL_SELECTION,
                    user,
                    availability,
                  )?.id;
          const activeModelId: ChatModelId =
            (resolvedAnyId !== undefined
              ? Object.values(ChatModelId).find((id) => id === resolvedAnyId)
              : undefined) ?? DEFAULT_CHAT_MODEL_ID;
          setActiveFavorite(firstCompanionId, companionId, activeModelId);
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
    onDone,
    userRoles,
    logger,
    user,
    availability,
  ]);

  return (
    <Div className="flex flex-col" data-testid="selector-setup">
      <Div className="flex flex-col gap-5 px-5 pt-5 pb-4">
        {/* Header */}
        <Div className="flex flex-col gap-1">
          <H3 className="text-lg font-semibold tracking-tight">
            {t("onboarding.setup.title")}
          </H3>
          <P className="text-sm text-muted-foreground leading-snug">
            {t("onboarding.setup.subtitle")}
          </P>
        </Div>

        {/* Companion - preselected, single choice */}
        <Div className="flex flex-col gap-2">
          <SectionLabel>{t("onboarding.setup.companionLabel")}</SectionLabel>
          <Div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {COMPANION_SKILLS.map((skill) => (
              <CompanionOption
                key={skill.id}
                skill={skill}
                isSelected={companionId === skill.id}
                onSelect={() => setCompanionId(skill.id)}
                locale={locale}
              />
            ))}
          </Div>
        </Div>

        {/* Specialists - optional chips */}
        <Div className="flex flex-col gap-2">
          <SectionLabel>
            {t("onboarding.setup.specialistsLabel")}
            <Span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 font-medium normal-case tracking-normal text-muted-foreground">
              {t("onboarding.setup.optional")}
            </Span>
          </SectionLabel>
          <Div className="flex flex-wrap gap-2">
            {USE_CASE_IDS.map((uc) => (
              <UseCaseChip
                key={uc}
                useCase={uc}
                isSelected={selected.has(uc)}
                onToggle={() => toggleUseCase(uc)}
                t={t}
              />
            ))}
          </Div>
        </Div>

        {/* Guest note - inline, never blocking */}
        {user.isPublic && (
          <Div className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <Span className="leading-relaxed">
              {t("onboarding.setup.guestNote")}{" "}
              <Link
                href={`/${locale}/user/signup`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {t("onboarding.setup.signIn")}
              </Link>
            </Span>
          </Div>
        )}

        {noProviderAvailable && (
          <Div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
            <Span className="text-xs font-medium text-destructive">
              {t("onboarding.usecases.noProviderAvailable")}
            </Span>
          </Div>
        )}
      </Div>

      {/* Sticky CTA */}
      <Div className="sticky bottom-0 border-t border-border bg-popover px-5 py-3">
        <Button
          type="button"
          className="w-full h-11 text-base gap-2"
          disabled={isSaving || noProviderAvailable || !companionId}
          onClick={handleStart}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("onboarding.setup.saving")}
            </>
          ) : (
            <>
              {t("onboarding.setup.start")}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </Div>
    </Div>
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </Span>
  );
}

interface CompanionOptionProps {
  skill: Skill;
  isSelected: boolean;
  onSelect: () => void;
  locale: CountryLanguage;
}

function CompanionOption({
  skill,
  isSelected,
  onSelect,
  locale,
}: CompanionOptionProps): JSX.Element {
  const { t } = skillsScopedTranslation.scopedT(locale);

  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={cn(
        "relative h-auto w-full justify-start gap-3 rounded-xl border p-3 text-left font-normal whitespace-normal",
        "transition-colors active:scale-[0.99]",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary hover:bg-primary/5"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent",
      )}
    >
      <Div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10",
        )}
      >
        <Icon
          icon={skill.icon}
          className={cn("h-5 w-5", !isSelected && "text-primary")}
        />
      </Div>
      <Div className="flex min-w-0 flex-1 flex-col">
        <Span className="text-sm font-semibold leading-tight">
          {t(skill.name)}
        </Span>
        <Span className="text-xs text-muted-foreground leading-snug">
          {t(skill.tagline)}
        </Span>
      </Div>
      <Div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/30",
        )}
      >
        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
      </Div>
    </Button>
  );
}

interface UseCaseChipProps {
  useCase: UseCase;
  isSelected: boolean;
  onToggle: () => void;
  t: AiStreamT;
}

function UseCaseChip({
  useCase,
  isSelected,
  onToggle,
  t,
}: UseCaseChipProps): JSX.Element {
  const IconComp = USE_CASE_ICONS[useCase];

  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={isSelected}
      onClick={onToggle}
      title={t(`onboarding.usecases.${useCase}.hint`)}
      className={cn(
        "h-9 gap-1.5 rounded-full border px-3 text-sm font-normal",
        isSelected
          ? "border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
          : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {isSelected ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <IconComp className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      {t(`onboarding.usecases.${useCase}.label`)}
    </Button>
  );
}
