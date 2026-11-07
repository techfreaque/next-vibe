/**
 * Long-form reading layout for blog posts and markdown-backed pages (UI v2).
 *
 * A 3xl reading column, 17-18px body copy at ~1.75 line-height, a clear
 * H2/H3 hierarchy, code blocks that scroll inside their own box, and an
 * end-of-article CTA. Semantic tokens only - identical in light and dark.
 */

import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { Calendar } from "next-vibe/ui/components/icons/Calendar";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Li } from "next-vibe/ui/components/li";
import { Link } from "next-vibe/ui/components/link";
import { CodeSnippet } from "next-vibe/ui/components/markdown";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

import { CtaRow } from "./marketing";

/** Reading column: 16px gutters on phones, 3xl measure on desktop. */
export const READING_COLUMN = "mx-auto w-full max-w-3xl px-4 sm:px-6";

// ─── Header ─────────────────────────────────────────────────────────────────

export interface ArticleHeaderProps {
  back: { href: string; label: string };
  category?: ReactNode;
  readTime?: ReactNode;
  /** Pre-formatted publication date. */
  date?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
}

export function ArticleHeader({
  back,
  category,
  readTime,
  date,
  title,
  subtitle,
}: ArticleHeaderProps): JSX.Element {
  return (
    <Div className="border-b border-border bg-linear-to-b from-primary/[0.05] to-background">
      <Div className={cn(READING_COLUMN, "pt-8 pb-12 md:pt-14 md:pb-16")}>
        <Link
          href={back.href}
          className="-ml-1 mb-8 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          {back.label}
        </Link>
        <ArticleMeta category={category} readTime={readTime} date={date} />
        <H1 className="mt-5 text-4xl font-semibold tracking-tight text-balance break-words hyphens-auto text-foreground md:text-5xl md:leading-[1.1]">
          {title}
        </H1>
        {subtitle !== undefined && (
          <P className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
            {subtitle}
          </P>
        )}
      </Div>
    </Div>
  );
}

export function ArticleMeta({
  category,
  readTime,
  date,
}: {
  category?: ReactNode;
  readTime?: ReactNode;
  date?: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      {category !== undefined && (
        <Span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {category}
        </Span>
      )}
      {date !== undefined && (
        <Span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {date}
        </Span>
      )}
      {readTime !== undefined && (
        <Span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {readTime}
        </Span>
      )}
    </Div>
  );
}

// ─── Body ───────────────────────────────────────────────────────────────────

export function ArticleBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        READING_COLUMN,
        "flex flex-col gap-14 py-12 md:gap-16 md:py-16",
        className,
      )}
    >
      {children}
    </Div>
  );
}

export function ArticleSection({
  id,
  label,
  title,
  intro,
  children,
}: {
  id?: string;
  label?: ReactNode;
  title?: ReactNode;
  /** Muted standfirst under the heading. */
  intro?: ReactNode;
  children?: ReactNode;
}): JSX.Element {
  return (
    <Section id={id} className="scroll-mt-20">
      {label !== undefined && (
        <Span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {label}
        </Span>
      )}
      {title !== undefined && <ArticleH2>{title}</ArticleH2>}
      {intro !== undefined && (
        <P className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
          {intro}
        </P>
      )}
      {children !== undefined && (
        <Div className="mt-6 flex flex-col gap-5">{children}</Div>
      )}
    </Section>
  );
}

export function ArticleH2({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}): JSX.Element {
  return (
    <H2
      id={id}
      className="scroll-mt-20 border-none pb-0 text-2xl font-semibold tracking-tight text-balance md:text-3xl"
    >
      {children}
    </H2>
  );
}

export function ArticleH3({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <H3
      className={cn(
        "mt-3 text-lg font-semibold tracking-tight md:text-xl",
        className,
      )}
    >
      {children}
    </H3>
  );
}

export function ArticleP({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <P
      className={cn(
        "text-[1.0625rem] leading-[1.75] text-pretty text-foreground/90 md:text-lg",
        className,
      )}
    >
      {children}
    </P>
  );
}

/** Opening paragraph - slightly larger, sets the hook. */
export function ArticleLead({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <P className="text-lg leading-[1.7] text-pretty text-foreground md:text-xl">
      {children}
    </P>
  );
}

export function ArticleList({
  items,
  ordered = false,
}: {
  items: ReadonlyArray<ReactNode>;
  ordered?: boolean;
}): JSX.Element {
  return (
    <Ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <Li
          key={index}
          className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 text-[1.0625rem] leading-[1.7] text-foreground/90 md:text-lg"
        >
          {ordered ? (
            <Span className="pt-px text-sm font-semibold text-primary tabular-nums">
              {index + 1}.
            </Span>
          ) : (
            <Span className="mt-[0.7em] ml-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          )}
          <Span>{item}</Span>
        </Li>
      ))}
    </Ul>
  );
}

export function ArticleQuote({
  children,
  cite,
}: {
  children: ReactNode;
  cite?: ReactNode;
}): JSX.Element {
  return (
    <Div className="border-l-2 border-primary pl-5 md:pl-6">
      <P className="text-lg leading-relaxed font-medium text-pretty text-foreground md:text-xl">
        {children}
      </P>
      {cite !== undefined && (
        <Span className="mt-2 block text-sm text-muted-foreground">{cite}</Span>
      )}
    </Div>
  );
}

/** Syntax-highlighted code; scrolls horizontally inside its own box. */
export function ArticleCode({
  code,
  language,
  filename,
}: {
  code: string;
  language: string;
  filename?: string;
}): JSX.Element {
  return (
    <Div className="min-w-0 max-w-full">
      <CodeSnippet
        code={code}
        language={language}
        filename={filename ?? language}
        variant="file"
      />
    </Div>
  );
}

/** Inline monospace token inside prose. */
export function InlineCode({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Span className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
      {children}
    </Span>
  );
}

/** Wide content (tables, comparison grids) that must scroll on phones. */
export function ArticleScroll({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">{children}</Div>
  );
}

export function ArticleDivider(): JSX.Element {
  return <Div className="h-px w-full bg-border" />;
}

// ─── End of article ─────────────────────────────────────────────────────────

export function ArticleEnd({
  title,
  subtitle,
  actions,
  back,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back: { href: string; label: string };
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-8 border-t border-border pt-12">
      <Div className="rounded-2xl border border-primary/20 bg-linear-to-b from-primary/[0.07] to-card p-6 md:p-10">
        <H2 className="border-none pb-0 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          {title}
        </H2>
        {subtitle !== undefined && (
          <P className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </P>
        )}
        {actions !== undefined && <CtaRow className="mt-6">{actions}</CtaRow>}
      </Div>
      <Link
        href={back.href}
        className="-ml-1 inline-flex min-h-11 w-fit items-center gap-2 rounded-md px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {back.label}
      </Link>
    </Div>
  );
}
