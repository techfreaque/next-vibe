"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useEffect, useRef, useState } from "react";

import { AccountSubtype, AccountType } from "../../enum";
import { setCachedAccount } from "../_shared/account-picker-cache";
import type definition from "./definition";
import type { CoaAccountListResponseOutput } from "./definition";

type AccountRow = NonNullable<CoaAccountListResponseOutput["accounts"]>[number];

// Ordered by accounting convention: Assets, Liabilities, Equity, Revenue, Expenses
const TYPE_ORDER = [
  AccountType.ASSET,
  AccountType.LIABILITY,
  AccountType.EQUITY,
  AccountType.REVENUE,
  AccountType.EXPENSE,
] as const;

function FlagBadge({ label }: { label: string }): JSX.Element {
  return (
    <Span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground shrink-0">
      {label}
    </Span>
  );
}

function accountTree(
  rows: AccountRow[],
  search: string,
  collator: Intl.Collator,
  locale: CountryLanguage,
): { account: AccountRow; indent: number }[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const included = new Set<string>();
  for (const row of rows) {
    if (
      search &&
      !`${row.code} ${row.name} ${row.officialName ?? ""}`
        .toLocaleLowerCase(locale)
        .includes(search)
    ) {
      continue;
    }
    for (
      let current: AccountRow | undefined = row;
      current && !included.has(current.id);
      current = current.parentId ? byId.get(current.parentId) : undefined
    ) {
      included.add(current.id);
    }
  }

  const filtered = rows.filter((row) => included.has(row.id));
  const sorted = filtered.toSorted(
    (a, b) => a.sortOrder - b.sortOrder || collator.compare(a.code, b.code),
  );
  const children = new Map<string | null, AccountRow[]>();
  for (const row of sorted) {
    const parent =
      row.parentId && included.has(row.parentId) ? row.parentId : null;
    const siblings = children.get(parent) ?? [];
    siblings.push(row);
    children.set(parent, siblings);
  }
  const visited = new Set<string>();
  const ordered: { account: AccountRow; indent: number }[] = [];
  const append = (account: AccountRow, indent: number): void => {
    if (visited.has(account.id)) {
      return;
    }
    visited.add(account.id);
    ordered.push({ account, indent });
    children.get(account.id)?.forEach((child) => append(child, indent + 1));
  };
  children.get(null)?.forEach((row) => append(row, 0));
  // Show legacy cycles and orphaned entries once.
  sorted.forEach((row) => append(row, 0));
  return ordered;
}

const INDENT_CLASS: Record<number, string> = {
  0: "pl-2",
  1: "pl-4 @md:pl-6",
  2: "pl-6 @md:pl-10",
  3: "pl-8 @md:pl-12",
};

