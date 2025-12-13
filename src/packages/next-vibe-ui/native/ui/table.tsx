import * as TablePrimitive from "@rn-primitives/table";
import { styled } from "nativewind";
import * as React from "react";
import type { ViewStyle } from "react-native";
import { View as RNView, Text as RNText, Pressable } from "react-native";

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
  // Extract web-only props to prevent passing to native primitives
  onKeyDown,
  role,
  tabIndex,
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
      accessibilityRole={role as "button" | "link" | "none" | undefined}
      accessible={tabIndex !== undefined ? tabIndex >= 0 : undefined}
      onAccessibilityAction={
        onKeyDown
          ? (event): void => {
              if (event.nativeEvent.actionName === "activate") {
                onKeyDown({
                  key: "Enter",
                  preventDefault: (): void => {
                    return undefined;
                  },
                  stopPropagation: (): void => {
                    return undefined;
                  },
                } as Parameters<typeof onKeyDown>[0]);
              }
            }
          : undefined
      }
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
  children,
  // Extract web-only props for native handling
  onClick,
  onKeyDown,
  role,
  tabIndex,
  "aria-sort": ariaSort,
  ...props
}: TableHeadProps): React.JSX.Element {
  const computedStyle: ViewStyle = {
    ...(style ? convertCSSToViewStyle(style) : {}),
    ...(width !== undefined
      ? { width: typeof width === "number" ? width : undefined }
      : {}),
  };

  const isInteractive = onClick || onKeyDown;

  const headContent = (
    <StyledTableHead
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      style={computedStyle}
      accessibilityRole={role as "header" | "none" | undefined}
      accessible={tabIndex !== undefined ? tabIndex >= 0 : undefined}
      accessibilityValue={ariaSort ? { text: ariaSort } : undefined}
      {...props}
    >
      {renderTableCellChildren(children)}
    </StyledTableHead>
  );

  if (isInteractive) {
    return (
      <TextClassContext.Provider value="text-muted-foreground">
        <Pressable
          onPress={onClick}
          accessibilityRole={role as "button" | "link" | "none" | undefined}
          accessible={tabIndex !== undefined ? tabIndex >= 0 : undefined}
          accessibilityValue={ariaSort ? { text: ariaSort } : undefined}
          onAccessibilityAction={
            onKeyDown
              ? (event): void => {
                  if (event.nativeEvent.actionName === "activate") {
                    onKeyDown({
                      key: "Enter",
                      preventDefault: (): void => {
                        return undefined;
                      },
                      stopPropagation: (): void => {
                        return undefined;
                      },
                    } as Parameters<typeof onKeyDown>[0]);
                  }
                }
              : undefined
          }
        >
          {headContent}
        </Pressable>
      </TextClassContext.Provider>
    );
  }

  return (
    <TextClassContext.Provider value="text-muted-foreground">
      {headContent}
    </TextClassContext.Provider>
  );
}
TableHead.displayName = "TableHead";

function TableCell({
  className,
  style,
  children,
  ...props
}: TableCellProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

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
