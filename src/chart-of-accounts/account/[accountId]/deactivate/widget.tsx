"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoaAccountDeactivateWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const done = data?.deactivated !== undefined;

  return (
    <AdminForm
      title={t("post.widget.confirmTitle")}
      secondaryActions={
        !done && navigation.canGoBack ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            type="button"
          >
            {t("post.widget.cancelButton")}
          </Button>
        ) : undefined
      }
      primaryAction={
        done ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "post.widget.confirmButton",
              variant: "destructive",
            }}
          />
        )
      }
    >
      {done ? (
        <ResultBanner
          variant="success"
          title={t("post.widget.doneLabel")}
          message={t("post.success.description")}
        />
      ) : (
        <Div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <P className="text-sm text-muted-foreground">
            {t("post.widget.confirmDescription")}
          </P>
        </Div>
      )}
    </AdminForm>
  );
}
