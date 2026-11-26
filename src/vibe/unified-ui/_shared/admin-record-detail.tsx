"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import {
  EmptyBlock,
  type EmptyBlockAction,
} from "next-vibe/ui/components/empty-block";
import { MoreHorizontal } from "next-vibe/ui/components/icons/MoreHorizontal";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillProps,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { type JSX, type ReactNode, useState } from "react";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { defaultLocale } from "../../core/i18n/core/config";
import { scopedTranslation } from "../hooks/i18n";
import { cn } from "./cn";
import { useOptionalWidgetLocale } from "./use-widget-context";

/** Skeleton shape shown while the record loads: match the content. */
export type AdminRecordSkeleton = "record" | "table" | "form";

export type AdminRecordDetailState =
  | { kind: "ready" }
  | { kind: "loading"; label: string; skeleton?: AdminRecordSkeleton }
  | {
      kind: "empty" | "error";
      title: string;
      message?: string;
      icon?: ReactNode;
      action?: EmptyBlockAction;
      secondaryAction?: EmptyBlockAction;
    };

/** One action on a record. Destructive actions always confirm first. */
export interface AdminRecordAction {
  key: string;
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  confirm?: {
    title: string;
    message?: string;
    confirmLabel: string;
  };
}

export interface AdminRecordFact {
  key: string;
  label: string;
  value?: ReactNode;
}

export interface AdminRecordDetailProps {
  title: string;
  subtitle?: string;
  titleAccessory?: ReactNode;
  status?: StatusPillProps;
  breadcrumb?: ReactNode;
  backButton?: ReactNode;
  /** Free-form header actions (legacy); prefer the structured props below. */
  actions?: ReactNode;
  /** The one filled button: the next step for this record. */
  primaryAction?: AdminRecordAction;
  /** Outline buttons next to the primary action (keep it to two). */
  secondaryActions?: readonly AdminRecordAction[];
  /** Everything else, including destructive actions, behind "More". */
  moreActions?: readonly AdminRecordAction[];
  border?: boolean;
  facts?: readonly AdminRecordFact[];
  /** Identifiers and raw values, collapsed by default. */
  technicalDetails?: readonly { key: string; label: string; value: string }[];
  state?: AdminRecordDetailState;
  feedback?: ReactNode;
  locale?: CountryLanguage;
  children?: ReactNode;
}

function RecordSkeleton({
  shape,
}: {
  shape: AdminRecordSkeleton;
}): JSX.Element {
  if (shape === "table") {
    return (
      <Div className="flex flex-col overflow-hidden rounded-lg border bg-card">
        <Div className="flex gap-4 border-b px-4 py-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="ml-auto h-4 w-1/6" />
        </Div>
        {[0, 1, 2, 3, 4].map((row) => (
          <Div
            key={row}
            className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="ml-auto h-4 w-16" />
          </Div>
        ))}
      </Div>
    );
  }
  if (shape === "form") {
    return (
      <Div className="grid gap-4 rounded-lg border bg-card p-4 @lg:grid-cols-2">
        {[0, 1, 2, 3].map((field) => (
          <Div key={field} className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-full" />
          </Div>
        ))}
      </Div>
    );
  }
  return (
    <>
      <Div className="grid gap-x-6 gap-y-4 rounded-lg border bg-card p-4 @sm:grid-cols-2 @lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((fact) => (
          <Div key={fact} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-32" />
          </Div>
        ))}
      </Div>
      <Skeleton className="h-40 rounded-lg" />
    </>
  );
}

function RecordActionButton({
  action,
  variant,
  onRequest,
  className,
}: {
  action: AdminRecordAction;
  variant: "default" | "outline";
  onRequest: (action: AdminRecordAction) => void;
  className?: string;
}): JSX.Element {
  return (
    <Button
      type="button"
      variant={action.destructive ? "destructive" : variant}
      className={className}
      disabled={action.disabled}
      onClick={() => onRequest(action)}
    >
      {action.icon}
      {action.label}
    </Button>
  );
}

/**
 * The one record-detail template: H1 with inline status, one subtitle line,
 * one primary action, outline secondaries, everything else (and every
 * destructive action, confirmed) behind "More"; facts in a card; ids only in
 * a collapsed "Technical details" section.
 */
