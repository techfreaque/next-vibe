/**
 * Custom Widget for Favorites List
 * Groups favorites by skillId with compact variant rows:
 * - Single-item groups: full card (same as before)
 * - Multi-item groups: character header + slim model rows per variant
 * Two-level DnD: group-level + item-level reorder
 */

"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div, type DivRefObject } from "next-vibe-ui/ui/div";
import { Compass } from "next-vibe-ui/ui/icons/Compass";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import { TOUR_DATA_ATTRS } from "@/app/[locale]/threads/[...path]/_components/welcome-tour/tour-attrs";
import { useTourState } from "@/app/api/[locale]/agent/chat/tour-state";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import {
  arrayFieldPath,
  withValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetSelector,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import IconWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/widget";
import TextWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/widget";
import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";

import { cn } from "../../../shared/utils";
import BadgeWidget from "../../../system/unified-interface/unified-ui/widgets/display-only/badge/widget";
import {
  Icon,
  type IconKey,
} from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { getTtsModelById } from "../../text-to-speech/models";
import { ChatSettingsRepositoryClient } from "../settings/repository-client";
import { DEFAULT_SKILLS } from "../skills/config";
import { NO_SKILL_ID } from "../skills/constants";
import { SkillCategory } from "../skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "../skills/i18n";
import definition, { type FavoriteCard } from "./definition";
import { useFavoriteSelectOverride } from "./favorite-select-context";
import { scopedTranslation } from "./i18n";
import reorderDefinition from "./reorder/definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

const FAVORITES_FIELD = "favorites";

/**
 * Skill group - favorites grouped by skillId
 */
interface SkillGroup {
  id: string; // "group-{skillId}"
  skillId: string;
  name: string;
  icon: IconKey;
  tagline: string | null;
  description: string | null;
  items: FavoriteCard[];
}

const GROUP_PREFIX = "group-";

/**
 * Resolve the localized variant label for a favorite card.
 * Checks customVariantName first, then falls back to skill config.
 * Returns null for non-variant favorites or unknown variants.
 */
function getVariantLabel(
  item: FavoriteCard,
  locale: CountryLanguage,
): string | null {
  if (item.customVariantName) {
    return item.customVariantName;
  }
  if (!item.variantId) {
    return null;
  }
  const skill = DEFAULT_SKILLS.find((s) => s.id === item.skillId);
  const variant = skill?.variants?.find((v) => v.id === item.variantId);
  if (!variant) {
    return null;
  }
  return variant.variantName
    ? skillsScopedTranslation.scopedT(locale).t(variant.variantName)
    : null;
}

/**
 * Group favorites by skillId, preserving position order.
 * Groups ordered by the minimum position of their members.
 * Group name uses the base skill name (not variant-suffixed).
 */
function groupBySkill(favorites: FavoriteCard[]): SkillGroup[] {
  const map = new Map<string, FavoriteCard[]>();
  for (const fav of favorites) {
    // Default (model-only) favorites are never grouped - each gets its own entry
    const groupKey = fav.skillId === NO_SKILL_ID ? fav.id : fav.skillId;
    const group = map.get(groupKey);
    if (group) {
      group.push(fav);
    } else {
      map.set(groupKey, [fav]);
    }
  }
  return [...map.entries()]
    .map(([groupKey, items]) => ({
      id: `${GROUP_PREFIX}${groupKey}`,
      skillId: items[0].skillId,
      // Always use base name (items[0].name is the skill name, not variant-suffixed)
      name: items[0].name,
      icon: items[0].icon,
      tagline: items[0].tagline,
      description: items[0].description,
      items,
    }))
    .toSorted((a, b) => {
      const aMin = Math.min(...a.items.map((i) => i.position));
      const bMin = Math.min(...b.items.map((i) => i.position));
      return aMin - bMin;
    });
}

/**
 * Flatten groups back to a flat list with sequential positions
 */
function flattenGroups(groups: SkillGroup[]): FavoriteCard[] {
  return groups
    .flatMap((g) => g.items)
    .map((item, i) => ({
      ...item,
      position: i,
    }));
}

type FavoriteSectionType = "companion" | "skills" | "model";

/**
 * Classify a group into its section based on skill category.
 * - companion: COMPANION category skills
 * - model: no-skill (model-only) favorites
 * - skills: everything else (specialists, tool bundles, etc.)
 */
function getSectionType(group: SkillGroup): FavoriteSectionType {
  if (group.skillId === NO_SKILL_ID) {
    return "model";
  }
  const skill = DEFAULT_SKILLS.find((s) => s.id === group.skillId);
  if (skill?.category === SkillCategory.COMPANION) {
    return "companion";
  }
  return "skills";
}

const SECTION_ORDER: FavoriteSectionType[] = ["companion", "skills", "model"];

// ============================================================================
// Full card - used for single-item groups (no own useSortable - parent handles it)
// ============================================================================

/**
 * Full card for a single favorite.
 * Drag handle attributes/listeners are passed from the parent SortableGroup.
 */
const FullCard = React.memo(function FullCard({
  item,
  index,
  fieldChildren,
  handleSelectFavorite,
  navigate,
  locale,
  isTouch,
  dragAttributes,
  dragListeners,
  logger,
  user,
}: {
  item: FavoriteCard;
  index: number;
  fieldChildren: (typeof definition.GET)["fields"]["children"];
  handleSelectFavorite: (item: FavoriteCard) => Promise<void>;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  locale: CountryLanguage;
  isTouch: boolean;
  dragAttributes: DraggableAttributes;
  dragListeners: DraggableSyntheticListeners;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
}): React.JSX.Element {
  const isActive = Boolean(item.activeBadge);

  return (
    <Div
      className={cn(
        "group relative flex items-start gap-4 p-4 rounded-lg border transition-colors",
        isActive
          ? "bg-primary/5 border-primary/20"
          : "hover:bg-accent cursor-pointer",
      )}
      onClick={() => !isActive && void handleSelectFavorite(item)}
    >
      <Div
        className={cn(
          "flex items-center justify-center rounded-lg transition-colors",
          "w-12 h-12",
          isActive
            ? "bg-primary/15 text-primary"
            : "bg-primary/10 group-hover:bg-primary/20",
        )}
      >
        <IconWidget
          field={withValue(
            fieldChildren.favorites.child.children.icon,
            item.icon,
            item,
          )}
          fieldName={arrayFieldPath(FAVORITES_FIELD, index, "icon")}
        />
      </Div>
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className={cn("font-bold", isActive && "text-primary")}>
            <TextWidget
              field={withValue(
                fieldChildren.favorites.child.children.name,
                item.name,
                item,
              )}
              fieldName={arrayFieldPath(FAVORITES_FIELD, index, "name")}
            />
          </Span>
          <TextWidget
            field={withValue(
              fieldChildren.favorites.child.children.tagline,
              item.tagline,
              item,
            )}
            fieldName={arrayFieldPath(FAVORITES_FIELD, index, "tagline")}
          />
          <BadgeWidget
            field={withValue(
              fieldChildren.favorites.child.children.activeBadge,
              item.activeBadge,
              item,
            )}
            fieldName={arrayFieldPath(FAVORITES_FIELD, index, "activeBadge")}
          />
        </Div>
        <TextWidget
          field={withValue(
            fieldChildren.favorites.child.children.description,
            item.description,
            item,
          )}
          fieldName={arrayFieldPath(FAVORITES_FIELD, index, "description")}
        />
        {/* Model-only: skip model name (already in title), keep provider + price */}
        <Div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <TextWidget
            field={withValue(
              fieldChildren.favorites.child.children.modelProvider,
              item.modelProvider,
              item,
            )}
            fieldName={arrayFieldPath(FAVORITES_FIELD, index, "modelProvider")}
          />
          <TextWidget
            field={fieldChildren.favorites.child.children.separator2}
            fieldName={arrayFieldPath(FAVORITES_FIELD, index, "separator2")}
          />
          {item.modelId && (
            <ModelCreditDisplay
              modelId={item.modelId}
              variant="text"
              className="text-xs text-muted-foreground"
              locale={locale}
            />
          )}
        </Div>
      </Div>
      <Div
        className={cn(
          "absolute top-1 right-1 flex gap-0.5",
          isTouch
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 transition-opacity",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Div
          {...dragAttributes}
          {...dragListeners}
          className="cursor-grab active:cursor-grabbing inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Icon icon={"grip"} className="h-4 w-4" />
        </Div>
        {!isActive && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={(e) => {
              e.stopPropagation();
              void handleSelectFavorite(item);
            }}
          >
            <Zap className="h-4 w-4" />
          </Button>
        )}
        {item.skillId !== NO_SKILL_ID && (
          <AddVariantButton
            skillId={item.skillId}
            navigate={navigate}
            logger={logger}
            user={user}
            locale={locale}
          />
        )}
        <EditFavoriteButton item={item} navigate={navigate} />
      </Div>
    </Div>
  );
});

// ============================================================================
// Compact variant row - used inside multi-item groups
// ============================================================================

/**
 * Compact sortable row for a variant within a multi-item group.
 * Shows: grip | model icon | model name • provider • credits | zap | edit
 */
const SortableVariantRow = React.memo(function SortableVariantRow({
  item,
  index,
  fieldChildren,
  handleSelectFavorite,
  navigate,
  locale,
  isTouch,
}: {
  item: FavoriteCard;
  index: number;
  fieldChildren: (typeof definition.GET)["fields"]["children"];
  handleSelectFavorite: (item: FavoriteCard) => Promise<void>;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  locale: CountryLanguage;
  isTouch: boolean;
}): React.JSX.Element {
  const variantLabel = getVariantLabel(item, locale);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const isActive = Boolean(item.activeBadge);

  return (
    <Div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(0, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
    >
      <Div
        className={cn(
          "group/row relative flex items-center py-1.5 px-2 rounded transition-colors",
          isActive ? "bg-primary/5" : "hover:bg-accent/50 cursor-pointer",
          isDragging && "opacity-50 z-[999]",
        )}
        onClick={() => !isActive && void handleSelectFavorite(item)}
      >
        {/* Two-line content */}
        <Div className="flex-1 min-w-0">
          {/* Line 1: variant name · model icon · model name · active badge */}
          <Div className="flex items-center gap-1.5">
            {variantLabel && (
              <Span
                className={cn(
                  "text-sm font-bold truncate",
                  isActive && "text-primary",
                )}
              >
                {variantLabel}
              </Span>
            )}
            <IconWidget
              field={withValue(
                fieldChildren.favorites.child.children.modelIcon,
                item.modelIcon,
                item,
              )}
              fieldName={arrayFieldPath(FAVORITES_FIELD, index, "modelIcon")}
            />
            <Span
              className={cn("text-sm truncate", isActive && "text-primary")}
            >
              <TextWidget
                field={withValue(
                  fieldChildren.favorites.child.children.modelInfo,
                  item.modelInfo,
                  item,
                )}
                fieldName={arrayFieldPath(FAVORITES_FIELD, index, "modelInfo")}
              />
            </Span>
            <BadgeWidget
              field={withValue(
                fieldChildren.favorites.child.children.activeBadge,
                item.activeBadge,
                item,
              )}
              fieldName={arrayFieldPath(FAVORITES_FIELD, index, "activeBadge")}
            />
          </Div>
          {/* Line 2: provider · price · voice */}
          <Div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TextWidget
              field={withValue(
                fieldChildren.favorites.child.children.modelProvider,
                item.modelProvider,
                item,
              )}
              fieldName={arrayFieldPath(
                FAVORITES_FIELD,
                index,
                "modelProvider",
              )}
            />
            {item.modelId ? (
              <>
                <TextWidget
                  field={fieldChildren.favorites.child.children.separator2}
                  fieldName={arrayFieldPath(
                    FAVORITES_FIELD,
                    index,
                    "separator2",
                  )}
                />
                <ModelCreditDisplay
                  modelId={item.modelId}
                  variant="text"
                  className="text-xs text-muted-foreground"
                  locale={locale}
                />
              </>
            ) : null}
            {item.voiceId ? (
              <>
                <TextWidget
                  field={fieldChildren.favorites.child.children.separator2}
                  fieldName={arrayFieldPath(
                    FAVORITES_FIELD,
                    index,
                    "separator2",
                  )}
                />
                <Span className="opacity-60">
                  {getTtsModelById(item.voiceId)?.name}
                </Span>
              </>
            ) : null}
          </Div>
        </Div>
        {/* Action buttons - floating absolute overlay, visible on hover */}
        <Div
          className={cn(
            "absolute top-0 right-0 flex gap-0.5 h-full items-center pr-0.5",
            isTouch
              ? "opacity-100"
              : "opacity-0 group-hover/row:opacity-100 transition-opacity",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing inline-flex items-center justify-center h-7 w-7 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Icon icon="grip" className="h-3 w-3" />
          </Div>
          {!isActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-primary"
              onClick={(e) => {
                e.stopPropagation();
                void handleSelectFavorite(item);
              }}
            >
              <Zap className="h-3 w-3" />
            </Button>
          )}
          <EditFavoriteButton item={item} navigate={navigate} size="sm" />
        </Div>
      </Div>
    </Div>
  );
});

// ============================================================================
// Sortable Group - wraps a character group
// ============================================================================

/**
 * Sortable Group Component
 * - Multi-item: character header + compact variant rows
 * - Single-item: delegates to full card
 */
const SortableGroup = React.memo(function SortableGroup({
  group,
  allFavorites,
  fieldChildren,
  handleSelectFavorite,
  navigate,
  locale,
  onItemDragEnd,
  isTouch,
  logger,
  user,
}: {
  group: SkillGroup;
  allFavorites: FavoriteCard[];
  fieldChildren: (typeof definition.GET)["fields"]["children"];
  handleSelectFavorite: (item: FavoriteCard) => Promise<void>;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  locale: CountryLanguage;
  onItemDragEnd: (groupId: string, event: DragEndEvent) => void;
  isTouch: boolean;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
}): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: group.id,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      onItemDragEnd(group.id, event);
    },
    [group.id, onItemDragEnd],
  );

  const isModelOnly = group.skillId === NO_SKILL_ID;
  const isSingle = group.items.length === 1;
  const singleIsActive = isSingle && Boolean(group.items[0].activeBadge);

  // Model-only: render as full card (no group chrome)
  if (isModelOnly) {
    const item = group.items[0];
    const globalIndex = allFavorites.findIndex((f) => f.id === item.id);
    return (
      <Div
        ref={setNodeRef as React.Ref<DivRefObject>}
        style={{
          transform: transform
            ? `translate3d(0, ${transform.y}px, 0)`
            : undefined,
          transition,
          opacity: isDragging ? 0.5 : undefined,
          zIndex: isDragging ? 999 : undefined,
        }}
      >
        <FullCard
          item={item}
          index={globalIndex}
          fieldChildren={fieldChildren}
          handleSelectFavorite={handleSelectFavorite}
          navigate={navigate}
          locale={locale}
          isTouch={isTouch}
          dragAttributes={attributes}
          dragListeners={listeners}
          logger={logger}
          user={user}
        />
      </Div>
    );
  }

  // Skill group (single or multi): character header + compact variant rows
  return (
    <Div
      ref={setNodeRef as React.Ref<DivRefObject>}
      style={{
        transform: transform
          ? `translate3d(0, ${transform.y}px, 0)`
          : undefined,
        transition,
        opacity: isDragging ? 0.5 : undefined,
        zIndex: isDragging ? 999 : undefined,
      }}
    >
      <Div
        className={cn(
          "rounded-lg border overflow-hidden transition-colors",
          isSingle && !singleIsActive && "hover:bg-accent cursor-pointer",
          isSingle && singleIsActive && "bg-primary/5 border-primary/20",
        )}
        onClick={
          isSingle
            ? () => !singleIsActive && void handleSelectFavorite(group.items[0])
            : undefined
        }
      >
        {/* Group header - matches full card layout */}
        <Div className="group relative flex items-start gap-4 px-4 pt-4 pb-2">
          <Div
            className={cn(
              "flex items-center justify-center rounded-lg w-12 h-12 shrink-0",
              isSingle && singleIsActive
                ? "bg-primary/15 text-primary"
                : "bg-primary/10",
            )}
          >
            <Icon icon={group.icon} className="h-6 w-6" />
          </Div>
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span
                className={cn("font-bold", singleIsActive && "text-primary")}
              >
                {group.name}
              </Span>
              {group.tagline ? (
                <Span className="text-sm text-muted-foreground">
                  {group.tagline}
                </Span>
              ) : null}
              {group.items.length > 1 && (
                <Span className="text-xs text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-full">
                  {group.items.length}
                </Span>
              )}
            </Div>
            {group.description ? (
              <Span className="text-xs text-muted-foreground">
                {group.description}
              </Span>
            ) : null}
          </Div>
          <Div
            className={cn(
              "absolute top-1 right-1 flex gap-0.5",
              isTouch
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 transition-opacity",
            )}
          >
            <Div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Icon icon="grip" className="h-4 w-4" />
            </Div>
            <AddVariantButton
              skillId={group.skillId}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
            />
            <DeleteGroupButton
              group={group}
              logger={logger}
              user={user}
              locale={locale}
            />
          </Div>
        </Div>

        {/* Variant rows - indented to align with text content past icon */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={group.items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Div className="border-t border-border/40 py-0.5 ml-[4.5rem] mr-3">
              {group.items.map((item) => {
                const globalIndex = allFavorites.findIndex(
                  (f) => f.id === item.id,
                );
                return (
                  <SortableVariantRow
                    key={item.id}
                    item={item}
                    index={globalIndex}
                    fieldChildren={fieldChildren}
                    handleSelectFavorite={handleSelectFavorite}
                    navigate={navigate}
                    locale={locale}
                    isTouch={isTouch}
                  />
                );
              })}
            </Div>
          </SortableContext>
        </DndContext>
      </Div>
    </Div>
  );
});

// ============================================================================
// Main container
// ============================================================================

/**
 * Custom container widget for favorites list - grouped by character
 */
export function FavoritesListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { push: navigate } = useWidgetNavigation();
  const context = useWidgetContext();
  const { logger, locale, user } = context;
  const favoritesData = useWidgetSelector<typeof definition.GET>()(
    (d) => d?.favorites,
  );
  const isTouch = useTouchDevice();

  // Local override keeps the reordered list until the API call completes,
  // preventing snap-back flicker between drop and store update.
  const [dragOverride, setDragOverride] = useState<FavoriteCard[] | null>(null);

  const groupSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const favoriteSelectOverride = useFavoriteSelectOverride();

  const handleSelectFavorite = useCallback(
    async (item: FavoriteCard): Promise<void> => {
      if (favoriteSelectOverride) {
        favoriteSelectOverride.onSelectFavorite(item);
        useTourState.getState().setModelSelectorOpen(false);
        return;
      }
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId: item.id,
        modelId: item.modelId,
        skillId: item.skillId,
        voiceId: item.voiceId,
        logger,
        locale,
        user,
      });
      useTourState.getState().setModelSelectorOpen(false);
    },
    [favoriteSelectOverride, logger, locale, user],
  );

  const rawFavoritesList = useMemo(
    () => dragOverride ?? favoritesData ?? [],
    [dragOverride, favoritesData],
  );

  // When a FavoriteSelectContext is present, recompute activeBadge locally
  // so the highlighted item reflects the current local form state, not global settings.
  const favoritesList = useMemo((): FavoriteCard[] => {
    if (!favoriteSelectOverride) {
      return rawFavoritesList;
    }
    const { activeSkillId, activeModelId } = favoriteSelectOverride;
    return rawFavoritesList.map((fav) => {
      const isActive =
        fav.skillId === activeSkillId &&
        (activeModelId === null || fav.modelId === activeModelId);
      return {
        ...fav,
        activeBadge: isActive ? "active" : null,
      };
    });
  }, [rawFavoritesList, favoriteSelectOverride]);
  const groups = useMemo(() => groupBySkill(favoritesList), [favoritesList]);

  const { t: tFav } = scopedTranslation.scopedT(locale);

  // Group sections: companion → skills → model
  const sections = useMemo((): Array<{
    type: FavoriteSectionType;
    label: string;
    groups: SkillGroup[];
  }> => {
    const bySection = new Map<FavoriteSectionType, SkillGroup[]>(
      SECTION_ORDER.map((type) => [type, []]),
    );
    for (const group of groups) {
      bySection.get(getSectionType(group))?.push(group);
    }
    return SECTION_ORDER.filter(
      (type) => (bySection.get(type)?.length ?? 0) > 0,
    ).map((type) => {
      const sectionKey = {
        companion: "get.sections.companion" as const,
        skills: "get.sections.skills" as const,
        model: "get.sections.model" as const,
      }[type];
      return {
        type,
        label: tFav(sectionKey),
        groups: bySection.get(type) ?? [],
      };
    });
  }, [groups, tFav]);

  /**
   * Persist updated positions to server/client.
   * Updates the endpoint cache synchronously so the UI never flickers,
   * then fires the API call in the background.
   */
  const persistPositions = useCallback(
    (updatedItems: FavoriteCard[]) => {
      // Set local override immediately - prevents snap-back
      setDragOverride(updatedItems);

      // Update store + fire API, then clear override
      apiClient.updateEndpointData(definition.GET, logger, (oldData) => ({
        success: true,
        data: {
          totalCount: oldData?.success ? oldData.data.totalCount : null,
          matchedCount: oldData?.success ? oldData.data.matchedCount : null,
          currentPage: oldData?.success ? oldData.data.currentPage : null,
          totalPages: oldData?.success ? oldData.data.totalPages : null,
          hint: oldData?.success ? oldData.data.hint : null,
          favorites: updatedItems,
        },
      }));

      void apiClient
        .mutate(
          reorderDefinition.POST,
          logger,
          user,
          {
            positions: updatedItems.map((item, index) => ({
              id: item.id,
              position: index,
            })),
          },
          undefined,
          locale,
        )
        .then(() => {
          logger.info("Favorites positions updated successfully");
          // Clear override - store now has the correct data
          setDragOverride(null);
          return undefined;
        })
        .catch((error: Error) => {
          logger.error("Failed to persist favorite positions", {
            errorMessage:
              error instanceof Error ? error.message : String(error),
          });
          // Still clear - optimistic update stays in store
          setDragOverride(null);
        });
    },
    [logger, user, locale],
  );

  /**
   * Handle group-level drag end - reorder entire groups
   */
  const handleGroupDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);
      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const newGroups = arrayMove(groups, oldIndex, newIndex);
      persistPositions(flattenGroups(newGroups));
    },
    [groups, persistPositions],
  );

  /**
   * Handle item-level drag end - reorder within a group
   */
  const handleItemDragEnd = useCallback(
    (groupId: string, event: DragEndEvent): void => {
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }

      const groupIndex = groups.findIndex((g) => g.id === groupId);
      if (groupIndex === -1) {
        return;
      }

      const group = groups[groupIndex];
      const oldIndex = group.items.findIndex((i) => i.id === active.id);
      const newIndex = group.items.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const newItems = arrayMove(group.items, oldIndex, newIndex);
      const newGroups = groups.map((g, i) =>
        i === groupIndex ? { ...g, items: newItems } : g,
      );
      persistPositions(flattenGroups(newGroups));
    },
    [groups, persistPositions],
  );

  const handleBrowseSkills = useCallback(async (): Promise<void> => {
    const skillsDef = await import("../skills/definition");
    navigate(skillsDef.default.GET, {});
  }, [navigate]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Tab bar: My Favorites | Browse Skills */}
      <Div className="flex border-b border-border shrink-0">
        <Div className="flex-1 flex items-center justify-center gap-1.5 h-10 text-sm font-medium border-b-2 border-primary text-primary">
          <Star className="h-4 w-4" />
          {tFav("get.tabs.myFavorites")}
        </Div>
        <Button
          type="button"
          variant="ghost"
          className="flex-1 rounded-none border-b-2 border-transparent h-10 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
          onClick={() => void handleBrowseSkills()}
          data-tour={TOUR_DATA_ATTRS.FAVORITES_BROWSE_SKILLS}
        >
          <Compass className="h-4 w-4" />
          {tFav("get.tabs.browseSkills")}
        </Button>
      </Div>

      {/* Favorites List - grouped by character */}
      <Div className="px-4 pt-4 pb-4 overflow-y-auto max-h-[min(800px,calc(100dvh-180px))]">
        {favoritesData === undefined ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : favoritesList.length > 0 ? (
          <DndContext
            sensors={groupSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleGroupDragEnd}
          >
            <SortableContext
              items={groups.map((g) => g.id)}
              strategy={verticalListSortingStrategy}
            >
              <Div className="flex flex-col gap-3">
                {sections.map((section, sectionIdx) => (
                  <Div
                    key={section.type}
                    data-tour={
                      section.type === "companion"
                        ? TOUR_DATA_ATTRS.FAVORITES_COMPANION_GROUP
                        : undefined
                    }
                  >
                    {/* Section header - only shown when multiple sections exist */}
                    {sections.length > 1 && (
                      <Div
                        className={cn(
                          "flex items-center gap-2 mb-2",
                          sectionIdx > 0 &&
                            "mt-2 pt-2 border-t border-border/40",
                        )}
                      >
                        <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {section.label}
                        </Span>
                        <Span className="text-xs text-muted-foreground/60">
                          (
                          {section.groups.reduce(
                            (n, g) => n + g.items.length,
                            0,
                          )}
                          )
                        </Span>
                      </Div>
                    )}
                    <Div className="flex flex-col gap-3">
                      {section.groups.map((group) => (
                        <SortableGroup
                          key={group.id}
                          group={group}
                          allFavorites={favoritesList}
                          fieldChildren={children}
                          handleSelectFavorite={handleSelectFavorite}
                          navigate={navigate}
                          locale={locale}
                          onItemDragEnd={handleItemDragEnd}
                          isTouch={isTouch}
                          logger={logger}
                          user={user}
                        />
                      ))}
                    </Div>
                  </Div>
                ))}
              </Div>
            </SortableContext>
          </DndContext>
        ) : (
          <Div className="text-center text-muted-foreground py-8">
            {scopedTranslation.scopedT(locale).t("get.emptyState")}
          </Div>
        )}
      </Div>
    </Div>
  );
}

