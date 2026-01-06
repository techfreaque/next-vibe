/**
 * Range Slider Component
 * A beautiful range slider with draggable min/max handles and icon labels
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import * as React from "react";

import {
  getIconComponent,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/react/icons";
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
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const value = Math.round(percentage * (options.length - 1));

      if (dragging === "min" && value < maxIndex) {
        onChange(value, maxIndex);
      } else if (dragging === "max" && value > minIndex) {
        onChange(minIndex, value);
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
    <div className={cn("space-y-6", className)}>
      {/* Icon labels */}
      <div className="flex justify-between mb-8">
        {options.map((option, i) => {
          const Icon = option.icon ? getIconComponent(option.icon) : null;
          const isInRange = i >= minIndex && i <= maxIndex;

          return (
            <div
              key={`option-${option.value}`}
              className={cn(
                "flex flex-col items-center gap-2 transition-all duration-300",
                isInRange ? "opacity-100 scale-110 -translate-y-1" : "opacity-40 scale-95",
              )}
            >
              {Icon && <Icon className="h-8 w-8 drop-shadow-lg" />}
              <Span className="text-xs font-semibold">{t(option.label)}</Span>
              {option.description && (
                <Span className="text-[10px] text-muted-foreground">{t(option.description)}</Span>
              )}
            </div>
          );
        })}
      </div>

      {/* Track */}
      <div ref={trackRef} className="relative h-4 px-2">
        <div className="absolute inset-0 h-2 top-1 bg-muted/50 rounded-full shadow-inner" />

        {/* Active range with gradient */}
        <div
          className="absolute h-2 top-1 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 rounded-full transition-all duration-300 shadow-lg"
          style={{
            left: `${(minIndex / optionsCount) * 100}%`,
            width: `${((maxIndex - minIndex) / optionsCount) * 100}%`,
          }}
        />

        {/* Tick marks */}
        {options.map((_option, i) => (
          <div
            key={`tick-${i}`}
            className={cn(
              "absolute w-1.5 h-1.5 rounded-full top-1 transition-all duration-300",
              i >= minIndex && i <= maxIndex ? "bg-white scale-125" : "bg-muted-foreground/40",
            )}
            style={{
              left: `${(i / optionsCount) * 100}%`,
              marginLeft: "-3px",
            }}
          />
        ))}

        {/* Min handle */}
        <div
          className={cn(
            "absolute w-7 h-7 -top-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-background shadow-xl transition-all duration-200",
            dragging === "min" ? "cursor-grabbing scale-125" : "cursor-grab hover:scale-110",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          style={{
            left: `${(minIndex / optionsCount) * 100}%`,
            marginLeft: "-14px",
          }}
          onMouseDown={(e) => {
            if (!disabled) {
              e.preventDefault();
              setDragging("min");
            }
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
            {minLabel}
          </div>
        </div>

        {/* Max handle */}
        <div
          className={cn(
            "absolute w-7 h-7 -top-2.5 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-full border-4 border-background shadow-xl transition-all duration-200",
            dragging === "max" ? "cursor-grabbing scale-125" : "cursor-grab hover:scale-110",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          style={{
            left: `${(maxIndex / optionsCount) * 100}%`,
            marginLeft: "-14px",
          }}
          onMouseDown={(e) => {
            if (!disabled) {
              e.preventDefault();
              setDragging("max");
            }
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
            {maxLabel}
          </div>
        </div>
      </div>

      {/* Selected values display */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-3 w-full justify-center">
          <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg font-semibold text-sm">
            {(() => {
              const Icon = options[minIndex].icon ? getIconComponent(options[minIndex].icon) : null;
              return (
                <>
                  {Icon && <Icon className="inline h-4 w-4 mr-1" />}
                  {t(options[minIndex].label)}
                </>
              );
            })()}
          </div>
          <div className="text-muted-foreground font-bold">-</div>
          <div className="px-3 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-lg font-semibold text-sm">
            {(() => {
              const Icon = options[maxIndex].icon ? getIconComponent(options[maxIndex].icon) : null;
              return (
                <>
                  {Icon && <Icon className="inline h-4 w-4 mr-1" />}
                  {t(options[maxIndex].label)}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
