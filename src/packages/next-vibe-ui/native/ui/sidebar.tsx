/**
 * Sidebar Component for React Native
 * TODO: Implement collapsible sidebar with navigation
 * Currently a simple container
 */
import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { cn } from "../lib/utils";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    // eslint-disable-next-line no-restricted-syntax -- Error handling for context
    throw new Error("Sidebar components must be used within Sidebar"); // eslint-disable-line i18next/no-literal-string -- Error message
  }
  return context;
}

interface SidebarProps {
  children: ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

export const Sidebar = React.forwardRef<View, SidebarProps>(
  ({ className, children, defaultCollapsed = false, ...props }, ref) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    return (
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <View
          ref={ref}
          className={cn(
            "flex flex-col border-r border-border bg-background",
            collapsed ? "w-16" : "w-64",
            className,
          )}
          {...props}
        >
          {children}
        </View>
      </SidebarContext.Provider>
    );
  },
);

Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<
  View,
  { children: ReactNode; className?: string }
>(({ className, children, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex flex-col gap-2 p-4", className)}
    {...props}
  >
    {children}
  </View>
));

SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<
  View,
  { children: ReactNode; className?: string }
>(({ className, children, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex-1 overflow-y-auto", className)}
    {...props}
  >
    {children}
  </View>
));

SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<
  View,
  { children: ReactNode; className?: string }
>(({ className, children, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex flex-col gap-2 p-4", className)}
    {...props}
  >
    {children}
  </View>
));

SidebarFooter.displayName = "SidebarFooter";

export const SidebarItem = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  { children: ReactNode; className?: string; onPress?: () => void }
>(({ className, children, onPress, ...props }, ref) => (
  <Pressable
    ref={ref}
    onPress={onPress}
    className={cn(
      "flex flex-row items-center gap-2 rounded-md px-3 py-2 text-sm active:bg-accent active:text-accent-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </Pressable>
));

SidebarItem.displayName = "SidebarItem";

export const SidebarLabel = React.forwardRef<
  RNText,
  { children: ReactNode; className?: string }
>(({ className, children, ...props }, ref) => (
  <RNText ref={ref} className={cn("text-sm font-medium", className)} {...props}>
    {children}
  </RNText>
));

SidebarLabel.displayName = "SidebarLabel";

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  { children?: ReactNode; className?: string }
>(({ className, children, ...props }, ref) => {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <Pressable
      ref={ref}
      onPress={() => {
        setCollapsed(!collapsed);
      }}
      className={cn("flex items-center justify-center p-2", className)}
      {...props}
    >
      {children}
    </Pressable>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";
