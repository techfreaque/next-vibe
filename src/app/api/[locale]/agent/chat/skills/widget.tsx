/**
 * Custom Widget for Skills List
 */

"use client";

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Maximize } from "next-vibe-ui/ui/icons/Maximize";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { ThumbsUp } from "next-vibe-ui/ui/icons/ThumbsUp";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { X } from "next-vibe-ui/ui/icons/X";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Input } from "next-vibe-ui/ui/input";
import { Link } from "next-vibe-ui/ui/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import { useEffect, useMemo, useState } from "react";

import { useTourState } from "@/app/api/[locale]/agent/chat/tour-state";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import BadgeWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/widget";
import IconWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/widget";
import { SeparatorWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/widget";
import TextWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";

import { cn } from "../../../shared/utils";
import { Icon } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useSelectorOnboardingContext } from "../../ai-stream/stream/widget/selector/selector-onboarding/context";

import { parseSkillId } from "../slugify";
import { useAddToFavorites } from "../favorites/create/hooks";
import { useChatFavorites } from "../favorites/hooks/hooks";
import { useChatSettings } from "../settings/hooks";
import skillDetailDefinitions from "./[id]/definition";
import { COMPANION_SKILLS } from "./config";
import type definition from "./definition";
import type { SkillListItem } from "./definition";
import { SkillOwnershipType, SkillSourceFilter, SkillTrustLevel } from "./enum";
import { getBestChatModelForFavorite } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

/**
 * Custom container widget for skills list
 */
