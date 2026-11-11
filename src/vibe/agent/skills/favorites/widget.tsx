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
import { Button } from "next-vibe/ui/components/button";
import { ArrowDown } from "next-vibe/ui/components/icons/ArrowDown";
import { ArrowUp } from "next-vibe/ui/components/icons/ArrowUp";
import { Div, type DivRefObject } from "next-vibe/ui/components/div";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { Compass } from "next-vibe/ui/components/icons/Compass";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe/ui/components/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Eye } from "next-vibe/ui/components/icons/Eye";
import { GripVertical } from "next-vibe/ui/components/icons/GripVertical";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { MoreHorizontal } from "next-vibe/ui/components/icons/MoreHorizontal";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Settings } from "next-vibe/ui/components/icons/Settings";
import { Share2 } from "next-vibe/ui/components/icons/Share2";
import { Star } from "next-vibe/ui/components/icons/Star";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { Span } from "next-vibe/ui/components/span";
import { useTouchDevice } from "next-vibe/ui/hooks/use-touch-device";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetSelector,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import { type IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import React, { useCallback, useMemo, useState } from "react";

import { TOUR_DATA_ATTRS } from "../../ai-stream/stream/widget/chat-ui/welcome-tour/tour-attrs";
import { ChatSettingsRepositoryClient } from "../../chat/settings/repository-client";
import { parseSkillId } from "../../chat/slugify";
import { useTourState } from "../../chat/tour-state";
import { ShareSkillDialog } from "../[id]/share-skill";
import { ModelCreditDisplay } from "../../models/widget/model-credit-display";
import { DEFAULT_SKILLS } from "../config";
import { NO_SKILL_ID } from "../constants";
import { SkillCategory } from "../enum";
import { scopedTranslation as skillsScopedTranslation } from "../i18n";
import definition, { type FavoriteCard } from "./definition";
import { useFavoriteSelectOverride } from "./favorite-select-context";
import { scopedTranslation } from "./i18n";
import reorderDefinition from "./reorder/definition";

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
// Shared types + actions
// ============================================================================

type WidgetLogger = ReturnType<typeof useWidgetContext>["logger"];
type WidgetUser = ReturnType<typeof useWidgetContext>["user"];
type NavigateFn = ReturnType<typeof useWidgetNavigation>["push"];

interface ActionDeps {
  navigate: NavigateFn;
  logger: WidgetLogger;
  user: WidgetUser;
  locale: CountryLanguage;
}

/**
 * Delete favorites by id and drop them from the cached list.
 *
 * Uses the batch-delete endpoint - ONE atomic operation for all ids. Firing one
 * DELETE per id (Promise.all) raced for public (localStorage) users: each DELETE
 * is a read-modify-write, so concurrent deletes read the same snapshot and each
 * dropped only its own id, leaving all-but-one variant behind after a refresh.
 *
 * The cache is only patched AFTER the server confirms success - never
 * optimistically. If the mutation fails (or throws) we leave the list as-is and
 * refetch so the real server state shows, rather than silently hiding a skill
 * that was never actually deleted.
 */
async function removeFavorites(
  ids: string[],
  { logger, user, locale }: ActionDeps,
): Promise<void> {
  const deleteBatchDefinitions = await import("./delete-batch/definition");
  try {
    const result = await apiClient.mutate(
      deleteBatchDefinitions.default.POST,
      logger,
      user,
      { ids },
      undefined,
      locale,
    );
    if (!result.success) {
      logger.error("Failed to remove favorites", {
        errorMessage: result.message,
        errorType: result.errorType,
        count: ids.length,
      });
      // Server rejected the delete - pull the true list back so nothing is
      // left hidden in the cache.
      await apiClient.refetchEndpoint(definition.GET, logger);
      return;
    }
    const idsToRemove = new Set(ids);
    apiClient.updateEndpointData(definition.GET, logger, (oldData) => {
      if (!oldData?.success) {
        return oldData;
      }
      return {
        success: true,
        data: {
          ...oldData.data,
          favorites: oldData.data.favorites.filter(
            (f) => !idsToRemove.has(f.id),
          ),
        },
      };
    });
  } catch (error) {
    logger.error("Failed to remove favorites", {
      errorMessage: error instanceof Error ? error.message : String(error),
      count: ids.length,
    });
    await apiClient.refetchEndpoint(definition.GET, logger);
  }
}

/** Open the create-favorite form prefilled for another variant of a skill. */
async function openAddVariant(
  skillId: string,
  { navigate, logger, user, locale }: ActionDeps,
): Promise<void> {
  const characterSingleDefinitions = await import("../[id]/definition");
  const createFavoriteDefinitions = await import("./create/definition");
  const { skillId: baseSkillId, variantId } = parseSkillId(skillId);

  const cachedData = apiClient.getEndpointData(
    characterSingleDefinitions.default.GET,
    logger,
    { urlPathParams: { id: baseSkillId } },
  );
  const skillData = cachedData?.success
    ? cachedData.data
    : await apiClient
        .fetch(
          characterSingleDefinitions.default.GET,
          logger,
          user,
          undefined,
          { id: baseSkillId },
          locale,
        )
        .then((response) => (response.success ? response.data : null));
  if (!skillData) {
    return;
  }
  const variants = skillData.variants;
  const variant =
    (variantId ? variants.find((v) => v.id === variantId) : null) ??
    variants.find((v) => v.isDefault) ??
    variants[0];
  navigate(createFavoriteDefinitions.default.POST, {
    data: {
      skillId,
      icon: skillData.icon ?? undefined,
      voiceModelSelection: variant?.voiceModelSelection ?? null,
      modelSelection: null,
    },
    popNavigationOnSuccess: 1,
  });
}

async function openSkillDetails(
  skillId: string,
  navigate: NavigateFn,
): Promise<void> {
  const { skillId: baseSkillId } = parseSkillId(skillId);
  const skillDetailDef = await import("../[id]/definition");
  navigate(skillDetailDef.default.GET, {
    urlPathParams: { id: baseSkillId },
  });
}

async function openEditFavorite(
  item: FavoriteCard,
  navigate: NavigateFn,
): Promise<void> {
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
}

/** Max variant rows shown for a group that doesn't hold the active favorite. */
const COLLAPSED_ROW_COUNT = 1;

/** Up/down step for menu-driven reorder (phones have no drag handles) */
type MoveDirection = -1 | 1;

/**
 * "Move up" / "Move down" menu items - the touch-friendly twin of the drag
 * handles. Renders nothing when there is nowhere to move.
 */
function MoveMenuItems({
  onMoveUp,
  onMoveDown,
  locale,
}: {
  onMoveUp: (() => void) | undefined;
  onMoveDown: (() => void) | undefined;
  locale: CountryLanguage;
}): React.JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  if (!onMoveUp && !onMoveDown) {
    return null;
  }
  return (
    <>
      {onMoveUp && (
        <DropdownMenuItem onSelect={onMoveUp} className="cursor-pointer">
          <ArrowUp className="mr-2 h-4 w-4" />
          {t("get.actions.moveUp")}
        </DropdownMenuItem>
      )}
      {onMoveDown && (
        <DropdownMenuItem onSelect={onMoveDown} className="cursor-pointer">
          <ArrowDown className="mr-2 h-4 w-4" />
          {t("get.actions.moveDown")}
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
    </>
  );
}

// ============================================================================
// Variant row - one selectable model config
// ============================================================================

/**
 * One selectable model under a character.
 * Layout: [select: model icon + label/model] [price] [active check] [menu].
 * Price lives outside the select button (it's its own popover trigger).
 */
const VariantRow = React.memo(function VariantRow({
  item,
  showVariantLabel,
  handleSelectFavorite,
  deps,
  isTouch,
  isPickerMode,
  sortable,
  onMoveUp,
  onMoveDown,
}: {
  item: FavoriteCard;
  /** Model-only favorites show the model as the title instead */
  showVariantLabel: boolean;
  handleSelectFavorite: (item: FavoriteCard) => Promise<void>;
  deps: ActionDeps;
  isTouch: boolean;
  isPickerMode: boolean;
  sortable: boolean;
  /** undefined = already first / nothing to reorder */
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(deps.locale);
  const variantLabel = showVariantLabel
    ? getVariantLabel(item, deps.locale)
    : null;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !sortable });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isActive = Boolean(item.activeBadge);
  const title = variantLabel ?? item.modelInfo;
  const subtitle = variantLabel ? item.modelInfo : item.modelProvider;

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
        data-favorite-row={item.id}
        className={cn(
          "group/row relative flex min-h-11 items-center gap-1 rounded-lg pr-1 transition-colors",
          isActive ? "bg-primary/[0.08]" : "hover:bg-accent",
          isDragging && "z-[999] opacity-60 shadow-lg",
        )}
      >
        {/* Drag handle - desktop only, in the left gutter on hover */}
        {sortable && !isPickerMode && !isTouch && (
          <Div
            {...attributes}
            {...listeners}
            title={t("get.actions.reorder")}
            className="absolute -left-4 top-1/2 flex h-7 w-4 -translate-y-1/2 cursor-grab items-center justify-center text-muted-foreground/50 opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </Div>
        )}

        <Button
          type="button"
          variant="ghost"
          aria-current={isActive ? "true" : undefined}
          onClick={() => !isActive && void handleSelectFavorite(item)}
          className={cn(
            "h-auto min-h-11 min-w-0 flex-1 justify-start gap-2.5 rounded-lg px-2 py-1.5 text-left font-normal whitespace-normal hover:bg-transparent",
            isActive && "cursor-default",
          )}
        >
          <Icon
            icon={item.modelIcon}
            className={cn(
              "h-4 w-4 shrink-0",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          />
          <Div className="flex min-w-0 flex-1 flex-col">
            <Span
              className={cn(
                "truncate text-sm font-medium leading-tight",
                isActive && "text-primary",
              )}
            >
              {title}
            </Span>
            {/* Phones: price (credits + money) gets its own line so the model name never truncates to one letter */}
            <Span className="flex min-w-0 flex-col items-start gap-x-1.5 text-xs leading-tight text-muted-foreground sm:flex-row sm:items-center">
              <Span className="max-w-full truncate">{subtitle}</Span>
              {item.modelId ? (
                <>
                  <Span
                    aria-hidden
                    className="hidden h-1 w-1 shrink-0 rounded-full bg-current opacity-40 sm:block"
                  />
                  <ModelCreditDisplay
                    modelId={item.modelId}
                    variant="text"
                    interactive={false}
                    className="shrink-0 tabular-nums"
                    locale={deps.locale}
                  />
                </>
              ) : null}
            </Span>
          </Div>
        </Button>

        <Div className="flex w-5 shrink-0 justify-center">
          {isActive && (
            <Check
              className="h-4 w-4 text-primary"
              aria-label={t("get.actions.active")}
            />
          )}
        </Div>

        {!isPickerMode && (
          <Div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t("get.actions.menu")}
                  title={t("get.actions.menu")}
                  className={cn(
                    "h-8 w-8 text-muted-foreground hover:text-foreground",
                    !isTouch &&
                      "opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100",
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onCloseAutoFocus={(e) => e?.preventDefault()}
              >
                <DropdownMenuItem
                  onSelect={() => void openEditFavorite(item, deps.navigate)}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("get.actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <MoveMenuItems
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  locale={deps.locale}
                />
                <DropdownMenuItem
                  onSelect={() => setConfirmOpen(true)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("get.deleteVariantAction")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmRemoveDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title={t("get.deleteVariant")}
              actionLabel={t("get.deleteVariantAction")}
              cancelLabel={t("get.deleteGroup.cancel")}
              onConfirm={() => void removeFavorites([item.id], deps)}
            />
          </Div>
        )}
      </Div>
    </Div>
  );
});

// ============================================================================
// Sortable Group - one character with its model rows
// ============================================================================

/** Rows start where the character name starts: px-3 (12) + avatar (36) + gap (12) - row padding (8) */
const ROW_INDENT = "pl-[52px]";

const SortableGroup = React.memo(function SortableGroup({
  group,
  handleSelectFavorite,
  deps,
  onItemDragEnd,
  onMoveItem,
  onMoveUp,
  onMoveDown,
  isTouch,
  isPickerMode,
}: {
  group: SkillGroup;
  handleSelectFavorite: (item: FavoriteCard) => Promise<void>;
  deps: ActionDeps;
  onItemDragEnd: (groupId: string, event: DragEndEvent) => void;
  onMoveItem: (
    groupId: string,
    itemId: string,
    direction: MoveDirection,
  ) => void;
  /** Move this whole group within its section; undefined at the edge */
  onMoveUp: (() => void) | undefined;
  onMoveDown: (() => void) | undefined;
  isTouch: boolean;
  isPickerMode: boolean;
}): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(deps.locale);
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

  const isModelOnly = group.skillId === NO_SKILL_ID;
  const hasActive = group.items.some((i) => Boolean(i.activeBadge));
  // Groups holding the active favorite open by default; others show one row.
  const [expanded, setExpanded] = useState(hasActive);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const canCollapse = group.items.length > COLLAPSED_ROW_COUNT;
  const visibleItems =
    expanded || !canCollapse
      ? group.items
      : [
          group.items.find((i) => Boolean(i.activeBadge)) ?? group.items[0],
        ].filter((i): i is FavoriteCard => i !== undefined);
  const hiddenCount = group.items.length - visibleItems.length;

  const sortStyle = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.6 : undefined,
    zIndex: isDragging ? 999 : undefined,
  };

  // Model-only favorite: a single row in its own card, no character chrome
  if (isModelOnly) {
    const item = group.items[0];
    return (
      <Div ref={setNodeRef as React.Ref<DivRefObject>} style={sortStyle}>
        <Div className="group/head relative rounded-xl border border-border bg-card p-1.5">
          {!isPickerMode && !isTouch && (
            <Div
              {...attributes}
              {...listeners}
              title={t("get.actions.reorder")}
              className="absolute -left-0.5 top-1/2 flex h-7 w-4 -translate-y-1/2 cursor-grab items-center justify-center text-muted-foreground/50 opacity-0 transition-opacity group-hover/head:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </Div>
          )}
          {item ? (
            <VariantRow
              item={item}
              showVariantLabel={false}
              handleSelectFavorite={handleSelectFavorite}
              deps={deps}
              isTouch={isTouch}
              isPickerMode={isPickerMode}
              sortable={false}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
            />
          ) : null}
        </Div>
      </Div>
    );
  }

  const isMulti = group.items.length > 1;

  return (
    <Div ref={setNodeRef as React.Ref<DivRefObject>} style={sortStyle}>
      <Div
        className={cn(
          "rounded-xl border bg-card transition-colors",
          hasActive ? "border-primary/40" : "border-border",
        )}
      >
        {/* Character header */}
        <Div className="group/head relative flex items-center gap-3 px-3 pb-1 pt-3">
          {!isPickerMode && !isTouch && (
            <Div
              {...attributes}
              {...listeners}
              title={t("get.actions.reorder")}
              className="absolute left-0 top-1/2 flex h-8 w-3 -translate-y-1/2 cursor-grab items-center justify-center text-muted-foreground/50 opacity-0 transition-opacity group-hover/head:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </Div>
          )}
          <Div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              hasActive
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary",
            )}
          >
            <Icon icon={group.icon} className="h-[18px] w-[18px]" />
          </Div>
          <Div
            className="flex min-w-0 flex-1 flex-col"
            title={group.description ?? undefined}
          >
            <Span className="truncate text-sm font-semibold leading-tight">
              {group.name}
            </Span>
            {group.tagline ? (
              <Span className="truncate text-xs leading-tight text-muted-foreground">
                {group.tagline}
              </Span>
            ) : null}
          </Div>
          {!isPickerMode && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("get.actions.menu")}
                    title={t("get.actions.menu")}
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onCloseAutoFocus={(e) => e?.preventDefault()}
                >
                  <DropdownMenuItem
                    onSelect={() =>
                      void openSkillDetails(group.skillId, deps.navigate)
                    }
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t("get.viewSkill")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => void openAddVariant(group.skillId, deps)}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("get.addVariant")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setShareOpen(true)}
                    className="cursor-pointer"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {t("get.actions.share")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <MoveMenuItems
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    locale={deps.locale}
                  />
                  <DropdownMenuItem
                    onSelect={() => setConfirmOpen(true)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isMulti
                      ? t("get.deleteGroup.trigger")
                      : t("get.deleteVariantAction")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ConfirmRemoveDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={
                  isMulti
                    ? t("get.deleteGroup.confirm", {
                        count: String(group.items.length),
                      })
                    : t("get.deleteVariant")
                }
                actionLabel={
                  isMulti
                    ? t("get.deleteGroup.action")
                    : t("get.deleteVariantAction")
                }
                cancelLabel={t("get.deleteGroup.cancel")}
                onConfirm={() =>
                  void removeFavorites(
                    group.items.map((i) => i.id),
                    deps,
                  )
                }
              />
              <ShareSkillDialog
                skillId={parseSkillId(group.skillId).skillId}
                skillName={group.name}
                locale={deps.locale}
                open={shareOpen}
                onOpenChange={setShareOpen}
              />
            </>
          )}
        </Div>

        {/* Model rows - aligned under the character name */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Div
              className={cn("flex flex-col gap-0.5 pb-2 pr-1.5", ROW_INDENT)}
            >
              {visibleItems.map((item) => {
                const index = group.items.findIndex((i) => i.id === item.id);
                return (
                  <VariantRow
                    key={item.id}
                    item={item}
                    showVariantLabel
                    handleSelectFavorite={handleSelectFavorite}
                    deps={deps}
                    isTouch={isTouch}
                    isPickerMode={isPickerMode}
                    sortable={expanded && isMulti}
                    onMoveUp={
                      expanded && index > 0
                        ? () => onMoveItem(group.id, item.id, -1)
                        : undefined
                    }
                    onMoveDown={
                      expanded && isMulti && index < group.items.length - 1
                        ? () => onMoveItem(group.id, item.id, 1)
                        : undefined
                    }
                  />
                );
              })}
              {canCollapse && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 justify-start gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                >
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      expanded && "rotate-180",
                    )}
                  />
                  {expanded
                    ? t("get.actions.showLess")
                    : t("get.actions.showMore", {
                        count: String(hiddenCount),
                      })}
                </Button>
              )}
            </Div>
          </SortableContext>
        </DndContext>
      </Div>
    </Div>
  );
});