// ============================================================================
// Shared helper components
// ============================================================================

/**
 * Edit Favorite Button - navigates to edit favorite
 */
/**
 * Add Variant Button - navigates to create favorite form with character data
 * Allows adding another variant of the same character from the favorites list
 */
function AddVariantButton({
  skillId,
  navigate,
  logger,
  user,
  locale,
  size,
}: {
  skillId: string;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: CountryLanguage;
  size?: "sm";
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = scopedTranslation.scopedT(locale);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const characterSingleDefinitions =
        await import("../skills/[id]/definition");
      const createFavoriteDefinitions = await import("./create/definition");
      // Fetch character data from cache or API
      const cachedData = apiClient.getEndpointData(
        characterSingleDefinitions.default.GET,
        logger,
        {
          urlPathParams: { id: skillId },
        },
      );

      if (cachedData?.success) {
        navigate(createFavoriteDefinitions.default.POST, {
          data: {
            skillId,
            icon: cachedData.data.icon ?? undefined,
            voiceModelSelection: cachedData.data.voiceModelSelection ?? null,
            modelSelection: null,
          },
          popNavigationOnSuccess: 1,
        });
        return;
      }

      const characterResponse = await apiClient.fetch(
        characterSingleDefinitions.default.GET,
        logger,
        user,
        undefined,
        { id: skillId },
        locale,
      );
      if (!characterResponse.success) {
        return;
      }

      navigate(createFavoriteDefinitions.default.POST, {
        data: {
          skillId,
          icon: characterResponse.data.icon ?? undefined,
          voiceModelSelection:
            characterResponse.data.voiceModelSelection ?? null,
          modelSelection: null,
        },
        popNavigationOnSuccess: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSmall = size === "sm";
  const iconSize = isSmall ? "h-3 w-3" : "h-4 w-4";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={isSmall ? "h-7 w-7 p-0" : undefined}
      onClick={handleClick}
      disabled={isLoading}
      title={t("get.addVariant")}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        <Plus className={iconSize} />
      )}
    </Button>
  );
}

