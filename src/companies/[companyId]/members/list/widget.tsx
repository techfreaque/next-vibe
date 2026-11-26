"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
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

const ROLE_VARIANT: Record<typeof CompanyMemberRoleValue, StatusPillVariant> = {
  [CompanyMemberRole.OWNER]: "warning",
  [CompanyMemberRole.ADMIN]: "info",
  [CompanyMemberRole.ACCOUNTANT]: "default",
  [CompanyMemberRole.MEMBER]: "muted",
  [CompanyMemberRole.VIEWER]: "muted",
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
  locale: ReturnType<typeof useWidgetLocale>;
}): JSX.Element {
  return (
    <Div
      className={`flex flex-col gap-2 px-4 py-3 border-b last:border-b-0 hover:bg-muted/20 transition-colors @md:flex-row @md:items-center @md:gap-3${isPickerMode ? " cursor-pointer" : ""}`}
      onClick={isPickerMode && onPick ? () => onPick(member) : undefined}
    >
      <Div className="flex-1 min-w-0">
        <Span className="text-sm font-medium block truncate">
          {member.name ?? member.email ?? roleLabel}
        </Span>
        {member.name && member.email && (
          <Span className="text-xs text-muted-foreground block truncate">
            {member.email}
          </Span>
        )}
        <Span className="text-xs text-muted-foreground block">
          {member.isActive ? tActive : tInactive}
          {member.joinedAt && ` · ${formatDocDate(member.joinedAt, locale)}`}
        </Span>
      </Div>
      <Div className="flex items-center gap-2 shrink-0 flex-wrap @md:justify-end">
        <StatusPill
          status={member.role}
          label={roleLabel}
          variant={ROLE_VARIANT[member.role] ?? "muted"}
        />
        {!isPickerMode && (
          <>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-xs h-7 px-2"
              onClick={() => onUpdateRole(member.id)}
            >
              {tUpdateRole}
            </Button>
            <Button
              type="button"
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

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("get.widget.back")}
    </Button>
  ) : undefined;

  const members = data?.members ?? [];

  if (!data) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-3xl">
        <WidgetHeader
          size="page"
          title={t("get.widget.title")}
          backButton={backButton}
        />
        <LoadingBlock message={t("get.widget.loading")} />
      </WidgetShell>
    );
  }

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={t("get.widget.title")}
        subtitle={`${members.length} ${
          members.length === 1
            ? t("get.widget.memberSingular")
            : t("get.widget.memberPlural")
        }`}
        backButton={backButton}
        actions={
          !isPickerMode ? (
            <Button
              type="button"
              size="sm"
              onClick={handleInvite}
              className="gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              {t("get.widget.invite")}
            </Button>
          ) : undefined
        }
      />

      {members.length === 0 ? (
        <EmptyBlock
          title={t("get.widget.empty.title")}
          message={t("get.widget.empty.hint")}
          action={
            !isPickerMode
              ? { label: t("get.widget.empty.cta"), onClick: handleInvite }
              : undefined
          }
        />
      ) : (
        <Div className="rounded-lg border bg-card overflow-hidden">
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
    </WidgetShell>
  );
}
