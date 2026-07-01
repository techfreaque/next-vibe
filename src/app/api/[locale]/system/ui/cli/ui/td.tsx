import { Text } from "ink";
import { parseClassesToTextProps } from "next-vibe/ui/cli/utils/tailwind-to-ink";
import type { TdProps } from "next-vibe/ui/web/ui/td";
import type { JSX } from "react";

export type { TdProps } from "next-vibe/ui/web/ui/td";

export function Td({
  className,
  children,
  colSpan,
  rowSpan,
}: TdProps): JSX.Element {
  const textProps = parseClassesToTextProps(className);
  void colSpan; // no column spanning in terminal
  void rowSpan; // no row spanning in terminal
  return <Text {...textProps}>{children}</Text>;
}
