/**
 * Email Campaigns Widget
 * Action card for manually running the email campaigns processor
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

interface EmailCampaignsWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function EmailCampaignsWidget({
  field,
}: EmailCampaignsWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.POST>();
  const isSubmitting = endpointMutations?.create?.isSubmitting;
  const response = field.value;

  return (
    <Div className="flex flex-col gap-3 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <Span className="font-semibold text-sm">{t("widget.title")}</Span>
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
        )}
      </Div>

      <P className="text-xs text-muted-foreground">{t("widget.description")}</P>

      <FormAlertWidget field={{}} />

      <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
      <NumberFieldWidget fieldName="batchSize" field={children.batchSize} />
      <NumberFieldWidget
        fieldName="maxEmailsPerRun"
        field={children.maxEmailsPerRun}
      />

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
        <Div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 flex flex-col gap-1">
          <Div className="flex items-center gap-1 text-blue-700 dark:text-blue-300 text-xs font-medium">
            <Check className="h-3 w-3" />
            <Span>{t("widget.done")}</Span>
          </Div>
          <Div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <Span className="text-muted-foreground">
              {t("post.response.emailsScheduled")}
            </Span>
            <Span className="font-mono font-medium">
              {response.emailsScheduled}
            </Span>
            <Span className="text-muted-foreground">
              {t("post.response.emailsSent")}
            </Span>
            <Span className="font-mono font-medium text-blue-600 dark:text-blue-400">
              {response.emailsSent}
            </Span>
            <Span className="text-muted-foreground">
              {t("post.response.emailsFailed")}
            </Span>
            <Span className="font-mono font-medium text-red-600 dark:text-red-400">
              {response.emailsFailed}
            </Span>
            <Span className="text-muted-foreground">
              {t("post.response.leadsProcessed")}
            </Span>
            <Span className="font-mono font-medium">
              {response.leadsProcessed}
            </Span>
          </Div>
        </Div>
      )}
    </Div>
  );
}
