import * as TablePrimitive from "@rn-primitives/table";
import * as React from "react";
import type { StyleProp, ViewStyle } from "react-native";

// Import cross-platform types from web (source of truth)
import type {
  TableBaseProps,
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
} from "next-vibe-ui/ui/table";

import type { WithClassName } from "../lib/types";
import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

// Type-safe wrappers for primitives
const StyledTableRoot = TablePrimitive.Root as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TablePrimitive.Root>> &
    React.RefAttributes<React.ElementRef<typeof TablePrimitive.Root>>
>;
const StyledTableHeader = TablePrimitive.Header as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TablePrimitive.Header>> &
    React.RefAttributes<React.ElementRef<typeof TablePrimitive.Header>>
>;
const StyledTableBody = TablePrimitive.Body as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TablePrimitive.Body>> &
    React.RefAttributes<React.ElementRef<typeof TablePrimitive.Body>>
>;
const StyledTableFooter = TablePrimitive.Footer as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TablePrimitive.Footer>> &
    React.RefAttributes<React.ElementRef<typeof TablePrimitive.Footer>>
>;
const StyledTableRow = TablePrimitive.Row as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TablePrimitive.Row>> &
    React.RefAttributes<React.ElementRef<typeof TablePrimitive.Row>>
>;
const StyledTableHead = TablePrimitive.Head as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TablePrimitive.Head>> &
    React.RefAttributes<React.ElementRef<typeof TablePrimitive.Head>>
>;
const StyledTableCell = TablePrimitive.Cell as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof TablePrimitive.Cell>> &
    React.RefAttributes<React.ElementRef<typeof TablePrimitive.Cell>>
>;

const Table = React.forwardRef<
  TablePrimitive.RootRef,
  TableProps
>(({ className, ...props }, ref) => (
  <StyledTableRoot
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  TablePrimitive.HeaderRef,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <StyledTableHeader
    ref={ref}
    className={cn("border-border [&_tr]:border-b", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  TablePrimitive.BodyRef,
  TableBodyProps
>(({ className, style, ...props }, ref) => (
  <StyledTableBody
    ref={ref}
    className={cn(
      "flex-1 border-border [&_tr:last-child]:border-0",
      className,
    )}
    style={[{ minHeight: 2 }, style] as StyleProp<ViewStyle>}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  TablePrimitive.FooterRef,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <StyledTableFooter
    ref={ref}
    className={cn("bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  TablePrimitive.RowRef,
  TableRowProps
>(({ className, onPress, ...props }, ref) => (
  <StyledTableRow
    ref={ref}
    className={cn(
      "flex-row border-border border-b web:transition-colors web:hover:bg-muted/50 web:data-[state=selected]:bg-muted",
      className,
    )}
    onPress={onPress}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  TablePrimitive.HeadRef,
  TableHeadProps
>(({ className, style, ...props }, ref) => (
  <TextClassContext.Provider value="text-muted-foreground">
    <StyledTableHead
      ref={ref}
      className={cn(
        "h-12 px-4 text-left justify-center font-medium [&:has([role=checkbox])]:pr-0",
        className,
      )}
      style={style as StyleProp<ViewStyle>}
      {...props}
    />
  </TextClassContext.Provider>
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  TablePrimitive.CellRef,
  TableCellProps
>(({ className, style, ...props }, ref) => (
  <StyledTableCell
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    style={style as StyleProp<ViewStyle>}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
