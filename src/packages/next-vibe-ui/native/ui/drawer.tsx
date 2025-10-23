/**
 * Drawer Component for React Native
 * Bottom sheet drawer implementation using Modal
 */
import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { Modal, Pressable, Text as RNText, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

import { cn } from "../lib/utils";

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

interface DrawerProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldScaleBackground?: boolean;
}

export function Drawer({
  children,
  open: controlledOpen,
  onOpenChange,
}: DrawerProps): React.JSX.Element {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

interface DrawerTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function DrawerTrigger({
  children,
  asChild,
}: DrawerTriggerProps): React.JSX.Element {
  const { setOpen } = useDrawer();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => {
        setOpen(true);
      },
    } as never);
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
}: DrawerTriggerProps): React.JSX.Element {
  const { setOpen } = useDrawer();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => {
        setOpen(false);
      },
    } as never);
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

interface DrawerContentProps {
  children: ReactNode;
  className?: string;
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
      <Pressable
        className="flex-1 bg-black/80"
        onPress={() => {
          setOpen(false);
        }}
      >
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          className={cn(
            "absolute bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px] border bg-background",
            className,
          )}
        >
          <View className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

interface DrawerHeaderProps {
  children: ReactNode;
  className?: string;
}

export function DrawerHeader({
  className,
  children,
}: DrawerHeaderProps): React.JSX.Element {
  return (
    <View
      className={cn("grid gap-1.5 p-4 text-center native:text-left", className)}
    >
      {children}
    </View>
  );
}

DrawerHeader.displayName = "DrawerHeader";

interface DrawerFooterProps {
  children: ReactNode;
  className?: string;
}

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

interface DrawerTitleProps {
  children: ReactNode;
  className?: string;
}

export function DrawerTitle({
  className,
  children,
}: DrawerTitleProps): React.JSX.Element {
  return (
    <RNText
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
    >
      {children}
    </RNText>
  );
}

DrawerTitle.displayName = "DrawerTitle";

interface DrawerDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function DrawerDescription({
  className,
  children,
}: DrawerDescriptionProps): React.JSX.Element {
  return (
    <RNText className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </RNText>
  );
}

DrawerDescription.displayName = "DrawerDescription";
