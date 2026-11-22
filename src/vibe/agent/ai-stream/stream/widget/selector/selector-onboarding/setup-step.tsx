"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import {
  UserPermissionRole,
  type UserPermissionRoleValue,
} from "next-vibe/identity/roles/enum";
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
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { PenTool } from "next-vibe/ui/components/icons/PenTool";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { setLocalItem } from "next-vibe/ui/lib/storage";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import { type JSX, useCallback, useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS } from "../../../../../chat/constants";
import { useProviderAvailability } from "../../../../../env-availability-store";
import { COMPANION_SKILLS, DEFAULT_SKILLS } from "../../../../../skills/config";
import { useChatFavorites } from "../../../../../skills/favorites/hooks/hooks";
import { scopedTranslation as skillsScopedTranslation } from "../../../../../skills/i18n";
import type { AiStreamT } from "../../../i18n";
import { scopedTranslation } from "../../../i18n";
import { useArrivalStore } from "./arrival-store";
import {
  activateFavorite,
  addAndActivateArrival,
  type ArrivalSkill,
  refreshFavorites,
  resolveArrivalSkill,
  seedCompanion,
  seedSpecialists,
} from "./seed";
import { trackOnboarding } from "./track";

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
  coding: ["vibe-coder", "coder", "hacker"],
  research: ["researcher", "data-analyst"],
  writing: ["writer", "editor"],
  business: ["business-advisor", "financial-advisor"],
  creative: ["storyteller", "creative"],
  learning: ["tutor", "teacher"],
  health: ["health-wellness", "career-coach"],
  controversial: ["uncensored", "philosopher", "4chan", "neet"],
  roleplay: ["roleplay-skill"],
};

interface SetupStepProps {
  locale: CountryLanguage;
  onDone: () => void;
}

/**
 * Single-screen first-run setup inside the model selector.
 * Companion is preselected so one tap on "Start chatting" is enough;
 * specialists are optional chips. A skill the visitor arrived with (skill
 * landing page) is shown on top and included. Guests passed the sign-in
 * step (signin-step.tsx) before this one.
 */
