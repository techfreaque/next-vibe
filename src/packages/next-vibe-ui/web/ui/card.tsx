import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types for native import
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

function Card({ className, ...props }: CardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
Card.displayName = "Card";

function CardHeader({
  className,
  ...props
}: CardHeaderProps): React.JSX.Element {
  return (
    <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
  );
}
CardHeader.displayName = "CardHeader";

function CardTitle({ className, ...props }: CardTitleProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}
CardTitle.displayName = "CardTitle";

function CardDescription({
  className,
  ...props
}: CardDescriptionProps): React.JSX.Element {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
CardDescription.displayName = "CardDescription";

function CardContent({
  className,
  ...props
}: CardContentProps): React.JSX.Element {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}
CardContent.displayName = "CardContent";

function CardFooter({
  className,
  ...props
}: CardFooterProps): React.JSX.Element {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  );
}
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
