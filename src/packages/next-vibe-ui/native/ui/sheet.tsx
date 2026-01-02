import * as DialogPrimitive from "@rn-primitives/dialog";
import { cva } from "class-variance-authority";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
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

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { X } from "./icons/X";

const StyledView = styled(View, { className: "style" });

import type {
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetOverlayProps,
  SheetPortalProps,
  SheetRootProps,
  SheetTitleProps,
  SheetTriggerProps,
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

function SheetTrigger({ children, asChild, ...props }: SheetTriggerProps): React.JSX.Element {
  return (
    <DialogPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}
SheetTrigger.displayName = DialogPrimitive.Trigger.displayName;

function SheetClose({ children, asChild, ...props }: SheetCloseProps): React.JSX.Element {
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
  style,
  children,
  ...props
}: SheetOverlayProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  const renderChildren = (): React.ReactNode => {
    if (typeof children === "function") {
      return (children as (props: { pressed: boolean }) => React.ReactNode)({
        pressed: false,
      });
    }
    return children;
  };

  return (
    <DialogPrimitive.Overlay asChild style={StyleSheet.absoluteFill} {...props}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn("bg-black/80 flex justify-center items-center p-2", className),
        })}
      >
        {renderChildren()}
      </StyledView>
    </DialogPrimitive.Overlay>
  );
}
SheetOverlay.displayName = "SheetOverlay";

function SheetContent({
  side = "right",
  className,
  style,
  children,
  ...props
}: SheetContentProps): React.JSX.Element {
  const getEnteringAnimation = ():
    | typeof SlideInUp
    | typeof SlideInDown
    | typeof SlideInLeft
    | typeof SlideInRight => {
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

  const getExitingAnimation = ():
    | typeof SlideOutUp
    | typeof SlideOutDown
    | typeof SlideOutLeft
    | typeof SlideOutRight => {
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

  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <Animated.View
        {...applyStyleType({
          nativeStyle,
          className: cn(sheetVariants({ side }), className),
        })}
        entering={getEnteringAnimation()}
        exiting={getExitingAnimation()}
        {...props}
      >
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 p-2">
          <X size={Platform.OS === "web" ? 16 : 18} />
        </DialogPrimitive.Close>
        {children}
      </Animated.View>
    </DialogPrimitive.Portal>
  );
}
SheetContent.displayName = "SheetContent";

function SheetHeader({
  className,
  style,
  children,
  ...props
}: SheetHeaderProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-col space-y-2 text-center", className),
      })}
      {...props}
    >
      {children}
    </View>
  );
}
SheetHeader.displayName = "SheetHeader";

function SheetFooter({
  className,
  style,
  children,
  ...props
}: SheetFooterProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
      })}
      {...props}
    >
      {children}
    </View>
  );
}
SheetFooter.displayName = "SheetFooter";

function SheetTitle({ className, style, children, ...props }: SheetTitleProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DialogPrimitive.Title
      {...applyStyleType({
        nativeStyle,
        className: cn("text-lg font-semibold text-foreground", className),
      })}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
}
SheetTitle.displayName = "SheetTitle";

function SheetDescription({
  className,
  style,
  children,
  ...props
}: SheetDescriptionProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DialogPrimitive.Description
      {...applyStyleType({
        nativeStyle,
        className: cn("text-sm text-muted-foreground", className),
      })}
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
