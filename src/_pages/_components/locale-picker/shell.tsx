"use client";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "next-vibe/ui/components/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe/ui/components/popover";
import { Span } from "next-vibe/ui/components/span";
import { useWindowSize } from "next-vibe/ui/hooks/use-window-size";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

/** Below this width the picker opens as a bottom sheet. */
export const PHONE_BREAKPOINT = 768;

export function useIsPhone(): boolean {
  const { width } = useWindowSize();
  return width < PHONE_BREAKPOINT;
}

interface FlagTriggerProps {
  flag: string;
  label: string;
}

/**
 * Navbar trigger: flag only (Max, 2026-11-18), full name for SR + tooltip.
 * A plain element factory, not a component: Radix `asChild` triggers inject
 * their handlers into the Button directly.
 */
export function flagTrigger({ flag, label }: FlagTriggerProps): JSX.Element {
  return (
    <Button
      variant="ghost"
      size="unset"
      className="flex h-10 w-10 items-center justify-center"
      aria-label={label}
      title={label}
    >
      <Span className="my-auto flex items-center justify-center text-lg">
        {flag}
      </Span>
    </Button>
  );
}

interface PickerSurfaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title: string;
  description: string;
  /** Desktop popover width/padding classes. */
  desktopClassName?: string;
  /** Phone sheet height classes. */
  phoneClassName?: string;
  children: ReactNode;
}

/** Popover on desktop, bottom sheet on phone. Same content in both. */
export function PickerSurface({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  desktopClassName,
  phoneClassName,
  children,
}: PickerSurfaceProps): JSX.Element {
  const isPhone = useIsPhone();
  if (isPhone) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground={false}
      >
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent
          className={cn("flex max-h-[88dvh] flex-col", phoneClassName)}
        >
          <DrawerTitle className="sr-only">{title}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
          <Div className="flex min-h-0 flex-1 flex-col">{children}</Div>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className={cn(
          "flex max-h-[min(78vh,660px)] w-80 flex-col overflow-hidden p-0",
          desktopClassName,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
