import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import * as React from "react";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";
import { toggleTextVariants, toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<VariantProps<
  typeof toggleVariants
> | null>(null);

type ToggleGroupProps = ToggleGroupPrimitive.RootProps &
  VariantProps<typeof toggleVariants> & {
    className?: string;
  };

const ToggleGroup = React.forwardRef<
  ToggleGroupPrimitive.RootRef,
  ToggleGroupProps
>((allProps, ref) => {
  const { className, variant, size, children, ...props } = allProps;
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {/* @ts-expect-error - TypeScript can't verify discriminated union props are passed correctly via spread */}
      <ToggleGroupPrimitive.Root
        ref={ref}
        {...props}
        className={cn("flex flex-row items-center justify-center gap-1", className)}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

function useToggleGroupContext(): VariantProps<typeof toggleVariants> {
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
  ToggleGroupPrimitive.ItemProps & VariantProps<typeof toggleVariants>
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
  className,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<LucideIcon> & {
  icon: LucideIcon;
}): React.JSX.Element {
  const textClass = React.useContext(TextClassContext);
  return <Icon {...props} className={cn(textClass, className)} />;
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem };
