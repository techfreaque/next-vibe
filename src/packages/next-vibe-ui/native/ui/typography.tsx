// oxlint-disable prefer-tag-over-role
import * as React from "react";
import { Text as RNText } from "react-native";

// Define refs inline to avoid module resolution issues
type TextRef = React.ElementRef<typeof RNText>;

import { cn } from "../lib/utils";
import type { TextPropsWithClassName } from "../lib/types";
import type {
  TypographyProps as WebTypographyProps,
} from "../../web/ui/typography";

// Re-export web types for cross-platform compatibility
export type {
  TypographyProps,
} from "../../web/ui/typography";

// Native typography components use RNText directly (no asChild pattern for semantic elements)
// We only use className from web TypographyProps, children comes from TextPropsWithClassName
export type H1Props = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type H2Props = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type H3Props = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type H4Props = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type PProps = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type BlockQuoteProps = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type CodeProps = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type LeadProps = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type LargeProps = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type SmallProps = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;
export type MutedProps = Omit<WebTypographyProps, "children"> & TextPropsWithClassName;

const H1 = React.forwardRef<TextRef, H1Props>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "web:scroll-m-20 text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

H1.displayName = "H1";

const H2 = React.forwardRef<TextRef, H2Props>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "web:scroll-m-20 border-b border-border pb-2 text-3xl text-foreground font-semibold tracking-tight first:mt-0 web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

H2.displayName = "H2";

const H3 = React.forwardRef<TextRef, H3Props>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "web:scroll-m-20 text-2xl text-foreground font-semibold tracking-tight web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

H3.displayName = "H3";

const H4 = React.forwardRef<TextRef, H4Props>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "web:scroll-m-20 text-xl text-foreground font-semibold tracking-tight web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

H4.displayName = "H4";

const P = React.forwardRef<TextRef, PProps>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn("text-base text-foreground web:select-text", className)}
      ref={ref}
      {...props}
    />
  ),
);

P.displayName = "P";

const BlockQuote = React.forwardRef<TextRef, BlockQuoteProps>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "mt-6 native:mt-4 border-l-2 border-border pl-6 native:pl-3 text-base text-foreground italic web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

BlockQuote.displayName = "BlockQuote";

const Code = React.forwardRef<TextRef, CodeProps>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] text-sm text-foreground font-semibold web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Code.displayName = "Code";

const Lead = React.forwardRef<TextRef, LeadProps>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "text-xl text-muted-foreground web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Lead.displayName = "Lead";

const Large = React.forwardRef<TextRef, LargeProps>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "text-xl text-foreground font-semibold web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Large.displayName = "Large";

const Small = React.forwardRef<TextRef, SmallProps>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "text-sm text-foreground font-medium leading-none web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Small.displayName = "Small";

const Muted = React.forwardRef<TextRef, MutedProps>(
  ({ className, ...props }, ref) => (
    <RNText
      className={cn(
        "text-sm text-muted-foreground web:select-text",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Muted.displayName = "Muted";

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small };
