import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

// Common base for all card components
type CardCommonBaseProps = {
  children?: React.ReactNode;
  id?: string;
} & StyleType;

export type CardProps = CardCommonBaseProps;

export function Card({ className, style, children, id }: CardProps): React.JSX.Element {
  return (
    <div
      id={id}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      style={style}
    >
      {children}
    </div>
  );
}
Card.displayName = "Card";

export type CardHeaderProps = CardCommonBaseProps;

export function CardHeader({ className, style, children, id }: CardHeaderProps): React.JSX.Element {
  return (
    <div id={id} className={cn("flex flex-col gap-1.5 p-6", className)} style={style}>
      {children}
    </div>
  );
}
CardHeader.displayName = "CardHeader";

export type CardTitleProps = CardCommonBaseProps;

export function CardTitle({ className, style, children, id }: CardTitleProps): React.JSX.Element {
  return (
    <div
      id={id}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      style={style}
    >
      {children}
    </div>
  );
}
CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = CardCommonBaseProps;

export function CardDescription({
  className,
  style,
  children,
  id,
}: CardDescriptionProps): React.JSX.Element {
  return (
    <div id={id} className={cn("text-sm text-muted-foreground", className)} style={style}>
      {children}
    </div>
  );
}
CardDescription.displayName = "CardDescription";

export type CardContentProps = CardCommonBaseProps;

export function CardContent({
  className,
  style,
  children,
  id,
}: CardContentProps): React.JSX.Element {
  return (
    <div id={id} className={cn("p-6 pt-0", className)} style={style}>
      {children}
    </div>
  );
}
CardContent.displayName = "CardContent";

export type CardFooterProps = CardCommonBaseProps;

export function CardFooter({ className, style, children, id }: CardFooterProps): React.JSX.Element {
  return (
    <div id={id} className={cn("flex items-center p-6 pt-0", className)} style={style}>
      {children}
    </div>
  );
}
CardFooter.displayName = "CardFooter";
