/**
 * Campaign Starter Config Custom Widget
 * Form view organized into card sections
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Rocket } from "next-vibe-ui/ui/icons/Rocket";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Wrench } from "next-vibe-ui/ui/icons/Wrench";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { ScheduleAutocomplete } from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/widget/schedule-autocomplete";
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
}

export function CampaignStarterConfigContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.PUT>();

  const savedData = field.value;
  const hasBeenSaved = savedData !== null && savedData !== undefined;
  const isPending = endpointMutations?.update?.isSubmitting;

  const leadsPerWeek = form?.watch("leadsPerWeek") ?? {};
  const activeLocales = Object.keys(leadsPerWeek).filter(
    (loc) => typeof leadsPerWeek[loc] === "number" && leadsPerWeek[loc] > 0,
  );
  const availableLocales = Object.values(CountryLanguageValues).filter(
    (loc) => !activeLocales.includes(loc),
  );

  return (
    <Div className="flex flex-col gap-5 p-4">
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
            {hasBeenSaved ? t("widget.titleSaved") : t("widget.title")}
          </Span>
        </Div>
        {isPending && (
          <Span className="text-xs text-muted-foreground animate-pulse">
            {t("widget.saving")}
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

      {/* Section 1 — General */}
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

      {/* Section 2 — Schedule */}
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
              {t("post.schedule.label")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("post.schedule.description")}
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
        </CardContent>
      </Card>

      {/* Section 3 — Quotas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {t("widget.sections.quotas")}
          </CardTitle>
          <Span className="text-xs text-muted-foreground">
            {t("widget.sections.quotasDescription")}
          </Span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Div className="flex flex-col gap-1.5">
            <Span className="text-sm font-medium">
              {t("post.leadsPerWeek.label")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("post.leadsPerWeek.description")}
            </Span>
            <Div className="flex flex-col gap-2">
              {activeLocales.map((loc) => (
                <Div key={loc} className="flex items-center gap-3">
                  <Label className="w-24 font-medium text-sm shrink-0">
                    {loc}
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    className="w-32"
                    value={leadsPerWeek[loc] ?? 0}
                    onChange={(e) => {
                      const num = e.target.value;
                      const current = form?.getValues("leadsPerWeek") ?? {};
                      if (Number.isNaN(num) || num < 1) {
                        const updated = { ...current };
                        delete updated[loc];
                        form?.setValue("leadsPerWeek", updated);
                      } else {
                        form?.setValue("leadsPerWeek", {
                          ...current,
                          [loc]: num,
                        });
                      }
                    }}
                  />
                </Div>
              ))}
            </Div>
            {/* Add locale selector */}
            {availableLocales.length > 0 && (
              <Div className="flex items-center gap-2 mt-1">
                <Select
                  value=""
                  onValueChange={(loc) => {
                    if (!loc) {
                      return;
                    }
                    const current = form?.getValues("leadsPerWeek") ?? {};
                    form?.setValue("leadsPerWeek", { ...current, [loc]: 50 });
                  }}
                >
                  <SelectTrigger className="w-48 h-8 text-sm">
                    <SelectValue placeholder={t("widget.addLocale")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocales.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Div>
            )}
          </Div>
        </CardContent>
      </Card>

      {/* Section 4 — Advanced */}
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
          <NumberFieldWidget
            fieldName="minAgeHours"
            field={children.minAgeHours}
          />
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
      <SubmitButtonWidget<typeof definition.PUT>
        field={{
          text: "widget.save",
          loadingText: "widget.saving",
          icon: "save",
          variant: "primary",
        }}
      />
    </Div>
  );
}
