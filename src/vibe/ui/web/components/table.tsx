import type { ReactNode } from "react";
import * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";
import type { DivKeyboardEvent } from "./div";

// Table
export type TableProps = {
  children?: ReactNode;
  scrollLabel?: string;
} & StyleType;

export function Table({
  className,
  scrollLabel,
  ...props
}: TableProps): React.JSX.Element {
  return (
    <div
      className="relative w-full min-w-0 max-w-full overflow-x-auto focus-visible:outline focus-visible:outline-ring"
      tabIndex={scrollLabel ? 0 : undefined}
      role={scrollLabel ? "region" : undefined}
      aria-label={scrollLabel}
    >
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
  // Only attach interactive handlers when the row is actually interactive.
  // A static (non-clickable) row must render as plain markup with NO function
  // props: in the production RSC build, a server component that renders a row
  // with a function prop (e.g. a blog post using <Table>) throws
  // "Event handlers cannot be passed to Client Component props" and 500s the
  // page. Static rows therefore carry no onClick/onKeyDown/role/tabIndex.
  const isInteractive = Boolean(onClick) || Boolean(onKeyDown);
  const interactiveProps = isInteractive
    ? {
        onClick: onClick
          ? (event: React.MouseEvent<HTMLTableRowElement>): void => {
              const action =
                event.target instanceof Element
                  ? event.target.closest(
                      "button, a, input, select, textarea, [role=button], [role=link], [role=checkbox]",
                    )
                  : null;
              if (
                !action ||
                action === event.currentTarget ||
                !event.currentTarget.contains(action)
              ) {
                onClick();
              }
            }
          : undefined,
        onKeyDown: (event: React.KeyboardEvent<HTMLTableRowElement>): void => {
          if (event.target !== event.currentTarget) {
            return;
          }
          onKeyDown?.(event);
          if (
            onClick &&
            !event.defaultPrevented &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            onClick();
          }
        },
        role: role ?? (onClick ? "button" : undefined),
        tabIndex: tabIndex ?? (onClick ? 0 : undefined),
      }
    : {};
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-accent data-[state=selected]:bg-muted",
        onClick &&
          "cursor-pointer focus-visible:outline focus-visible:outline-ring focus-visible:-outline-offset-2",
        className,
      )}
      {...interactiveProps}
      {...props}
    />
  );
}
TableRow.displayName = "TableRow";

interface TableHeadKeyboardEvent {
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
