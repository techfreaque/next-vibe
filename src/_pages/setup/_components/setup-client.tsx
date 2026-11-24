"use client";

/**
 * First-run setup: admin login, AI connection, optional extras, done.
 *
 * Saves go through the system settings PATCH (writes .env). On the dev
 * server that restarts the instance and reloads the page; the step cookie
 * makes the reload land on the next step.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import settingsEndpoints from "next-vibe/env/settings/definition";
import { broadcastAuthChange } from "next-vibe/identity/auth/tab-sync";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { isDefaultAdminPassword } from "next-vibe/identity/default-admin-password";
import {
  SETUP_STATE,
  SETUP_STEP_COOKIE,
  SETUP_STEPS,
  type SetupStep,
} from "next-vibe/identity/setup-state";
import instanceEndpoints from "next-vibe/remote-connection/[instanceId]/definition";
import { scopedTranslation as connectScopedTranslation } from "next-vibe/remote-connection/connect/i18n";
import type { SyncScope } from "next-vibe/remote-connection/db";
import { SyncScopeSchema } from "next-vibe/remote-connection/db";
import { useRemoteConnections } from "next-vibe/remote-connection/list/hooks";
import type { SyncProviderInfo } from "next-vibe/remote-connection/sync/providers/definition";
import syncProvidersDefinitions from "next-vibe/remote-connection/sync/providers/definition";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe/ui/components/collapsible";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronUp } from "next-vibe/ui/components/icons/ChevronUp";
import { Cloud } from "next-vibe/ui/components/icons/Cloud";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Database } from "next-vibe/ui/components/icons/Database";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { Key } from "next-vibe/ui/components/icons/Key";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { Link } from "next-vibe/ui/components/link";
import { Main } from "next-vibe/ui/components/main";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { Switch } from "next-vibe/ui/components/switch";
import { H1, H2, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { deleteCookie, setCookie } from "next-vibe/ui/lib/cookies";
import { assignUrl, reloadPage } from "next-vibe/ui/lib/location";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import type { JSX, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Logo } from "@/_pages/_components/logo";
import type { EnvKeyName } from "@/generated/env/keys";
import loginEndpoints from "@/user/public/login/definition";

import { scopedTranslation } from "../i18n";
import type { SetupPageData } from "../page";
import {
  EXTRA_SECTIONS,
  PROVIDER_FIELDS,
  type SetupField,
  type SetupSection,
  STORAGE_S3,
} from "./setup-fields";
import type { SetupSnapshot } from "./setup-snapshot";

type SetupT = ReturnType<typeof scopedTranslation.scopedT>["t"];
type Edits = Partial<Record<EnvKeyName, string>>;

/** After this long without the automatic reload, offer a manual one. */
const RESTART_SLOW_MS = 30_000;
const UNBOTTLED_URL = "https://unbottled.ai";
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WIZARD_STEPS = SETUP_STEPS;

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

function SetupShell({
  locale,
  children,
}: {
  locale: CountryLanguage;
  children: ReactNode;
}): JSX.Element {
  return (
    <Main className="flex min-h-screen flex-col bg-background">
      <Div className="flex flex-1 flex-col items-center px-4 pb-12 pt-8 sm:pt-14">
        <Div className="mb-8 flex justify-center">
          <Logo locale={locale} size="h-9" disabled />
        </Div>
        <Div className="w-full max-w-xl">{children}</Div>
      </Div>
    </Main>
  );
}

function StepIndicator({
  step,
  t,
}: {
  step: SetupStep;
  t: SetupT;
}): JSX.Element {
  const current = WIZARD_STEPS.indexOf(step);
  return (
    <Div className="mb-6 flex flex-col gap-3">
      <Span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t("stepOf", {
          current: String(current + 1),
          total: String(WIZARD_STEPS.length),
        })}
      </Span>
      <Div className="grid grid-cols-4 gap-2">
        {WIZARD_STEPS.map((s, idx) => (
          <Div key={s} className="flex flex-col gap-1.5">
            <Div
              className={cn(
                "h-1 rounded-full transition-colors",
                idx <= current ? "bg-primary" : "bg-muted",
              )}
            />
            <Span
              className={cn(
                "truncate text-xs",
                idx === current
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {t(`steps.${s}`)}
            </Span>
          </Div>
        ))}
      </Div>
    </Div>
  );
}

function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm sm:p-7",
        className,
      )}
    >
      {children}
    </Div>
  );
}

