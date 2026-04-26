/**
 * System Settings CLI Widget
 * Renders env configuration in a beautiful terminal view.
 * CLI: Colored grouped display with health indicators + interactive wizard
 * MCP: Compact plain text summary
 */

import chalk from "chalk";
import { Box, Text, useApp, useInput, useStdin } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { SystemSettingsGetResponseOutput } from "./definition";

type Module = SystemSettingsGetResponseOutput["modules"][number];
type Setting = Module["settings"][number];

interface CliWidgetProps {
  field: {
    value: SystemSettingsGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function healthBadge(
  configured: number,
  total: number,
  isMcp: boolean,
): string {
  const ratio = `${configured}/${total}`;
  if (isMcp) {
    const status =
      configured === total ? "OK" : configured === 0 ? "NONE" : "PARTIAL";
    return `[${ratio} ${status}]`;
  }
  if (configured === total) {
    return chalk.green(`[${ratio}]`);
  }
  if (configured === 0) {
    return chalk.gray(`[${ratio}]`);
  }
  return chalk.yellow(`[${ratio}]`);
}

function renderSettingCli(setting: Setting): string {
  const keyStr = chalk.blue(setting.key.padEnd(40));
  const lockIcon = setting.isSensitive
    ? setting.isEncrypted
      ? chalk.green(" [encrypted]")
      : chalk.dim(" [sensitive]")
    : "";

  if (!setting.isConfigured) {
    const requiredTag = setting.onboardingRequired
      ? chalk.red(" [REQUIRED]")
      : "";
    return `    ${keyStr} ${chalk.red("not set")}${lockIcon}${requiredTag}`;
  }

  const valueStr = setting.isSensitive
    ? chalk.dim("****")
    : chalk.white(
        setting.value.length > 40
          ? `${setting.value.slice(0, 37)}...`
          : setting.value,
      );
  return `    ${keyStr} ${valueStr}${lockIcon}`;
}

function renderSettingMcp(setting: Setting): string {
  const status = setting.isConfigured ? setting.value : "(not set)";
  const requiredTag =
    setting.onboardingRequired && !setting.isConfigured ? " [REQUIRED]" : "";
  return `    ${setting.key}: ${status}${requiredTag}`;
}

// ── Module Renderers ─────────────────────────────────────────────────────

const MODULE_LABELS: Record<string, string> = {
  env: "Core",
  agent: "AI Providers",
  leadsCampaigns: "Lead Campaigns",
  messenger: "Messenger / SMTP",
  imap: "IMAP",
  payment: "Payments",
  sms: "SMS",
  serverSystem: "Server / Platform",
};

function renderModuleCli(module: Module): string {
  const lines: string[] = [];
  const label = MODULE_LABELS[module.name] ?? module.name;
  const badge = healthBadge(module.configuredCount, module.totalCount, false);

  lines.push(`  ${chalk.bold(label)} ${badge}`);
  for (const setting of module.settings) {
    lines.push(renderSettingCli(setting));
  }
  lines.push("");
  return lines.join("\n");
}

function renderModuleMcp(module: Module): string {
  const lines: string[] = [];
  const label = MODULE_LABELS[module.name] ?? module.name;
  const badge = healthBadge(module.configuredCount, module.totalCount, true);

  lines.push(`  ${label} ${badge}`);
  for (const setting of module.settings) {
    lines.push(renderSettingMcp(setting));
  }
  lines.push("");
  return lines.join("\n");
}

// ── Main Renderers ───────────────────────────────────────────────────────

function renderCli(
  value: SystemSettingsGetResponseOutput,
  t: (key: string) => string,
): string {
  const lines: string[] = [];

  lines.push(chalk.bold.cyan(t("widget.title")));
  lines.push(chalk.dim(t("widget.subtitle")));
  lines.push("");

  // Banners
  if (!value.isWritable) {
    lines.push(chalk.yellow(`  ${t("widget.readOnlyBanner")}`));
    lines.push("");
  }

  if (value.needsOnboarding) {
    lines.push(chalk.red.bold(`  ${t("widget.onboardingBanner")}`));
    for (const issue of value.onboardingIssues) {
      lines.push(chalk.red(`    - ${issue}`));
    }
    lines.push("");
  }

  // Modules
  for (const mod of value.modules) {
    lines.push(renderModuleCli(mod));
  }

  // Footer
  if (value.isWritable) {
    if (value.wizardSteps.length > 0) {
      lines.push(chalk.dim(`  Run setup wizard: vibe init`));
    }
    lines.push(chalk.dim(`  Edit settings:    vibe init`));
  }

  return lines.join("\n");
}

function renderMcp(
  value: SystemSettingsGetResponseOutput,
  t: (key: string) => string,
): string {
  const lines: string[] = [];

  lines.push(t("widget.title"));
  lines.push("");

  if (!value.isWritable) {
    lines.push(`  ${t("widget.readOnlyBanner")}`);
    lines.push("");
  }

  if (value.needsOnboarding) {
    lines.push(`  ${t("widget.onboardingBanner")}`);
    for (const issue of value.onboardingIssues) {
      lines.push(`    - ${issue}`);
    }
    lines.push("");
  }

  for (const mod of value.modules) {
    lines.push(renderModuleMcp(mod));
  }

  if (value.isWritable) {
    lines.push(`  Writable: true (use PATCH system-settings to update values)`);
  }

  return lines.join("\n");
}

// ── CLI Editor (inline edit for any setting) ─────────────────────────────

interface FlatSetting extends Setting {
  moduleName: string;
}

/** A row in the editor list - either a module header separator or a real setting */
type EditorRow =
  | { kind: "header"; label: string }
  | { kind: "setting"; setting: FlatSetting };

function buildEditorRows(modules: Module[]): EditorRow[] {
  const rows: EditorRow[] = [];
  for (const mod of modules) {
    const label = MODULE_LABELS[mod.name] ?? mod.name;
    rows.push({ kind: "header", label });
    for (const s of mod.settings) {
      rows.push({ kind: "setting", setting: { ...s, moduleName: mod.name } });
    }
  }
  return rows;
}

/** Extract only the navigable (setting) rows and their indices in the full rows array */
function buildSettingIndices(rows: EditorRow[]): number[] {
  return rows.flatMap((r, i) => (r.kind === "setting" ? [i] : []));
}

interface EditorProps {
  value: SystemSettingsGetResponseOutput;
  onDone: () => void;
}

function CliEditor({ value, onDone }: EditorProps): JSX.Element {
  const { exit } = useApp();
  const { isRawModeSupported } = useStdin();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof endpoints.GET>() as (
    k: string,
  ) => string;

  const rows = useMemo(() => buildEditorRows(value.modules), [value.modules]);
  const settingIndices = useMemo(() => buildSettingIndices(rows), [rows]);

  // cursor is an index into settingIndices (navigates only over settings, not headers)
  const [cursor, setCursor] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const currentRowIdx = settingIndices[cursor] ?? 0;
  const currentRow = rows[currentRowIdx];
  const current =
    currentRow?.kind === "setting" ? currentRow.setting : undefined;

  // Start editing current field
  const startEdit = useCallback((): void => {
    if (!current || !value.isWritable) {
      return;
    }
    setEditValue(edits[current.key] ?? "");
    setEditing(true);
  }, [current, value.isWritable, edits]);

  // Commit current edit
  const commitEdit = useCallback((): void => {
    if (current && editValue !== "") {
      setEdits((prev) => ({ ...prev, [current.key]: editValue }));
    }
    setEditing(false);
  }, [current, editValue]);

  // Save all pending edits to .env
  const saveAll = useCallback(async (): Promise<void> => {
    if (!user || Object.keys(edits).length === 0) {
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const { RouteExecutionExecutor } =
        await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");
      await RouteExecutionExecutor.executeGenericHandler({
        toolName: "init",
        data: { settings: edits },
        urlPathParams: {},
        user,
        locale,
        logger,
        platform: platform as Parameters<
          typeof RouteExecutionExecutor.executeGenericHandler
        >[0]["platform"],
        streamContext: {
          rootFolderId: DefaultFolderId.CRON,
          threadId: undefined,
          aiMessageId: undefined,
          skillId: undefined,
          headless: undefined,
          subAgentDepth: 0,
          isRevival: undefined,

          providerOverride: undefined,
          currentToolMessageId: undefined,
          callerToolCallId: undefined,
          pendingToolMessages: undefined,
          pendingTimeoutMs: undefined,
          leafMessageId: undefined,
          waitingForRemoteResult: undefined,
          favoriteId: undefined,
          abortSignal: new AbortController().signal,
          callerCallbackMode: undefined,
          onEscalatedTaskCancel: undefined,
          escalateToTask: undefined,
        },
      });
      setSaveMsg("Saved \u2713");
      setEdits({});
    } catch {
      setSaveMsg("Save failed");
    } finally {
      setSaving(false);
    }
  }, [edits, user, locale, logger, platform]);

  // Navigation, shortcuts, and escape-to-cancel
  useInput(
    (input, key) => {
      // While TextInput is active, only handle Escape to cancel
      if (editing) {
        if (key.escape) {
          setEditing(false);
        }
        return;
      }
      if (key.escape || input === "q") {
        if (Object.keys(edits).length > 0) {
          // Unsaved edits - just quit without saving (matches web cancel semantics)
        }
        onDone();
        return;
      }
      if (key.upArrow || input === "k") {
        setCursor((c) => Math.max(0, c - 1));
        return;
      }
      if (key.downArrow || input === "j") {
        setCursor((c) => Math.min(settingIndices.length - 1, c + 1));
        return;
      }
      if (key.return || input === "e") {
        startEdit();
        return;
      }
      if (input === "g" && current?.autoGenerate) {
        const generated = generateSecret(current.autoGenerate);
        setEdits((prev) => ({ ...prev, [current.key]: generated }));
        return;
      }
      if (input === "s") {
        void saveAll();
        return;
      }
      if (input === "x") {
        exit();
      }
    },
    { isActive: isRawModeSupported },
  );

  // Visible window: show ~14 rows around the current setting row (in the full rows array)
  const WINDOW = 14;
  const windowStart = Math.max(0, currentRowIdx - Math.floor(WINDOW / 2));
  const visible = rows.slice(windowStart, windowStart + WINDOW);

  const sensitiveIcon = "\u26a1";
  const hasEdits = Object.keys(edits).length > 0;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {t("widget.title")}
        </Text>
        <Text dimColor>{`  ${t("widget.subtitle")}`}</Text>
      </Box>

      {/* Settings list with module headers */}
      {visible.map((row, i) => {
        const rowIdx = windowStart + i;
        if (row.kind === "header") {
          return (
            <Box key={`header-${row.label}`} marginTop={i === 0 ? 0 : 1}>
              <Text bold underline color="white">
                {row.label}
              </Text>
            </Box>
          );
        }
        const s = row.setting;
        const isCurrent = rowIdx === currentRowIdx;
        const edited = edits[s.key];
        const displayVal = s.isSensitive
          ? edited !== undefined
            ? "**** (edited)"
            : s.isConfigured
              ? "****"
              : "(not set)"
          : (edited ?? (s.isConfigured ? s.value : "(not set)"));

        return (
          <Box key={`${s.moduleName}.${s.key}`}>
            <Text color={isCurrent ? "cyan" : undefined}>
              {isCurrent ? "\u25b8 " : "  "}
            </Text>
            <Text color={isCurrent ? "cyan" : "blue"} bold={isCurrent}>
              {s.key.padEnd(38)}
            </Text>
            <Text
              color={
                edited !== undefined
                  ? "yellow"
                  : s.isConfigured
                    ? undefined
                    : "red"
              }
              dimColor={!isCurrent && s.isConfigured && edited === undefined}
            >
              {` ${displayVal}`}
            </Text>
            {s.isSensitive && (
              <Text color={s.isEncrypted ? "green" : undefined} dimColor>
                {` ${sensitiveIcon}`}
              </Text>
            )}
          </Box>
        );
      })}

      {/* Inline editor for current field */}
      {editing && current && (
        <Box
          borderStyle="round"
          borderColor="yellow"
          paddingX={1}
          flexDirection="column"
          marginTop={1}
        >
          <Text bold>{current.key}</Text>
          {current.comment ? <Text dimColor>{current.comment}</Text> : null}
          <Box>
            <Text dimColor>
              {`${current.isSensitive ? "Password" : "Value"}: `}
            </Text>
            <TextInput
              value={editValue}
              mask={current.isSensitive ? "*" : undefined}
              placeholder={current.example || undefined}
              onChange={setEditValue}
              onSubmit={commitEdit}
            />
          </Box>
          <Text dimColor>{t("widget.editConfirmHint")}</Text>
        </Box>
      )}

      {/* Status */}
      {saving && <Text color="yellow">{t("widget.saving")}</Text>}
      {saveMsg && (
        <Text color={saveMsg.includes("\u2713") ? "green" : "red"}>
          {saveMsg}
        </Text>
      )}

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>
          {[
            "\u2191\u2193/jk navigate",
            "[Enter/e] edit",
            current?.autoGenerate ? "[g] generate" : "",
            hasEdits ? "[s] save" : "",
            "[q] back",
          ]
            .filter(Boolean)
            .join("  ")}
        </Text>
      </Box>
    </Box>
  );
}

// ── CLI Wizard Components ─────────────────────────────────────────────────

const STEP_LABELS: Record<string, string> = {
  admin: "Admin Account",
  database: "Database",
  security: "Security Keys",
  ai: "AI Provider",
};

function generateSecret(type: "hex32" | "hex64"): string {
  const bytes = type === "hex64" ? 32 : 16;
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function buildSettingsMap(modules: Module[]): Map<string, Setting> {
  const map = new Map<string, Setting>();
  for (const mod of modules) {
    for (const s of mod.settings) {
      map.set(s.key, s);
    }
  }
  return map;
}

// ── Unbottled CLI Login ─────────────────────────────────────────────────

function UnbottledCliLoginField({
  currentField,
  locale,
  t,
  onCredential,
}: {
  currentField: Setting;
  locale: string;
  t: (k: string) => string;
  onCredential: (credential: string) => void;
}): JSX.Element {
  const [phase, setPhase] = useState<
    "email" | "password" | "url" | "signing-in" | "done" | "error"
  >(currentField.isConfigured ? "done" : "email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line i18next/no-literal-string
  const [remoteUrl, setRemoteUrl] = useState("https://unbottled.ai");
  const [errorMsg, setErrorMsg] = useState("");

  const doLogin = useCallback(async (): Promise<void> => {
    setPhase("signing-in");
    try {
      const { LEAD_ID_COOKIE_NAME } = await import("@/config/constants");
      const normalizedUrl = remoteUrl.replace(/\/+$/, "");

      // Ping for lead_id
      let remotePingLeadId: string | undefined;
      try {
        const pingResponse = await fetch(`${normalizedUrl}/${locale}`, {
          method: "GET",
          redirect: "follow",
          signal: AbortSignal.timeout(10_000),
        });
        const setCookie = pingResponse.headers.get("set-cookie") ?? "";
        const match = setCookie.match(
          new RegExp(`${LEAD_ID_COOKIE_NAME}=([^;]+)`),
        );
        remotePingLeadId = match?.[1];
      } catch {
        setErrorMsg(t("wizard.ai.unbottledConnectionError"));
        setPhase("error");
        return;
      }

      // Login
      // eslint-disable-next-line i18next/no-literal-string
      const loginUrl = `${normalizedUrl}/api/${locale}/user/public/login`;
      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          "Content-Type": "application/json",
          ...(remotePingLeadId && {
            Cookie: `${LEAD_ID_COOKIE_NAME}=${remotePingLeadId}`,
          }),
        },
        body: JSON.stringify({ email, password, rememberMe: true }),
        signal: AbortSignal.timeout(15_000),
      });

      if (!loginResponse.ok) {
        setErrorMsg(t("wizard.ai.unbottledLoginFailed"));
        setPhase("error");
        return;
      }

      const loginBody = (await loginResponse.json()) as {
        success?: boolean;
        data?: { token?: string; leadId?: string };
      };

      if (!loginBody.success || !loginBody.data?.token) {
        setErrorMsg(t("wizard.ai.unbottledLoginFailed"));
        setPhase("error");
        return;
      }

      const token = loginBody.data.token;
      const effectiveLeadId = loginBody.data.leadId ?? remotePingLeadId ?? "";

      // eslint-disable-next-line i18next/no-literal-string
      onCredential(`${effectiveLeadId}:${token}:${normalizedUrl}`);
      setPhase("done");
    } catch {
      setErrorMsg(t("wizard.ai.unbottledConnectionError"));
      setPhase("error");
    }
  }, [email, password, remoteUrl, locale, t, onCredential]);

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="cyan">
        {t("wizard.ai.unbottledTitle")}
      </Text>
      <Text dimColor>{t("wizard.ai.unbottledDescription")}</Text>

