/**
 * System Settings Widget
 * Grouped accordion view with health badges, type-aware edit inputs, save/restart buttons
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Lock } from "next-vibe-ui/ui/icons/Lock";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { ShieldPlus } from "next-vibe-ui/ui/icons/ShieldPlus";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Wand2 } from "next-vibe-ui/ui/icons/Wand2";
import type { InputChangeEvent } from "next-vibe-ui/ui/input";
import { Input } from "next-vibe-ui/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import { Switch } from "next-vibe-ui/ui/switch";
import type { JSX } from "react";
import React, { useCallback, useEffect, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { SystemSettingsGetResponseOutput } from "./definition";
import exportEnvEndpoints from "./export-env/definition";

const SettingsWizard = React.lazy(() =>
  import("./widget-wizard").then((m) => ({ default: m.SettingsWizard })),
);

type Module = SystemSettingsGetResponseOutput["modules"][number];
type Setting = Module["settings"][number];

interface WidgetProps {
  field: {
    value: SystemSettingsGetResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
}

const MODULE_LABEL_KEYS: Record<string, string> = {
  env: "widget.moduleLabels.env",
  agent: "widget.moduleLabels.agent",
  leadsCampaigns: "widget.moduleLabels.leadsCampaigns",
  messenger: "widget.moduleLabels.messenger",
  imap: "widget.moduleLabels.imap",
  payment: "widget.moduleLabels.payment",
  sms: "widget.moduleLabels.sms",
  serverSystem: "widget.moduleLabels.serverSystem",
};

function isBooleanValue(value: string): boolean {
  return value === "true" || value === "false";
}

function generateSecret(type: "hex32" | "hex64"): string {
  const bytes = type === "hex64" ? 32 : 16;
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function SettingFieldInput({
  setting,
  editedValue,
  onEdit,
  t,
}: {
  setting: Setting;
  editedValue: string | undefined;
  onEdit: (key: string, value: string) => void;
  t: (key: string) => string;
}): JSX.Element {
  const isEdited = editedValue !== undefined;
  const displayValue = isEdited ? editedValue : setting.value;

  // Sensitive fields always get password input
  if (setting.isSensitive) {
    return (
      <Div className="flex items-center gap-1.5 w-full">
        <Input
          className={cn(
            "h-7 text-xs font-mono flex-1",
            isEdited && "border-primary",
          )}
          type="password"
          value={isEdited ? displayValue : ""}
          placeholder={
            // eslint-disable-next-line i18next/no-literal-string
            setting.isConfigured ? "••••••••" : ""
          }
          onChange={(e: InputChangeEvent<"password">): void =>
            onEdit(setting.key, String(e.target.value ?? ""))
          }
        />
        {setting.autoGenerate && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 shrink-0 text-xs"
            onClick={(): void =>
              onEdit(setting.key, generateSecret(setting.autoGenerate!))
            }
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {t("widget.generate")}
          </Button>
        )}
      </Div>
    );
  }

  // Select dropdown
  if (
    setting.fieldType === "select" &&
    setting.options &&
    setting.options.length > 0
  ) {
    return (
      <Select
        value={displayValue}
        onValueChange={(v: string): void => onEdit(setting.key, v)}
      >
        <SelectTrigger
          className={cn("h-7 text-xs font-mono", isEdited && "border-primary")}
        >
          <SelectValue placeholder={t("widget.selectPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {setting.options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Boolean switch
  if (
    setting.fieldType === "boolean" ||
    (!setting.fieldType && isBooleanValue(displayValue))
  ) {
    const checked = displayValue === "true";
    return (
      <Div className="flex items-center gap-2">
        <Switch
          checked={checked}
          onCheckedChange={(v: boolean): void =>
            onEdit(setting.key, v ? "true" : "false")
          }
        />
        <Span className="text-xs text-muted-foreground font-mono">
          {checked ? t("widget.boolTrue") : t("widget.boolFalse")}
        </Span>
      </Div>
    );
  }

  // Text input (all env values are strings - fieldType is just metadata)
  return (
    <Input
      className={cn("h-7 text-xs font-mono", isEdited && "border-primary")}
      value={displayValue}
      placeholder={setting.example || setting.comment || ""}
      onChange={(e: InputChangeEvent): void =>
        onEdit(setting.key, String(e.target.value ?? ""))
      }
    />
  );
}

function SettingRow({
  setting,
  isWritable,
  editedValue,
  onEdit,
  t,
}: {
  setting: Setting;
  isWritable: boolean;
  editedValue: string | undefined;
  onEdit: (key: string, value: string) => void;
  t: (key: string) => string;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-1 px-4 py-2 border-b last:border-b-0 text-sm">
      <Div className="flex items-center gap-2">
        <Div className="flex items-center gap-1.5 w-64 shrink-0">
          {setting.isSensitive && !setting.isEncrypted && (
            <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
          )}
          {setting.isSensitive && setting.isEncrypted && (
            <ShieldPlus className="h-3 w-3 text-green-500 shrink-0" />
          )}
          <Span className="font-mono text-xs text-muted-foreground truncate">
            {setting.key}
          </Span>
          {setting.onboardingRequired && (
            <Span className="text-[10px] px-1 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 shrink-0">
              {t("widget.required")}
            </Span>
          )}
        </Div>

        <Div className="flex-1 min-w-0">
          {isWritable ? (
            <SettingFieldInput
              setting={setting}
              editedValue={editedValue}
              onEdit={onEdit}
              t={t}
            />
          ) : (
            <Span
              className={cn(
                "font-mono text-xs truncate block",
                !setting.isConfigured && "text-red-500 dark:text-red-400",
              )}
            >
              {setting.isConfigured
                ? (editedValue ?? setting.value)
                : t("widget.notSet")}
            </Span>
          )}
        </Div>
      </Div>

      {setting.comment && (
        <Span className="text-[11px] text-muted-foreground pl-0 leading-tight">
          {setting.comment}
        </Span>
      )}
    </Div>
  );
}

function ModuleCard({
  module,
  isWritable,
  edits,
  onEdit,
  t,
}: {
  module: Module;
  isWritable: boolean;
  edits: Record<string, string>;
  onEdit: (key: string, value: string) => void;
  t: (key: string) => string;
}): JSX.Element {
  const [expanded, setExpanded] = useState(true);
  const labelKey = MODULE_LABEL_KEYS[module.name];
  const label = labelKey ? t(labelKey) : module.name;

  const allConfigured = module.configuredCount === module.totalCount;
  const noneConfigured = module.configuredCount === 0;
  const healthColor = allConfigured
    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    : noneConfigured
      ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  const healthLabel = allConfigured
    ? t("widget.configured")
    : noneConfigured
      ? t("widget.notConfigured")
      : t("widget.partial");

  return (
    <Div className="rounded-lg border bg-card overflow-hidden">
      <Button
        variant="ghost"
        size="unset"
        className="flex items-center gap-3 p-3 w-full hover:bg-muted/30 transition-colors rounded-none justify-start"
        onClick={(): void => setExpanded((v) => !v)}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
        <Span className="font-medium flex-1 text-left">{label}</Span>
        <Span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            healthColor,
          )}
        >
          {module.configuredCount}/{module.totalCount}
        </Span>
        <Span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            healthColor,
          )}
        >
          {healthLabel}
        </Span>
      </Button>

      {expanded && (
        <Div className="border-t">
          {module.settings.map((setting) => (
            <SettingRow
              key={setting.key}
              setting={setting}
              isWritable={isWritable}
              editedValue={edits[setting.key]}
              onEdit={onEdit}
              t={t}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}

export function SystemSettingsWidget({ field }: WidgetProps): JSX.Element {
  const value = field.value;
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { endpointMutations } = useWidgetContext();
  const isLoading = endpointMutations?.read?.isLoading ?? value === undefined;
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pendingRestart, setPendingRestart] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  // Auto-show wizard when data loads: always if default password, otherwise unless dismissed
  useEffect(() => {
    if (!value) {
      return;
    }
    const dismissed =
      typeof window !== "undefined" &&
      !!localStorage.getItem("vibe-wizard-dismissed");
    const hasDefaultPassword = value.onboardingIssues?.some((issue) =>
      issue.toLowerCase().includes("default"),
    );
    if (value.needsOnboarding && (!dismissed || hasDefaultPassword)) {
      setShowWizard(true);
    }
  }, [value]);

  const modules = value?.modules ?? [];
  const isWritable = value?.isWritable ?? false;
  const isDevMode = value?.isDevMode ?? false;
  const needsOnboarding = value?.needsOnboarding ?? false;
  const onboardingIssues = value?.onboardingIssues ?? [];

  const handleEdit = useCallback((key: string, newValue: string): void => {
    setEdits((prev) => ({ ...prev, [key]: newValue }));
  }, []);

  const hasEdits = Object.keys(edits).length > 0;

  const handleSave = useCallback(async (): Promise<void> => {
    if (!hasEdits || !user) {
      return;
    }
    setSaving(true);
    try {
      const filtered: Record<string, string> = {};
      for (const [key, val] of Object.entries(edits)) {
        if (val !== "") {
          filtered[key] = val;
        }
      }
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const endpointsDef = await import("./definition");
      await apiClient.mutate(
        endpointsDef.PATCH,
        logger,
        user,
        filtered,
        undefined,
        locale,
      );
      setEdits({});
      setPendingRestart(true);
      endpointMutations?.read?.refetch?.();
    } finally {
      setSaving(false);
    }
  }, [edits, hasEdits, user, logger, locale, endpointMutations]);

  const handleApplyRestart = useCallback(async (): Promise<void> => {
    if (!user) {
      return;
    }
    setApplying(true);
    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const rebuildDef =
        await import("@/app/api/[locale]/system/server/rebuild/definition");
      await apiClient.mutate(
        rebuildDef.default.POST,
        logger,
        user,
        undefined,
        undefined,
        locale,
      );
      setPendingRestart(false);
    } finally {
      setApplying(false);
    }
  }, [user, logger, locale]);

  const tStr = t as (key: string) => string;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-base">{t("widget.title")}</Span>
        <Span className="text-xs text-muted-foreground ml-2">
          {t("widget.subtitle")}
        </Span>
        <Div className="ml-auto flex gap-2">
          {!showWizard && (
            <Button
              variant="outline"
              size="sm"
              onClick={(): void => setShowExport((v) => !v)}
            >
              <Server className="h-3.5 w-3.5 mr-1.5" />
              {tStr("widget.exportProd")}
            </Button>
          )}
          <Button
            variant={showWizard ? "default" : "outline"}
            size="sm"
            onClick={(): void => {
              if (showWizard) {
                localStorage.setItem("vibe-wizard-dismissed", "1");
                setShowWizard(false);
                setShowExport(false);
              } else {
                setShowWizard(true);
                setShowExport(false);
              }
            }}
          >
            <Wand2 className="h-3.5 w-3.5 mr-1.5" />
            {showWizard
              ? tStr("wizard.viewAllSettings")
              : tStr("widget.restartWizard")}
          </Button>
        </Div>
      </Div>

      {/* Export for Production panel */}
      {showExport && (
        <Div className="border-b">
          <EndpointsPage
            endpoint={exportEnvEndpoints}
            locale={locale}
            user={user}
          />
        </Div>
      )}

      {/* Setup Wizard (replaces main content when active) */}
      {showWizard && value && (
        <React.Suspense fallback={null}>
          <SettingsWizard
            data={value}
            onDone={(): void => setShowWizard(false)}
          />
        </React.Suspense>
      )}

      {!showWizard && (
        <>
          {/* Banners */}
          {isLoading && (
            <Div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b text-sm text-muted-foreground animate-pulse">
              {t("widget.loading")}
            </Div>
          )}
          {!isLoading && !isWritable && (
            <Div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b text-sm text-muted-foreground">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              {t("widget.readOnlyBanner")}
            </Div>
          )}

          {needsOnboarding && (
            <Div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border-b text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <Div className="flex flex-col">
                <Span>{t("widget.onboardingBanner")}</Span>
                {onboardingIssues.map((issue) => (
                  <Span key={issue} className="text-xs opacity-80">
                    {issue}
                  </Span>
                ))}
              </Div>
            </Div>
          )}

          {/* Module cards */}
          <Div className="flex flex-col gap-2 p-4">
            {modules.map((module) => (
              <ModuleCard
                key={module.name}
                module={module}
                isWritable={isWritable}
                edits={edits}
                onEdit={handleEdit}
                t={tStr}
              />
            ))}
          </Div>

          {/* Restart banner */}
          {pendingRestart && (
            <Div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border-t text-sm text-blue-700 dark:text-blue-300">
              <RefreshCw className="h-3.5 w-3.5 shrink-0" />
              <Span className="flex-1">
                {isDevMode
                  ? t("widget.devRestartHint")
                  : t("widget.restartRequired")}
              </Span>
              {!isDevMode && (
                <Button
                  size="sm"
                  disabled={applying}
                  onClick={handleApplyRestart}
                >
                  {applying ? t("widget.applying") : t("widget.apply")}
                </Button>
              )}
            </Div>
          )}

          {/* Save bar - always visible when writable */}
          {isWritable && (
            <Div className="sticky bottom-0 flex items-center justify-end gap-2 px-4 py-3 bg-background border-t">
              {hasEdits && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(): void => setEdits({})}
                >
                  {t("widget.cancel")}
                </Button>
              )}
              <Button
                size="sm"
                disabled={!hasEdits || saving}
                onClick={handleSave}
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {saving ? t("widget.saving") : t("widget.save")}
              </Button>
            </Div>
          )}
        </>
      )}
    </Div>
  );
}

/**
 * CLI-only interactive editor widget for PATCH endpoint.
 * Replaced at runtime by Bun's widget.cli plugin - this stub satisfies TypeScript.
 */
export function SystemSettingsPatchWidget(): null {
  return null;
}
