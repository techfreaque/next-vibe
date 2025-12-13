"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import type {
  ReactWidgetProps,
  WidgetData,
} from "../../../shared/widgets/types";
import { extractDataCardsData } from "../../../shared/widgets/logic/data-cards";
import { getGridClassName } from "../../../shared/widgets/utils/widget-helpers";
import type { UnifiedField } from "../../../shared/types/endpoint";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

/**
 * Renders data as a grid of cards with nested field widgets.
 */
export const DataCardsWidget = ({
  value,
  field,
  context,
  className = "",
}: ReactWidgetProps<typeof WidgetType.DATA_CARDS>): JSX.Element => {
  const { t } = simpleT(context.locale);
  const data = extractDataCardsData(value);

  if (!data) {
    return <Div className={className}>—</Div>;
  }

  const { cards, columns } = data;
  const gridCols = getGridClassName(columns as 1 | 2 | 3);

  let fieldDefinitions: Record<string, UnifiedField> = {};
  if (
    "type" in field &&
    (field.type === "array" || field.type === "array-optional")
  ) {
    if ("child" in field && field.child) {
      const childField = field.child as UnifiedField;
      if (
        "type" in childField &&
        (childField.type === "object" || childField.type === "object-optional")
      ) {
        if ("children" in childField && childField.children) {
          fieldDefinitions = childField.children as Record<
            string,
            UnifiedField
          >;
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
                      fieldUi &&
                      "label" in fieldUi &&
                      typeof fieldUi.label === "string"
                        ? t(fieldUi.label)
                        : key;

                    return (
                      <Div
                        key={key}
                        className="flex justify-between gap-4 text-sm"
                      >
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
