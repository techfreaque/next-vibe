/**
 * Drawer Component for React Native
 * Bottom sheet drawer implementation using Modal
 */
import { cn } from "next-vibe/shared/utils/utils";
import React, { createContext, useContext, useState } from "react";
import { Modal, Pressable, Text as RNText, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

// Import ALL types from web - ZERO definitions here
import type {
  DrawerCloseProps,
  DrawerCloseRefObject,
  DrawerContentProps,
  DrawerContextValue,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerRootProps,
  DrawerTitleProps,
  DrawerTriggerProps,
  DrawerTriggerRefObject,
} from "@/packages/next-vibe-ui/web/ui/drawer";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

function useDrawer(): DrawerContextValue {
  const context = useContext(DrawerContext);
  if (!context) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Standard React context hook pattern - throw is correct for developer mistakes
    throw new Error("Drawer components must be used within Drawer"); // eslint-disable-line i18next/no-literal-string -- Error message
  }
  return context;
}

export function Drawer({
  children,
  open: controlledOpen,
  onOpenChange,
}: DrawerRootProps): React.JSX.Element {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

Drawer.displayName = "Drawer";

export const DrawerTrigger = React.forwardRef<
  DrawerTriggerRefObject,
  DrawerTriggerProps
>(({ children, asChild }, ref) => {
  const { setOpen } = useDrawer();
  const pressableRef = React.useRef<React.ElementRef<typeof Pressable>>(null);

  React.useImperativeHandle(ref, (): DrawerTriggerRefObject => {
    return {
      click: (): void => {
        setOpen(true);
      },
      focus: (): void => {
        // No-op for React Native
      },
      blur: (): void => {
        // No-op for React Native
      },
    };
  }, [setOpen]);

  if (asChild && React.isValidElement(children)) {
    // Clone element with properly typed onPress handler
    const childElement = children as React.ReactElement<{
      onPress?: () => void;
    }>;
    return React.cloneElement(childElement, {
      onPress: () => {
        setOpen(true);
      },
    });
  }

  return (
    <Pressable
      ref={pressableRef}
      onPress={() => {
        setOpen(true);
      }}
    >
      {children}
    </Pressable>
  );
});

DrawerTrigger.displayName = "DrawerTrigger";

export const DrawerClose = React.forwardRef<DrawerCloseRefObject, DrawerCloseProps>(
  ({ children, asChild }, ref) => {
    const { setOpen } = useDrawer();
    const pressableRef = React.useRef<React.ElementRef<typeof Pressable>>(null);

    React.useImperativeHandle(ref, (): DrawerCloseRefObject => {
      return {
        click: (): void => {
          setOpen(false);
        },
        focus: (): void => {
          // No-op for React Native
        },
        blur: (): void => {
          // No-op for React Native
        },
      };
    }, [setOpen]);

    if (asChild && React.isValidElement(children)) {
      // Clone element with properly typed onPress handler
      const childElement = children as React.ReactElement<{
        onPress?: () => void;
      }>;
      return React.cloneElement(childElement, {
        onPress: () => {
          setOpen(false);
        },
      });
    }

    return (
      <Pressable
        ref={pressableRef}
        onPress={() => {
          setOpen(false);
        }}
      >
        {children}
      </Pressable>
    );
  },
);

DrawerClose.displayName = "DrawerClose";

// Portal is a no-op in native, but exported for compatibility
export function DrawerPortal({
  children,
}: {
  children?: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}

DrawerPortal.displayName = "DrawerPortal";

// Overlay is rendered as part of DrawerContent in native
export function DrawerOverlay(): React.JSX.Element {
  return <></>;
}

DrawerOverlay.displayName = "DrawerOverlay";

export function DrawerContent({
  children,
  className,
  style,
}: DrawerContentProps): React.JSX.Element {
  const { open, setOpen } = useDrawer();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const overlayStyle = convertCSSToViewStyle({
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  });

  const containerStyle = convertCSSToViewStyle({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  });

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="none"
      onRequestClose={() => {
        setOpen(false);
      }}
    >
      <View style={convertCSSToViewStyle({ flex: 1 })}>
        <Pressable
          style={overlayStyle}
          onPress={() => {
            setOpen(false);
          }}
        >
          <View style={convertCSSToViewStyle({ flex: 1 })} />
        </Pressable>
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={containerStyle}
        >
          <View
            {...applyStyleType({
              nativeStyle,
              className: cn(
                "mt-24 flex flex-col rounded-t-[10px] border bg-background",
                className,
              ),
            })}
          >
            <View className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

DrawerContent.displayName = "DrawerContent";

export function DrawerHeader({
  className,
  style,
  children,
}: DrawerHeaderProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("flex gap-1.5 p-4", className),
      })}
    >
      {children}
    </View>
  );
}

DrawerHeader.displayName = "DrawerHeader";

export function DrawerFooter({
  className,
  style,
  children,
}: DrawerFooterProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("mt-auto flex flex-col gap-2 p-4", className),
      })}
    >
      {children}
    </View>
  );
}

DrawerFooter.displayName = "DrawerFooter";

export function DrawerTitle({
  className,
  style,
  children,
}: DrawerTitleProps): React.JSX.Element {
  const nativeStyle = style
    ? convertCSSToViewStyle(style)
    : convertCSSToViewStyle({
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 18,
      });
  return (
    <RNText
      {...applyStyleType({
        nativeStyle,
        className,
      })}
    >
      {children}
    </RNText>
  );
}

DrawerTitle.displayName = "DrawerTitle";

export function DrawerDescription({
  className,
  style,
  children,
}: DrawerDescriptionProps): React.JSX.Element {
  const nativeStyle = style
    ? convertCSSToViewStyle(style)
    : convertCSSToViewStyle({
        fontSize: 14,
      });
  return (
    <RNText
      {...applyStyleType({
        nativeStyle,
        className,
      })}
    >
      {children}
    </RNText>
  );
}

DrawerDescription.displayName = "DrawerDescription";
