import { cn } from "next-vibe/shared/utils/utils";
import type { ReactNode } from "react";
import * as React from "react";
import type { CSSProperties } from "react";

// Cross-platform base props for table components
export interface TableBaseProps {
  children?: ReactNode;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TableProps extends TableBaseProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TableHeaderProps extends TableBaseProps {}

export interface TableBodyProps extends TableBaseProps {
  style?: CSSProperties;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TableCaptionProps extends TableBaseProps {}

function Table({
  className,
  ...props
}: TableProps & React.HTMLAttributes<HTMLTableElement>): React.JSX.Element {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}
Table.displayName = "Table";

function TableHeader({
  className,
  ...props
}: TableHeaderProps & React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}
TableHeader.displayName = "TableHeader";

function TableBody({
  className,
  ...props
}: TableBodyProps & React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}
TableBody.displayName = "TableBody";

function TableFooter({
  className,
  ...props
}: TableFooterProps & React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return (
    <tfoot
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}
TableFooter.displayName = "TableFooter";

function TableRow({
  className,
  onPress,
  ...props
}: TableRowProps & React.HTMLAttributes<HTMLTableRowElement>): React.JSX.Element {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        onPress && "cursor-pointer",
        className,
      )}
      onClick={onPress}
      onKeyDown={(e) => {
        if (onPress && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onPress();
        }
      }}
      role={onPress ? "button" : undefined}
      tabIndex={onPress ? 0 : undefined}
      {...props}
    />
  );
}
TableRow.displayName = "TableRow";

function TableHead({
  className,
  ...props
}: TableHeadProps & React.ThHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return (
    <th
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}
TableHead.displayName = "TableHead";

function TableCell({
  className,
  ...props
}: TableCellProps & React.TdHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return (
    <td
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}
TableCell.displayName = "TableCell";

function TableCaption({
  className,
  ...props
}: TableCaptionProps & React.HTMLAttributes<HTMLTableCaptionElement>): React.JSX.Element {
  return (
    <caption
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
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
