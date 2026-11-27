"use client";

/**
 * Interactive frame of a code block: language tabs, wrap toggle, copy button.
 * The highlighted panels arrive pre-rendered from the server (`CodeTabs` in
 * ./code-tabs), so Prism never runs in the browser. Inactive panels get
 * `hidden`, every snippet stays in the initial HTML.
 */

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlignLeft } from "next-vibe/ui/components/icons/AlignLeft";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Span } from "next-vibe/ui/components/span";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { getScreenWidth } from "next-vibe/ui/lib/screen";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";
import { useState } from "react";

const COPIED_RESET_MS = 2000;
/** Below this viewport width, long code starts wrapped. */
const WRAP =
  "[&_code]:!whitespace-pre-wrap [&_code]:![overflow-wrap:anywhere] [&_pre]:!whitespace-pre-wrap [&_pre]:![overflow-wrap:anywhere]";
const WRAP_ON_PHONE =
  "max-sm:[&_code]:!whitespace-pre-wrap max-sm:[&_code]:![overflow-wrap:anywhere] max-sm:[&_pre]:!whitespace-pre-wrap max-sm:[&_pre]:![overflow-wrap:anywhere]";

export interface CodeTabPanel {
  /** Tab label, e.g. "curl", "Python". */
  label: string;
  /** Raw code: copied to the clipboard, sizes the phone wrap default. */
  code: string;
  /** The highlighted block, rendered on the server. */
  panel: ReactNode;
}

export function CopyButton({
  text,
  copyLabel,
  copiedLabel,
  tone = "dark",
  compact = false,
  className,
}: {
  text: string;
  copyLabel: string;
  copiedLabel: string;
  tone?: "dark" | "light";
  /** Icon only below sm (narrow toolbars). */
  compact?: boolean;
  className?: string;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  const logger = useLogger();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={copied ? copiedLabel : copyLabel}
      className={cn(
        "h-8 shrink-0 gap-1.5 px-2.5 text-xs",
        tone === "dark"
          ? "text-slate-300 hover:bg-white/10 hover:text-white"
          : "text-muted-foreground hover:text-foreground",
        copied && (tone === "dark" ? "text-emerald-400" : "text-success"),
        compact && "px-2",
        className,
      )}
      onClick={(): void => {
        void (async (): Promise<void> => {
          const { copyToClipboard } =
            await import("next-vibe/ui/lib/clipboard");
          const ok = await copyToClipboard(text, logger);
          setCopied(ok);
          if (ok) {
            setTimeout(() => setCopied(false), COPIED_RESET_MS);
          }
        })();
      }}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <Span className={compact ? "hidden sm:inline" : undefined}>
        {copied ? copiedLabel : copyLabel}
      </Span>
    </Button>
  );
}

export function CodeTabsFrame({
  tabs,
  title,
  copyLabel,
  copiedLabel,
  wrapLabel,
  wrapByDefault,
  wrapOnPhone,
  className,
}: {
  tabs: CodeTabPanel[];
  /** Shown left of the tabs, e.g. "Request" or "Response 200". */
  title?: string;
  copyLabel: string;
  copiedLabel: string;
  /** Label of the wrap-long-lines toggle. */
  wrapLabel: string;
  /** Initial wrap state. Unset: long one-liners start wrapped on phones. */
  wrapByDefault?: boolean;
  wrapOnPhone: boolean;
  className?: string;
}): JSX.Element {
  const logger = useLogger();
  const [active, setActive] = useState(0);
  // null = follow the default: long one-liners start wrapped on phones.
  const [wrapChoice, setWrapChoice] = useState<boolean | null>(null);
  const wrap = wrapChoice ?? wrapByDefault;
  const autoWrap = wrap === undefined && wrapOnPhone;
  const current = tabs[active] ?? tabs[0];
  const showTabs = tabs.length > 1;

  return (
    <Div
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm dark:border-white/10",
        className,
      )}
    >
      <Div className="flex min-h-11 items-center justify-between gap-2 border-b border-white/10 bg-slate-900 py-1 pr-1.5 pl-3">
        <Div className="flex min-w-0 flex-1">
          {/* Tabs wrap to a second row on narrow screens: never clipped */}
          <Div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {title !== undefined && (
              <Span
                className={cn(
                  "min-w-0 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400",
                )}
              >
                {title}
              </Span>
            )}
            {showTabs && (
              <Div
                role="tablist"
                className="flex min-w-0 flex-wrap items-center gap-0.5"
              >
                {tabs.map((tab, index) => (
                  <Button
                    key={tab.label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    role="tab"
                    aria-selected={index === active}
                    className={cn(
                      "h-8 px-2.5 font-mono text-xs",
                      index === active
                        ? "bg-white/10 text-white hover:bg-white/15 hover:text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
                    )}
                    onClick={(): void => setActive(index)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Div>
            )}
            {!showTabs && title === undefined && current !== undefined && (
              <Span className="font-mono text-[11px] text-slate-400">
                {current.label}
              </Span>
            )}
          </Div>
        </Div>
        <Div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={wrap ?? false}
            title={wrapLabel}
            className={cn(
              "h-8 gap-1.5 px-2.5 text-xs",
              wrap
                ? "bg-white/10 text-white hover:bg-white/15 hover:text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white",
            )}
            onClick={(): void => {
              const wraps =
                wrap ?? (wrapOnPhone && getScreenWidth(logger) < 640);
              setWrapChoice(!wraps);
            }}
          >
            <AlignLeft className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">{wrapLabel}</Span>
          </Button>
          {current !== undefined && (
            <CopyButton
              text={current.code}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
              compact
            />
          )}
        </Div>
      </Div>
      {tabs.map((tab, index) => (
        <Div
          key={tab.label}
          role={showTabs ? "tabpanel" : undefined}
          className={cn(
            "relative min-w-0",
            index === active ? "block" : "hidden",
            "[&>div]:[scrollbar-color:rgb(71_85_105)_transparent] [&>div]:[scrollbar-width:thin]",
            wrap && WRAP,
            autoWrap && WRAP_ON_PHONE,
          )}
        >
          {!wrap && (
            <Span
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-950 to-transparent",
                autoWrap && "max-sm:hidden",
              )}
            />
          )}
          {tab.panel}
        </Div>
      ))}
    </Div>
  );
}
