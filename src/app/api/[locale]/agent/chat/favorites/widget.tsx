/**
 * Custom Widget for Favorites List
 * Groups favorites by characterId with compact variant rows:
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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div, type DivRefObject } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import { useTourState } from "@/app/[locale]/threads/[...path]/_components/welcome-tour/tour-state-context";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import {
  arrayFieldPath,
  withValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetNavigation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import IconWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/react";
import TextWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";

import { cn } from "../../../shared/utils";
import BadgeWidget from "../../../system/unified-interface/unified-ui/widgets/display-only/badge/react";
import {
  Icon,
  type IconKey,
} from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { NO_CHARACTER_ID } from "../characters/constants";
import { ChatSettingsRepositoryClient } from "../settings/repository-client";
import definition, {
  type FavoriteCard,
  type FavoritesListResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import reorderDefinition from "./reorder/definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: FavoritesListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

/**
 * Character group — favorites grouped by characterId
 */
interface CharacterGroup {
  id: string; // "group-{characterId}"
  characterId: string;
  name: string;
  icon: IconKey;
  tagline: string | null;
  description: string | null;
  items: FavoriteCard[];
}

const GROUP_PREFIX = "group-";

/**
 * Group favorites by characterId, preserving position order.
 * Groups ordered by the minimum position of their members.
 */
