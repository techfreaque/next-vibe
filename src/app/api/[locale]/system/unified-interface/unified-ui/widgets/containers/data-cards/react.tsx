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
import { CSS } from "@dnd-kit/utilities";
import { cn } from "next-vibe/shared/utils";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { createContext, useContext, useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import { MultiWidgetRenderer } from "../../../renderers/react/MultiWidgetRenderer";
import { WidgetRenderer } from "../../../renderers/react/WidgetRenderer";
import { withValue } from "../../_shared/field-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import { hasChild, hasChildren } from "../../_shared/type-guards";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  InferChildOutput,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetNavigation,
} from "../../_shared/use-widget-context";
import type { DataCardsWidgetConfig } from "./types";

// Context for drag handle props
const DragHandleContext = createContext<{
  // oxlint-disable-next-line typescript/no-explicit-any
  attributes?: any;
  // oxlint-disable-next-line typescript/no-explicit-any
  listeners?: any;
} | null>(null);

export const useDragHandle = (): {
  // oxlint-disable-next-line typescript/no-explicit-any
  attributes?: any;
  // oxlint-disable-next-line typescript/no-explicit-any
  listeners?: any;
} | null => useContext(DragHandleContext);

/**
 * Map gap size to Tailwind classes
 */
function getGapClass(gap: string | undefined): string {
  switch (gap) {
    case "xs":
      return "gap-1";
    case "sm":
      return "gap-2";
    case "base":
      return "gap-4";
    case "lg":
      return "gap-6";
    case "xl":
      return "gap-8";
    case "2xl":
      return "gap-10";
    case "3xl":
      return "gap-12";
    default:
      return "gap-4";
  }
}

/**
 * Data Cards Widget - Displays data in card grid layout
 * Supports both array and object data structures
 */
export function DataCardsWidget<
  TKey extends string,
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  DataCardsWidgetConfig<
    TKey,
    TUsage,
    "array" | "array-optional" | "object" | "object-optional" | "widget-object",
    TChildOrChildren
  >
