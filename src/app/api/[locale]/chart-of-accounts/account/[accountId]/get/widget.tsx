"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import { AccountType } from "../../../enum";
import type definition from "./definition";

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

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined | boolean;
  mono?: boolean;
}): JSX.Element | null {
  if (value === null || value === undefined || value === false) {
    return null;
  }
  const displayValue =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <Div className="flex items-start gap-3 py-2 border-b last:border-b-0 text-sm">
      <Span className="text-muted-foreground w-32 shrink-0 pt-px">{label}</Span>
      <Span className={`flex-1 font-medium ${mono ? "font-mono" : ""}`}>
        {displayValue}
      </Span>
    </Div>
  );
}

export function CoaAccountGetWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const account = data?.result;

  const handleEdit = (): void => {
    if (!account?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const [updateDef, getDef] = await Promise.all([
        import("../update/definition"),
        import("./definition"),
      ]);
      navigation.push(updateDef.default.PATCH, {
        // accountId goes to both urlPathParams (for the GET prefill fetch) and
        // autoPrefillData (so form.watch("accountId") returns a value in the widget).
        // The `as never` matches the framework's own cast in EndpointsPage.tsx for the read path.
        urlPathParams: { accountId: account.id } as never,
        data: { accountId: account.id } as never,
        prefillFromGet: true,
        getEndpoint: getDef.default.GET,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleDeactivate = (): void => {
    if (!account?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../deactivate/definition");
      navigation.push(def.default.POST, {
        data: { accountId: account.id },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleLedger = (): void => {
    if (!account?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/chart-of-accounts/ledger/[accountId]/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { accountId: account.id },
      });
    })();
  };

  if (!account) {
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
            {t("accountGet.widget.back")}
          </Button>
        )}
        <EntityPickerFieldWidget
          fieldName="accountId"
          field={field.children.accountId}
        />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "accountGet.widget.select" as const }}
        />
      </Div>
    );
  }

  const typeColor =
    TYPE_COLOR[account.type] ?? "bg-muted text-muted-foreground";
  const typeLabel = t(account.type as Parameters<typeof t>[0]);
  const subtypeLabel = t(account.subtype as Parameters<typeof t>[0]);

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
          {t("accountGet.widget.back")}
        </Button>
      )}
      {/* Account header */}
      <Div className="rounded-md border p-4 flex flex-col gap-3">
        <Div className="flex items-center gap-3 flex-wrap">
          <Span className="font-mono text-xl font-bold text-muted-foreground">
            {account.code}
          </Span>
          <Span className="text-xl font-bold flex-1">{account.name}</Span>
        </Div>

        <Div className="flex flex-wrap gap-2 items-center">
          {/* Type badge with color */}
          <Span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor}`}
          >
            {typeLabel}
          </Span>
          {/* Subtype */}
          <Badge variant="secondary" className="text-xs">
            {subtypeLabel}
          </Badge>
          {/* Active/Inactive */}
          <Badge
            variant={account.isActive ? "default" : "destructive"}
            className={`text-xs ${account.isActive ? "bg-emerald-600 hover:bg-emerald-600 dark:bg-emerald-700" : ""}`}
          >
            {account.isActive
              ? t("accountGet.widget.active")
              : t("accountGet.widget.inactive")}
          </Badge>
          {account.isPostable && (
            <Badge variant="outline" className="text-xs">
              {t("accountGet.widget.postable")}
            </Badge>
          )}
          {account.isSystem && (
            <Badge variant="secondary" className="text-xs">
              {t("accountGet.widget.system")}
            </Badge>
          )}
        </Div>

        {account.description ? (
          <Span className="text-sm text-muted-foreground">
            {account.description}
          </Span>
        ) : null}
      </Div>

      {/* Additional details */}
      <Div className="rounded-md border px-4 py-1">
        <InfoRow
          label={t("accountGet.response.sortOrder")}
          value={String(account.sortOrder)}
        />
      </Div>

      {/* Action buttons */}
      <Div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleEdit}>
          {t("accountGet.widget.editButton")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLedger}
        >
          {t("accountGet.widget.viewLedgerButton")}
        </Button>
        {account.isActive && !account.isSystem && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDeactivate}
          >
            {t("accountGet.widget.deactivateButton")}
          </Button>
        )}
      </Div>
    </Div>
  );
}
