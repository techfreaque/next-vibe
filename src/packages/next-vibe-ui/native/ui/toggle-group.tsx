import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import type { LucideIcon } from "lucide-react-native";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";

import type { ToggleGroupItemProps, ToggleGroupRootProps } from "../../web/ui/toggle-group";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { TextClassContext } from "./text";
import { type ToggleSize, toggleTextVariants, type ToggleVariant, toggleVariants } from "./toggle";

// The styled() function has type inference issues with this primitive
const StyledToggleGroupRoot = ToggleGroupPrimitive.Root;
const StyledView = styled(View, { className: "style" });

const ToggleGroupContext = React.createContext<{
  size?: ToggleSize;
  variant?: ToggleVariant;
} | null>(null);

export function ToggleGroup({
  variant,
  size,
  className,
  children,
  type,
  value,
  onValueChange,
  defaultValue,
  disabled,
  rovingFocus,
  loop,
  orientation,
  dir,
  style,
}: ToggleGroupRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  const mergedClassName = cn("flex flex-row items-center justify-center gap-1", className);

  const toggleType = type ?? "single";
  const toggleValue = value ?? "";
  const handleValueChange = React.useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Intentional no-op fallback function
    () => onValueChange ?? ((_value: string | string[]): void => undefined),
    [onValueChange],
  );

  // Create properly typed handlers for each mode
  const singleHandler = React.useCallback(
    (val: string | undefined) => {
      handleValueChange(val ?? "");
    },
    [handleValueChange],
  );

  const multipleHandler = React.useCallback(
    (val: string[]) => {
      handleValueChange(val);
    },
    [handleValueChange],
  );

  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {toggleType === "single" ? (
        <StyledView {...applyStyleType({ nativeStyle, className: mergedClassName })}>
          <StyledToggleGroupRoot
            {...({
              type: "single",
              value: typeof toggleValue === "string" ? toggleValue : undefined,
              onValueChange: singleHandler,
              defaultValue: typeof defaultValue === "string" ? defaultValue : undefined,
              disabled,
              rovingFocus,
              loop,
              orientation,
              dir,
            } as React.ComponentProps<typeof StyledToggleGroupRoot>)}
          >
            {children}
          </StyledToggleGroupRoot>
        </StyledView>
      ) : (
        <StyledView {...applyStyleType({ nativeStyle, className: mergedClassName })}>
          <StyledToggleGroupRoot
            {...({
              type: "multiple",
              value: (Array.isArray(toggleValue) ? toggleValue : []) as string[],
              onValueChange: multipleHandler,
              defaultValue: (Array.isArray(defaultValue) ? defaultValue : []) as string[],
              disabled,
              rovingFocus,
              loop,
              orientation,
              dir,
            } as React.ComponentProps<typeof StyledToggleGroupRoot>)}
          >
            {children}
          </StyledToggleGroupRoot>
        </StyledView>
      )}
    </ToggleGroupContext.Provider>
  );
}

function useToggleGroupContext(): {
  size?: ToggleSize;
  variant?: ToggleVariant;
} {
  const context = React.useContext(ToggleGroupContext);
  if (context === null) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Standard React context hook pattern - throw is correct for developer mistakes
    throw new Error(
      "ToggleGroup compound components cannot be rendered outside the ToggleGroup component", // eslint-disable-line i18next/no-literal-string -- Error message
    );
  }
  return context;
}

export function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  disabled,
  style,
  ...props
}: ToggleGroupItemProps): React.JSX.Element {
  const context = useToggleGroupContext();
  const { value: groupValue } = ToggleGroupPrimitive.useRootContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <TextClassContext.Provider
      value={cn(
        toggleTextVariants({ variant, size }),
        ToggleGroupPrimitive.utils.getIsSelected(groupValue, value)
          ? "text-accent-foreground"
          : "group-hover:text-muted-foreground",
      )}
    >
      <ToggleGroupPrimitive.Item
        {...applyStyleType({
          nativeStyle,
          className: cn(
            toggleVariants({
              variant: context.variant || variant,
              size: context.size || size,
            }),
            disabled && "pointer-events-none opacity-50",
            ToggleGroupPrimitive.utils.getIsSelected(groupValue, value) && "bg-accent",
            className,
          ),
        })}
        value={value}
        disabled={disabled}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    </TextClassContext.Provider>
  );
}

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

export { ToggleGroupIcon };
