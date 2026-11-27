/**
 * Terminal card used by the quickstart: dark window chrome, one row per
 * command with its own copy button, plus "copy all" in the title bar.
 * No hooks, so it renders on the server and inside client components alike.
 */

import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import type { JSX, ReactNode } from "react";

import { CopyButton } from "../../../docs/api/_components/code-tabs";

export interface TerminalRow {
  /** Short explanation shown as a shell comment above the command. */
  comment: string;
  command: string;
}

const SHELL_PROMPT = "$ ";
const POWERSHELL_PROMPT = "> ";

/**
 * Wrap points for narrow screens: a URL may break after its host
 * ("git clone https://github.com/" + "techfreaque/next-vibe"), never mid-word.
 */
function commandParts(command: string): string[] {
  const match = /^(.*?:\/\/[^/]+\/)(.+)$/.exec(command);
  return match?.[1] && match[2] ? [match[1], match[2]] : [command];
}

export function TerminalCard({
  title,
  rows,
  copyLabel,
  copiedLabel,
  copyAllLabel,
  powershell = false,
  tabs,
  copyAll = true,
}: {
  title: string;
  rows: readonly TerminalRow[];
  copyLabel: string;
  copiedLabel: string;
  copyAllLabel: string;
  /** Windows: PowerShell prompt instead of `$`. */
  powershell?: boolean;
  /** Optional tab strip rendered in the title bar (platform picker). */
  tabs?: ReactNode;
  /** Off when rows are alternatives or require a directory change between commands. */
  copyAll?: boolean;
}): JSX.Element {
  return (
    <Div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm dark:border-white/10">
      <Div className="flex min-h-11 items-center justify-between gap-2 border-b border-white/10 bg-slate-900 py-1 pr-1.5 pl-4">
        <Div className="flex min-w-0 items-center gap-2">
          <Span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-700" />
          <Span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-700" />
          <Span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-700" />
          {tabs ?? (
            <Span className="ml-2 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {title}
            </Span>
          )}
        </Div>
        {copyAll && (
          <CopyButton
            text={rows.map((row) => row.command).join("\n")}
            copyLabel={copyAllLabel}
            copiedLabel={copiedLabel}
            compact
          />
        )}
      </Div>
      <Div className="flex flex-col divide-y divide-white/5">
        {rows.map(({ comment, command }) => (
          <Div
            key={command}
            className="flex items-center gap-2 py-3 pr-1.5 pl-4"
          >
            <Div className="min-w-0 flex-1">
              <Span className="block font-mono text-xs text-slate-400">{`# ${comment}`}</Span>
              <Div className="mt-1 font-mono text-[13px] text-slate-100 sm:text-sm">
                <Span className="whitespace-pre text-emerald-400 select-none">
                  {powershell ? POWERSHELL_PROMPT : SHELL_PROMPT}
                </Span>
                {commandParts(command).map((part) => (
                  <Span
                    key={part}
                    className="inline-block max-w-full whitespace-pre-wrap"
                  >
                    {part}
                  </Span>
                ))}
              </Div>
            </Div>
            <CopyButton
              text={command}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
              className="min-h-11 min-w-11 [&>span]:hidden"
            />
          </Div>
        ))}
      </Div>
    </Div>
  );
}
