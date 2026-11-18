/**
 * Marketing building blocks for the public story subpages (UI v2).
 *
 * One visual language for every subpage: hero → sections → closing CTA band.
 * Semantic tokens only (bg-card, text-muted-foreground, primary, border-border),
 * so every block reads the same in light and dark. No entrance animations -
 * everything is visible on first paint, with or without JS.
 */

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

/** Shared page container: 16px gutters on phones, max-w-6xl on desktop. */
export const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

// ─── Eyebrow ────────────────────────────────────────────────────────────────

export function Eyebrow({
  children,
  icon: Icon,
  className,
}: {
  children: ReactNode;
  icon?: IconComponent;
  className?: string;
}): JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs",
        className,
      )}
    >
      {Icon !== undefined && <Icon className="h-3.5 w-3.5 text-primary" />}
      {children}
    </Span>
  );
}

/** Small uppercase label above a section heading. */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <Span
      className={cn(
        "mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-primary",
        className,
      )}
    >
      {children}
    </Span>
  );
}

// ─── CTA buttons ────────────────────────────────────────────────────────────

export interface CtaProps {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  icon?: IconComponent;
  /** Show a trailing arrow (default for primary). */
  arrow?: boolean;
  /** Open in a new tab - for GitHub, docs and other off-site links. */
  external?: boolean;
  className?: string;
}

/** Full-width on phones (big touch target), auto width from sm up. */
export function Cta({
  href,
  label,
  variant = "primary",
  icon: Icon,
  arrow,
  external = false,
  className,
}: CtaProps): JSX.Element {
  const showArrow = arrow ?? variant === "primary";
  const content = (
    <>
      {Icon !== undefined && <Icon className="h-4 w-4" />}
      {label}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </>
  );
  const isOffsite =
    external || href.startsWith("http") || href.startsWith("mailto:");
  return (
    <Button
      asChild
      size="lg"
      variant={variant === "primary" ? "default" : "outline"}
      className={cn(
        "h-12 w-full gap-2 px-6 text-base font-medium sm:w-auto",
        variant === "secondary" && "bg-card",
        className,
      )}
    >
      {isOffsite ? (
        <ExternalLink
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {content}
        </ExternalLink>
      ) : (
        <Link href={href}>{content}</Link>
      )}
    </Button>
  );
}

export function CtaRow({
  children,
  centered = false,
  className,
}: {
  children: ReactNode;
  centered?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
        centered && "sm:justify-center",
        className,
      )}
    >
      {children}
    </Div>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

export interface PageHeroProps {
  eyebrow?: ReactNode;
  eyebrowIcon?: IconComponent;
  title: ReactNode;
  subtitle?: ReactNode;
  /** CTAs - pass <Cta/> elements. */
  actions?: ReactNode;
  centered?: boolean;
  back?: { href: string; label: string };
  /** Extra content under the CTAs (stats, meta row). */
  children?: ReactNode;
}

