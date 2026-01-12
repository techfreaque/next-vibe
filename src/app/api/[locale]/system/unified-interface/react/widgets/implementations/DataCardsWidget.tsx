"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useState } from "react";

import type { UnifiedField } from "../../../shared/types/endpoint";
import type { WidgetType } from "../../../shared/types/enums";
import { extractDataCardsData } from "../../../shared/widgets/logic/data-cards";
import type { ReactWidgetProps, WidgetData } from "../../../shared/widgets/types";
import { isWidgetDataObject } from "../../../shared/widgets/utils/field-type-guards";
import {
  getBorderRadiusClassName,
  getGridClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

/**
 * Helper to get field value from card object
 */
const getFieldValue = (card: WidgetData, fieldName: string | undefined): WidgetData => {
  if (!fieldName || !isWidgetDataObject(card)) {
    return undefined;
  }
  return card[fieldName];
};

/**
 * Renders data as a grid of cards.
 * Each card's content is field-driven through WidgetRenderer.
 */
export const DataCardsWidget = <const TKey extends string>({
  value,
  field,
  context,
  className = "",
  endpoint,
  form,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButton,
  cancelButton,
}: ReactWidgetProps<typeof WidgetType.DATA_CARDS, TKey>): JSX.Element => {
  const {
    title,
    description,
    groupBy,
    layout,
    gap,
    cardPadding,
    groupGap,
    groupInnerGap,
    groupHeaderGap,
    groupHeaderPadding,
    cardGap,
    groupTitleSize,
    badgeSize,
    badgePadding,
    titleSize,
    descriptionSize,
    cardBorderRadius,
    badgeBorderRadius,
    maxItems,
  } = field.ui;

  // Track expanded state for sections (by section index)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  // Get classes from config (no hardcoding!)
  const gapClass = getSpacingClassName("gap", gap);
  const cardPaddingClass = getSpacingClassName("padding", cardPadding);
  const groupGapClass = getSpacingClassName("gap", groupGap);
  const groupInnerGapClass = getSpacingClassName("gap", groupInnerGap);
  const groupHeaderGapClass = getSpacingClassName("gap", groupHeaderGap);
  const groupHeaderPaddingClass = getSpacingClassName("padding", groupHeaderPadding);
  const cardGapClass = getSpacingClassName("gap", cardGap);
  const groupTitleSizeClass = getTextSizeClassName(groupTitleSize);
  const badgeSizeClass = getTextSizeClassName(badgeSize);
  const badgePaddingClass = getSpacingClassName("padding", badgePadding);
  const titleSizeClass = getTextSizeClassName(titleSize);
  const descriptionSizeClass = getTextSizeClassName(descriptionSize);
  const cardBorderRadiusClass = getBorderRadiusClassName(cardBorderRadius);
  const badgeBorderRadiusClass = getBorderRadiusClassName(badgeBorderRadius);

  const data = extractDataCardsData(value);

  if (!data) {
    return <Div className={className}>—</Div>;
  }

  const { cards, columns } = data;
  const finalColumns = layout?.columns ?? columns;
  const gridCols = getGridClassName(finalColumns as 1 | 2 | 3);

  // Type-narrow field.child for safe access in WidgetRenderer
  // ArrayField/ArrayOptionalField.child can be UnifiedField | ZodTypeAny
  // Check if it's a UnifiedField (has ui property) to distinguish from ZodTypeAny
  let childField: UnifiedField<string> | null = null;
  if (field.type === "array" || field.type === "array-optional") {
    const child = field.child;
    if (typeof child === "object" && child !== null && "ui" in child && "type" in child) {
      childField = child as UnifiedField<string>;
    }
  }

  // Group cards if groupBy is configured
  const groupedCards = groupBy
    ? cards.reduce(
        (acc, card) => {
          const groupKey = String(getFieldValue(card, groupBy) ?? "Ungrouped");
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(card);
          return acc;
        },
        {} as Record<string, typeof cards>,
      )
    : null;

  // Render a single card
  const renderCard = (card: (typeof cards)[number], index: number): JSX.Element => {
    // Check if card click navigation is configured
    const onCardClickMetadata = field.ui.metadata?.onCardClick;
    const handleCardClick = (): void => {
      if (onCardClickMetadata && context.navigation && isWidgetDataObject(card)) {
        const params = onCardClickMetadata.extractParams(card as Record<string, WidgetData>);
        context.logger.debug("DataCardsWidget: extracted params", { params });
        context.navigation.push(onCardClickMetadata.targetEndpoint, params, false, undefined);
      }
    };

    return (
      <Div
        key={index}
        className={cn(
          "w-full relative border transition-all",
          cardBorderRadiusClass || "rounded-xl",
          cardPaddingClass || "p-4",
          onCardClickMetadata
            ? "hover:bg-muted/50 hover:border-primary/20 cursor-pointer group"
            : "",
        )}
        onClick={onCardClickMetadata ? handleCardClick : undefined}
      >
        {/* Render the card's object field which has CONTAINER layout */}
        {childField ? (
          <WidgetRenderer
            widgetType={childField.ui.type}
            data={card as WidgetData}
            field={childField}
            context={context}
            endpoint={endpoint}
            form={form}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitButton={submitButton}
            cancelButton={cancelButton}
          />
        ) : null}
      </Div>
    );
  };

  // Render grouped cards with section headers
  if (groupedCards) {
    return (
      <Div className={cn("flex flex-col", groupGapClass || "gap-6", className)}>
        {Object.entries(groupedCards).map(([groupKey, groupCards]) => {
          return (
            <Div key={groupKey} className={cn("flex flex-col", groupInnerGapClass || "gap-3")}>
              {/* Group header */}
              <Div
                className={cn(
                  "flex items-center",
                  groupHeaderGapClass || "gap-2",
                  groupHeaderPaddingClass || "px-1",
                )}
              >
                <Span className={cn("font-medium", groupTitleSizeClass || "text-sm")}>
                  {context.t(groupKey)}
                </Span>
                <Div
                  className={cn(
                    "bg-muted font-medium",
                    badgeBorderRadiusClass || "rounded-md",
                    badgePaddingClass || "px-2 py-0.5",
                    badgeSizeClass || "text-[10px]",
                  )}
                >
                  {groupCards.length}
                </Div>
              </Div>

              {/* Cards in full-width stack for this group */}
              <Div className={cn("flex flex-col", cardGapClass || "gap-1")}>
                {groupCards.map((card, idx) => renderCard(card, idx))}
              </Div>
            </Div>
          );
        })}
      </Div>
    );
  }

  // Render ungrouped cards in a simple grid
  const translatedTitle = title ? context.t(title) : undefined;
  const translatedDescription = description ? context.t(description) : undefined;

  const isExpanded = expandedSections.has(0); // Use index 0 for ungrouped section
  const hasMore = maxItems && cards.length > maxItems;
  const visibleCards = hasMore && !isExpanded ? cards.slice(0, maxItems) : cards;
  const remainingCount = hasMore && !isExpanded ? cards.length - maxItems : 0;

  const toggleExpanded = (): void => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(0)) {
        newSet.delete(0);
      } else {
        newSet.add(0);
      }
      return newSet;
    });
  };

  return (
    <Div className={cn("flex flex-col gap-6", className)}>
      {/* Title and Description */}
      {(translatedTitle || translatedDescription) && (
        <Div className="flex flex-col gap-2">
          {translatedTitle && (
            <Div className={cn("font-bold", titleSizeClass || "text-2xl")}>{translatedTitle}</Div>
          )}
          {translatedDescription && (
            <Div className={cn("text-muted-foreground", descriptionSizeClass || "text-sm")}>
              {translatedDescription}
            </Div>
          )}
        </Div>
      )}

      {/* Cards grid */}
      <Div className={cn("grid", gapClass || "gap-4", gridCols)}>
        {visibleCards.map((card, index) => renderCard(card, index))}

        {/* Show More button card */}
        {hasMore && !isExpanded && (
          <Div
            className={cn(
              "w-full relative border-2 border-dashed transition-all flex items-center justify-center cursor-pointer",
              cardBorderRadiusClass || "rounded-xl",
              cardPaddingClass || "p-4",
              "hover:bg-muted/50 hover:border-primary/50 min-h-[60px]",
            )}
            onClick={toggleExpanded}
          >
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
              <ChevronDown className="h-4 w-4" />
              {context.t("app.api.system.unifiedInterface.react.widgets.dataCards.showMore", {
                count: remainingCount,
              })}
            </Button>
          </Div>
        )}
      </Div>
    </Div>
  );
};

DataCardsWidget.displayName = "DataCardsWidget";
