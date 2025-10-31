import * as CollapsiblePrimitive from "@rn-primitives/collapsible";

// Native uses RN primitives directly - same interface as web
export type CollapsibleProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>;
export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>;
export type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>;

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

const CollapsibleContent = CollapsiblePrimitive.Content;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
