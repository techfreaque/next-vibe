"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe/unified-ui/form-fields/email-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

export function MemberInviteWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  if (data?.result?.memberId) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <Div className="flex flex-col gap-1">
            <Span className="text-base font-semibold">
              {t("post.widget.invited")}
            </Span>
            {data.result.role && (
              <Div className="flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  {data.result.role}
                </Badge>
              </Div>
            )}
          </Div>
        </Div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => navigation.pop()}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("post.widget.back")}
        </Button>
      </Div>
    );
  }

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
          {t("post.widget.back")}
        </Button>
      )}
      <Div className="flex flex-col gap-1">
        <Span className="text-lg font-semibold">{t("post.title")}</Span>
        <Span className="text-sm text-muted-foreground">
          {t("post.description")}
        </Span>
      </Div>
      <EmailFieldWidget
        fieldName="email"
        field={withValue(field.children.email, undefined, null)}
      />
      <SelectFieldWidget
        fieldName="role"
        field={withValue(field.children.role, undefined, null)}
      />
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
