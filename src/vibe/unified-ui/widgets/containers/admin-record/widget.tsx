"use client";

import { Div } from "next-vibe/ui/components/div";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import type { JSX, ReactNode } from "react";

import {
  AdminRecordDetail,
  type AdminRecordDetailProps,
} from "../../../_shared/admin-record-detail";
import { cn } from "../../../_shared/cn";

interface RecordSection {
  title: string;
  content: ReactNode;
}

interface AdminRecordProps extends Omit<AdminRecordDetailProps, "children"> {
  metrics?: readonly { label: string; value: number | string }[];
  details: RecordSection;
  related?: RecordSection;
}

export function AdminRecord({
  metrics,
  details,
  related,
  ...header
}: AdminRecordProps): JSX.Element {
  return (
    <AdminRecordDetail {...header}>
      {!!metrics?.length && (
        <MetricGrid columns={metrics.length === 2 ? 2 : 3}>
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </MetricGrid>
      )}
      <Div
        className={cn(
          "grid min-w-0 items-start gap-4",
          related && "@3xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
        )}
      >
        <SectionGroup title={details.title}>{details.content}</SectionGroup>
        {related && (
          <SectionGroup title={related.title}>{related.content}</SectionGroup>
        )}
      </Div>
    </AdminRecordDetail>
  );
}
