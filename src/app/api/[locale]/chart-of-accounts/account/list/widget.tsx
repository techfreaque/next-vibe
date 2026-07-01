"use client";

import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { Building } from "next-vibe/ui/web/ui/icons/Building";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/web/ui/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useEffect, useRef } from "react";

import { AccountSubtype, AccountType } from "../../enum";
import { setCachedAccount } from "../_shared/account-picker-cache";
import type definition from "./definition";
import type { CoaAccountListResponseOutput } from "./definition";

type AccountRow = NonNullable<CoaAccountListResponseOutput["accounts"]>[number];

// TYPE_COLORS — keyed by AccountType enum value (i18n key path)
const TYPE_COLOR: Record<string, string> = {
  [AccountType.ASSET]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  [AccountType.LIABILITY]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  [AccountType.EQUITY]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  [AccountType.REVENUE]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  [AccountType.EXPENSE]:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const TYPE_HEADER_COLOR: Record<string, string> = {
  [AccountType.ASSET]:
    "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
  [AccountType.LIABILITY]:
    "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
  [AccountType.EQUITY]:
    "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
  [AccountType.REVENUE]:
    "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
  [AccountType.EXPENSE]:
    "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
};

// Ordered by accounting convention: Assets, Liabilities, Equity, Revenue, Expenses
const TYPE_ORDER = [
  AccountType.ASSET,
  AccountType.LIABILITY,
  AccountType.EQUITY,
  AccountType.REVENUE,
  AccountType.EXPENSE,
] as const;

function TypeBadge({
  type,
  label,
}: {
  type: string;
  label: string;
}): JSX.Element {
  const color = TYPE_COLOR[type] ?? "bg-muted text-muted-foreground";
  return (
    <Span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${color}`}
    >
      {label}
    </Span>
  );
}

function FlagBadge({ label }: { label: string }): JSX.Element {
  return (
    <Span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground shrink-0">
      {label}
    </Span>
  );
}

// Build a map of accountId → indent depth based on parentId chain
function buildAccountIndentMap(rows: AccountRow[]): Map<string, number> {
  const depthMap = new Map<string, number>();
  const idSet = new Set(rows.map((r) => r.id));

  function getDepth(id: string): number {
    if (depthMap.has(id)) {
      return depthMap.get(id) ?? 0;
    }
    const row = rows.find((r) => r.id === id);
    if (!row?.parentId || !idSet.has(row.parentId)) {
      depthMap.set(id, 0);
      return 0;
    }
    const d = 1 + getDepth(row.parentId);
    depthMap.set(id, d);
    return d;
  }

  for (const row of rows) {
    getDepth(row.id);
  }
  return depthMap;
}

// Tailwind safe-listed indent classes for hierarchy depth 0–4
const INDENT_CLASS: Record<number, string> = {
  0: "pl-3",
  1: "pl-7",
  2: "pl-11",
  3: "pl-14",
  4: "pl-16",
};

function AccountItem({
  account,
  indent,
  onView,
  typeLabel,
  subtypeLabel,
  inactiveLabel,
  postableLabel,
  systemLabel,
}: {
  account: AccountRow;
  indent: number;
  onView: (id: string) => void;
  typeLabel: string;
  subtypeLabel: string;
  inactiveLabel: string;
  postableLabel: string;
  systemLabel: string;
}): JSX.Element {
  const indentClass = INDENT_CLASS[Math.min(indent, 4)] ?? "pl-16";
  return (
    <Button
      type="button"
      variant="ghost"
      className={`w-full flex items-center gap-2 py-2 pr-3 h-auto border-b last:border-b-0 rounded-none justify-start font-normal hover:bg-muted/30 transition-colors ${indentClass} ${!account.isActive ? "opacity-60" : ""}`}
      onClick={() => {
        onView(account.id);
      }}
    >
      {/* Indent indicator — purely decorative line */}
      {indent > 0 && (
        <Div className="w-2 h-3 border-l border-b border-muted-foreground/25 shrink-0 -mt-1 rounded-bl-sm" />
      )}

      {/* Code — monospace, muted */}
      <Span className="font-mono text-xs font-semibold text-muted-foreground w-14 shrink-0">
        {account.code}
      </Span>

      {/* Name */}
      <Span
        className={`flex-1 text-sm font-medium truncate ${!account.isActive ? "line-through text-muted-foreground" : ""}`}
      >
        {account.name}
      </Span>

      {/* Subtype — small gray, hidden on small screens */}
      <Span className="text-xs text-muted-foreground truncate max-w-[8rem] hidden md:block shrink-0">
        {subtypeLabel}
      </Span>

      {/* Flag badges */}
      <Div className="hidden sm:flex items-center gap-1 shrink-0">
        {account.isPostable && <FlagBadge label={postableLabel} />}
        {account.isSystem && <FlagBadge label={systemLabel} />}
        {!account.isActive && <FlagBadge label={inactiveLabel} />}
      </Div>

      {/* Type badge */}
      <TypeBadge type={account.type} label={typeLabel} />
    </Button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoaAccountListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const onPick = usePickerCallback<{
    id: string;
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
        navigation.pop();
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
      navigation.push(def.default.POST, {});
    })();
  };

  const handleSetup = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../setup/definition");
      navigation.push(def.default.POST, {});
    })();
  };

  // Loading state
  if (!data) {
    return (
      <Div className="flex flex-col gap-4">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("get.widget.back")}
          </Button>
        )}
        <Div className="flex flex-col items-center gap-4 py-10 rounded-lg border border-dashed">
          <Div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border-2 border-dashed border-muted-foreground/30">
            <Building className="h-6 w-6 text-muted-foreground" />
          </Div>
          <Span className="text-sm text-muted-foreground">
            {t("get.widget.loading")}
          </Span>
        </Div>
      </Div>
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

  const indentMap = buildAccountIndentMap(accounts);

  // Group by type — the type value is the AccountType enum value (i18n key path)
  const grouped = accounts.reduce<Record<string, AccountRow[]>>((acc, acct) => {
    const key = acct.type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(acct);
    return acc;
  }, {});

  return (
    <Div className="flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("get.widget.back")}
        </Button>
      )}
      {/* Header bar */}
      <Div className="flex items-center justify-between gap-2">
        <Span className="text-sm text-muted-foreground">
          {data.total ?? accounts.length} {t("get.response.accounts")}
        </Span>
        {!isPickerMode && (
          <Div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCreate}
            >
              {t("get.widget.createButton")}
            </Button>
          </Div>
        )}
      </Div>

      {/* Accounts loaded and non-empty */}
      {accounts.length > 0 && (
        <Div className="flex flex-col gap-4">
          {TYPE_ORDER.filter((type) => grouped[type]?.length).map((type) => (
            <Div
              key={type}
              className={`rounded-md border overflow-hidden ${TYPE_HEADER_COLOR[type] ?? ""}`}
            >
              {/* Section header */}
              <Div
                className={`px-3 py-2 border-b flex items-center justify-between ${TYPE_HEADER_COLOR[type] ?? "bg-muted/50"}`}
              >
                <Span className="text-xs font-semibold uppercase tracking-wide">
                  {accountTypeLabels[type] ?? type}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {grouped[type]?.length}
                </Span>
              </Div>

              {/* Column headers */}
              <Div className="flex items-center gap-2 px-3 py-1.5 border-b bg-background/50 text-xs font-medium text-muted-foreground">
                <Span className="w-14 shrink-0">{t("get.response.code")}</Span>
                <Span className="flex-1">{t("get.response.name")}</Span>
                <Span className="max-w-[8rem] hidden md:block shrink-0">
                  {t("get.response.subtype")}
                </Span>
                <Span className="hidden sm:block w-28 shrink-0" />
                <Span className="w-16 shrink-0 text-right">
                  {t("get.response.type")}
                </Span>
              </Div>

              {/* Account rows */}
              {grouped[type]?.map((account) => (
                <AccountItem
                  key={account.id}
                  account={account}
                  indent={indentMap.get(account.id) ?? 0}
                  onView={handleView}
                  typeLabel={accountTypeLabels[account.type] ?? account.type}
                  subtypeLabel={
                    accountSubtypeLabels[account.subtype] ?? account.subtype
                  }
                  inactiveLabel={t("get.widget.inactive")}
                  postableLabel={t("get.response.isPostable")}
                  systemLabel={t("get.response.isSystem")}
                />
              ))}
            </Div>
          ))}
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
    </Div>
  );
}
