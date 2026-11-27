/**
 * Visual Installer Widget
 * Plain, step-by-step local installation progress and optional private GitHub
 * repository setup, styled consistently with /[locale]/setup.
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe/ui/components/collapsible";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { ChevronUp } from "next-vibe/ui/components/icons/ChevronUp";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { Folder } from "next-vibe/ui/components/icons/Folder";
import { GitBranch } from "next-vibe/ui/components/icons/GitBranch";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import type { JSX, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import { SETUP_PATH_SEGMENT } from "../../identity/setup-state";
import { cn } from "../../unified-ui/_shared/cn";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import { useApiMutation } from "../../unified-ui/hooks/use-api-mutation";
import type { InstallerGetResponseOutput, InstallerStepId } from "./definition";
import installerEndpoints from "./definition";
import { InstallerAction, InstallerStepStatus } from "./enum";

const GITHUB_NEW_REPO_URL = "https://github.com/new";
const DEFAULT_REPO_NAME = "next-vibe-private";
const MANUAL_GIT_COMMANDS = [
  "git remote rename origin upstream",
  "git remote add origin https://github.com/<your-user>/next-vibe-private.git",
  "git push -u origin HEAD",
] as const;

type StepStatusValue = InstallerGetResponseOutput["steps"][number]["status"];

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

function StepIcon({ status }: { status: StepStatusValue }): JSX.Element {
  if (status === InstallerStepStatus.DONE) {
    return (
      <Span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
        <Check className="h-3.5 w-3.5" />
      </Span>
    );
  }
  if (status === InstallerStepStatus.IN_PROGRESS) {
    return (
      <Span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      </Span>
    );
  }
  if (status === InstallerStepStatus.ERROR) {
    return (
      <Span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <AlertCircle className="h-3.5 w-3.5" />
      </Span>
    );
  }
  return (
    <Span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
    </Span>
  );
}

function stepBadgeVariant(
  status: StepStatusValue,
): "success" | "destructive" | "secondary" | "outline" {
  if (status === InstallerStepStatus.DONE) {
    return "success";
  }
  if (status === InstallerStepStatus.ERROR) {
    return "destructive";
  }
  if (status === InstallerStepStatus.IN_PROGRESS) {
    return "secondary";
  }
  return "outline";
}

function CopyTextButton({
  text,
  copyLabel,
  copiedLabel,
}: {
  text: string;
  copyLabel: string;
  copiedLabel: string;
}): JSX.Element {
  const logger = useWidgetLogger();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((): void => {
    void copyToClipboard(text, logger).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return undefined;
    });
  }, [logger, text]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-7 shrink-0 gap-1.5 px-2.5 text-xs"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
}

export function InstallerWidget(): JSX.Element {
  const initialSnapshot = useWidgetValue<typeof installerEndpoints.GET>();
  const t = useWidgetTranslation<typeof installerEndpoints.GET>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();

  const [overrideSnapshot, setOverrideSnapshot] =
    useState<InstallerGetResponseOutput | null>(null);
  const [repoName, setRepoName] = useState(DEFAULT_REPO_NAME);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const postMutation = useApiMutation(installerEndpoints.POST, logger, user);
  const snapshot = overrideSnapshot ?? initialSnapshot;

  const runAction = useCallback(
    async (
      action: (typeof InstallerAction)[keyof typeof InstallerAction],
      customRepoName?: string,
    ): Promise<void> => {
      setErrorMessage("");
      setStatusMessage("");
      setPendingAction(action);
      const res = await postMutation.mutateAsync({
        requestData: {
          action,
          ...(customRepoName ? { repoName: customRepoName } : {}),
        },
      });
      setPendingAction(null);
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setOverrideSnapshot(res.data);
      setStatusMessage(res.data.actionMessage);
    },
    [postMutation],
  );

  const stepTitle = useCallback(
    (id: InstallerStepId): string => {
      switch (id) {
        case "git":
          return t("widget.steps.git.title");
        case "bun":
          return t("widget.steps.bun.title");
        case "clone":
          return t("widget.steps.clone.title");
        case "dependencies":
          return t("widget.steps.dependencies.title");
        case "github":
          return t("widget.steps.github.title");
        case "server":
          return t("widget.steps.server.title");
      }
    },
    [t],
  );

  const summary = useMemo(() => {
    const steps = snapshot?.steps ?? [];
    const total = steps.length;
    const readyCount = steps.filter(
      (s) =>
        s.status === InstallerStepStatus.DONE ||
        s.status === InstallerStepStatus.SKIPPED,
    ).length;
    const hasErrors = steps.some((s) => s.status === InstallerStepStatus.ERROR);
    return { total, readyCount, hasErrors };
  }, [snapshot?.steps]);

  if (!snapshot) {
    return (
      <Div className="rounded-2xl border bg-card p-6 shadow-sm">
        <Div className="flex items-center justify-center gap-3 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <Span>{t("widget.rechecking")}</Span>
        </Div>
      </Div>
    );
  }

  const busy = postMutation.isPending;
  const setupHref = snapshot.setup.complete
    ? `/${locale}/threads/private/new`
    : `/${locale}/${SETUP_PATH_SEGMENT}`;
  const manualCommandsJoined = MANUAL_GIT_COMMANDS.join("\n");

  return (
    <Div className="flex flex-col gap-6">
      {/* Step progress bar, matching /[locale]/setup */}
      <Div className="flex flex-col gap-2.5">
        <Span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("widget.progressOf", {
            done: String(summary.readyCount),
            total: String(summary.total),
          })}
        </Span>
        <Div className="grid grid-cols-6 gap-1.5">
          {snapshot.steps.map((step) => (
            <Div
              key={step.id}
              className={cn(
                "h-1 rounded-full transition-colors",
                step.status === InstallerStepStatus.DONE
                  ? "bg-primary"
                  : step.status === InstallerStepStatus.SKIPPED
                    ? "bg-primary/40"
                    : step.status === InstallerStepStatus.ERROR
                      ? "bg-destructive"
                      : "bg-muted",
              )}
            />
          ))}
        </Div>
      </Div>

      {/* Main card */}
      <Div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
        <Div className="mb-6 flex flex-col gap-1.5">
          <H1 className="m-0 text-2xl font-semibold tracking-tight lg:text-2xl">
            {summary.hasErrors
              ? t("widget.titleIncomplete")
              : t("widget.title")}
          </H1>
          <P className="m-0 text-sm text-muted-foreground">
            {summary.hasErrors
              ? t("widget.subtitleIncomplete")
              : t("widget.subtitle")}
          </P>
        </Div>

        {/* Step checklist */}
        <Div className="flex flex-col divide-y rounded-xl border bg-background">
          {snapshot.steps.map((step) => (
            <Div key={step.id} className="flex flex-col gap-2 px-3.5 py-3">
              <Div className="flex items-start justify-between gap-3">
                <Div className="flex min-w-0 items-start gap-3">
                  <StepIcon status={step.status} />
                  <Div className="flex min-w-0 flex-col gap-0.5">
                    <Div className="flex flex-wrap items-center gap-2">
                      <Span className="text-sm font-medium">
                        {stepTitle(step.id)}
                      </Span>
                      {step.id === "github" && (
                        <Badge variant="outline" className="text-[11px]">
                          {t("widget.steps.github.optionalTag")}
                        </Badge>
                      )}
                    </Div>
                    {step.detail && (
                      <Span className="[overflow-wrap:anywhere] text-xs text-muted-foreground">
                        {step.detail}
                      </Span>
                    )}
                  </Div>
                </Div>
                <Badge
                  variant={stepBadgeVariant(step.status)}
                  className="shrink-0"
                >
                  {t(step.status)}
                </Badge>
              </Div>

              {step.recovery && (
                <Div className="ml-9">
                  <Notice tone="error">
                    <Span>{step.recovery}</Span>
                  </Notice>
                </Div>
              )}
            </Div>
          ))}
        </Div>

        {/* Optional private GitHub repository section */}
        <Div className="mt-5 flex flex-col gap-4 rounded-xl border bg-background p-4 sm:p-5">
          <Div className="flex flex-col gap-1">
            <Div className="flex flex-wrap items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <Span className="text-sm font-semibold">
                {t("widget.githubCard.title")}
              </Span>
              <Badge variant="outline">{t("widget.githubCard.badge")}</Badge>
            </Div>
            <Span className="text-xs text-muted-foreground">
              {t("widget.githubCard.body")}
            </Span>
          </Div>

          {snapshot.github.isPrivateForkConfigured ? (
            <Div className="flex flex-col gap-2">
              <Notice tone="success">
                <Span className="font-medium">
                  {t("widget.githubCard.connectedTitle")}
                </Span>
                <Link
                  href={snapshot.github.privateRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1 break-all text-xs underline"
                >
                  {snapshot.github.privateRepoUrl}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </Link>
              </Notice>
            </Div>
          ) : snapshot.github.skipped ? (
            <Div className="flex flex-col gap-3">
              <Notice tone="info">
                <Span>{t("widget.githubCard.skippedNotice")}</Span>
              </Notice>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={busy}
                onClick={(): void => {
                  void runAction(InstallerAction.GITHUB_RESET);
                }}
              >
                {t("widget.githubCard.reopenButton")}
              </Button>
            </Div>
          ) : snapshot.github.ghInstalled && snapshot.github.ghAuthenticated ? (
            <Div className="flex flex-col gap-3">
              <Span className="text-xs font-medium text-success">
                {t("widget.githubCard.signedInAs", {
                  username: snapshot.github.ghUsername || "GitHub",
                })}
              </Span>
              <Div className="flex flex-col gap-1.5">
                <Label htmlFor="installer-github-repo">
                  {t("widget.githubCard.repoNameLabel")}
                </Label>
                <Input
                  id="installer-github-repo"
                  className="h-10"
                  value={repoName}
                  placeholder={DEFAULT_REPO_NAME}
                  onChangeText={setRepoName}
                />
                <Span className="text-xs text-muted-foreground">
                  {t("widget.githubCard.repoNameHelp")}
                </Span>
              </Div>
              <Div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  disabled={busy || repoName.trim().length === 0}
                  onClick={(): void => {
                    void runAction(
                      InstallerAction.GITHUB_CREATE_PRIVATE_REPO,
                      repoName.trim(),
                    );
                  }}
                >
                  {pendingAction ===
                    InstallerAction.GITHUB_CREATE_PRIVATE_REPO && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {pendingAction === InstallerAction.GITHUB_CREATE_PRIVATE_REPO
                    ? t("widget.githubCard.creatingButton")
                    : t("widget.githubCard.createButton")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={busy}
                  onClick={(): void => {
                    void runAction(InstallerAction.GITHUB_SKIP);
                  }}
                >
                  {t("widget.githubCard.skipButton")}
                </Button>
              </Div>
            </Div>
          ) : snapshot.github.ghInstalled ? (
            <Div className="flex flex-col gap-3">
              {snapshot.github.devicePending && snapshot.github.deviceCode ? (
                <Div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-3.5">
                  <Div className="flex flex-col gap-1">
                    <Span className="text-sm font-medium">
                      {t("widget.githubCard.deviceTitle")}
                    </Span>
                    <Span className="text-xs text-muted-foreground">
                      {t("widget.githubCard.deviceBody")}
                    </Span>
                  </Div>
                  <Div className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2">
                    <Span className="font-mono text-base font-semibold tracking-widest">
                      {snapshot.github.deviceCode}
                    </Span>
                    <CopyTextButton
                      text={snapshot.github.deviceCode}
                      copyLabel={t("widget.copy")}
                      copiedLabel={t("widget.copied")}
                    />
                  </Div>
                  <Div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" asChild>
                      <Link
                        href={snapshot.github.deviceVerificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("widget.githubCard.deviceOpenLink")}
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={(): void => {
                        void runAction(InstallerAction.GITHUB_AUTH_CHECK);
                      }}
                    >
                      {pendingAction === InstallerAction.GITHUB_AUTH_CHECK && (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      )}
                      {t("widget.githubCard.deviceCheckButton")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={(): void => {
                        void runAction(InstallerAction.GITHUB_SKIP);
                      }}
                    >
                      {t("widget.githubCard.skipButton")}
                    </Button>
                  </Div>
                </Div>
              ) : (
                <Div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={(): void => {
                      void runAction(InstallerAction.GITHUB_AUTH_START);
                    }}
                  >
                    {pendingAction === InstallerAction.GITHUB_AUTH_START && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {pendingAction === InstallerAction.GITHUB_AUTH_START
                      ? t("widget.githubCard.startingSignIn")
                      : t("widget.githubCard.signInButton")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={busy}
                    onClick={(): void => {
                      void runAction(InstallerAction.GITHUB_SKIP);
                    }}
                  >
                    {t("widget.githubCard.skipButton")}
                  </Button>
                </Div>
              )}
            </Div>
          ) : (
            <Div className="flex flex-col gap-3">
              <Span className="text-xs text-muted-foreground">
                {t("widget.githubCard.manualBody")}
              </Span>
              <Div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={GITHUB_NEW_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("widget.githubCard.manualNewRepoLink")}
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={(): void => {
                    void runAction(InstallerAction.GITHUB_SKIP);
                  }}
                >
                  {t("widget.githubCard.skipButton")}
                </Button>
              </Div>
              <Collapsible>
                <CollapsibleTrigger className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                  <Terminal className="h-3.5 w-3.5" />
                  <Span className="group-data-[state=open]:hidden">
                    {t("widget.githubCard.manualShowCommands")}
                  </Span>
                  <Span className="hidden group-data-[state=open]:inline">
                    {t("widget.githubCard.manualHideCommands")}
                  </Span>
                  <ChevronDown className="h-3.5 w-3.5 group-data-[state=open]:hidden" />
                  <ChevronUp className="hidden h-3.5 w-3.5 group-data-[state=open]:block" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2.5 flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
                  <Div className="flex justify-end">
                    <CopyTextButton
                      text={manualCommandsJoined}
                      copyLabel={t("widget.copy")}
                      copiedLabel={t("widget.copied")}
                    />
                  </Div>
                  <Div className="flex flex-col gap-1 font-mono text-xs text-foreground">
                    {MANUAL_GIT_COMMANDS.map((cmd) => (
                      <Span key={cmd} className="break-all">
                        {cmd}
                      </Span>
                    ))}
                  </Div>
                </CollapsibleContent>
              </Collapsible>
            </Div>
          )}
        </Div>

        {/* Action feedback or error */}
        {(statusMessage || errorMessage || snapshot.lastError) && (
          <Div className="mt-4 flex flex-col gap-2">
            {statusMessage && <Notice tone="info">{statusMessage}</Notice>}
            {(errorMessage || snapshot.lastError) && (
              <Notice tone="error">{errorMessage || snapshot.lastError}</Notice>
            )}
          </Div>
        )}

        {/* Quiet local path footnote */}
        <Div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Folder className="h-3.5 w-3.5 shrink-0" />
          <Span className="truncate font-mono">{snapshot.installDir}</Span>
        </Div>

        {/* Footer matching /[locale]/setup */}
        <Div className="mt-7 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            className="sm:-ml-3"
            onClick={(): void => {
              void runAction(InstallerAction.REFRESH);
            }}
          >
            {pendingAction === InstallerAction.REFRESH ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-1.5 h-4 w-4" />
            )}
            {pendingAction === InstallerAction.REFRESH
              ? t("widget.rechecking")
              : t("widget.recheck")}
          </Button>
          <Button size="lg" className="w-full sm:w-fit" asChild>
            <Link href={setupHref}>
              {snapshot.setup.complete
                ? t("widget.handover.openApp")
                : t("widget.handover.continueToSetup")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Div>

        <P className="mt-3 mb-0 text-xs text-muted-foreground">
          {snapshot.setup.complete
            ? t("widget.handover.completeHint")
            : t("widget.handover.hint")}
        </P>
      </Div>
    </Div>
  );
}