export function AdminRecordDetail({
  title,
  subtitle,
  titleAccessory,
  status,
  breadcrumb,
  backButton,
  actions,
  primaryAction,
  secondaryActions,
  moreActions,
  border,
  facts,
  technicalDetails,
  state = { kind: "ready" },
  feedback,
  locale: localeProp,
  children,
}: AdminRecordDetailProps): JSX.Element {
  const contextLocale = useOptionalWidgetLocale();
  const { t } = scopedTranslation.scopedT(
    localeProp ?? contextLocale ?? defaultLocale,
  );
  const [pending, setPending] = useState<AdminRecordAction | null>(null);

  const request = (action: AdminRecordAction): void => {
    if (action.confirm || action.destructive) {
      setPending(action);
      return;
    }
    action.onClick();
  };

  const regularMore = (moreActions ?? []).filter((a) => !a.destructive);
  const destructiveMore = (moreActions ?? []).filter((a) => a.destructive);
  const hasStructuredActions =
    primaryAction !== undefined ||
    (secondaryActions?.length ?? 0) > 0 ||
    (moreActions?.length ?? 0) > 0;

  // Phone (below @md): the primary action comes first at full width, then
  // "More", then the outline buttons. From @md up the row reads left to right
  // as More, outlines, primary (primary last, at the right edge).
  const headerActions =
    state.kind === "ready" && (actions || hasStructuredActions) ? (
      <>
        {primaryAction && (
          <RecordActionButton
            action={primaryAction}
            variant="default"
            onRequest={request}
            className="order-first w-full @md:order-last @md:w-auto"
          />
        )}
        {actions}
        {(moreActions?.length ?? 0) > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 px-3 @md:w-10 @md:px-0"
                aria-label={t("widgets.recordState.moreActions")}
                title={t("widgets.recordState.moreActions")}
              >
                <MoreHorizontal className="h-4 w-4" />
                <Span className="@md:sr-only">
                  {t("widgets.recordState.more")}
                </Span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {regularMore.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  disabled={action.disabled}
                  onSelect={() => request(action)}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
              {regularMore.length > 0 && destructiveMore.length > 0 && (
                <DropdownMenuSeparator />
              )}
              {destructiveMore.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  disabled={action.disabled}
                  className="text-destructive focus:text-destructive"
                  onSelect={() => request(action)}
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {secondaryActions?.map((action) => (
          <RecordActionButton
            key={action.key}
            action={action}
            variant="outline"
            onRequest={request}
          />
        ))}
      </>
    ) : undefined;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={title}
        subtitle={subtitle}
        breadcrumb={breadcrumb}
        backButton={backButton}
        actions={headerActions}
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
            <Div className="rounded-lg border bg-card p-4">
              <DetailGrid columns={3}>
                {facts.map(({ key, label, value }) => (
                  <DetailField key={key} label={label} value={value} />
                ))}
              </DetailGrid>
            </Div>
          )}
          {children}
          {!!technicalDetails?.length && (
            <SectionGroup
              title={t("widgets.recordState.technicalDetails")}
              collapsible
              defaultOpen={false}
            >
              <DetailGrid columns={2}>
                {technicalDetails.map(({ key, label, value }) => (
                  <DetailField
                    key={key}
                    label={label}
                    value={value}
                    mono
                    copyable
                    copyLabel={t("widgets.recordState.copy")}
                  />
                ))}
              </DetailGrid>
            </SectionGroup>
          )}
        </>
      ) : state.kind === "loading" ? (
        <Div
          aria-live="polite"
          aria-busy="true"
          className="flex min-w-0 flex-col gap-4"
        >
          <Span className="sr-only">{state.label}</Span>
          <RecordSkeleton shape={state.skeleton ?? "record"} />
        </Div>
      ) : (
        <EmptyBlock
          size="page"
          className="rounded-xl border border-border bg-card"
          title={state.title}
          message={state.message}
          icon={state.icon}
          action={state.action}
          secondaryAction={state.secondaryAction}
        />
      )}
      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPending(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.confirm?.title ?? pending?.label}
            </AlertDialogTitle>
            {pending?.confirm?.message && (
              <AlertDialogDescription>
                {pending.confirm.message}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("widgets.recordState.confirmCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                pending?.destructive &&
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              )}
              onClick={() => {
                const action = pending;
                setPending(null);
                action?.onClick();
              }}
            >
              {pending?.confirm?.confirmLabel ?? pending?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WidgetShell>
  );
}
