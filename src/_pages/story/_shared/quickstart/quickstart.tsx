/**
 * The one quickstart used by the self-host and developer pages.
 *
 * 1. Prerequisites per platform (git + Bun), 2. four commands, 3. everything
 * else in the browser. Verified on a fresh clone without Docker: PGlite is
 * the default database, `bun i` puts `vibe` on PATH, the ADMIN quick login
 * opens the setup wizard (admin login, security keys, AI provider:
 * unbottled.ai sign-in, provider key or Claude Code).
 * Server-rendered; only the copy buttons and platform tabs hydrate.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Cpu } from "next-vibe/ui/components/icons/Cpu";
import { Database } from "next-vibe/ui/components/icons/Database";
import { GitBranch } from "next-vibe/ui/components/icons/GitBranch";
import { Laptop } from "next-vibe/ui/components/icons/Laptop";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import type { JSX, ReactNode } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";

import { scopedTranslation } from "./i18n";
import { Prereqs } from "./prereqs";
import { TerminalCard } from "./terminal";

const REPO_DIR = GITHUB_REPO_URL.split("/").pop() ?? "next-vibe";

export const QUICKSTART_COMMANDS = [
  { key: "clone", command: `git clone ${GITHUB_REPO_URL}` },
  { key: "cd", command: `cd ${REPO_DIR}` },
  { key: "install", command: "bun i" },
  { key: "dev", command: "vibe dev" },
] as const;

const REQUIREMENTS: ReadonlyArray<{
  key: "os" | "git" | "bun";
  icon: IconComponent;
}> = [
  { key: "os", icon: Laptop },
  { key: "git", icon: GitBranch },
  { key: "bun", icon: Cpu },
];

const BROWSER_STEPS = ["open", "admin", "account", "provider"] as const;

function StepHeading({
  number,
  eyebrow,
  title,
}: {
  number: number;
  eyebrow: string;
  title: string;
}): JSX.Element {
  return (
    <Div className="mb-3 flex items-center gap-3">
      <Span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
        {number}
      </Span>
      <Div className="min-w-0">
        <Span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {eyebrow}
        </Span>
        <H3 className="text-lg font-semibold leading-tight tracking-tight">
          {title}
        </H3>
      </Div>
    </Div>
  );
}

function Note({ children }: { children: ReactNode }): JSX.Element {
  return (
    <P className="mt-3 text-sm leading-relaxed text-muted-foreground">
      {children}
    </P>
  );
}

export function Quickstart({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-6 md:gap-8">
      <Div className="flex flex-wrap items-center gap-2">
        <Span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {t("requirements.label")}
        </Span>
        {REQUIREMENTS.map(({ key, icon: Icon }) => (
          <Span
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground shadow-xs"
          >
            <Icon className="h-3.5 w-3.5 text-primary" />
            {t(`requirements.${key}`)}
          </Span>
        ))}
      </Div>

      <Div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Div className="flex min-w-0 flex-col gap-8">
          <Div className="min-w-0">
            <StepHeading
              number={1}
              eyebrow={t("prereqs.step")}
              title={t("prereqs.title")}
            />
            <Prereqs locale={locale} />
            <Note>{t("prereqs.newTerminal")}</Note>
          </Div>

          <Div className="min-w-0">
            <StepHeading
              number={2}
              eyebrow={t("terminal.step")}
              title={t("terminal.title")}
            />
            <TerminalCard
              title={t("terminal.title")}
              rows={QUICKSTART_COMMANDS.map(({ key, command }) => ({
                comment: t(`terminal.${key}`),
                command,
              }))}
              copyLabel={t("terminal.copy")}
              copiedLabel={t("terminal.copied")}
              copyAllLabel={t("terminal.copyAll")}
            />
            <Note>{t("terminal.fallback")}</Note>
            <Div className="mt-4 flex gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <Database className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <P className="text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                {t("terminal.postgres")}
              </P>
            </Div>
          </Div>
        </Div>

        <Div className="min-w-0 lg:sticky lg:top-24">
          <StepHeading
            number={3}
            eyebrow={t("browser.step")}
            title={t("browser.title")}
          />
          <Div className="rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
            <Div className="flex flex-col gap-5">
              {BROWSER_STEPS.map((key, index) => (
                <Div
                  key={key}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3"
                >
                  <Span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                    {`3.${index + 1}`}
                  </Span>
                  <Div className="min-w-0">
                    <P className="font-semibold leading-snug text-foreground">
                      {t(`browser.${key}.title`)}
                    </P>
                    <P className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {t(`browser.${key}.body`)}
                    </P>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