function AccountItem({
  account,
  indent,
  onView,
  subtypeLabel,
  inactiveLabel,
  postableLabel,
  systemLabel,
  locale,
  debitLabel,
  creditLabel,
}: {
  account: AccountRow;
  indent: number;
  onView: (id: string) => void;
  subtypeLabel: string;
  inactiveLabel: string;
  postableLabel: string;
  systemLabel: string;
  locale: CountryLanguage;
  debitLabel: string;
  creditLabel: string;
}): JSX.Element {
  const debitNormal =
    account.type === AccountType.ASSET || account.type === AccountType.EXPENSE;
  const balances = account.balances ?? [];
  return (
    <TableRow>
      <TableCell className="w-16 whitespace-normal break-words text-left align-top font-mono text-xs text-muted-foreground">
        {account.code}
      </TableCell>
      <TableCell
        className={`min-w-0 text-left ${INDENT_CLASS[Math.min(indent, 3)] ?? "pl-2"}`}
      >
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto min-w-0 max-w-full justify-start whitespace-normal p-0 text-left font-medium [overflow-wrap:anywhere]"
          onClick={() => onView(account.id)}
        >
          {account.name}
        </Button>
        {account.officialName && (
          <Span className="block text-xs text-muted-foreground [overflow-wrap:anywhere]">
            {account.officialName}
          </Span>
        )}
        <Div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Span>{subtypeLabel}</Span>
          {!account.isActive && <FlagBadge label={inactiveLabel} />}
          {account.isPostable && <FlagBadge label={postableLabel} />}
          {account.isSystem && <FlagBadge label={systemLabel} />}
        </Div>
      </TableCell>
      <TableCell className="align-top text-right tabular-nums">
        {balances.map(({ currency, amount }) => {
          const side = amount > 0 === debitNormal ? debitLabel : creditLabel;
          return (
            <Span key={currency} className="block [overflow-wrap:anywhere]">
              {formatMoney(Math.abs(amount), currency, locale)}
              {balances.length > 1 && (
                <Span className="ml-1 text-xs text-muted-foreground">
                  {currency}
                </Span>
              )}
              {amount !== 0 && (
                <Span className="ml-1 whitespace-nowrap text-xs text-muted-foreground">
                  {side}
                </Span>
              )}
            </Span>
          );
        })}
      </TableCell>
    </TableRow>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoaAccountListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const companyId = form.watch("companyId");
  const page = form.watch("page") ?? 1;
  const pageSize = form.watch("pageSize") ?? 100;
  const [search, setSearch] = useState("");
  const t = useWidgetTranslation<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const onPick = usePickerCallback<{
    id: string;
    companyId: string;
    name: string;
    code: string;
    type: string;
    subtype: string;
    isSystem: boolean;
    isActive: boolean;
    description: string | null;
    sortOrder: number;
  }>();
  const isPickerMode = !!onPick;

  // Auto-load on mount — companyId is optional, backend returns all companies
  const didAutoSubmit = useRef(false);
  useEffect(() => {
    if (!onSubmit || didAutoSubmit.current) {
      return;
    }
    didAutoSubmit.current = true;
    onSubmit();
  }, [onSubmit]);

  const handleView = (accountId: string): void => {
    if (isPickerMode) {
      const account = (data?.accounts ?? []).find((a) => a.id === accountId);
      if (account && onPick) {
        const picked = {
          id: account.id,
          companyId: account.companyId,
          name: account.name,
          code: account.code,
          type: account.type,
          subtype: account.subtype,
          isSystem: account.isSystem,
          isActive: account.isActive,
          description: account.description,
          sortOrder: account.sortOrder,
        };
        setCachedAccount(picked);
        onPick(picked);
      }
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../[accountId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { accountId },
      });
    })();
  };

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigation.push(def.default.POST, {
        data: companyId ? { companyId } : undefined,
      });
    })();
  };

  const handleSetup = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../setup/definition");
      navigation.push(def.default.POST, {
        data: companyId ? { companyId } : undefined,
      });
    })();
  };

  const backButton = navigation.canGoBack && (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("get.widget.back")}
    </Button>
  );
  if (!data) {
    return (
      <WidgetShell layout={isPickerMode ? "compact" : "page"}>
        <WidgetHeader
          size={isPickerMode ? "section" : "page"}
          title={t("get.title")}
          backButton={backButton}
        />
        <Span className="py-10 text-sm text-muted-foreground">
          {t("get.widget.loading")}
        </Span>
      </WidgetShell>
    );
  }

  const accounts = data.accounts ?? [];

  // Translation labels using the enum value (i18n key path) as map key
  const accountTypeLabels: Record<string, string> = {
    [AccountType.ASSET]: t("enums.accountType.ASSET"),
    [AccountType.LIABILITY]: t("enums.accountType.LIABILITY"),
    [AccountType.EQUITY]: t("enums.accountType.EQUITY"),
    [AccountType.REVENUE]: t("enums.accountType.REVENUE"),
    [AccountType.EXPENSE]: t("enums.accountType.EXPENSE"),
  };

  const accountSubtypeLabels: Record<string, string> = {
    [AccountSubtype.CURRENT_ASSET]: t("enums.accountSubtype.CURRENT_ASSET"),
    [AccountSubtype.FIXED_ASSET]: t("enums.accountSubtype.FIXED_ASSET"),
    [AccountSubtype.BANK]: t("enums.accountSubtype.BANK"),
    [AccountSubtype.CASH]: t("enums.accountSubtype.CASH"),
    [AccountSubtype.ACCOUNTS_RECEIVABLE]: t(
      "enums.accountSubtype.ACCOUNTS_RECEIVABLE",
    ),
    [AccountSubtype.INVENTORY]: t("enums.accountSubtype.INVENTORY"),
    [AccountSubtype.PREPAID]: t("enums.accountSubtype.PREPAID"),
    [AccountSubtype.ACCOUNTS_PAYABLE]: t(
      "enums.accountSubtype.ACCOUNTS_PAYABLE",
    ),
    [AccountSubtype.VAT_PAYABLE]: t("enums.accountSubtype.VAT_PAYABLE"),
    [AccountSubtype.VAT_RECEIVABLE]: t("enums.accountSubtype.VAT_RECEIVABLE"),
    [AccountSubtype.ACCRUED_LIABILITY]: t(
      "enums.accountSubtype.ACCRUED_LIABILITY",
    ),
    [AccountSubtype.SHORT_TERM_DEBT]: t("enums.accountSubtype.SHORT_TERM_DEBT"),
    [AccountSubtype.LONG_TERM_DEBT]: t("enums.accountSubtype.LONG_TERM_DEBT"),
    [AccountSubtype.SHARE_CAPITAL]: t("enums.accountSubtype.SHARE_CAPITAL"),
    [AccountSubtype.RETAINED_EARNINGS]: t(
      "enums.accountSubtype.RETAINED_EARNINGS",
    ),
    [AccountSubtype.REVENUE_SALES]: t("enums.accountSubtype.REVENUE_SALES"),
    [AccountSubtype.REVENUE_SERVICE]: t("enums.accountSubtype.REVENUE_SERVICE"),
    [AccountSubtype.COGS]: t("enums.accountSubtype.COGS"),
    [AccountSubtype.PAYROLL]: t("enums.accountSubtype.PAYROLL"),
    [AccountSubtype.RENT]: t("enums.accountSubtype.RENT"),
    [AccountSubtype.UTILITIES]: t("enums.accountSubtype.UTILITIES"),
    [AccountSubtype.OPEX]: t("enums.accountSubtype.OPEX"),
    [AccountSubtype.FINANCIAL_INCOME]: t(
      "enums.accountSubtype.FINANCIAL_INCOME",
    ),
    [AccountSubtype.FINANCIAL_EXPENSE]: t(
      "enums.accountSubtype.FINANCIAL_EXPENSE",
    ),
    [AccountSubtype.TAX_EXPENSE]: t("enums.accountSubtype.TAX_EXPENSE"),
    [AccountSubtype.OTHER]: t("enums.accountSubtype.OTHER"),
  };

  const term = search.trim().toLocaleLowerCase(locale);
  const collator = new Intl.Collator(locale, { numeric: true });

  // Group by type — the type value is the AccountType enum value (i18n key path)
  const grouped = accounts.reduce<Record<string, AccountRow[]>>((acc, acct) => {
    const key = acct.type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(acct);
    return acc;
  }, {});

  const groups = TYPE_ORDER.map((type) => ({
    type,
    rows: accountTree(grouped[type] ?? [], term, collator, locale),
  })).filter(({ rows }) => rows.length > 0);
  const goToPage = (next: number): void => {
    form.setValue("page", next);
    onSubmit?.();
  };

  return (
    <WidgetShell layout={isPickerMode ? "compact" : "page"}>
      <WidgetHeader
        size={isPickerMode ? "section" : "page"}
        title={t("get.title")}
        backButton={backButton}
        actions={
          !isPickerMode && (
            <Button type="button" size="sm" onClick={handleCreate}>
              {t("get.widget.createButton")}
            </Button>
          )
        }
      />
      <Div className="flex flex-wrap items-center justify-between gap-2">
        <Input
          className="w-full @sm:max-w-xs"
          aria-label={t("get.widget.searchPage")}
          placeholder={t("get.widget.searchPage")}
          value={search}
          onChangeText={setSearch}
        />
        <Span className="text-sm text-muted-foreground">
          {`${t("get.response.total")} ${new Intl.NumberFormat(locale).format(data.total)}`}
        </Span>
      </Div>
      {groups.map(({ type, rows }) => (
        <Div key={type} className="min-w-0 rounded-md border bg-card">
          <Div className="flex items-center justify-between gap-2 border-b px-3 py-2">
            <Span className="font-semibold">{accountTypeLabels[type]}</Span>
            <Span className="text-sm tabular-nums text-muted-foreground">
              {new Intl.NumberFormat(locale).format(rows.length)}
            </Span>
          </Div>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-left">
                  {t("get.response.code")}
                </TableHead>
                <TableHead className="text-left">
                  {t("get.response.name")}
                </TableHead>
                <TableHead className="w-28 text-right @md:w-36">
                  {t("get.response.balance")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ account, indent }) => (
                <AccountItem
                  key={account.id}
                  account={account}
                  indent={indent}
                  onView={handleView}
                  subtypeLabel={
                    accountSubtypeLabels[account.subtype] ?? account.subtype
                  }
                  inactiveLabel={t("get.widget.inactive")}
                  postableLabel={t("get.response.isPostable")}
                  systemLabel={t("get.response.isSystem")}
                  locale={locale}
                  debitLabel={t("get.widget.debitSide")}
                  creditLabel={t("get.widget.creditSide")}
                />
              ))}
            </TableBody>
          </Table>
        </Div>
      ))}

      {term && accounts.length > 0 && groups.length === 0 && (
        <EmptyBlock title={t("get.widget.noMatches")} />
      )}
      {data.total > pageSize && (
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            {t("get.widget.previousPage")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page * pageSize >= data.total}
            onClick={() => goToPage(page + 1)}
          >
            {t("get.widget.nextPage")}
          </Button>
        </Div>
      )}
      {/* Empty state — data loaded but no accounts */}
      {accounts.length === 0 && (
        <Div className="flex flex-col items-center gap-4 py-14 text-center border border-dashed rounded-md">
          <Building className="h-8 w-8 text-muted-foreground" />
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-medium">{t("get.widget.empty")}</Span>
          </Div>
          {!isPickerMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSetup}
            >
              {t("get.widget.setupButton")}
            </Button>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
