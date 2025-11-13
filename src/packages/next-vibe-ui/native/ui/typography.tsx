// oxlint-disable prefer-tag-over-role
import * as React from "react";
import { Text as RNText } from "react-native";
import { styled } from "nativewind";

import { cn } from "../lib/utils";

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
} from "../../web/ui/typography";

const StyledText = styled(RNText, { className: "style" });

function H1({ className, ...props }: H1Props): React.JSX.Element {
  return (
    <StyledText
      className={cn(
        "text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl",
        className,
      )}
      {...props}
    />
  );
}

function H2({ className, ...props }: H2Props): React.JSX.Element {
  return (
    <StyledText
      className={cn(
        "border-b border-border pb-2 text-3xl text-foreground font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  );
}

function H3({ className, ...props }: H3Props): React.JSX.Element {
  return (
    <StyledText
      className={cn(
        "text-2xl text-foreground font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function H4({ className, ...props }: H4Props): React.JSX.Element {
  return (
    <StyledText
      className={cn(
        "text-xl text-foreground font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function P({ className, ...props }: PProps): React.JSX.Element {
  return (
    <StyledText
      className={cn("text-base text-foreground", className)}
      {...props}
    />
  );
}

function BlockQuote({
  className,
  ...props
}: BlockQuoteProps): React.JSX.Element {
  return (
    <StyledText
      className={cn(
        "mt-6 border-l-2 border-border pl-6 text-base text-foreground italic",
        className,
      )}
      {...props}
    />
  );
}

function Code({ className, ...props }: CodeProps): React.JSX.Element {
  return (
    <StyledText
      className={cn(
        "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] text-sm text-foreground font-semibold",
        className,
      )}
      {...props}
    />
  );
}

function Lead({ className, ...props }: LeadProps): React.JSX.Element {
  return (
    <StyledText
      className={cn("text-xl text-muted-foreground", className)}
      {...props}
    />
  );
}

function Large({ className, ...props }: LargeProps): React.JSX.Element {
  return (
    <StyledText
      className={cn("text-xl text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function Small({ className, ...props }: SmallProps): React.JSX.Element {
  return (
    <StyledText
      className={cn(
        "text-sm text-foreground font-medium leading-none",
        className,
      )}
      {...props}
    />
  );
}

function Muted({ className, ...props }: MutedProps): React.JSX.Element {
  return (
    <StyledText
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small };
