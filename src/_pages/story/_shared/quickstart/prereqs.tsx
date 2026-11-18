"use client";

/**
 * Prerequisites per platform: git + Bun, with the official install commands
 * (bun.sh/docs/installation). Every platform panel is server-rendered; the
 * inactive ones get `hidden`, so crawlers and no-JS readers see all of them.
 * After hydration the tab follows the visitor's OS.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { getUserAgent } from "next-vibe/ui/lib/media";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import { useState, useSyncExternalStore } from "react";

import { scopedTranslation } from "./i18n";
import { TerminalCard, type TerminalRow } from "./terminal";

type PlatformKey = "macos" | "linux" | "windows";

const PLATFORMS: ReadonlyArray<{ key: PlatformKey; label: string }> = [
  { key: "macos", label: "macOS" },
  { key: "linux", label: "Linux" },
  { key: "windows", label: "Windows" },
];

const BUN_UNIX = "curl -fsSL https://bun.sh/install | bash";
const BUN_WINDOWS = 'powershell -c "irm bun.sh/install.ps1 | iex"';
const BUN_CHECK = "bun --version";

function detectPlatform(userAgent: string): PlatformKey {
  if (/Windows/i.test(userAgent)) {
    return "windows";
  }
  if (
    /Mac OS X|Macintosh/i.test(userAgent) &&
    !/iPhone|iPad/i.test(userAgent)
  ) {
    return "macos";
  }
  if (/Linux|X11/i.test(userAgent) && !/Android/i.test(userAgent)) {
    return "linux";
  }
  return "macos";
}

function subscribeNever(): () => void {
  return () => undefined;
}

export function Prereqs({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  // Server and hydration render macOS; the client snapshot then follows the
  // visitor's OS until they pick a tab themselves.
  const detected = useSyncExternalStore(
    subscribeNever,
    () => detectPlatform(getUserAgent()),
    () => null,
  );
  const [chosen, setActive] = useState<PlatformKey | null>(null);
  const active: PlatformKey = chosen ?? detected ?? "macos";

  const rows: Record<PlatformKey, TerminalRow[]> = {
    macos: [
      { comment: t("prereqs.gitXcode"), command: "xcode-select --install" },
      { comment: t("prereqs.gitBrew"), command: "brew install git" },
      { comment: t("prereqs.bun"), command: BUN_UNIX },
      { comment: t("prereqs.check"), command: BUN_CHECK },
    ],
    linux: [
      {
        comment: t("prereqs.gitApt"),
        command: "sudo apt install -y git unzip curl",
      },
      {
        comment: t("prereqs.gitDnf"),
        command: "sudo dnf install -y git unzip curl",
      },
      {
        comment: t("prereqs.gitPacman"),
        command: "sudo pacman -S --needed git unzip curl",
      },
      { comment: t("prereqs.bun"), command: BUN_UNIX },
      { comment: t("prereqs.check"), command: BUN_CHECK },
    ],
    windows: [
      {
        comment: t("prereqs.gitWinget"),
        command: "winget install --id Git.Git -e",
      },
      { comment: t("prereqs.bunWindows"), command: BUN_WINDOWS },
      { comment: t("prereqs.check"), command: BUN_CHECK },
    ],
  };

  const tabs = (
    <Div
      role="tablist"
      aria-label={t("prereqs.platformLabel")}
      className="ml-2 flex items-center gap-0.5"
    >
      {PLATFORMS.map(({ key, label }) => (
        <Button
          key={key}
          type="button"
          variant="ghost"
          size="sm"
          role="tab"
          aria-selected={active === key}
          className={cn(
            "h-8 px-2.5 font-mono text-xs",
            active === key
              ? "bg-white/10 text-white hover:bg-white/15 hover:text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
          )}
          onClick={(): void => setActive(key)}
        >
          {label}
        </Button>
      ))}
    </Div>
  );

  return (
    <Div>
      {PLATFORMS.map(({ key }) => (
        <Div
          key={key}
          role="tabpanel"
          className={active === key ? "block" : "hidden"}
        >
          <TerminalCard
            title={t("prereqs.title")}
            rows={rows[key]}
            powershell={key === "windows"}
            tabs={tabs}
            copyAll={false}
            copyLabel={t("terminal.copy")}
            copiedLabel={t("terminal.copied")}
            copyAllLabel={t("terminal.copyAll")}
          />
        </Div>
      ))}
    </Div>
  );
}
