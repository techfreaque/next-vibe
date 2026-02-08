/**
 * Custom Widget for Favorites List
 */

"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DraggableAttributes,
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
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import { createContext, useContext, useState } from "react";

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
import { simpleT } from "@/i18n/core/shared";

import { cn } from "../../../shared/utils";
import BadgeWidget from "../../../system/unified-interface/unified-ui/widgets/display-only/badge/react";
import { Icon } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useTourState } from "../_components/welcome-tour/tour-state-context";
import { ChatSettingsRepositoryClient } from "../settings/repository-client";
import type definition from "./definition";
import type { FavoriteCard, FavoritesListResponseOutput } from "./definition";

// Context for drag handle props
const DragHandleContext = createContext<{
  attributes: DraggableAttributes;
  listeners: ReturnType<typeof useSortable>["listeners"];
} | null>(null);

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
  const { t } = simpleT(locale);
  const isTouch = useTouchDevice();

  const [dragOverride, setDragOverride] = useState<FavoriteCard[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSelectFavorite = async (item: FavoriteCard): Promise<void> => {
    await ChatSettingsRepositoryClient.selectFavorite({
      favoriteId: item.id,
      modelId: item.modelId,
      characterId: item.characterId,
      logger,
      locale,
      user,
    });
    useTourState.getState().setModelSelectorOpen(false);
  };

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

  const SortableItem = ({
    item,
    index,
  }: {
    item: FavoriteCard;
    index: number;
  }): React.JSX.Element => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });
    const dragHandleProps = useContext(DragHandleContext);

    const transformStyle = transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined;

    const isActive = Boolean(item.activeBadge);

    return (
      <DragHandleContext.Provider value={{ attributes, listeners }}>
        <Div
          ref={setNodeRef}
          key={item.id}
          className={cn(
            "group relative flex items-start gap-4 p-4 rounded-lg border transition-colors",
            isActive
              ? "bg-primary/5 border-primary/20"
              : "hover:bg-accent cursor-pointer",
            transformStyle && `[transform:${transformStyle}]`,
            transition && `[transition:${transition}]`,
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
                children.favorites.child.children.icon,
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
                    children.favorites.child.children.name,
                    item.name,
                    item,
                  )}
                  fieldName={arrayFieldPath(fieldName, index, "name")}
                />
              </Span>
              <TextWidget
                field={withValue(
                  children.favorites.child.children.tagline,
                  item.tagline,
                  item,
                )}
                fieldName={arrayFieldPath(fieldName, index, "tagline")}
              />
              <BadgeWidget
                field={withValue(
                  children.favorites.child.children.activeBadge,
                  item.activeBadge,
                  item,
                )}
                fieldName={arrayFieldPath(fieldName, index, "activeBadge")}
              />
            </Div>
            <TextWidget
              field={withValue(
                children.favorites.child.children.description,
                item.description,
                item,
              )}
              fieldName={arrayFieldPath(fieldName, index, "description")}
            />
            <Div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <IconWidget
                field={withValue(
                  children.favorites.child.children.modelIcon,
                  item.modelIcon,
                  item,
                )}
                fieldName={arrayFieldPath(fieldName, index, "modelIcon")}
              />
              <TextWidget
                field={withValue(
                  children.favorites.child.children.modelInfo,
                  item.modelInfo,
                  item,
                )}
                fieldName={arrayFieldPath(fieldName, index, "modelInfo")}
              />
              <TextWidget
                field={children.favorites.child.children.separator1}
                fieldName={arrayFieldPath(fieldName, index, "separator1")}
              />
              <TextWidget
                field={withValue(
                  children.favorites.child.children.modelProvider,
                  item.modelProvider,
                  item,
                )}
                fieldName={arrayFieldPath(fieldName, index, "modelProvider")}
              />
              <TextWidget
                field={children.favorites.child.children.separator2}
                fieldName={arrayFieldPath(fieldName, index, "separator2")}
              />
              <TextWidget
                field={withValue(
                  children.favorites.child.children.creditCost,
                  item.creditCost,
                  item,
                )}
                fieldName={arrayFieldPath(fieldName, index, "creditCost")}
              />
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
            {dragHandleProps && (
              <Div
                {...dragHandleProps.attributes}
                {...dragHandleProps.listeners}
                className="cursor-grab active:cursor-grabbing inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon icon={"grip"} className="h-4 w-4" />
              </Div>
            )}
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={async (e) => {
                e.stopPropagation();
                const favoriteDetailDefinitions =
                  await import("./[id]/definition");
                navigate(favoriteDetailDefinitions.default.PATCH, {
                  urlPathParams: { id: item.id },
                });
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      </DragHandleContext.Provider>
    );
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
      <Div className="px-4 pb-4 overflow-y-auto max-h-[calc(100dvh-180px)]">
        {favoritesList.length > 0 ? (
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
                  <SortableItem key={item.id} item={item} index={index} />
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
