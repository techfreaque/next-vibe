/**
 * Campaign Starter Config Custom Widget
 * Form view organized into card sections
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
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

function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Best-effort parse of a cron expression to get frequency in minutes. Returns 5 as fallback. */
function parseCronFrequencyMinutes(schedule: string): number {
  try {
    const parts = schedule.trim().split(/\s+/);
    if (parts.length < 5) {
      return 5;
    }
    const [minutePart] = parts;
    // Handle */N
    if (minutePart?.startsWith("*/")) {
      const n = parseInt(minutePart.slice(2), 10);
      if (!Number.isNaN(n) && n > 0) {
        return n;
      }
    }
    // Handle single numeric minute - runs once per hour
    if (minutePart && /^\d+$/.test(minutePart)) {
      return 60;
    }
    return 5;
  } catch {
    return 5;
  }
}

function calcPerRunBudget(
  leadsPerWeek: number,
  schedule: string,
  enabledDays: number[],
  enabledHours: { start: number; end: number },
): { exactBudget: number; perRunBudget: number; totalRunsPerWeek: number } {
  const frequencyMinutes = parseCronFrequencyMinutes(schedule);
  const runsPerHour = 60 / frequencyMinutes;
  const enabledHoursCount = Math.max(0, enabledHours.end - enabledHours.start);
  const enabledDaysCount = enabledDays.length;
  const totalRunsPerWeek = runsPerHour * enabledHoursCount * enabledDaysCount;
  if (totalRunsPerWeek <= 0) {
    return { exactBudget: 0, perRunBudget: 0, totalRunsPerWeek: 0 };
  }
  const exactBudget = leadsPerWeek / totalRunsPerWeek;
  return {
    exactBudget,
    perRunBudget: Math.floor(exactBudget),
    totalRunsPerWeek,
  };
}

