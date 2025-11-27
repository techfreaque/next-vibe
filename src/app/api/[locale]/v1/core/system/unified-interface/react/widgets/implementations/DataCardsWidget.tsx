/**
 * Data Cards Widget
 * Renders data as a grid of cards
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  type WidgetComponentProps,
} from "../../../shared/widgets/types";
import { extractDataCardsData } from "../../../shared/widgets/logic/data-cards";
import { getGridClassName } from "../../../shared/widgets/utils/widget-helpers";
import { formatDisplayValue } from "../../../shared/widgets/utils/formatting";

/**
 * Data Cards Widget Component
 */
export const DataCardsWidget = ({
  value,
  field: _field,
  context: _context,
  className = "",
}: WidgetComponentProps): JSX.Element => {
  const data = extractDataCardsData(value);

  if (!data) {
    return (
      <Div className={className}>
        —
      </Div>
    );
  }

  const { cards, columns } = data;
  const gridCols = getGridClassName(columns as 1 | 2 | 3);

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
                {Object.entries(card).map(([key, value]) => (
                  <Div key={key} className="flex justify-between text-sm">
                    <Span className="font-medium text-gray-700 dark:text-gray-300">
                      {key}:
                    </Span>
                    <Span className="text-gray-600 dark:text-gray-400">
                      {formatDisplayValue(value)}
                    </Span>
                  </Div>
                ))}
              </Div>
            </Div>
          </Div>
        );
      })}
    </Div>
  );
};

DataCardsWidget.displayName = "DataCardsWidget";
