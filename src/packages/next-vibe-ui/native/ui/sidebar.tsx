"use client";

import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import type { PressableProps, ViewProps } from "react-native";
import { Pressable, View, ScrollView, Dimensions } from "react-native";
import { styled } from "nativewind";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { useTranslation } from "@/i18n/core/client";

import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "./button";
import { PanelLeft } from "./icons/PanelLeft";
import { Input } from "./input";

import { Separator } from "./separator";
import { Sheet, SheetContent } from "./sheet";
import { Skeleton } from "./skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

// Constants
export const SIDEBAR_COOKIE_NAME = "sidebar:state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// Cross-platform type exports
export interface SidebarContextType {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarProps {
  children?: React.ReactNode;
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarTriggerProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarRailProps {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarInsetProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarGroupProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarGroupLabelProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarGroupActionProps {
  children?: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarGroupContentProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  onClick?: () => void;
  disabled?: boolean;
  variant?: VariantProps<typeof sidebarMenuButtonVariants>["variant"];
  size?: VariantProps<typeof sidebarMenuButtonVariants>["size"];
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuActionProps {
  children?: React.ReactNode;
  asChild?: boolean;
  showOnHover?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuBadgeProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuSkeletonProps {
  showIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuSubProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuSubItemProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SidebarMenuSubButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const StyledView = styled(View, { className: "style" });
const StyledPressable = styled(Pressable, { className: "style" });

const SidebarContext = React.createContext<SidebarContextType | null>(null);

function useSidebar(): SidebarContextType {
  const context = React.useContext(SidebarContext);
  if (!context) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- Error handling for context
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps): React.JSX.Element {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // Note: Cookie persistence not implemented on native
      // Could use AsyncStorage here if needed
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen]);

  // Note: Keyboard shortcut handling not implemented on native
  // React Native doesn't have window.addEventListener for keyboard events
  // in the same way as web

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextType>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <StyledView
          {...applyStyleType({
            nativeStyle,
            className: cn(
              "group/sidebar-wrapper flex min-h-screen w-full",
              className,
            ),
          })}
          {...props}
        >
          {children}
        </StyledView>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}
SidebarProvider.displayName = "SidebarProvider";

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  style,
  children,
  ...props
}: SidebarProps): React.JSX.Element {
  const { isMobile, state: _state, openMobile, setOpenMobile } = useSidebar();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  if (collapsible === "none") {
    return (
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className,
          ),
        })}
        {...props}
      >
        {children}
      </StyledView>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground"
          side={side}
        >
          <StyledView className="flex h-full w-full flex-col">
            {children}
          </StyledView>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: "group peer hidden md:block text-sidebar-foreground",
      })}
      {...props}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <StyledView
        className={cn(
          "duration-200 relative h-screen w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
        )}
      />
      <StyledView
        className={cn(
          "duration-200 fixed inset-y-0 z-10 hidden h-screen w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
      >
        <StyledView className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow">
          {children}
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
Sidebar.displayName = "Sidebar";

function SidebarTrigger({
  className,
  style,
  children,
  onClick,
  ...props
}: SidebarTriggerProps): React.JSX.Element {
  const { toggleSidebar } = useSidebar();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const handleClick = React.useCallback(() => {
    onClick?.();
    toggleSidebar();
  }, [onClick, toggleSidebar]);

  // Note: style prop is not passed to Button due to StyleType discriminated union
  // Button uses className for styling via NativeWind (either style OR className, not both)
  void nativeStyle; // Acknowledge nativeStyle is intentionally unused for Button
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={handleClick}
      {...props}
    >
      {children || (
        <>
          <PanelLeft />
          {/* Screen reader text would need to be implemented with accessibility labels on native */}
        </>
      )}
    </Button>
  );
}
SidebarTrigger.displayName = "SidebarTrigger";

export function TopBar({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <StyledView className="absolute top-4 left-4 z-[51] flex flex-row gap-1">
      {children}
    </StyledView>
  );
}
TopBar.displayName = "TopBar";

function SidebarRail({
  className,
  style,
  onClick,
}: SidebarRailProps): React.JSX.Element {
  const { toggleSidebar } = useSidebar();
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledPressable
      accessibilityLabel={t("app.common.accessibility.srOnly.toggleMenu")}
      onPress={() => {
        onClick?.();
        toggleSidebar();
      }}
      accessibilityHint={t("app.common.accessibility.srOnly.toggleMenu")}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        ),
      })}
    />
  );
}
SidebarRail.displayName = "SidebarRail";

