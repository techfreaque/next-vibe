import { Text } from "ink";
import * as React from "react";
import terminalLink from "terminal-link";

import { useCliPlatform } from "../../../unified-ui/_shared/use-widget-context";
import type { ExternalLinkProps, LinkProps } from "../../web/ui/link";
import { parseClassesToInkProps } from "./tailwind-to-ink";

function renderChildren(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(renderChildren).join("");
  }
  return "";
}

/**
 * Link component for CLI/MCP contexts.
 *
 * - MCP: plain text `{children}: {href}` - no decoration, AI-parseable
 * - CLI TTY: terminal hyperlink via terminal-link (OSC 8 sequence) with cyan underline
 * - CLI non-TTY: `{children} ({href})` in cyan
 */
export function Link<RouteType extends string>({
  children,
  href,
}: LinkProps<RouteType>): React.JSX.Element {
  const surface = useCliPlatform();
  const label = renderChildren(children);
  const url = href as string;

  if (surface === "mcp") {
    return (
      <Text>
        {label}: {url}
      </Text>
    );
  }

  if (process.stdout.isTTY) {
    const linked = terminalLink(label, url);
    return (
      <Text color="cyan" underline>
        {linked}
      </Text>
    );
  }

  return (
    <Text color="cyan">
      {label} ({url})
    </Text>
  );
}

Link.displayName = "Link";

/**
 * ExternalLink component for CLI/MCP contexts.
 * Identical behaviour to Link - external URLs use a plain string href.
 */
export function ExternalLink({
  children,
  href,
  className,
  unlinkedLabel,
}: ExternalLinkProps): React.JSX.Element {
  const surface = useCliPlatform();
  const label = renderChildren(children);
  // className wins over the cyan/underline default, exactly as it does on web —
  // a caller styling its links (e.g. plain blue file positions) must not have to
  // stop using the primitive to get there.
  const { text } = parseClassesToInkProps(className);

  if (surface === "mcp") {
    return unlinkedLabel === undefined ? (
      <Text>
        {label}: {href}
      </Text>
    ) : (
      <Text>{unlinkedLabel}</Text>
    );
  }

  if (process.stdout.isTTY) {
    const linked = terminalLink(
      label,
      href,
      unlinkedLabel === undefined
        ? {}
        : { fallback: (): string => unlinkedLabel },
    );
    return (
      <Text color="cyan" underline {...text}>
        {linked}
      </Text>
    );
  }

  // No TTY: a bare label with the raw href appended is the only way to stay
  // useful, unless the caller supplied a self-describing label.
  return unlinkedLabel === undefined ? (
    <Text color="cyan" {...text}>
      {label} ({href})
    </Text>
  ) : (
    <Text color="cyan" {...text}>
      {unlinkedLabel}
    </Text>
  );
}

ExternalLink.displayName = "ExternalLink";
