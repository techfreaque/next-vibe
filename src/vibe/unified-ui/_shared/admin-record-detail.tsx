"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import {
  EmptyBlock,
  type EmptyBlockAction,
} from "next-vibe/ui/components/empty-block";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import {
  StatusPill,
  type StatusPillProps,
} from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX, ReactNode } from "react";

export type AdminRecordDetailState =
  | { kind: "ready" }
  | { kind: "loading"; label: string }
  | {
      kind: "empty" | "error";
      title: string;
      message?: string;
      icon?: ReactNode;
      action?: EmptyBlockAction;
    };

export interface AdminRecordDetailProps {
  title: string;
  subtitle?: string;
  titleAccessory?: ReactNode;
  status?: StatusPillProps;
  breadcrumb?: ReactNode;
  backButton?: ReactNode;
  actions?: ReactNode;
  border?: boolean;
  facts?: readonly { key: string; label: string; value?: ReactNode }[];
  state?: AdminRecordDetailState;
  feedback?: ReactNode;
  children?: ReactNode;
}

/** Presentation for an already authorized admin record widget. */
export function AdminRecordDetail({
  title,
  subtitle,
  titleAccessory,
  status,
  breadcrumb,
  backButton,
  actions,
  border,
  facts,
  state = { kind: "ready" },
  feedback,
  children,
}: AdminRecordDetailProps): JSX.Element {
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={title}
        subtitle={subtitle}
        breadcrumb={breadcrumb}
        backButton={backButton}
        actions={actions}
        border={border}
        titleAccessory={
          status ? (
            <>
              <StatusPill {...status} />
              {titleAccessory}
            </>
          ) : (
            titleAccessory
          )
        }
      />
      {feedback}
      {state.kind === "ready" ? (
        <>
          {!!facts?.length && (
            <DetailGrid columns={3}>
              {facts.map(({ key, label, value }) => (
                <DetailField key={key} label={label} value={value} />
              ))}
            </DetailGrid>
          )}
          {children}
        </>
      ) : state.kind === "loading" ? (
        <Div aria-live="polite" className="flex min-w-0 flex-col gap-3">
          <P className="text-sm text-muted-foreground">{state.label}</P>
          <Div className="grid gap-3 @sm:grid-cols-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </Div>
          <Skeleton className="h-28" />
        </Div>
      ) : (
        <EmptyBlock
          size="page"
          className="rounded-xl border border-border bg-card"
          title={state.title}
          message={state.message}
          icon={state.icon}
          action={state.action}
        />
      )}
    </WidgetShell>
  );
}
