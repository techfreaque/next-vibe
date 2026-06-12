"use client";

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Building } from "next-vibe-ui/ui/icons/Building";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import { type JSX } from "react";

import { usePickerCallback } from "next-vibe-ui/unified/_shared/picker-context";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";

import type { CompanyMemberRoleValue, CompanyTypeValue } from "../enum";
import { CompanyMemberRole, CompanyType } from "../enum";
import { scopedTranslation as companiesScopedTranslation } from "../i18n";
import type { CompanyListGetResponseOutput } from "./definition";
import type definition from "./definition";

type CompanyItem = NonNullable<
  CompanyListGetResponseOutput["companies"]
>[number];

const TYPE_COLOR: Record<typeof CompanyTypeValue, string> = {
  [CompanyType.B2B]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  [CompanyType.B2C]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  [CompanyType.INDIVIDUAL]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

const ROLE_COLOR: Record<typeof CompanyMemberRoleValue, string> = {
  [CompanyMemberRole.OWNER]:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  [CompanyMemberRole.ADMIN]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  [CompanyMemberRole.ACCOUNTANT]:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  [CompanyMemberRole.MEMBER]: "bg-muted text-muted-foreground",
  [CompanyMemberRole.VIEWER]: "bg-muted text-muted-foreground",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CompanyListContainer(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: tCompanies } = companiesScopedTranslation.scopedT(locale);
  const onPick = usePickerCallback<{ id: string; name: string }>();
  const isPickerMode = !!onPick;

  const companies = data?.companies ?? [];
  const total = data?.total;

  const handleOpen =
    (company: CompanyItem) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (isPickerMode) {
        onPick({ id: company.id, name: company.name });
        pop();
        return;
      }
      void (async (): Promise<void> => {
        const def = await import("../[companyId]/get/definition");
        navigate(def.default.GET, {
          urlPathParams: { companyId: company.id },
        });
      })();
    };

  const handleCreate = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../create/definition"),
        import("../[companyId]/get/definition"),
      ]);
      navigate(createDef.default.POST, {
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            companyId: responseData.result.id,
          }),
        },
      });
    })();
  };

  // ── Loading ─────────────────────────────────────────────────────
  if (!data) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 py-6">
        {canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            className="self-start gap-1.5 mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("get.widget.back")}
          </Button>
        )}
        <Div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <Span className="text-sm">{t("get.widget.loading")}</Span>
        </Div>
      </Div>
    );
  }

  // ── Populated / Empty ───────────────────────────────────────────
  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-6">
      {canGoBack && !isPickerMode && (
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

      {/* Header */}
      {!isPickerMode && (
        <Div className="flex items-center justify-between gap-3">
          <Div className="flex items-baseline gap-2">
            <Span className="text-lg font-semibold">
              {t("get.widget.title")}
            </Span>
            {total !== undefined && (
              <Span className="text-sm text-muted-foreground">({total})</Span>
            )}
          </Div>
          <Button
            type="button"
            size="sm"
            onClick={handleCreate}
            className="gap-1.5 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("get.widget.create")}
          </Button>
        </Div>
      )}

      {/* Empty state */}
      {companies.length === 0 && (
        <Div className="flex flex-col items-center justify-center py-16 gap-5">
          <Div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
            <Building className="h-7 w-7 text-muted-foreground" />
          </Div>
          <Div className="flex flex-col items-center gap-1.5 text-center">
            <Span className="text-sm font-medium">
              {t("get.widget.empty.title")}
            </Span>
            <P className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              {t("get.widget.empty.hint")}
            </P>
          </Div>
          {!isPickerMode && (
            <Button
              type="button"
              size="sm"
              onClick={handleCreate}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("get.widget.empty.cta")}
            </Button>
          )}
        </Div>
      )}

      {/* Company list */}
      {companies.length > 0 && (
        <Div className="flex flex-col rounded-lg border overflow-hidden divide-y divide-border">
          {companies.map((company) => {
            const inactive = !company.isActive;
            return (
              <Div
                key={company.id}
                className={`flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/50 transition-colors cursor-pointer group ${inactive ? "opacity-60" : ""}`}
                onClick={handleOpen(company)}
              >
                <Div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Building className="h-4 w-4 text-primary" />
                </Div>
                <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <Div className="flex items-center gap-2">
                    <Span
                      className={`text-sm font-medium truncate ${inactive ? "line-through text-muted-foreground" : ""}`}
                    >
                      {company.name}
                    </Span>
                    {inactive && (
                      <Span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                        {t("get.widget.inactive")}
                      </Span>
                    )}
                  </Div>
                  <Div className="flex items-center gap-1.5 flex-wrap">
                    <Span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${TYPE_COLOR[company.type] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {tCompanies(company.type)}
                    </Span>
                    <Span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${ROLE_COLOR[company.role] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {tCompanies(company.role)}
                    </Span>
                    {(company.country ?? company.currency) && (
                      <Span className="text-xs text-muted-foreground">
                        {[company.country, company.currency]
                          .filter(Boolean)
                          .join(" · ")}
                      </Span>
                    )}
                  </Div>
                </Div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}
