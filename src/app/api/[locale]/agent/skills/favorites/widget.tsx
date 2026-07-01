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
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { cn } from "next-vibe/core/utils/utils";
import { apiClient } from "next-vibe/platforms/react/hooks/store";
import { useTouchDevice } from "next-vibe/ui/web/hooks/use-touch-device";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/web/ui/button";
import { Div, type DivRefObject } from "next-vibe/ui/web/ui/div";
import { AlertTriangle } from "next-vibe/ui/web/ui/icons/AlertTriangle";
import { ChevronDown } from "next-vibe/ui/web/ui/icons/ChevronDown";
import { Compass } from "next-vibe/ui/web/ui/icons/Compass";
import { Loader2 } from "next-vibe/ui/web/ui/icons/Loader2";
import { Pencil } from "next-vibe/ui/web/ui/icons/Pencil";
import { Plus } from "next-vibe/ui/web/ui/icons/Plus";
import { Settings } from "next-vibe/ui/web/ui/icons/Settings";
import { Star } from "next-vibe/ui/web/ui/icons/Star";
import { Trash2 } from "next-vibe/ui/web/ui/icons/Trash2";
import { Zap } from "next-vibe/ui/web/ui/icons/Zap";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe/ui/web/ui/popover";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  arrayFieldPath,
  withValue,
} from "next-vibe/unified-ui/_shared/field-helpers";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetSelector,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import BadgeWidget from "next-vibe/unified-ui/display-only/badge/widget";
import IconWidget from "next-vibe/unified-ui/display-only/icon/widget";
import TextWidget from "next-vibe/unified-ui/display-only/text/widget";
import {
  Icon,
  type IconKey,
} from "next-vibe/unified-ui/form-fields/icon-field/icons";
import React, { useCallback, useMemo, useState } from "react";

