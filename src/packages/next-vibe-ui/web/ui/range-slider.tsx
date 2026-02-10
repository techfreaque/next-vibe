/**
 * Range Slider Component
 * A beautiful range slider with draggable min/max handles and icon labels
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import * as React from "react";

import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

import { Span } from "./span";

export interface RangeSliderOption<
  TTranslationKey extends string = TranslationKey,
> {
  label: NoInfer<TTranslationKey>;
  value: string | number;
  icon?: IconKey;
  description?: NoInfer<TTranslationKey>;
}

export interface RangeSliderProps<
  TTranslationKey extends string = TranslationKey,
> {
  options: RangeSliderOption<TTranslationKey>[];
  minIndex: number;
  maxIndex: number;
  onChange: (minIndex: number, maxIndex: number) => void;
  disabled?: boolean;
  minLabel?: string;
  maxLabel?: string;
  t: <K extends string>(key: K, params?: TParams) => string; // Adapted translation for definition keys (uses scopedT when available)
  className?: string;
}

export function RangeSlider<TTranslationKey extends string = TranslationKey>({
  options,
  minIndex,
  maxIndex,
  onChange,
  disabled = false,
  minLabel = "MIN",
  maxLabel = "MAX",
  t,
  className,
}: RangeSliderProps<TTranslationKey>): React.JSX.Element {
  const [dragging, setDragging] = React.useState<"min" | "max" | null>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  // Store initial positions when drag starts
  const initialMinPosRef = React.useRef<number>(0);
  const initialMaxPosRef = React.useRef<number>(0);

  // Use refs for immediate updates during dragging
  const tempMinPosRef = React.useRef<number | null>(null);
  const tempMaxPosRef = React.useRef<number | null>(null);

  // Track current snapped indices during drag for layout updates
  const [dragMinIndex, setDragMinIndex] = React.useState<number | null>(null);
  const [dragMaxIndex, setDragMaxIndex] = React.useState<number | null>(null);

  // DOM element refs for direct manipulation
  const minHandleRef = React.useRef<HTMLDivElement>(null);
  const maxHandleRef = React.useRef<HTMLDivElement>(null);
  const rangeBarRef = React.useRef<HTMLDivElement>(null);
  const minLabelRef = React.useRef<HTMLDivElement>(null);
  const maxLabelRef = React.useRef<HTMLDivElement>(null);

  // Force re-render when dragging state changes
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // Helper function to update positions via direct DOM manipulation
  const updateDOMPositions = React.useCallback(
    (minPos: number, maxPos: number) => {
      if (minHandleRef.current) {
        minHandleRef.current.style.left = `calc(3rem + (100% - 6rem) * ${minPos})`;
      }
      if (maxHandleRef.current) {
        maxHandleRef.current.style.left = `calc(3rem + (100% - 6rem) * ${maxPos})`;
      }
      if (rangeBarRef.current) {
        rangeBarRef.current.style.left = `calc(3rem + (100% - 6rem) * ${minPos})`;
        rangeBarRef.current.style.width = `calc((100% - 6rem) * ${maxPos - minPos})`;
      }
      if (minLabelRef.current) {
        minLabelRef.current.style.left = `calc(3rem + (100% - 6rem) * ${minPos})`;
      }
      if (maxLabelRef.current) {
        maxLabelRef.current.style.left = `calc(3rem + (100% - 6rem) * ${maxPos})`;
      }
    },
    [],
  );

  React.useEffect(() => {
    if (dragging) {
      // Capture initial positions when drag starts
      initialMinPosRef.current = minIndex / (options.length - 1);
      initialMaxPosRef.current = maxIndex / (options.length - 1);
      tempMinPosRef.current = initialMinPosRef.current;
      tempMaxPosRef.current = initialMaxPosRef.current;

      // Update DOM immediately with initial positions to ensure proper layout
      updateDOMPositions(initialMinPosRef.current, initialMaxPosRef.current);
    }
  }, [dragging, minIndex, maxIndex, options.length, updateDOMPositions]);

  // Track the highest snapped index for the non-dragged handle
  const snappedOtherIndexRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (dragging) {
      // Reset snapped index when starting a new drag
      if (dragging === "min") {
        snappedOtherIndexRef.current = maxIndex;
      } else {
        snappedOtherIndexRef.current = minIndex;
      }
    }
  }, [dragging, minIndex, maxIndex]);

  React.useEffect(() => {
    const handleMove = (clientX: number): void => {
      if (!dragging || !trackRef.current || disabled) {
        return;
      }

      const rect = trackRef.current.getBoundingClientRect();
      const inset = 48; // 3rem = 48px
      const x = clientX - rect.left - inset;
      const activeWidth = rect.width - inset * 2;
      const percentage = Math.max(0, Math.min(1, x / activeWidth));

      let newMinPos: number;
      let newMaxPos: number;

      // Update temporary positions immediately via refs
      if (dragging === "min") {
        // Min handle moves smoothly
        newMinPos = percentage;

        // Calculate what index we're at for the dragged handle
        const currentDraggedIndex = Math.round(
          percentage * (options.length - 1),
        );
        const snappedOtherPos =
          snappedOtherIndexRef.current / (options.length - 1);

        // Check if we've crossed the threshold to snap
        if (currentDraggedIndex > snappedOtherIndexRef.current) {
          // Crossed threshold - snap other handle and lock it
          snappedOtherIndexRef.current = currentDraggedIndex;
          newMaxPos = snappedOtherIndexRef.current / (options.length - 1);
        } else if (percentage > snappedOtherPos) {
          // Before crossing threshold - move both handles together
          newMaxPos = percentage;
        } else {
          // Dragging back - other handle stays at snapped position
          newMaxPos = snappedOtherPos;
        }
      } else {
        // Max handle moves smoothly
        newMaxPos = percentage;

        // Calculate what index we're at for the dragged handle
        const currentDraggedIndex = Math.round(
          percentage * (options.length - 1),
        );
        const snappedOtherPos =
          snappedOtherIndexRef.current / (options.length - 1);

        // Check if we've crossed the threshold to snap
        if (currentDraggedIndex < snappedOtherIndexRef.current) {
          // Crossed threshold - snap other handle and lock it
          snappedOtherIndexRef.current = currentDraggedIndex;
          newMinPos = snappedOtherIndexRef.current / (options.length - 1);
        } else if (percentage < snappedOtherPos) {
          // Before crossing threshold - move both handles together
          newMinPos = percentage;
        } else {
          // Dragging back - other handle stays at snapped position
          newMinPos = snappedOtherPos;
        }
      }

      // Store in refs
      tempMinPosRef.current = newMinPos;
      tempMaxPosRef.current = newMaxPos;

      // Calculate indices and update state if they changed (for React layout updates)
      const newMinIdx = Math.round(newMinPos * (options.length - 1));
      const newMaxIdx = Math.round(newMaxPos * (options.length - 1));
      if (dragMinIndex !== newMinIdx || dragMaxIndex !== newMaxIdx) {
        setDragMinIndex(newMinIdx);
        setDragMaxIndex(newMaxIdx);
      }

      // Update DOM directly for immediate visual feedback
      updateDOMPositions(newMinPos, newMaxPos);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = (): void => {
      // Snap to nearest option and commit the change
      if (dragging) {
        const finalMinPos =
          tempMinPosRef.current !== null
            ? tempMinPosRef.current
            : minIndex / (options.length - 1);
        const finalMaxPos =
          tempMaxPosRef.current !== null
            ? tempMaxPosRef.current
            : maxIndex / (options.length - 1);

        // Snap both positions to nearest indices
        const snappedMinIndex = Math.round(finalMinPos * (options.length - 1));
        const snappedMaxIndex = Math.round(finalMaxPos * (options.length - 1));

        // Update DOM to snapped positions immediately for visual feedback
        const snappedMinPos = snappedMinIndex / (options.length - 1);
        const snappedMaxPos = snappedMaxIndex / (options.length - 1);
        updateDOMPositions(snappedMinPos, snappedMaxPos);

        // Commit the snapped values
        onChange(snappedMinIndex, snappedMaxIndex);

        tempMinPosRef.current = null;
        tempMaxPosRef.current = null;
        setDragMinIndex(null);
        setDragMaxIndex(null);
      }
      setDragging(null);
      forceUpdate(); // Force re-render to reset to React-controlled positions
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("touchcancel", handleEnd);
      return (): void => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
        document.removeEventListener("touchcancel", handleEnd);
      };
    }
  }, [
    dragging,
    minIndex,
    maxIndex,
    onChange,
    disabled,
    updateDOMPositions,
    forceUpdate,
    options.length,
    dragMinIndex,
    dragMaxIndex,
  ]);

  const optionsCount = options.length - 1;

  // Calculate positions - when not dragging, use the actual indices
  const displayMinPosition = minIndex / optionsCount;
  const displayMaxPosition = maxIndex / optionsCount;

  // Use drag indices for layout when dragging, otherwise use actual indices
  const layoutMinIndex =
    dragging && dragMinIndex !== null ? dragMinIndex : minIndex;
  const layoutMaxIndex =
    dragging && dragMaxIndex !== null ? dragMaxIndex : maxIndex;

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background shadow-sm transition-colors p-6 pt-6 pb-0 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring hover:border-ring/50",
        disabled && "opacity-50",
        className,
      )}
      tabIndex={disabled ? undefined : 0}
    >
      <div className="space-y-6">
        {/* Icon labels - positioned to align with track */}
        <div className="relative mb-1 px-12">
          <div className="absolute inset-x-12 flex">
            {options.map((option, i) => {
              const isInRange = i >= layoutMinIndex && i <= layoutMaxIndex;
              const position =
                optionsCount === 0 ? 50 : (i / optionsCount) * 100;

              // Determine if this option is clickable (only edges can be toggled)
              const isMinEdge = i === layoutMinIndex;
              const isMaxEdge = i === layoutMaxIndex;
              const isEdge = isMinEdge || isMaxEdge;
              const isMiddle = isInRange && !isEdge;
              const isOutside = !isInRange;

              const handleClick = (): void => {
                if (disabled) {
                  return;
                }

                if (isMinEdge && layoutMinIndex === layoutMaxIndex) {
                  // Can't shrink when both at same position
                  return;
                }

                if (isMinEdge) {
                  // Shrink from min side
                  onChange(layoutMinIndex + 1, layoutMaxIndex);
                } else if (isMaxEdge) {
                  // Shrink from max side
                  onChange(layoutMinIndex, layoutMaxIndex - 1);
                } else if (isOutside) {
                  // Expand to include this option
                  const newMin = Math.min(layoutMinIndex, i);
                  const newMax = Math.max(layoutMaxIndex, i);
                  onChange(newMin, newMax);
                }
                // isMiddle does nothing
              };

              return (
                <div
                  key={`option-${option.value}`}
                  className={cn(
                    "absolute flex flex-col items-center gap-0 transition-all duration-300 -translate-x-1/2",
                    isInRange
                      ? "opacity-100 scale-110 -translate-y-1"
                      : "opacity-40 scale-95",
                    !isMiddle && !disabled && "cursor-pointer hover:scale-125",
                    isMiddle && "cursor-default",
                    disabled && "cursor-not-allowed",
                  )}
                  style={{ left: `${position}%` }}
                  onClick={handleClick}
                >
                  {option.icon && (
                    <Icon
                      icon={option.icon}
                      className="h-6 w-6 drop-shadow-lg"
                    />
                  )}
                  <Span className="text-xs pt-1 font-semibold whitespace-nowrap">
                    {t(option.label)}
                  </Span>
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
            ref={rangeBarRef}
            className={cn(
              "absolute h-2 top-1 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 rounded-full shadow-lg",
              dragging ? "transition-none" : "transition-all duration-300",
            )}
            style={{
              left: `calc(3rem + (100% - 6rem) * ${displayMinPosition})`,
              width: `calc((100% - 6rem) * ${displayMaxPosition - displayMinPosition})`,
            }}
          />

          {/* Tick marks */}
          {
            // oxlint-disable-next-line no-unused-vars
            options.map((_option, i) => {
              const position =
                optionsCount === 0 ? 50 : (i / optionsCount) * 100;

              // Calculate middle index of selected range
              const middleIndex = Math.floor(
                (layoutMinIndex + layoutMaxIndex) / 2,
              );
              const isMiddleOfRange =
                i === middleIndex && layoutMinIndex !== layoutMaxIndex;

              return (
                <div
                  key={`tick-${i}`}
                  className={cn(
                    "absolute w-2 h-2 rounded-full top-1 -translate-x-1/2 transition-all duration-300",
                    isMiddleOfRange
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
            ref={minHandleRef}
            className={cn(
              "absolute w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-background shadow-xl -translate-x-1/2",
              dragging === "min"
                ? "cursor-grabbing scale-125 z-20 transition-none"
                : "cursor-grab hover:scale-110 z-10 transition-all duration-200",
              disabled && "cursor-not-allowed",
              layoutMinIndex === layoutMaxIndex ? "-top-6" : "-top-3",
            )}
            style={{
              left: `calc(3rem + (100% - 6rem) * ${displayMinPosition})`,
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                e.preventDefault();
                setDragging("min");
              }
            }}
            onTouchStart={(e) => {
              if (!disabled) {
                e.preventDefault();
                setDragging("min");
              }
            }}
          />

          {/* Min label (below handle) - hide when overlapping with max */}
          {layoutMinIndex !== layoutMaxIndex && (
            <div
              ref={minLabelRef}
              className={cn(
                "absolute top-7 -translate-x-1/2 text-[10px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap pointer-events-none",
                dragging === "min"
                  ? "scale-110 transition-none"
                  : "transition-all duration-200",
              )}
              style={{
                left: `calc(3rem + (100% - 6rem) * ${displayMinPosition})`,
              }}
            >
              {minLabel}
            </div>
          )}

          {/* Max handle */}
          <div
            ref={maxHandleRef}
            className={cn(
              "absolute w-8 h-8 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-full border-4 border-background shadow-xl -translate-x-1/2",
              dragging === "max"
                ? "cursor-grabbing scale-125 z-20 transition-none"
                : "cursor-grab hover:scale-110 z-10 transition-all duration-200",
              disabled && "cursor-not-allowed",
              layoutMinIndex === layoutMaxIndex ? "top-0" : "-top-3",
            )}
            style={{
              left: `calc(3rem + (100% - 6rem) * ${displayMaxPosition})`,
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                e.preventDefault();
                setDragging("max");
              }
            }}
            onTouchStart={(e) => {
              if (!disabled) {
                e.preventDefault();
                setDragging("max");
              }
            }}
          />

          {/* Max label (below handle) - show both labels when overlapping */}
          <div
            ref={maxLabelRef}
            className={cn(
              "absolute -translate-x-1/2 text-[10px] font-bold whitespace-nowrap pointer-events-none",
              dragging === "max"
                ? "scale-110 transition-none"
                : "transition-all duration-200",
              layoutMinIndex === layoutMaxIndex
                ? "top-10 text-foreground"
                : "top-7 text-fuchsia-600 dark:text-fuchsia-400",
            )}
            style={{
              left: `calc(3rem + (100% - 6rem) * ${displayMaxPosition})`,
            }}
          >
            {layoutMinIndex === layoutMaxIndex
              ? `${minLabel} / ${maxLabel}`
              : maxLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
