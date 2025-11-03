import * as DialogPrimitive from "@rn-primitives/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { SlideInDown, SlideInLeft, SlideInRight, SlideInUp, SlideOutDown, SlideOutLeft, SlideOutRight, SlideOutUp } from "react-native-reanimated";

import { cn } from "next-vibe/shared/utils/utils";
import { X } from "./icons/X";

// Cross-platform type exports
export interface SheetRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  modal?: boolean;
}

export interface SheetTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface SheetCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface SheetPortalProps {
  children?: React.ReactNode;
  forceMount?: boolean;
  container?: HTMLElement | null;
}

export interface SheetOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SheetHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SheetFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SheetTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SheetDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

const Sheet = DialogPrimitive.Root;

const SheetTrigger = DialogPrimitive.Trigger;

const SheetClose = DialogPrimitive.Close;

const SheetPortal = DialogPrimitive.Portal;

function SheetOverlay({ className, ...props }: SheetOverlayProps): React.JSX.Element {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "bg-black/80 flex justify-center items-center p-2 absolute top-0 right-0 bottom-0 left-0",
        className,
      )}
      style={Platform.OS !== "web" ? StyleSheet.absoluteFill : undefined}
      {...props}
    />
  );
}
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full w-3/4 border-r",
        right: "inset-y-0 right-0 h-full w-3/4 border-l",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

export interface SheetContentProps extends VariantProps<typeof sheetVariants> {
  className?: string;
  children?: React.ReactNode;
  portalHost?: string;
}

function SheetContent({
  side = "right",
  className,
  children,
  portalHost,
  ...props
}: SheetContentProps): React.ReactElement {
  const getEnteringAnimation = (): typeof SlideInUp => {
    switch (side) {
      case "top":
        return SlideInUp;
      case "bottom":
        return SlideInDown;
      case "left":
        return SlideInLeft;
      case "right":
        return SlideInRight;
      default:
        return SlideInRight;
    }
  };

  const getExitingAnimation = (): typeof SlideOutUp => {
    switch (side) {
      case "top":
        return SlideOutUp;
      case "bottom":
        return SlideOutDown;
      case "left":
        return SlideOutLeft;
      case "right":
        return SlideOutRight;
      default:
        return SlideOutRight;
    }
  };

  return (
    <DialogPrimitive.Portal hostName={portalHost}>
      <SheetOverlay />
      <Animated.View
        className={cn(sheetVariants({ side }), className)}
        entering={getEnteringAnimation()}
        exiting={getExitingAnimation()}
        {...props}
      >
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 p-2">
          <X size={16} />
        </DialogPrimitive.Close>
        {children}
      </Animated.View>
    </DialogPrimitive.Portal>
  );
}
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, children }: SheetHeaderProps): React.ReactElement {
  return (
    <View
      className={cn(
        "flex flex-col space-y-2 text-center",
        className,
      )}
    >
      {children}
    </View>
  );
}
SheetHeader.displayName = "SheetHeader";

function SheetFooter({ className, children }: SheetFooterProps): React.ReactElement {
  return (
    <View
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
    >
      {children}
    </View>
  );
}
SheetFooter.displayName = "SheetFooter";

function SheetTitle({ className, ...props }: SheetTitleProps): React.ReactElement {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}
SheetTitle.displayName = "SheetTitle";

function SheetDescription({ className, ...props }: SheetDescriptionProps): React.ReactElement {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};