/**
 * Campaign Starter Config Custom Widget
 * Form view and success state for campaign starter configuration
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle, Rocket, Settings } from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { ScheduleAutocomplete } from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/_components/schedule-autocomplete";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import MultiSelectFieldWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { CountryLanguageValues } from "@/i18n/core/config";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
  fieldName: string;
}

export function CampaignStarterConfigContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.PUT>();

  const savedData = field.value;
  const hasBeenSaved = savedData !== null && savedData !== undefined;
  const isPending = endpointMutations?.update?.isSubmitting;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          {hasBeenSaved ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Settings className="h-5 w-5 text-muted-foreground" />
          )}
          <Span className="font-semibold text-base">
            {hasBeenSaved
              ? t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.titleSaved",
                )
              : t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.title",
                )}
          </Span>
        </Div>
        {isPending && (
          <Span className="text-xs text-muted-foreground animate-pulse">
            {t(
              "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.saving",
            )}
          </Span>
        )}
      </Div>

      {/* Guidance — shown before first save */}
      {!hasBeenSaved && !isPending && (
        <Div className="rounded-lg border border-dashed bg-muted/30 p-5 flex flex-col gap-3">
          <Div className="flex items-start gap-3">
            <Rocket className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <Div className="flex flex-col gap-1">
              <Span className="text-sm font-medium">
                {t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.guidanceTitle",
                )}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t(
                  "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.guidanceDescription",
                )}
              </Span>
            </Div>
          </Div>
        </Div>
      )}

      {/* Form */}
      <Div className="flex flex-col gap-3">
        <FormAlertWidget field={{}} />

        <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
        <NumberFieldWidget
          fieldName="minAgeHours"
          field={children.minAgeHours}
        />
        <MultiSelectFieldWidget
          fieldName="enabledDays"
          field={children.enabledDays}
        />
        <NumberFieldWidget
          fieldName="enabledHours.start"
          field={children.enabledHours.children.start}
        />
        <NumberFieldWidget
          fieldName="enabledHours.end"
          field={children.enabledHours.children.end}
        />

        {/* Leads per week — one number input per locale */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-sm font-medium">
            {t(
              "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.post.leadsPerWeek.label",
            )}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t(
              "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.post.leadsPerWeek.description",
            )}
          </Span>
          <Div className="flex flex-col gap-2">
            {Object.values(CountryLanguageValues).map((loc) => (
              <Div key={loc} className="flex items-center gap-3">
                <Label className="w-24 font-medium text-sm">{loc}</Label>
                <Input
                  type="number"
                  min={1}
                  className="w-32"
                  value={form?.watch("leadsPerWeek")?.[loc] ?? 0}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    if (!Number.isNaN(num) && num >= 1) {
                      form?.setValue("leadsPerWeek", {
                        ...(form.getValues("leadsPerWeek") ?? {}),
                        [loc]: num,
                      });
                    }
                  }}
                />
              </Div>
            ))}
          </Div>
        </Div>

        {/* Schedule — ScheduleAutocomplete */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-sm font-medium">
            {t(
              "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.post.schedule.label",
            )}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t(
              "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.post.schedule.description",
            )}
          </Span>
          <ScheduleAutocomplete
            value={form?.watch("schedule") ?? ""}
            onChange={(value) => form?.setValue("schedule", value)}
            onBlur={() => {
              void form?.trigger("schedule");
            }}
            locale={locale}
          />
        </Div>

        <BooleanFieldWidget fieldName="enabled" field={children.enabled} />
        <SelectFieldWidget fieldName="priority" field={children.priority} />
        <NumberFieldWidget fieldName="timeout" field={children.timeout} />
        <NumberFieldWidget fieldName="retries" field={children.retries} />
        <NumberFieldWidget fieldName="retryDelay" field={children.retryDelay} />
        <SubmitButtonWidget
          field={{
            text: "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.post.success.title",
            loadingText:
              "app.api.leads.campaigns.campaignStarter.campaignStarterConfig.widget.saving",
            icon: "save",
            variant: "primary",
          }}
        />
      </Div>
    </Div>
  );
}
