"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Span } from "next-vibe/ui/components/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type { CompanyMemberRoleValue } from "../../../enum";
import { CompanyMemberRole } from "../../../enum";
import { scopedTranslation as companiesScopedTranslation } from "../../../i18n";
import type definition from "./definition";
import type { MembersListGetResponseOutput } from "./definition";

type Member = NonNullable<MembersListGetResponseOutput["members"]>[number];

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

function MemberRow({
  member,
  onUpdateRole,
  onRemove,
  onPick,
  isPickerMode,
  roleLabel,
  tUpdateRole,
  tRemove,
  tActive,
  tInactive,
  locale,
}: {
  member: Member;
  onUpdateRole: (memberId: string) => void;
  onRemove: (memberId: string) => void;
  onPick: ((member: Member) => void) | undefined;
  isPickerMode: boolean;
  roleLabel: string;
  tUpdateRole: string;
  tRemove: string;
  tActive: string;
  tInactive: string;
  locale: string;
}): JSX.Element {
  return (
    <Div
      className={`flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-muted/20 transition-colors${isPickerMode ? " cursor-pointer" : ""}`}
      onClick={isPickerMode && onPick ? () => onPick(member) : undefined}
    >
      <Div className="flex-1 min-w-0">
        <Span className="text-sm font-medium block truncate">
          {member.name ?? member.email ?? `Member ${member.id.slice(0, 8)}`}
        </Span>
        {member.name && member.email && (
          <Span className="text-xs text-muted-foreground block">
            {member.email}
          </Span>
        )}
        <Span className="text-xs text-muted-foreground block">
          {member.isActive ? tActive : tInactive}
          {member.joinedAt &&
            ` · ${new Date(member.joinedAt).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}`}
        </Span>
      </Div>
      <Div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        <Span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLOR[member.role] ?? "bg-muted text-muted-foreground"}`}
        >
          {roleLabel}
        </Span>
        {!isPickerMode && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7 px-2"
              onClick={() => onUpdateRole(member.id)}
            >
              {tUpdateRole}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(member.id)}
            >
              {tRemove}
            </Button>
          </>
        )}
      </Div>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MembersListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: tCompanies } = companiesScopedTranslation.scopedT(locale);
  const form = useWidgetForm<typeof definition.GET>();

  const onPick = usePickerCallback<Member>();
  const isPickerMode = !!onPick;

  const companyId = form?.watch("companyId") ?? "";

  const handleInvite = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../invite/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { companyId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleUpdateRole = (memberId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[memberId]/update-role/definition");
      navigation.push(def.default.PATCH, {
        urlPathParams: { companyId, memberId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleRemove = (memberId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../[memberId]/remove/definition");
      navigation.push(def.default.POST, {
        urlPathParams: { companyId, memberId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const members = data?.members ?? [];

  if (!data) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 py-6">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
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

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-6">
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

      <Div className="flex items-center justify-between gap-3">
        <Div className="flex flex-col gap-0.5">
          <Span className="text-lg font-semibold">{t("get.widget.title")}</Span>
          <Span className="text-xs text-muted-foreground">
            {members.length}{" "}
            {members.length === 1
              ? t("get.widget.memberSingular")
              : t("get.widget.memberPlural")}
          </Span>
        </Div>
        {!isPickerMode && (
          <Button size="sm" onClick={handleInvite} className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            {t("get.widget.invite")}
          </Button>
        )}
      </Div>

      {members.length === 0 ? (
        <Div className="py-14 text-center border border-dashed rounded-md flex flex-col items-center gap-4">
          <Users className="h-8 w-8 text-muted-foreground" />
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-medium">
              {t("get.widget.empty.title")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("get.widget.empty.hint")}
            </Span>
          </Div>
          {!isPickerMode && (
            <Button size="sm" onClick={handleInvite} className="gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              {t("get.widget.empty.cta")}
            </Button>
          )}
        </Div>
      ) : (
        <Div className="rounded-md border overflow-hidden">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              onUpdateRole={handleUpdateRole}
              onRemove={handleRemove}
              onPick={onPick}
              isPickerMode={isPickerMode}
              roleLabel={tCompanies(member.role)}
              tUpdateRole={t("get.widget.updateRole")}
              tRemove={t("get.widget.remove")}
              tActive={t("get.widget.active")}
              tInactive={t("get.widget.inactive")}
              locale={locale}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}
