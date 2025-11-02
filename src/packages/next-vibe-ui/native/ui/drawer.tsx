/**
 * Drawer Component for React Native
 * Bottom sheet drawer implementation using Modal
 */
import React, { createContext, useContext, useState } from "react";
import { Modal, Pressable, Text as RNText, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

import { cn } from "next-vibe/shared/utils/utils";

// Cross-platform type definitions for native
export interface DrawerRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface DrawerTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DrawerCloseProps {
  asChild?: boolean;
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

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

function useDrawer(): DrawerContextValue {
  const context = useContext(DrawerContext);
  if (!context) {
    // eslint-disable-next-line no-restricted-syntax -- Error handling for context
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

export function DrawerTrigger({
  children,
  asChild,
}: DrawerTriggerProps): React.JSX.Element {
  const { setOpen } = useDrawer();

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
      onPress={() => {
        setOpen(true);
      }}
    >
      {children}
    </Pressable>
  );
}

export function DrawerClose({
  children,
  asChild,
}: DrawerCloseProps): React.JSX.Element {
  const { setOpen } = useDrawer();

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
      onPress={() => {
        setOpen(false);
      }}
    >
      {children}
    </Pressable>
  );
}

// Portal is a no-op in native, but exported for compatibility
export function DrawerPortal({
  children,
}: {
  children?: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}

// Overlay is rendered as part of DrawerContent in native
export function DrawerOverlay(): null {
  return null;
}

export function DrawerContent({
  children,
  className,
}: DrawerContentProps): React.JSX.Element {
  const { open, setOpen } = useDrawer();

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="none"
      onRequestClose={() => {
        setOpen(false);
      }}
    >
      <View className="flex-1">
        <Pressable
          className="flex-1 bg-black/80"
          onPress={() => {
            setOpen(false);
          }}
        >
          <View style={{ flex: 1 }} />
        </Pressable>
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <View
            className={cn(
              "mt-24 flex flex-col rounded-t-[10px] border bg-background",
              className,
            )}
          >
            <View className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function DrawerHeader({
  className,
  children,
}: DrawerHeaderProps): React.JSX.Element {
  return (
    <View className={cn("flex gap-1.5 p-4", className)}>{children}</View>
  );
}

DrawerHeader.displayName = "DrawerHeader";

export function DrawerFooter({
  className,
  children,
}: DrawerFooterProps): React.JSX.Element {
  return (
    <View className={cn("mt-auto flex flex-col gap-2 p-4", className)}>
      {children}
    </View>
  );
}

DrawerFooter.displayName = "DrawerFooter";

export function DrawerTitle({
  className,
  children,
}: DrawerTitleProps): React.JSX.Element {
  return (
    <RNText
      style={{
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 18,
      }}
      className={className}
    >
      {children}
    </RNText>
  );
}

DrawerTitle.displayName = "DrawerTitle";

export function DrawerDescription({
  className,
  children,
}: DrawerDescriptionProps): React.JSX.Element {
  return (
    <RNText
      style={{
        fontSize: 14,
      }}
      className={className}
    >
      {children}
    </RNText>
  );
}

DrawerDescription.displayName = "DrawerDescription";
