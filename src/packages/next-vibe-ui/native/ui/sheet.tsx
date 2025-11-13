import * as DialogPrimitive from "@rn-primitives/dialog";
import { cva } from "class-variance-authority";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from "react-native-reanimated";

import { cn } from "next-vibe/shared/utils/utils";
import { X } from "./icons/X";

import type {
  SheetRootProps,
  SheetTriggerProps,
  SheetCloseProps,
  SheetPortalProps,
  SheetOverlayProps,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
  SheetContentProps,
} from "@/packages/next-vibe-ui/web/ui/sheet";

const sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg", {
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
});

function Sheet({ children, ...props }: SheetRootProps): React.JSX.Element {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}
Sheet.displayName = DialogPrimitive.Root.displayName;

function SheetTrigger({
  children,
  asChild,
  ...props
}: SheetTriggerProps): React.JSX.Element {
  return (
    <DialogPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}
SheetTrigger.displayName = DialogPrimitive.Trigger.displayName;

function SheetClose({
  children,
  asChild,
  ...props
}: SheetCloseProps): React.JSX.Element {
  return (
    <DialogPrimitive.Close asChild={asChild} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}
SheetClose.displayName = DialogPrimitive.Close.displayName;

function SheetPortal({ children }: SheetPortalProps): React.JSX.Element {
  return <DialogPrimitive.Portal>{children}</DialogPrimitive.Portal>;
}
SheetPortal.displayName = "SheetPortal";

function SheetOverlay({
  className,
  ...props
}: SheetOverlayProps): React.JSX.Element {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "bg-black/80 flex justify-center items-center p-2 absolute top-0 right-0 bottom-0 left-0",
        className,
      )}
      style={StyleSheet.absoluteFill}
      {...props}
    />
  );
}
SheetOverlay.displayName = "SheetOverlay";

function SheetContent({
  side = "right",
  className,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCloseAutoFocus,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEscapeKeyDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPointerDownOutside,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onInteractOutside,
  // Filter out web-only props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  style,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  "data-sidebar": dataSidebar,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  "data-mobile": dataMobile,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  portalHost,
  ...props
}: SheetContentProps): React.JSX.Element {
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
    <DialogPrimitive.Portal>
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

function SheetHeader({
  className,
  children,
  ...props
}: SheetHeaderProps): React.JSX.Element {
  return (
    <View
      className={cn("flex flex-col space-y-2 text-center", className)}
      {...props}
    >
      {children}
    </View>
  );
}
SheetHeader.displayName = "SheetHeader";

function SheetFooter({
  className,
  children,
  ...props
}: SheetFooterProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
SheetFooter.displayName = "SheetFooter";

function SheetTitle({
  className,
  children,
  ...props
}: SheetTitleProps): React.JSX.Element {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
}
SheetTitle.displayName = "SheetTitle";

function SheetDescription({
  className,
  children,
  ...props
}: SheetDescriptionProps): React.JSX.Element {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
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
