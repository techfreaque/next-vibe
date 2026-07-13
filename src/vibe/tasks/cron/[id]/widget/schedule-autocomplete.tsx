"use client";

/**
 * CronSchedulePicker
 * Noob-proof schedule builder: preset grid + custom frequency builder.
 * No raw cron expressions shown to the user.
 */
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getDefaultTimezone } from "next-vibe/core/i18n/core/localization-utils";
import { cn } from "next-vibe/core/utils/utils";
import { scopedTranslation as cronIdScopedTranslation } from "next-vibe/tasks/cron/[id]/i18n";
import {
  calculateNextExecutionTime,
  formatCronSchedule,
  formatCronScheduleShort,
  validateCronSchedule,
} from "next-vibe/tasks/cron-formatter";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Calendar } from "next-vibe/ui/ui/icons/Calendar";
import { ChevronDown } from "next-vibe/ui/ui/icons/ChevronDown";
import { Clock } from "next-vibe/ui/ui/icons/Clock";
import { Input } from "next-vibe/ui/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe/ui/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/ui/select";
import { Span } from "next-vibe/ui/ui/span";
import type { JSX } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Preset definitions
// ---------------------------------------------------------------------------

interface Preset {
  key: string;
  cron: string;
  group: "minutes" | "hours" | "daily" | "weekly" | "monthly";
}

const PRESETS: Preset[] = [
  // Minutes
  { key: "everyMinute", cron: "* * * * *", group: "minutes" },
  { key: "every5m", cron: "*/5 * * * *", group: "minutes" },
  { key: "every15m", cron: "*/15 * * * *", group: "minutes" },
  { key: "every30m", cron: "*/30 * * * *", group: "minutes" },
  // Hours
  { key: "everyHour", cron: "0 * * * *", group: "hours" },
  { key: "every2h", cron: "0 */2 * * *", group: "hours" },
  { key: "every4h", cron: "0 */4 * * *", group: "hours" },
  { key: "every6h", cron: "0 */6 * * *", group: "hours" },
  { key: "every12h", cron: "0 */12 * * *", group: "hours" },
  // Daily
  { key: "dailyMidnight", cron: "0 0 * * *", group: "daily" },
  { key: "daily6am", cron: "0 6 * * *", group: "daily" },
  { key: "dailyNoon", cron: "0 12 * * *", group: "daily" },
  { key: "daily6pm", cron: "0 18 * * *", group: "daily" },
  // Weekly
  { key: "weeklyMon", cron: "0 6 * * 1", group: "weekly" },
  { key: "weeklySun", cron: "0 0 * * 0", group: "weekly" },
  // Monthly
  { key: "monthlyFirst", cron: "0 0 1 * *", group: "monthly" },
];

type PresetGroup = Preset["group"];

const GROUP_ORDER: PresetGroup[] = [
  "minutes",
  "hours",
  "daily",
  "weekly",
  "monthly",
];

// ---------------------------------------------------------------------------
// Custom builder types
// ---------------------------------------------------------------------------

type FrequencyUnit = "minutes" | "hours" | "days" | "weeks" | "months";

const WEEKDAY_INDICES = [1, 2, 3, 4, 5, 6, 0] as const; // Mon-Sun order

interface CustomState {
  interval: number;
  unit: FrequencyUnit;
  timeHour: number;
  timeMinute: number;
  weekdays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
}

function buildCron(s: CustomState): string {
  const { interval, unit, timeHour, timeMinute, weekdays } = s;
  const mm = String(timeMinute).padStart(2, "0");
  const hh = String(timeHour).padStart(2, "0");
  switch (unit) {
    case "minutes":
      return interval === 1 ? "* * * * *" : `*/${interval} * * * *`;
    case "hours":
      return interval === 1 ? `${mm} * * * *` : `${mm} */${interval} * * *`;
    case "days":
      return interval === 1
        ? `${mm} ${hh} * * *`
        : `${mm} ${hh} */${interval} * *`;
    case "weeks": {
      const days =
        weekdays.length > 0
          ? weekdays.toSorted((a, b) => a - b).join(",")
          : "1";
      return `${mm} ${hh} * * ${days}`;
    }
    case "months":
      return interval === 1
        ? `${mm} ${hh} 1 * *`
        : `${mm} ${hh} 1 */${interval} *`;
    default:
      return "0 * * * *";
  }
}