export function SkillsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { push: navigate } = useWidgetNavigation();
  const context = useWidgetContext();
  const { logger, locale, user } = context;
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const skillsData = useWidgetValue<typeof definition.GET>();
  const isTouch = useTouchDevice();
  const [isFullPage, setIsFullPage] = useState(false);
  useEffect(() => {
    setIsFullPage(window.location.pathname.includes("/skills"));
  }, []);
  const isPublic = user.isPublic;
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const searchQuery = form.watch("query") ?? "";
  const sourceFilter = form.watch("sourceFilter") ?? "";
  const { isOnboarding, companionSkillId } = useSelectorOnboardingContext();
  const setModelSelectorOpen = useTourState(
    (state) => state.setModelSelectorOpen,
  );

  // Read active favorite from settings so activate state reflects correctly
  const { settings } = useChatSettings(user, logger);
  const settingsActiveFavoriteId = settings?.activeFavoriteId ?? null;

  // Fetch favorites to calculate favoriteIds for each skill
  const { favorites } = useChatFavorites(logger, {
    activeFavoriteId: settingsActiveFavoriteId,
  });
  const activeFavoriteId = settingsActiveFavoriteId;

  // Group favorites by base skill ID (for skill-level indicators)
  // fav.skillId is merged format "slug" or "slug__variantId" — extract base slug
  const favoritesBySkill = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (favorites) {
      for (const fav of favorites) {
        const baseSkillId = parseSkillId(fav.skillId).skillId;
        if (!map[baseSkillId]) {
          map[baseSkillId] = [];
        }
        map[baseSkillId].push(fav.id);
      }
    }
    return map;
  }, [favorites]);

  // Per-variant favorites map: merged skillId -> favoriteId[]
  const favoritesByVariant = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (favorites) {
      for (const fav of favorites) {
        if (parseSkillId(fav.skillId).variantId) {
          const key = fav.skillId;
          if (!map[key]) {
            map[key] = [];
          }
          map[key].push(fav.id);
        }
      }
    }
    return map;
  }, [favorites]);

  // When query is active: server already filtered by source - flatten all sections
  // into a single ranked list (VERIFIED first, then by voteCount desc).
  // When no query: return sections as-is (server already applied source filter).
  const filteredSections = useMemo(() => {
    const sections = skillsData?.sections;
    if (!sections) {
      return null;
    }
    if (!searchQuery.trim()) {
      return sections;
    }
    // Server already filtered by source - just flatten and rank
    const allSkills = sections.flatMap((section) => section.skills);
    const ranked = allSkills.toSorted((a, b) => {
      const aVerified = a.trustLevel === SkillTrustLevel.VERIFIED ? 0 : 1;
      const bVerified = b.trustLevel === SkillTrustLevel.VERIFIED ? 0 : 1;
      if (aVerified !== bVerified) {
        return aVerified - bVerified;
      }
      return (b.voteCount ?? 0) - (a.voteCount ?? 0);
    });
    if (ranked.length === 0) {
      return [];
    }
    return [
      {
        sectionIcon: "search" as const,
        sectionTitle: t("get.search.results"),
        sectionCount: ranked.length,
        skills: ranked,
      },
    ];
  }, [skillsData?.sections, searchQuery, t]);

  // Get companion skill name for onboarding banner
  const companionSkill = companionSkillId
    ? COMPANION_SKILLS.find((c) => c.id === companionSkillId)
    : null;

  const handleCreateCustomClick = async (): Promise<void> => {
    if (isPublic) {
      // Show signup prompt for public users
      setShowSignupPrompt(true);
    } else {
      // Navigate to skill create for authenticated users
      const createSkillDefinitions = await import("./create/definition");
      navigate(createSkillDefinitions.default.POST, {
        replaceOnSuccess: {
          endpoint: skillDetailDefinitions.GET,
          getUrlPathParams: (responseData) => ({ id: responseData.id }),
          prefillFromGet: true,
          getEndpoint: skillDetailDefinitions.GET,
        },
      });
    }
  };

  // Show signup prompt if public user clicked create
  if (isPublic && showSignupPrompt) {
    return (
      <Div className="flex flex-col gap-0">
        {/* Top Actions: Back */}
        <Div className="flex flex-row gap-2 px-4 py-4">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => setShowSignupPrompt(false)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("get.signupPrompt.backButton")}
          </Button>
        </Div>

        {/* Signup Prompt */}
        <Div className="border-t border-border p-6 overflow-y-auto max-h-[min(800px,calc(100dvh-180px))]">
          <Div className="max-w-md mx-auto flex flex-col gap-6 text-center">
            <Div className="text-xl font-semibold">
              {t("get.signupPrompt.title")}
            </Div>
            <Div className="text-muted-foreground">
              {t("get.signupPrompt.description")}
            </Div>

            {/* CTA Links */}
            <Div className="flex flex-col gap-3 mt-4">
              <Link href={`/${locale}/user/signup`} className="no-underline">
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="gap-2 w-full"
                >
                  <UserPlus className="h-4 w-4" />
                  {t("get.signupPrompt.signupButton")}
                </Button>
              </Link>
              <Link href={`/${locale}/user/login`} className="no-underline">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="gap-2 w-full"
                >
                  <LogIn className="h-4 w-4" />
                  {t("get.signupPrompt.loginButton")}
                </Button>
              </Link>
            </Div>
          </Div>
        </Div>
      </Div>
    );
  }

  // Loading state - show spinner that fills the scrollable area
  if (!skillsData) {
    return (
      <Div
        className={`flex flex-col gap-0${isFullPage ? "" : " h-[min(800px,calc(100dvh-100px))]"}`}
      >
        {/* Top Actions: Back + Create + Fullscreen */}
        {!isOnboarding && (
          <Div className="flex flex-row gap-2 px-4 py-4 shrink-0">
            <NavigateButtonWidget field={children.backButton} />
            <Div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={handleCreateCustomClick}
              >
                {t("get.createButton.label")}
              </Button>
              {!isFullPage && (
                <Link
                  href={`/${locale}/skills`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  title={t("get.openFullPage")}
                >
                  <Maximize className="h-4 w-4" />
                </Link>
              )}
            </Div>
          </Div>
        )}

        {/* Loading Spinner - fills the scrollable space */}
        <Div className="border-t border-border flex-1 flex items-center justify-center min-h-0">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      </Div>
    );
  }

  // Both public and authenticated users see the same skill list
  return (
    <Div
      className={`flex flex-col gap-0${isFullPage ? "" : " h-[min(800px,calc(100dvh-100px))]"}`}
    >
      {/* Top Actions: Back + Create + Fullscreen */}
      {!isOnboarding && (
        <Div className="flex flex-row gap-2 px-4 py-4 shrink-0">
          <NavigateButtonWidget field={children.backButton} />
          <Div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleCreateCustomClick}
            >
              {t("get.createButton.label")}
            </Button>
            {!isFullPage && (
              <Link
                href={`/${locale}/skills`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                title={t("get.openFullPage")}
              >
                <Maximize className="h-4 w-4" />
              </Link>
            )}
          </Div>
        </Div>
      )}

      {/* Scrollable Content */}
      <Div
        className={`border-t border-border flex-1${isFullPage ? "" : " overflow-y-auto"}`}
      >
        <Div className="p-4">
          {/* Onboarding Success Banner */}
          {isOnboarding && companionSkill && (
            <Div className="bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 rounded-lg px-4 py-4 mb-6 shadow-sm">
              <Div className="flex flex-col items-center text-center gap-3">
                <Div className="rounded-full bg-primary/20 p-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </Div>
                <Div className="flex flex-col gap-1">
                  <Div className="text-base font-semibold text-primary">
                    {t("onboarding.success.title", {
                      companion: t(companionSkill.name),
                    })}
                  </Div>
                  <Div className="text-sm text-muted-foreground">
                    {t("onboarding.success.subtitle")}
                  </Div>
                </Div>
              </Div>
            </Div>
          )}
          {/* Direct Model Access Section */}
          <TextWidget field={children.title} fieldName="title" />
          <TextWidget field={children.description} fieldName="description" />

          {/* Direct Model Card - Optimized for narrow width */}
          <Div className="rounded-lg border border-primary/30 hover:border-primary/40 hover:shadow-md transition-colors mb-6 p-3">
            <Div className="flex flex-col gap-3">
              {/* Header: Icon + Name */}
              <Div className="flex items-center gap-2">
                <IconWidget field={children.icon} fieldName="icon" />
                <TextWidget field={children.name} fieldName="name" />
              </Div>

              {/* Description */}
              <TextWidget
                field={children.modelDescription}
                fieldName="modelDescription"
              />

              {/* Button - Full Width */}
              <NavigateButtonWidget field={children.selectButton} />
            </Div>
          </Div>

          <SeparatorWidget field={children.separator} />

          {/* Skills Section */}
          <TextWidget field={children.skillsTitle} fieldName="skillsTitle" />
          <TextWidget field={children.skillsDesc} fieldName="skillsDesc" />

          {/* Search + source filter */}
          <Div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Search bar */}
            <Div className="relative flex-1 min-w-[140px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  form.setValue("query", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                placeholder={t("get.search.placeholder")}
                className="pl-9 pr-8 h-9 text-sm"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() =>
                    form.setValue("query", "", {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </Div>

            {/* Source filter pills */}
            {!isOnboarding && (
              <Div className="flex rounded-md border border-border p-0.5">
                {(
                  [
                    {
                      value: SkillSourceFilter.BUILT_IN,
                      label: "enums.source.builtIn" as const,
                    },
                    {
                      value: SkillSourceFilter.COMMUNITY,
                      label: "enums.source.community" as const,
                    },
                    ...(!isPublic
                      ? [
                          {
                            value: SkillSourceFilter.MY,
                            label: "enums.source.my" as const,
                          },
                        ]
                      : []),
                  ] as const
                ).map((filter) => {
                  const isActive = sourceFilter === filter.value;
                  return (
                    <Button
                      key={filter.value}
                      type="button"
                      variant="ghost"
                      size="unset"
                      onClick={() =>
                        form.setValue("sourceFilter", filter.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        })
                      }
                      className={cn(
                        "h-7 px-2.5 text-xs rounded-sm",
                        isActive
                          ? "bg-primary text-primary-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {t(filter.label)}
                    </Button>
                  );
                })}
              </Div>
            )}
          </Div>

          {/* Sections */}
          <Div className="flex flex-col gap-6">
            {filteredSections !== null && filteredSections.length === 0 ? (
              <Div className="text-center text-sm text-muted-foreground py-8">
                {t("get.search.noResults")}
              </Div>
            ) : null}
            {(filteredSections ?? skillsData?.sections ?? []).map(
              (section, idx) => (
                <Div key={idx} className="flex flex-col gap-4">
                  {/* Section Header */}
                  <Div className="flex items-center gap-2">
                    <IconWidget
                      field={withValue(
                        children.sections.child.children.sectionIcon,
                        section.sectionIcon,
                        section,
                      )}
                      fieldName={`sections.${idx}.sectionIcon`}
                    />
                    <TextWidget
                      field={withValue(
                        children.sections.child.children.sectionTitle,
                        section.sectionTitle,
                        section,
                      )}
                      fieldName={`sections.${idx}.sectionTitle`}
                    />
                    <BadgeWidget
                      field={withValue(
                        children.sections.child.children.sectionCount,
                        section.sectionCount,
                        section,
                      )}
                      fieldName={`sections.${idx}.sectionCount`}
                    />
                  </Div>

                  {/* Skills with Browse All / Show More */}
                  {section.skills && section.skills.length > 0 && (
                    <CollapsibleSkillSection
                      skills={section.skills}
                      idx={idx}
                      navigate={navigate}
                      logger={logger}
                      user={user}
                      locale={locale}
                      isTouch={isTouch}
                      t={t}
                      favoritesBySkill={favoritesBySkill}
                      favoritesByVariant={favoritesByVariant}
                      activeFavoriteId={activeFavoriteId}
                    >
                      {children}
                    </CollapsibleSkillSection>
                  )}
                </Div>
              ),
            )}
          </Div>
        </Div>
      </Div>

      {/* Onboarding Sticky Bottom Section */}
      {isOnboarding && (
        <Div className="flex flex-row gap-2 px-4 py-4 shrink-0 border-t">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleCreateCustomClick}
            className="ml-auto"
          >
            {t("get.createButton.label")}
          </Button>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => {
              // Close the selector modal
              setModelSelectorOpen(false);
              logger.info("Onboarding complete");
            }}
          >
            {t("onboarding.bottom.button")}
          </Button>
        </Div>
      )}
    </Div>
  );
}

