/**
 * Vibe Sense - Delete Widget
 * Confirmation UI with delete button and success feedback.
 */

"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Card, CardContent } from "next-vibe/ui/ui/card";
import { Div } from "next-vibe/ui/ui/div";
import { ArrowLeft } from "next-vibe/ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe/ui/ui/icons/Check";
import { Trash } from "next-vibe/ui/ui/icons/Trash";
import { Span } from "next-vibe/ui/ui/span";
import { P } from "next-vibe/ui/ui/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React, { useCallback } from "react";

import type definition from "./definition";

export function DeleteWidget(): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const navigation = useWidgetNavigation();
  const response = useWidgetValue<typeof definition.DELETE>();

  const handleBackToList = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("next-vibe/dataflow/graphs/definition");
      navigation.push(listDef.default.GET);
    })();
  }, [navigation]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Confirmation card */}
      <Card>
        <CardContent className="pt-4">
          <Div className="flex flex-col items-center gap-3 py-4">
            <Trash className="h-10 w-10 text-destructive" />
            <P className="text-sm font-medium text-center">
              {t("delete.description")}
            </P>
            <P className="text-xs text-muted-foreground text-center">
              {t("delete.widget.confirmDescription")}
            </P>
          </Div>
        </CardContent>
      </Card>

      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.DELETE>
        field={{
          text: "delete.title",
          icon: "trash",
          variant: "destructive",
        }}
      />

      {/* Success result */}
      {response !== null && response !== undefined && response.deletedId && (
        <Card className="border-green-300 dark:border-green-700">
          <CardContent className="pt-4">
            <Div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-success shrink-0" />
              <Div className="flex-1">
                <P className="text-sm font-medium">
                  {t("delete.success.title")}
                </P>
                <Div className="flex items-center gap-2 mt-1">
                  <Span className="text-xs text-muted-foreground">
                    {t("delete.widget.deletedIdLabel")}
                  </Span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {response.deletedId}
                  </Badge>
                </Div>
              </Div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToList}
                className="shrink-0 gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                {t("delete.widget.backToList")}
              </Button>
            </Div>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}
