"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

export function RemoveMemberWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const removedId = data?.removedMemberId;

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(): void => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("removeMember.post.widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("removeMember.post.widget.confirmTitle")}
      backButton={backButton}
      secondaryActions={
        !removedId && navigation.canGoBack ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(): void => navigation.pop()}
          >
            {t("removeMember.post.widget.cancelButton")}
          </Button>
        ) : undefined
      }
      primaryAction={
        removedId ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "removeMember.post.widget.confirmButton",
              variant: "destructive",
            }}
          />
        )
      }
    >
      {removedId ? (
        <ResultBanner
          variant="success"
          title={t("removeMember.post.widget.successLabel")}
        >
          {navigation.canGoBack && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(): void => navigation.pop()}
            >
              {t("removeMember.post.widget.back")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        <Div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <Span className="text-sm text-muted-foreground">
            {t("removeMember.post.widget.confirmDescription")}
          </Span>
        </Div>
      )}
    </AdminForm>
  );
}
