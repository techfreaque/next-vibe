"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { UnifiedField } from "../../../shared/types/endpoint";
import type { WidgetType } from "../../../shared/types/enums";
import { extractDataCardsData } from "../../../shared/widgets/logic/data-cards";
import type { ReactWidgetProps, WidgetData } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";
import { getGridClassName } from "../../../shared/widgets/utils/widget-helpers";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

/**
 * Renders data as a grid of cards with nested field widgets.
 */
export const DataCardsWidget = <const TKey extends string>({
  value,
  field,
  context,
  className = "",
  endpoint,
}: ReactWidgetProps<typeof WidgetType.DATA_CARDS, TKey>): JSX.Element => {
  const { t } = getTranslator(context);
  const data = extractDataCardsData(value);

  if (!data) {
    return <Div className={className}>—</Div>;
  }

  // Read layout config from field UI
  const layoutColumns =
    "ui" in field &&
    field.ui &&
    typeof field.ui === "object" &&
    "layout" in field.ui &&
    field.ui.layout &&
    typeof field.ui.layout === "object" &&
    "columns" in field.ui.layout &&
    typeof field.ui.layout.columns === "number"
      ? field.ui.layout.columns
      : undefined;

  const { cards, columns } = data;
  const finalColumns = layoutColumns ?? columns;
  const gridCols = getGridClassName(finalColumns as 1 | 2 | 3);

  let fieldDefinitions: Record<string, UnifiedField<string>> = {};
  if ("type" in field && (field.type === "array" || field.type === "array-optional")) {
    if ("child" in field && field.child) {
      const childField = field.child as UnifiedField<string>;
      if (
        "type" in childField &&
        (childField.type === "object" || childField.type === "object-optional")
      ) {
        if ("children" in childField && childField.children) {
          fieldDefinitions = childField.children as Record<string, UnifiedField<string>>;
        }
      }
    }
  }

  return (
    <Div className={`grid gap-4 ${gridCols} ${className}`}>
      {cards.map((card, index: number) => {
        return (
          <Div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <Div className="p-4">
              <Div className="flex flex-col gap-2">
                {card &&
                  typeof card === "object" &&
                  Object.entries(card).map(([key, cardValue]) => {
                    const fieldDef = fieldDefinitions[key];
                    const fieldUi = fieldDef?.ui;
                    const label =
                      fieldUi && "label" in fieldUi && typeof fieldUi.label === "string"
                        ? t(fieldUi.label)
                        : key;

                    return (
                      <Div key={key} className="flex justify-between gap-4 text-sm">
                        <Span className="font-medium text-gray-700 dark:text-gray-300">
                          {label}:
                        </Span>
                        <Div className="text-right">
                          {fieldDef ? (
                            <WidgetRenderer
                              widgetType={fieldDef.ui.type}
                              data={cardValue as WidgetData}
                              field={fieldDef}
                              context={context}
                              endpoint={endpoint}
                            />
                          ) : (
                            <Span className="text-gray-600 dark:text-gray-400">
                              {String(cardValue ?? "—")}
                            </Span>
                          )}
                        </Div>
                      </Div>
                    );
                  })}
              </Div>
            </Div>
          </Div>
        );
      })}
    </Div>
  );
};

DataCardsWidget.displayName = "DataCardsWidget";
