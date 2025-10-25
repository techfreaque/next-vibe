/**
 * Data Cards Widget
 * Renders data as a grid of cards
 */

"use client";

import type { FC } from "react";

import type { RenderableValue, WidgetComponentProps } from "../types";

/**
 * Data Cards Widget Data
 */
export interface DataCardsWidgetData {
  items: Array<Record<string, RenderableValue>>;
  columns?: number;
  titleKey?: string;
  descriptionKey?: string;
  imageKey?: string;
}

/**
 * Data Cards Widget Component
 */
export const DataCardsWidget: FC<WidgetComponentProps<DataCardsWidgetData>> = ({
  data,
  className = "",
}) => {
  const columns = data.columns ?? 3;
  /* eslint-disable i18next/no-literal-string */
  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  /* eslint-enable i18next/no-literal-string */

  return (
    <div className={`grid gap-4 ${gridCols} ${className}`}>
      {data.items.map((item, index) => {
        const titleValue = data.titleKey ? item[data.titleKey] : "";
        const title =
          typeof titleValue === "object" && titleValue !== null
            ? JSON.stringify(titleValue)
            : String(titleValue ?? "");

        const descValue = data.descriptionKey ? item[data.descriptionKey] : "";
        const description =
          typeof descValue === "object" && descValue !== null
            ? JSON.stringify(descValue)
            : String(descValue ?? "");

        const imgValue = data.imageKey ? item[data.imageKey] : "";
        const image =
          typeof imgValue === "object" && imgValue !== null
            ? JSON.stringify(imgValue)
            : String(imgValue ?? "");

        return (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            {image && (
              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              {title && (
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
              <div className="space-y-2">
                {Object.entries(item).map(([key, value]) => {
                  // Skip keys used for title, description, image
                  if (
                    key === data.titleKey ||
                    key === data.descriptionKey ||
                    key === data.imageKey
                  ) {
                    return null;
                  }

                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {key}:
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : String(value ?? "")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
