/**
 * Bounce Processor Widget
 * Action card for manually running the bounce processor
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import {
  useWidgetContext,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface BounceProcessorWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function BounceProcessorWidget({
  field,
}: BounceProcessorWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.POST>();
  const isSubmitting = endpointMutations?.create?.isSubmitting;
  const response = field.value;

  return (
    <Div className="flex flex-col gap-3 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <Span className="font-semibold text-sm">{t("widget.title")}</Span>
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
        )}
      </Div>

      <P className="text-xs text-muted-foreground">{t("widget.description")}</P>

      <FormAlertWidget field={{}} />

      <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
      <NumberFieldWidget fieldName="batchSize" field={children.batchSize} />

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "widget.runButton",
          loadingText: "widget.running",
          icon: "mail",
          variant: "primary",
        }}
      />

      {/* Result */}
      {response && (
        <Div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3 flex flex-col gap-1">
          <Div className="flex items-center gap-1 text-orange-700 dark:text-orange-300 text-xs font-medium">
            <Check className="h-3 w-3" />
            <Span>{t("widget.done")}</Span>
          </Div>
          <Div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <Span className="text-muted-foreground">
              {t("post.response.bouncesFound")}
            </Span>
            <Span className="font-mono font-medium text-orange-600 dark:text-orange-400">
              {response.bouncesFound}
            </Span>
            <Span className="text-muted-foreground">
              {t("post.response.leadsUpdated")}
            </Span>
            <Span className="font-mono font-medium">
              {response.leadsUpdated}
            </Span>
            <Span className="text-muted-foreground">
              {t("post.response.campaignsCancelled")}
            </Span>
            <Span className="font-mono font-medium">
              {response.campaignsCancelled}
            </Span>
          </Div>
        </Div>
      )}
    </Div>
  );
}
