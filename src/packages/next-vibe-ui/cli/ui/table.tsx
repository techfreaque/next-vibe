import { Box, Text } from "ink";
import type { JSX } from "react";
import * as React from "react";

import type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeadProps,
  TableHeaderProps,
  TableProps,
  TableRowProps,
} from "../../web/ui/table";
import {
  parseClassesToBoxProps,
  parseClassesToTextProps,
} from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";
import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

// Re-export types from web version
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
} from "../../web/ui/table";

const SEPARATOR = "\u2500".repeat(60);
const CELL_DIVIDER = " | ";

export function Table({ className, children }: TableProps): JSX.Element {
  const boxProps = parseClassesToBoxProps(className);
  return (
    <Box flexDirection="column" {...boxProps}>
      {children}
    </Box>
  );
}
Table.displayName = "Table";

export function TableHeader({
  className,
  children,
}: TableHeaderProps): JSX.Element {
  const boxProps = parseClassesToBoxProps(className);
  return (
    <Box flexDirection="column" {...boxProps}>
      {children}
    </Box>
  );
}
TableHeader.displayName = "TableHeader";

export function TableBody({
  className,
  children,
}: TableBodyProps): JSX.Element {
  const boxProps = parseClassesToBoxProps(className);
  return (
    <Box flexDirection="column" {...boxProps}>
      {children}
    </Box>
  );
}
TableBody.displayName = "TableBody";

export function TableFooter({
  className,
  children,
}: TableFooterProps): JSX.Element {
  const boxProps = parseClassesToBoxProps(className);
  return (
    <Box flexDirection="column" {...boxProps}>
      {children}
    </Box>
  );
}
TableFooter.displayName = "TableFooter";

export function TableRow({
  className,
  children,
  onClick,
}: TableRowProps): JSX.Element {
  const isMcp = useIsMcp();
  const boxProps = parseClassesToBoxProps(className);
  void onClick; // not interactive in terminal

  if (isMcp) {
    const cells: React.ReactNode[] = [];
    React.Children.forEach(children, (child, i) => {
      if (i > 0) {
        cells.push(<Text key={`sep-${i}`}>{CELL_DIVIDER}</Text>);
      }
      cells.push(child);
    });
    return (
      <Box flexDirection="row" {...boxProps}>
        {cells}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box flexDirection="row" gap={2} {...boxProps}>
        {children}
      </Box>
      <Box>
        <Text dimColor>{SEPARATOR}</Text>
      </Box>
    </Box>
  );
}
TableRow.displayName = "TableRow";

export function TableHead({
  className,
  children,
  onClick,
  width,
}: TableHeadProps): JSX.Element {
  const textProps = parseClassesToTextProps(className);
  void onClick; // not interactive in terminal
  void width; // width handled by className in terminal
  return (
    <Text bold {...textProps}>
      {children}
    </Text>
  );
}
TableHead.displayName = "TableHead";

export function TableCell({
  className,
  children,
  colSpan,
}: TableCellProps): JSX.Element {
  const textProps = parseClassesToTextProps(className);
  void colSpan; // no column spanning in terminal
  return <Text {...textProps}>{children}</Text>;
}
TableCell.displayName = "TableCell";

export function TableCaption({
  className,
  children,
}: TableCaptionProps): JSX.Element {
  const textProps = parseClassesToTextProps(className);
  return (
    <Text dimColor {...textProps}>
      {children}
    </Text>
  );
}
TableCaption.displayName = "TableCaption";
