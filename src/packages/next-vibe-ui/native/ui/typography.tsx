// oxlint-disable prefer-tag-over-role
import * as React from "react";
import { Text as RNText } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToTextStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

import type {
  H1Props,
  H2Props,
  H3Props,
  H4Props,
  PProps,
  BlockQuoteProps,
  CodeProps,
  LeadProps,
  LargeProps,
  SmallProps,
  MutedProps,
  AccessibilityRoleValue,
} from "../../web/ui/typography";

const StyledText = styled(RNText, { className: "style" });

const VALID_ACCESSIBILITY_ROLES: Record<string, AccessibilityRoleValue> = {
  none: "none",
  button: "button",
  link: "link",
  search: "search",
  image: "image",
  text: "text",
  adjustable: "adjustable",
  imagebutton: "imagebutton",
  header: "header",
  summary: "summary",
  alert: "alert",
  checkbox: "checkbox",
  combobox: "combobox",
  menu: "menu",
  menubar: "menubar",
  menuitem: "menuitem",
  progressbar: "progressbar",
  radio: "radio",
  radiogroup: "radiogroup",
  scrollbar: "scrollbar",
  spinbutton: "spinbutton",
  switch: "switch",
  tab: "tab",
  tablist: "tablist",
  timer: "timer",
  toolbar: "toolbar",
};

// Helper to safely convert role to React Native AccessibilityRole
function toAccessibilityRole(
  role: string | undefined,
  fallback?: string,
): AccessibilityRoleValue {
  const value = role ?? fallback;
  if (value === undefined) {
    return undefined;
  }
  return VALID_ACCESSIBILITY_ROLES[value];
}

function H1({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: H1Props): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl",
          className,
        ),
      })}
    >
      {children}
    </StyledText>
  );
}

function H2({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: H2Props): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "border-b border-border pb-2 text-3xl text-foreground font-semibold tracking-tight first:mt-0",
          className,
        ),
      })}
    >
      {children}
    </StyledText>
  );
}

function H3({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: H3Props): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "text-2xl text-foreground font-semibold tracking-tight",
          className,
        ),
      })}
    >
      {children}
    </StyledText>
  );
}

function H4({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: H4Props): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "text-xl text-foreground font-semibold tracking-tight",
          className,
        ),
      })}
    >
      {children}
    </StyledText>
  );
}

function P({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: PProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn("text-base text-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}

function BlockQuote({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: BlockQuoteProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "mt-6 border-l-2 border-border pl-6 text-base text-foreground italic",
          className,
        ),
      })}
    >
      {children}
    </StyledText>
  );
}

function Code({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: CodeProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] text-sm text-foreground font-semibold",
          className,
        ),
      })}
    >
      {children}
    </StyledText>
  );
}

function Lead({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: LeadProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn("text-xl text-muted-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}

function Large({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: LargeProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn("text-xl text-foreground font-semibold", className),
      })}
    >
      {children}
    </StyledText>
  );
}

function Small({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: SmallProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "text-sm text-foreground font-medium leading-none",
          className,
        ),
      })}
    >
      {children}
    </StyledText>
  );
}

function Muted({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: MutedProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      accessibilityLabel={accessibilityLabel || ariaLabel}
      accessibilityRole={toAccessibilityRole(accessibilityRole, role)}
      accessible={true}
      testID={testID}
      {...applyStyleType({
        nativeStyle,
        className: cn("text-sm text-muted-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small };