export function SetupStep({ locale, onDone }: SetupStepProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const availability = useProviderAvailability();
  const { favorites } = useChatFavorites(logger, { activeFavoriteId: null });
  const pendingSkillId = useArrivalStore((s) => s.pendingSkillId);
  const setPendingSkillId = useArrivalStore((s) => s.setPendingSkillId);

  const [companionId, setCompanionId] = useState<string | null>(
    COMPANION_SKILLS[0]?.id ?? null,
  );
  const [selected, setSelected] = useState<Set<UseCase>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  /** Seeding produced no companion - stay here with a retry instead of an empty list */
  const [seedFailed, setSeedFailed] = useState(false);
  /** Lookup result for the pending skill (null skill = unusable link) */
  const [arrivalLookup, setArrivalLookup] = useState<{
    param: string;
    skill: ArrivalSkill | null;
  } | null>(null);

  const deps = useMemo(
    () => ({ user, logger, locale }),
    [user, logger, locale],
  );
  const mode = pendingSkillId ? "arrival" : "full";

  const noProviderAvailable =
    !availability.claudeCode &&
    !availability.openRouter &&
    !availability.unbottledSystem &&
    !availability.uncensoredAI &&
    !availability.freedomGPT &&
    !availability.gabAI &&
    !availability.veniceAI &&
    !availability.nanoGPT;

  // Look up the skill the visitor arrived with, to show and add it.
  useEffect(() => {
    if (!pendingSkillId) {
      return;
    }
    let cancelled = false;
    void resolveArrivalSkill(pendingSkillId, deps).then((skill) => {
      if (cancelled) {
        return undefined;
      }
      setArrivalLookup({ param: pendingSkillId, skill });
      // A companion link (e.g. ?skill=hermes) preselects that companion.
      if (skill?.isCompanion) {
        setCompanionId(skill.baseId);
      }
      return undefined;
    });
    return (): void => {
      cancelled = true;
    };
  }, [pendingSkillId, deps]);

  const arrivalLoading =
    pendingSkillId !== null && arrivalLookup?.param !== pendingSkillId;
  const arrivalSkill =
    !arrivalLoading &&
    pendingSkillId !== null &&
    arrivalLookup?.skill &&
    !arrivalLookup.skill.isCompanion
      ? arrivalLookup.skill
      : null;

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

  const handleStart = useCallback(async (): Promise<void> => {
    if (!companionId || isSaving) {
      return;
    }
    setIsSaving(true);
    setSeedFailed(false);
    try {
      // Companion first: the create path then sees a companion and adds no
      // automatic default next to the arrival skill or the specialists.
      const companion = await seedCompanion(companionId, deps);
      if (!companion) {
        setSeedFailed(true);
        return;
      }

      const specialistIds: string[] = [];
      const userRoles: readonly (typeof UserPermissionRoleValue)[] = user.roles;
      if (
        userRoles.includes(UserPermissionRole.ADMIN) &&
        availability.claudeCode
      ) {
        specialistIds.push("vibe-coder");
      }
      for (const useCase of USE_CASE_IDS) {
        if (selected.has(useCase)) {
          specialistIds.push(...USE_CASE_SKILL_IDS[useCase]);
        }
      }

      const arrivalFavorite = arrivalSkill
        ? await addAndActivateArrival(
            arrivalSkill,
            favorites,
            deps,
            availability,
          )
        : null;
      await seedSpecialists(
        specialistIds.filter((id) => id !== arrivalSkill?.baseId),
        deps,
      );
      if (!arrivalFavorite) {
        await activateFavorite(companion, deps);
      }

      setLocalItem(STORAGE_KEYS.SELECTOR_ONBOARDING_SHOWN, "true", logger);
      setPendingSkillId(null);
      trackOnboarding(logger, "completed", {
        mode,
        companionId,
        specialists: [...selected].join(",") || undefined,
        arrivalSkillId: arrivalSkill?.param,
      });
      await refreshFavorites(logger);
      // The selector stays open on the new favorites list.
      onDone();
    } catch (error) {
      logger.error("Onboarding seeding failed", parseError(error), {
        component: "SelectorOnboardingSetupStep",
        operation: "handleStart",
        companionId,
        selectedCount: selected.size,
        arrivalSkillId: arrivalSkill?.param ?? null,
      });
      setSeedFailed(true);
    } finally {
      setIsSaving(false);
    }
  }, [
    companionId,
    isSaving,
    deps,
    user.roles,
    availability,
    selected,
    arrivalSkill,
    favorites,
    logger,
    setPendingSkillId,
    mode,
    onDone,
  ]);

  return (
    <Div className="flex flex-col" data-testid="selector-setup">
      <Div className="flex flex-col gap-5 px-5 pt-5 pb-4">
        {/* Header */}
        <Div className="flex flex-col gap-1">
          <H3 className="text-lg font-semibold tracking-tight">
            {arrivalSkill
              ? t("onboarding.setup.arrivalTitle", { skill: arrivalSkill.name })
              : t("onboarding.setup.title")}
          </H3>
          <P className="text-sm text-muted-foreground leading-snug">
            {arrivalSkill
              ? t("onboarding.setup.arrivalSubtitle", {
                  skill: arrivalSkill.name,
                })
              : t("onboarding.setup.subtitle")}
          </P>
        </Div>

        {/* Arrival skill - included, shown first */}
        {arrivalSkill ? (
          <Div className="flex flex-col gap-2">
            <SectionLabel>{t("onboarding.setup.arrivalLabel")}</SectionLabel>
            <OptionCard
              icon={arrivalSkill.icon}
              title={arrivalSkill.name}
              subtitle={null}
              isSelected
              badge={t("onboarding.setup.arrivalBadge")}
              testId="selector-setup-arrival"
            />
          </Div>
        ) : null}

        {/* Companion - preselected, single choice */}
        <Div className="flex flex-col gap-2">
          <SectionLabel>{t("onboarding.setup.companionLabel")}</SectionLabel>
          <Div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {COMPANION_SKILLS.map((skill) => (
              <CompanionOption
                key={skill.id}
                skillId={skill.id}
                icon={skill.icon}
                nameKey={skill.name}
                taglineKey={skill.tagline}
                isSelected={companionId === skill.id}
                onSelect={setCompanionId}
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
                onToggle={toggleUseCase}
                t={t}
                locale={locale}
              />
            ))}
          </Div>
        </Div>

        {noProviderAvailable && (
          <Div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
            <Span className="text-xs font-medium text-destructive">
              {t("onboarding.setup.noProviderAvailable")}
            </Span>
          </Div>
        )}
      </Div>

      {/* Sticky CTA */}
      <Div className="sticky bottom-0 flex flex-col gap-2 border-t border-border bg-popover px-5 py-3">
        {seedFailed && !isSaving && (
          <Div
            role="alert"
            data-testid="selector-setup-error"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <Span className="text-xs font-medium text-destructive">
              {t("onboarding.setup.failed")}
            </Span>
          </Div>
        )}
        <Button
          type="button"
          className="w-full h-11 text-base gap-2"
          disabled={
            isSaving || noProviderAvailable || !companionId || arrivalLoading
          }
          onClick={() => void handleStart()}
          data-testid="selector-setup-start"
        >
          {isSaving || arrivalLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isSaving ? t("onboarding.setup.saving") : null}
            </>
          ) : (
            <>
              {seedFailed
                ? t("onboarding.setup.retry")
                : t("onboarding.setup.start")}
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

interface OptionCardProps {
  icon: IconKey | null;
  title: string;
  subtitle: string | null;
  isSelected: boolean;
  badge: string | null;
  testId: string;
}

/** Static selected card (the included arrival skill). */
function OptionCard({
  icon,
  title,
  subtitle,
  isSelected,
  badge,
  testId,
}: OptionCardProps): JSX.Element {
  return (
    <Div
      data-testid={testId}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-3",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border bg-card",
      )}
    >
      <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        {icon ? <Icon icon={icon} className="h-5 w-5" /> : null}
      </Div>
      <Div className="flex min-w-0 flex-1 flex-col">
        <Span className="truncate text-sm font-semibold leading-tight">
          {title}
        </Span>
        {subtitle ? (
          <Span className="text-xs text-muted-foreground leading-snug">
            {subtitle}
          </Span>
        ) : null}
      </Div>
      {badge ? (
        <Span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          <Check className="h-3 w-3" />
          {badge}
        </Span>
      ) : null}
    </Div>
  );
}

