"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { BookOpen } from "next-vibe/ui/web/ui/icons/BookOpen";
import { Box } from "next-vibe/ui/web/ui/icons/Box";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { FileText } from "next-vibe/ui/web/ui/icons/FileText";
import { Inbox } from "next-vibe/ui/web/ui/icons/Inbox";
import { Loader2 } from "next-vibe/ui/web/ui/icons/Loader2";
import { Pencil } from "next-vibe/ui/web/ui/icons/Pencil";
import { ShoppingBag } from "next-vibe/ui/web/ui/icons/ShoppingBag";
import { ShoppingCart } from "next-vibe/ui/web/ui/icons/ShoppingCart";
import { Users } from "next-vibe/ui/web/ui/icons/Users";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX, ReactNode } from "react";

import type { CompanyTypeValue } from "../../enum";
import { CompanyType } from "../../enum";
import { scopedTranslation as companiesScopedTranslation } from "../../i18n";
import type definition from "./definition";

const TYPE_COLOR: Record<typeof CompanyTypeValue, string> = {
  [CompanyType.B2B]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  [CompanyType.B2C]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  [CompanyType.INDIVIDUAL]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}): JSX.Element | null {
  if (!value) {
    return null;
  }
  return (
    <Div className="flex items-start gap-3 py-2.5 border-b last:border-b-0 text-sm">
      <Span className="text-muted-foreground w-36 shrink-0">{label}</Span>
      <Span
        className={`flex-1 font-medium break-all ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </Span>
    </Div>
  );
}

function ModuleCard({
  icon,
  label,
  description,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  onClick: (e: ButtonMouseEvent) => void;
}): JSX.Element {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="flex flex-col gap-1.5 rounded-lg p-4 h-auto items-start text-left hover:bg-muted/60"
    >
      <Div className="flex items-center gap-2">
        <Div className="text-muted-foreground">{icon}</Div>
        <Span className="text-sm font-semibold">{label}</Span>
      </Div>
      <Span className="text-xs text-muted-foreground leading-snug font-normal">
        {description}
      </Span>
    </Button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CompanyGetWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: tCompanies } = companiesScopedTranslation.scopedT(locale);

  const handleEdit = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!data?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../update/definition");
      navigate(def.default.PATCH, {
        urlPathParams: { companyId: data.id },
        prefillFromGet: true,
        getEndpoint: (await import("./definition")).default.GET,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleMembers = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!data?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../members/list/definition");
      navigate(def.default.GET, {
        urlPathParams: { companyId: data.id },
      });
    })();
  };

  const handleModule =
    (
      importFn: () => Promise<{
        default: { GET: Parameters<typeof navigate>[0] };
      }>,
    ) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (!data?.id) {
        return;
      }
      void (async (): Promise<void> => {
        const def = await importFn();
        navigate(def.default.GET, { data: { companyId: data.id } });
      })();
    };

  // ── No data yet — show lookup form ──────────────────────────────
  if (!data?.id) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        {canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            className="self-start gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("get.widget.back")}
          </Button>
        )}
        <Div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <Span className="text-sm">{t("get.widget.loading")}</Span>
        </Div>
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.GET> field={{}} />
      </Div>
    );
  }

  // ── Company detail ──────────────────────────────────────────────
  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-6">
      {/* Back + Edit */}
      <Div className="flex items-center justify-between gap-3">
        {canGoBack ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            className="gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("get.widget.back")}
          </Button>
        ) : (
          <Div />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="gap-1.5"
        >
          <Pencil className="h-3.5 w-3.5" />
          {t("get.widget.edit")}
        </Button>
      </Div>

      {/* Header */}
      <Div className="flex flex-col gap-2">
        <Span className="text-2xl font-bold">{data.name}</Span>
        <Div className="flex items-center gap-2 flex-wrap">
          <Span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLOR[data.type] ?? "bg-muted text-muted-foreground"}`}
          >
            {tCompanies(data.type)}
          </Span>
          <Badge
            variant={data.isActive ? "default" : "secondary"}
            className={`text-xs ${data.isActive ? "bg-emerald-600 hover:bg-emerald-600 dark:bg-emerald-700" : ""}`}
          >
            {data.isActive ? t("get.widget.active") : t("get.widget.inactive")}
          </Badge>
        </Div>
      </Div>

      {/* Modules grid */}
      <Div className="flex flex-col gap-2">
        <Span className="text-sm font-semibold text-muted-foreground">
          {t("get.widget.modules.title")}
        </Span>
        <Div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <ModuleCard
            icon={<BookOpen className="h-4 w-4" />}
            label={t("get.widget.modules.accounting.label")}
            description={t("get.widget.modules.accounting.description")}
            onClick={handleModule(
              () =>
                import("@/app/api/[locale]/chart-of-accounts/account/list/definition"),
            )}
          />
          <ModuleCard
            icon={<FileText className="h-4 w-4" />}
            label={t("get.widget.modules.invoices.label")}
            description={t("get.widget.modules.invoices.description")}
            onClick={handleModule(
              () =>
                import("@/app/api/[locale]/payment/invoice/list/definition"),
            )}
          />
          <ModuleCard
            icon={<FileText className="h-4 w-4" />}
            label={t("get.widget.modules.estimates.label")}
            description={t("get.widget.modules.estimates.description")}
            onClick={handleModule(
              () =>
                import("@/app/api/[locale]/payment/estimate/list/definition"),
            )}
          />
          <ModuleCard
            icon={<Inbox className="h-4 w-4" />}
            label={t("get.widget.modules.bills.label")}
            description={t("get.widget.modules.bills.description")}
            onClick={handleModule(
              () => import("@/app/api/[locale]/payment/bill/list/definition"),
            )}
          />
          <ModuleCard
            icon={<ShoppingCart className="h-4 w-4" />}
            label={t("get.widget.modules.pos.label")}
            description={t("get.widget.modules.pos.description")}
            onClick={handleModule(
              () => import("@/app/api/[locale]/pos/terminal/list/definition"),
            )}
          />
          <ModuleCard
            icon={<ShoppingBag className="h-4 w-4" />}
            label={t("get.widget.modules.purchasing.label")}
            description={t("get.widget.modules.purchasing.description")}
            onClick={handleModule(
              () =>
                import("@/app/api/[locale]/purchasing/order/list/definition"),
            )}
          />
          <ModuleCard
            icon={<Box className="h-4 w-4" />}
            label={t("get.widget.modules.inventory.label")}
            description={t("get.widget.modules.inventory.description")}
            onClick={handleModule(
              () =>
                import("@/app/api/[locale]/inventory/warehouse/list/definition"),
            )}
          />
          <ModuleCard
            icon={<Users className="h-4 w-4" />}
            label={t("get.widget.modules.team.label")}
            description={t("get.widget.modules.team.description")}
            onClick={handleMembers}
          />
        </Div>
      </Div>

      {/* Company details */}
      <Div className="rounded-md border px-4 py-1">
        <InfoRow
          label={t("get.widget.vatNumber")}
          value={data.vatNumber}
          mono
        />
        <InfoRow label={t("get.widget.taxId")} value={data.taxId} mono />
        <InfoRow label={t("get.widget.country")} value={data.country} />
        <InfoRow label={t("get.widget.currency")} value={data.currency} mono />
        <InfoRow label={t("get.widget.email")} value={data.email} />
        <InfoRow label={t("get.widget.phone")} value={data.phone} />
        <InfoRow label={t("get.widget.website")} value={data.website} />
        <InfoRow
          label={t("get.widget.createdAt")}
          value={
            data.createdAt
              ? new Date(data.createdAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : null
          }
        />
      </Div>
    </Div>
  );
}