function StepHeading({
  title,
  body,
}: {
  title: string;
  body: string;
}): JSX.Element {
  return (
    <Div className="mb-6 flex flex-col gap-1.5">
      <H1 className="m-0 text-2xl font-semibold tracking-tight lg:text-2xl">
        {title}
      </H1>
      <P className="m-0 text-sm text-muted-foreground">{body}</P>
    </Div>
  );
}

function Notice({
  tone,
  children,
}: {
  tone: "error" | "warning" | "success" | "info";
  children: ReactNode;
}): JSX.Element {
  const tones = {
    error: "border-destructive/30 bg-destructive/10 text-destructive",
    warning: "border-warning/30 bg-warning/10 text-warning",
    success: "border-success/30 bg-success/10 text-success",
    info: "border-border bg-muted/50 text-muted-foreground",
  } as const;
  return (
    <Div
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
        tones[tone],
      )}
    >
      {tone === "success" ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <Div className="flex min-w-0 flex-col gap-1">{children}</Div>
    </Div>
  );
}

/** The env key behind a field, for people who also edit .env by hand. */
function EnvKeyHint({ envKey }: { envKey: EnvKeyName }): JSX.Element {
  return (
    <Span className="font-mono text-[11px] text-muted-foreground/70">
      {envKey}
    </Span>
  );
}

// ---------------------------------------------------------------------------
// Fields
// ---------------------------------------------------------------------------

function TextField({
  id,
  label,
  help,
  type = "text",
  value,
  placeholder,
  autoComplete,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  help?: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  placeholder?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-1.5">
      <Div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {hint}
      </Div>
      <Input
        id={id}
        type={type === "number" ? "text" : type}
        className="h-10"
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChangeText={onChange}
      />
      {help && <Span className="text-xs text-muted-foreground">{help}</Span>}
    </Div>
  );
}

