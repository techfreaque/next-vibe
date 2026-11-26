"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { AccountType } from "../../../enum";
import type definition from "./definition";

const TYPE_VARIANT: Record<string, StatusPillVariant> = {
  [AccountType.ASSET]: "info",
  [AccountType.LIABILITY]: "warning",
  [AccountType.EQUITY]: "default",
  [AccountType.REVENUE]: "success",
  [AccountType.EXPENSE]: "danger",
};

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
        await import("@/chart-of-accounts/ledger/[accountId]/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { accountId: account.id },
      });
    })();
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("accountGet.widget.back")}
    </Button>
  ) : undefined;

  if (!account) {
    return (
      <AdminForm
        title={t("accountGet.title")}
        backButton={backButton}
        primaryAction={
          <SubmitButtonWidget<typeof definition.GET>
            field={{ text: "accountGet.widget.select" }}
          />
        }
      >
        <EntityPickerFieldWidget
          fieldName="accountId"
          field={field.children.accountId}
        />
      </AdminForm>
    );
  }

  const typeLabel = t(account.type as Parameters<typeof t>[0]);
  const subtypeLabel = t(account.subtype as Parameters<typeof t>[0]);

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={`${account.code} · ${account.name}`}
        subtitle={account.description ?? undefined}
        backButton={backButton}
        actions={
          <Div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLedger}
            >
              {t("accountGet.widget.viewLedgerButton")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEdit}
            >
              {t("accountGet.widget.editButton")}
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
        }
      />

      <Div className="flex flex-wrap gap-2 items-center">
        <StatusPill
          status={account.type}
          label={typeLabel}
          variant={TYPE_VARIANT[account.type] ?? "muted"}
        />
        <Badge variant="secondary" className="text-xs">
          {subtypeLabel}
        </Badge>
        <StatusPill
          status={account.isActive ? "active" : "inactive"}
          label={
            account.isActive
              ? t("accountGet.widget.active")
              : t("accountGet.widget.inactive")
          }
          variant={account.isActive ? "success" : "muted"}
        />
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

      <DetailGrid columns={2}>
        <DetailField
          label={t("accountGet.response.sortOrder")}
          value={String(account.sortOrder)}
        />
      </DetailGrid>
    </WidgetShell>
  );
}
