"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

export function DocumentLineItems({
  title,
  lines,
  labels,
  money,
}: {
  title: string;
  lines: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    lineTotal: number;
  }[];
  labels: { quantity: string; unitPrice: string; tax: string; total: string };
  money: (amount: number) => string;
}): JSX.Element {
  return (
    <SectionGroup title={title}>
      <Div className="flex min-w-0 flex-col gap-2">
        {lines.map((line) => (
          <Div
            key={line.id}
            className="flex min-w-0 flex-col gap-2 rounded-md border p-3"
          >
            <P className="text-sm font-medium [overflow-wrap:anywhere]">
              {line.description}
            </P>
            <DetailGrid className="grid-cols-2 @md:grid-cols-4">
              <DetailField label={labels.quantity} value={line.quantity} />
              <DetailField
                label={labels.unitPrice}
                value={money(line.unitPrice)}
              />
              <DetailField label={labels.tax} value={money(line.taxAmount)} />
              <DetailField label={labels.total} value={money(line.lineTotal)} />
            </DetailGrid>
          </Div>
        ))}
      </Div>
    </SectionGroup>
  );
}
