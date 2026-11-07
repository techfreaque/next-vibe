/**
 * Legal document layout (imprint, privacy policy, terms) - UI v2.
 *
 * Readable 3xl column, numbered sections, sticky table of contents on
 * desktop and a collapsible one on phones. Semantic tokens only.
 */

import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { Li } from "next-vibe/ui/components/li";
import { Link } from "next-vibe/ui/components/link";
import { Nav } from "next-vibe/ui/components/nav";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { Summary } from "next-vibe/ui/components/summary";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

import { CONTAINER, Eyebrow } from "./marketing";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

function TocLinks({
  sections,
}: {
  sections: ReadonlyArray<LegalSection>;
}): JSX.Element {
  return (
    <Ul className="flex flex-col">
      {sections.map((section, index) => (
        <Li key={section.id}>
          <Link
            href={`#${section.id}`}
            className="flex min-h-11 items-center gap-3 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:min-h-9"
          >
            <Span className="w-5 shrink-0 text-xs font-medium text-muted-foreground/70 tabular-nums">
              {index + 1}
            </Span>
            <Span className="min-w-0">{section.title}</Span>
          </Link>
        </Li>
      ))}
    </Ul>
  );
}

export function LegalDocument({
  eyebrow,
  eyebrowIcon,
  title,
  lastUpdated,
  intro,
  tocLabel,
  sections,
  actions,
}: {
  eyebrow: string;
  eyebrowIcon?: IconComponent;
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  tocLabel: string;
  sections: ReadonlyArray<LegalSection>;
  /** Header actions, e.g. a print button. */
  actions?: ReactNode;
}): JSX.Element {
  return (
    <Div className="min-h-screen bg-background">
      <Div className="border-b border-border bg-linear-to-b from-primary/[0.05] to-background">
        <Div className={cn(CONTAINER, "pt-12 pb-10 md:pt-16 md:pb-14")}>
          <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
          <H1 className="mt-5 text-4xl font-semibold tracking-tight text-balance break-words hyphens-auto md:text-5xl">
            {title}
          </H1>
          <Div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
            <P className="text-sm text-muted-foreground">{lastUpdated}</P>
            {actions}
          </Div>
        </Div>
      </Div>

      <Div
        className={cn(
          CONTAINER,
          "grid gap-10 py-10 md:py-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16",
        )}
      >
        {/* Desktop: sticky TOC */}
        <Nav className="hidden lg:block print:hidden">
          <Div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
            <P className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {tocLabel}
            </P>
            <TocLinks sections={sections} />
          </Div>
        </Nav>

        <Div className="min-w-0 max-w-3xl">
          {/* Mobile: collapsible TOC */}
          <Details className="group mb-10 rounded-xl border border-border bg-card lg:hidden print:hidden">
            <Summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              {tocLabel}
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </Summary>
            <Div className="border-t border-border px-2 py-2">
              <TocLinks sections={sections} />
            </Div>
          </Details>

          <Div className="text-[1.0625rem] leading-[1.75] text-pretty text-foreground/90 md:text-lg">
            {intro}
          </Div>

          <Div className="mt-12 flex flex-col gap-12">
            {sections.map((section, index) => (
              <Section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border-t border-border pt-10 first:border-t-0 first:pt-0"
              >
                <H2 className="flex items-baseline gap-3 border-none pb-0 text-2xl font-semibold tracking-tight text-balance">
                  <Span className="text-base font-medium text-primary tabular-nums">
                    {index + 1}.
                  </Span>
                  {section.title}
                </H2>
                <Div className="mt-4 flex flex-col gap-4">
                  {section.content}
                </Div>
              </Section>
            ))}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export function LegalP({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <P
      className={cn(
        "text-base leading-[1.75] text-pretty text-foreground/85",
        className,
      )}
    >
      {children}
    </P>
  );
}

export function LegalH3({ children }: { children: ReactNode }): JSX.Element {
  return (
    <H3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
      {children}
    </H3>
  );
}

export function LegalList({
  items,
}: {
  items: ReadonlyArray<ReactNode>;
}): JSX.Element {
  return (
    <Ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <Li
          key={index}
          className="grid grid-cols-[1.25rem_minmax(0,1fr)] text-base leading-[1.7] text-foreground/85"
        >
          <Span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-primary" />
          <Span>{item}</Span>
        </Li>
      ))}
    </Ul>
  );
}

/** Bordered block for addresses, contact details, key facts. */
export function LegalCard({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Div className="rounded-xl border border-border bg-card p-5 text-base leading-relaxed text-foreground">
      {children}
    </Div>
  );
}