interface CompanionOptionProps {
  skillId: string;
  icon: IconKey;
  nameKey: (typeof COMPANION_SKILLS)[number]["name"];
  taglineKey: (typeof COMPANION_SKILLS)[number]["tagline"];
  isSelected: boolean;
  onSelect: (skillId: string) => void;
  locale: CountryLanguage;
}

function CompanionOption({
  skillId,
  icon,
  nameKey,
  taglineKey,
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
      onClick={() => onSelect(skillId)}
      data-testid={`selector-setup-companion-${skillId}`}
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
          icon={icon}
          className={cn("h-5 w-5", !isSelected && "text-primary")}
        />
      </Div>
      <Div className="flex min-w-0 flex-1 flex-col">
        <Span className="text-sm font-semibold leading-tight">
          {t(nameKey)}
        </Span>
        <Span className="text-xs text-muted-foreground leading-snug">
          {t(taglineKey)}
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
  onToggle: (useCase: UseCase) => void;
  t: AiStreamT;
  locale: CountryLanguage;
}

function UseCaseChip({
  useCase,
  isSelected,
  onToggle,
  t,
  locale,
}: UseCaseChipProps): JSX.Element {
  const IconComp = USE_CASE_ICONS[useCase];
  const { t: tSkill } = skillsScopedTranslation.scopedT(locale);
  // Tooltip names the skills this chip adds, straight from the skill config.
  const hint = USE_CASE_SKILL_IDS[useCase]
    .map((id) => DEFAULT_SKILLS.find((s) => s.id === id))
    .filter((skill) => skill !== undefined)
    .map((skill) => tSkill(skill.name))
    .join(", ");

  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={isSelected}
      onClick={() => onToggle(useCase)}
      title={hint}
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
      {t(`onboarding.usecases.${useCase}`)}
    </Button>
  );
}
