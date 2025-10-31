/**
 * Sidebar Component for React Native
 * TODO: Implement collapsible sidebar with navigation
 * Currently a simple container
 */
import React, { createContext, useContext, useMemo, useState } from "react";
import type { PressableProps, ViewProps } from "react-native";
import { Pressable, View } from "react-native";

import type {
  SidebarContentProps,
  SidebarContextType,
  SidebarFooterProps,
  SidebarHeaderProps,
  SidebarMenuItemProps,
  SidebarProps as WebSidebarProps,
  SidebarProviderProps,
  SidebarTriggerProps,
} from "next-vibe-ui/ui/sidebar";
import { cn } from "../lib/utils";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    // eslint-disable-next-line no-restricted-syntax -- Error handling for context
    throw new Error("Sidebar components must be used within Sidebar"); // eslint-disable-line i18next/no-literal-string -- Error message
  }
  return context;
}

// Native sidebar props combine web props with ViewProps
type NativeSidebarProps = WebSidebarProps & ViewProps & { defaultOpen?: boolean };

export const Sidebar = React.forwardRef<View, NativeSidebarProps>(
  ({ className, children, defaultOpen = true, ...props }, ref) => {
    const [open, setOpen] = useState(defaultOpen);

    const contextValue = useMemo<SidebarContextType>(
      () => ({
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile: false,
        setOpenMobile: () => {},
        isMobile: false,
        toggleSidebar: () => setOpen(!open),
      }),
      [open],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <View
          ref={ref}
          {...({
            className: cn(
              "flex flex-col border-r border-border bg-background",
              open ? "w-64" : "w-16",
              className,
            ),
            ...props,
          } as any)}
        >
          {children}
        </View>
      </SidebarContext.Provider>
    );
  },
);

Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<View, SidebarHeaderProps & ViewProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn("flex flex-col gap-2 p-4", className)} {...props as any}>
      {children}
    </View>
  ),
);

SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<View, SidebarContentProps & ViewProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props as any}>
      {children}
    </View>
  ),
);

SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<View, SidebarFooterProps & ViewProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn("flex flex-col gap-2 p-4", className)} {...props as any}>
      {children}
    </View>
  ),
);

SidebarFooter.displayName = "SidebarFooter";

// Note: Web has many more sidebar components (SidebarMenu, SidebarMenuItem, etc.)
// This native implementation provides essential functionality only
export const SidebarMenuItem = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  SidebarMenuItemProps & PressableProps
>(({ className, children, onPress, ...props }, ref) => (
  <Pressable
    ref={ref}
    onPress={onPress}
    className={cn(
      "flex flex-row items-center gap-2 rounded-md px-3 py-2 text-sm active:bg-accent active:text-accent-foreground",
      className,
    )}
    {...props as any}
  >
    {children}
  </Pressable>
));

SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  SidebarTriggerProps & PressableProps
>(({ className, children, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Pressable
      ref={ref}
      onPress={toggleSidebar}
      className={cn("flex items-center justify-center p-2", className)}
      {...props as any}
    >
      {children}
    </Pressable>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";

// Provider for web compatibility - simplified for native
export const SidebarProvider = Sidebar;
