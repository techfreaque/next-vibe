/**
 * Data Cards Widget
 * Renders data as a grid of cards
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { Span } from "next-vibe-ui/ui/span";
import { H3 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  type WidgetComponentProps,
  type RenderableValue,
} from "../../shared/ui/types";
/**
 * Data Cards Widget Data
 */
export interface DataCardsWidgetData extends Record<string, RenderableValue> {
  items: Array<Record<string, RenderableValue>>;
  columns?: number;
  titleKey?: string;
  descriptionKey?: string;
  imageKey?: string;
}

/**
 * Type guard for DataCardsWidgetData
 */
function isDataCardsWidgetData(
  data: RenderableValue,
): data is DataCardsWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "items" in data &&
    Array.isArray(data.items)
  );
}

/**
 * Data Cards Widget Component
 */
export const DataCardsWidget = ({
  data,
  metadata: _metadata,
  context: _context,
  className = "",
}: WidgetComponentProps<RenderableValue>): JSX.Element => {
  if (!isDataCardsWidgetData(data)) {
    return (
      <Div className={className} >
        —
      </Div>
    );
  }

  const typedData = data;
  const columns = typedData.columns ?? 3;
  /* eslint-disable i18next/no-literal-string */
  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  /* eslint-enable i18next/no-literal-string */

  return (
    <Div className={`grid gap-4 ${gridCols} ${className}`} >
      {typedData.items.map((item, index) => {
        const titleValue = typedData.titleKey ? item[typedData.titleKey] : "";
        const title =
          typeof titleValue === "object" && titleValue !== null
            ? JSON.stringify(titleValue)
            : String(titleValue ?? "");

        const descValue = typedData.descriptionKey
          ? item[typedData.descriptionKey]
          : "";
        const description =
          typeof descValue === "object" && descValue !== null
            ? JSON.stringify(descValue)
            : String(descValue ?? "");

        const imgValue = typedData.imageKey ? item[typedData.imageKey] : "";
        const image =
          typeof imgValue === "object" && imgValue !== null
            ? JSON.stringify(imgValue)
            : String(imgValue ?? "");

        return (
          <Div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            {image && (
              <Div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={image}
                  alt={title}
                  width={400}
                  height={225}
                  className="h-full w-full object-cover"
                />
              </Div>
            )}
            <Div className="p-4">
              {title && (
                <H3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </H3>
              )}
              {description && (
                <P className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </P>
              )}
              <Div className="flex flex-col gap-2">
                {Object.entries(item).map(([key, value]) => {
                  // Skip keys used for title, description, image
                  if (
                    key === typedData.titleKey ||
                    key === typedData.descriptionKey ||
                    key === typedData.imageKey
                  ) {
                    return null;
                  }

                  return (
                    <Div key={key} className="flex justify-between text-sm">
                      <Span className="font-medium text-gray-700 dark:text-gray-300">
                        {key}:
                      </Span>
                      <Span className="text-gray-600 dark:text-gray-400">
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : String(value ?? "")}
                      </Span>
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
