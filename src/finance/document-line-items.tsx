"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import {
  RecordTable,
  type RecordTableProps,
} from "next-vibe/ui/components/record-table";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { formatQuantity } from "next-vibe/unified-ui/_shared/format-money";
import { useWidgetLocale } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX, ReactNode } from "react";

interface DocumentLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  lineTotal: number;
}

export function DocumentLineItems({
  title,
  lines,
  labels,
  money,
  action,
}: {
  title: string;
  lines: DocumentLineItem[];
  labels: {
    description?: string;
    quantity: string;
    unitPrice: string;
    tax: string;
    total: string;
  };
  money: (amount: number) => string;
  action?: { label: string; render: (line: DocumentLineItem) => ReactNode };
}): JSX.Element {
  const locale = useWidgetLocale();
  const columns: RecordTableProps["columns"] = [
    { id: "description", label: labels.description ?? title },
    { id: "quantity", label: labels.quantity, numeric: true },
    { id: "unitPrice", label: labels.unitPrice, numeric: true },
    { id: "tax", label: labels.tax, numeric: true },
    { id: "total", label: labels.total, numeric: true },
    ...(action ? [{ id: "action", label: action.label }] : []),
  ];

  return (
    <SectionGroup title={title}>
      <RecordTable
        label={title}
        columns={columns}
        rows={lines.map((line) => {
          const description = (
            <Span className="font-medium [overflow-wrap:anywhere]">
              {line.description}
            </Span>
          );
          const total = (
            <Span className="font-medium">{money(line.lineTotal)}</Span>
          );
          return {
            id: line.id,
            cells: {
              description,
              quantity: formatQuantity(line.quantity, locale),
              unitPrice: money(line.unitPrice),
              tax: money(line.taxAmount),
              total,
              action: action?.render(line),
            },
          };
        })}
        compact={
          <Div className="flex min-w-0 flex-col gap-2">
            {lines.map((line) => (
              <Div
                key={line.id}
                className="flex min-w-0 flex-col gap-2 rounded-md border p-3"
              >
                <P className="text-sm font-medium [overflow-wrap:anywhere]">
                  {line.description}
                </P>
                <DetailGrid className="grid-cols-2">
                  <DetailField
                    label={labels.quantity}
                    value={formatQuantity(line.quantity, locale)}
                  />
                  <DetailField
                    label={labels.unitPrice}
                    value={money(line.unitPrice)}
                  />
                  <DetailField
                    label={labels.tax}
                    value={money(line.taxAmount)}
                  />
                  <DetailField
                    label={labels.total}
                    value={money(line.lineTotal)}
                  />
                </DetailGrid>
                {action?.render(line)}
              </Div>
            ))}
          </Div>
        }
      />
    </SectionGroup>
  );
}