export function SidebarInset({
  className,
  style,
  children,
  ...props
}: SidebarInsetProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative flex min-h-screen flex-1 flex-col bg-background",
          "peer-data-[variant=inset]:min-h-[calc(100vh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
          className,
        ),
      })}
      {...props}
    >
      {children}
    </StyledView>
  );
}
SidebarInset.displayName = "SidebarInset";

function SidebarInput({
  className,
  style: _style,
  ...props
}: React.ComponentProps<typeof Input>): React.JSX.Element {
  // Note: style prop is not passed to Input due to StyleType discriminated union
  // Input uses className for styling via NativeWind (either style OR className, not both)
  return (
    <Input
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className,
      )}
      {...props}
    />
  );
}
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-col gap-2 p-2", className),
      })}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-col gap-2 p-2", className),
      })}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof Separator> &
    ViewProps & { style?: React.CSSProperties }
>(({ className, style: _style, ...props }, ref) => {
  // Note: style prop is not passed to Separator due to StyleType discriminated union
  // Separator uses className for styling via NativeWind (either style OR className, not both)
  return (
    <StyledView ref={ref}>
      <Separator
        className={cn("mx-2 w-auto bg-sidebar-border", className)}
        {...props}
      />
    </StyledView>
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          className,
        ),
      })}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent" as const;

const SidebarGroup = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      })}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  View | React.ElementRef<typeof Slot.View>,
  ViewProps & {
    asChild?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
>(({ className, style, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot.View : StyledView;
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <Comp
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className,
        ),
      })}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
  React.ElementRef<typeof Pressable> | React.ElementRef<typeof Slot.Pressable>,
  PressableProps & {
    asChild?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
>(({ className, style, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot.Pressable : StyledPressable;
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <Comp
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className,
        ),
      })}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn("w-full text-sm", className),
      })}
      {...props}
    />
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn("flex w-full min-w-0 flex-col gap-1", className),
      })}
      {...props}
    />
  );
});
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn("group/menu-item relative", className),
      })}
      {...props}
    />
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  React.ElementRef<typeof Pressable> | React.ElementRef<typeof Slot.Pressable>,
  PressableProps & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
    className?: string;
    style?: React.CSSProperties;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive: _isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Pressable : StyledPressable;
    const { isMobile, state } = useSidebar();
    const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

    const button = (
      <Comp
        ref={ref}
        {...applyStyleType({
          nativeStyle,
          className: cn(
            sidebarMenuButtonVariants({ variant, size }),
            className,
          ),
        })}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  React.ElementRef<typeof Pressable> | React.ElementRef<typeof Slot.Pressable>,
  PressableProps & {
    asChild?: boolean;
    showOnHover?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
>(
  (
    { className, style, asChild = false, showOnHover = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot.Pressable : StyledPressable;
    const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

    return (
      <Comp
        ref={ref}
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
            // Increases the hit area of the button on mobile.
            "after:absolute after:-inset-2 after:md:hidden",
            "peer-data-[size=sm]/menu-button:top-1",
            "peer-data-[size=default]/menu-button:top-1.5",
            "peer-data-[size=lg]/menu-button:top-2.5",
            "group-data-[collapsible=icon]:hidden",
            showOnHover &&
              "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
            className,
          ),
        })}
        {...props}
      />
    );
  },
);
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
          "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
          "peer-data-[size=sm]/menu-button:top-1",
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "group-data-[collapsible=icon]:hidden",
          className,
        ),
      })}
      {...props}
    />
  );
});
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  View,
  ViewProps & {
    showIcon?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
>(({ className, style, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return Math.floor(Math.random() * 40) + 50;
  }, []);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn("rounded-md h-8 flex gap-2 px-2 items-center", className),
      })}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" />}
      <StyledView className={`h-4 flex-1 max-w-[${width}%]`}>
        <Skeleton className="h-full w-full" />
      </StyledView>
    </StyledView>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
          "group-data-[collapsible=icon]:hidden",
          className,
        ),
      })}
      {...props}
    />
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
  View,
  ViewProps & { className?: string; style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      ref={ref}
      {...applyStyleType({ nativeStyle, className })}
      {...props}
    />
  );
});
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  React.ElementRef<typeof Pressable> | React.ElementRef<typeof Slot.Pressable>,
  PressableProps & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