function ConfirmRemoveDialog({
  open,
  onOpenChange,
  title,
  actionLabel,
  cancelLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  actionLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
}): React.JSX.Element {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================================================
// Main container
// ============================================================================

/**
 * Custom container widget for favorites list - grouped by character
 */
// Field metadata is unused: rows render their own typed layout
export function FavoritesListContainer(): React.JSX.Element {
  const { push: navigate } = useWidgetNavigation();
  const context = useWidgetContext();
  const { logger, locale, user } = context;
  const deps = useMemo(
    (): ActionDeps => ({ navigate, logger, user, locale }),
    [navigate, logger, user, locale],
  );
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
      });
      useTourState.getState().setModelSelectorOpen(false);
    },
    [onPickRaw, favoriteSelectOverride, hideChrome, logger, locale, user],
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
   * Reorder groups within one section only: move activeId to overId's slot.
   * Receives the section's groups subset; rebuilds full list preserving other sections.
   */
  const reorderGroups = useCallback(
    (sectionGroups: SkillGroup[], activeId: string, overId: string): void => {
      const oldIndex = sectionGroups.findIndex((g) => g.id === activeId);
      const newIndex = sectionGroups.findIndex((g) => g.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
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

  /** Reorder items within a group: move activeId to overId's slot. */
  const reorderItems = useCallback(
    (groupId: string, activeId: string, overId: string): void => {
      const groupIndex = groups.findIndex((g) => g.id === groupId);
      if (groupIndex === -1) {
        return;
      }

      const group = groups[groupIndex];
      const oldIndex = group.items.findIndex((i) => i.id === activeId);
      const newIndex = group.items.findIndex((i) => i.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
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

  const handleGroupDragEnd = useCallback(
    (sectionGroups: SkillGroup[], event: DragEndEvent): void => {
      const { active, over } = event;
      if (!over) {
        return;
      }
      reorderGroups(sectionGroups, String(active.id), String(over.id));
    },
    [reorderGroups],
  );

  const handleItemDragEnd = useCallback(
    (groupId: string, event: DragEndEvent): void => {
      const { active, over } = event;
      if (!over) {
        return;
      }
      reorderItems(groupId, String(active.id), String(over.id));
    },
    [reorderItems],
  );

  /** Menu-driven reorder: swap an item with its neighbour inside the group. */
  const handleMoveItem = useCallback(
    (groupId: string, itemId: string, direction: MoveDirection): void => {
      const group = groups.find((g) => g.id === groupId);
      const index = group?.items.findIndex((i) => i.id === itemId) ?? -1;
      const neighbour = group?.items[index + direction];
      if (index === -1 || !neighbour) {
        return;
      }
      reorderItems(groupId, itemId, neighbour.id);
    },
    [groups, reorderItems],
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
      {/* Header: segmented Favorites | Browse + settings. Hidden when embedded or picking.
          Sticky so it stays visible while the surrounding container scrolls. */}
      {!hideChrome && !isPickerMode && (
        <Div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-popover/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-popover/80">
          <Div
            role="tablist"
            className="grid flex-1 grid-cols-2 gap-1 rounded-lg bg-muted p-1"
          >
            <Div
              role="tab"
              aria-selected
              className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-card text-sm font-medium text-foreground shadow-sm"
            >
              <Star className="h-3.5 w-3.5 text-primary" />
              {tFav("get.tabs.myFavorites")}
            </Div>
            <Button
              type="button"
              role="tab"
              aria-selected={false}
              variant="ghost"
              className="h-8 gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground hover:bg-card/60 hover:text-foreground"
              onClick={() => void handleBrowseSkills()}
              data-tour={TOUR_DATA_ATTRS.FAVORITES_BROWSE_SKILLS}
            >
              <Compass className="h-3.5 w-3.5" />
              {tFav("get.tabs.browseSkills")}
            </Button>
          </Div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => void handleOpenSettings()}
            aria-label={tFav("get.actions.settings")}
            title={tFav("get.actions.settings")}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </Div>
      )}

      {/* Favorites List - grouped by character.
          Scroll is owned by the surrounding container (popover or page). */}
      <Div className="px-3 pt-3 pb-3">
        {favoritesData === undefined ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : favoritesList.length > 0 ? (
          <Div className="flex flex-col gap-1">
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
                      "mb-2 flex items-center gap-2 px-1",
                      sectionIdx > 0 && "mt-3",
                    )}
                  >
                    <Span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.label}
                    </Span>
                    <Span className="text-[11px] tabular-nums text-muted-foreground/60">
                      {/* Count skills (groups), not variants */}
                      {section.groups.length}
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
                    <Div className="flex flex-col gap-2">
                      {section.groups.map((group, groupIdx) => {
                        const prev = section.groups[groupIdx - 1];
                        const next = section.groups[groupIdx + 1];
                        return (
                          <SortableGroup
                            key={group.id}
                            group={group}
                            handleSelectFavorite={handleSelectFavorite}
                            deps={deps}
                            onItemDragEnd={handleItemDragEnd}
                            onMoveItem={handleMoveItem}
                            onMoveUp={
                              prev
                                ? () =>
                                    reorderGroups(
                                      section.groups,
                                      group.id,
                                      prev.id,
                                    )
                                : undefined
                            }
                            onMoveDown={
                              next
                                ? () =>
                                    reorderGroups(
                                      section.groups,
                                      group.id,
                                      next.id,
                                    )
                                : undefined
                            }
                            isTouch={isTouch}
                            isPickerMode={isPickerMode}
                          />
                        );
                      })}
                    </Div>
                  </SortableContext>
                </DndContext>
              </Div>
            ))}
            {!isPickerMode && !hideChrome && (
              <Button
                type="button"
                variant="ghost"
                className="mt-2 h-11 w-full gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                onClick={() => void handleBrowseSkills()}
              >
                <Plus className="h-4 w-4" />
                {tFav("get.actions.addAi")}
              </Button>
            )}
          </Div>
        ) : (
          <Div className="flex flex-col items-center gap-3 py-10 text-center">
            <Div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </Div>
            <Span className="text-sm text-muted-foreground">
              {tFav("get.emptyState")}
            </Span>
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              onClick={() => void handleBrowseSkills()}
            >
              <Compass className="h-4 w-4" />
              {tFav("get.tabs.browseSkills")}
            </Button>
          </Div>
        )}
      </Div>
    </Div>
  );
}
