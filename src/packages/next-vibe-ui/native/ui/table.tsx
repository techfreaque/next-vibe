import * as TablePrimitive from "@rn-primitives/table";
import * as React from "react";
import type { ReactNode, CSSProperties } from "react";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

// Cross-platform base props for table components
export interface TableBaseProps {
  children?: ReactNode;
  className?: string;
}

export interface TableProps extends TableBaseProps {}

export interface TableHeaderProps extends TableBaseProps {}

export interface TableBodyProps extends TableBaseProps {
  style?: CSSProperties;
}

export interface TableFooterProps extends TableBaseProps {}

export interface TableRowProps extends TableBaseProps {
  onPress?: () => void;
}

export interface TableHeadProps extends TableBaseProps {
  style?: CSSProperties;
}

export interface TableCellProps extends TableBaseProps {
  style?: CSSProperties;
}

const Table = React.forwardRef<
  TablePrimitive.RootRef,
  TableProps
>(({ className, ...props }, ref) => (
  <TablePrimitive.Root
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className) as never}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  TablePrimitive.HeaderRef,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <TablePrimitive.Header
    ref={ref}
    className={cn("border-border [&_tr]:border-b", className) as never}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  TablePrimitive.BodyRef,
  TableBodyProps
>(({ className, style, ...props }, ref) => (
  <TablePrimitive.Body
    ref={ref}
    className={cn(
      "flex-1 border-border [&_tr:last-child]:border-0",
      className,
    ) as never}
    style={[{ minHeight: 2 }, style] as never}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  TablePrimitive.FooterRef,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <TablePrimitive.Footer
    ref={ref}
    className={cn("bg-muted/50 font-medium [&>tr]:last:border-b-0", className) as never}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  TablePrimitive.RowRef,
  TableRowProps
>(({ className, onPress, ...props }, ref) => (
  <TablePrimitive.Row
    ref={ref}
    className={cn(
      "flex-row border-border border-b web:transition-colors web:hover:bg-muted/50 web:data-[state=selected]:bg-muted",
      className,
    ) as never}
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
    <TablePrimitive.Head
      ref={ref}
      className={cn(
        "h-12 px-4 text-left justify-center font-medium [&:has([role=checkbox])]:pr-0",
        className,
      ) as never}
      style={style as never}
      {...props}
    />
  </TextClassContext.Provider>
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  TablePrimitive.CellRef,
  TableCellProps
>(({ className, style, ...props }, ref) => (
  <TablePrimitive.Cell
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className) as never}
    style={style as never}
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
