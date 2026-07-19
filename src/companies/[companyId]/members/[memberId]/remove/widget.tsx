"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { AlertTriangle } from "next-vibe/ui/ui/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import type definition from "./definition";

export function RemoveMemberWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const [confirmed, setConfirmed] = useState(false);

  const removedId = data?.removedMemberId;

  if (removedId) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <Span className="text-base font-semibold">
            {t("removeMember.post.widget.successLabel")}
          </Span>
        </Div>
        <Button
          size="sm"
          variant="outline"
          onClick={(): void => navigation.pop()}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("removeMember.post.widget.back")}
        </Button>
      </Div>
    );
  }

  if (!confirmed) {
    return (
      <Div className="flex flex-col gap-4">
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(): void => navigation.pop()}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("removeMember.post.widget.back")}
          </Button>
        )}
        <Div className="flex flex-col gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <Div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <Div className="flex flex-col gap-1">
              <Span className="text-sm font-semibold text-destructive">
                {t("removeMember.post.widget.confirmTitle")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {t("removeMember.post.widget.confirmDescription")}
              </Span>
            </Div>
          </Div>
          <Div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={(): void => setConfirmed(true)}
              className="flex-1"
            >
              {t("removeMember.post.widget.confirmButton")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(): void => navigation.pop()}
              className="flex-1"
            >
              {t("removeMember.post.widget.cancelButton")}
            </Button>
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "removeMember.post.widget.confirmButton",
          variant: "destructive",
        }}
      />
    </Div>
  );
}
