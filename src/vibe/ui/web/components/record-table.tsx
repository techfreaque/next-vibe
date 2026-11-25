import { Fragment, type JSX, type ReactNode } from "react";

import { Div } from "./div";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export interface RecordTableProps {
  label: string;
  columns: readonly { id: string; label: string; numeric?: boolean }[];
  rows: readonly {
    id: string;
    cells: Readonly<Record<string, ReactNode>>;
    onOpen?: () => void;
    expanded?: ReactNode;
  }[];
  footer?: Readonly<Record<string, ReactNode>>;
  footerRows?: readonly {
    id: string;
    cells: Readonly<Record<string, ReactNode>>;
  }[];
  compact: ReactNode;
}

export function RecordTable({
  label,
  columns,
  rows,
  footer,
  footerRows,
  compact,
}: RecordTableProps): JSX.Element {
  const totals = footerRows ?? (footer ? [{ id: "total", cells: footer }] : []);
  return (
    <>
      <Div className="hidden min-w-0 rounded-lg border bg-card @lg:block">
        <Table scrollLabel={label}>
          <TableHeader className="bg-muted/30">
            <TableRow>
              {columns.map(({ id, label: columnLabel, numeric }) => (
                <TableHead
                  key={id}
                  className={
                    numeric
                      ? "whitespace-nowrap text-right"
                      : "whitespace-nowrap"
                  }
                >
                  {columnLabel}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow onClick={row.onOpen} className="h-10">
                  {columns.map(({ id, numeric }) => (
                    <TableCell
                      key={id}
                      className={
                        numeric
                          ? "whitespace-nowrap text-right tabular-nums"
                          : undefined
                      }
                    >
                      {row.cells[id]}
                    </TableCell>
                  ))}
                </TableRow>
                {row.expanded && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="bg-muted/20 p-3"
                    >
                      {row.expanded}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
          {totals.length > 0 && (
            <TableFooter>
              {totals.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={
                        column.numeric
                          ? "whitespace-nowrap text-right tabular-nums"
                          : undefined
                      }
                    >
                      {row.cells[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>
      </Div>
      <Div className="@lg:hidden">{compact}</Div>
    </>
  );
}
