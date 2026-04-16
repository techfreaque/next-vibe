/**
 * Vibe Sense - Promote Widget
 * Confirmation UI with graph info and big promote button.
 * Shows promoted ID on success with navigation link.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

export function PromoteWidget(): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const response = useWidgetValue<typeof definition.POST>();

  const handleNavigateToPromoted = useCallback((): void => {
    if (!response?.promotedId) {
      return;
    }
    void (async (): Promise<void> => {
      const viewDef = await import("../data/definition");
      navigation.push(viewDef.default.GET, {
        urlPathParams: { id: response.promotedId },
      });
    })();
  }, [navigation, response]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Confirmation card */}
      <Card>
        <CardContent className="pt-4">
          <Div className="flex flex-col items-center gap-3 py-4">
            <Shield className="h-10 w-10 text-primary" />
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
        field={{ text: "post.title", icon: "shield" }}
      />

      {/* Success result */}
      {response !== null && response !== undefined && response.promotedId && (
        <Card className="border-green-300 dark:border-green-700">
          <CardContent className="pt-4">
            <Div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-success shrink-0" />
              <Div className="flex-1">
                <P className="text-sm font-medium">{t("post.success.title")}</P>
                <Div className="flex items-center gap-2 mt-1">
                  <Span className="text-xs text-muted-foreground">
                    {t("post.widget.promotedIdLabel")}
                  </Span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {response.promotedId}
                  </Badge>
                </Div>
              </Div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateToPromoted}
                className="shrink-0"
              >
                {t("post.widget.viewButton")}
              </Button>
            </Div>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}
