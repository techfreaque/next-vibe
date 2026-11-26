"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { ListItem } from "next-vibe/ui/components/list-item";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useEffect, useRef } from "react";

import {
  useToolCompanyId,
  useWorkspaceCompany,
} from "@/companies/_shared/workspace-company-context";
import { DocumentScopePicker } from "@/finance/document-list-ui";

import {
  JournalEntryStatus,
  JournalEntryStatusOptions,
  JournalSourceTypeOptions,
} from "../../enum";
import type definition from "./definition";

function companyCell(name: string | null): JSX.Element {
  return <Span className="whitespace-nowrap">{name ?? "-"}</Span>;
}

const STATUS_VARIANT: Record<string, StatusPillVariant> = {
  [JournalEntryStatus.DRAFT]: "muted",
  [JournalEntryStatus.POSTED]: "success",
  [JournalEntryStatus.REVERSED]: "muted",
};

export function CoaJournalListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const onSubmit = useWidgetOnSubmit();
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["entries"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  const workspace = useWorkspaceCompany();
  const toolCompanyId = useToolCompanyId();
  const didAutoSubmit = useRef(false);
  useEffect(() => {
    if (!onSubmit || didAutoSubmit.current) {
      return;
    }
    didAutoSubmit.current = true;
    onSubmit();
  }, [onSubmit]);

  const handleView = (entryId: string): void => {
    if (isPickerMode) {
      const entry = (data?.entries ?? []).find((e) => e.id === entryId);
      if (entry && onPick) {
        onPick(entry);
        navigation.pop();
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[entryId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { entryId },
      });
    })();
  };

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      const companyId = form.getValues("companyId");
      const periodId = form.getValues("periodId");
      navigation.push(def.default.POST, {
        data: companyId ? { companyId, periodId } : undefined,
      });
    })();
  };

  const handlePeriods = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../period/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const entries = data?.entries ?? [];
  const total = data?.totalCount ?? entries.length;
  const page = form.watch("page") ?? 1;
  const pageSize = form.watch("pageSize") ?? 20;
  const goToPage = (next: number): void => {
    form.setValue("page", next, { shouldDirty: true });
    onSubmit?.();
  };
  const showActions = interactive && !isPickerMode;
  const statusLabel = (status: string): string => {
    const option = JournalEntryStatusOptions.find((o) => o.value === status);
    return option ? t(option.label) : status;
  };
  const sourceLabel = (source: string): string => {
    const option = JournalSourceTypeOptions.find((o) => o.value === source);
    return option ? t(option.label) : source;
  };
  const companyId = form.watch("companyId");
  const chooseCompany = (id?: string): void => {
    form.setValue("companyId", id, { shouldDirty: true });
    form.setValue("page", 1, { shouldDirty: true });
    onSubmit?.();
  };

  const pill = (status: string): JSX.Element => (
    <StatusPill
      status={status}
      label={statusLabel(status)}
      variant={STATUS_VARIANT[status] ?? "muted"}
    />
  );

  // Without an active company the list spans every company the admin is a
  // member of: say whose books each entry belongs to.
  const showCompany = !companyId;
  const columns = [
    { id: "number", label: t("journalList.response.entryNumber") },
    { id: "date", label: t("journalList.response.date") },
    ...(showCompany
      ? [{ id: "company", label: t("journalCreate.companyId.label") }]
      : []),
    { id: "description", label: t("journalList.response.description") },
    { id: "source", label: t("journalList.response.sourceType") },
    { id: "status", label: t("journalList.response.status") },
  ];
  const rows = entries.map((entry) => {
    const number = (
      <Span className="whitespace-nowrap font-semibold">
        {entry.entryNumber}
      </Span>
    );
    const date = (
      <Span className="whitespace-nowrap tabular-nums">
        {formatDocDate(entry.date, locale)}
      </Span>
    );
    const source = (
      <Span className="whitespace-nowrap text-muted-foreground">
        {sourceLabel(entry.sourceType)}
      </Span>
    );
    return {
      id: entry.id,
      onOpen: (): void => handleView(entry.id),
      cells: {
        number,
        date,
        company: companyCell(entry.companyName),
        description: entry.description,
        source,
        status: pill(entry.status),
      },
    };
  });

  let body: JSX.Element;
  if (response?.success === false) {
    body = (
      <EmptyBlock
        size="page"
        className="rounded-xl border bg-card"
        title={t("journalList.widget.loadFailed")}
        message={response.message}
        action={
          read && interactive
            ? {
                label: t("journalList.widget.retry"),
                onClick: (): void => void read.refetch(),
              }
            : undefined
        }
      />
    );
  } else if (!data) {
    body = (
      <Div
        aria-busy="true"
        className="flex flex-col overflow-hidden rounded-lg border bg-card"
      >
        <Span className="sr-only">{t("journalList.widget.loading")}</Span>
        {[0, 1, 2, 3, 4].map((row) => (
          <Div
            key={row}
            className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </Div>
        ))}
      </Div>
    );
  } else if (entries.length === 0) {
    body = (
      <EmptyBlock
        size="page"
        className="rounded-xl border bg-card"
        icon={<BookOpen className="h-6 w-6" />}
        title={t("journalList.widget.emptyTitle")}
        message={t("journalList.widget.emptyMessage")}
        action={
          showActions
            ? {
                label: t("journalList.widget.emptyAction"),
                onClick: handleCreate,
              }
            : undefined
        }
        secondaryAction={
          showActions
            ? {
                label: t("journalList.widget.periodsButton"),
                onClick: handlePeriods,
                variant: "outline",
              }
            : undefined
        }
      />
    );
  } else {
    body = (
      <RecordTable
        label={t("journalList.title")}
        columns={columns}
        rows={rows}
        compact={
          <Div className="flex flex-col gap-2">
            {entries.map((entry) => (
              <ListItem
                key={entry.id}
                title={entry.description}
                subtitle={[
                  entry.entryNumber,
                  formatDocDate(entry.date, locale),
                  showCompany
                    ? entry.companyName
                    : sourceLabel(entry.sourceType),
                ]
                  .filter(Boolean)
                  .join(" · ")}
                badges={pill(entry.status)}
                onClick={() => handleView(entry.id)}
              />
            ))}
          </Div>
        }
      />
    );
  }

  return (
    <WidgetShell layout={isPickerMode ? "compact" : "page"}>
      <WidgetHeader
        size={isPickerMode ? "section" : "page"}
        title={t("journalList.title")}
        subtitle={
          data && entries.length > 0
            ? t("journalList.widget.count", {
                count: total.toLocaleString(locale),
              })
            : t("journalList.widget.subtitle")
        }
        actions={
          showActions && (
            <>
              <Button type="button" variant="outline" onClick={handlePeriods}>
                {t("journalList.widget.periodsButton")}
              </Button>
              <Button type="button" onClick={handleCreate}>
                <Plus className="size-4" aria-hidden="true" />
                {t("journalList.widget.createButton")}
              </Button>
            </>
          )
        }
      />
      {interactive && !toolCompanyId && (
        <Div className="flex flex-wrap items-end gap-2 rounded-lg border bg-card p-3">
          <DocumentScopePicker
            kind="company"
            value={companyId}
            appliedLabel={
              workspace?.companies.find(({ id }) => id === companyId)?.name
            }
            onSelect={chooseCompany}
            onClear={() => chooseCompany()}
          />
        </Div>
      )}
      {body}
      {interactive && data && total > pageSize && (
        <Div className="flex items-center justify-between gap-2">
          <Span className="text-sm tabular-nums text-muted-foreground">
            {t("journalList.widget.pageOf", {
              page: page.toLocaleString(locale),
              pages: Math.ceil(total / pageSize).toLocaleString(locale),
            })}
          </Span>
          <Div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              {t("journalList.widget.previous")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page * pageSize >= total}
              onClick={() => goToPage(page + 1)}
            >
              {t("journalList.widget.next")}
            </Button>
          </Div>
        </Div>
      )}
    </WidgetShell>
  );
}
