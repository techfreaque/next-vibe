/**
 * Range Slider Component
 * A beautiful range slider with draggable min/max handles and icon labels
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import * as React from "react";

import { Icon, type IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { TranslationKey } from "@/i18n/core/static-types";

import { Span } from "./span";

export interface RangeSliderOption {
  label: TranslationKey;
  value: string | number;
  icon?: IconKey;
  description?: TranslationKey;
}

export interface RangeSliderProps {
  options: RangeSliderOption[];
  minIndex: number;
  maxIndex: number;
  onChange: (minIndex: number, maxIndex: number) => void;
  disabled?: boolean;
  minLabel?: string;
  maxLabel?: string;
  t: (key: TranslationKey) => string;
  className?: string;
}

export function RangeSlider({
  options,
  minIndex,
  maxIndex,
  onChange,
  disabled = false,
  minLabel = "MIN",
  maxLabel = "MAX",
  t,
  className,
}: RangeSliderProps): React.JSX.Element {
  const [dragging, setDragging] = React.useState<"min" | "max" | null>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!dragging || !trackRef.current || disabled) {
        return;
      }

      const rect = trackRef.current.getBoundingClientRect();
      const inset = 48; // 3rem = 48px
      const x = e.clientX - rect.left - inset;
      const activeWidth = rect.width - inset * 2;
      const percentage = Math.max(0, Math.min(1, x / activeWidth));
      const value = Math.round(percentage * (options.length - 1));

      if (dragging === "min") {
        if (value <= maxIndex) {
          onChange(value, maxIndex);
        } else {
          // Min dragged beyond max - swap them
          onChange(value, value);
        }
      } else if (dragging === "max") {
        if (value >= minIndex) {
          onChange(minIndex, value);
        } else {
          // Max dragged beyond min - swap them
          onChange(value, value);
        }
      }
    };

    const handleMouseUp = (): void => {
      setDragging(null);
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return (): void => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, minIndex, maxIndex, options.length, onChange, disabled]);

  const optionsCount = options.length - 1;

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background shadow-sm transition-colors p-6 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring hover:border-ring/50",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      tabIndex={disabled ? undefined : 0}
    >
      <div className="space-y-6">
        {/* Icon labels - positioned to align with track */}
        <div className="relative mb-8 px-12">
          <div className="absolute inset-x-12 flex">
            {options.map((option, i) => {
              const isInRange = i >= minIndex && i <= maxIndex;
              const position = optionsCount === 0 ? 50 : (i / optionsCount) * 100;

              return (
                <div
                  key={`option-${option.value}`}
                  className={cn(
                    "absolute flex flex-col items-center gap-2 transition-all duration-300 -translate-x-1/2",
                    isInRange ? "opacity-100 scale-110 -translate-y-1" : "opacity-40 scale-95",
                  )}
                  style={{ left: `${position}%` }}
                >
                  {option.icon && <Icon icon={option.icon} className="h-8 w-8 drop-shadow-lg" />}
                  <Span className="text-xs font-semibold whitespace-nowrap">{t(option.label)}</Span>
                  {option.description && (
                    <Span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {t(option.description)}
                    </Span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="h-20" />
        </div>

        {/* Track */}
        <div ref={trackRef} className="relative h-16">
          <div className="absolute left-12 right-12 h-2 top-1 bg-muted/50 rounded-full shadow-inner" />

          {/* Active range with gradient */}
          <div
            className="absolute h-2 top-1 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 rounded-full transition-all duration-300 shadow-lg"
            style={{
              left: `calc(3rem + (100% - 6rem) * ${minIndex / optionsCount})`,
              width: `calc((100% - 6rem) * ${(maxIndex - minIndex) / optionsCount})`,
            }}
          />

          {/* Tick marks */}
          {
            // oxlint-disable-next-line no-unused-vars
            options.map((_option, i) => {
              const position = optionsCount === 0 ? 50 : (i / optionsCount) * 100;
              return (
                <div
                  key={`tick-${i}`}
                  className={cn(
                    "absolute w-2 h-2 rounded-full top-1 -translate-x-1/2 transition-all duration-300",
                    i >= minIndex && i <= maxIndex
                      ? "bg-white shadow-md scale-125"
                      : "bg-muted-foreground/30",
                  )}
                  style={{
                    left: `calc(3rem + (100% - 6rem) * ${position / 100})`,
                  }}
                />
              );
            })
          }

          {/* Min handle */}
          <div
            className={cn(
              "absolute w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-background shadow-xl transition-all duration-200 -translate-x-1/2",
              dragging === "min"
                ? "cursor-grabbing scale-125 z-20"
                : "cursor-grab hover:scale-110 z-10",
              disabled && "opacity-50 cursor-not-allowed",
              minIndex === maxIndex ? "-top-6" : "-top-3",
            )}
            style={{
              left: `calc(3rem + (100% - 6rem) * ${minIndex / optionsCount})`,
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                e.preventDefault();
                setDragging("min");
              }
            }}
          />

          {/* Min label (below handle) - hide when overlapping with max */}
          {minIndex !== maxIndex && (
            <div
              className={cn(
                "absolute top-7 -translate-x-1/2 text-[10px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap pointer-events-none transition-all duration-200",
                dragging === "min" && "scale-110",
              )}
              style={{
                left: `calc(3rem + (100% - 6rem) * ${minIndex / optionsCount})`,
              }}
            >
              {minLabel}
            </div>
          )}

          {/* Max handle */}
          <div
            className={cn(
              "absolute w-8 h-8 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-full border-4 border-background shadow-xl transition-all duration-200 -translate-x-1/2",
              dragging === "max"
                ? "cursor-grabbing scale-125 z-20"
                : "cursor-grab hover:scale-110 z-10",
              disabled && "opacity-50 cursor-not-allowed",
              minIndex === maxIndex ? "top-0" : "-top-3",
            )}
            style={{
              left: `calc(3rem + (100% - 6rem) * ${maxIndex / optionsCount})`,
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                e.preventDefault();
                setDragging("max");
              }
            }}
          />

          {/* Max label (below handle) - show both labels when overlapping */}
          <div
            className={cn(
              "absolute -translate-x-1/2 text-[10px] font-bold whitespace-nowrap pointer-events-none transition-all duration-200",
              dragging === "max" && "scale-110",
              minIndex === maxIndex
                ? "top-10 text-foreground"
                : "top-7 text-fuchsia-600 dark:text-fuchsia-400",
            )}
            style={{
              left: `calc(3rem + (100% - 6rem) * ${maxIndex / optionsCount})`,
            }}
          >
            {minIndex === maxIndex ? `${minLabel} / ${maxLabel}` : maxLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
