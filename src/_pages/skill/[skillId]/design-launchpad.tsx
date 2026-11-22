"use client";

/**
 * Skill landing page ("Launchpad"): one screen, two halves. Left, who the
 * skill is in its own words. Right, a sticky start card: version switch
 * (server-rendered per URL), model, per-message price, start button,
 * content tier and what to expect. On phones the order is identity, start
 * button with the price, the card, then the backstory and first messages;
 * a compact start bar appears once the button has scrolled away.
 */

import type { DivRefObject } from "next-vibe/ui/components/div";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  type JSX,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { CONTAINER, Cta, Eyebrow } from "../../story/_shared/marketing";
import {
  Attribution,
  Description,
  ExpectList,
  type LandingView,
  ModelTier,
  priceBasis,
  priceLabel,
  PriceText,
  RelatedSections,
  SkillAvatar,
  tierHint,
} from "./landing-parts";

/** True while the observed element is off screen (after hydration). */
function useOffscreen(): {
  ref: RefObject<DivRefObject | null>;
  offscreen: boolean;
} {
  const ref = useRef<DivRefObject | null>(null);
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!(node instanceof Element)) {
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      setOffscreen(entries.every((entry) => !entry.isIntersecting));
    });
    observer.observe(node);
    return (): void => observer.disconnect();
  }, []);
  return { ref, offscreen };
}

function Row({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string | null;
  className?: string;
}): JSX.Element {
  return (
    <Div className={cn("py-3", className)}>
      <Div className="flex items-start justify-between gap-4">
        <Span className="shrink-0 text-muted-foreground">{label}</Span>
        <Span className="min-w-0 text-right font-medium text-foreground">
          {children}
        </Span>
      </Div>
      {hint && (
        <P className="mb-0 mt-1.5 text-sm leading-snug text-muted-foreground">
          {hint}
        </P>
      )}
    </Div>
  );
}