>(
  (
    {
      asChild = false,
      size = "md",
      isActive: _isActive = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Pressable : StyledPressable;
    const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

    return (
      <Comp
        ref={ref}
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
            "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            "group-data-[collapsible=icon]:hidden",
            className,
          ),
        })}
        {...props}
      />
    );
  },
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};

export type { VariantProps };

// ============================================================================
// SidebarLayout & SidebarWrapper - Layout Components for React Native
// ============================================================================

import type { ReactNode } from "react";

export interface SidebarLayoutProps {
  sidebar?: ReactNode;
  children?: ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  closeSidebarLabel?: string;
  className?: string;
  sidebarClassName?: string;
  contentClassName?: string;
  topBarLeft?: ReactNode;
  topBarRight?: ReactNode;
}

/**
 * SidebarLayout - Reusable sidebar/main layout component for React Native
 *
 * Matches the web version's simplified API (no topBar prop)
 * - Mobile: Modal overlay sidebar (no resize on native)
 * - Full-screen layout
 *
 * Adapted from the web version for React Native.
 */
export function SidebarLayout({
  sidebar,
  children,
  collapsed = false,
  onCollapsedChange,
  closeSidebarLabel = "Close sidebar",
  className: _className,
  sidebarClassName,
  contentClassName: _contentClassName,
  topBarLeft,
  topBarRight,
}: SidebarLayoutProps): React.JSX.Element {
  const { height: windowHeight } = Dimensions.get("window");

  return (
    <StyledView className="bg-background">
      {/* Top bar left */}
      <StyledView
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 60,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <StyledView
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          {topBarLeft}
        </StyledView>
        <StyledView
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          {topBarRight}
        </StyledView>
      </StyledView>

      {/* Main Content - base layer */}
      <ScrollView>{children}</ScrollView>

      {/* overlay */}
      {!collapsed && (
        <StyledPressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            backgroundColor: "#000",
            opacity: 0.5,
          }}
          onPress={() => onCollapsedChange?.(!collapsed)}
          accessibilityLabel={closeSidebarLabel}
        />
      )}

      {/* Sidebar overlay */}
      {!collapsed && (
        <StyledView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 260,
            height: windowHeight,
            zIndex: 50,
          }}
        >
          <StyledView
            className={cn(
              "flex-1 bg-background border-border shadow-lg",
              sidebarClassName,
            )}
          >
            <ScrollView style={{ flex: 1 }}>{sidebar}</ScrollView>
          </StyledView>
        </StyledView>
      )}
    </StyledView>
  );
}

/**
 * SidebarWrapper - Legacy API wrapper for SidebarLayout
 *
 * Provides the same API as the chat's SidebarWrapper component
 * for backward compatibility.
 */
export interface SidebarWrapperProps {
  children?: ReactNode;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  closeSidebarLabel?: string;
  className?: string;
  sidebarClassName?: string;
  contentClassName?: string;
  sidebar: ReactNode;
}

export function SidebarWrapper({
  children,
  collapsed = false,
  setCollapsed,
  closeSidebarLabel,
  className,
  sidebarClassName,
  contentClassName,
  sidebar,
}: SidebarWrapperProps): React.JSX.Element {
  return (
    <SidebarLayout
      sidebar={sidebar}
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      closeSidebarLabel={closeSidebarLabel}
      className={className}
      sidebarClassName={sidebarClassName}
      contentClassName={contentClassName}
    >
      {children}
    </SidebarLayout>
  );
}