/**
 * Collapsible Skill Section Component
 *
 * Features:
 * - Shows first 3 skills by default
 * - Elegant "Show X more" button with smooth animation
 * - Gradient fade hint when collapsed
 * - Animated expand/collapse with height transition
 * - Groups variant items (isVariant=true) under a shared card header
 */
export const INITIAL_VISIBLE_COUNT = 4;

/** Group consecutive variant items by skill id into renderable units */
export type SkillGroup =
  | { type: "single"; item: SkillListItem }
  | { type: "variants"; id: string; items: SkillListItem[] };

export function getSkillReferenceIds(skill: SkillListItem): string[] {
  return [parseSkillId(skill.skillId).skillId];
}

export function getFavoriteIdsForSkill(
  favoritesBySkill: Record<string, string[]>,
  skill: SkillListItem,
): string[] {
  const favoriteIds: string[] = [];
  for (const skillReferenceId of getSkillReferenceIds(skill)) {
    const ids = favoritesBySkill[skillReferenceId];
    if (ids) {
      favoriteIds.push(...ids);
    }
  }
  return favoriteIds;
}

export function getFavoriteIdsForVariant(
  favoritesByVariant: Record<string, string[]>,
  skill: SkillListItem,
): string[] {
  if (!skill.isVariant) {
    return [];
  }

  // favoritesByVariant is keyed by merged skillId (e.g. "thea__brilliant")
  const ids = favoritesByVariant[skill.skillId];
  return ids ?? [];
}

export function groupSkillItems(skills: SkillListItem[]): SkillGroup[] {
  const groups: SkillGroup[] = [];
  const seen = new Set<string>();
  for (const item of skills) {
    const baseId = parseSkillId(item.skillId).skillId;
    if (!item.isVariant) {
      groups.push({ type: "single", item });
      continue;
    }
    if (!seen.has(baseId)) {
      seen.add(baseId);
      const variants = skills.filter(
        (s) => parseSkillId(s.skillId).skillId === baseId && s.isVariant,
      );
      groups.push({ type: "variants", id: baseId, items: variants });
    }
  }
  return groups;
}

export function CollapsibleSkillSection({
  skills,
  idx,

  children,
  navigate,
  logger,
  user,
  locale,
  isTouch,
  t,
  favoritesBySkill,
  favoritesByVariant,
  activeFavoriteId,
}: {
  skills: SkillListItem[];
  idx: number;

  children: (typeof definition.GET)["fields"]["children"];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  isTouch: boolean;
  t: ReturnType<typeof useWidgetTranslation>;
  favoritesBySkill: Record<string, string[]>;
  favoritesByVariant: Record<string, string[]>;
  activeFavoriteId: string | null;
}): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const groups = useMemo(() => groupSkillItems(skills), [skills]);
  const totalCount = groups.length;
  const hasMore = totalCount > INITIAL_VISIBLE_COUNT;
  const visibleGroups = expanded
    ? groups
    : groups.slice(0, INITIAL_VISIBLE_COUNT);
  const hiddenCount = totalCount - INITIAL_VISIBLE_COUNT;

  return (
    <Div className="flex flex-col gap-3">
      {/* Skill Cards */}
      <Div className="flex flex-col gap-3">
        {visibleGroups.map((group) =>
          group.type === "single" ? (
            <SkillCard
              key={group.item.skillId}
              char={group.item}
              idx={idx}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
              isTouch={isTouch}
              t={t}
              favoriteIds={getFavoriteIdsForSkill(favoritesBySkill, group.item)}
              activeFavoriteId={activeFavoriteId}
            >
              {children}
            </SkillCard>
          ) : (
            <VariantGroupCard
              key={group.id}
              items={group.items}
              idx={idx}
              fieldDefs={children}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
              isTouch={isTouch}
              t={t}
              favoritesBySkill={favoritesBySkill}
              favoritesByVariant={favoritesByVariant}
              activeFavoriteId={activeFavoriteId}
            />
          ),
        )}
      </Div>

      {/* Show more / Show less */}
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full h-9 gap-2 text-sm font-medium",
            "text-muted-foreground hover:text-foreground",
            "border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50",
            "rounded-lg transition-all duration-200",
            "hover:bg-muted/50",
          )}
          onClick={() => setExpanded((v) => !v)}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-180",
            )}
          />
          <Span>
            {expanded ? t("get.section.showLess") : `+${hiddenCount}`}
          </Span>
        </Button>
      )}
    </Div>
  );
}

/**
 * Variant Group Card - renders a skill group header with compact variant rows below.
 * Mirrors the favorites grouping visual pattern.
 */
