/**
 * User Role Widgets
 * Grant or remove one permission role. Opened from the admin user detail with
 * user and role prefilled, so the admin only confirms.
 */

"use client";

import { Platform, isCliPlatform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { Pre } from "next-vibe/ui/components/pre";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { roleLabel } from "../../../format";
import type definitions from "./definition";

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
          <>
            <SelectFieldWidget fieldName="role" field={children.role} />
            <SubmitButtonWidget<typeof definitions.POST>
              field={children.submitButton}
            />
          </>
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
          <>
            <SelectFieldWidget fieldName="role" field={children.role} />
            <P className="text-sm text-destructive">
              {t("roles.widget.removeWarning")}
            </P>
            <SubmitButtonWidget<typeof definitions.DELETE>
              field={children.submitButton}
            />
          </>
        )}
      </SectionGroup>
    </WidgetShell>
  );
}
