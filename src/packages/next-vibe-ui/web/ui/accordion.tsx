"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface AccordionRootProps {
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  collapsible?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

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

export function Accordion({
  children,
  type = "single",
  collapsible = false,
  value,
  onValueChange,
  defaultValue,
  disabled,
  className,
}: AccordionRootProps): React.JSX.Element {
  if (type === "single") {
    return (
      <AccordionPrimitive.Root
        type="single"
        collapsible={collapsible}
        value={value as string | undefined}
        onValueChange={onValueChange as ((value: string) => void) | undefined}
        defaultValue={defaultValue as string | undefined}
        disabled={disabled}
        className={className}
      >
        {children}
      </AccordionPrimitive.Root>
    );
  }

  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value as string[] | undefined}
      onValueChange={onValueChange as ((value: string[]) => void) | undefined}
      defaultValue={defaultValue as string[] | undefined}
      disabled={disabled}
      className={className}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}
Accordion.displayName = AccordionPrimitive.Root.displayName;

export function AccordionItem({
  className,
  ...props
}: AccordionItemProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Item className={cn("border-b", className)} {...props} />
  );
}
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps): React.JSX.Element {
  return (
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
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Content>
  );
}
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
