"use client";

import { DragHandleDots2Icon } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import type { JSX, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface ResizableContainerProps {
  children: ReactNode;
  className?: string;
  collapsed?: boolean;
  /** Default width in pixels */
  defaultWidth?: number;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Maximum width in pixels or vw string */
  maxWidth?: number | string;
  /** Callback when width changes */
  onWidthChange?: (width: number) => void;
  /** ID for localStorage persistence */
  storageId?: string;
}

export interface ResizableHandleProps {
  className?: string;
  withHandle?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export function ResizableContainer({
  children,
  className,
  defaultWidth = 260,
  minWidth = 235,
  maxWidth = "90vw",
  onWidthChange,
  storageId,
  collapsed,
}: ResizableContainerProps): JSX.Element {
  const [width, setWidth] = useState<number>(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const getMaxWidthPx = useCallback((): number => {
    if (typeof maxWidth === "number") {
      return maxWidth;
    }
    if (typeof maxWidth === "string" && maxWidth.endsWith("vw")) {
      const vw = parseFloat(maxWidth);
      return (window.innerWidth * vw) / 100;
    }
    return 9999;
  }, [maxWidth]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = width;
    },
    [width],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) {
        return;
      }
      const deltaX = e.clientX - startXRef.current;
      const newWidth = startWidthRef.current + deltaX;
      const maxWidthPx = getMaxWidthPx();
      const clampedWidth = Math.max(minWidth, Math.min(maxWidthPx, newWidth));
      setWidth(clampedWidth);
      onWidthChange?.(clampedWidth);
      if (storageId) {
        localStorage.setItem(`resizable-${storageId}`, clampedWidth.toString());
      }
    },
    [isResizing, minWidth, getMaxWidthPx, onWidthChange, storageId],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
    return (): void => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="relative h-full shrink-0 overflow-hidden">
      <motion.div
        ref={containerRef}
        className={cn("relative h-full shrink-0", className)}
        key="sidebar"
        initial={false}
        // Keep the width fixed; slide out using negative margin
        style={{ width }}
        animate={{
          marginLeft: collapsed ? -width : 0,
        }}
        transition={{
          marginLeft: { duration: 0.3, ease: "easeInOut" },
        }}
      >
        {children}
        <ResizableHandle withHandle onMouseDown={handleMouseDown} />
      </motion.div>
    </div>
  );
}

export function ResizableHandle({
  withHandle,
  className,
  onMouseDown,
}: ResizableHandleProps): JSX.Element {
  return (
    <div
      className={cn(
        "absolute top-0 right-[-5px] bottom-0 w-[10px] cursor-ew-resize flex items-center justify-center z-100",
        className,
      )}
      onMouseDown={onMouseDown}
    >
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[4px] bg-border" />
      {withHandle && (
        <div className="relative z-10 flex h-5 w-4 items-center justify-center rounded-sm bg-background">
          <DragHandleDots2Icon className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}
