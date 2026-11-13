/**
 * Outreach CRM - Dashboard Widget
 * Web: KPI strip, status pills with counts, reply rate per angle, filterable
 * contact table, paid deals with spend against signups and revenue.
 * CLI/MCP: compact text report.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Platform, isCliPlatform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Handshake } from "next-vibe/ui/components/icons/Handshake";
import { Inbox } from "next-vibe/ui/components/icons/Inbox";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Upload } from "next-vibe/ui/components/icons/Upload";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { ProgressBlock } from "next-vibe/ui/components/progress-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type React from "react";
import { useCallback } from "react";

import type { OutreachContactStatusValue } from "../enum";
import { OutreachAttributionBasis, OutreachDealStatus } from "../enum";
import {
  cell,
  contactStatusVariant,
  dealStatusVariant,
  formatCents,
  formatDay,
  formatNumber,
  formatPercent,
} from "../format";
import type definition from "./definition";
import type {
  OutreachContactRow,
  OutreachCrmResponseOutput,
  OutreachDealRow,
} from "./definition";

type CrmT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
type StatusValue = typeof OutreachContactStatusValue;

const NONE = "-";

function moneyList(
  items: ReadonlyArray<{ currency: string; amountCents: number }>,
  locale: CountryLanguage,
): string {
  return items.length === 0
    ? NONE
    : items
        .map((item) => formatCents(item.amountCents, item.currency, locale))
        .join(" + ");
}

function dealSpend(deal: OutreachDealRow, locale: CountryLanguage): string {
  return formatCents(deal.amountCents, deal.currency, locale);
}

function costPerSignup(deal: OutreachDealRow, locale: CountryLanguage): string {
  return deal.costPerSignupCents === null
    ? NONE
    : formatCents(deal.costPerSignupCents, deal.currency, locale);
}

function rateOf(answered: number, total: number): number {
  return total > 0 ? answered / total : 0;
}

// ─── CLI / MCP text output ──────────────────────────────────────────────────

function renderText(
  data: OutreachCrmResponseOutput,
  t: CrmT,
  locale: CountryLanguage,
): string {
  const { summary } = data;
  const paidDeals = data.deals.filter(
    (deal) => deal.status === OutreachDealStatus.PAID,
  ).length;
  const lines: string[] = [
    t("crm.get.widget.text.header", {
      total: summary.total,
      replied: summary.answered,
      rate: formatPercent(rateOf(summary.answered, summary.total), locale),
      deals: paidDeals,
    }),
    t("crm.get.widget.text.statusLine", {
      counts: summary.byStatus
        .map((entry) => `${t(entry.status)} ${entry.count}`)
        .join(" · "),
    }),
  ];

  if (data.angles.length > 0) {
    lines.push("", t("crm.get.widget.text.anglesTitle"));
    for (const angle of data.angles) {
      lines.push(
        `  ${cell(t(angle.group), 28)} ${String(angle.contacts).padStart(4)} / ${String(angle.answered).padEnd(4)} ${formatPercent(rateOf(angle.answered, angle.contacts), locale)}`,
      );
    }
  }

  lines.push("");
  if (data.contacts.length === 0) {
    lines.push(t("crm.get.widget.text.noContacts"));
  } else {
    const start = (summary.page - 1) * summary.limit + 1;
    lines.push(
      t("crm.get.widget.text.contactsTitle", {
        start,
        end: start + data.contacts.length - 1,
        total: summary.matching,
      }),
    );
    for (const contact of data.contacts) {
      lines.push(
        [
          " ",
          cell(t(contact.status), 11),
          cell(contact.name, 30),
          cell(contact.email, 34),
          cell(contact.angle ?? NONE, 22),
          cell(formatDay(contact.lastContactAt, locale), 7),
          `x${contact.contactCount}`,
        ].join(" "),
      );
    }
    if (summary.pageCount > 1) {
      lines.push(
        t("crm.get.widget.text.pageHint", {
          page: summary.page,
          pages: summary.pageCount,
          next: Math.min(summary.page + 1, summary.pageCount),
        }),
      );
    }
  }

  lines.push("");
  if (data.deals.length === 0) {
    lines.push(t("crm.get.widget.text.noDeals"));
  } else {
    lines.push(t("crm.get.widget.text.dealsTitle"));
    for (const deal of data.deals) {
      lines.push(
        `  ${t("crm.get.widget.text.dealLine", {
          name: deal.contactName,
          deliverable: deal.deliverable,
          amount: dealSpend(deal, locale),
          status: t(deal.status),
          visits: deal.linkVisits ?? deal.visitors,
          signups: deal.signups,
          paying: deal.paying,
          revenue: moneyList(deal.revenue, locale),
          cps: costPerSignup(deal, locale),
        })}${
          deal.basis === OutreachAttributionBasis.TRACKED
            ? ""
            : ` (${t(deal.basis)})`
        }`,
      );
    }
  }
  return lines.join("\n");
}

// ─── Web pieces ─────────────────────────────────────────────────────────────

function StatusChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-7 px-2.5 gap-1.5 rounded-full text-xs font-medium border transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
      )}
    >
      {label}
      <Span
        className={cn(
          "tabular-nums",
          active ? "text-primary-foreground/80" : "text-foreground",
        )}
      >
        {count}
      </Span>
    </Button>
  );
}

function DealResultNote({
  deal,
  t,
  locale,
}: {
  deal: OutreachDealRow;
  t: CrmT;
  locale: CountryLanguage;
}): React.JSX.Element {
  const parts = [
    deal.liveAt
      ? t("crm.get.widget.deals.live", { date: formatDay(deal.liveAt, locale) })
      : "",
    deal.refCode ? `ref ${deal.refCode}` : "",
    deal.basis === OutreachAttributionBasis.CHANNEL
      ? t("crm.get.widget.deals.basisChannel")
      : "",
    deal.basis === OutreachAttributionBasis.NONE
      ? t("crm.get.widget.deals.basisNone")
      : "",
  ].filter(Boolean);
  return (
    <Span className="block text-xs text-muted-foreground truncate max-w-[280px]">
      {parts.join(" · ")}
    </Span>
  );
}

// ─── Container ──────────────────────────────────────────────────────────────

export function OutreachCrmWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.GET>();

  const activeStatus = form.watch("status");

  const resetPageAndSubmit = useCallback((): void => {
    form.setValue("page", 1, { shouldDirty: true });
    if (onSubmit) {
      onSubmit();
    }
  }, [form, onSubmit]);

  const selectStatus = useCallback(
    (status: StatusValue | undefined): void => {
      form.setValue("status", status, { shouldDirty: true });
      resetPageAndSubmit();
    },
    [form, resetPageAndSubmit],
  );

  const clearFilters = useCallback((): void => {
    form.setValue("status", undefined, { shouldDirty: true });
    form.setValue("kind", undefined, { shouldDirty: true });
    form.setValue("angle", "", { shouldDirty: true });
    form.setValue("search", "", { shouldDirty: true });
    resetPageAndSubmit();
  }, [form, resetPageAndSubmit]);

  const changePage = useCallback(
    (page: number): void => {
      form.setValue("page", page, { shouldDirty: true });
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const openContact = useCallback(
    (contact: OutreachContactRow | null): void => {
      void (async (): Promise<void> => {
        const def = await import("../contact/definition");
        navigate(def.default.POST, {
          renderInModal: true,
          popNavigationOnSuccess: 1,
          data: contact
            ? {
                email: contact.email,
                name: contact.name,
                kind: contact.kind,
                status: contact.status,
                angle: contact.angle ?? undefined,
                url: contact.url ?? undefined,
                refCode: contact.refCode ?? undefined,
                channel: contact.channel ?? undefined,
                notes: contact.notes ?? undefined,
              }
            : undefined,
        });
      })();
    },
    [navigate],
  );

  const openDeal = useCallback(
    (deal: OutreachDealRow | null): void => {
      void (async (): Promise<void> => {
        const def = await import("../deal/definition");
        navigate(def.default.POST, {
          renderInModal: true,
          popNavigationOnSuccess: 1,
          data: deal
            ? {
                id: deal.id,
                deliverable: deal.deliverable,
                amount: deal.amountCents / 100,
                currency: deal.currency,
                status: deal.status,
                channel: deal.channel ?? undefined,
                refCode: deal.refCode ?? undefined,
                utmCampaign: deal.utmCampaign ?? undefined,
                notes: deal.notes ?? undefined,
              }
            : undefined,
        });
      })();
    },
    [navigate],
  );

  const openImport = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("../import/definition");
      navigate(def.default.POST, {
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  }, [navigate]);

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return data ? <Pre>{renderText(data, t, locale)}</Pre> : <Pre>{""}</Pre>;
  }

  const summary = data?.summary;
  const contacts = data?.contacts ?? [];
  const deals = data?.deals ?? [];
  const paidTotals = (data?.dealTotals ?? [])
    .filter((entry) => entry.paidCents > 0)
    .map((entry) => ({
      currency: entry.currency,
      amountCents: entry.paidCents,
    }));
  const committedTotals = (data?.dealTotals ?? [])
    .filter((entry) => entry.committedCents > 0)
    .map((entry) => ({
      currency: entry.currency,
      amountCents: entry.committedCents,
    }));
  const paidDeals = deals.filter(
    (deal) => deal.status === OutreachDealStatus.PAID,
  ).length;
  const hasFilters = Boolean(
    activeStatus ||
    form.watch("kind") ||
    form.watch("angle") ||
    form.watch("search"),
  );
  const page = summary?.page ?? 1;
  const pageCount = summary?.pageCount ?? 1;
  const rangeStart =
    summary && summary.matching > 0 ? (page - 1) * summary.limit + 1 : 0;
  const rangeEnd = summary
    ? Math.min(page * summary.limit, summary.matching)
    : 0;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("crm.get.widget.title")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
              className="-ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : undefined
        }
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void endpointMutations?.read?.refetch?.()}
              aria-label={t("crm.get.widget.refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openImport}
              className="gap-1"
            >
              <Upload className="h-4 w-4" />
              <Span className="hidden @sm:inline text-xs">
                {t("crm.get.widget.import")}
              </Span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openDeal(null)}
              className="gap-1"
            >
              <Handshake className="h-4 w-4" />
              <Span className="hidden @sm:inline text-xs">
                {t("crm.get.widget.addDeal")}
              </Span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => openContact(null)}
              className="gap-1"
            >
              <UserPlus className="h-4 w-4" />
              {t("crm.get.widget.addContact")}
            </Button>
          </>
        }
      />
      <P className="text-sm text-muted-foreground">
        {t("crm.get.widget.subtitle")}
      </P>
      <FormAlertWidget field={children.formAlert} />

      {!data || !summary ? (
        <LoadingBlock message={t("crm.get.widget.loading")} />
      ) : summary.total === 0 && deals.length === 0 ? (
        <EmptyBlock
          icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
          title={t("crm.get.widget.empty.title")}
          message={t("crm.get.widget.empty.hint")}
          action={{ label: t("crm.get.widget.empty.cta"), onClick: openImport }}
        />
      ) : (
        <>
          <MetricGrid columns={4}>
            <MetricCard
              label={t("crm.get.widget.kpi.contacts")}
              value={formatNumber(summary.total, locale)}
            />
            <MetricCard
              label={t("crm.get.widget.kpi.replyRate")}
              value={formatPercent(
                rateOf(summary.answered, summary.total),
                locale,
              )}
              description={t("crm.get.widget.kpi.replyRateHint", {
                replied: summary.answered,
                total: summary.total,
              })}
              variant="info"
            />
            <MetricCard
              label={t("crm.get.widget.kpi.deals")}
              value={formatNumber(paidDeals, locale)}
              variant="success"
            />
            <MetricCard
              label={t("crm.get.widget.kpi.spent")}
              value={moneyList(paidTotals, locale)}
              description={
                committedTotals.length > 0
                  ? t("crm.get.widget.kpi.spentHint", {
                      committed: moneyList(committedTotals, locale),
                    })
                  : undefined
              }
              variant="warning"
            />
          </MetricGrid>

          {/* Paid deals first: that is where the money is */}
          <SectionGroup
            title={t("crm.get.widget.deals.title")}
            subtitle={t("crm.get.widget.deals.hint")}
          >
            {deals.length === 0 ? (
              <EmptyBlock
                icon={<Handshake className="h-8 w-8 text-muted-foreground" />}
                title={t("crm.get.widget.deals.empty.title")}
                message={t("crm.get.widget.deals.empty.hint")}
                action={{
                  label: t("crm.get.widget.addDeal"),
                  onClick: () => openDeal(null),
                }}
              />
            ) : (
              <Div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">
                        {t("crm.get.widget.deals.columns.deal")}
                      </TableHead>
                      <TableHead className="text-xs">
                        {t("crm.get.widget.deals.columns.status")}
                      </TableHead>
                      <TableHead className="text-xs text-right">
                        {t("crm.get.widget.deals.columns.spend")}
                      </TableHead>
                      <TableHead className="text-xs text-right">
                        {t("crm.get.widget.deals.columns.visits")}
                      </TableHead>
                      <TableHead className="text-xs text-right">
                        {t("crm.get.widget.deals.columns.signups")}
                      </TableHead>
                      <TableHead className="text-xs text-right">
                        {t("crm.get.widget.deals.columns.paying")}
                      </TableHead>
                      <TableHead className="text-xs text-right">
                        {t("crm.get.widget.deals.columns.revenue")}
                      </TableHead>
                      <TableHead className="text-xs text-right whitespace-nowrap">
                        {t("crm.get.widget.deals.columns.costPerSignup")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.map((deal) => (
                      <TableRow
                        key={deal.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => openDeal(deal)}
                      >
                        <TableCell>
                          <Span className="block text-sm font-medium truncate max-w-[280px]">
                            {deal.contactName}
                          </Span>
                          <Span className="block text-xs truncate max-w-[280px]">
                            {deal.deliverable}
                          </Span>
                          <DealResultNote deal={deal} t={t} locale={locale} />
                        </TableCell>
                        <TableCell>
                          <StatusPill
                            status={deal.status}
                            label={t(deal.status)}
                            variant={dealStatusVariant(deal.status)}
                          />
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm font-medium whitespace-nowrap">
                          {dealSpend(deal, locale)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          {formatNumber(
                            deal.linkVisits ?? deal.visitors,
                            locale,
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          {formatNumber(deal.signups, locale)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          {formatNumber(deal.paying, locale)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm whitespace-nowrap">
                          {deal.revenue.length > 0 ? (
                            <Span className="font-medium text-success">
                              {moneyList(deal.revenue, locale)}
                            </Span>
                          ) : (
                            <Span className="text-muted-foreground">
                              {NONE}
                            </Span>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm whitespace-nowrap">
                          {costPerSignup(deal, locale)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Div>
            )}
          </SectionGroup>

          {data.angles.length > 0 && (
            <SectionGroup
              title={t("crm.get.widget.angles.title")}
              subtitle={t("crm.get.widget.angles.hint")}
              collapsible
              defaultOpen
            >
              <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
                {data.angles.map((angle) => (
                  <Div key={angle.group} className="flex flex-col gap-1">
                    <ProgressBlock
                      label={t(angle.group)}
                      value={angle.answered}
                      max={Math.max(angle.contacts, 1)}
                      showPercentage
                      variant={
                        rateOf(angle.answered, angle.contacts) >= 0.2
                          ? "success"
                          : "default"
                      }
                    />
                    <Span className="text-xs text-muted-foreground tabular-nums">
                      {t("crm.get.widget.angles.row", {
                        contacts: angle.contacts,
                        replied: angle.answered,
                      })}
                    </Span>
                  </Div>
                ))}
              </Div>
            </SectionGroup>
          )}

          <SectionGroup title={t("crm.get.widget.contacts.title")}>
            <Div className="flex flex-col gap-3">
              <Div className="flex items-center gap-1.5 flex-wrap">
                <StatusChip
                  label={t("crm.get.widget.allStatuses")}
                  count={summary.total}
                  active={!activeStatus}
                  onClick={() => selectStatus(undefined)}
                />
                {summary.byStatus.map((entry) => (
                  <StatusChip
                    key={entry.status}
                    label={t(entry.status)}
                    count={entry.count}
                    active={activeStatus === entry.status}
                    onClick={() =>
                      selectStatus(
                        activeStatus === entry.status
                          ? undefined
                          : entry.status,
                      )
                    }
                  />
                ))}
                {hasFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-7 text-xs underline underline-offset-2"
                    onClick={clearFilters}
                  >
                    {t("crm.get.widget.clearFilters")}
                  </Button>
                )}
              </Div>

              <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
                <Div className="@sm:col-span-2">
                  <TextFieldWidget fieldName="search" field={children.search} />
                </Div>
                <SelectFieldWidget fieldName="kind" field={children.kind} />
                <TextFieldWidget fieldName="angle" field={children.angle} />
              </Div>
              {contacts.length === 0 ? (
                <EmptyBlock
                  icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
                  title={t("crm.get.widget.empty.filtered")}
                  action={{
                    label: t("crm.get.widget.clearFilters"),
                    onClick: clearFilters,
                  }}
                />
              ) : (
                <Div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">
                          {t("crm.get.widget.contacts.columns.contact")}
                        </TableHead>
                        <TableHead className="text-xs">
                          {t("crm.get.widget.contacts.columns.status")}
                        </TableHead>
                        <TableHead className="text-xs">
                          {t("crm.get.widget.contacts.columns.angle")}
                        </TableHead>
                        <TableHead className="text-xs whitespace-nowrap">
                          {t("crm.get.widget.contacts.columns.last")}
                        </TableHead>
                        <TableHead className="text-xs text-right">
                          {t("crm.get.widget.contacts.columns.touches")}
                        </TableHead>
                        <TableHead className="w-8" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow
                          key={contact.id}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => openContact(contact)}
                        >
                          <TableCell>
                            <Span className="block text-sm font-medium truncate max-w-[260px]">
                              {contact.name}
                            </Span>
                            <Span className="block text-xs text-muted-foreground truncate max-w-[260px]">
                              {`${contact.email} · ${t(contact.kind)}`}
                            </Span>
                            {contact.lastSubject && (
                              <Span className="block text-xs text-muted-foreground/80 italic truncate max-w-[260px]">
                                {contact.lastSubject}
                              </Span>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusPill
                              status={contact.status}
                              label={t(contact.status)}
                              variant={contactStatusVariant(contact.status)}
                            />
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                            {contact.angle ?? NONE}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">
                            <Span className="block">
                              {contact.lastContactAt
                                ? formatDay(contact.lastContactAt, locale)
                                : t("crm.get.widget.contacts.never")}
                            </Span>
                            {contact.lastReplyAt && (
                              <Span className="block text-info">
                                {t("crm.get.widget.contacts.replied", {
                                  date: formatDay(contact.lastReplyAt, locale),
                                })}
                              </Span>
                            )}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm">
                            {contact.contactCount}
                          </TableCell>
                          <TableCell>
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Div>
              )}

              {summary.matching > 0 && (
                <Div className="flex items-center justify-between text-sm text-muted-foreground">
                  <Span>
                    {t("crm.get.widget.contacts.showing", {
                      start: rangeStart,
                      end: rangeEnd,
                      total: summary.matching,
                    })}
                  </Span>
                  {pageCount > 1 && (
                    <Div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => changePage(page - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Span className="tabular-nums text-xs">
                        {page} / {pageCount}
                      </Span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={page >= pageCount}
                        onClick={() => changePage(page + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Div>
                  )}
                </Div>
              )}
            </Div>
          </SectionGroup>
        </>
      )}
    </WidgetShell>
  );
}
