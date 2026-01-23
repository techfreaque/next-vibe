import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";

import type { StyleType } from "../utils/style-type";

// Cross-platform accessibility role type
export type AccessibilityRoleValue =
  | "none"
  | "button"
  | "link"
  | "search"
  | "image"
  | "text"
  | "adjustable"
  | "imagebutton"
  | "header"
  | "summary"
  | "alert"
  | "checkbox"
  | "combobox"
  | "menu"
  | "menubar"
  | "menuitem"
  | "progressbar"
  | "radio"
  | "radiogroup"
  | "scrollbar"
  | "spinbutton"
  | "switch"
  | "tab"
  | "tablist"
  | "timer"
  | "toolbar"
  | undefined;

export type TypographyProps = {
  children?: React.ReactNode;
} & StyleType;

export type H1Props = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type H2Props = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type H3Props = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type H4Props = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type PProps = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type BlockQuoteProps = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type CodeProps = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type LeadProps = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type LargeProps = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type SmallProps = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export type MutedProps = TypographyProps & {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
};

export function H1({
  className,
  style,
  children,
  ...props
}: H1Props): JSX.Element {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2(props: H2Props): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <h2
      className={
        "className" in restProps
          ? cn(
              "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
              restProps.className,
            )
          : "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </h2>
  );
}

export function H3(props: H3Props): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <h3
      className={
        "className" in restProps
          ? cn(
              "scroll-m-20 text-2xl font-semibold tracking-tight",
              restProps.className,
            )
          : "scroll-m-20 text-2xl font-semibold tracking-tight"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </h3>
  );
}

export function H4(props: H4Props): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <h4
      className={
        "className" in restProps
          ? cn(
              "scroll-m-20 text-xl font-semibold tracking-tight",
              restProps.className,
            )
          : "scroll-m-20 text-xl font-semibold tracking-tight"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </h4>
  );
}

export function P(props: PProps): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <p
      className={
        "className" in restProps
          ? cn("leading-7", restProps.className)
          : "leading-7"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </p>
  );
}

export function BlockQuote(props: BlockQuoteProps): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <blockquote
      className={
        "className" in restProps
          ? cn("mt-6 border-l-2 pl-6 italic", restProps.className)
          : "mt-6 border-l-2 pl-6 italic"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </blockquote>
  );
}

export function Code(props: CodeProps): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <code
      className={
        "className" in restProps
          ? cn(
              "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
              restProps.className,
            )
          : "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </code>
  );
}

export function Lead(props: LeadProps): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <p
      className={
        "className" in restProps
          ? cn("text-xl text-muted-foreground", restProps.className)
          : "text-xl text-muted-foreground"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </p>
  );
}

export function Large(props: LargeProps): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <div
      className={
        "className" in restProps
          ? cn("text-lg font-semibold", restProps.className)
          : "text-lg font-semibold"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </div>
  );
}

export function Small(props: SmallProps): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <small
      className={
        "className" in restProps
          ? cn("text-sm font-medium leading-none", restProps.className)
          : "text-sm font-medium leading-none"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </small>
  );
}

export function Muted(props: MutedProps): JSX.Element {
  const { children, ...restProps } = props;
  return (
    <p
      className={
        "className" in restProps
          ? cn("text-sm text-muted-foreground", restProps.className)
          : "text-sm text-muted-foreground"
      }
      style={"style" in restProps ? restProps.style : undefined}
      id={restProps.id}
      role={restProps.role}
      aria-label={restProps["aria-label"]}
      aria-labelledby={restProps["aria-labelledby"]}
      aria-describedby={restProps["aria-describedby"]}
    >
      {children}
    </p>
  );
}
