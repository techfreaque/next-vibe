/**
 * Custom Widget for Favorites List
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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/components/model-credit-display";
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
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { cn } from "../../../shared/utils";
import BadgeWidget from "../../../system/unified-interface/unified-ui/widgets/display-only/badge/react";
import { Icon } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useTourState } from "../_components/welcome-tour/tour-state-context";
import { ChatSettingsRepositoryClient } from "../settings/repository-client";
import type definition from "./definition";
import type { FavoriteCard, FavoritesListResponseOutput } from "./definition";

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
 * Sortable Item Component - extracted to prevent recreating on every render
 */
const SortableItem = React.memo(function SortableItem({
  item,
  index,
  fieldName,
  fieldChildren,
  handleSelectFavorite,
  navigate,
  locale,
}: {
  item: FavoriteCard;
  index: number;
  fieldName: string;
  fieldChildren: (typeof definition.GET)["fields"]["children"];
  handleSelectFavorite: (item: FavoriteCard) => Promise<void>;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  locale: CountryLanguage;
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
      key={item.id}
      style={{
        // Only allow vertical movement (Y axis), ignore horizontal (X axis)
        transform: transform
          ? `translate3d(0, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
    >
      <Div
        className={cn(
          "group relative flex items-start gap-4 p-4 rounded-lg border transition-colors",
          isActive
            ? "bg-primary/5 border-primary/20"
            : "hover:bg-accent cursor-pointer",
          isDragging && "opacity-50 z-[999]",
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
                t={simpleT(locale as CountryLanguage).t}
                locale={locale}
              />
            )}
          </Div>
        </Div>
        <Div
          className={cn(
            "absolute top-1 right-1 flex gap-0.5",
            "opacity-0 group-hover:opacity-100 transition-opacity",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Div
            {...attributes}
            {...listeners}
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
          <EditFavoriteButton item={item} navigate={navigate} />
        </Div>
      </Div>
    </Div>
  );
});

/**
 * Custom container widget for favorites list
 */
export function FavoritesListContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { push: navigate } = useWidgetNavigation();
  const context = useWidgetContext();
  const { logger, locale, user } = context;
  const t = useMemo(() => simpleT(locale).t, [locale]);

  const [dragOverride, setDragOverride] = useState<FavoriteCard[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
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

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const currentValue = dragOverride ?? field.value?.favorites ?? [];

      const oldIndex = currentValue.findIndex((item) => item.id === active.id);
      const newIndex = currentValue.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(currentValue, oldIndex, newIndex);

      setDragOverride(newItems);

      const updatedItems = newItems.map((item, index) => ({
        ...item,
        position: index,
      }));

      void (async (): Promise<void> => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const favoritesDefinition = await import("./definition");
        const GET = favoritesDefinition.default.GET;

        apiClient.updateEndpointData(
          GET,
          logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }
            return {
              success: true,
              data: { favorites: updatedItems },
            };
          },
          undefined,
        );

        try {
          const reorderDefinition = await import("./reorder/definition");
          await apiClient.mutate(
            reorderDefinition.default.POST,
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
          );
          logger.info("Favorites positions updated successfully");
        } catch (error) {
          logger.error("Failed to update favorite positions", {
            errorMessage:
              error instanceof Error ? error.message : String(error),
          });
          await apiClient.refetchEndpoint(GET, logger);
        }
      })();

      setTimeout(() => {
        setDragOverride(null);
      }, 50);
    }
  };

  const favoritesList = dragOverride ?? field.value?.favorites ?? [];

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back + Title + Create */}
      <Div className="flex flex-row items-center gap-2 p-4">
        <NavigateButtonWidget field={children.backButton} />
        <TextWidget field={children.title} fieldName="title" />
        <NavigateButtonWidget field={children.createButton} />
      </Div>

      {/* Favorites List */}
      <Div className="px-4 pb-4 overflow-y-auto max-h-[min(800px,calc(100dvh-180px))]">
        {!field.value ? (
          // Loading spinner - centered in list area with fixed height
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : favoritesList.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={favoritesList.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <Div className="flex flex-col gap-3">
                {favoritesList.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    index={index}
                    fieldName={fieldName}
                    fieldChildren={children}
                    handleSelectFavorite={handleSelectFavorite}
                    navigate={navigate}
                    locale={locale}
                  />
                ))}
              </Div>
            </SortableContext>
          </DndContext>
        ) : (
          <Div className="text-center text-muted-foreground py-8">
            {t("app.api.agent.chat.favorites.get.emptyState")}
          </Div>
        )}
      </Div>
    </Div>
  );
}

/**
 * Edit Favorite Button - navigates to edit favorite
 * Isolated component for loading state
 */
function EditFavoriteButton({
  navigate,
  item,
}: {
  item: FavoriteCard;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
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
          name: item.name,
          description: item.description,
          tagline: item.tagline,
        },
        prefillFromGet: true,
        getEndpoint: favoriteDetailDefinitions.default.GET,
        popNavigationOnSuccess: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Pencil className="h-4 w-4" />
      )}
    </Button>
  );
}
