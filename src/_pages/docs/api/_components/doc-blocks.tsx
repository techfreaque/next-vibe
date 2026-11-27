/**
 * Server-rendered building blocks of the API docs page: sections, endpoint
 * titles, prose, lists, tables and collapsible example responses.
 */

import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Hash } from "next-vibe/ui/components/icons/Hash";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { Summary } from "next-vibe/ui/components/summary";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

import { type CodeTab, CodeTabs, CopyButton } from "./code-tabs";

export type HttpMethod = "GET" | "POST";

/** Inline code up to this length never wraps. */
const SHORT_CODE_CHARS = 24;

/** Monospace chip for identifiers inside prose. */
export function InlineCode({ children }: { children: string }): JSX.Element {
  return (
    <Span
      className={cn(
        "rounded bg-muted px-1 py-0.5 font-mono text-[0.875em] text-foreground",
        // Short identifiers never split (no "--" / "profile" orphans);
        // long paths and keys may wrap anywhere instead of overflowing.
        children.length <= SHORT_CODE_CHARS
          ? "whitespace-nowrap"
          : "[overflow-wrap:anywhere]",
      )}
    >
      {children}
    </Span>
  );
}

const AUTO_CODE_PATTERN =
  /(~\/[\w./-]*[\w/]|--[a-z][\w-]*|\b[\w-]+\.(?:json|toml|yaml|yml)\b|\bopenai\/)/g;

/**
 * Marks paths, flags and config file names in a string we do not own the
 * copy of (shared coding-tool hints), so renderRich shows them as code.
 */
export function autoCode(text: string): string {
  return text
    .split("`")
    .map((part, index) =>
      index % 2 === 1 ? part : part.replace(AUTO_CODE_PATTERN, "`$1`"),
    )
    .join("`");
}

/** Turns `backtick` spans of a translated string into InlineCode. */
export function renderRich(text: string): ReactNode[] {
  return text
    .split("`")
    .map((part, index) =>
      index % 2 === 1 ? (
        <InlineCode key={`c${index}-${part}`}>{part}</InlineCode>
      ) : (
        part
      ),
    );
}

export function MethodBadge({ method }: { method: HttpMethod }): JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-md px-2 font-mono text-[11px] font-bold tracking-wide",
        method === "GET"
          ? "bg-info/15 text-info"
          : "bg-success/15 text-success",
      )}
    >
      {method}
    </Span>
  );
}

/** One endpoint line: method badge + monospace path. */
export function Endpoint({
  method,
  path,
}: {
  method: HttpMethod;
  path: string;
}): JSX.Element {
  return (
    <Div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
      <MethodBadge method={method} />
      <Span className="min-w-0 font-mono text-sm text-foreground [overflow-wrap:anywhere]">
        {path}
      </Span>
    </Div>
  );
}

export function DocSection({
  id,
  group,
  title,
  intro,
  endpoints,
  children,
}: {
  id: string;
  /** Small label above the title; only the first section of a TOC group. */
  group?: string;
  title: string;
  intro?: string;
  endpoints?: Array<{ method: HttpMethod; path: string }>;
  children?: ReactNode;
}): JSX.Element {
  return (
    <Section
      id={id}
      className="scroll-mt-36 border-b border-border py-10 first:pt-2 last:border-b-0 lg:scroll-mt-24 md:py-14 [content-visibility:auto] [contain-intrinsic-size:auto_50rem]"
    >
      {group !== undefined && (
        <Span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {group}
        </Span>
      )}
      <H2 className="group m-0 flex items-center gap-2 border-0 p-0 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
        <ExternalLink
          href={`#${id}`}
          className="text-muted-foreground/0 transition-colors group-hover:text-muted-foreground focus-visible:text-muted-foreground"
          title={title}
        >
          <Hash className="h-5 w-5" />
        </ExternalLink>
      </H2>
      {endpoints !== undefined && endpoints.length > 0 && (
        <Div className="mt-4 flex flex-wrap gap-2">
          {endpoints.map((endpoint) => (
            <Endpoint
              key={`${endpoint.method} ${endpoint.path}`}
              method={endpoint.method}
              path={endpoint.path}
            />
          ))}
        </Div>
      )}
      {intro !== undefined && (
        <P className="mt-4 mb-0 max-w-[70ch] text-base leading-relaxed text-muted-foreground">
          {renderRich(intro)}
        </P>
      )}
      <Div className="mt-8 flex min-w-0 flex-col gap-8">{children}</Div>
    </Section>
  );
}

/** Titled sub-block inside a section. */
export function SubBlock({
  id,
  title,
  body,
  children,
}: {
  id?: string;
  title: string;
  body?: string;
  children?: ReactNode;
}): JSX.Element {
  return (
    <Div
      id={id}
      className="flex min-w-0 scroll-mt-36 flex-col gap-3 lg:scroll-mt-24"
    >
      <H3 className="m-0 text-lg font-semibold tracking-tight text-foreground">
        {title}
      </H3>
      {body !== undefined && <Prose>{body}</Prose>}
      {children}
    </Div>
  );
}

export function Prose({ children }: { children: string }): JSX.Element {
  return (
    <P className="m-0 max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground">
      {renderRich(children)}
    </P>
  );
}

