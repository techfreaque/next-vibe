/**
 * Vibe Sense — Archive Widget
 * Confirmation UI with archive button and success feedback.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Archive } from "next-vibe-ui/ui/icons/Archive";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type ArchiveResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: ArchiveResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ArchiveWidget({ field }: CustomWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const response = field.value;

  const handleBackToList = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("../../definition");
      navigation.push(listDef.default.GET);
    })();
  }, [navigation]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Confirmation card */}
      <Card>
        <CardContent className="pt-4">
          <Div className="flex flex-col items-center gap-3 py-4">
            <Archive className="h-10 w-10 text-orange-500" />
            <P className="text-sm font-medium text-center">
              {t("post.description")}
            </P>
            <P className="text-xs text-muted-foreground text-center">
              {t("post.widget.confirmDescription")}
            </P>
          </Div>
        </CardContent>
      </Card>

      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.title",
          icon: "archive",
          variant: "destructive",
        }}
      />

      {/* Success result */}
      {response !== null && response !== undefined && response.archivedId && (
        <Card className="border-green-300 dark:border-green-700">
          <CardContent className="pt-4">
            <Div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-600 shrink-0" />
              <Div className="flex-1">
                <P className="text-sm font-medium">{t("post.success.title")}</P>
                <Div className="flex items-center gap-2 mt-1">
                  <Span className="text-xs text-muted-foreground">
                    {t("post.widget.archivedIdLabel")}
                  </Span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {response.archivedId}
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
                {t("post.widget.backToList")}
              </Button>
            </Div>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}
