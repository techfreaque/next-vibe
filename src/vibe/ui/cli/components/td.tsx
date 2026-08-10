import { Text } from "ink";
import type { JSX } from "react";

import type { TdProps } from "../../web/components/td";
import { parseClassesToTextProps } from "./tailwind-to-ink";

export type { TdProps } from "../../web/components/td";

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
