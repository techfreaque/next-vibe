import * as TablePrimitive from "@rn-primitives/table";
import { styled } from "nativewind";
import * as React from "react";
import type { ViewStyle } from "react-native";
import { View as RNView, Text as RNText } from "react-native";

// MUST import ALL props interfaces from web version (NO local type definitions)
import type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
} from "@/packages/next-vibe-ui/web/ui/table";

import { cn } from "next-vibe/shared/utils/utils";
import { TextClassContext } from "./text";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

const StyledTableRoot = styled(TablePrimitive.Root, { className: "style" });
const StyledTableHeader = styled(TablePrimitive.Header, { className: "style" });
const StyledTableBody = styled(TablePrimitive.Body, { className: "style" });
const StyledTableFooter = styled(TablePrimitive.Footer, { className: "style" });
const StyledTableRow = styled(TablePrimitive.Row, { className: "style" });
const StyledTableHead = styled(TablePrimitive.Head, { className: "style" });
const StyledTableCell = styled(TablePrimitive.Cell, { className: "style" });

// Wrapper view for table container (mimics web's div wrapper)
const StyledView = styled(RNView, { className: "style" });

// Helper to wrap text strings in Text component for React Native
function renderTableCellChildren(content: React.ReactNode): React.ReactNode {
  if (typeof content === "string" || typeof content === "number") {
    return <RNText>{content}</RNText>;
  }
  return content;
}

function Table({
  className,
  style,
  children,
  ...props
}: TableProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <StyledView className="relative w-full overflow-auto">
      <StyledTableRoot
        {...applyStyleType({
          nativeStyle,
          className: cn("w-full caption-bottom text-sm", className),
        })}
        {...props}
      >
        {children}
      </StyledTableRoot>
    </StyledView>
  );
}
Table.displayName = "Table";

function TableHeader({
  className,
  style,
  children,
  ...props
}: TableHeaderProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <StyledTableHeader
      {...applyStyleType({
        nativeStyle,
        className: cn("[&_tr]:border-b", className),
      })}
      {...props}
    >
      {children}
    </StyledTableHeader>
  );
}
TableHeader.displayName = "TableHeader";

function TableBody({
  className,
  style,
  children,
  ...props
}: TableBodyProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <StyledTableBody
      {...applyStyleType({
        nativeStyle,
        className: cn("[&_tr:last-child]:border-0", className),
      })}
      {...props}
    >
      {children}
    </StyledTableBody>
  );
}
TableBody.displayName = "TableBody";

function TableFooter({
  className,
  style,
  children,
  ...props
}: TableFooterProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <StyledTableFooter
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "border-t bg-accent font-medium [&>tr]:last:border-b-0",
          className,
        ),
      })}
      {...props}
    >
      {children}
    </StyledTableFooter>
  );
}
TableFooter.displayName = "TableFooter";

function TableRow({
  className,
  style,
  children,
  onClick,
  onKeyDown: _onKeyDown, // Native doesn't support keyboard events
  role: _role, // Native doesn't support ARIA role
  tabIndex: _tabIndex, // Native doesn't support tabIndex
  ...props
}: TableRowProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <StyledTableRow
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "border-b transition-colors hover:bg-accent data-[state=selected]:bg-muted",
          onClick && "cursor-pointer",
          className,
        ),
      })}
      onPress={onClick}
      {...props}
    >
      {children}
    </StyledTableRow>
  );
}
TableRow.displayName = "TableRow";

function TableHead({
  className,
  style,
  width,
  onClick: _onClick,
  onKeyDown: _onKeyDown,
  role: _role,
  tabIndex: _tabIndex,
  children,
  "aria-sort": _ariaSort,
  ...props
}: TableHeadProps): React.JSX.Element {
  const computedStyle: ViewStyle = {
    ...(style ? convertCSSToViewStyle(style) : {}),
    ...(width !== undefined
      ? { width: typeof width === "number" ? width : undefined }
      : {}),
  };

  // Note: onClick, onKeyDown, role, tabIndex, and aria-sort are not supported in React Native
  // They're accepted in the interface for cross-platform compatibility but not used

  return (
    <TextClassContext.Provider value="text-muted-foreground">
      <StyledTableHead
        className={cn(
          "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className,
        )}
        style={computedStyle}
        {...props}
      >
        {renderTableCellChildren(children)}
      </StyledTableHead>
    </TextClassContext.Provider>
  );
}
TableHead.displayName = "TableHead";

function TableCell({
  className,
  style,
  children,
  colSpan: _colSpan,
  ...props
}: TableCellProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  // Note: colSpan is not supported in React Native table primitives
  // It's accepted in the interface for cross-platform compatibility but not used

  return (
    <StyledTableCell
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className,
        ),
      })}
      {...props}
    >
      {renderTableCellChildren(children)}
    </StyledTableCell>
  );
}
TableCell.displayName = "TableCell";

function TableCaption({
  className,
  style,
  children,
}: TableCaptionProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <RNText
      {...applyStyleType({
        nativeStyle,
        className: cn("mt-4 text-sm text-muted-foreground", className),
      })}
    >
      {children}
    </RNText>
  );
}
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
