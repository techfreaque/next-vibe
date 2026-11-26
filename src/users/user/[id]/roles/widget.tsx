/**
 * User Role Widgets
 * Grant or remove one permission role. Opened from the admin user detail with
 * user and role prefilled, so the admin only confirms.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Pre } from "next-vibe/ui/components/pre";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { scopedTranslation as commonText } from "next-vibe/unified-ui/hooks/i18n";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { CompactFieldHelpContext } from "next-vibe/unified-ui/widgets/form-fields/_shared/description-style";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX, ReactNode } from "react";

import { roleLabel } from "../../../format";
import { scopedTranslation as profileText } from "../../../view/i18n";
import userDefinition from "../definition";
import type definitions from "./definition";

function RoleTarget({
  id,
  picker,
  children,
}: {
  id: string | undefined;
  picker: ReactNode;
  children: ReactNode;
}): JSX.Element {
  const locale = useWidgetLocale();
  const account = profileText.scopedT(locale).t;
  const read = useEndpoint(
    { GET: userDefinition.GET },
    {
      read: {
        urlPathParams: { id: id ?? "" },
        queryOptions: { enabled: Boolean(id) },
      },
    },
    useWidgetLogger(),
    useWidgetUser(),
  ).read;
  const info = read?.data?.userProfile.basicInfo;
  const error = read?.response?.success === false ? read.response : undefined;
  return (
    <Div className="flex min-w-0 flex-col gap-3">
      {picker}
      {id && info?.id === id ? (
        <>
          <Div className="flex min-w-0 flex-col gap-0.5 rounded-lg border bg-muted/30 px-3 py-2">
            <Span className="font-medium [overflow-wrap:anywhere]">
              {info.privateName || info.publicName || info.email}
            </Span>
            {(info.privateName || info.publicName) && (
              <Span className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
                {info.email}
              </Span>
            )}
          </Div>
          <CompactFieldHelpContext.Provider value={true}>
            {children}
          </CompactFieldHelpContext.Provider>
        </>
      ) : id && error ? (
        <EmptyBlock
          title={account("widget.unavailable")}
          message={error.message}
          action={
            canRetryRecordRead(error.errorType.errorCode)
              ? {
                  label: account("widget.actions.retry"),
                  onClick: () => void read?.refetch(),
                }
              : undefined
          }
        />
      ) : id ? (
        <LoadingBlock message={account("widget.loading")} />
      ) : null}
    </Div>
  );
}

export function UserRoleAddContainer({
  field,
}: {
  field: (typeof definitions.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const value = useWidgetValue<typeof definitions.POST>();
  const form = useWidgetForm<typeof definitions.POST>();
  const children = field.children;

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return (
      <Pre>
        {value
          ? t("roles.widget.added", {
              role: roleLabel(value.assignedRole, locale),
            })
          : ""}
      </Pre>
    );
  }

  return (
    <WidgetShell>
      <SectionGroup title={t("roles.post.container.title")}>
        <P className="text-sm text-muted-foreground">
          {t("roles.widget.addHint")}
        </P>
        <FormAlertWidget field={{}} />
        {value ? (
          <Div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">
            {t("roles.widget.added", {
              role: roleLabel(value.assignedRole, locale),
            })}
          </Div>
        ) : (
          <RoleTarget
            id={form.watch("id")}
            picker={
              <EntityPickerFieldWidget fieldName="id" field={children.id} />
            }
          >
            <SelectFieldWidget fieldName="role" field={children.role} />
            {form.watch("role") && (
              <SubmitButtonWidget<typeof definitions.POST>
                field={children.submitButton}
              />
            )}
          </RoleTarget>
        )}
      </SectionGroup>
    </WidgetShell>
  );
}

export function UserRoleRemoveContainer({
  field,
}: {
  field: (typeof definitions.DELETE)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.DELETE>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const form = useWidgetForm<typeof definitions.DELETE>();
  const value = useWidgetValue<typeof definitions.DELETE>();
  const children = field.children;
  const { canGoBack, pop } = useWidgetNavigation();
  const isSubmitting = useWidgetIsSubmitting();
  const common = commonText.scopedT(locale).t;
  const role = form.watch("role");
  const label = role ? roleLabel(role, locale) : "";

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return (
      <Pre>
        {value?.success ? t("roles.widget.removed", { role: label }) : ""}
      </Pre>
    );
  }

  return (
    <WidgetShell>
      <SectionGroup title={t("roles.delete.container.title")}>
        <FormAlertWidget field={{}} />
        {value?.success ? (
          <Div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">
            {t("roles.widget.removed", { role: label })}
          </Div>
        ) : (
          <RoleTarget
            id={form.watch("id")}
            picker={
              <EntityPickerFieldWidget fieldName="id" field={children.id} />
            }
          >
            <SelectFieldWidget fieldName="role" field={children.role} />
            {role && (
              <P className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-foreground">
                {t("roles.widget.removeWarning")}
              </P>
            )}
            <Div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              {canGoBack && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => pop()}
                >
                  {common("widgets.endpointRenderer.cancel")}
                </Button>
              )}
              {role && (
                <SubmitButtonWidget<typeof definitions.DELETE>
                  field={{ ...children.submitButton, variant: "destructive" }}
                />
              )}
            </Div>
          </RoleTarget>
        )}
      </SectionGroup>
    </WidgetShell>
  );
}