export function VariantGroupCard({
  items,
  idx,
  fieldDefs,
  navigate,
  logger,
  user,
  locale,
  isTouch,
  t,
  favoritesBySkill,
  favoritesByVariant,
  activeFavoriteId,
}: {
  items: SkillListItem[];
  idx: number;
  fieldDefs: (typeof definition.GET)["fields"]["children"];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  isTouch: boolean;
  t: ReturnType<typeof useWidgetTranslation>;
  favoritesBySkill: Record<string, string[]>;
  favoritesByVariant: Record<string, string[]>;
  activeFavoriteId: string | null;
}): React.JSX.Element {
  const first = items[0];
  if (!first) {
    return <></>;
  }
  const skillId = parseSkillId(first.skillId).skillId;
  const allFavoriteIds = getFavoriteIdsForSkill(favoritesBySkill, first);
  const isInCollection = allFavoriteIds.length > 0;
  const isActive =
    activeFavoriteId !== null && allFavoriteIds.includes(activeFavoriteId);

  return (
    <Div
      className={cn(
        "rounded-lg border overflow-hidden transition-all hover:shadow-sm",
        isActive
          ? "border-l-4 border-l-primary border-primary/20 bg-primary/5"
          : isInCollection
            ? "border-l-2 border-l-primary/50"
            : "",
      )}
    >
      {/* Group header - icon + name + tagline + description (click to detail) */}
      <Div className="flex items-start gap-3 p-3">
        <Div
          className="flex items-start gap-3 flex-1 cursor-pointer"
          onClick={() =>
            navigate(skillDetailDefinitions.GET, {
              urlPathParams: { id: skillId },
            })
          }
        >
          <Div className="flex-shrink-0 pt-0.5">
            <IconWidget
              field={withValue(
                fieldDefs.sections.child.children.skills.child.children.icon,
                first.icon,
                first,
              )}
              fieldName={`sections.${idx}.skills.${skillId}.icon`}
            />
          </Div>
          <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <Div className="flex items-center gap-2 flex-wrap">
              <TextWidget
                field={withValue(
                  fieldDefs.sections.child.children.skills.child.children.name,
                  first.name,
                  first,
                )}
                fieldName={`sections.${idx}.skills.${skillId}.name`}
              />
              <TextWidget
                field={withValue(
                  fieldDefs.sections.child.children.skills.child.children
                    .tagline,
                  first.tagline,
                  first,
                )}
                fieldName={`sections.${idx}.skills.${skillId}.tagline`}
              />
              {isInCollection && (
                <Div className="flex items-center gap-1 text-xs text-primary">
                  <Star className={cn("h-3 w-3", isActive && "fill-primary")} />
                </Div>
              )}
            </Div>
            <TextWidget
              field={withValue(
                fieldDefs.sections.child.children.skills.child.children
                  .description,
                first.description,
                first,
              )}
              fieldName={`sections.${idx}.skills.${skillId}.description`}
            />
          </Div>
        </Div>
        {/* Owner-only: Add Variant button */}
        {first.ownershipType === SkillOwnershipType.USER && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 flex-shrink-0 self-start mt-0.5"
            title={t("get.card.actions.addVariant")}
            onClick={(e): void => {
              e.stopPropagation();
              void (async (): Promise<void> => {
                const def = await import("./[id]/definition");
                navigate(def.default.PATCH, {
                  urlPathParams: { id: skillId },
                  prefillFromGet: true,
                  getEndpoint: def.default.GET,
                });
              })();
            }}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </Div>

      {/* Variant rows - one per variant */}
      {items.map((variant, vIdx) => {
        const variantFavoriteIds = variant.isVariant
          ? getFavoriteIdsForVariant(favoritesByVariant, variant)
          : allFavoriteIds;
        return (
          <VariantRow
            key={`${variant.skillId}-${vIdx}`}
            char={variant}
            skillId={skillId}
            idx={idx}
            vIdx={vIdx}
            fieldDefs={fieldDefs}
            navigate={navigate}
            logger={logger}
            user={user}
            locale={locale}
            isTouch={isTouch}
            t={t}
            favoriteIds={variantFavoriteIds}
            activeFavoriteId={activeFavoriteId}
          />
        );
      })}
    </Div>
  );
}

/**
 * Compact variant row - model icon + variantName + modelInfo + provider + credits + actions
 */
export function VariantRow({
  char,
  skillId,
  idx,
  vIdx,
  fieldDefs,
  navigate,
  logger,
  user,
  locale,
  isTouch,
  t,
  favoriteIds,
  activeFavoriteId,
}: {
  char: SkillListItem;
  skillId: string;
  idx: number;
  vIdx: number;
  fieldDefs: (typeof definition.GET)["fields"]["children"];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  isTouch: boolean;
  t: ReturnType<typeof useWidgetTranslation>;
  favoriteIds: string[];
  activeFavoriteId: string | null;
}): React.JSX.Element {
  const isInCollection = favoriteIds.length > 0;
  const isActive =
    activeFavoriteId !== null && favoriteIds.includes(activeFavoriteId);
  const [showActions, setShowActions] = useState(false);

  return (
    <Div
      className="group border-t border-border/40"
      onMouseEnter={() => !isTouch && setShowActions(true)}
      onMouseLeave={() => !isTouch && setShowActions(false)}
    >
      {/* Row content */}
      <Div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer ml-9 hover:bg-muted/30 transition-colors"
        onClick={() =>
          navigate(skillDetailDefinitions.GET, {
            urlPathParams: { id: skillId },
          })
        }
      >
        {/* Variant name */}
        {char.variantName && (
          <Span className="text-sm font-medium text-foreground min-w-[5rem]">
            {char.variantName}
          </Span>
        )}

        {/* Model icon */}
        <IconWidget
          field={withValue(
            fieldDefs.sections.child.children.skills.child.children.modelIcon,
            char.modelIcon,
            char,
          )}
          fieldName={`sections.${idx}.skills.${skillId}.${vIdx}.modelIcon`}
        />

        {/* Model info */}
        <TextWidget
          field={withValue(
            fieldDefs.sections.child.children.skills.child.children.modelInfo,
            char.modelInfo,
            char,
          )}
          fieldName={`sections.${idx}.skills.${skillId}.${vIdx}.modelInfo`}
        />

        <TextWidget
          field={
            fieldDefs.sections.child.children.skills.child.children.separator1
          }
          fieldName={`sections.${idx}.skills.${skillId}.${vIdx}.separator1`}
        />

        {/* Provider */}
        <TextWidget
          field={withValue(
            fieldDefs.sections.child.children.skills.child.children
              .modelProvider,
            char.modelProvider,
            char,
          )}
          fieldName={`sections.${idx}.skills.${skillId}.${vIdx}.modelProvider`}
        />

        {/* Credits */}
        {char.modelId && (
          <ModelCreditDisplay
            modelId={char.modelId}
            variant="text"
            className="text-xs text-muted-foreground"
            locale={locale}
          />
        )}

        {/* Active indicator */}
        {isActive && (
          <Div className="ml-auto flex-shrink-0">
            <Star className="h-3 w-3 fill-primary text-primary" />
          </Div>
        )}

        {/* Touch toggle */}
        {isTouch && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-auto flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                showActions && "rotate-180",
              )}
            />
          </Button>
        )}
      </Div>

      {/* Hover action bar */}
      <Div
        className={cn(
          "transition-all duration-200 ease-out overflow-hidden",
          showActions || (isTouch && showActions) ? "max-h-20" : "max-h-0",
          !isTouch && "group-hover:max-h-20",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border-t ml-9 min-h-[2.5rem]">
          {isInCollection ? (
            <SkillFavoriteActions
              char={char}
              favoriteCount={favoriteIds.length}
              favoriteIds={favoriteIds}
              activeFavoriteId={activeFavoriteId}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
              t={t}
            />
          ) : (
            <>
              <Span className="text-xs text-muted-foreground flex-shrink-0">
                {t("get.card.actions.addToCollection")}
              </Span>
              <Div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                <EditFavBeforeAddButton
                  char={char}
                  navigate={navigate}
                  logger={logger}
                  user={user}
                  locale={locale}
                  variant="ghost"
                  className="h-6 gap-1 text-xs px-2"
                >
                  <Pencil className="h-3 w-3" />
                  {t("get.card.actions.customize")}
                </EditFavBeforeAddButton>
                <AddToFavoritesButton
                  char={char}
                  logger={logger}
                  user={user}
                  locale={locale}
                  variant="default"
                  className="h-6 gap-1 text-xs px-2"
                >
                  <Zap className="h-3 w-3" />
                  {t("get.card.actions.quick")}
                </AddToFavoritesButton>
              </Div>
            </>
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Skill Card Component
 *
 * Split Actions Bar design:
 * - Compact main content area (same as original height)
 * - Small action bar appears below on hover/touch
 * - Clear visual state with left border accent
 * - Actions slide in smoothly
 * - Status shown in action bar text
 */
export function SkillCard({
  char,
  idx,
  children,
  navigate,
  logger,
  user,
  locale,
  isTouch,
  t,
  favoriteIds,
  activeFavoriteId,
}: {
  char: SkillListItem;
  idx: number;
  children: (typeof definition.GET)["fields"]["children"];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  isTouch: boolean;
  t: ReturnType<typeof useWidgetTranslation>;
  favoriteIds: string[];
  activeFavoriteId: string | null;
}): React.JSX.Element {
  const charBaseId = parseSkillId(char.skillId).skillId;
  const isInCollection = favoriteIds.length > 0;
  const isActive =
    activeFavoriteId !== null && favoriteIds.includes(activeFavoriteId);
  const [showActions, setShowActions] = useState(false);

  return (
    <Div
      key={char.skillId}
      className={cn(
        "group relative rounded-lg border overflow-hidden transition-all",
        isActive
          ? "border-l-4 border-l-primary border-primary/20 bg-primary/5"
          : isInCollection
            ? "border-l-2 border-l-primary/50 hover:shadow-sm"
            : "hover:shadow-sm",
      )}
      onMouseEnter={() => !isTouch && setShowActions(true)}
      onMouseLeave={() => !isTouch && setShowActions(false)}
    >
      {/* Main content - always visible, clickable */}
      <Div
        className="flex items-start gap-3 p-3 cursor-pointer"
        onClick={() => {
          navigate(skillDetailDefinitions.GET, {
            urlPathParams: { id: charBaseId },
          });
        }}
      >
        {/* Icon */}
        <Div className="flex-shrink-0 pt-0.5">
          <IconWidget
            field={withValue(
              children.sections.child.children.skills.child.children.icon,
              char.icon,
              char,
            )}
            fieldName={`sections.${idx}.skills.${charBaseId}.icon`}
          />
        </Div>

        {/* Content */}
        <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
          {/* Name + Tagline + Status badge */}
          <Div className="flex items-center gap-2 flex-wrap">
            <TextWidget
              field={withValue(
                children.sections.child.children.skills.child.children.name,
                char.name,
                char,
              )}
              fieldName={`sections.${idx}.skills.${charBaseId}.name`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.skills.child.children.tagline,
                char.tagline,
                char,
              )}
              fieldName={`sections.${idx}.skills.${charBaseId}.tagline`}
            />
            {char.trustLevel === SkillTrustLevel.VERIFIED && (
              <Div className="flex items-center gap-1 text-xs text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </Div>
            )}
            {char.ownershipType === SkillOwnershipType.PUBLIC &&
              char.trustLevel !== SkillTrustLevel.VERIFIED && (
                <Span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  {t("enums.ownershipType.public")}
                </Span>
              )}
            {isInCollection && (
              <Div className="flex items-center gap-1 text-xs text-primary">
                <Star className={cn("h-3 w-3", isActive && "fill-primary")} />
              </Div>
            )}
          </Div>

          {/* Description */}
          <TextWidget
            field={withValue(
              children.sections.child.children.skills.child.children
                .description,
              char.description,
              char,
            )}
            fieldName={`sections.${idx}.skills.${charBaseId}.description`}
          />

          {/* Model info */}
          <Div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
            <IconWidget
              field={withValue(
                children.sections.child.children.skills.child.children
                  .modelIcon,
                char.modelIcon,
                char,
              )}
              fieldName={`sections.${idx}.skills.${charBaseId}.modelIcon`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.skills.child.children
                  .modelInfo,
                char.modelInfo,
                char,
              )}
              fieldName={`sections.${idx}.skills.${charBaseId}.modelInfo`}
            />
            <TextWidget
              field={
                children.sections.child.children.skills.child.children
                  .separator1
              }
              fieldName={`sections.${idx}.skills.${charBaseId}.separator1`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.skills.child.children
                  .modelProvider,
                char.modelProvider,
                char,
              )}
              fieldName={`sections.${idx}.skills.${charBaseId}.modelProvider`}
            />
            <TextWidget
              field={
                children.sections.child.children.skills.child.children
                  .separator2
              }
              fieldName={`sections.${idx}.skills.${charBaseId}.separator2`}
            />
            {char.modelId && (
              <ModelCreditDisplay
                modelId={char.modelId}
                variant="text"
                className="text-xs text-muted-foreground"
                locale={locale}
              />
            )}
            {char.ownershipType !== SkillOwnershipType.SYSTEM &&
              char.voteCount !== null &&
              char.voteCount > 0 && (
                <>
                  <TextWidget
                    field={
                      children.sections.child.children.skills.child.children
                        .separator2
                    }
                    fieldName={`sections.${idx}.skills.${charBaseId}.separator2`}
                  />
                  <Span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    {char.voteCount}
                  </Span>
                </>
              )}
          </Div>
        </Div>

        {/* Touch device: show toggle button */}
        {isTouch && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showActions && "rotate-180",
              )}
            />
          </Button>
        )}
      </Div>

      {/* Action bar - slides in on hover/tap */}
      <Div
        className={cn(
          "transition-all duration-200 ease-out",
          showActions || isTouch ? "max-h-20" : "max-h-0 overflow-hidden",
          !isTouch && "group-hover:max-h-20",
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-t min-h-[3rem]">
          {isInCollection ? (
            <SkillFavoriteActions
              char={char}
              favoriteCount={favoriteIds.length}
              favoriteIds={favoriteIds}
              activeFavoriteId={activeFavoriteId}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
              t={t}
            />
          ) : (
            <>
              <Div className="text-xs text-muted-foreground flex-shrink-0">
                {t("get.card.actions.addToCollection")}
              </Div>
              <Div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                <EditFavBeforeAddButton
                  char={char}
                  navigate={navigate}
                  logger={logger}
                  user={user}
                  locale={locale}
                  variant="ghost"
                  className="h-7 gap-1.5 text-xs px-2"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t("get.card.actions.customize")}
                </EditFavBeforeAddButton>
                {char.ownershipType === SkillOwnershipType.USER && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs px-2"
                    onClick={(e): void => {
                      e.stopPropagation();
                      void (async (): Promise<void> => {
                        const def = await import("./[id]/definition");
                        navigate(def.default.PATCH, {
                          urlPathParams: { id: charBaseId },
                          prefillFromGet: true,
                          getEndpoint: def.default.GET,
                        });
                      })();
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("get.card.actions.addVariant")}
                  </Button>
                )}
                <AddToFavoritesButton
                  char={char}
                  logger={logger}
                  user={user}
                  locale={locale}
                  variant="default"
                  className="h-7 gap-1.5 text-xs"
                  disabled={isInCollection}
                >
                  <Zap className="h-3.5 w-3.5" />
                  {t("get.card.actions.quick")}
                </AddToFavoritesButton>
              </Div>
            </>
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Edit Skill Button - navigates to create favorite with skill data
 * Isolated component for loading state
 */
export function EditFavBeforeAddButton({
  char,
  navigate,
  logger,
  user,
  locale,
  variant = "ghost",
  className = "",
  children,
}: {
  char: SkillListItem;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  variant?: "ghost" | "outline" | "default";
  className?: string;
  children?: React.ReactNode;
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const skillSingleDefinitions = await import("./[id]/definition");
      const createFavoriteDefinitions =
        await import("../favorites/create/definition");

      // Fetch full skill data
      const skillResponse = await apiClient.fetch(
        skillSingleDefinitions.default.GET,
        logger,
        user,
        undefined,
        { id: parseSkillId(char.skillId).skillId },
        locale,
      );

      if (!skillResponse.success) {
        logger.error("Failed to fetch skill data");
        return;
      }

      const fullChar = skillResponse.data;

      // Resolve model selections — prefer the specific variant if one is selected
      const { variantId } = parseSkillId(char.skillId);
      const matchedVariant = variantId
        ? fullChar.variants.find((v) => v.id === variantId)
        : undefined;

      const modelSelection = matchedVariant?.modelSelection;
      const voiceModelSelection =
        (matchedVariant ?? fullChar).voiceModelSelection ?? undefined;
      const sttModelSelection =
        (matchedVariant ?? fullChar).sttModelSelection ?? undefined;
      const imageVisionModelSelection =
        (matchedVariant ?? fullChar).imageVisionModelSelection ?? undefined;
      const videoVisionModelSelection =
        (matchedVariant ?? fullChar).videoVisionModelSelection ?? undefined;
      const audioVisionModelSelection =
        (matchedVariant ?? fullChar).audioVisionModelSelection ?? undefined;
      const imageGenModelSelection =
        (matchedVariant ?? fullChar).imageGenModelSelection ?? undefined;
      const musicGenModelSelection =
        (matchedVariant ?? fullChar).musicGenModelSelection ?? undefined;
      const videoGenModelSelection =
        (matchedVariant ?? fullChar).videoGenModelSelection ?? undefined;

      // Navigate to create favorite with skill data
      const editFavoriteDefinitions =
        await import("../favorites/[id]/definition");

      navigate(createFavoriteDefinitions.default.POST, {
        data: {
          skillId: char.skillId,
          icon: fullChar.icon ?? undefined,
          customVariantName: matchedVariant?.displayName ?? null,
          modelSelection,
          voiceModelSelection,
          sttModelSelection,
          imageVisionModelSelection,
          videoVisionModelSelection,
          audioVisionModelSelection,
          imageGenModelSelection,
          musicGenModelSelection,
          videoGenModelSelection,
        },
        replaceOnSuccess: {
          endpoint: editFavoriteDefinitions.default.PATCH,
          getUrlPathParams: (responseData) => ({ id: responseData.id }),
          prefillFromGet: true,
          getEndpoint: editFavoriteDefinitions.default.GET,
        },
      });
    } catch (error) {
      logger.error("Failed to edit skill", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : children ? (
        children
      ) : (
        <Pencil className="h-4 w-4" />
      )}
    </Button>
  );
}

/**
 * Add to Favorites Button - adds skill to favorites
 * Uses shared hook for consistent behavior across views
 */
export function AddToFavoritesButton({
  char,
  logger,
  user,
  locale,
  variant = "ghost",
  className = "",
  children,
  disabled = false,
}: {
  char: SkillListItem;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  variant?: "ghost" | "outline" | "default";
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}): React.JSX.Element {
  const { isLoading, addToFavorites } = useAddToFavorites({
    skillId: char.skillId,
    logger,
    user,
    locale,
    characterData: {
      id: parseSkillId(char.skillId).skillId,
      icon: char.icon,
      name: char.name,
      tagline: char.tagline,
      description: char.description,
      voiceModelSelection: null,
      modelSelection: null,
      preComputedModel: {
        modelId: char.modelId,
        modelIcon: char.modelIcon,
        modelInfo: char.modelInfo,
        modelProvider: char.modelProvider,
      },
    },
  });

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={addToFavorites}
      disabled={isLoading || disabled}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : children ? (
        children
      ) : (
        <Star className="h-4 w-4" />
      )}
    </Button>
  );
}

/**
 * Skill Favorite Actions - shows different UI based on how many favorites exist
 */
export function SkillFavoriteActions({
  char,
  favoriteCount,
  favoriteIds,
  activeFavoriteId,
  navigate,
  logger,
  user,
  locale,
  t,
}: {
  char: SkillListItem;
  favoriteCount: number;
  favoriteIds: string[];
  activeFavoriteId: string | null;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const [isActivating, setIsActivating] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isCurrentlyActive =
    activeFavoriteId !== null && favoriteIds.includes(activeFavoriteId);
  const pathname = usePathname();
  const isOnThreads = pathname?.includes("/threads/") ?? false;
  const setModelSelectorOpen = useTourState(
    (state) => state.setModelSelectorOpen,
  );

  const handleActivateSingleFavorite = async (
    e: ButtonMouseEvent,
  ): Promise<void> => {
    e.stopPropagation();
    if (favoriteIds.length !== 1) {
      return;
    }

    setIsActivating(true);
    try {
      const { ChatSettingsRepositoryClient } =
        await import("../settings/repository-client");
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const favoritesDefinition = await import("../favorites/[id]/definition");

      // Fetch the favorite to get its data
      const favoriteResponse = await apiClient.fetch(
        favoritesDefinition.default.GET,
        logger,
        user,
        undefined,
        { id: favoriteIds[0] },
        locale,
      );

      if (!favoriteResponse.success) {
        logger.error("Failed to fetch favorite");
        return;
      }

      const favorite = favoriteResponse.data;

      // Determine the model to use (favorite override → variant → skill default)
      const bestModel = getBestChatModelForFavorite(
        favorite.modelSelection,
        favorite.characterModelSelection ?? undefined,
        user,
      );
      const modelId = bestModel?.id || null;

      // Activate this favorite
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId: favoriteIds[0],
        modelId,
        skillId: parseSkillId(char.skillId).skillId,
        logger,
        locale,
        user,
      });
    } catch (error) {
      logger.error("Failed to activate favorite", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleActivateFavorite = async (
    e: ButtonMouseEvent,
    favoriteId: string,
  ): Promise<void> => {
    e.stopPropagation();
    setIsActivating(true);
    setPopoverOpen(false);

    try {
      const { ChatSettingsRepositoryClient } =
        await import("../settings/repository-client");
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const favoritesDefinition = await import("../favorites/[id]/definition");

      // Fetch the favorite to get its data
      const favoriteResponse = await apiClient.fetch(
        favoritesDefinition.default.GET,
        logger,
        user,
        undefined,
        { id: favoriteId },
        locale,
      );

      if (!favoriteResponse.success) {
        logger.error("Failed to fetch favorite");
        return;
      }

      const favorite = favoriteResponse.data;

      // Determine the model to use (favorite override → variant → skill default)
      const bestModel = getBestChatModelForFavorite(
        favorite.modelSelection,
        favorite.characterModelSelection ?? undefined,
        user,
      );
      const modelId = bestModel?.id || null;

      // Activate this favorite
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId,
        modelId,
        skillId: parseSkillId(char.skillId).skillId,
        logger,
        locale,
        user,
      });
    } catch (error) {
      logger.error("Failed to activate favorite", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleAddAnother = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
    const skillSingleDefinitions = await import("./[id]/definition");
    const createFavoriteDefinitions =
      await import("../favorites/create/definition");

    const baseId = parseSkillId(char.skillId).skillId;
    const cachedData = apiClient.getEndpointData(
      skillSingleDefinitions.default.GET,
      logger,
      {
        urlPathParams: { id: baseId },
      },
    );
    let fullChar = cachedData?.success ? cachedData.data : undefined;

    if (!fullChar) {
      const skillResponse = await apiClient.fetch(
        skillSingleDefinitions.default.GET,
        logger,
        user,
        undefined,
        { id: baseId },
        locale,
      );
      if (!skillResponse.success) {
        return;
      }
      fullChar = skillResponse.data;
    }

    const editFavoriteDefinitions =
      await import("../favorites/[id]/definition");

    const { variantId: addVarId } = parseSkillId(char.skillId);
    const addMatchedVariant = addVarId
      ? fullChar.variants.find((v) => v.id === addVarId)
      : undefined;

    navigate(createFavoriteDefinitions.default.POST, {
      data: {
        skillId: char.skillId,
        icon: fullChar.icon ?? undefined,
        customVariantName: addMatchedVariant?.displayName ?? null,
        modelSelection: addMatchedVariant?.modelSelection,
        voiceModelSelection:
          (addMatchedVariant ?? fullChar).voiceModelSelection ?? undefined,
        sttModelSelection:
          (addMatchedVariant ?? fullChar).sttModelSelection ?? undefined,
        imageVisionModelSelection:
          (addMatchedVariant ?? fullChar).imageVisionModelSelection ??
          undefined,
        videoVisionModelSelection:
          (addMatchedVariant ?? fullChar).videoVisionModelSelection ??
          undefined,
        audioVisionModelSelection:
          (addMatchedVariant ?? fullChar).audioVisionModelSelection ??
          undefined,
        imageGenModelSelection:
          (addMatchedVariant ?? fullChar).imageGenModelSelection ?? undefined,
        musicGenModelSelection:
          (addMatchedVariant ?? fullChar).musicGenModelSelection ?? undefined,
        videoGenModelSelection:
          (addMatchedVariant ?? fullChar).videoGenModelSelection ?? undefined,
      },
      replaceOnSuccess: {
        endpoint: editFavoriteDefinitions.default.PATCH,
        getUrlPathParams: (responseData) => ({
          id: responseData.id,
        }),
        prefillFromGet: true,
        getEndpoint: editFavoriteDefinitions.default.GET,
      },
    });
  };

  if (favoriteCount === 1) {
    // Single favorite - show "Activate" or "Go to Chat" button
    return (
      <>
        <Div className="text-xs text-muted-foreground flex-shrink-0">
          {t("get.card.actions.inCollection")}
        </Div>
        <Div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {isCurrentlyActive ? (
            isOnThreads ? (
              <Button
                variant="default"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setModelSelectorOpen(false);
                }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t("get.card.actions.useThis")}
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                asChild
              >
                <Link
                  href={`/${locale}/threads/private/new`}
                  className="no-underline"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  {t("get.card.actions.goToChat")}
                </Link>
              </Button>
            )
          ) : (
            <Button
              variant="default"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={handleActivateSingleFavorite}
              disabled={isActivating}
            >
              {isActivating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Zap className="h-3.5 w-3.5" />
              )}
              {t("get.card.actions.useNow")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleAddAnother}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("get.card.actions.addAnother")}
          </Button>
        </Div>
      </>
    );
  }

  // Multiple favorites - show popover with list
  return (
    <>
      <Div className="text-xs text-muted-foreground flex-shrink-0">
        {t("get.card.actions.inCollection")}
      </Div>
      <Div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {isCurrentlyActive &&
          (isOnThreads ? (
            <Button
              variant="default"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setModelSelectorOpen(false);
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("get.card.actions.useThis")}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              asChild
            >
              <Link
                href={`/${locale}/threads/private/new`}
                className="no-underline"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                {t("get.card.actions.goToChat")}
              </Link>
            </Button>
          ))}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={isCurrentlyActive ? "ghost" : "default"}
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setPopoverOpen(!popoverOpen);
              }}
            >
              <Star className="h-3.5 w-3.5" />
              {t("get.card.actions.chooseFavorite")} ({favoriteCount})
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <Div className="flex flex-col gap-2">
              <Div className="text-xs font-medium px-2 py-1 text-muted-foreground">
                {t("get.card.actions.selectFavorite")}
              </Div>
              <FavoritesList
                favoriteIds={favoriteIds}
                activeFavoriteId={activeFavoriteId}
                handleActivateFavorite={handleActivateFavorite}
                isActivating={isActivating}
                logger={logger}
                t={t}
                locale={locale}
              />
            </Div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={handleAddAnother}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("get.card.actions.addAnother")}
        </Button>
      </Div>
    </>
  );
}

