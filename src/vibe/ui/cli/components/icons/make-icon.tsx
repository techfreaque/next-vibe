import { Text } from "ink";
import type { JSX } from "react";

import type { IconComponent } from "../../../web/lib/helper";
import { useResolvedTextStyle } from "../text-style-context";

/**
 * Build a CLI icon component from its terminal glyph.
 *
 * Every CLI icon is the same shape — an Ink `<Text>` wrapping one symbol — so
 * they share this factory rather than repeating it in ~330 files.
 *
 * The glyph inherits the surrounding text style, the way an inline `<svg>` picks
 * up `currentColor` on web: an icon inside `<Div className="text-destructive">`
 * comes out red on both surfaces. On MCP it renders unstyled.
 */
export function makeCliIcon(symbol: string): IconComponent {
  return function CliIcon(): JSX.Element {
    const style = useResolvedTextStyle({});
    return <Text {...style}>{symbol}</Text>;
  };
}