export function Bullets({ items }: { items: string[] }): JSX.Element {
  return (
    <Div className="flex max-w-[70ch] flex-col gap-2.5">
      {items.map((item) => (
        <Div key={item} className="flex gap-3">
          <Span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
          <P className="m-0 text-[15px] leading-relaxed text-foreground/85">
            {renderRich(item)}
          </P>
        </Div>
      ))}
    </Div>
  );
}

/** Two-column reference table (field or code, description). */
export function DocTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: Array<{
    key: string;
    term: string;
    /** HTTP status shown as a colored badge before the term. */
    status?: number;
    /** Value type, shown under the term (e.g. string, integer). */
    type?: string;
    text: string;
  }>;
}): JSX.Element {
  return (
    <Div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
      <Div className="hidden grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-6 border-b border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
        <Span>{head[0]}</Span>
        <Span>{head[1]}</Span>
      </Div>
      <Div className="divide-y divide-border">
        {rows.map((row) => (
          <Div
            key={row.key}
            className="grid gap-1.5 px-4 py-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6"
          >
            <Div className="flex min-w-0 flex-wrap items-center gap-2 text-[13px]">
              {row.status !== undefined && (
                <Span
                  className={cn(
                    "inline-flex h-6 items-center rounded-md px-2 font-mono text-[11px] font-bold",
                    row.status >= 500
                      ? "bg-destructive/15 text-destructive"
                      : "bg-warning/15 text-warning",
                  )}
                >
                  {row.status}
                </Span>
              )}
              <Span className="rounded bg-muted px-1 py-0.5 font-mono text-[13px] font-semibold text-foreground [overflow-wrap:anywhere]">
                {row.term}
              </Span>
              {row.type !== undefined && (
                <Span className="text-xs text-muted-foreground">
                  {row.type}
                </Span>
              )}
            </Div>
            <Span className="min-w-0 text-sm leading-relaxed text-muted-foreground">
              {renderRich(row.text)}
            </Span>
          </Div>
        ))}
      </Div>
    </Div>
  );
}

/** Example response, collapsed by default but always in the HTML. */
export function ResponseExample({
  summary,
  title,
  tabs,
  copyLabel,
  copiedLabel,
  wrapLabel,
  open = false,
}: {
  summary: string;
  title: string;
  tabs: CodeTab[];
  copyLabel: string;
  copiedLabel: string;
  wrapLabel: string;
  open?: boolean;
}): JSX.Element {
  return (
    <Details
      open={open}
      className="group/resp min-w-0 rounded-xl border border-border bg-card [&[open]>summary_svg]:rotate-90"
    >
      <Summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground select-none [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform" />
        {summary}
      </Summary>
      <Div className="border-t border-border p-2 sm:p-3">
        <CodeTabs
          tabs={tabs}
          title={title}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          wrapLabel={wrapLabel}
        />
      </Div>
    </Details>
  );
}

/** Numbered quickstart step with a vertical rail. */
export function QuickStep({
  n,
  title,
  description,
  last = false,
  children,
}: {
  n: number;
  title: string;
  description: string;
  last?: boolean;
  children: JSX.Element;
}): JSX.Element {
  return (
    <Div className="relative flex gap-4 sm:gap-5">
      <Div className="flex flex-col items-center">
        <Span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
          {n}
        </Span>
        {!last && <Span className="mt-2 w-px flex-1 bg-border" />}
      </Div>
      <Div
        className={`flex min-w-0 flex-1 flex-col gap-3 ${last ? "" : "pb-10"}`}
      >
        <Div className="flex flex-col gap-1 pt-1">
          <Span className="text-base font-semibold text-foreground">
            {title}
          </Span>
          <P className="m-0 text-[15px] leading-relaxed text-muted-foreground">
            {renderRich(description)}
          </P>
        </Div>
        {children}
      </Div>
    </Div>
  );
}

/** Label + monospace value + copy action, for base URLs. */
export function UrlRow({
  label,
  value,
  note,
  copyLabel,
  copiedLabel,
  small = false,
}: {
  label: string;
  value: string;
  note?: string;
  copyLabel: string;
  copiedLabel: string;
  wrapLabel?: string;
  /** Smaller type, for the narrow hero card. */
  small?: boolean;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-1.5">
      <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Span>
      <Div className="relative min-w-0 rounded-lg border border-border bg-card py-1 pl-3">
        <Span
          className={`block min-w-0 py-1.5 pr-12 font-mono text-foreground sm:pr-24 ${small ? "text-[12px]" : "text-[13px]"}`}
        >
          {/* Each "segment/" is an inline-block: lines break only between
              path segments, and copied text has no invisible characters */}
          {value.split(/(?<=\/)/).map((segment, index) => (
            <Span
              key={`${index}-${segment}`}
              className="inline-block whitespace-nowrap"
            >
              {segment}
            </Span>
          ))}
        </Span>
        <CopyButton
          text={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          tone="light"
          compact
          className="absolute top-1 right-1"
        />
      </Div>
      {note !== undefined && (
        <P className="m-0 text-xs leading-relaxed text-muted-foreground">
          {renderRich(note)}
        </P>
      )}
    </Div>
  );
}
