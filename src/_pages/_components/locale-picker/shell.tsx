"use client";
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
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

import { useIsPhone } from "./use-is-phone";

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