import { TOUR_DATA_ATTRS } from "@/app/api/[locale]/agent/ai-stream/stream/widget/chat-ui/welcome-tour/tour-attrs";
import { parseSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import { useTourState } from "@/app/api/[locale]/agent/chat/tour-state";
import { useProviderAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";

import { ChatSettingsRepositoryClient } from "../../chat/settings/repository-client";
import { getTtsModelById } from "../../text-to-speech/models";
import { DEFAULT_SKILLS } from "../config";
import { NO_SKILL_ID } from "../constants";
import { SkillCategory } from "../enum";
import { scopedTranslation as skillsScopedTranslation } from "../i18n";
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
  const { skillId: baseSkillId, variantId } = parseSkillId(item.skillId);
  if (!variantId) {
    return null;
  }
  const skill = DEFAULT_SKILLS.find((s) => s.id === baseSkillId);
  const variant = skill?.variants?.find((v) => v.id === variantId);
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
    // Use base skillId (strip variant suffix) so all variants of the same skill group together
    const { skillId: baseSkillId } = parseSkillId(fav.skillId);
    const groupKey = baseSkillId === NO_SKILL_ID ? fav.id : baseSkillId;
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
      skillId: parseSkillId(items[0].skillId).skillId,
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

type FavoriteSectionType = "companion" | "skills" | "model" | "background";

/**
 * Classify a group into its section based on skill category.
 * - companion: COMPANION category skills
 * - background: BACKGROUND category skills (dreamer, autopilot)
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
  if (skill?.category === SkillCategory.BACKGROUND) {
    return "background";
  }
  return "skills";
}

const SECTION_ORDER: FavoriteSectionType[] = [
  "companion",
  "skills",
  "model",
  "background",
];

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
  isPickerMode,
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
  isPickerMode: boolean;
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
      {!isPickerMode && (
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
      )}
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
  isPickerMode,
}: {
  item: FavoriteCard;
  index: number;
  fieldChildren: (typeof definition.GET)["fields"]["children"];
  handleSelectFavorite: (item: FavoriteCard) => Promise<void>;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  locale: CountryLanguage;
  isTouch: boolean;
  isPickerMode: boolean;
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
        {/* Action buttons - floating absolute overlay, visible on hover (hidden in picker mode) */}
        {!isPickerMode && (
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
        )}
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
  isPickerMode,
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
  isPickerMode: boolean;
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

  // Multi-variant groups collapse their rows - a click anywhere on the group toggles
  const [variantsExpanded, setVariantsExpanded] = useState(false);

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
          isPickerMode={isPickerMode}
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
          !isSingle && "cursor-pointer",
        )}
        onClick={
          isSingle
            ? () => !singleIsActive && void handleSelectFavorite(group.items[0])
            : () => setVariantsExpanded((v) => !v)
        }
      >
        {/* Group header - matches full card layout */}
        <Div
          className={cn(
            "group relative flex items-start gap-4 px-4 pt-4",
            isSingle || variantsExpanded ? "pb-2" : "pb-4",
          )}
        >
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
          {!isSingle && (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 self-center text-muted-foreground transition-transform",
                variantsExpanded && "rotate-180",
              )}
            />
          )}
          {!isPickerMode && (
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
              {/* Voting moved into the favorite edit view (inline up/down). */}
              {group.skillId !== NO_SKILL_ID &&
                !DEFAULT_SKILLS.some((s) => s.id === group.skillId) && (
                  <FavoriteReportButton
                    skillId={group.skillId}
                    navigate={navigate}
                  />
                )}
              <DeleteGroupButton
                group={group}
                logger={logger}
                user={user}
                locale={locale}
              />
            </Div>
          )}
        </Div>

        {/* Variant rows - indented to align with text content past icon.
            Multi-variant groups only render rows when expanded. */}
        {(isSingle || variantsExpanded) && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={group.items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <Div
                className="border-t border-border/40 py-0.5 ml-[4.5rem] mr-3"
                onClick={(e) => e.stopPropagation()}
              >
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
                      isPickerMode={isPickerMode}
                    />
                  );
                })}
              </Div>
            </SortableContext>
          </DndContext>
        )}
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
  const availability = useProviderAvailability();
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
  const hideChrome = favoriteSelectOverride?.hideChrome ?? false;

  const onPickRaw = usePickerCallback<{ id: string; name: string }>();
  const isPickerMode = !!onPickRaw;

  const handleSelectFavorite = useCallback(
    async (item: FavoriteCard): Promise<void> => {
      if (onPickRaw) {
        onPickRaw({ id: item.id, name: item.name });
        return;
      }
      if (favoriteSelectOverride) {
        favoriteSelectOverride.onSelectFavorite(item);
        // Only close the model selector when not embedded in another panel
        if (!hideChrome) {
          useTourState.getState().setModelSelectorOpen(false);
        }
        return;
      }
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId: item.id,
        modelId: item.modelId,
        skillId: item.skillId,
        logger,
        locale,
        user,
        availability,
      });
      useTourState.getState().setModelSelectorOpen(false);
    },
    [
      onPickRaw,
      favoriteSelectOverride,
      hideChrome,
      logger,
      locale,
      user,
      availability,
    ],
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
        background: "get.sections.background" as const,
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
          availability,
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
    [logger, user, locale, availability],
  );

  /**
   * Handle group-level drag end - reorder within one section only.
   * Receives the section's groups subset; rebuilds full list preserving other sections.
   */
  const handleGroupDragEnd = useCallback(
    (sectionGroups: SkillGroup[], event: DragEndEvent): void => {
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = sectionGroups.findIndex((g) => g.id === active.id);
      const newIndex = sectionGroups.findIndex((g) => g.id === over.id);
      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const reorderedSection = arrayMove(sectionGroups, oldIndex, newIndex);
      // Collect the current positions held by this section's items (sorted)
      const sectionPositions = reorderedSection
        .flatMap((g) => g.items.map((i) => i.position))
        .toSorted((a, b) => a - b);
      // Assign those positions to the reordered items sequentially
      let posIdx = 0;
      const updatedSection = reorderedSection.map((g) => ({
        ...g,
        items: g.items.map((item) => ({
          ...item,
          position: sectionPositions[posIdx++] ?? item.position,
        })),
      }));
      const sectionIds = new Set(sectionGroups.map((g) => g.id));
      let sectionCursor = 0;
      const newGroups = groups.map((g) =>
        sectionIds.has(g.id) ? (updatedSection[sectionCursor++] ?? g) : g,
      );
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

      const reorderedItems = arrayMove(group.items, oldIndex, newIndex);
      // Reuse the same positions the group's items already hold
      const groupPositions = reorderedItems
        .map((i) => i.position)
        .toSorted((a, b) => a - b);
      const updatedItems = reorderedItems.map((item, i) => ({
        ...item,
        position: groupPositions[i] ?? item.position,
      }));
      const newGroups = groups.map((g, i) =>
        i === groupIndex ? { ...g, items: updatedItems } : g,
      );
      persistPositions(flattenGroups(newGroups));
    },
    [groups, persistPositions],
  );

  const handleBrowseSkills = useCallback(async (): Promise<void> => {
    const skillsDef = await import("../definition");
    navigate(skillsDef.default.GET, {});
  }, [navigate]);

  const handleOpenSettings = useCallback(async (): Promise<void> => {
    const settingsDef = await import("../../chat/settings/definition");
    navigate(settingsDef.default.POST, {
      prefillFromGet: true,
      getEndpoint: settingsDef.default.GET,
    });
  }, [navigate]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Tab bar: My Favorites | Settings gear - hidden when embedded or in picker mode.
          Sticky so it stays visible while the surrounding container (popover) scrolls. */}
      {!hideChrome && !isPickerMode && (
        <Div className="flex border-b border-border sticky top-0 z-10 bg-popover">
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
          <Button
            type="button"
            variant="ghost"
            className="shrink-0 h-10 w-10 px-0 rounded-none border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
            onClick={() => void handleOpenSettings()}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </Div>
      )}

      {/* Favorites List - grouped by character.
          Scroll is owned by the surrounding container (popover or page). */}
      <Div className="px-4 pt-4 pb-4">
        {favoritesData === undefined ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : favoritesList.length > 0 ? (
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
                      sectionIdx > 0 && "mt-2 pt-2 border-t border-border/40",
                    )}
                  >
                    <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.label}
                    </Span>
                    <Span className="text-xs text-muted-foreground/60">
                      {/* Count skills (groups), not variants */}(
                      {section.groups.length})
                    </Span>
                  </Div>
                )}
                <DndContext
                  sensors={groupSensors}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToParentElement]}
                  onDragEnd={(event) =>
                    handleGroupDragEnd(section.groups, event)
                  }
                >
                  <SortableContext
                    items={section.groups.map((g) => g.id)}
                    strategy={verticalListSortingStrategy}
                  >
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
                          isPickerMode={isPickerMode}
                          logger={logger}
                          user={user}
                        />
                      ))}
                    </Div>
                  </SortableContext>
                </DndContext>
              </Div>
            ))}
          </Div>
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
  const availability = useProviderAvailability();
  const { t } = scopedTranslation.scopedT(locale);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const characterSingleDefinitions = await import("../[id]/definition");
      const createFavoriteDefinitions = await import("./create/definition");
      const { skillId: baseSkillId, variantId } = parseSkillId(skillId);

      // Fetch character data from cache or API
      const cachedData = apiClient.getEndpointData(
        characterSingleDefinitions.default.GET,
        logger,
        {
          urlPathParams: { id: baseSkillId },
        },
      );

      if (cachedData?.success) {
        const cachedVariants = cachedData.data.variants;
        const cachedVariant =
          (variantId ? cachedVariants.find((v) => v.id === variantId) : null) ??
          cachedVariants.find((v) => v.isDefault) ??
          cachedVariants[0];
        navigate(createFavoriteDefinitions.default.POST, {
          data: {
            skillId,
            icon: cachedData.data.icon ?? undefined,
            voiceModelSelection: cachedVariant?.voiceModelSelection ?? null,
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
        { id: baseSkillId },
        locale,
        availability,
      );
      if (!characterResponse.success) {
        return;
      }

      const responseVariants = characterResponse.data.variants;
      const responseVariant =
        (variantId ? responseVariants.find((v) => v.id === variantId) : null) ??
        responseVariants.find((v) => v.isDefault) ??
        responseVariants[0];
      navigate(createFavoriteDefinitions.default.POST, {
        data: {
          skillId,
          icon: characterResponse.data.icon ?? undefined,
          voiceModelSelection: responseVariant?.voiceModelSelection ?? null,
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
  const availability = useProviderAvailability();
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
            availability,
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

function FavoriteReportButton({
  skillId,
  navigate,
}: {
  skillId: string;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
}): React.JSX.Element {
  const handleClick = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const reportDef = await import("../[id]/report/definition");
      navigate(reportDef.default.POST, {
        urlPathParams: { id: skillId },
        renderInModal: true,
      });
    })();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-10 w-10 p-0 inline-flex items-center justify-center text-muted-foreground hover:text-destructive"
      onClick={handleClick}
    >
      <AlertTriangle className="h-4 w-4" />
    </Button>
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
