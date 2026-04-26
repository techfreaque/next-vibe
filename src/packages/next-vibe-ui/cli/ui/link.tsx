import * as React from "react";
import { Text } from "ink";
import terminalLink from "terminal-link";

import type { ExternalLinkProps, LinkProps } from "../../web/ui/link";
import { useCliPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

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
 * - MCP: plain text `{children}: {href}` — no decoration, AI-parseable
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
 * Identical behaviour to Link — external URLs use a plain string href.
 */
export function ExternalLink({
  children,
  href,
}: ExternalLinkProps): React.JSX.Element {
  const surface = useCliPlatform();
  const label = renderChildren(children);

  if (surface === "mcp") {
    return (
      <Text>
        {label}: {href}
      </Text>
    );
  }

  if (process.stdout.isTTY) {
    const linked = terminalLink(label, href);
    return (
      <Text color="cyan" underline>
        {linked}
      </Text>
    );
  }

  return (
    <Text color="cyan">
      {label} ({href})
    </Text>
  );
}

ExternalLink.displayName = "ExternalLink";
