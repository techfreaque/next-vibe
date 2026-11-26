"use client";

import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useEffect } from "react";

import { scopedTranslation as companiesScopedTranslation } from "../i18n";
import type definition from "./definition";
import type { CompanyListGetResponseOutput } from "./definition";

type CompanyItem = NonNullable<
  CompanyListGetResponseOutput["companies"]
>[number];

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
  const user = useWidgetUser();
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const interactive = useWidgetIsInteractive();
  const form = useWidgetForm<typeof definition.GET>();
  const page = form?.watch("page") ?? 1;
  const pageSize = form?.watch("pageSize") ?? 20;
  const includeAll = interactive && isAdmin && !isPickerMode;
  useEffect(() => {
    if (includeAll && form && form.getValues("includeAll") === undefined) {
      form.setValue("includeAll", true);
    }
  }, [form, includeAll]);

  const companies = data?.companies ?? [];
  const total = data?.total ?? 0;

  const handleOpen =
    (company: CompanyItem) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (isPickerMode) {
        onPick({ id: company.id, name: company.name });
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
    <Div
      className={
        isPickerMode
          ? "mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6"
          : "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-8"
      }
    >
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
            <Span className="text-sm text-muted-foreground">
              ({total.toLocaleString(locale)})
            </Span>
          </Div>
          {interactive && isAdmin && (
            <Button
              type="button"
              size="sm"
              onClick={handleCreate}
              className="shrink-0 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("get.widget.create")}
            </Button>
          )}
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
          {!isPickerMode && interactive && isAdmin && (
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
              <Button
                key={company.id}
                type="button"
                size="unset"
                variant="ghost"
                className={`group h-auto w-full justify-start gap-3 whitespace-normal rounded-none bg-card px-4 py-3 text-start hover:bg-muted/50 ${inactive ? "opacity-60" : ""}`}
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
                      <StatusPill
                        status="inactive"
                        label={t("get.widget.inactive")}
                        variant="muted"
                      />
                    )}
                  </Div>
                  <Span className="text-xs text-muted-foreground">
                    {[
                      company.role
                        ? tCompanies(company.role)
                        : t("get.widget.noMembership"),
                      tCompanies(company.type),
                      company.country,
                      company.currency,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Span>
                </Div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Button>
            );
          })}
        </Div>
      )}
      {interactive && total > pageSize && (
        <Div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => form.setValue("page", page - 1)}
          >
            {t("get.widget.previous")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page * pageSize >= total}
            onClick={() => form.setValue("page", page + 1)}
          >
            {t("get.widget.next")}
          </Button>
        </Div>
      )}
    </Div>
  );
}