>): JSX.Element {
  const context = useWidgetContext();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const { t: globalT } = simpleT(locale);
  const className = field.className || "";
  // Extract getClassName before type guards to preserve type
  const getClassName = "getClassName" in field ? field.getClassName : undefined;

  // Default layout: 3 columns grid
  const columns = field.columns ?? 3;

  const gridClass = cn(
    "grid",
    {
      "grid-cols-1": columns === 1,
      "grid-cols-2": columns === 2,
      "grid-cols-3": columns === 3,
      "grid-cols-4": columns === 4,
    },
    getGapClass(field.gap),
    className,
  );

  // Handle card click
  const handleCardClick = (item: WidgetData): void => {
    if ("metadata" in field && field.metadata?.onCardClick) {
      const clickConfig = field.metadata.onCardClick;

      // Check if it's a callback variant
      if ("onClick" in clickConfig) {
        void clickConfig.onClick(
          item as InferChildOutput<TChildOrChildren>,
          context,
        );
        return;
      }

      // Otherwise it's a navigation variant
      if ("targetEndpoint" in clickConfig) {
        const { targetEndpoint, extractParams } = clickConfig;
        const params = extractParams(
          item as InferChildOutput<TChildOrChildren>,
        );
        navigation.push(targetEndpoint, params);
      }
    }
  };

  // Check if cards are clickable
  const isClickable =
    "metadata" in field && Boolean(field.metadata?.onCardClick);

  // Check if drag and drop is enabled
  const enableDragDrop =
    "metadata" in field && Boolean(field.metadata?.enableDragDrop);

  // Sensors for drag and drop - must be called unconditionally
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Local override during drag to prevent flicker
  const [dragOverride, setDragOverride] = useState<typeof field.value | null>(
    null,
  );

  // Handle array data
  if (hasChild(field)) {
    const { t } = simpleT(locale as Parameters<typeof simpleT>[0]);

    if (field.value.length === 0) {
      return (
        <Div className={className}>
          <Div className="text-muted-foreground">{t("app.common.noData")}</Div>
        </Div>
      );
    }

    const handleDragEnd = (event: DragEndEvent): void => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const currentValue = dragOverride ?? field.value;
        const oldIndex = currentValue.findIndex(
          // oxlint-disable-next-line typescript/no-unused-vars, oxlint-plugin-restricted/restricted-syntax -- item type not needed, only index used
          (_item: unknown, idx: number) => String(idx) === active.id,
        );
        const newIndex = currentValue.findIndex(
          // oxlint-disable-next-line typescript/no-unused-vars, oxlint-plugin-restricted/restricted-syntax -- item type not needed, only index used
          (_item: unknown, idx: number) => String(idx) === over.id,
        );

        const newItems = arrayMove(currentValue, oldIndex, newIndex);

        // Set local override to prevent flicker
        setDragOverride(newItems as typeof field.value);

        // Call onReorder callback if provided
        if ("metadata" in field && field.metadata?.onReorder) {
          field.metadata.onReorder(
            newItems as InferChildOutput<TChildOrChildren>[],
            context,
          );
        }

        // Clear override after a delay to let optimistic update settle
        setTimeout(() => {
          setDragOverride(null);
        }, 50);
      }
    };

    // Sortable card component
    // react-compiler/react-compiler wants this as a separate component declaration,
    // but it's defined inline to access closure variables. Hooks are safe here.
    // eslint-disable-next-line react-compiler/react-compiler
    const SortableCard = ({
      id,
      itemData,
      itemFieldName,
      dynamicCardClassName,
    }: {
      id: string;
      itemData: WidgetData;
      itemFieldName: string;
      dynamicCardClassName: string;
    }): JSX.Element => {
      // eslint-disable-next-line react-compiler/react-compiler
      const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
      } = useSortable({ id });

      const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };

      // Check if this specific card is clickable
      let isCardClickable = isClickable;
      if (
        isClickable &&
        "metadata" in field &&
        field.metadata?.onCardClick &&
        "isClickable" in field.metadata.onCardClick &&
        field.metadata.onCardClick.isClickable
      ) {
        isCardClickable = field.metadata.onCardClick.isClickable(
          itemData as InferChildOutput<TChildOrChildren>,
        );
      }

      return (
        <Div
          ref={setNodeRef}
          style={style}
          className={cn(
            isCardClickable && "cursor-pointer",
            isDragging && "opacity-50",
          )}
          onClick={
            isCardClickable ? (): void => handleCardClick(itemData) : undefined
          }
        >
          <Card
            className={cn(
              isCardClickable && "hover:bg-accent transition-colors",
              dynamicCardClassName,
              "relative",
            )}
          >
            <CardContent className="p-4">
              <DragHandleContext.Provider
                value={enableDragDrop ? { attributes, listeners } : null}
              >
                <WidgetRenderer
                  field={withValue(field.child, itemData, field.value)}
                  fieldName={itemFieldName}
                />
              </DragHandleContext.Provider>
            </CardContent>
          </Card>
        </Div>
      );
    };

    const displayValue = dragOverride ?? field.value;

    const content = (
      <MultiWidgetRenderer
        childrenSchema={field.child}
        value={displayValue}
        fieldName={fieldName}
        renderItem={({ itemData, index, itemFieldName }) => {
          const dynamicCardClassName = field.getClassName
            ? field.getClassName(itemData, displayValue)
            : "";

          return (
            <SortableCard
              key={String(index)}
              id={String(index)}
              itemData={itemData}
              itemFieldName={itemFieldName}
              dynamicCardClassName={dynamicCardClassName}
            />
          );
        }}
      />
    );

    if (enableDragDrop) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayValue.map(
              // oxlint-disable-next-line typescript/no-unused-vars, oxlint-plugin-restricted/restricted-syntax -- item type not needed, only index used
              (_item: unknown, idx: number) => String(idx),
            )}
            strategy={verticalListSortingStrategy}
          >
            <Div className={gridClass}>{content}</Div>
          </SortableContext>
        </DndContext>
      );
    }

    return <Div className={gridClass}>{content}</Div>;
  }

  // Handle object data
  if (hasChildren(field)) {
    const { t } = simpleT(locale);
    const { children, value } = field;

    if (Object.keys(children).length === 0) {
      return (
        <Div className={className}>
          <Div className="text-muted-foreground">{t("app.common.noData")}</Div>
        </Div>
      );
    }

    return (
      <Div className={gridClass}>
        {Object.keys(children).map((childName) => {
          const childField = children[childName];
          const itemData = value[childName];
          let dynamicCardClassName = "";
          if (getClassName) {
            dynamicCardClassName = getClassName(itemData, value);
          }

          return (
            <Div
              key={childName}
              className={cn(isClickable && "cursor-pointer")}
              onClick={
                isClickable ? (): void => handleCardClick(itemData) : undefined
              }
            >
              <Card
                className={cn(
                  isClickable && "hover:bg-accent transition-colors",
                  dynamicCardClassName,
                )}
              >
                <CardContent className="p-4">
                  <MultiWidgetRenderer
                    childrenSchema={{ [childName]: childField }}
                    value={value}
                    fieldName={fieldName}
                  />
                </CardContent>
              </Card>
            </Div>
          );
        })}
      </Div>
    );
  }

  // No data
  return (
    <Div className={className}>
      <Div className="text-muted-foreground">
        {globalT("app.common.noData")}
      </Div>
    </Div>
  );
}

DataCardsWidget.displayName = "DataCardsWidget";

export default DataCardsWidget;
