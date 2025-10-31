import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import type { LucideIcon } from "lucide-react-native";
import * as React from "react";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";
import {
  toggleTextVariants,
  toggleVariants,
  type ToggleSize,
  type ToggleVariant,
} from "./toggle";

// Cross-platform type exports
export interface ToggleGroupProps {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
  children?: React.ReactNode;
}

export interface ToggleGroupItemProps {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
}

const ToggleGroupContext = React.createContext<{
  size?: ToggleSize;
  variant?: ToggleVariant;
} | null>(null);

const ToggleGroup = React.forwardRef<
  ToggleGroupPrimitive.RootRef,
  ToggleGroupPrimitive.RootProps & ToggleGroupProps
>((allProps, ref) => {
  const { className, variant, size, children, ...props } = allProps;
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      {...props}
      className={cn("flex flex-row items-center justify-center gap-1", className)}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

function useToggleGroupContext(): {
  size?: ToggleSize;
  variant?: ToggleVariant;
} {
  const context = React.useContext(ToggleGroupContext);
  if (context === null) {
    // eslint-disable-next-line no-restricted-syntax -- Error handling for context
    throw new Error(
      "ToggleGroup compound components cannot be rendered outside the ToggleGroup component", // eslint-disable-line i18next/no-literal-string -- Error message
    );
  }
  return context;
}

const ToggleGroupItem = React.forwardRef<
  ToggleGroupPrimitive.ItemRef,
  ToggleGroupPrimitive.ItemProps & ToggleGroupItemProps
>(({ className, children, variant, size, ...props }, ref) => {
  const context = useToggleGroupContext();
  const { value } = ToggleGroupPrimitive.useRootContext();

  return (
    <TextClassContext.Provider
      value={cn(
        toggleTextVariants({ variant, size }),
        ToggleGroupPrimitive.utils.getIsSelected(value, props.value)
          ? "text-accent-foreground"
          : "web:group-hover:text-muted-foreground",
      )}
    >
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          props.disabled && "web:pointer-events-none opacity-50",
          ToggleGroupPrimitive.utils.getIsSelected(value, props.value) &&
            "bg-accent",
          className,
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    </TextClassContext.Provider>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

function ToggleGroupIcon({
  icon: Icon,
  ...props
}: Omit<React.ComponentPropsWithoutRef<LucideIcon>, "className"> & {
  icon: LucideIcon;
  className?: string;
}): React.JSX.Element {
  const textClass = React.useContext(TextClassContext);
  return <Icon {...props} color={textClass} />;
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem };
