"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as React from "react";

// Cross-platform types
export interface CollapsibleRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

export interface CollapsibleTriggerProps {
  asChild?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface CollapsibleContentProps {
  forceMount?: true;
  children?: React.ReactNode;
  className?: string;
}

export function Collapsible({
  children,
  ...props
}: CollapsibleRootProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Root {...props}>{children}</CollapsiblePrimitive.Root>
  );
}
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

export function CollapsibleTrigger({
  children,
  asChild,
  ...props
}: CollapsibleTriggerProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger asChild={asChild} {...props}>
      {children}
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
}
CollapsibleTrigger.displayName =
  CollapsiblePrimitive.CollapsibleTrigger.displayName;

export function CollapsibleContent({
  children,
  ...props
}: CollapsibleContentProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.CollapsibleContent {...props}>
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
}
CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName;