/**
 * Favorites List Component - displays favorite cards in popover
 */
export function FavoritesList({
  favoriteIds,
  activeFavoriteId,
  handleActivateFavorite,
  isActivating,
  logger,
  t,
  locale,
}: {
  favoriteIds: string[];
  activeFavoriteId: string | null;
  handleActivateFavorite: (
    e: ButtonMouseEvent,
    favoriteId: string,
  ) => Promise<void>;
  isActivating: boolean;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  t: ReturnType<typeof useWidgetTranslation>;
  locale: ReturnType<typeof useWidgetContext>["locale"];
}): React.JSX.Element {
  const { favorites } = useChatFavorites(logger, {
    activeFavoriteId: null,
  });

  // Get favorite cards for the IDs we have
  const favoriteCards = useMemo(() => {
    if (!favorites) {
      return [];
    }
    return favoriteIds
      .map((id) => favorites.find((fav) => fav.id === id))
      .filter((fav): fav is NonNullable<typeof fav> => fav !== undefined);
  }, [favorites, favoriteIds]);

  if (favoriteCards.length === 0) {
    return (
      <Div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  // Detect duplicate names so we can show a disambiguating index
  const nameCounts = favoriteCards.reduce<Record<string, number>>(
    (acc, fav) => {
      acc[fav.name] = (acc[fav.name] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const nameSeenSoFar: Record<string, number> = {};

  return (
    <>
      {favoriteCards.map((fav) => {
        const isActive = fav.id === activeFavoriteId;
        const isDuplicateName = (nameCounts[fav.name] ?? 0) > 1;
        nameSeenSoFar[fav.name] = (nameSeenSoFar[fav.name] ?? 0) + 1;
        const index = nameSeenSoFar[fav.name] ?? 1;

        return (
          <Div
            key={fav.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md transition-colors cursor-pointer",
              isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
            )}
            onClick={(e) => {
              if (!isActive && !isActivating) {
                void handleActivateFavorite(e, fav.id);
              }
            }}
          >
            {/* Favorite icon */}
            <Div
              className={cn(
                "flex items-center justify-center rounded-md w-7 h-7 flex-shrink-0",
                isActive ? "bg-primary/20" : "bg-muted",
              )}
            >
              <Icon icon={fav.icon} className="h-4 w-4" />
            </Div>
            {/* Name + model info */}
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-1">
                <Span
                  className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-primary" : "",
                  )}
                >
                  {fav.name}
                </Span>
                {isDuplicateName && (
                  <Span className="text-xs text-muted-foreground flex-shrink-0">
                    #{index}
                  </Span>
                )}
              </Div>
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon icon={fav.modelIcon} className="h-3 w-3 flex-shrink-0" />
                <Span className="truncate">{t(fav.modelInfo)}</Span>
                {fav.modelId && (
                  <>
                    <ModelCreditDisplay
                      modelId={fav.modelId}
                      variant="text"
                      className="text-xs"
                      locale={locale}
                    />
                  </>
                )}
              </Div>
            </Div>
            {isActivating ? (
              <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
            ) : isActive ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
            ) : null}
          </Div>
        );
      })}
    </>
  );
}
