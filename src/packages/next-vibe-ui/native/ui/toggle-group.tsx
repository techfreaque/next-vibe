import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import type { LucideIcon } from "lucide-react-native";
import * as React from "react";

import { cn } from "../lib/utils";
import { styled } from "nativewind";
import { TextClassContext } from "./text";
import {
  toggleTextVariants,
  toggleVariants,
  type ToggleSize,
  type ToggleVariant,
} from "./toggle";
import type {
  ToggleGroupItemProps,
  ToggleGroupProps,
} from "../../web/ui/toggle-group";

export type { ToggleGroupItemProps, ToggleGroupProps };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledToggleGroupRoot = styled(ToggleGroupPrimitive.Root) as React.ComponentType<any>;

const ToggleGroupContext = React.createContext<{
  size?: ToggleSize;
  variant?: ToggleVariant;
} | null>(null);

const ToggleGroup = React.forwardRef<
  ToggleGroupPrimitive.RootRef,
  ToggleGroupProps
>((allProps, ref) => {
  const {
    variant,
    size,
    className,
    children,
    type: propType,
    value,
    onValueChange,
    defaultValue,
    disabled,
    rovingFocus,
    loop,
    orientation,
    dir,
  } = allProps;
  const mergedClassName = cn(
    "flex flex-row items-center justify-center gap-1",
    className,
  );

  // Type is either "single" or "multiple"
  const type = propType ?? "single";

  // Handle the discriminated union type - RN primitives require separate handlers
  // for single vs multiple, but web API accepts combined handler

  // Create properly typed handlers for each mode
  const singleHandler = React.useCallback(
    (val: string | undefined) => {
      if (onValueChange) {
        onValueChange(val ?? "");
      }
    },
    [onValueChange],
  );

  const multipleHandler = React.useCallback(
    (val: string[]) => {
      if (onValueChange) {
        onValueChange(val);
      }
    },
    [onValueChange],
  );

  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {type === "single" ? (
        <StyledToggleGroupRoot
          ref={ref}
          className={mergedClassName}
          type="single"
          value={typeof value === "string" ? value : undefined}
          onValueChange={singleHandler}
          defaultValue={
            typeof defaultValue === "string" ? defaultValue : undefined
          }
          disabled={disabled}
          rovingFocus={rovingFocus}
          loop={loop}
          orientation={orientation}
          dir={dir}
        >
          {children}
        </StyledToggleGroupRoot>
      ) : (
        <StyledToggleGroupRoot
          ref={ref}
          className={mergedClassName}
          type="multiple"
          value={Array.isArray(value) ? value : []}
          onValueChange={multipleHandler}
          defaultValue={Array.isArray(defaultValue) ? defaultValue : []}
          disabled={disabled}
          rovingFocus={rovingFocus}
          loop={loop}
          orientation={orientation}
          dir={dir}
        >
          {children}
        </StyledToggleGroupRoot>
      )}
    </ToggleGroupContext.Provider>
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
          : "group-hover:text-muted-foreground",
      )}
    >
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          props.disabled && "pointer-events-none opacity-50",
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
