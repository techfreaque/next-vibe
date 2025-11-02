import * as TablePrimitive from "@rn-primitives/table";
import { styled } from "nativewind";
import * as React from "react";
import type { StyleProp, ViewStyle } from "react-native";

import type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
} from "next-vibe-ui/ui/table";

import { cn } from "next-vibe/shared/utils/utils";
import { TextClassContext } from "./text";

const StyledTableRoot = styled(TablePrimitive.Root);
const StyledTableHeader = styled(TablePrimitive.Header);
const StyledTableBody = styled(TablePrimitive.Body);
const StyledTableFooter = styled(TablePrimitive.Footer);
const StyledTableRow = styled(TablePrimitive.Row);
const StyledTableHead = styled(TablePrimitive.Head);
const StyledTableCell = styled(TablePrimitive.Cell);

function Table({ className, ...props }: TableProps): React.JSX.Element {
  return (
    <StyledTableRoot
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  );
}
Table.displayName = "Table";

function TableHeader({ className, ...props }: TableHeaderProps): React.JSX.Element {
  return (
    <StyledTableHeader
      className={cn("border-border [&_tr]:border-b", className)}
      {...props}
    />
  );
}
TableHeader.displayName = "TableHeader";

function TableBody({ className, style, ...props }: TableBodyProps): React.JSX.Element {
  return (
    <StyledTableBody
      className={cn(
        "flex-1 border-border [&_tr:last-child]:border-0",
        className,
      )}
      style={[{ minHeight: 2 }, style] as StyleProp<ViewStyle>}
      {...props}
    />
  );
}
TableBody.displayName = "TableBody";

function TableFooter({ className, ...props }: TableFooterProps): React.JSX.Element {
  return (
    <StyledTableFooter
      className={cn("bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  );
}
TableFooter.displayName = "TableFooter";

function TableRow({ className, onPress, ...props }: TableRowProps): React.JSX.Element {
  return (
    <StyledTableRow
      className={cn(
        "flex-row border-border border-b web:transition-colors web:hover:bg-muted/50 web:data-[state=selected]:bg-muted",
        className,
      )}
      onPress={onPress}
      {...props}
    />
  );
}
TableRow.displayName = "TableRow";

function TableHead({ className, style, ...props }: TableHeadProps): React.JSX.Element {
  return (
    <TextClassContext.Provider value="text-muted-foreground">
      <StyledTableHead
        className={cn(
          "h-12 px-4 text-left justify-center font-medium [&:has([role=checkbox])]:pr-0",
          className,
        )}
        style={style as StyleProp<ViewStyle>}
        {...props}
      />
    </TextClassContext.Provider>
  );
}
TableHead.displayName = "TableHead";

function TableCell({ className, style, ...props }: TableCellProps): React.JSX.Element {
  return (
    <StyledTableCell
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      style={style as StyleProp<ViewStyle>}
      {...props}
    />
  );
}
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
