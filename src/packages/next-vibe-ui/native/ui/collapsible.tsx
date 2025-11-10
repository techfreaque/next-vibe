import * as CollapsiblePrimitive from "@rn-primitives/collapsible";
import * as React from "react";

// Import types from web for cross-platform compatibility
import type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "next-vibe-ui/ui/collapsible";

export type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
};

export function Collapsible({ children, ...props }: CollapsibleRootProps): React.JSX.Element {
  return <CollapsiblePrimitive.Root {...props}>{children}</CollapsiblePrimitive.Root>;
}
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

export function CollapsibleTrigger({ children, asChild, ...props }: CollapsibleTriggerProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </CollapsiblePrimitive.Trigger>
  );
}
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

export function CollapsibleContent({ children, ...props }: CollapsibleContentProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Content {...props}>
      {children}
    </CollapsiblePrimitive.Content>
  );
}
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;
