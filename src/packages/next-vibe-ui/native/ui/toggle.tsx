import * as TogglePrimitive from "@rn-primitives/toggle";
import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type {
  ToggleRootProps,
  ToggleSize,
  ToggleVariant,
} from "@/packages/next-vibe-ui/web/ui/toggle";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";
import { TextClassContext } from "./text";

const toggleVariants = cva(
  "group inline-flex flex-row items-center justify-center rounded-md ring-offset-background transition-colors hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent active:bg-accent active:bg-accent",
      },
      size: {
        default: "h-10 px-3 h-12 px-[12]",
        sm: "h-9 px-2.5 h-10 px-[9]",
        lg: "h-11 px-5 h-14 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const toggleTextVariants = cva(
  "text-sm text-base text-foreground font-medium",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "group-hover:text-accent-foreground group-active:text-accent-foreground",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type { ToggleRootProps, ToggleSize, ToggleVariant };

const StyledToggleRoot = styledNative(TogglePrimitive.Root);

export function Toggle({
  className,
  style,
  variant,
  size,
  pressed,
  onPressedChange,
  children,
  disabled,
}: ToggleRootProps): React.JSX.Element {
  const isPressed = pressed ?? false;
  const handlePressedChange =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Intentional no-op fallback function
    onPressedChange ?? ((_pressed: boolean): void => undefined);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <TextClassContext.Provider
      value={cn(
        toggleTextVariants({ variant, size }),
        isPressed
          ? "text-accent-foreground"
          : "group-hover:text-muted-foreground",
      )}
    >
      <StyledToggleRoot
        pressed={isPressed}
        onPressedChange={handlePressedChange}
        disabled={disabled ?? false}
        {...applyStyleType({
          nativeStyle,
          className: cn(
            toggleVariants({ variant, size }),
            disabled && "pointer-events-none opacity-50",
            isPressed && "bg-accent",
            className,
          ),
        })}
      >
        {children}
      </StyledToggleRoot>
    </TextClassContext.Provider>
  );
}

function ToggleIcon({
  icon: Icon,
  ...props
}: Omit<React.ComponentPropsWithoutRef<LucideIcon>, "className"> & {
  icon: LucideIcon;
  className?: string;
}): React.JSX.Element {
  const textClass = React.useContext(TextClassContext);
  return <Icon {...props} color={textClass} />;
}

export { ToggleIcon, toggleTextVariants, toggleVariants };
