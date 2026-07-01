/**
 * Cortex Backfill Widget (Web)
 * Embedding backfill trigger and result display.
 */

"use client";

import { useTranslation } from "next-vibe/core/i18n/core/client";
import { Badge } from "next-vibe/ui/web/ui/badge";
import { Card, CardContent } from "next-vibe/ui/web/ui/card";
import { Div } from "next-vibe/ui/web/ui/div";
import { Cpu } from "next-vibe/ui/web/ui/icons/Cpu";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetDisabled,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";

import type definition from "./definition";
import { scopedTranslation } from "./i18n";

export function CortexBackfillWidget(): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  const isDisabled = useWidgetDisabled();
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-4">
      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
          <Span className="text-sm text-muted-foreground">
            {t("post.widget.hint")}
          </Span>
          <FormAlertWidget field={{}} />
          <Div className="flex gap-2">
            <SubmitButtonWidget<typeof definition.POST>
              field={{
                text: "post.submitButton.label",
                loadingText: "post.submitButton.loadingText",
                icon: "cpu",
                variant: "primary",
              }}
            />
          </Div>
        </Div>
      )}

      {/* Response */}
      {value && (
        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardContent className="p-4">
            <Div className="flex items-center gap-3">
              <Div className="rounded-full bg-violet-500/10 p-2">
                <Cpu className="h-4 w-4 text-violet-500" />
              </Div>
              <Div className="flex items-center gap-2">
                <Badge variant="default">
                  {value.processed} {t("post.response.processed.text")}
                </Badge>
                {value.failed > 0 && (
                  <Badge variant="destructive">
                    {value.failed} {t("post.response.failed.text")}
                  </Badge>
                )}
                {value.skipped > 0 && (
                  <Badge variant="secondary">
                    {value.skipped} {t("post.response.skipped.text")}
                  </Badge>
                )}
              </Div>
            </Div>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}
