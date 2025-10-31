"use client";

import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

// Cross-platform type exports
export interface DrawerRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  shouldScaleBackground?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
}

export interface DrawerTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DrawerPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement | null;
}

export interface DrawerCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DrawerOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DrawerContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DrawerHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DrawerFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DrawerTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DrawerDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: DrawerRootProps): React.JSX.Element => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  children,
}: DrawerHeaderProps): React.JSX.Element => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}>
    {children}
  </div>
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  children,
}: DrawerFooterProps): React.JSX.Element => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)}>
    {children}
  </div>
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