import { ScheduleAutocomplete } from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/widget/schedule-autocomplete";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
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
  } & (typeof definition.POST)["fields"];
}

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function CampaignStarterConfigContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();
  const savedData = field.value;
  const hasBeenSaved = savedData !== null && savedData !== undefined;
  const isPending = endpointMutations?.update?.isSubmitting;

  const localeConfig = form.watch("localeConfig") ?? {};
  const activeLocales = Object.keys(localeConfig);
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
            <CheckCircle className="h-5 w-5 text-success" />
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

      {/* Guidance - shown before first save */}
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

      {/* Section 3 - Quotas (per locale) */}
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
        <CardContent className="flex flex-col gap-4">
          {activeLocales.map((loc) => (
            <LocaleConfigRow
              key={loc}
              loc={loc}
              localeConfig={localeConfig}
              schedule={form.watch("schedule") ?? "*/5 * * * *"}
              form={form}
              t={t}
            />
          ))}
          {/* Add locale selector */}
          {availableLocales.length > 0 && (
            <Div className="flex items-center gap-2 mt-1">
              <Select
                value=""
                onValueChange={(loc) => {
                  if (!loc) {
                    return;
                  }
                  const current = form.getValues("localeConfig") ?? {};
                  form.setValue("localeConfig", {
                    ...current,
                    [loc]: {
                      leadsPerWeek: 50,
                      enabledDays: [1, 2, 3, 4, 5],
                      enabledHours: { start: 7, end: 15 },
                    },
                  });
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
          <Span className="text-xs text-muted-foreground">
            {t("widget.sections.hoursTimezoneNote", {
              offset: getBrowserTimezone(),
            })}
          </Span>
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
      <SubmitButtonWidget<typeof definition.POST>
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

interface LocaleEntry {
  leadsPerWeek: number;
  enabledDays: number[];
  enabledHours: { start: number; end: number };
}

function PerRunBudgetHint({
  leadsPerWeek,
  schedule,
  enabledDays,
  enabledHours,
  t,
}: {
  leadsPerWeek: number;
  schedule: string;
  enabledDays: number[];
  enabledHours: { start: number; end: number };
  t: ReturnType<typeof useWidgetTranslation<typeof definition.POST>>;
}): React.JSX.Element {
  const { exactBudget, perRunBudget, totalRunsPerWeek } = calcPerRunBudget(
    leadsPerWeek,
    schedule,
    enabledDays,
    enabledHours,
  );

  const isZero = perRunBudget <= 0 && leadsPerWeek > 0;

  return (
    <Div
      className={`flex items-center gap-1.5 text-xs rounded px-2 py-1 ${isZero ? "bg-warning/10 text-warning" : "bg-muted/40 text-muted-foreground"}`}
    >
      <Span>
        {isZero
          ? t("widget.perRunBudgetFractional", {
              exactBudget: exactBudget.toFixed(3),
              totalRunsPerWeek: Math.round(totalRunsPerWeek),
            })
          : t("widget.perRunBudget", {
              perRunBudget,
              totalRunsPerWeek: Math.round(totalRunsPerWeek),
            })}
      </Span>
      {isZero && (
        <Span className="font-medium">{t("widget.perRunBudgetZeroHint")}</Span>
      )}
    </Div>
  );
}

function LocaleConfigRow({
  loc,
  localeConfig,
  schedule,
  form,
  t,
}: {
  loc: string;
  localeConfig: Record<string, LocaleEntry>;
  schedule: string;
  form: ReturnType<typeof useWidgetForm<typeof definition.POST>>;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.POST>>;
}): React.JSX.Element {
  const entry = localeConfig[loc] ?? {
    leadsPerWeek: 0,
    enabledDays: [1, 2, 3, 4, 5],
    enabledHours: { start: 7, end: 15 },
  };

  function updateEntry(patch: Partial<LocaleEntry>): void {
    const current = form.getValues("localeConfig") ?? {};
    form.setValue("localeConfig", {
      ...current,
      [loc]: { ...entry, ...patch },
    });
  }

  return (
    <Div className="border rounded-md p-3 flex flex-col gap-3">
      {/* Locale label + quota */}
      <Div className="flex items-center gap-3">
        <Label className="w-24 font-semibold text-sm shrink-0">{loc}</Label>
        <Div className="flex items-center gap-2">
          <Span className="text-xs text-muted-foreground">
            {t("put.leadsPerWeek.label")}
          </Span>
          <Input
            type="number"
            min={1}
            className="w-24 h-7 text-sm"
            value={entry.leadsPerWeek}
            onChange={(e) => {
              const num = Number(e.target.value);
              if (!Number.isNaN(num) && num >= 1) {
                updateEntry({ leadsPerWeek: num });
              }
            }}
          />
        </Div>
        <Button
          type="button"
          variant="ghost"
          className="ml-auto text-xs text-muted-foreground hover:text-destructive h-6 px-2"
          onClick={() => {
            const current = form.getValues("localeConfig") ?? {};
            const updated = { ...current };
            delete updated[loc];
            form.setValue("localeConfig", updated);
          }}
        >
          ✕
        </Button>
      </Div>

      {/* Enabled days */}
      <Div className="flex flex-wrap gap-1.5">
        {DAY_OPTIONS.map((day, i) => {
          const active = entry.enabledDays.includes(day);
          return (
            <Button
              key={day}
              type="button"
              variant={active ? "default" : "outline"}
              className="px-2 py-0.5 h-6 text-xs"
              onClick={() => {
                const days = active
                  ? entry.enabledDays.filter((d) => d !== day)
                  : [...entry.enabledDays, day].toSorted((a, b) => a - b);
                updateEntry({ enabledDays: days });
              }}
            >
              {DAY_LABELS[i]}
            </Button>
          );
        })}
      </Div>

      {/* Hours (local time) */}
      <Div className="flex items-center gap-3">
        <Span className="text-xs text-muted-foreground w-16">
          {t("put.enabledHours.start.label")}
        </Span>
        <Input
          type="number"
          min={0}
          max={23}
          className="w-16 h-7 text-sm"
          value={entry.enabledHours.start}
          onChange={(e) => {
            const val = Math.max(0, Math.min(23, Number(e.target.value)));
            updateEntry({
              enabledHours: { ...entry.enabledHours, start: val },
            });
          }}
        />
        <Span className="text-xs text-muted-foreground w-16">
          {t("put.enabledHours.end.label")}
        </Span>
        <Input
          type="number"
          min={0}
          max={23}
          className="w-16 h-7 text-sm"
          value={entry.enabledHours.end}
          onChange={(e) => {
            const val = Math.max(0, Math.min(23, Number(e.target.value)));
            updateEntry({ enabledHours: { ...entry.enabledHours, end: val } });
          }}
        />
      </Div>

      {/* Per-run budget preview */}
      <PerRunBudgetHint
        leadsPerWeek={entry.leadsPerWeek}
        schedule={schedule}
        enabledDays={entry.enabledDays}
        enabledHours={entry.enabledHours}
        t={t}
      />
    </Div>
  );
}