function groupByCharacter(favorites: FavoriteCard[]): CharacterGroup[] {
  const map = new Map<string, FavoriteCard[]>();
  for (const fav of favorites) {
    // Default (model-only) favorites are never grouped — each gets its own entry
    const groupKey =
      fav.characterId === NO_CHARACTER_ID ? fav.id : fav.characterId;
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
      characterId: items[0].characterId,
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
function flattenGroups(groups: CharacterGroup[]): FavoriteCard[] {
  return groups
    .flatMap((g) => g.items)
    .map((item, i) => ({
      ...item,
      position: i,
    }));
}

// ============================================================================
// Full card — used for single-item groups (no own useSortable — parent handles it)
// ============================================================================

/**
 * Full card for a single favorite.
 * Drag handle attributes/listeners are passed from the parent SortableGroup.
 */
const FullCard = React.memo(function FullCard({
  item,
  index,
  fieldName,
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
  fieldName: string;
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
          fieldName={arrayFieldPath(fieldName, index, "icon")}
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
              fieldName={arrayFieldPath(fieldName, index, "name")}
            />
          </Span>
          <TextWidget
            field={withValue(
              fieldChildren.favorites.child.children.tagline,
              item.tagline,
              item,
            )}
            fieldName={arrayFieldPath(fieldName, index, "tagline")}
          />
          <BadgeWidget
            field={withValue(
              fieldChildren.favorites.child.children.activeBadge,
              item.activeBadge,
              item,
            )}
            fieldName={arrayFieldPath(fieldName, index, "activeBadge")}
          />
        </Div>
        <TextWidget
          field={withValue(
            fieldChildren.favorites.child.children.description,
            item.description,
            item,
          )}
          fieldName={arrayFieldPath(fieldName, index, "description")}
        />
        <Div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <IconWidget
            field={withValue(
              fieldChildren.favorites.child.children.modelIcon,
              item.modelIcon,
              item,
            )}
            fieldName={arrayFieldPath(fieldName, index, "modelIcon")}
          />
          <TextWidget
            field={withValue(
              fieldChildren.favorites.child.children.modelInfo,
              item.modelInfo,
              item,
            )}
            fieldName={arrayFieldPath(fieldName, index, "modelInfo")}
          />
          <TextWidget
            field={fieldChildren.favorites.child.children.separator1}
            fieldName={arrayFieldPath(fieldName, index, "separator1")}
          />
          <TextWidget
            field={withValue(
              fieldChildren.favorites.child.children.modelProvider,
              item.modelProvider,
              item,
            )}
            fieldName={arrayFieldPath(fieldName, index, "modelProvider")}
          />
          <TextWidget
            field={fieldChildren.favorites.child.children.separator2}
            fieldName={arrayFieldPath(fieldName, index, "separator2")}
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
        {item.characterId !== NO_CHARACTER_ID && (
          <AddVariantButton
            characterId={item.characterId}
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
// Compact variant row — used inside multi-item groups
// ============================================================================

/**
 * Compact sortable row for a variant within a multi-item group.
 * Shows: grip | model icon | model name • provider • credits | zap | edit
 */
const SortableVariantRow = React.memo(function SortableVariantRow({
  item,
  index,
  fieldName,
  fieldChildren,
  handleSelectFavorite,
  navigate,
  locale,
  isTouch,
}: {
  item: FavoriteCard;
  index: number;
  fieldName: string;
  fieldChildren: (typeof definition.GET)["fields"]["children"];
  handleSelectFavorite: (item: FavoriteCard) => Promise<void>;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  locale: CountryLanguage;
  isTouch: boolean;
}): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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
          "group/row flex items-center gap-2 py-1.5 px-2 rounded transition-colors",
          isActive ? "bg-primary/5" : "hover:bg-accent/50 cursor-pointer",
          isDragging && "opacity-50 z-[999]",
        )}
        onClick={() => !isActive && void handleSelectFavorite(item)}
      >
        {/* Model icon */}
        <IconWidget
          field={withValue(
            fieldChildren.favorites.child.children.modelIcon,
            item.modelIcon,
            item,
          )}
          fieldName={arrayFieldPath(fieldName, index, "modelIcon")}
        />

        {/* Two-line model info */}
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-1.5">
            <Span
              className={cn(
                "text-sm truncate",
                isActive && "text-primary font-medium",
              )}
            >
              <TextWidget
                field={withValue(
                  fieldChildren.favorites.child.children.modelInfo,
                  item.modelInfo,
                  item,
                )}
                fieldName={arrayFieldPath(fieldName, index, "modelInfo")}
              />
            </Span>
            <BadgeWidget
              field={withValue(
                fieldChildren.favorites.child.children.activeBadge,
                item.activeBadge,
                item,
              )}
              fieldName={arrayFieldPath(fieldName, index, "activeBadge")}
            />
          </Div>
          <Div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TextWidget
              field={withValue(
                fieldChildren.favorites.child.children.modelProvider,
                item.modelProvider,
                item,
              )}
              fieldName={arrayFieldPath(fieldName, index, "modelProvider")}
            />
            {item.modelId ? (
              <>
                <TextWidget
                  field={fieldChildren.favorites.child.children.separator2}
                  fieldName={arrayFieldPath(fieldName, index, "separator2")}
                />
                <ModelCreditDisplay
                  modelId={item.modelId}
                  variant="text"
                  className="text-xs text-muted-foreground"
                  locale={locale}
                />
              </>
            ) : null}
          </Div>
        </Div>

        {/* Action buttons — visible on hover */}
        <Div
          className={cn(
            "flex gap-0.5 shrink-0",
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
// Sortable Group — wraps a character group
// ============================================================================

/**
 * Sortable Group Component
 * - Multi-item: character header + compact variant rows
 * - Single-item: delegates to full card
 */
const SortableGroup = React.memo(function SortableGroup({
  group,
  allFavorites,
  fieldName,
  fieldChildren,
  handleSelectFavorite,
  navigate,
  locale,
  onItemDragEnd,
  isTouch,
  logger,
  user,
}: {
  group: CharacterGroup;
  allFavorites: FavoriteCard[];
  fieldName: string;
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
  } = useSortable({ id: group.id });

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

  const isSingle = group.items.length === 1;

  // Single-item group: render as full card (no group chrome)
  if (isSingle) {
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
          fieldName={fieldName}
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

  // Multi-item group: character header + compact variant rows
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
      <Div className="rounded-lg border overflow-hidden">
        {/* Group header — matches full card layout */}
        <Div className="group relative flex items-start gap-4 px-4 pt-4 pb-2">
          <Div className="flex items-center justify-center rounded-lg bg-primary/10 w-12 h-12 shrink-0">
            <Icon icon={group.icon} className="h-6 w-6" />
          </Div>
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-bold">{group.name}</Span>
              {group.tagline ? (
                <Span className="text-sm text-muted-foreground">
                  {group.tagline}
                </Span>
              ) : null}
              <Span className="text-xs text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-full">
                {group.items.length}
              </Span>
            </Div>
            {group.description ? (
              <Span className="text-xs text-muted-foreground">
                {group.description}
              </Span>
            ) : null}
          </Div>
          <Div
            className={cn(
              "flex gap-0.5 shrink-0",
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
              characterId={group.characterId}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
            />
          </Div>
        </Div>

        {/* Variant rows — indented to align with text content past icon */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={group.items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Div className="border-t border-border/40 ml-[4.5rem] mr-3 py-0.5">
              {group.items.map((item) => {
                const globalIndex = allFavorites.findIndex(
                  (f) => f.id === item.id,
                );
                return (
                  <SortableVariantRow
                    key={item.id}
                    item={item}
                    index={globalIndex}
                    fieldName={fieldName}
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
 * Custom container widget for favorites list — grouped by character
 */
export function FavoritesListContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { push: navigate } = useWidgetNavigation();
  const context = useWidgetContext();
  const { logger, locale, user } = context;
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

  const handleSelectFavorite = useCallback(
    async (item: FavoriteCard): Promise<void> => {
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId: item.id,
        modelId: item.modelId,
        characterId: item.characterId,
        voice: item.voice,
        logger,
        locale,
        user,
      });
      useTourState.getState().setModelSelectorOpen(false);
    },
    [logger, locale, user],
  );

  const favoritesList = useMemo(
    () => dragOverride ?? field.value?.favorites ?? [],
    [dragOverride, field.value?.favorites],
  );
  const groups = useMemo(
    () => groupByCharacter(favoritesList),
    [favoritesList],
  );

  /**
   * Persist updated positions to server/client.
   * Updates the endpoint cache synchronously so the UI never flickers,
   * then fires the API call in the background.
   */
  const persistPositions = useCallback(
    (updatedItems: FavoriteCard[]) => {
      // Set local override immediately — prevents snap-back
      setDragOverride(updatedItems);

      // Update store + fire API, then clear override
      apiClient.updateEndpointData(definition.GET, logger, () => ({
        success: true,
        data: { favorites: updatedItems },
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
          // Clear override — store now has the correct data
          setDragOverride(null);
          return undefined;
        })
        .catch((error: Error) => {
          logger.error("Failed to persist favorite positions", {
            errorMessage:
              error instanceof Error ? error.message : String(error),
          });
          // Still clear — optimistic update stays in store
          setDragOverride(null);
        });
    },
    [logger, user, locale],
  );

  /**
   * Handle group-level drag end — reorder entire groups
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
   * Handle item-level drag end — reorder within a group
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

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back + Title + Create */}
      <Div className="flex flex-row items-center gap-2 p-4">
        <NavigateButtonWidget field={children.backButton} />
        <TextWidget field={children.title} fieldName="title" />
        <NavigateButtonWidget field={children.createButton} />
      </Div>

      {/* Favorites List — grouped by character */}
      <Div className="px-4 pb-4 overflow-y-auto max-h-[min(800px,calc(100dvh-180px))]">
        {!field.value ? (
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
                {groups.map((group) => (
                  <SortableGroup
                    key={group.id}
                    group={group}
                    allFavorites={favoritesList}
                    fieldName={fieldName}
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
  characterId,
  navigate,
  logger,
  user,
  locale,
  size,
}: {
  characterId: string;
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
        await import("../characters/[id]/definition");
      const createFavoriteDefinitions = await import("./create/definition");
      const { DEFAULT_TTS_VOICE } = await import("../../text-to-speech/enum");

      // Fetch character data from cache or API
      const cachedData = apiClient.getEndpointData(
        characterSingleDefinitions.default.GET,
        logger,
        { urlPathParams: { id: characterId } },
      );

      if (cachedData?.success) {
        navigate(createFavoriteDefinitions.default.POST, {
          data: {
            characterId,
            icon: cachedData.data.icon ?? undefined,
            voice: cachedData.data.voice ?? DEFAULT_TTS_VOICE,
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
        { id: characterId },
        locale,
      );
      if (!characterResponse.success) {
        return;
      }

      navigate(createFavoriteDefinitions.default.POST, {
        data: {
          characterId,
          icon: characterResponse.data.icon ?? undefined,
          voice: characterResponse.data.voice ?? DEFAULT_TTS_VOICE,
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
          characterId: item.characterId ?? undefined,
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