export function PageHero({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  actions,
  centered = false,
  back,
  children,
}: PageHeroProps): JSX.Element {
  return (
    <Div className="relative overflow-hidden border-b border-border bg-linear-to-b from-primary/[0.06] via-background to-background">
      <Div
        className={cn(
          CONTAINER,
          "relative pt-12 pb-14 md:pt-20 md:pb-24",
          centered && "text-center",
        )}
      >
        {back !== undefined && (
          <Link
            href={back.href}
            className="mb-8 -ml-1 inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {back.label}
          </Link>
        )}
        <Div className={cn("max-w-3xl", centered && "mx-auto")}>
          {eyebrow !== undefined && (
            <Div className="mb-5">
              <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
            </Div>
          )}
          <H1 className="text-4xl font-semibold tracking-tight text-balance text-foreground md:text-6xl md:leading-[1.05]">
            {title}
          </H1>
          {subtitle !== undefined && (
            <P
              className={cn(
                "mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl",
                centered && "mx-auto",
              )}
            >
              {subtitle}
            </P>
          )}
          {actions !== undefined && (
            <CtaRow centered={centered} className="mt-8">
              {actions}
            </CtaRow>
          )}
        </Div>
        {children}
      </Div>
    </Div>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────

export interface PageSectionProps {
  id?: string;
  label?: ReactNode;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  /** "muted" gives the section a tinted band to separate it from neighbours. */
  tone?: "default" | "muted";
  centeredHeader?: boolean;
  /** Narrow content column for reading-heavy sections. */
  narrow?: boolean;
  className?: string;
}

export function PageSection({
  id,
  label,
  title,
  intro,
  children,
  tone = "default",
  centeredHeader = false,
  narrow = false,
  className,
}: PageSectionProps): JSX.Element {
  const hasHeader =
    label !== undefined || title !== undefined || intro !== undefined;
  return (
    <Section
      id={id}
      className={cn(
        "scroll-mt-20 py-16 md:py-24",
        tone === "muted" && "border-y border-border bg-muted/50",
        className,
      )}
    >
      <Div className={cn(CONTAINER, narrow && "max-w-3xl")}>
        {hasHeader && (
          <Div
            className={cn(
              "mb-10 max-w-2xl md:mb-12",
              centeredHeader && "mx-auto text-center",
            )}
          >
            {label !== undefined && <SectionLabel>{label}</SectionLabel>}
            {title !== undefined && (
              <H2 className="border-none pb-0 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                {title}
              </H2>
            )}
            {intro !== undefined && (
              <P className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
                {intro}
              </P>
            )}
          </Div>
        )}
        {children}
      </Div>
    </Section>
  );
}

// ─── Cards ──────────────────────────────────────────────────────────────────

export function FeatureGrid({
  children,
  columns = 3,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "grid grid-cols-1 gap-4 md:gap-6",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </Div>
  );
}

export interface FeatureCardProps {
  icon?: IconComponent;
  /** Small label above the title (category, step, badge text). */
  label?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  label,
  title,
  children,
  footer,
  className,
}: FeatureCardProps): JSX.Element {
  return (
    <Div
      className={cn(
        "flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs",
        className,
      )}
    >
      {Icon !== undefined && (
        <Div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </Div>
      )}
      {label !== undefined && (
        <Span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </Span>
      )}
      <H3 className="text-lg font-semibold leading-snug tracking-tight">
        {title}
      </H3>
      {children !== undefined && (
        <Div className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {children}
        </Div>
      )}
      {footer !== undefined && <Div className="mt-auto pt-5">{footer}</Div>}
    </Div>
  );
}

/** Text link styled as an action, ≥44px tall for touch. */
export function CardLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}): JSX.Element {
  const className =
    "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4";
  const content = (
    <>
      {label}
      <ArrowRight className="h-4 w-4" />
    </>
  );
  return external || href.startsWith("http") ? (
    <ExternalLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </ExternalLink>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

// ─── Stats ──────────────────────────────────────────────────────────────────

export function StatGrid({
  items,
  className,
}: {
  items: ReadonlyArray<{ value: ReactNode; label: ReactNode }>;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:mt-16 md:grid-cols-4",
        className,
      )}
    >
      {items.map((item, index) => (
        <Div key={index} className="bg-card px-5 py-5 md:px-6">
          <Div className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {item.value}
          </Div>
          <Div className="mt-1 text-sm text-muted-foreground">{item.label}</Div>
        </Div>
      ))}
    </Div>
  );
}

// ─── Steps ──────────────────────────────────────────────────────────────────

export function StepList({ children }: { children: ReactNode }): JSX.Element {
  return <Div className="flex flex-col gap-10">{children}</Div>;
}

export function Step({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}): JSX.Element {
  return (
    <Div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4">
      <Span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
        {number}
      </Span>
      <Div className="min-w-0 pt-1">
        <H3 className="text-lg font-semibold tracking-tight">{title}</H3>
        {description !== undefined && (
          <P className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </P>
        )}
        {children !== undefined && (
          <Div className="mt-4 min-w-0">{children}</Div>
        )}
      </Div>
    </Div>
  );
}

// ─── Callout ────────────────────────────────────────────────────────────────

export function Callout({
  children,
  icon: Icon,
  tone = "primary",
  className,
}: {
  children: ReactNode;
  icon?: IconComponent;
  tone?: "primary" | "neutral" | "warning" | "success";
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm leading-relaxed md:p-5 md:text-base",
        tone === "primary" && "border-primary/25 bg-primary/5 text-foreground",
        tone === "neutral" && "border-border bg-muted/60 text-foreground",
        tone === "warning" && "border-warning/30 bg-warning/10 text-foreground",
        tone === "success" && "border-success/30 bg-success/10 text-foreground",
        className,
      )}
    >
      {Icon !== undefined && (
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            tone === "primary" && "text-primary",
            tone === "neutral" && "text-muted-foreground",
            tone === "warning" && "text-warning",
            tone === "success" && "text-success",
          )}
        />
      )}
      <Div className="min-w-0 [overflow-wrap:anywhere]">{children}</Div>
    </Div>
  );
}

// ─── Closing CTA band ───────────────────────────────────────────────────────

export function CtaBand({
  title,
  subtitle,
  actions,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}): JSX.Element {
  return (
    <Section className="py-16 md:py-24">
      <Div className={CONTAINER}>
        <Div className="rounded-2xl border border-primary/20 bg-linear-to-b from-primary/[0.07] to-card px-6 py-12 text-center md:px-12 md:py-16">
          <H2 className="mx-auto max-w-2xl border-none pb-0 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {title}
          </H2>
          {subtitle !== undefined && (
            <P className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
              {subtitle}
            </P>
          )}
          {actions !== undefined && (
            <CtaRow centered className="mt-8">
              {actions}
            </CtaRow>
          )}
          {children}
        </Div>
      </Div>
    </Section>
  );
}