function SettingField({
  field,
  snapshot,
  value,
  onChange,
  t,
}: {
  field: SetupField;
  snapshot: SetupSnapshot;
  value: string | undefined;
  onChange: (key: EnvKeyName, value: string) => void;
  t: SetupT;
}): JSX.Element {
  const current = snapshot.fields[field.envKey];
  const configured = current?.configured ?? false;
  const label = t(`fields.${field.id}.label`);
  const help = t(`fields.${field.id}.help`);
  const inputId = `setup-${field.id}`;
  const hint = <EnvKeyHint envKey={field.envKey} />;

  if (field.kind === "boolean") {
    const checked = (value ?? current?.value ?? "") === "true";
    return (
      <Div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5">
        <Div className="flex flex-col gap-0.5">
          <Label htmlFor={inputId}>{label}</Label>
          {help && (
            <Span className="text-xs text-muted-foreground">{help}</Span>
          )}
        </Div>
        <Switch
          id={inputId}
          checked={checked}
          onCheckedChange={(next: boolean): void =>
            onChange(field.envKey, next ? "true" : "false")
          }
        />
      </Div>
    );
  }

  if (field.kind === "select" && field.options) {
    const selected = value ?? current?.value ?? field.options[0] ?? "";
    return (
      <Div className="flex flex-col gap-1.5">
        <Div className="flex items-baseline justify-between gap-2">
          <Label htmlFor={inputId}>{label}</Label>
          {hint}
        </Div>
        <Select
          value={selected}
          onValueChange={(next: string): void => onChange(field.envKey, next)}
        >
          <SelectTrigger id={inputId} className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option === STORAGE_S3
                  ? t("fields.storageType.optionS3")
                  : t("fields.storageType.optionFilesystem")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {help && <Span className="text-xs text-muted-foreground">{help}</Span>}
      </Div>
    );
  }

  const isSecret = field.kind === "secret";
  const placeholder =
    isSecret && configured
      ? t("secretSaved")
      : current?.example || (current?.value ?? "");
  return (
    <Div className="flex flex-col gap-1.5">
      <TextField
        id={inputId}
        label={label}
        type={
          isSecret
            ? "password"
            : field.kind === "email"
              ? "email"
              : field.kind === "number"
                ? "number"
                : "text"
        }
        value={value ?? (isSecret ? "" : (current?.value ?? ""))}
        placeholder={placeholder}
        autoComplete={isSecret ? "new-password" : "off"}
        onChange={(next): void => onChange(field.envKey, next)}
        help={help}
        hint={hint}
      />
      {field.getKeyUrl && (
        <Link
          href={field.getKeyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {t("getKey")}
          <ExternalLink className="h-3 w-3" />
        </Link>
      )}
    </Div>
  );
}

/** Edits worth sending: non-empty and different from what is stored. */
function changedEdits(edits: Edits, snapshot: SetupSnapshot): Edits {
  const out: Edits = {};
  for (const [key, value] of Object.entries(edits) as [EnvKeyName, string][]) {
    if (value === undefined || value === "") {
      continue;
    }
    if (snapshot.fields[key]?.value === value) {
      continue;
    }
    out[key] = value;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Save + restart handling
// ---------------------------------------------------------------------------

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "restarting"; slow: boolean }
  | { kind: "manualRestart"; next: SetupStep }
  | { kind: "error"; message: string };

function useStepSaver({
  user,
  snapshot,
  onAdvance,
}: {
  user: JwtPayloadType;
  snapshot: SetupSnapshot;
  onAdvance: (step: SetupStep) => void;
}): {
  state: SaveState;
  save: (values: Edits, next: SetupStep) => Promise<void>;
  clearError: () => void;
} {
  const logger = useLogger();
  const patch = useApiMutation(settingsEndpoints.PATCH, logger, user);
  const [state, setState] = useState<SaveState>({ kind: "idle" });

  useEffect(() => {
    if (state.kind !== "restarting" || state.slow) {
      return undefined;
    }
    const timer = setTimeout(
      () => setState({ kind: "restarting", slow: true }),
      RESTART_SLOW_MS,
    );
    return (): void => clearTimeout(timer);
  }, [state]);

  const save = useCallback(
    async (values: Edits, next: SetupStep): Promise<void> => {
      setState({ kind: "saving" });
      // Remember the next step first: once .env is written the dev server
      // restarts and reloads this page, possibly before the response lands.
      await setCookie(SETUP_STEP_COOKIE, next, logger);
      if (Object.keys(values).length === 0) {
        setState({ kind: "idle" });
        onAdvance(next);
        return;
      }
      const result = await patch.mutateAsync({
        requestData: { VIBE_SETUP_STATE: SETUP_STATE.IN_PROGRESS, ...values },
      });
      if (!result.success) {
        const previous =
          WIZARD_STEPS[Math.max(0, WIZARD_STEPS.indexOf(next) - 1)];
        if (previous) {
          await setCookie(SETUP_STEP_COOKIE, previous, logger);
        }
        setState({ kind: "error", message: result.message });
        return;
      }
      setState(
        snapshot.autoRestart
          ? { kind: "restarting", slow: false }
          : { kind: "manualRestart", next },
      );
    },
    [logger, patch, onAdvance, snapshot.autoRestart],
  );

  const clearError = useCallback((): void => setState({ kind: "idle" }), []);
  return { state, save, clearError };
}

function RestartPanel({
  state,
  onContinue,
  t,
}: {
  state: SaveState;
  onContinue: (step: SetupStep) => void;
  t: SetupT;
}): JSX.Element | null {
  if (state.kind === "restarting") {
    return (
      <Card>
        <Div className="flex flex-col items-center gap-4 py-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <Div className="flex flex-col gap-1">
            <H2 className="m-0 border-0 pb-0 text-lg font-semibold lg:text-lg">
              {t("restart.title")}
            </H2>
            <P className="m-0 max-w-sm text-sm text-muted-foreground">
              {t("restart.body")}
            </P>
          </Div>
          {state.slow && (
            <Div className="flex flex-col items-center gap-2">
              <Span className="text-xs text-muted-foreground">
                {t("restart.slow")}
              </Span>
              <Button variant="outline" size="sm" onClick={reloadPage}>
                {t("restart.reload")}
              </Button>
            </Div>
          )}
        </Div>
      </Card>
    );
  }
  if (state.kind === "manualRestart") {
    return (
      <Card>
        <Div className="flex flex-col items-center gap-4 py-6 text-center">
          <Check className="h-8 w-8 text-success" />
          <Div className="flex flex-col gap-1">
            <H2 className="m-0 border-0 pb-0 text-lg font-semibold lg:text-lg">
              {t("restart.manualTitle")}
            </H2>
            <P className="m-0 max-w-sm text-sm text-muted-foreground">
              {t("restart.manualBody")}
            </P>
          </Div>
          <Button onClick={(): void => onContinue(state.next)}>
            {t("restart.continue")}
          </Button>
        </Div>
      </Card>
    );
  }
  return null;
}

function StepFooter({
  onBack,
  children,
  t,
}: {
  onBack?: () => void;
  children: ReactNode;
  t: SetupT;
}): JSX.Element {
  return (
    <Div className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <Button variant="ghost" onClick={onBack} className="sm:-ml-3">
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("back")}
        </Button>
      ) : (
        <Div />
      )}
      <Div className="flex flex-col-reverse gap-2 sm:flex-row">{children}</Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Welcome (not signed in as admin yet)
// ---------------------------------------------------------------------------

function WelcomeStep({
  locale,
  user,
  bootstrap,
  writable,
  t,
}: Pick<SetupPageData, "locale" | "user" | "bootstrap" | "writable"> & {
  t: SetupT;
}): JSX.Element {
  const logger = useLogger();
  const login = useApiMutation(loginEndpoints.POST, logger, user);
  const [failed, setFailed] = useState(false);

  const start = useCallback(async (): Promise<void> => {
    if (!bootstrap) {
      return;
    }
    setFailed(false);
    const result = await login.mutateAsync({
      requestData: {
        email: bootstrap.email,
        password: bootstrap.password,
        rememberMe: true,
      },
    });
    if (!result.success) {
      setFailed(true);
      return;
    }
    broadcastAuthChange("login", logger);
    await setCookie(SETUP_STEP_COOKIE, "admin", logger);
    assignUrl(`/${locale}/setup`);
  }, [bootstrap, login, logger, locale]);

  const signInHref = `/${locale}/user/login?callbackUrl=${encodeURIComponent(`/${locale}/setup`)}`;

  return (
    <Card>
      <Div className="flex flex-col gap-6">
        <Div className="flex flex-col gap-2">
          <H1 className="m-0 text-3xl font-semibold tracking-tight lg:text-3xl">
            {t("welcome.title")}
          </H1>
          <P className="m-0 text-base text-muted-foreground">
            {bootstrap ? t("welcome.body") : t("welcome.inProgress")}
          </P>
        </Div>

        <Div className="grid gap-2 sm:grid-cols-3">
          {(["admin", "ai", "extras"] as const).map((s, idx) => (
            <Div
              key={s}
              className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2.5"
            >
              <Span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {idx + 1}
              </Span>
              <Span className="text-sm">{t(`steps.${s}`)}</Span>
            </Div>
          ))}
        </Div>

        {!writable && (
          <Notice tone="warning">
            <Span className="font-medium">{t("readOnly.title")}</Span>
            <Span>{t("readOnly.body")}</Span>
          </Notice>
        )}
        {failed && <Notice tone="error">{t("welcome.failed")}</Notice>}

        {bootstrap && writable ? (
          <Button
            size="lg"
            className="w-full sm:w-fit"
            disabled={login.isPending}
            onClick={start}
          >
            {login.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("welcome.starting")}
              </>
            ) : (
              t("welcome.start")
            )}
          </Button>
        ) : (
          <Button size="lg" className="w-full sm:w-fit" asChild>
            <Link href={signInHref}>{t("welcome.signIn")}</Link>
          </Button>
        )}
      </Div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Step 1: admin login
// ---------------------------------------------------------------------------

function AdminStep({
  snapshot,
  saver,
  t,
}: {
  snapshot: SetupSnapshot;
  saver: ReturnType<typeof useStepSaver>;
  t: SetupT;
}): JSX.Element {
  const [email, setEmail] = useState(snapshot.adminEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const error = ((): string | null => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      return t("admin.errors.email");
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return t("admin.errors.passwordShort");
    }
    if (isDefaultAdminPassword(password)) {
      return t("admin.errors.passwordDefault");
    }
    if (password !== confirm) {
      return t("admin.errors.mismatch");
    }
    return null;
  })();

  const submit = async (): Promise<void> => {
    setSubmitted(true);
    if (error) {
      return;
    }
    await saver.save(
      {
        VIBE_ADMIN_USER_EMAIL: email.trim(),
        VIBE_ADMIN_USER_PASSWORD: password,
        VIBE_SETUP_STATE: SETUP_STATE.IN_PROGRESS,
      },
      "ai",
    );
  };

  return (
    <Card>
      <StepHeading title={t("admin.title")} body={t("admin.body")} />
      <Div className="flex flex-col gap-4">
        <TextField
          id="setup-admin-email"
          label={t("admin.email")}
          help={t("admin.emailHelp")}
          type="email"
          value={email}
          placeholder={t("admin.emailPlaceholder")}
          autoComplete="username"
          onChange={setEmail}
          hint={<EnvKeyHint envKey="VIBE_ADMIN_USER_EMAIL" />}
        />
        <TextField
          id="setup-admin-password"
          label={t("admin.password")}
          help={t("admin.passwordHelp")}
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={setPassword}
          hint={<EnvKeyHint envKey="VIBE_ADMIN_USER_PASSWORD" />}
        />
        <TextField
          id="setup-admin-confirm"
          label={t("admin.confirm")}
          type="password"
          value={confirm}
          autoComplete="new-password"
          onChange={setConfirm}
        />
        {submitted && error && <Notice tone="error">{error}</Notice>}
        {saver.state.kind === "error" && (
          <Notice tone="error">{t("errors.saveFailed")}</Notice>
        )}
      </Div>
      <StepFooter t={t}>
        <Button
          size="lg"
          disabled={saver.state.kind === "saving"}
          onClick={(): void => {
            void submit();
          }}
        >
          {saver.state.kind === "saving" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("admin.save")}
        </Button>
      </StepFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Step 2: AI
// ---------------------------------------------------------------------------

function UnbottledCard({
  user,
  locale,
  t,
}: {
  user: JwtPayloadType;
  locale: CountryLanguage;
  t: SetupT;
}): JSX.Element {
  const logger = useLogger();
  const { t: connectT } = connectScopedTranslation.scopedT(locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remoteUrl, setRemoteUrl] = useState(UNBOTTLED_URL);
  const [syncScope, setSyncScope] = useState<SyncScope>(() =>
    SyncScopeSchema.parse({}),
  );
  const [failed, setFailed] = useState(false);

  const connections = useRemoteConnections(logger, user);
  const refetch = connections.read?.refetch;
  const connectionList = connections.read?.data?.connections;
  const provider = useMemo(
    () => connectionList?.find((c) => c.isInferenceProvider),
    [connectionList],
  );
  const syncProvidersEndpoint = useEndpoint(
    syncProvidersDefinitions,
    undefined,
    logger,
    user,
  );
  const syncProviders: SyncProviderInfo[] =
    syncProvidersEndpoint.read?.data?.providers ?? [];

  const connect = useApiMutation(settingsEndpoints.POST, logger, user);
  const disconnect = useApiMutation(instanceEndpoints.DELETE, logger, user);
  const busy = connect.isPending || disconnect.isPending;

  const handleConnect = async (): Promise<void> => {
    setFailed(false);
    const result = await connect.mutateAsync({
      requestData: {
        email,
        password,
        remoteUrl: remoteUrl.replace(/\/+$/, ""),
        syncScope,
      },
    });
    if (!result.success || !result.data?.connected) {
      setFailed(true);
      return;
    }
    setPassword("");
    await refetch?.();
  };

  const handleDisconnect = async (): Promise<void> => {
    if (!provider) {
      return;
    }
    const result = await disconnect.mutateAsync({
      urlPathParams: { instanceId: provider.instanceId },
    });
    if (result.success) {
      await refetch?.();
    }
  };

  return (
    <Div className="flex flex-col gap-4 rounded-xl border border-primary/40 bg-primary/5 p-4 sm:p-5">
      <Div className="flex flex-col gap-1.5">
        <Div className="flex flex-wrap items-center gap-2">
          <Cloud className="h-4 w-4 text-primary" />
          <Span className="font-semibold">{t("ai.unbottled.title")}</Span>
          <Badge>{t("ai.unbottled.recommended")}</Badge>
        </Div>
        <Span className="text-sm text-muted-foreground">
          {t("ai.unbottled.body")}
        </Span>
      </Div>

      {provider ? (
        <Div className="flex flex-col gap-3">
          {provider.healthStatus === "healthy" ? (
            <Notice tone="success">
              {t("ai.unbottled.connected", { url: provider.remoteUrl })}
            </Notice>
          ) : (
            <Notice tone="warning">{t("ai.unbottled.unhealthy")}</Notice>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            disabled={busy}
            onClick={(): void => {
              void handleDisconnect();
            }}
          >
            {t("ai.unbottled.disconnect")}
          </Button>
        </Div>
      ) : (
        <Div className="flex flex-col gap-3">
          <TextField
            id="setup-unbottled-email"
            label={t("ai.unbottled.email")}
            type="email"
            value={email}
            autoComplete="off"
            onChange={setEmail}
          />
          <TextField
            id="setup-unbottled-password"
            label={t("ai.unbottled.password")}
            type="password"
            value={password}
            autoComplete="off"
            onChange={setPassword}
          />
          <Collapsible>
            <CollapsibleTrigger className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
              {t("ai.unbottled.advanced")}
              <ChevronDown className="h-3.5 w-3.5 group-data-[state=open]:hidden" />
              <ChevronUp className="hidden h-3.5 w-3.5 group-data-[state=open]:block" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 flex flex-col gap-3">
              <TextField
                id="setup-unbottled-url"
                label={t("ai.unbottled.serverUrl")}
                help={t("ai.unbottled.serverUrlHelp")}
                value={remoteUrl}
                onChange={setRemoteUrl}
              />
              {syncProviders.length > 0 && (
                <Div className="flex flex-col gap-2">
                  <Span className="text-sm font-medium">
                    {connectT("post.syncScope.label")}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {connectT("post.syncScope.description")}
                  </Span>
                  {syncProviders.map((p) => (
                    <Div
                      key={p.key}
                      className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2"
                    >
                      <Span className="text-sm">{p.label}</Span>
                      <Switch
                        checked={
                          (syncScope as Record<string, boolean | undefined>)[
                            p.key
                          ] ?? false
                        }
                        onCheckedChange={(checked: boolean): void =>
                          setSyncScope(
                            (prev) =>
                              ({ ...prev, [p.key]: checked }) as SyncScope,
                          )
                        }
                        aria-label={p.label}
                      />
                    </Div>
                  ))}
                </Div>
              )}
            </CollapsibleContent>
          </Collapsible>
          {failed && <Notice tone="error">{t("ai.unbottled.failed")}</Notice>}
          <Div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Button
              disabled={busy || !email || !password}
              onClick={(): void => {
                void handleConnect();
              }}
            >
              {connect.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {connect.isPending
                ? t("ai.unbottled.connecting")
                : t("ai.unbottled.connect")}
            </Button>
            <Span className="text-sm text-muted-foreground">
              {t("ai.unbottled.noAccount")}{" "}
              <Link
                href={`${UNBOTTLED_URL}/${locale}/user/signup`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {t("ai.unbottled.createAccount")}
              </Link>
            </Span>
          </Div>
        </Div>
      )}
    </Div>
  );
}

function AiStep({
  user,
  locale,
  snapshot,
  saver,
  onBack,
  t,
}: {
  user: JwtPayloadType;
  locale: CountryLanguage;
  snapshot: SetupSnapshot;
  saver: ReturnType<typeof useStepSaver>;
  onBack: () => void;
  t: SetupT;
}): JSX.Element {
  const [edits, setEdits] = useState<Edits>({});
  const [primary, ...more] = PROVIDER_FIELDS;
  const onChange = useCallback((key: EnvKeyName, value: string): void => {
    setEdits((prev) => ({ ...prev, [key]: value }));
  }, []);
  const toSave = changedEdits(edits, snapshot);

  return (
    <Card>
      <StepHeading title={t("ai.title")} body={t("ai.body")} />
      <Div className="flex flex-col gap-5">
        <UnbottledCard user={user} locale={locale} t={t} />

        <Div className="flex items-center gap-3">
          <Div className="h-px flex-1 bg-border" />
          <Span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("ai.byo")}
          </Span>
          <Div className="h-px flex-1 bg-border" />
        </Div>

        <Div className="flex items-start gap-3 rounded-lg border px-3 py-3">
          <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <Div className="flex min-w-0 flex-1 flex-col gap-1">
            <Div className="flex flex-wrap items-center gap-2">
              <Span className="text-sm font-medium">
                {t("ai.claude.title")}
              </Span>
              <Badge
                variant={snapshot.claudeCodeDetected ? "success" : "outline"}
              >
                {snapshot.claudeCodeDetected
                  ? t("ai.claude.detectedBadge")
                  : t("ai.claude.missingBadge")}
              </Badge>
            </Div>
            <Span className="text-xs text-muted-foreground">
              {snapshot.claudeCodeDetected
                ? t("ai.claude.detected")
                : t("ai.claude.missing")}
            </Span>
          </Div>
        </Div>

        {primary && (
          <SettingField
            field={primary}
            snapshot={snapshot}
            value={edits[primary.envKey]}
            onChange={onChange}
            t={t}
          />
        )}

        <Collapsible>
          <CollapsibleTrigger className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <Key className="h-4 w-4" />
            {t("ai.moreProviders")}
            <ChevronDown className="h-4 w-4 group-data-[state=open]:hidden" />
            <ChevronUp className="hidden h-4 w-4 group-data-[state=open]:block" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 flex flex-col gap-5">
            {more.map((field) => (
              <SettingField
                key={field.id}
                field={field}
                snapshot={snapshot}
                value={edits[field.envKey]}
                onChange={onChange}
                t={t}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>

        {saver.state.kind === "error" && (
          <Notice tone="error">{t("errors.saveFailed")}</Notice>
        )}
      </Div>
      <StepFooter onBack={onBack} t={t}>
        <Button
          variant="ghost"
          size="lg"
          disabled={saver.state.kind === "saving"}
          onClick={(): void => {
            void saver.save({}, "extras");
          }}
        >
          {t("ai.skip")}
        </Button>
        <Button
          size="lg"
          disabled={saver.state.kind === "saving"}
          onClick={(): void => {
            void saver.save(toSave, "extras");
          }}
        >
          {saver.state.kind === "saving" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("continue")}
        </Button>
      </StepFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Step 3: extras
// ---------------------------------------------------------------------------

const SECTION_ICONS = {
  email: Mail,
  payments: CreditCard,
  storage: Database,
} as const;

function ExtrasSection({
  section,
  snapshot,
  edits,
  onChange,
  t,
}: {
  section: SetupSection;
  snapshot: SetupSnapshot;
  edits: Edits;
  onChange: (key: EnvKeyName, value: string) => void;
  t: SetupT;
}): JSX.Element {
  const Icon = SECTION_ICONS[section.id];
  const status = snapshot.fields[section.statusKey];
  const configured =
    section.statusKey === "CHAT_STORAGE_TYPE"
      ? status?.value === STORAGE_S3
      : (status?.configured ?? false);
  const storageType =
    edits.CHAT_STORAGE_TYPE ??
    snapshot.fields.CHAT_STORAGE_TYPE?.value ??
    "filesystem";
  const visible = section.fields.filter(
    (f) =>
      section.id !== "storage" ||
      f.kind === "select" ||
      storageType === STORAGE_S3,
  );

  return (
    <Collapsible className="rounded-xl border">
      <CollapsibleTrigger className="group flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4" />
        </Span>
        <Div className="flex min-w-0 flex-1 flex-col">
          <Span className="text-sm font-semibold">
            {t(`extras.sections.${section.id}.title`)}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t(`extras.sections.${section.id}.body`)}
          </Span>
        </Div>
        {configured && (
          <Badge variant="success">{t("extras.configured")}</Badge>
        )}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:hidden" />
        <ChevronUp className="hidden h-4 w-4 shrink-0 text-muted-foreground group-data-[state=open]:block" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-4 border-t px-4 py-4">
        {visible.map((field) => (
          <SettingField
            key={field.id}
            field={field}
            snapshot={snapshot}
            value={edits[field.envKey]}
            onChange={onChange}
            t={t}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

/** S3 storage needs every connection value, or the server fails to boot. */
function s3Incomplete(edits: Edits, snapshot: SetupSnapshot): boolean {
  const type =
    edits.CHAT_STORAGE_TYPE ?? snapshot.fields.CHAT_STORAGE_TYPE?.value;
  if (type !== STORAGE_S3) {
    return false;
  }
  const required: EnvKeyName[] = [
    "S3_ENDPOINT",
    "S3_REGION",
    "S3_BUCKET",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
  ];
  return required.some(
    (key) => !edits[key] && !snapshot.fields[key]?.configured,
  );
}

function ExtrasStep({
  snapshot,
  saver,
  onBack,
  t,
}: {
  snapshot: SetupSnapshot;
  saver: ReturnType<typeof useStepSaver>;
  onBack: () => void;
  t: SetupT;
}): JSX.Element {
  const [edits, setEdits] = useState<Edits>({});
  const [submitted, setSubmitted] = useState(false);
  const onChange = useCallback((key: EnvKeyName, value: string): void => {
    setEdits((prev) => ({ ...prev, [key]: value }));
  }, []);
  const incomplete = s3Incomplete(edits, snapshot);
  const finishValues: Edits = {
    ...changedEdits(edits, snapshot),
    VIBE_SETUP_STATE: SETUP_STATE.COMPLETE,
  };

  return (
    <Card>
      <StepHeading title={t("extras.title")} body={t("extras.body")} />
      <Div className="flex flex-col gap-3">
        {EXTRA_SECTIONS.map((section) => (
          <ExtrasSection
            key={section.id}
            section={section}
            snapshot={snapshot}
            edits={edits}
            onChange={onChange}
            t={t}
          />
        ))}
        {submitted && incomplete && (
          <Notice tone="error">{t("extras.errors.s3Incomplete")}</Notice>
        )}
        {saver.state.kind === "error" && (
          <Notice tone="error">{t("errors.saveFailed")}</Notice>
        )}
      </Div>
      <StepFooter onBack={onBack} t={t}>
        <Button
          variant="ghost"
          size="lg"
          disabled={saver.state.kind === "saving"}
          onClick={(): void => {
            void saver.save({ VIBE_SETUP_STATE: SETUP_STATE.COMPLETE }, "done");
          }}
        >
          {t("extras.skipFinish")}
        </Button>
        <Button
          size="lg"
          disabled={saver.state.kind === "saving"}
          onClick={(): void => {
            setSubmitted(true);
            if (incomplete) {
              return;
            }
            void saver.save(finishValues, "done");
          }}
        >
          {saver.state.kind === "saving" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("extras.finish")}
        </Button>
      </StepFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Step 4: done
// ---------------------------------------------------------------------------

function DoneStep({
  user,
  locale,
  snapshot,
  t,
}: {
  user: JwtPayloadType;
  locale: CountryLanguage;
  snapshot: SetupSnapshot;
  t: SetupT;
}): JSX.Element {
  const logger = useLogger();
  const connections = useRemoteConnections(logger, user);
  const unbottled = connections.read?.data?.connections?.some(
    (c) => c.isInferenceProvider,
  );
  const keys = PROVIDER_FIELDS.some(
    (f) => snapshot.fields[f.envKey]?.configured,
  );
  const aiLine = unbottled
    ? t("done.aiUnbottled")
    : keys
      ? t("done.aiKeys")
      : snapshot.claudeCodeDetected
        ? t("done.aiClaude")
        : null;

  const finish = async (href: string): Promise<void> => {
    await deleteCookie(SETUP_STEP_COOKIE, logger);
    assignUrl(href);
  };

  return (
    <Card>
      <Div className="flex flex-col items-center gap-5 py-4 text-center">
        <Div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
          <Check className="h-7 w-7 text-success" />
        </Div>
        <Div className="flex flex-col gap-1.5">
          <H1 className="m-0 text-2xl font-semibold tracking-tight lg:text-2xl">
            {t("done.title")}
          </H1>
          <P className="m-0 text-sm text-muted-foreground">{t("done.body")}</P>
        </Div>
        <Div className="flex w-full flex-col gap-2 text-left">
          {snapshot.adminEmail && (
            <Notice tone="success">
              {t("done.admin", { email: snapshot.adminEmail })}
            </Notice>
          )}
          {aiLine ? (
            <Notice tone="success">{aiLine}</Notice>
          ) : (
            <Notice tone="warning">{t("done.aiNone")}</Notice>
          )}
        </Div>
        <Button
          size="lg"
          className="w-full sm:w-fit"
          onClick={(): void => {
            void finish(`/${locale}/threads/private/new`);
          }}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {t("done.start")}
        </Button>
        <Span className="text-xs text-muted-foreground">{t("done.later")}</Span>
      </Div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function SetupWizard({
  locale,
  user,
  snapshot,
  initialStep,
  writable,
  t,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  snapshot: SetupSnapshot;
  initialStep: SetupStep;
  writable: boolean;
  t: SetupT;
}): JSX.Element {
  const logger = useLogger();
  const [step, setStep] = useState<SetupStep>(initialStep);
  const saver = useStepSaver({ user, snapshot, onAdvance: setStep });

  const goTo = useCallback(
    (next: SetupStep): void => {
      void setCookie(SETUP_STEP_COOKIE, next, logger);
      saver.clearError();
      setStep(next);
    },
    [logger, saver],
  );

  const busy =
    saver.state.kind === "restarting" || saver.state.kind === "manualRestart";

  return (
    <>
      <StepIndicator step={step} t={t} />
      {!writable && step !== "done" && (
        <Div className="mb-4">
          <Notice tone="warning">
            <Span className="font-medium">{t("readOnly.title")}</Span>
            <Span>{t("readOnly.body")}</Span>
          </Notice>
        </Div>
      )}
      {busy ? (
        <RestartPanel
          state={saver.state}
          onContinue={(next): void => {
            saver.clearError();
            setStep(next);
          }}
          t={t}
        />
      ) : step === "admin" ? (
        <AdminStep snapshot={snapshot} saver={saver} t={t} />
      ) : step === "ai" ? (
        <AiStep
          user={user}
          locale={locale}
          snapshot={snapshot}
          saver={saver}
          onBack={(): void => goTo("admin")}
          t={t}
        />
      ) : step === "extras" ? (
        <ExtrasStep
          snapshot={snapshot}
          saver={saver}
          onBack={(): void => goTo("ai")}
          t={t}
        />
      ) : (
        <DoneStep user={user} locale={locale} snapshot={snapshot} t={t} />
      )}
    </>
  );
}

export function SetupPageClient({
  locale,
  user,
  view,
  bootstrap,
  snapshot,
  writable,
}: SetupPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <SetupShell locale={locale}>
      {view.kind === "welcome" || !snapshot ? (
        <WelcomeStep
          locale={locale}
          user={user}
          bootstrap={bootstrap}
          writable={writable}
          t={t}
        />
      ) : (
        <SetupWizard
          locale={locale}
          user={user}
          snapshot={snapshot}
          initialStep={view.step}
          writable={writable}
          t={t}
        />
      )}
    </SetupShell>
  );
}
