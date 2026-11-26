"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { BookOpen } from "next-vibe/ui/components/icons/BookOpen";
import { Box } from "next-vibe/ui/components/icons/Box";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { Inbox } from "next-vibe/ui/components/icons/Inbox";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { ShoppingBag } from "next-vibe/ui/components/icons/ShoppingBag";
import { ShoppingCart } from "next-vibe/ui/components/icons/ShoppingCart";
import { Users } from "next-vibe/ui/components/icons/Users";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { AdminRecordDetail } from "next-vibe/unified-ui/_shared/admin-record-detail";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import type { JSX, ReactNode } from "react";

import accountsDefinition from "@/chart-of-accounts/account/list/definition";

import { useWorkspaceCompany } from "../../_shared/workspace-company-context";
import { scopedTranslation as companiesScopedTranslation } from "../../i18n";
import { proposeOpeningMonth } from "../onboard/first-period";
import { getCompanySetupCountry } from "../onboard/setup-country";
import type definition from "./definition";

type ListImport = () => Promise<{
  default: {
    GET: Parameters<ReturnType<typeof useWidgetNavigation>["push"]>[0];
  };
}>;

function countryName(code: string | null, locale: string): string | null {
  if (!code) {
    return null;
  }
  if (!/^[A-Z]{2}$/.test(code)) {
    return code;
  }
  return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CompanyGetWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const workspace = useWorkspaceCompany();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const response = useWidgetResponse();
  const read = useWidgetEndpointMutations()?.read;
  const { t: tCompanies } = companiesScopedTranslation.scopedT(locale);
  const companyId = data?.id;

  // One cheap probe: does this company already have a chart of accounts?
  const accounts = useApiQuery({
    endpoint: accountsDefinition.GET,
    requestData: { companyId, page: 1, pageSize: 1 },
    options: {
      enabled: interactive && !!companyId,
      queryKey: `company-detail-coa:${companyId ?? ""}`,
    },
    logger,
    user,
  }).data;
  const needsAccounting = accounts !== undefined && accounts.total === 0;

  const backToList = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    void import("../../list/definition").then(({ default: list }) =>
      navigation.push(list.GET, {}),
    );
  };

  const edit = (): void => {
    if (!companyId) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../update/definition");
      navigation.push(def.default.PATCH, {
        urlPathParams: { companyId },
        prefillFromGet: true,
        getEndpoint: (await import("./definition")).default.GET,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const setupAccounting = (): void => {
    if (!data?.id) {
      return;
    }
    const id = data.id;
    const country = getCompanySetupCountry(data.country);
    if (data.isActive) {
      workspace?.register({
        id,
        name: data.name,
        currency: data.currency,
      });
    }
    void (async (): Promise<void> => {
      const { default: onboard } = await import("../onboard/definition");
      navigation.push(onboard.POST, {
        urlPathParams: { companyId: id },
        data: {
          country,
          openFirstPeriod: true,
          ...proposeOpeningMonth(locale),
        },
      });
    })();
  };

  const members = (): void => {
    if (!companyId) {
      return;
    }
    void import("../members/list/definition").then(({ default: def }) =>
      navigation.push(def.GET, { urlPathParams: { companyId } }),
    );
  };

  const openList = (importFn: ListImport) => (): void => {
    if (!companyId) {
      return;
    }
    void importFn().then(({ default: def }) =>
      navigation.push(def.GET, { data: { companyId } }),
    );
  };

  const related: {
    key: string;
    icon: ReactNode;
    label: string;
    run: () => void;
  }[] = [
    {
      key: "accounting",
      icon: <BookOpen className="size-4" aria-hidden="true" />,
      label: t("get.widget.modules.accounting.label"),
      run: openList(
        () => import("@/chart-of-accounts/account/list/definition"),
      ),
    },
    {
      key: "invoices",
      icon: <FileText className="size-4" aria-hidden="true" />,
      label: t("get.widget.modules.invoices.label"),
      run: openList(() => import("@/payment/invoice/list/definition")),
    },
    {
      key: "estimates",
      icon: <FileText className="size-4" aria-hidden="true" />,
      label: t("get.widget.modules.estimates.label"),
      run: openList(() => import("@/payment/estimate/list/definition")),
    },
    {
      key: "bills",
      icon: <Inbox className="size-4" aria-hidden="true" />,
      label: t("get.widget.modules.bills.label"),
      run: openList(() => import("@/payment/bill/list/definition")),
    },
    {
      key: "purchasing",
      icon: <ShoppingBag className="size-4" aria-hidden="true" />,
      label: t("get.widget.modules.purchasing.label"),
      run: openList(() => import("@/purchasing/order/list/definition")),
    },
    {
      key: "inventory",
      icon: <Box className="size-4" aria-hidden="true" />,
      label: t("get.widget.modules.inventory.label"),
      run: openList(() => import("@/inventory/warehouse/list/definition")),
    },
    {
      key: "pos",
      icon: <ShoppingCart className="size-4" aria-hidden="true" />,
      label: t("get.widget.modules.pos.label"),
      run: openList(() => import("@/pos/terminal/list/definition")),
    },
  ];

  const backButton = interactive && (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="self-start gap-1.5 -ml-2"
      onClick={backToList}
    >
      <ChevronLeft className="size-4" aria-hidden="true" />
      {t("get.widget.backToList")}
    </Button>
  );

  const country = countryName(data?.country ?? null, locale);
  const facts = data?.id
    ? [
        { key: "vat", label: t("get.widget.vatNumber"), value: data.vatNumber },
        { key: "tax", label: t("get.widget.taxId"), value: data.taxId },
        { key: "email", label: t("get.widget.email"), value: data.email },
        { key: "phone", label: t("get.widget.phone"), value: data.phone },
        { key: "website", label: t("get.widget.website"), value: data.website },
        {
          key: "created",
          label: t("get.widget.createdAt"),
          value: formatDocDate(data.createdAt, locale),
        },
      ].filter((fact) => !!fact.value)
    : [];

  return (
    <AdminRecordDetail
      title={data?.name ?? t("get.titleShort")}
      subtitle={
        data?.id
          ? [tCompanies(data.type), country, data.currency]
              .filter(Boolean)
              .join(" · ")
          : undefined
      }
      status={
        data?.id
          ? {
              status: data.isActive ? "active" : "inactive",
              label: data.isActive
                ? t("get.widget.active")
                : t("get.widget.inactive"),
              variant: data.isActive ? "success" : "muted",
            }
          : undefined
      }
      backButton={backButton}
      primaryAction={
        interactive && needsAccounting
          ? {
              key: "setup",
              label: t("get.widget.setupAccounting"),
              icon: <BookOpen className="size-4" aria-hidden="true" />,
              onClick: setupAccounting,
            }
          : undefined
      }
      secondaryActions={
        interactive && data?.id
          ? [
              {
                key: "members",
                label: t("get.widget.members"),
                icon: <Users className="size-4" aria-hidden="true" />,
                onClick: members,
              },
              {
                key: "edit",
                label: t("get.widget.edit"),
                icon: <Pencil className="size-4" aria-hidden="true" />,
                onClick: edit,
              },
            ]
          : undefined
      }
      facts={facts}
      technicalDetails={
        data?.id
          ? [{ key: "id", label: t("get.companyId.label"), value: data.id }]
          : undefined
      }
      state={
        data?.id
          ? { kind: "ready" }
          : response?.success === false
            ? {
                kind: "error",
                title: t("get.widget.loadFailed"),
                message: response.message,
                action:
                  read && interactive
                    ? {
                        label: t("get.widget.retry"),
                        onClick: () => void read.refetch(),
                      }
                    : undefined,
                secondaryAction: interactive
                  ? { label: t("get.widget.backToList"), onClick: backToList }
                  : undefined,
              }
            : { kind: "loading", label: t("get.widget.loading") }
      }
    >
      {interactive && data?.id && (
        <SectionGroup title={t("get.widget.related")}>
          <Div className="flex flex-wrap gap-2">
            {related.map(({ key, icon, label, run }) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={run}
              >
                {icon}
                {label}
              </Button>
            ))}
          </Div>
        </SectionGroup>
      )}
    </AdminRecordDetail>
  );
}