      {phase === "done" ? (
        <Text color="green">
          {t("wizard.ai.unbottledConnected").replace("{{url}}", remoteUrl)}
        </Text>
      ) : phase === "signing-in" ? (
        <Text color="yellow">{t("wizard.ai.unbottledSigningIn")}</Text>
      ) : phase === "error" ? (
        <Box flexDirection="column">
          <Text color="red">{errorMsg}</Text>
          <Text dimColor>{`[Enter] ${t("wizard.next")}`}</Text>
        </Box>
      ) : phase === "email" ? (
        <Box>
          <Text dimColor>{`${t("wizard.ai.unbottledEmail")}: `}</Text>
          <TextInput
            value={email}
            placeholder="you@example.com"
            onChange={setEmail}
            onSubmit={(): void => setPhase("password")}
          />
        </Box>
      ) : phase === "password" ? (
        <Box>
          <Text dimColor>{`${t("wizard.ai.unbottledPassword")}: `}</Text>
          <TextInput
            value={password}
            mask="*"
            onChange={setPassword}
            onSubmit={(): void => setPhase("url")}
          />
        </Box>
      ) : (
        <Box>
          <Text dimColor>{`${t("wizard.ai.unbottledRemoteUrl")}: `}</Text>
          <TextInput
            value={remoteUrl}
            placeholder="https://unbottled.ai"
            onChange={setRemoteUrl}
            onSubmit={(): void => {
              void doLogin();
            }}
          />
        </Box>
      )}
    </Box>
  );
}

