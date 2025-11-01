// Web typography components - using semantic HTML elements

import { cn } from "next-vibe/shared/utils/utils";
import type { ComponentPropsWithoutRef, ForwardedRef } from "react";
import { forwardRef } from "react";

// Cross-platform prop types
export interface TypographyProps {
  className?: string;
  children?: React.ReactNode;
}

// Web-specific prop types
export interface H1Props extends ComponentPropsWithoutRef<"h1">, TypographyProps {}
export interface H2Props extends ComponentPropsWithoutRef<"h2">, TypographyProps {}
export interface H3Props extends ComponentPropsWithoutRef<"h3">, TypographyProps {}
export interface H4Props extends ComponentPropsWithoutRef<"h4">, TypographyProps {}
export interface PProps extends ComponentPropsWithoutRef<"p">, TypographyProps {}
export interface BlockQuoteProps extends ComponentPropsWithoutRef<"blockquote">, TypographyProps {}
export interface CodeProps extends ComponentPropsWithoutRef<"code">, TypographyProps {}
export interface LeadProps extends ComponentPropsWithoutRef<"p">, TypographyProps {}
export interface LargeProps extends ComponentPropsWithoutRef<"div">, TypographyProps {}
export interface SmallProps extends ComponentPropsWithoutRef<"small">, TypographyProps {}
export interface MutedProps extends ComponentPropsWithoutRef<"p">, TypographyProps {}

export const H1 = forwardRef(function H1(
  { className, children, ...props }: H1Props,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <h1
      ref={ref}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
});

export const H2 = forwardRef(function H2(
  { className, children, ...props }: H2Props,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <h2
      ref={ref}
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
});

export const H3 = forwardRef(function H3(
  { className, children, ...props }: H3Props,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <h3
      ref={ref}
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
});

export const H4 = forwardRef(function H4(
  { className, children, ...props }: H4Props,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <h4
      ref={ref}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
});

export const P = forwardRef(function P(
  { className, ...props }: PProps,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  return (
    <p
      ref={ref}
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  );
});

export const BlockQuote = forwardRef(function BlockQuote(
  { className, ...props }: BlockQuoteProps,
  ref: ForwardedRef<HTMLQuoteElement>,
) {
  return (
    <blockquote
      ref={ref}
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  );
});

export const Code = forwardRef(function Code(
  { className, ...props }: CodeProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <code
      ref={ref}
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
      {...props}
    />
  );
});

export const Lead = forwardRef(function Lead(
  { className, ...props }: LeadProps,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  return (
    <p
      ref={ref}
      className={cn("text-xl text-muted-foreground", className)}
      {...props}
    />
  );
});

export const Large = forwardRef(function Large(
  { className, ...props }: LargeProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
});

export const Small = forwardRef(function Small(
  { className, ...props }: SmallProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <small
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
});

export const Muted = forwardRef(function Muted(
  { className, ...props }: MutedProps,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