export function LaunchpadDesign({
  view,
  topBar,
  extras,
}: {
  view: LandingView;
  topBar: ReactNode;
  extras: ReactNode;
}): JSX.Element {
  const { t, name, active, variants, locale, isGuest } = view;
  const price = active?.chatMessagePrice ?? null;
  const startHref = view.chatHref(view.skillId);
  const { ref, offscreen } = useOffscreen();

  const plain = view.plainName;
  const panel = (
    <Div className="order-1 rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6 lg:order-none">
      {variants.length > 1 && (
        <Div className="mb-4">
          <Span className="mb-2 block text-xs font-medium text-muted-foreground">
            {t("facts.versions")}
          </Span>
          <Div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Link
                key={variant.id}
                href={view.variantPageHref(variant)}
                aria-current={variant.id === active?.id ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-lg border px-3 text-sm font-medium transition-colors",
                  variant.id === active?.id
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-primary/40",
                )}
              >
                {variant.displayName ?? variant.chatModelName ?? t("chatModel")}
              </Link>
            ))}
          </Div>
        </Div>
      )}
      <Div className="divide-y divide-border text-sm [&>*:first-child]:pt-0">
        {active?.chatModelName && (
          <Row label={t("facts.runsOn")}>
            {active.chatModelSlug ? (
              <Link
                href={`/${locale}/models/${active.chatModelSlug}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {active.chatModelName}
              </Link>
            ) : (
              active.chatModelName
            )}
          </Row>
        )}
        {price && (
          <Row label={t("facts.perMessage")} className="hidden lg:block">
            <PriceText
              price={price}
              view={view}
              short
              className="justify-end"
            />
          </Row>
        )}
      </Div>
      <Div className="mt-4 hidden lg:block">
        <Cta
          href={startHref}
          label={t("chatWith", { name: plain })}
          className="w-full sm:w-full"
        />
        {isGuest && (
          <P className="mb-0 mt-2 text-center text-sm text-muted-foreground">
            {t("guest")}
          </P>
        )}
      </Div>
      {active?.chatModelContent && (
        <Div
          className={cn(
            "border-border text-sm lg:mt-5 lg:border-t lg:pt-1",
            // On phones the hidden price row keeps "Runs on" from being the
            // last child, so the list's own divider already separates them.
            !(price && active.chatModelName) && "border-t",
          )}
        >
          <Row label={t("facts.content")} hint={tierHint(view)}>
            <ModelTier content={active.chatModelContent} locale={locale} />
          </Row>
        </Div>
      )}
      {(active?.strength || active?.weakness) && (
        <Div className="border-t border-border pt-4 text-sm">
          <ExpectList view={view} />
        </Div>
      )}
      {priceBasis(price, t) && (
        <P className="mb-0 mt-4 border-t border-border pt-3 text-xs leading-snug text-muted-foreground">
          {priceBasis(price, t)}
        </P>
      )}
    </Div>
  );

  return (
    <Div>
      <Div className="border-b border-border bg-linear-to-b from-primary/[0.06] via-background to-background">
        <Div className={cn(CONTAINER, "pt-6 pb-12 md:pt-8 lg:pb-20")}>
          {topBar}
          <Div className="mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-x-16 lg:gap-y-10">
            <Div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <Div className="flex items-center gap-4 lg:gap-6">
                <SkillAvatar
                  skill={view.skill}
                  size="xl"
                  className="size-20 lg:size-28"
                />
                <Div className="min-w-0">
                  <H1 className="m-0 text-3xl font-semibold tracking-tight text-balance text-foreground md:text-5xl lg:text-6xl md:leading-[1.05]">
                    {name}
                  </H1>
                  {view.categoryLabel && (
                    <Eyebrow className="mt-2 lg:mt-3">
                      {view.categoryLabel}
                    </Eyebrow>
                  )}
                </Div>
              </Div>
              {view.tagline && (
                <P className="mb-0 mt-4 text-lg font-medium text-foreground">
                  {view.tagline}
                </P>
              )}
              <Description
                view={view}
                part="summary"
                className={cn(
                  "max-w-2xl text-base md:text-lg",
                  view.tagline ? "mt-1.5" : "mt-4",
                )}
              />
              <Attribution view={view} className="mt-4" />
              <Div ref={ref} className="mt-6 flex flex-col gap-2 lg:hidden">
                <Cta href={startHref} label={t("chatWith", { name: plain })} />
                {price && (
                  <PriceText
                    price={price}
                    view={view}
                    className="justify-center text-sm"
                  />
                )}
                {isGuest && (
                  <P className="m-0 text-center text-sm text-muted-foreground">
                    {t("guest")}
                  </P>
                )}
              </Div>
            </Div>

            <Div className="contents lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:gap-4 lg:self-start">
              {panel}
            </Div>

            <Div className="order-2 flex min-w-0 flex-col gap-10 lg:order-none lg:col-start-1 lg:row-start-2">
              {view.more && (
                <Div>
                  <H2 className="m-0 mb-4 border-none pb-0 text-xl font-semibold tracking-tight">
                    {t("story.title", { name: plain })}
                  </H2>
                  <Description
                    view={view}
                    part="more"
                    className="max-w-2xl text-base"
                  />
                </Div>
              )}
              {view.prompts.length > 0 && (
                <Div>
                  <H2 className="m-0 mb-4 border-none pb-0 text-xl font-semibold tracking-tight">
                    {t("prompts.start")}
                  </H2>
                  <Div
                    className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
                    data-testid="skill-prompts"
                  >
                    {view.prompts.map((prompt) => (
                      <Link
                        key={prompt}
                        href={view.chatHref(view.skillId, prompt)}
                        className="group flex min-h-14 items-center gap-4 px-4 py-3 text-foreground transition-colors hover:bg-primary/5 md:px-5"
                      >
                        <MessageSquare className="size-4 shrink-0 text-primary" />
                        <Span className="min-w-0 flex-1">{prompt}</Span>
                        <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </Div>
                  <P className="mb-0 mt-3 text-sm text-muted-foreground">
                    {t("prompts.intro", { name: plain })}
                  </P>
                </Div>
              )}
            </Div>
          </Div>
        </Div>
      </Div>
      <Div className="bg-muted/50">
        <Div className={cn(CONTAINER, "flex flex-col gap-10 py-12 md:py-16")}>
          <RelatedSections view={view} columns={3} />
          {extras}
        </Div>
      </Div>

      <Div
        data-testid="skill-mobile-bar"
        aria-hidden={!offscreen}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur transition-transform lg:hidden",
          offscreen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <Div className="mx-auto flex max-w-6xl items-center gap-3">
          <SkillAvatar skill={view.skill} size="sm" />
          <Div className="min-w-0 flex-1">
            <Span className="block truncate text-sm font-semibold">{name}</Span>
            {price && (
              <Span className="block truncate text-xs text-muted-foreground">
                {priceLabel(price, t)}
              </Span>
            )}
          </Div>
          <Cta
            href={startHref}
            label={t("startChat")}
            className="h-11 w-auto px-5"
          />
        </Div>
      </Div>
    </Div>
  );
}
