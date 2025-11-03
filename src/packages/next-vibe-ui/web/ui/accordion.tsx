"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types - aligned with native requirements
export type AccordionProps =
  | {
      type?: "single";
      value?: string;
      onValueChange?: (value: string) => void;
      defaultValue?: string;
      collapsible?: boolean;
      disabled?: boolean;
      className?: string;
      children?: React.ReactNode;
    }
  | {
      type: "multiple";
      value?: string[];
      onValueChange?: (value: string[]) => void;
      defaultValue?: string[];
      collapsible?: never;
      disabled?: boolean;
      className?: string;
      children?: React.ReactNode;
    };

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface AccordionTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AccordionContentProps {
  className?: string;
  children?: React.ReactNode;
}

const Accordion = AccordionPrimitive.Root;

const AccordionItem = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Item
>): React.JSX.Element => (
  <AccordionPrimitive.Item className={cn("border-b", className)} {...props} />
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
>): React.JSX.Element => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
>): React.JSX.Element => (
  <AccordionPrimitive.Content
    className={cn(
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  />
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