function defaultCustomState(): CustomState {
  return {
    interval: 1,
    unit: "hours",
    timeHour: 9,
    timeMinute: 0,
    weekdays: [1, 2, 3, 4, 5], // Mon-Fri
  };
}

function cronToCustomState(cron: string): CustomState | null {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return null;
  }
  const [min, hr, dom, month, dow] = parts;

  // Every N minutes: */N * * * *
  if (hr === "*" && dom === "*" && month === "*" && dow === "*") {
    if (min === "*") {
      return {
        interval: 1,
        unit: "minutes",
        timeHour: 0,
        timeMinute: 0,
        weekdays: [],
      };
    }
    if (min.startsWith("*/")) {
      const n = parseInt(min.slice(2), 10);
      if (!isNaN(n)) {
        return {
          interval: n,
          unit: "minutes",
          timeHour: 0,
          timeMinute: 0,
          weekdays: [],
        };
      }
    }
    // At :MM every hour
    const mm = parseInt(min, 10);
    if (!isNaN(mm) && !min.includes("*")) {
      return {
        interval: 1,
        unit: "hours",
        timeHour: 0,
        timeMinute: mm,
        weekdays: [],
      };
    }
  }

  // Every N hours: MM */N * * * or MM * * * *
  if (dom === "*" && month === "*" && dow === "*") {
    if (hr === "*") {
      const mm = parseInt(min, 10);
      return {
        interval: 1,
        unit: "hours",
        timeHour: 0,
        timeMinute: isNaN(mm) ? 0 : mm,
        weekdays: [],
      };
    }
    if (hr.startsWith("*/")) {
      const n = parseInt(hr.slice(2), 10);
      const mm = parseInt(min, 10);
      if (!isNaN(n)) {
        return {
          interval: n,
          unit: "hours",
          timeHour: 0,
          timeMinute: isNaN(mm) ? 0 : mm,
          weekdays: [],
        };
      }
    }
  }

  // Weekly: MM HH * * DOW
  if (dom === "*" && month === "*" && dow !== "*" && !dow.includes("/")) {
    const hh = parseInt(hr, 10);
    const mm = parseInt(min, 10);
    const days = dow
      .split(",")
      .map((s) => parseInt(s, 10))
      .filter((d) => !isNaN(d));
    return {
      interval: 1,
      unit: "weeks",
      timeHour: isNaN(hh) ? 0 : hh,
      timeMinute: isNaN(mm) ? 0 : mm,
      weekdays: days,
    };
  }

  // Daily: MM HH * * * or MM HH */N * *
  if (dow === "*" && month === "*") {
    const hh = parseInt(hr, 10);
    const mm = parseInt(min, 10);
    if (dom === "*") {
      return {
        interval: 1,
        unit: "days",
        timeHour: isNaN(hh) ? 0 : hh,
        timeMinute: isNaN(mm) ? 0 : mm,
        weekdays: [],
      };
    }
    if (dom.startsWith("*/")) {
      const n = parseInt(dom.slice(2), 10);
      if (!isNaN(n)) {
        return {
          interval: n,
          unit: "days",
          timeHour: isNaN(hh) ? 0 : hh,
          timeMinute: isNaN(mm) ? 0 : mm,
          weekdays: [],
        };
      }
    }
    if (dom === "1") {
      return {
        interval: 1,
        unit: "months",
        timeHour: isNaN(hh) ? 0 : hh,
        timeMinute: isNaN(mm) ? 0 : mm,
        weekdays: [],
      };
    }
  }

  // Monthly: MM HH 1 */N *
  if (dom === "1" && dow === "*") {
    const hh = parseInt(hr, 10);
    const mm = parseInt(min, 10);
    if (month.startsWith("*/")) {
      const n = parseInt(month.slice(2), 10);
      if (!isNaN(n)) {
        return {
          interval: n,
          unit: "months",
          timeHour: isNaN(hh) ? 0 : hh,
          timeMinute: isNaN(mm) ? 0 : mm,
          weekdays: [],
        };
      }
    }
    return {
      interval: 1,
      unit: "months",
      timeHour: isNaN(hh) ? 0 : hh,
      timeMinute: isNaN(mm) ? 0 : mm,
      weekdays: [],
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Props (same interface as before for drop-in compatibility)
// ---------------------------------------------------------------------------

interface ScheduleAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  locale: CountryLanguage;
  // Legacy props (ignored in new implementation)
  searchPlaceholder?: string;
  allowCustom?: boolean;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

// Panel modes for the custom section
type CustomPanelMode = "none" | "builder" | "advanced";

export function ScheduleAutocomplete({
  value = "",
  onChange,
  onBlur,
  disabled = false,
  className,
  name,
  locale,
}: ScheduleAutocompleteProps): JSX.Element {
  const { t } = cronIdScopedTranslation.scopedT(locale);
  const logger = useLogger();
  const timezone = getDefaultTimezone(locale);
  const [open, setOpen] = useState(false);

  // Determine if current value matches a preset
  const matchedPreset = useMemo(
    () => PRESETS.find((p) => p.cron === value) ?? null,
    [value],
  );

  // "custom" mode = value is set but doesn't match any preset
  const isCustom = value !== "" && matchedPreset === null;

  // Whether builder can represent the current value — computed once from initial value
  const builderStateRef = useRef<
    ReturnType<typeof cronToCustomState> | null | undefined
  >(undefined);
  if (builderStateRef.current === undefined) {
    builderStateRef.current = isCustom ? cronToCustomState(value) : null;
  }
  const builderState = builderStateRef.current;

  // Which panel is open: none (collapsed), builder, or advanced
  const [panelMode, setPanelMode] = useState<CustomPanelMode>(() => {
    if (!isCustom) {
      return "none";
    }
    return builderState !== null ? "builder" : "advanced";
  });

  // Custom builder state
  const [customState, setCustomState] = useState<CustomState>(
    () => builderState ?? defaultCustomState(),
  );

  // Human-readable label for trigger button
  const displayLabel = useMemo(() => {
    if (!value) {
      return t("widget.schedulePicker.selectPlaceholder");
    }
    return formatCronScheduleShort(value, timezone, locale, logger);
  }, [value, timezone, locale, logger, t]);

  // Handle preset selection
  const handlePresetSelect = useCallback(
    (cron: string): void => {
      onChange(cron);
      setPanelMode("none");
      setOpen(false);
      onBlur?.();
    },
    [onChange, onBlur],
  );

  // Handle custom builder changes - update cron immediately
  const handleCustomStateChange = useCallback(
    (updates: Partial<CustomState>): void => {
      const next = { ...customState, ...updates };
      setCustomState(next);
      onChange(buildCron(next));
    },
    [customState, onChange],
  );

  const handleOpenBuilder = useCallback((): void => {
    setPanelMode("builder");
    // If current value isn't representable by the builder, start fresh
    const parsed = isCustom ? cronToCustomState(value) : null;
    if (parsed) {
      setCustomState(parsed);
    } else if (!isCustom || !value) {
      const state = defaultCustomState();
      setCustomState(state);
      onChange(buildCron(state));
    } else {
      // Unrepresentable - start fresh without overwriting existing value yet
      const state = defaultCustomState();
      setCustomState(state);
      onChange(buildCron(state));
    }
  }, [isCustom, value, onChange]);

  const handleOpenAdvanced = useCallback((): void => {
    setPanelMode("advanced");
  }, []);

  // Next execution times for preview
  const nextTimes = useMemo(() => {
    if (!value) {
      return [];
    }
    try {
      const t1 = calculateNextExecutionTime(value, timezone, logger);
      if (!t1) {
        return [];
      }
      return [formatRelativeTime(t1)];
    } catch {
      return [];
    }
  }, [value, timezone, logger]);

  const presetsByGroup = useMemo(() => {
    const groups = new Map<PresetGroup, Preset[]>();
    for (const group of GROUP_ORDER) {
      groups.set(
        group,
        PRESETS.filter((p) => p.group === group),
      );
    }
    return groups;
  }, []);

  return (
    <Div className={cn("relative", className)}>
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) {
            onBlur?.();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between h-10 font-normal",
              !value && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <Div className="flex items-center gap-2 flex-1 min-w-0">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Span className="truncate text-sm">{displayLabel}</Span>
            </Div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[420px] p-0" align="start" sideOffset={4}>
          <Div className="flex flex-col">
            {/* ── Presets grid ── */}
            <Div className="p-3 border-b">
              <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {t("widget.schedulePicker.presets.title")}
              </Div>
              <Div className="flex flex-col gap-2">
                {GROUP_ORDER.map((group) => {
                  const presets = presetsByGroup.get(group) ?? [];
                  return (
                    <Div key={group} className="flex flex-wrap gap-1.5">
                      {presets.map((preset) => {
                        const isSelected = matchedPreset?.cron === preset.cron;
                        return (
                          <Button
                            key={preset.key}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "h-7 px-2.5 text-xs font-normal",
                              isSelected &&
                                "bg-primary text-primary-foreground border-primary",
                            )}
                            onClick={() => handlePresetSelect(preset.cron)}
                          >
                            {t(
                              `widget.schedulePicker.presets.${preset.key}` as Parameters<
                                typeof t
                              >[0],
                            )}
                          </Button>
                        );
                      })}
                    </Div>
                  );
                })}
              </Div>
            </Div>

            {/* ── Custom panel ── */}
            <Div className="p-3">
              {panelMode === "none" && (
                <Div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-start text-xs text-muted-foreground hover:text-foreground h-7"
                    onClick={handleOpenBuilder}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    {t("widget.schedulePicker.customOption")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                    onClick={handleOpenAdvanced}
                  >
                    {t("widget.schedulePicker.custom.advanced")}
                  </Button>
                </Div>
              )}

              {panelMode === "builder" && (
                <CustomBuilder
                  state={customState}
                  locale={locale}
                  timezone={timezone}
                  onChange={handleCustomStateChange}
                  nextTimes={nextTimes}
                  currentCron={value}
                  t={t}
                  onSwitchToAdvanced={handleOpenAdvanced}
                />
              )}

              {panelMode === "advanced" && (
                <AdvancedInput
                  value={value}
                  locale={locale}
                  timezone={timezone}
                  onChange={onChange}
                  onSwitchToBuilder={handleOpenBuilder}
                  t={t}
                  logger={logger}
                />
              )}
            </Div>
          </Div>
        </PopoverContent>
      </Popover>

      {/* Hidden input for form submission */}
      {name && <Input type="hidden" name={name} value={value} />}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Custom builder sub-component
// ---------------------------------------------------------------------------

function CustomBuilder({
  state,
  locale,
  onChange,
  nextTimes,
  currentCron,
  t,
  onSwitchToAdvanced,
}: {
  state: CustomState;
  locale: CountryLanguage;
  timezone: string;
  onChange: (updates: Partial<CustomState>) => void;
  nextTimes: string[];
  currentCron: string;
  t: ReturnType<typeof cronIdScopedTranslation.scopedT>["t"];
  onSwitchToAdvanced: () => void;
}): JSX.Element {
  const logger = useLogger();

  const showTime =
    state.unit === "days" ||
    state.unit === "weeks" ||
    state.unit === "months" ||
    (state.unit === "hours" && state.interval > 1);
  const showWeekdays = state.unit === "weeks";
  const showInterval = state.unit !== "weeks";

  const weekdayKeys = [
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
  ] as const;

  const description = useMemo(() => {
    if (!currentCron) {
      return "";
    }
    try {
      return formatCronSchedule(currentCron, "UTC", locale, logger);
    } catch {
      return currentCron;
    }
  }, [currentCron, locale, logger]);

  return (
    <Div className="flex flex-col gap-3">
      <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("widget.schedulePicker.custom.title")}
      </Div>

      {/* Row 1: interval + unit */}
      <Div className="flex items-center gap-2 flex-wrap">
        <Span className="text-sm text-muted-foreground whitespace-nowrap">
          {t("widget.schedulePicker.custom.repeatEvery")}
        </Span>
        {showInterval && (
          <Input
            type="number"
            min={1}
            max={59}
            value={state.interval}
            onChange={(e) => {
              const n = parseInt(String(e.target.value), 10);
              if (!isNaN(n) && n >= 1) {
                onChange({ interval: n });
              }
            }}
            className="w-16 h-7 text-sm text-center"
          />
        )}
        <Select
          value={state.unit}
          onValueChange={(v) => onChange({ unit: v as FrequencyUnit })}
        >
          <SelectTrigger className="h-7 w-32 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(
              ["minutes", "hours", "days", "weeks", "months"] as FrequencyUnit[]
            ).map((u) => (
              <SelectItem key={u} value={u}>
                {t(
                  `widget.schedulePicker.custom.unit.${u}` as Parameters<
                    typeof t
                  >[0],
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Div>

      {/* Row 2: time picker */}
      {showTime && (
        <Div className="flex items-center gap-2">
          <Span className="text-sm text-muted-foreground">
            {t("widget.schedulePicker.custom.at")}
          </Span>
          <Input
            type="time"
            value={`${String(state.timeHour).padStart(2, "0")}:${String(state.timeMinute).padStart(2, "0")}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map(Number);
              if (!isNaN(h) && !isNaN(m)) {
                onChange({ timeHour: h, timeMinute: m });
              }
            }}
            className="h-7 w-32 text-sm"
          />
        </Div>
      )}

      {/* Row 3: weekday toggles */}
      {showWeekdays && (
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-sm text-muted-foreground">
            {t("widget.schedulePicker.custom.onDays")}
          </Span>
          <Div className="flex gap-1 flex-wrap">
            {WEEKDAY_INDICES.map((dayIndex, i) => {
              const key = weekdayKeys[i];
              const isOn = state.weekdays.includes(dayIndex);
              return (
                <Button
                  key={dayIndex}
                  type="button"
                  variant={isOn ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-7 w-9 p-0 text-xs font-normal",
                    isOn && "bg-primary text-primary-foreground border-primary",
                  )}
                  onClick={() => {
                    const next = isOn
                      ? state.weekdays.filter((d) => d !== dayIndex)
                      : [...state.weekdays, dayIndex];
                    onChange({ weekdays: next });
                  }}
                >
                  {t(
                    `widget.schedulePicker.custom.days.${key}` as Parameters<
                      typeof t
                    >[0],
                  )}
                </Button>
              );
            })}
          </Div>
        </Div>
      )}

      {/* Preview */}
      {description && (
        <Div className="rounded-md bg-muted/50 px-3 py-2 flex flex-col gap-0.5">
          <Span className="text-xs text-foreground">
            {t("widget.schedulePicker.custom.preview", {
              description,
            } as Parameters<typeof t>[1])}
          </Span>
          {nextTimes.length > 0 && (
            <Span className="text-xs text-muted-foreground">
              {t("widget.schedulePicker.custom.nextRun", {
                time: nextTimes[0],
              } as Parameters<typeof t>[1])}
            </Span>
          )}
        </Div>
      )}

      {/* Escape hatch to advanced */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="self-start text-xs text-muted-foreground hover:text-foreground h-6 px-0"
        onClick={onSwitchToAdvanced}
      >
        {t("widget.schedulePicker.custom.advanced")}
      </Button>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Advanced raw input - handles any valid cron expression
// ---------------------------------------------------------------------------

function AdvancedInput({
  value,
  locale,
  timezone,
  onChange,
  onSwitchToBuilder,
  t,
  logger,
}: {
  value: string;
  locale: CountryLanguage;
  timezone: string;
  onChange: (value: string) => void;
  onSwitchToBuilder: () => void;
  t: ReturnType<typeof cronIdScopedTranslation.scopedT>["t"];
  logger: ReturnType<typeof useLogger>;
}): JSX.Element {
  const [rawInput, setRawInput] = useState(value);

  const isValid = useMemo(
    () =>
      rawInput.trim() !== "" && validateCronSchedule(rawInput.trim(), timezone),
    [rawInput, timezone],
  );

  const description = useMemo(() => {
    if (!isValid || !rawInput.trim()) {
      return "";
    }
    try {
      return formatCronSchedule(rawInput.trim(), timezone, locale, logger);
    } catch {
      return "";
    }
  }, [isValid, rawInput, timezone, locale, logger]);

  const nextTime = useMemo(() => {
    if (!isValid || !rawInput.trim()) {
      return "";
    }
    try {
      const t1 = calculateNextExecutionTime(rawInput.trim(), timezone, logger);
      return t1 ? formatRelativeTime(t1) : "";
    } catch {
      return "";
    }
  }, [isValid, rawInput, timezone, logger]);

  const handleChange = useCallback(
    (raw: string): void => {
      setRawInput(raw);
      if (raw.trim() !== "" && validateCronSchedule(raw.trim(), timezone)) {
        onChange(raw.trim());
      }
    },
    [onChange, timezone],
  );

  return (
    <Div className="flex flex-col gap-2">
      <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("widget.schedulePicker.custom.advanced")}
      </Div>

      <Input
        value={rawInput}
        onChange={(e) => handleChange(String(e.target.value))}
        placeholder={t("widget.schedulePicker.custom.advancedPlaceholder")}
        className={cn(
          "h-8 font-mono text-sm",
          rawInput.trim() !== "" &&
            !isValid &&
            "border-destructive focus-visible:ring-destructive",
        )}
      />

      {rawInput.trim() !== "" && !isValid && (
        <Span className="text-xs text-destructive">
          {t("widget.schedulePicker.custom.advancedInvalid")}
        </Span>
      )}

      {isValid && description && (
        <Div className="rounded-md bg-muted/50 px-3 py-2 flex flex-col gap-0.5">
          <Span className="text-xs text-foreground">
            {t("widget.schedulePicker.custom.preview", {
              description,
            } as Parameters<typeof t>[1])}
          </Span>
          {nextTime && (
            <Span className="text-xs text-muted-foreground">
              {t("widget.schedulePicker.custom.nextRun", {
                time: nextTime,
              } as Parameters<typeof t>[1])}
            </Span>
          )}
        </Div>
      )}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="self-start text-xs text-muted-foreground hover:text-foreground h-6 px-0"
        onClick={onSwitchToBuilder}
      >
        {t("widget.schedulePicker.customOption")}
      </Button>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) {
    return "now";
  }
  if (diffMin === 1) {
    return "in 1 minute";
  }
  if (diffMin < 60) {
    return `in ${diffMin} minutes`;
  }
  const diffHr = Math.round(diffMin / 60);
  if (diffHr === 1) {
    return "in 1 hour";
  }
  if (diffHr < 24) {
    return `in ${diffHr} hours`;
  }
  const diffDays = Math.round(diffHr / 24);
  if (diffDays === 1) {
    return "tomorrow";
  }
  return `in ${diffDays} days`;
}
