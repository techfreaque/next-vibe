import * as TabsPrimitive from "@rn-primitives/tabs";
import * as React from "react";

import { cn } from "next-vibe/shared/utils/utils";
import { TextClassContext } from "./text";

// Import ALL types from web - ZERO definitions here
import type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "@/packages/next-vibe-ui/web/ui/tabs";


// Local styled components
const StyledTabsList = TabsPrimitive.List;
const StyledTabsTrigger = TabsPrimitive.Trigger;
const StyledTabsContent = TabsPrimitive.Content;

function Tabs({ children, value, onValueChange, defaultValue, orientation, activationMode, dir: _dir }: TabsRootProps): React.JSX.Element {
  // Handle controlled/uncontrolled state with defaultValue
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = React.useCallback((newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [isControlled, onValueChange]);

  return (
    <TabsPrimitive.Root
      value={currentValue}
      onValueChange={handleValueChange}
      orientation={orientation}
      activationMode={activationMode}
    >
      {children}
    </TabsPrimitive.Root>
  );
}
Tabs.displayName = TabsPrimitive.Root.displayName;

function TabsList({ className, children, ...props }: TabsListProps): React.JSX.Element {
  return (
    <StyledTabsList
      className={cn(
        "inline-flex h-11 h-12 items-center justify-center rounded-lg bg-muted/50 p-1 px-1.5 border border-border",
        className,
      )}
      {...props}
    >
      {children}
    </StyledTabsList>
  );
}
TabsList.displayName = TabsPrimitive.List.displayName;

function TabsTrigger({ className, value, disabled, children, ...props }: TabsTriggerProps): React.JSX.Element {
  const { value: selectedValue } = TabsPrimitive.useRootContext();
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-base font-medium text-muted-foreground transition-all",
        selectedValue === value && "text-primary-foreground",
      )}
    >
      <StyledTabsTrigger
        value={value}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center shadow-none whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          disabled && "pointer-events-none opacity-50",
          value === selectedValue && "bg-primary shadow-sm",
          className,
        )}
        {...props}
      >
        {children}
      </StyledTabsTrigger>
    </TextClassContext.Provider>
  );
}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

function TabsContent({ className, value, children, ...props }: TabsContentProps): React.JSX.Element {
  return (
    <StyledTabsContent
      value={value}
      className={cn(
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </StyledTabsContent>
  );
}
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
