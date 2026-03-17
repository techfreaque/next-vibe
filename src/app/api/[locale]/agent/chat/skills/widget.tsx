/**
 * Custom Widget for Skills List
 */

"use client";

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ThumbsUp } from "next-vibe-ui/ui/icons/ThumbsUp";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { MoreHorizontal } from "next-vibe-ui/ui/icons/MoreHorizontal";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { X } from "next-vibe-ui/ui/icons/X";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import { useMemo, useState } from "react";

import { useTourState } from "@/app/[locale]/threads/[...path]/_components/welcome-tour/tour-state-context";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import BadgeWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react";
import IconWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/react";
import { SeparatorWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/react";
import TextWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { useTouchDevice } from "@/hooks/use-touch-device";

import { cn } from "../../../shared/utils";
import { Icon } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useSelectorOnboardingContext } from "../../ai-stream/stream/widget/selector/selector-onboarding/context";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import { useAddToFavorites } from "../favorites/create/hooks";
import { useChatFavorites } from "../favorites/hooks/hooks";
import skillDetailDefinitions from "./[id]/definition";
import { COMPANION_SKILLS } from "./config";
import type { SkillListItem } from "./definition";
import { SkillOwnershipType, SkillTrustLevel } from "./enum";
import type definition from "./definition";
import type { SkillListResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: SkillListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
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
  const isTouch = useTouchDevice();
  const isPublic = user.isPublic;
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const searchQuery = form.watch("query") ?? "";
  const { isOnboarding, companionSkillId } = useSelectorOnboardingContext();
  const setModelSelectorOpen = useTourState(
    (state) => state.setModelSelectorOpen,
  );

  // Fetch favorites to calculate favoriteIds for each skill
  const { favorites, activeFavoriteId } = useChatFavorites(logger, {
    activeFavoriteId: null,
  });

  // Group favorites by skill ID
  const favoritesBySkill = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (favorites) {
      for (const fav of favorites) {
        if (!map[fav.skillId]) {
          map[fav.skillId] = [];
        }
        map[fav.skillId].push(fav.id);
      }
    }
    return map;
  }, [favorites]);

  // When query is active: server already filtered — flatten all sections into a
  // single ranked list (VERIFIED first, then by voteCount desc).
  // When no query: return sections as-is.
  const filteredSections = useMemo(() => {
    const sections = field.value?.sections;
    if (!sections) {
      return null;
    }
    if (!searchQuery.trim()) {
      return sections;
    }
    // Server already filtered — just flatten and rank
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
  }, [field.value?.sections, searchQuery, t]);

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

  const handleSignup = (): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/user/public/signup/definition");
      navigate(def.default.POST);
    })();
  };

  const handleLogin = (): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/user/public/login/definition");
      navigate(def.default.POST);
    })();
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

            {/* CTA Buttons */}
            <Div className="flex flex-col gap-3 mt-4">
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleSignup}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {t("get.signupPrompt.signupButton")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleLogin}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                {t("get.signupPrompt.loginButton")}
              </Button>
            </Div>
          </Div>
        </Div>
      </Div>
    );
  }

  // Loading state - show spinner that fills the scrollable area
  if (!field.value) {
    return (
      <Div className="flex flex-col gap-0 h-[min(800px,calc(100dvh-100px))]">
        {/* Top Actions: Back + Create */}
        {!isOnboarding && (
          <Div className="flex flex-row gap-2 px-4 py-4 shrink-0">
            <NavigateButtonWidget field={children.backButton} />
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleCreateCustomClick}
              className="ml-auto"
            >
              {t("get.createButton.label")}
            </Button>
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
    <Div className="flex flex-col gap-0 h-[min(800px,calc(100dvh-100px))]">
      {/* Top Actions: Back + Create */}
      {!isOnboarding && (
        <Div className="flex flex-row gap-2 px-4 py-4 shrink-0">
          <NavigateButtonWidget field={children.backButton} />
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleCreateCustomClick}
            className="ml-auto"
          >
            {t("get.createButton.label")}
          </Button>
        </Div>
      )}

      {/* Scrollable Content */}
      <Div className="border-t border-border overflow-y-auto flex-1">
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

          {/* Search bar */}
          <Div className="relative mb-2">
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

          {/* Sections */}
          <Div className="flex flex-col gap-6">
            {filteredSections !== null &&
            filteredSections.length === 0 &&
            searchQuery ? (
              <Div className="text-center text-sm text-muted-foreground py-8">
                {t("get.search.noResults")}
              </Div>
            ) : null}
            {(filteredSections ?? field.value?.sections ?? []).map(
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
                      categoryKey={section.skills[0]?.category}
                      navigate={navigate}
                      logger={logger}
                      user={user}
                      locale={locale}
                      isTouch={isTouch}
                      t={t}
                      favoritesBySkill={favoritesBySkill}
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
 */
const INITIAL_VISIBLE_COUNT = 6;

function CollapsibleSkillSection({
  skills,
  idx,
  categoryKey,
  children,
  navigate,
  logger,
  user,
  locale,
  isTouch,
  t,
  favoritesBySkill,
  activeFavoriteId,
}: {
  skills: SkillListItem[];
  idx: number;
  categoryKey: string | undefined;
  children: (typeof definition.GET)["fields"]["children"];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  isTouch: boolean;
  t: ReturnType<typeof useWidgetTranslation>;
  favoritesBySkill: Record<string, string[]>;
  activeFavoriteId: string | null;
}): React.JSX.Element {
  const totalCount = skills.length;
  const hasMore = totalCount > INITIAL_VISIBLE_COUNT;
  const visibleSkills = skills.slice(0, INITIAL_VISIBLE_COUNT);

  const handleBrowseAll = (): void => {
    void (async (): Promise<void> => {
      const skillsDef = await import("./definition");
      navigate(skillsDef.default.GET, {
        data: categoryKey ? { query: categoryKey } : undefined,
      });
    })();
  };

  return (
    <Div className="flex flex-col gap-3">
      {/* Skill Cards */}
      <Div className="relative">
        <Div
          className={cn(
            "flex flex-col gap-3 transition-all duration-300 ease-out",
          )}
        >
          {visibleSkills.map((char) => (
            <SkillCard
              key={char.id}
              char={char}
              idx={idx}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
              isTouch={isTouch}
              t={t}
              favoriteIds={favoritesBySkill[char.id] || []}
              activeFavoriteId={activeFavoriteId}
            >
              {children}
            </SkillCard>
          ))}
        </Div>
      </Div>

      {/* Browse All button replaces Show More when section has overflow */}
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
          onClick={handleBrowseAll}
        >
          <ChevronDown className="h-4 w-4" />
          <Span>{t("get.section.browseAll")}</Span>
        </Button>
      )}
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
function SkillCard({
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
  const isInCollection = favoriteIds.length > 0;
  const isActive =
    activeFavoriteId !== null && favoriteIds.includes(activeFavoriteId);
  const [showActions, setShowActions] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  return (
    <Div
      key={char.id}
      className={cn(
        "group relative rounded-lg border overflow-hidden transition-all",
        isActive
          ? "border-l-4 border-l-primary border-primary/20 bg-primary/5"
          : isInCollection
            ? "border-l-2 border-l-primary/50 hover:shadow-sm"
            : "hover:shadow-sm",
      )}
      onMouseEnter={() => !isTouch && setShowActions(true)}
      onMouseLeave={() => !isTouch && !customizeOpen && setShowActions(false)}
    >
      {/* Main content - always visible, clickable */}
      <Div
        className="flex items-start gap-3 p-3 cursor-pointer"
        onClick={() =>
          navigate(skillDetailDefinitions.GET, {
            urlPathParams: { id: char.id },
          })
        }
      >
        {/* Icon */}
        <Div className="flex-shrink-0 pt-0.5">
          <IconWidget
            field={withValue(
              children.sections.child.children.skills.child.children.icon,
              char.icon,
              char,
            )}
            fieldName={`sections.${idx}.skills.${char.id}.icon`}
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
              fieldName={`sections.${idx}.skills.${char.id}.name`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.skills.child.children.tagline,
                char.tagline,
                char,
              )}
              fieldName={`sections.${idx}.skills.${char.id}.tagline`}
            />
            {char.trustLevel === SkillTrustLevel.VERIFIED && (
              <Div className="flex items-center gap-1 text-xs text-blue-500">
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
            fieldName={`sections.${idx}.skills.${char.id}.description`}
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
              fieldName={`sections.${idx}.skills.${char.id}.modelIcon`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.skills.child.children
                  .modelInfo,
                char.modelInfo,
                char,
              )}
              fieldName={`sections.${idx}.skills.${char.id}.modelInfo`}
            />
            <TextWidget
              field={
                children.sections.child.children.skills.child.children
                  .separator1
              }
              fieldName={`sections.${idx}.skills.${char.id}.separator1`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.skills.child.children
                  .modelProvider,
                char.modelProvider,
                char,
              )}
              fieldName={`sections.${idx}.skills.${char.id}.modelProvider`}
            />
            <TextWidget
              field={
                children.sections.child.children.skills.child.children
                  .separator2
              }
              fieldName={`sections.${idx}.skills.${char.id}.separator2`}
            />
            <ModelCreditDisplay
              modelId={char.modelId}
              variant="text"
              className="text-xs text-muted-foreground"
              locale={locale}
            />
            {char.ownershipType !== SkillOwnershipType.SYSTEM &&
              char.voteCount !== null &&
              char.voteCount > 0 && (
                <>
                  <TextWidget
                    field={
                      children.sections.child.children.skills.child.children
                        .separator2
                    }
                    fieldName={`sections.${idx}.skills.${char.id}.separator2`}
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
          showActions || isTouch || customizeOpen
            ? "max-h-20"
            : "max-h-0 overflow-hidden",
          !isTouch && "group-hover:max-h-20",
        )}
        onClick={(e) => e.stopPropagation()}
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
                <Popover
                  open={customizeOpen}
                  onOpenChange={(open) => {
                    setCustomizeOpen(open);
                    if (!open) {
                      setShowActions(false);
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomizeOpen((prev) => !prev);
                      }}
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-1" align="end">
                    <EditFavBeforeAddButton
                      char={char}
                      navigate={navigate}
                      logger={logger}
                      user={user}
                      locale={locale}
                      variant="ghost"
                      className="w-full justify-start gap-2 h-8 px-2 cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {t("get.card.actions.customize")}
                    </EditFavBeforeAddButton>
                  </PopoverContent>
                </Popover>
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
function EditFavBeforeAddButton({
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
        { id: char.id },
        locale,
      );

      if (!skillResponse.success) {
        logger.error("Failed to fetch skill data");
        return;
      }

      const fullChar = skillResponse.data;

      // Navigate to create favorite with skill data
      const editFavoriteDefinitions =
        await import("../favorites/[id]/definition");

      navigate(createFavoriteDefinitions.default.POST, {
        data: {
          skillId: char.id,
          icon: fullChar.icon ?? undefined,
          voice: fullChar.voice ?? DEFAULT_TTS_VOICE,
          modelSelection: null,
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
function AddToFavoritesButton({
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
    skillId: char.id,
    logger,
    user,
    locale,
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
function SkillFavoriteActions({
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

      // Determine the model to use
      let modelId = null;
      if (favorite.modelSelection) {
        const { SkillsRepositoryClient } = await import("./repository-client");
        const bestModel = SkillsRepositoryClient.getBestModelForFavorite(
          favorite.modelSelection,
          undefined,
          user,
        );
        modelId = bestModel?.id || null;
      }

      // Activate this favorite
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId: favoriteIds[0],
        modelId,
        skillId: char.id,
        voice: favorite.voice || null,
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

      // Determine the model to use
      let modelId = null;
      if (favorite.modelSelection) {
        const { SkillsRepositoryClient } = await import("./repository-client");
        const bestModel = SkillsRepositoryClient.getBestModelForFavorite(
          favorite.modelSelection,
          undefined,
          user,
        );
        modelId = bestModel?.id || null;
      }

      // Activate this favorite
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId,
        modelId,
        skillId: char.id,
        voice: favorite.voice || null,
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

    const cachedData = apiClient.getEndpointData(
      skillSingleDefinitions.default.GET,
      logger,
      {
        urlPathParams: { id: char.id },
      },
    );
    let fullChar = cachedData?.success ? cachedData.data : undefined;

    if (!fullChar) {
      const skillResponse = await apiClient.fetch(
        skillSingleDefinitions.default.GET,
        logger,
        user,
        undefined,
        { id: char.id },
        locale,
      );
      if (!skillResponse.success) {
        return;
      }
      fullChar = skillResponse.data;
    }

    const editFavoriteDefinitions =
      await import("../favorites/[id]/definition");

    navigate(createFavoriteDefinitions.default.POST, {
      data: {
        skillId: char.id,
        icon: fullChar.icon ?? undefined,
        voice: fullChar.voice ?? DEFAULT_TTS_VOICE,
        modelSelection: null,
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
    // Single favorite - show "Use Now" or "In Use" button
    return (
      <>
        <Div className="text-xs text-muted-foreground flex-shrink-0">
          {t("get.card.actions.inCollection")}
        </Div>
        <Div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <Button
            variant={isCurrentlyActive ? "secondary" : "default"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleActivateSingleFavorite}
            disabled={isActivating || isCurrentlyActive}
          >
            {isActivating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isCurrentlyActive ? (
              <Star className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            {isCurrentlyActive
              ? t("get.card.actions.inUse")
              : t("get.card.actions.useNow")}
          </Button>
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
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
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
function FavoritesList({
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

  return (
    <>
      {favoriteCards.map((fav) => {
        const isActive = fav.id === activeFavoriteId;
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
            {/* Skill icon */}
            <Div
              className={cn(
                "flex items-center justify-center rounded-md w-7 h-7 flex-shrink-0",
                isActive ? "bg-primary/20" : "bg-muted",
              )}
            >
              <Icon icon={fav.icon} className="h-4 w-4" />
            </Div>
            {/* Model info */}
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-1 text-sm">
                <Icon
                  icon={fav.modelIcon}
                  className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground"
                />
                <Span
                  className={cn(
                    "truncate font-medium",
                    isActive ? "text-primary" : "",
                  )}
                >
                  {t(fav.modelInfo)}
                </Span>
              </Div>
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                {fav.modelId && (
                  <ModelCreditDisplay
                    modelId={fav.modelId}
                    variant="text"
                    className="text-xs"
                    locale={locale}
                  />
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
