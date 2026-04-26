/**
 * Bounce Processor Config Widget
 * Form organized into card sections for configuring the bounce processor cron task
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { Wrench } from "next-vibe-ui/ui/icons/Wrench";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { ScheduleAutocomplete } from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/widget/schedule-autocomplete";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function BounceProcessorConfigWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();

  const savedData = useWidgetValue<typeof definition.GET>();
  const hasBeenSaved = savedData !== null && savedData !== undefined;
  const isPending = endpointMutations?.update?.isSubmitting;

  return (
    <Div className="flex flex-col gap-5 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <Div className="flex items-center gap-2 mr-auto">
          {hasBeenSaved ? (
            <CheckCircle className="h-5 w-5 text-success" />
          ) : (
            <Mail className="h-5 w-5 text-muted-foreground" />
          )}
          <Span className="font-semibold text-base">
            {hasBeenSaved ? t("widget.titleSaved") : t("widget.title")}
          </Span>
        </Div>
        {isPending && (
          <Span className="text-xs text-muted-foreground animate-pulse">
            {t("widget.saving")}
          </Span>
        )}
      </Div>

      {/* Guidance - shown before first save */}
      {!hasBeenSaved && !isPending && (
        <Div className="rounded-lg border border-dashed bg-muted/30 p-5 flex flex-col gap-3">
          <Div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <Div className="flex flex-col gap-1">
              <Span className="text-sm font-medium">
                {t("widget.guidanceTitle")}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("widget.guidanceDescription")}
              </Span>
            </Div>
          </Div>
        </Div>
      )}

      <FormAlertWidget field={{}} />

      {/* Section 1 - General */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            {t("widget.sections.general")}
          </CardTitle>
          <Span className="text-xs text-muted-foreground">
            {t("widget.sections.generalDescription")}
          </Span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <BooleanFieldWidget fieldName="enabled" field={children.enabled} />
          <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
        </CardContent>
      </Card>

      {/* Section 2 - Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {t("widget.sections.schedule")}
          </CardTitle>
          <Span className="text-xs text-muted-foreground">
            {t("widget.sections.scheduleDescription")}
          </Span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Div className="flex flex-col gap-1.5">
            <Span className="text-sm font-medium">
              {t("put.schedule.label")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("put.schedule.description")}
            </Span>
            <ScheduleAutocomplete
              value={form.watch("schedule") ?? ""}
              onChange={(value) => form.setValue("schedule", value)}
              onBlur={() => {
                void form.trigger("schedule");
              }}
              locale={locale}
            />
          </Div>
        </CardContent>
      </Card>

      {/* Section 3 - Processing */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {t("widget.sections.processing")}
          </CardTitle>
          <Span className="text-xs text-muted-foreground">
            {t("widget.sections.processingDescription")}
          </Span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <NumberFieldWidget fieldName="batchSize" field={children.batchSize} />
        </CardContent>
      </Card>

      {/* Section 4 - Advanced */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            {t("widget.sections.advanced")}
          </CardTitle>
          <Span className="text-xs text-muted-foreground">
            {t("widget.sections.advancedDescription")}
          </Span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <SelectFieldWidget fieldName="priority" field={children.priority} />
          <NumberFieldWidget fieldName="timeout" field={children.timeout} />
          <NumberFieldWidget fieldName="retries" field={children.retries} />
          <NumberFieldWidget
            fieldName="retryDelay"
            field={children.retryDelay}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <Div className="flex gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <SubmitButtonWidget<typeof definition.POST>
          field={children.submitButton}
        />
      </Div>
    </Div>
  );
}
