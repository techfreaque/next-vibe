import * as TogglePrimitive from "@rn-primitives/toggle";
import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import * as React from "react";

import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import { TextClassContext } from "./text";
import type {
  ToggleProps,
  ToggleSize,
  ToggleVariant,
} from "../../web/ui/toggle";

const toggleVariants = cva(
  "web:group web:inline-flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:hover:bg-muted active:bg-muted web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent web:hover:bg-accent active:bg-accent active:bg-accent",
      },
      size: {
        default: "h-10 px-3 native:h-12 native:px-[12]",
        sm: "h-9 px-2.5 native:h-10 native:px-[9]",
        lg: "h-11 px-5 native:h-14 native:px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const toggleTextVariants = cva(
  "text-sm native:text-base text-foreground font-medium",
  {
    variants: {
      variant: {
        default: "",
        outline:
          "web:group-hover:text-accent-foreground web:group-active:text-accent-foreground",
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

export type { ToggleProps, ToggleSize, ToggleVariant };

const StyledToggleRoot = styled(TogglePrimitive.Root);

const Toggle = React.forwardRef<
  TogglePrimitive.RootRef,
  ToggleProps
>(({ className, variant, size, pressed, onPressedChange, children, disabled }, ref): React.ReactElement => {
  const isPressed = pressed ?? false;
  const handlePressedChange = onPressedChange ?? (() => undefined);
  return (
    <TextClassContext.Provider
      value={cn(
        toggleTextVariants({ variant, size }),
        isPressed
          ? "text-accent-foreground"
          : "web:group-hover:text-muted-foreground",
      )}
    >
      <StyledToggleRoot
        ref={ref}
        pressed={isPressed}
        onPressedChange={handlePressedChange}
        disabled={disabled}
        className={cn(
          toggleVariants({ variant, size }),
          disabled && "web:pointer-events-none opacity-50",
          isPressed && "bg-accent",
          className,
        )}
      >
        {children}
      </StyledToggleRoot>
    </TextClassContext.Provider>
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

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

export { Toggle, ToggleIcon, toggleTextVariants, toggleVariants };
