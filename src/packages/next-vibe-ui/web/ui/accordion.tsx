"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "next-vibe/shared/utils/utils";
import { ChevronDownIcon } from "next-vibe-ui/ui/icons";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

// Accordion
export type AccordionProps = {
  children?: React.ReactNode;
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  collapsible?: boolean;
  disabled?: boolean;
} & StyleType;

export function Accordion({
  children,
  type = "single",
  collapsible = false,
  value,
  onValueChange,
  defaultValue,
  disabled,
  className,
  style,
}: AccordionProps): React.JSX.Element {
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
        style={style}
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
      style={style}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}
Accordion.displayName = AccordionPrimitive.Root.displayName;

// AccordionItem
export type AccordionItemProps = {
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
} & StyleType;

export function AccordionItem({
  className,
  style,
  ...props
}: AccordionItemProps): React.JSX.Element {
  return <AccordionPrimitive.Item className={cn("border-b", className)} style={style} {...props} />;
}
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

// AccordionTrigger
export type AccordionTriggerProps = {
  children?: React.ReactNode;
} & StyleType;

export function AccordionTrigger({
  className,
  style,
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
        style={style}
        {...props}
      >
        {children}
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

// AccordionContent
export type AccordionContentProps = {
  children?: React.ReactNode;
} & StyleType;

export function AccordionContent({
  className,
  style,
  children,
  ...props
}: AccordionContentProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </AccordionPrimitive.Content>
  );
}
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
