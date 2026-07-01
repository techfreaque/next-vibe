"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { Span } from "next-vibe/ui/web/ui/span";
import { H4, P } from "next-vibe/ui/web/ui/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoaPeriodCloseWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const [confirmed, setConfirmed] = useState(false);

  if (data?.closed !== undefined) {
    return (
      <Div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/20">
        <Span className="text-sm font-medium">
          {t("post.success.description")}
        </Span>
        <Badge
          variant={data.closed ? "default" : "destructive"}
          className="text-xs"
        >
          {data.closed
            ? t("post.widget.closedLabel")
            : t("post.widget.failedLabel")}
        </Badge>
      </Div>
    );
  }

  if (!confirmed) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border border-destructive/40 bg-destructive/5">
        <Div className="flex flex-col gap-1">
          <H4 className="text-sm font-semibold text-destructive">
            {t("post.widget.confirmTitle")}
          </H4>
          <P className="text-sm text-muted-foreground">
            {t("post.widget.confirmDescription")}
          </P>
        </Div>
        <Div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmed(true)}
            type="button"
          >
            {t("post.widget.confirmButton")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            type="button"
          >
            {t("post.widget.cancelButton")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
