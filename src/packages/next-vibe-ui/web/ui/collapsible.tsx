"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

export type CollapsibleProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
} & StyleType;

export function Collapsible({
  children,
  ...props
}: CollapsibleProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Root {...props}>{children}</CollapsiblePrimitive.Root>
  );
}
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

export type CollapsibleTriggerProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  disabled?: boolean;
} & StyleType;

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

export type CollapsibleContentProps = {
  children?: React.ReactNode;
  forceMount?: true;
} & StyleType;

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
