/// <reference path="../../../../../nativewind-env.d.ts" />

import * as Slot from "@rn-primitives/slot";
import { cva } from "class-variance-authority";
import type * as React from "react";
import { View } from "react-native";

import type { BadgeProps, BadgeVariant } from "next-vibe-ui/ui/badge";
import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

const badgeVariants = cva(
  "web:inline-flex items-center rounded-full border border-border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary web:hover:opacity-80 active:opacity-80",
        secondary:
          "border-transparent bg-secondary web:hover:opacity-80 active:opacity-80",
        destructive:
          "border-transparent bg-destructive web:hover:opacity-80 active:opacity-80",
        outline: "text-foreground",
        notification:
          "border-transparent bg-red-500 web:hover:opacity-80 active:opacity-80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const badgeTextVariants = cva("text-xs font-semibold ", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      notification: "text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Badge({
  className,
  variant,
  asChild,
  children,
}: BadgeProps): React.JSX.Element {
  const combinedClassName = cn(badgeVariants({ variant }), className);

  if (asChild) {
    return (
      <TextClassContext.Provider value={badgeTextVariants({ variant })}>
        <Slot.View className={combinedClassName}>
          {children}
        </Slot.View>
      </TextClassContext.Provider>
    );
  }

  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <View className={combinedClassName}>
        {children}
      </View>
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
