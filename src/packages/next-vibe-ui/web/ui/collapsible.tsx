"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

// Re-export types for cross-platform compatibility
export type CollapsibleProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>;
export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>;
export type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>;

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
