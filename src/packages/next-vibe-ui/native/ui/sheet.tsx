/**
 * Sheet Component for React Native
 * Modal-based sheet implementation
 */
import { X } from "lucide-react-native";
import React, { createContext, useContext, useState } from "react";
import { Modal, Pressable as RNPressable, Text as RNText, View as RNView } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";

import { useTranslation } from "@/i18n/core/client";

import { StyledAnimatedView } from "../lib/styled";
import type { PressablePropsWithClassName, TextPropsWithClassName, ViewPropsWithClassName } from "../lib/types";
import { cn } from "../lib/utils";
import type {
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetRootProps,
  SheetTitleProps,
  SheetTriggerProps,
} from "next-vibe-ui/ui/sheet";

// Type-safe components with className support for NativeWind
const View = RNView as React.ComponentType<ViewPropsWithClassName>;
const Pressable = RNPressable as React.ComponentType<PressablePropsWithClassName>;
const Text = RNText as React.ComponentType<TextPropsWithClassName>;

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | undefined>(undefined);

function useSheet(): SheetContextValue {
  const context = useContext(SheetContext);
  if (!context) {
    // eslint-disable-next-line no-restricted-syntax -- Error handling for context
    throw new Error("Sheet components must be used within Sheet");
  }
  return context;
}

export function Sheet({
  children,
  open: controlledOpen,
  onOpenChange,
}: SheetRootProps): React.JSX.Element {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  children,
  asChild,
}: SheetTriggerProps): React.JSX.Element {
  const { setOpen } = useSheet();

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

export function SheetClose({
  children,
  asChild,
}: SheetCloseProps): React.JSX.Element {
  const { setOpen } = useSheet();

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

// Portal is a no-op in native, but exported for compatibility
export function SheetPortal({
  children,
}: {
  children?: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}

// Overlay is rendered as part of SheetContent in native
export function SheetOverlay(): null {
  return null;
}

export function SheetContent({
  children,
  className,
  side = "right",
}: SheetContentProps): React.JSX.Element {
  const { open, setOpen } = useSheet();
  const { t } = useTranslation();

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
        <StyledAnimatedView
          entering={SlideInRight}
          exiting={SlideOutRight}
          className={cn(
            "absolute bg-background p-6 shadow-lg",
            side === "right" &&
              "right-0 top-0 bottom-0 w-3/4 max-w-sm border-l",
            side === "left" && "left-0 top-0 bottom-0 w-3/4 max-w-sm border-r",
            side === "top" && "top-0 left-0 right-0 border-b",
            side === "bottom" && "bottom-0 left-0 right-0 border-t",
            className,
          )}
        >
          <Pressable
            className="absolute right-4 top-4 rounded-sm opacity-70"
            onPress={() => {
              setOpen(false);
            }}
          >
            <X size={16} color="currentColor" />
            <Text className="sr-only">
              {t("app.common.accessibility.srOnly.close")}
            </Text>
          </Pressable>
          {children}
        </StyledAnimatedView>
      </Pressable>
    </Modal>
  );
}

export function SheetHeader({
  className,
  children,
}: SheetHeaderProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "flex flex-col gap-2 text-center native:text-left",
        className,
      )}
    >
      {children}
    </View>
  );
}

SheetHeader.displayName = "SheetHeader";

export function SheetFooter({
  className,
  children,
}: SheetFooterProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "flex flex-col-reverse native:flex-row native:justify-end gap-2",
        className,
      )}
    >
      {children}
    </View>
  );
}

SheetFooter.displayName = "SheetFooter";

export function SheetTitle({
  className,
  children,
}: SheetTitleProps): React.JSX.Element {
  return (
    <Text className={cn("text-lg font-semibold text-foreground", className)}>
      {children}
    </Text>
  );
}

SheetTitle.displayName = "SheetTitle";

export function SheetDescription({
  className,
  children,
}: SheetDescriptionProps): React.JSX.Element {
  return (
    <Text className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </Text>
  );
}

SheetDescription.displayName = "SheetDescription";
