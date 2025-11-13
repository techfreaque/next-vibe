import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";

// Cross-platform prop types - base interface that both web and native use
export interface TypographyProps {
  className?: string;
  children?: React.ReactNode;
}

// Explicit prop types that both web and native implement
export interface H1Props extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface H2Props extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface H3Props extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface H4Props extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface PProps extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface BlockQuoteProps extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface CodeProps extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface LeadProps extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface LargeProps extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface SmallProps extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export interface MutedProps extends TypographyProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

export function H1({ className, children, ...props }: H1Props): JSX.Element {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: H2Props): JSX.Element {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: H3Props): JSX.Element {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ className, children, ...props }: H4Props): JSX.Element {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function P({ className, ...props }: PProps): JSX.Element {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  );
}

export function BlockQuote({
  className,
  ...props
}: BlockQuoteProps): JSX.Element {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  );
}

export function Code({ className, ...props }: CodeProps): JSX.Element {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: LeadProps): JSX.Element {
  return (
    <p className={cn("text-xl text-muted-foreground", className)} {...props} />
  );
}

export function Large({ className, ...props }: LargeProps): JSX.Element {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
}

export function Small({ className, ...props }: SmallProps): JSX.Element {
  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}

export function Muted({ className, ...props }: MutedProps): JSX.Element {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}
