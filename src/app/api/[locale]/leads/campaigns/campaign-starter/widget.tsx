/**
 * Campaign Starter Widget
 * Styled action card for running the campaign starter
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import {
  useWidgetContext,
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CampaignStarterWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function CampaignStarterWidget({
  field,
}: CampaignStarterWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const isSubmitting = endpointMutations?.create?.isSubmitting;
  const response = field.value;

  // Always force=true from UI so manual runs bypass the day/hour schedule
  React.useEffect(() => {
    form.setValue("force", true);
  }, [form]);

  return (
    <Div className="flex flex-col gap-3 p-4 border-green-200 dark:border-green-800">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
        <Span className="font-semibold text-sm">{t("widget.title")}</Span>
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
        )}
      </Div>

      <P className="text-xs text-muted-foreground">{t("widget.description")}</P>

      <FormAlertWidget field={{}} />

      {/* Dry run toggle */}
      <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />

      {/* Submit */}
      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "widget.runButton",
          loadingText: "widget.running",
          icon: "zap",
          variant: "primary",
        }}
      />

      {/* Success result */}
      {response && (
        <Div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 flex flex-col gap-1">
          <Div className="flex items-center gap-1 text-green-700 dark:text-green-300 text-xs font-medium">
            <Check className="h-3 w-3" />
            <Span>{t("widget.done")}</Span>
          </Div>
          <Div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <Span className="text-muted-foreground">
              {t("post.response.leadsProcessed")}
            </Span>
            <Span className="font-mono font-medium">
              {response.leadsProcessed}
            </Span>
            <Span className="text-muted-foreground">
              {t("post.response.leadsStarted")}
            </Span>
            <Span className="font-mono font-medium text-green-600 dark:text-green-400">
              {response.leadsStarted}
            </Span>
            <Span className="text-muted-foreground">
              {t("post.response.leadsSkipped")}
            </Span>
            <Span className="font-mono font-medium">
              {response.leadsSkipped}
            </Span>
            <Span className="text-muted-foreground">
              {t("post.response.executionTimeMs")}
            </Span>
            <Span className="font-mono font-medium">
              {response.executionTimeMs}ms
            </Span>
          </Div>
        </Div>
      )}
    </Div>
  );
}
