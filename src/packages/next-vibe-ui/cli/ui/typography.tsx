import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import {
  mergeTextProps,
  parseClassesToInkProps,
  parseClassesToTextProps,
  type InkTextProps,
} from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";
import type {
  BlockQuoteProps,
  CodeProps,
  H1Props,
  H2Props,
  H3Props,
  H4Props,
  LargeProps,
  LeadProps,
  MutedProps,
  PProps,
  SmallProps,
} from "../../web/ui/typography";

// ─── H1 ────────────────────────────────────────────────────────────────────

export function H1({ className, children }: H1Props): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { bold: true, underline: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return (
    <Box marginBottom={1}>
      <Text {...textProps}>{children}</Text>
    </Box>
  );
}

// ─── H2 ────────────────────────────────────────────────────────────────────

export function H2({ className, children }: H2Props): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { bold: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return (
    <Box marginBottom={1}>
      <Text {...textProps}>{children}</Text>
    </Box>
  );
}

// ─── H3 ────────────────────────────────────────────────────────────────────

export function H3({ className, children }: H3Props): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { bold: true, dimColor: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return (
    <Box marginBottom={1}>
      <Text {...textProps}>{children}</Text>
    </Box>
  );
}

// ─── H4 ────────────────────────────────────────────────────────────────────

export function H4({ className, children }: H4Props): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { dimColor: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return (
    <Box marginBottom={1}>
      <Text {...textProps}>{children}</Text>
    </Box>
  );
}

// ─── P ─────────────────────────────────────────────────────────────────────

export function P({ className, children }: PProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);
  const textProps = isMcp ? classTextProps : classTextProps;

  return (
    <Box marginBottom={1}>
      <Text {...textProps}>{children}</Text>
    </Box>
  );
}

// ─── BlockQuote ────────────────────────────────────────────────────────────

export function BlockQuote({
  className,
  children,
}: BlockQuoteProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { italic: true, dimColor: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return (
    <Box marginBottom={1} paddingLeft={2}>
      <Text {...textProps}>{children}</Text>
    </Box>
  );
}

// ─── Code ──────────────────────────────────────────────────────────────────

export function Code({ className, children }: CodeProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { color: "cyan" };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return <Text {...textProps}>{children}</Text>;
}

// ─── Lead ──────────────────────────────────────────────────────────────────

export function Lead({ className, children }: LeadProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { dimColor: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return (
    <Box marginBottom={1}>
      <Text {...textProps}>{children}</Text>
    </Box>
  );
}

// ─── Large ─────────────────────────────────────────────────────────────────

export function Large({ className, children }: LargeProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { bold: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return <Text {...textProps}>{children}</Text>;
}

// ─── Small ─────────────────────────────────────────────────────────────────

export function Small({ className, children }: SmallProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { dimColor: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return <Text {...textProps}>{children}</Text>;
}

// ─── Muted ─────────────────────────────────────────────────────────────────

export function Muted({ className, children }: MutedProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  const classTextProps = parseClassesToTextProps(className);

  const cliDefaults: InkTextProps = { dimColor: true };
  const textProps = isMcp
    ? classTextProps
    : mergeTextProps(cliDefaults, classTextProps);

  return <Text {...textProps}>{children}</Text>;
}