interface WizardProps {
  value: SystemSettingsGetResponseOutput;
  onDone: () => void;
}

function CliWizard({ value, onDone }: WizardProps): JSX.Element {
  const { exit } = useApp();
  const { isRawModeSupported } = useStdin();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof endpoints.GET>() as (
    k: string,
  ) => string;

  const { wizardSteps, modules } = value;
  const settingsMap = useMemo(() => buildSettingsMap(modules), [modules]);

  const [stepIdx, setStepIdx] = useState(0);
  const [fieldIdx, setFieldIdx] = useState(0);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const step = wizardSteps[stepIdx];
  const stepFields = useMemo(
    () =>
      (step?.fields ?? [])
        .map((k) => settingsMap.get(k))
        .filter((s): s is Setting => s !== undefined),
    [step, settingsMap],
  );

  const currentField = stepFields[fieldIdx];
  const currentValue = edits[currentField?.key ?? ""] ?? "";

  const totalSteps = wizardSteps.length;

  const saveStep = useCallback(async (): Promise<void> => {
    if (!step || !user) {
      return;
    }
    const toSave: Record<string, string> = {};
    for (const key of step.fields) {
      const v = edits[key];
      if (v !== undefined && v !== "") {
        toSave[key] = v;
      }
    }
    if (Object.keys(toSave).length === 0) {
      return;
    }

    setSaving(true);
    setSaveMsg(null);
    try {
      const { RouteExecutionExecutor } =
        await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");
      await RouteExecutionExecutor.executeGenericHandler({
        toolName: "init",
        data: { settings: toSave },
        urlPathParams: {},
        user,
        locale,
        logger,
        platform: platform as Parameters<
          typeof RouteExecutionExecutor.executeGenericHandler
        >[0]["platform"],
        streamContext: {
          rootFolderId: DefaultFolderId.CRON,
          threadId: undefined,
          aiMessageId: undefined,
          skillId: undefined,
          headless: undefined,
          subAgentDepth: 0,
          isRevival: undefined,

          providerOverride: undefined,
          currentToolMessageId: undefined,
          callerToolCallId: undefined,
          pendingToolMessages: undefined,
          pendingTimeoutMs: undefined,
          leafMessageId: undefined,
          waitingForRemoteResult: undefined,
          favoriteId: undefined,
          abortSignal: new AbortController().signal,
          callerCallbackMode: undefined,
          onEscalatedTaskCancel: undefined,
          escalateToTask: undefined,
        },
      });
      setSaveMsg("Saved ✓");
    } catch {
      setSaveMsg("Save failed");
    } finally {
      setSaving(false);
    }
  }, [step, edits, user, locale, logger, platform]);

  const advanceField = useCallback((): void => {
    if (fieldIdx < stepFields.length - 1) {
      setFieldIdx((i) => i + 1);
    } else {
      // End of step fields - save and advance to next step
      void saveStep().then(() => {
        if (stepIdx < totalSteps - 1) {
          setStepIdx((s) => s + 1);
          setFieldIdx(0);
          setSaveMsg(null);
        } else {
          setDone(true);
        }
        return undefined;
      });
    }
  }, [fieldIdx, stepFields.length, saveStep, stepIdx, totalSteps]);

  // Handle keyboard: Enter = next field, g = generate secret, Escape/q = quit
  useInput(
    (input, key) => {
      if (key.escape || input === "q") {
        exit();
        return;
      }
      if (key.return) {
        advanceField();
        return;
      }
      if (input === "g" && currentField?.autoGenerate) {
        const generated = generateSecret(currentField.autoGenerate);
        setEdits((prev) => ({
          ...prev,
          [currentField.key]: generated,
        }));
      }
    },
    { isActive: !saving && !done && isRawModeSupported },
  );

  useEffect(() => {
    if (done) {
      onDone();
    }
  }, [done, onDone]);

  const sensitiveIcon = "\u26a1";

  if (done) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text bold color="green">
          {t("wizard.done")}
        </Text>
        <Text dimColor>{t("wizard.doneSubtitle")}</Text>
      </Box>
    );
  }

  const stepLabel =
    t(`wizard.steps.${step?.group ?? ""}`) ??
    STEP_LABELS[step?.group ?? ""] ??
    step?.group ??
    "";

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="cyan">
          {t("wizard.title")}
        </Text>
        <Text dimColor>
          {`${t("wizard.stepOf")
            .replace("{{step}}", String(stepIdx + 1))
            .replace("{{total}}", String(totalSteps))}: ${stepLabel}`}
        </Text>
      </Box>

      {/* Step indicator */}
      <Box marginBottom={1}>
        {wizardSteps.map((s, i) => (
          <Text
            key={s.step}
            color={i === stepIdx ? "cyan" : i < stepIdx ? "green" : undefined}
            dimColor={i > stepIdx}
          >
            {i > 0 ? " › " : ""}
            {i < stepIdx ? "✓" : i === stepIdx ? "●" : "○"}{" "}
            {t(`wizard.steps.${s.group}`) ?? STEP_LABELS[s.group] ?? s.group}
          </Text>
        ))}
      </Box>

      {/* Current field */}
      {currentField && (
        <Box
          borderStyle="round"
          borderColor="cyan"
          paddingX={1}
          paddingY={1}
          flexDirection="column"
          marginBottom={1}
        >
          {currentField.key === "CLAUDE_CODE_ENABLED" ? (
            /* Special Claude Code display - no text input, just status */
            <Box flexDirection="column" gap={1}>
              <Text bold color="cyan">
                {t("wizard.ai.claudeCodeTitle")}
              </Text>
              <Text dimColor>{t("wizard.ai.claudeCodeDescription")}</Text>
              {currentField.value === "true" || currentField.isConfigured ? (
                <Text color="green">{t("wizard.ai.claudeDetected")}</Text>
              ) : (
                <Box flexDirection="column">
                  <Text color="yellow">{t("wizard.ai.claudeNotDetected")}</Text>
                  <Text dimColor>{t("wizard.ai.claudeInstallHint")}</Text>
                </Box>
              )}
              <Text dimColor>{`[${t("wizard.next")}] continue`}</Text>
            </Box>
          ) : currentField.key === "UNBOTTLED_CLOUD_CREDENTIALS" ? (
            /* Special unbottled login - prompt email, password, url then sign in */
            <UnbottledCliLoginField
              currentField={currentField}
              locale={locale}
              t={t}
              onCredential={(credential): void => {
                setEdits((prev) => ({
                  ...prev,
                  [currentField.key]: credential,
                }));
              }}
            />
          ) : currentField.key === "OPENROUTER_API_KEY" ? (
            /* OpenRouter with extra hints */
            <Box flexDirection="column" gap={1}>
              <Box>
                <Text color="green">{sensitiveIcon}</Text>
                <Text bold>{` ${currentField.key}`}</Text>
                <Text color="yellow">{` [${t("widget.required")}]`}</Text>
              </Box>
              <Text dimColor>{t("wizard.ai.openRouterDescription")}</Text>
              <Text color="blue" dimColor>
                {t("wizard.ai.openRouterHint")}
              </Text>
              <Text color="green" dimColor>
                {t("wizard.encryptionNote")}
              </Text>
              <Box marginTop={1}>
                <Text dimColor>{`${t("wizard.ai.openRouterTitle")}: `}</Text>
                <TextInput
                  value={currentValue}
                  mask="*"
                  placeholder={currentField.example || "sk-or-v1-..."}
                  onChange={(v): void => {
                    setEdits((prev) => ({ ...prev, [currentField.key]: v }));
                  }}
                />
              </Box>
            </Box>
          ) : (
            /* Standard field rendering */
            <Box flexDirection="column">
              <Box>
                {currentField.isSensitive && (
                  <Text color="green">{sensitiveIcon}</Text>
                )}
                <Text bold>{currentField.key}</Text>
                {currentField.onboardingRequired && (
                  <Text color="yellow">{` [${t("widget.required")}]`}</Text>
                )}
                {currentField.autoGenerate && (
                  <Text color="blue">{` [${t("wizard.alreadyConfigured")}]`}</Text>
                )}
              </Box>

              {currentField.comment ? (
                <Text dimColor>{currentField.comment}</Text>
              ) : null}

              {currentField.isSensitive && !currentField.autoGenerate && (
                <Text color="green" dimColor>
                  {t("wizard.encryptionNote")}
                </Text>
              )}
              {currentField.autoGenerate && (
                <Text color="blue" dimColor>
                  {t("wizard.autoGeneratedNote")}
                </Text>
              )}

              <Box marginTop={1}>
                <Text dimColor>
                  {`${currentField.isSensitive ? "Password" : "Value"}: `}
                </Text>
                <TextInput
                  value={currentValue}
                  mask={currentField.isSensitive ? "*" : undefined}
                  placeholder={
                    currentField.isConfigured && !currentField.isSensitive
                      ? currentField.value
                      : currentField.example || undefined
                  }
                  onChange={(v): void => {
                    setEdits((prev) => ({ ...prev, [currentField.key]: v }));
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Field list for this step */}
      <Box marginBottom={1}>
        {stepFields.map((s, i) => (
          <Text
            key={s.key}
            color={i === fieldIdx ? "cyan" : i < fieldIdx ? "green" : undefined}
            dimColor={i > fieldIdx}
          >
            {i > 0 ? "  " : ""}
            {i < fieldIdx ? "✓" : i === fieldIdx ? "▸" : "○"} {s.key}
          </Text>
        ))}
      </Box>

      {/* Status */}
      {saving && <Text color="yellow">{t("widget.saving")}</Text>}
      {saveMsg && (
        <Text color={saveMsg.includes("✓") ? "green" : "red"}>{saveMsg}</Text>
      )}

      {/* Footer */}
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>
          {`[Enter] ${t("wizard.next")}  [Esc/q] ${t("wizard.back")}`}
          {currentField?.autoGenerate ? `  [g] ${t("widget.generate")}` : ""}
        </Text>
      </Box>
    </Box>
  );
}

// ── Widget Component ─────────────────────────────────────────────────────

export function SystemSettingsWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;

  const value = field.value;

  const output = useMemo(() => {
    if (!value || !Array.isArray(value.modules)) {
      return "";
    }
    const tStr = t as (key: string) => string;
    return isMcp ? renderMcp(value, tStr) : renderCli(value, tStr);
  }, [value, isMcp, t]);

  if (!output) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text wrap="truncate-end">{output}</Text>
    </Box>
  );
}

SystemSettingsWidget.cliWidget = true as const;

// ── PATCH Widget: Interactive editor (fetches GET data internally) ────────

export function SystemSettingsPatchWidget(): JSX.Element {
  const { exit } = useApp();
  const platform = useWidgetPlatform();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const { isRawModeSupported } = useStdin();
  const t = useWidgetTranslation<typeof endpoints.GET>() as (
    k: string,
  ) => string;

  const [data, setData] = useState<SystemSettingsGetResponseOutput | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wizardMode, setWizardMode] = useState(false);
  const [editorMode, setEditorMode] = useState(false);

  // Fetch GET data on mount
  useEffect(() => {
    if (!user) {
      return;
    }
    void (async (): Promise<void> => {
      try {
        const { RouteExecutionExecutor } =
          await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");
        const result = await RouteExecutionExecutor.executeGenericHandler({
          toolName: "system-settings",
          data: {},
          urlPathParams: {},
          user,
          locale,
          logger,
          platform: platform as Parameters<
            typeof RouteExecutionExecutor.executeGenericHandler
          >[0]["platform"],
          streamContext: {
            rootFolderId: DefaultFolderId.CRON,
            threadId: undefined,
            aiMessageId: undefined,
            skillId: undefined,
            headless: undefined,
            subAgentDepth: 0,
            isRevival: undefined,

            providerOverride: undefined,
            currentToolMessageId: undefined,
            callerToolCallId: undefined,
            pendingToolMessages: undefined,
            pendingTimeoutMs: undefined,
            leafMessageId: undefined,
            waitingForRemoteResult: undefined,
            favoriteId: undefined,
            abortSignal: new AbortController().signal,
            callerCallbackMode: undefined,
            onEscalatedTaskCancel: undefined,
            escalateToTask: undefined,
          },
        });
        if (result.success) {
          const value = result.data as SystemSettingsGetResponseOutput;
          // Always open wizard when invoked via `vibe init` - either because
          // onboarding is required, or because the user explicitly ran init.
          // When already configured, open wizard anyway (they asked for it).
          // Editor is reachable from the idle menu via [e].
          setData(value);
          if (value.wizardSteps.length > 0) {
            setWizardMode(true);
          } else {
            setEditorMode(true);
          }
          setLoading(false);
        } else {
          setError(t("errors.readFailed"));
          setLoading(false);
        }
      } catch {
        setError(t("errors.readFailed"));
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard: 'w' = wizard, 'e' = editor, 'q'/Escape = exit when idle
  useInput(
    (input, key) => {
      if (!data) {
        return;
      }
      if (key.escape || input === "q") {
        exit();
        return;
      }
      if (input === "w" && data.wizardSteps.length > 0) {
        setWizardMode(true);
        setEditorMode(false);
      }
      if (input === "e" && data.isWritable) {
        setEditorMode(true);
        setWizardMode(false);
      }
    },
    { isActive: !wizardMode && !editorMode && isRawModeSupported },
  );

  if (loading) {
    return (
      <Box paddingX={2} paddingY={1}>
        <Text color="cyan">{t("widget.loading")}</Text>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box paddingX={2} paddingY={1}>
        <Text color="red">{error ?? t("errors.readFailed")}</Text>
      </Box>
    );
  }

  if (wizardMode) {
    return <CliWizard value={data} onDone={(): void => setWizardMode(false)} />;
  }

  if (editorMode) {
    return <CliEditor value={data} onDone={(): void => setEditorMode(false)} />;
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text bold color="cyan">
        {data.isWritable ? t("widget.title") : t("widget.readOnlyBanner")}
      </Text>
      <Text dimColor>
        {`  [w] ${t("widget.restartWizard")}  [e] ${t("widget.editSettings")}  [q] exit`}
      </Text>
    </Box>
  );
}

SystemSettingsPatchWidget.cliWidget = true as const;
