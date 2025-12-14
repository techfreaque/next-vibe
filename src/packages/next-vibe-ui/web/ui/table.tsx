import { cn } from "next-vibe/shared/utils/utils";
import type { ReactNode } from "react";
import * as React from "react";

import type { StyleType } from "../utils/style-type";
import type { DivKeyboardEvent } from "./div";

// Table
export type TableProps = {
  children?: ReactNode;
} & StyleType;

export function Table({ className, ...props }: TableProps): React.JSX.Element {
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

// TableHeader
export type TableHeaderProps = {
  children?: ReactNode;
} & StyleType;

export function TableHeader({
  className,
  ...props
}: TableHeaderProps): React.JSX.Element {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}
TableHeader.displayName = "TableHeader";

// TableBody
export type TableBodyProps = {
  children?: ReactNode;
} & StyleType;

export function TableBody({
  className,
  ...props
}: TableBodyProps): React.JSX.Element {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}
TableBody.displayName = "TableBody";

// TableFooter
export type TableFooterProps = {
  children?: ReactNode;
} & StyleType;

export function TableFooter({
  className,
  ...props
}: TableFooterProps): React.JSX.Element {
  return (
    <tfoot
      className={cn(
        "border-t bg-accent font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}
TableFooter.displayName = "TableFooter";

// TableRow
export type TableRowProps = {
  children?: ReactNode;
  onClick?: () => void;
  onKeyDown?: (e: DivKeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
} & StyleType;

export function TableRow({
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: TableRowProps): React.JSX.Element {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-accent data-[state=selected]:bg-muted",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onKeyDown) {
          onKeyDown(e);
        }
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      role={role ?? (onClick ? "button" : undefined)}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      {...props}
    />
  );
}
TableRow.displayName = "TableRow";

export interface TableHeadKeyboardEvent {
  key: string;
  preventDefault: () => void;
  stopPropagation: () => void;
}

// TableHead
export type TableHeadProps = {
  children?: ReactNode;
  width?: string | number;
  onClick?: () => void;
  onKeyDown?: (e: TableHeadKeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
  "aria-sort"?: "ascending" | "descending" | "none" | "other";
} & StyleType;

export function TableHead({
  className,
  width,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: TableHeadProps): React.JSX.Element {
  return (
    <th
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        onClick && "cursor-pointer",
        className,
      )}
      style={{ width }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      {...props}
    />
  );
}
TableHead.displayName = "TableHead";

export type TableCellProps = {
  children?: ReactNode;
  colSpan?: number;
} & StyleType;

export function TableCell({
  className,
  colSpan,
  ...props
}: TableCellProps): React.JSX.Element {
  return (
    <td
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      colSpan={colSpan}
      {...props}
    />
  );
}
TableCell.displayName = "TableCell";

// TableCaption
export type TableCaptionProps = {
  children?: ReactNode;
} & StyleType;

export function TableCaption({
  className,
  ...props
}: TableCaptionProps): React.JSX.Element {
  return (
    <caption
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
TableCaption.displayName = "TableCaption";