function DeleteGroupButton({
  group,
  logger,
  user,
  locale,
}: {
  group: SkillGroup;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: CountryLanguage;
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = scopedTranslation.scopedT(locale);

  const handleConfirm = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const favoriteDetailDefinitions = await import("./[id]/definition");
      const ids = group.items.map((item) => item.id);

      await Promise.all(
        ids.map((id) =>
          apiClient.mutate(
            favoriteDetailDefinitions.default.DELETE,
            logger,
            user,
            undefined,
            { id },
            locale,
          ),
        ),
      );

      apiClient.updateEndpointData(definition.GET, logger, (oldData) => {
        if (!oldData?.success) {
          return oldData;
        }
        return {
          success: true,
          data: {
            ...oldData.data,
            favorites: oldData.data.favorites.filter(
              (f) => !ids.includes(f.id),
            ),
          },
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={(e) => e.stopPropagation()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-3"
        side="top"
        align="end"
        onInteractOutside={(e) => e.stopPropagation()}
      >
        <Div className="flex flex-col gap-2">
          <Span className="text-sm font-medium">
            {t("get.deleteGroup.confirm", { count: group.items.length })}
          </Span>
          <Div className="flex gap-2 justify-end">
            <PopoverClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                {t("get.deleteGroup.cancel")}
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleConfirm}
              >
                {t("get.deleteGroup.action")}
              </Button>
            </PopoverClose>
          </Div>
        </Div>
      </PopoverContent>
    </Popover>
  );
}

function EditFavoriteButton({
  navigate,
  item,
  size,
}: {
  item: FavoriteCard;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  size?: "sm";
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const favoriteDetailDefinitions = await import("./[id]/definition");
      navigate(favoriteDetailDefinitions.default.PATCH, {
        urlPathParams: { id: item.id },
        data: {
          skillId: item.skillId ?? undefined,
          icon: item.icon,
        },
        prefillFromGet: true,
        getEndpoint: favoriteDetailDefinitions.default.GET,
        popNavigationOnSuccess: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSmall = size === "sm";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={isSmall ? "h-7 w-7 p-0" : undefined}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2
          className={cn("animate-spin", isSmall ? "h-3 w-3" : "h-4 w-4")}
        />
      ) : (
        <Pencil className={isSmall ? "h-3 w-3" : "h-4 w-4"} />
      )}
    </Button>
  );
}
