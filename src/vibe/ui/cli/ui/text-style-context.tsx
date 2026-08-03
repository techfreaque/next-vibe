import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import * as React from "react";

import type { InkTextProps } from "./tailwind-to-ink";

/**
 * Text-style inheritance for the CLI primitives — the terminal's equivalent of
 * CSS inheritance.
 *
 * On web, `<div class="text-destructive">` colours its text descendants because
 * colour inherits. On the terminal a Div maps to an Ink `Box`, and a Box carries
 * NO text style, so the same class silently rendered uncoloured — one widget
 * source producing styled output on web and plain output on CLI.
 *
 * Div now publishes its parsed text style here; Span and the icons consume it
 * and merge their own classes on top. Nearest declaration wins, exactly like CSS.
 *
 * MCP is the deliberate exception: agents get plain text. Stripping style here
 * rather than in each widget is what keeps `isMcp ? "" : "text-red-500"`
 * ternaries out of widget code — the platform difference lives in the primitive,
 * per docs/patterns/widget.md.
 */

const TextStyleContext = React.createContext<InkTextProps>({});

/** Text style inherited from ancestor Divs/Spans. Empty at the root. */
export function useInheritedTextStyle(): InkTextProps {
  return React.useContext(TextStyleContext);
}

/**
 * Merge an element's own text style over what it inherited. Only keys the child
 * actually declares override; everything else keeps flowing down.
 */
export function mergeTextStyle(
  inherited: InkTextProps,
  own: InkTextProps,
): InkTextProps {
  return { ...inherited, ...own };
}

/**
 * The style to actually render with: inherited + own, or nothing at all on MCP.
 *
 * Returns a stable empty object on MCP so no chalk codes are emitted — an agent
 * parsing the output should never have to strip ANSI.
 */
export function useResolvedTextStyle(own: InkTextProps): InkTextProps {
  const inherited = useInheritedTextStyle();
  const isMcp = useIsMcp();
  return React.useMemo(
    () => (isMcp ? {} : mergeTextStyle(inherited, own)),
    [inherited, own, isMcp],
  );
}

/**
 * Publish a text style to descendants. Skips rendering a provider entirely when
 * the style adds nothing, so a plain layout Div costs no extra tree depth.
 */
export function TextStyleProvider({
  style,
  children,
}: {
  style: InkTextProps;
  children: React.ReactNode;
}): React.JSX.Element {
  const inherited = useInheritedTextStyle();
  const merged = React.useMemo(
    () => mergeTextStyle(inherited, style),
    [inherited, style],
  );

  if (Object.keys(style).length === 0) {
    return <>{children}</>;
  }

  return (
    <TextStyleContext.Provider value={merged}>
      {children}
    </TextStyleContext.Provider>
  );
}
