"use client";

import { Button } from "next-vibe/ui/components/button";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { FormElement } from "next-vibe/ui/components/form-element";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Info } from "next-vibe/ui/components/icons/Info";
import { MessageCircle } from "next-vibe/ui/components/icons/MessageCircle";
import { Quote } from "next-vibe/ui/components/icons/Quote";
import { Send } from "next-vibe/ui/components/icons/Send";
import { Image } from "next-vibe/ui/components/image";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { Summary } from "next-vibe/ui/components/summary";
import { H1, H2, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";

import { CONTAINER } from "../../story/_shared/marketing";
import type { SkillPageDesign } from "./design-selection";
import type { SkillLandingPageT } from "./i18n";
import { HERO_CTA_ID } from "./landing-actions";
import type { SkillSample } from "./samples";

interface PreviewProps {
  design: SkillPageDesign;
  name: string;
  pitch: string;
  detail: string;
  board: boolean;
  inputHint: string;
  savedCount: number;
  ctaLabel: string;
  avatar: ReactNode;
  byline: ReactNode;
  model: string | null;
  price: string | null;
  guestNote: string | null;
  contentNote: string | null;
  tryUrl: string;
  promptUrl: (prompt: string) => string;
  prompts: string[];

  samples: SkillSample[];
  t: SkillLandingPageT;
}

const kicker = "text-xs font-semibold uppercase tracking-[.16em]";
const wrap = "min-w-0 [overflow-wrap:anywhere]";

function ChatAction({
  tryUrl,
  guestNote,
  ctaLabel,
  design,
}: PreviewProps): JSX.Element {
  return (
    <Div
      id={HERO_CTA_ID}
      className="flex flex-wrap items-center gap-x-4 gap-y-2"
    >
      <Link
        href={tryUrl}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold no-underline transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4",
          design === "B"
            ? "bg-violet-700 text-white dark:bg-violet-300 dark:text-violet-950"
            : "bg-foreground text-background",
        )}
      >
        <MessageCircle className="size-4" />
        {ctaLabel}
      </Link>
      <Div className="flex flex-col text-sm leading-snug text-muted-foreground">
        {guestNote && <Span>{guestNote}</Span>}
      </Div>
    </Div>
  );
}

function PersonaMark({ board, avatar }: PreviewProps): JSX.Element {
  return board ? (
    <Image
      src="/images/skill-preview/terminal.webp"
      width={680}
      height={450}
      alt=""
      priority
      className="size-full object-cover object-[46%_center]"
    />
  ) : (
    <Span className="inline-flex size-full items-center justify-center overflow-hidden rounded-[inherit] [&>span]:size-full [&>span]:rounded-[inherit] [&_img]:size-full [&_img]:object-cover [&_svg]:size-1/2">
      {avatar}
    </Span>
  );
}

function ContentNote({ contentNote }: PreviewProps): JSX.Element | null {
  return contentNote ? (
    <Div className="flex items-start gap-2 text-sm font-medium leading-snug text-amber-900 dark:text-amber-200">
      <Info className="mt-0.5 size-4 shrink-0" />
      {contentNote}
    </Div>
  ) : null;
}

function ModelFacts({
  model,
  price,
  savedCount,
  t,
}: PreviewProps): JSX.Element {
  return (
    <Div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-snug text-muted-foreground">
      {model && <Span>{t("hero.runsOn", { model })}</Span>}
      {price && <Span>{t("hero.costPerMessage", { price })}</Span>}
      {savedCount > 0 && (
        <Span>{t("hero.favorites", { count: savedCount })}</Span>
      )}
    </Div>
  );
}

function UsePrompt({
  prompt,
  promptUrl,
  t,
}: Pick<PreviewProps, "promptUrl" | "t"> & { prompt: string }): JSX.Element {
  return (
    <Link
      href={promptUrl(prompt)}
      className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline decoration-current/45 underline-offset-4 hover:decoration-current"
    >
      <MessageCircle className="size-4" />
      {t("preview.usePrompt")}
    </Link>
  );
}

function StarterLink({
  prompt,
  href,
}: {
  prompt: string;
  href: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className="group flex min-h-11 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-base leading-snug text-foreground no-underline hover:border-primary hover:text-primary"
    >
      <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
      {prompt}
      <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function Starters({ prompts, promptUrl, t }: PreviewProps): JSX.Element {
  return (
    <Div className="min-w-0">
      <H2 className="m-0 border-0 pb-0 text-xl font-semibold tracking-tight">
        {t("preview.startQuestion")}
      </H2>
      <Div className="mt-2 flex flex-col gap-2">
        {prompts.map((prompt) => (
          <StarterLink key={prompt} prompt={prompt} href={promptUrl(prompt)} />
        ))}
      </Div>
    </Div>
  );
}

function MoreReplies({ samples, t }: PreviewProps): JSX.Element | null {
  if (samples.length < 2) {
    return null;
  }
  return (
    <Details className="mt-4 border-t border-border">
      <Summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-medium">
        {t("preview.more")}
        <ChevronDown className="size-4" />
      </Summary>
      {samples.slice(1).map((sample) => (
        <Div key={sample.prompt} className="mb-5">
          <P className="m-0 font-semibold">{sample.prompt}</P>
          <P className="mt-2 whitespace-pre-line leading-relaxed">
            {sample.answer}
          </P>
        </Div>
      ))}
    </Details>
  );
}

function ChatStartForm({
  tryUrl,
  inputHint,
  design,
  ctaLabel,
  t,
}: PreviewProps): JSX.Element {
  const [path, query] = tryUrl.split("?");
  return (
    <FormElement
      action={path}
      className="flex min-h-12 items-center gap-2 rounded-xl border border-border bg-background py-1 pr-1 pl-3 focus-within:border-emerald-600"
    >
      {Array.from(new URLSearchParams(query), ([key, value]) => (
        <Input key={key} type="hidden" name={key} defaultValue={value} />
      ))}
      <Input
        name="q"
        placeholder={inputHint}
        aria-label={inputHint}
        className="min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        className={cn(
          "min-h-11 shrink-0 gap-1.5 rounded-lg px-3 text-sm font-semibold",
          design === "C"
            ? "bg-foreground text-background hover:opacity-90"
            : "bg-emerald-800 text-white hover:bg-emerald-900 dark:bg-emerald-300 dark:text-emerald-950",
        )}
      >
        <Send className="size-4" />
        {design === "C" ? ctaLabel : t("preview.startChat")}
      </Button>
    </FormElement>
  );
}

function Conversation(props: PreviewProps): JSX.Element {
  const { name, pitch, byline, samples, t } = props;
  const sample = samples[0];
  return (
    <Section className="border-b border-border bg-[#eaf2ee] dark:bg-[#121f1b]">
      <Div className={cn(CONTAINER, "py-4 sm:py-10")}>
        <Div className="overflow-hidden rounded-3xl border border-emerald-900/15 bg-card shadow-lg shadow-emerald-950/5 md:grid md:grid-cols-[.85fr_1.15fr] dark:border-white/15">
          <Div
            className={cn(
              wrap,
              "border-b border-border px-5 py-4 sm:p-7 md:row-span-2 md:border-r md:border-b-0",
            )}
          >
            <Div className="flex items-center gap-3 md:items-start">
              <Span className="inline-flex size-14 shrink-0 overflow-hidden rounded-xl sm:size-20">
                <PersonaMark {...props} />
              </Span>
              <Div className="min-w-0">
                <H1 className="m-0 text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
                  {name}
                </H1>
                <Div className="text-sm text-muted-foreground">{byline}</Div>
              </Div>
            </Div>
            <P className="mt-3 max-w-lg text-xl font-semibold leading-tight text-balance sm:text-3xl">
              {pitch}
            </P>
            {props.detail && (
              <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {props.detail}
              </P>
            )}
            {props.contentNote && (
              <Div className="mt-2">
                <ContentNote {...props} />
              </Div>
            )}
            <Div className="mt-4" id={HERO_CTA_ID}>
              <ChatStartForm {...props} />
              {props.guestNote && (
                <Span className="mt-1.5 block text-sm text-muted-foreground">
                  {props.guestNote}
                </Span>
              )}
              {sample && props.prompts[0] && (
                <Div className="mt-3 md:hidden">
                  <StarterLink
                    prompt={props.prompts[0]}
                    href={props.promptUrl(props.prompts[0])}
                  />
                </Div>
              )}
            </Div>
            <Div className="mt-5 hidden md:block">
              <Starters {...props} />
            </Div>
          </Div>
          <Div
            className={cn(
              wrap,
              "px-5 py-4 sm:p-7 md:col-start-2 md:row-span-2 md:row-start-1",
            )}
          >
            {sample ? (
              <>
                <Span
                  className={cn(
                    kicker,
                    "text-emerald-800 dark:text-emerald-300",
                  )}
                >
                  {t("preview.recorded")}
                </Span>
                <Div className="mt-3 flex flex-col items-start gap-3">
                  <Div className="ml-8 self-end rounded-2xl rounded-br-sm bg-[#d9ede2] px-4 py-2.5 text-base leading-snug text-emerald-950 dark:bg-[#284a3a] dark:text-emerald-50">
                    <Span className="block text-xs font-semibold">
                      {t("chat.you")}
                    </Span>
                    {sample.prompt}
                  </Div>
                  <Div className="mr-5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-base leading-relaxed whitespace-pre-line">
                    <Span className="block text-xs font-semibold">{name}</Span>
                    <Span
                      className={
                        props.board && sample.answer.startsWith(">")
                          ? "font-mono text-[.94em] text-emerald-800 dark:text-emerald-300"
                          : undefined
                      }
                    >
                      {sample.answer}
                    </Span>
                  </Div>
                </Div>
                <UsePrompt prompt={sample.prompt} {...props} />
                <MoreReplies {...props} />
              </>
            ) : (
              <Div className="md:hidden">
                <Starters {...props} />
              </Div>
            )}
            <ModelFacts {...props} />
          </Div>
        </Div>
      </Div>
    </Section>
  );
}

function Identity(props: PreviewProps): JSX.Element {
  const { name, pitch, samples, t } = props;
  const sample = samples[0];
  return (
    <Section className="border-b border-border bg-[#f3effb] dark:bg-[#1b1726]">
      <Div className={cn(CONTAINER, "py-4 md:py-10")}>
        <Div className="overflow-hidden rounded-3xl border border-violet-900/15 bg-card shadow-lg shadow-violet-950/5 dark:border-violet-200/15">
          <Div className="relative isolate grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 overflow-hidden bg-[#45306f] px-5 py-4 text-white sm:gap-5 sm:p-6 lg:grid-cols-[auto_1fr_minmax(220px,.55fr)]">
            <Div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[repeating-radial-gradient(ellipse_at_10%_100%,transparent_0px,transparent_22px,#bba1eb40_23px,transparent_25px)]"
            />
            <Div className="inline-flex size-16 shrink-0 -rotate-3 overflow-hidden rounded-2xl border border-white/60 bg-violet-100 shadow-[4px_5px_0_#24183c] sm:size-24">
              <PersonaMark {...props} />
            </Div>
            <Div className={wrap}>
              <Span className={cn(kicker, "text-violet-100")}>
                {t("preview.identity")}
              </Span>
              <H1 className="m-0 text-2xl font-semibold tracking-tight lg:text-3xl">
                {name}
              </H1>
              <P className="mt-1 max-w-xl text-lg font-semibold leading-tight text-balance sm:text-3xl">
                {pitch}
              </P>
            </Div>
            <Div className="col-span-2 rounded-xl bg-card p-3 text-foreground lg:col-span-1">
              <ContentNote {...props} />
              <ChatAction {...props} />
            </Div>
          </Div>
          <Div className="grid px-5 py-4 sm:p-7 md:grid-cols-[1fr_1fr] md:gap-x-10">
            <Div className="flex min-w-0 flex-col items-start gap-2">
              {props.detail && (
                <P className="m-0 text-base leading-snug">{props.detail}</P>
              )}

              <Div className="mt-2 text-sm text-muted-foreground">
                {props.byline}
              </Div>
            </Div>
            <Div className="mt-4 md:row-span-2 md:mt-0">
              {sample && (
                <Div className="rounded-xl bg-muted/75 p-4">
                  <Span className="block text-xs font-semibold uppercase tracking-wider text-violet-800 dark:text-violet-200">
                    {t("preview.recorded")}
                  </Span>
                  <P className="mt-2 text-sm font-medium">
                    <Span className="block text-xs text-muted-foreground">
                      {t("preview.youAsk")}
                    </Span>
                    {sample.prompt}
                  </P>
                  <P className="mt-2 text-base leading-relaxed whitespace-pre-line">
                    <Span className="block text-xs font-semibold text-violet-800 dark:text-violet-200">
                      {t("preview.replies", { name })}
                    </Span>
                    {sample.answer}
                  </P>
                  <UsePrompt prompt={sample.prompt} {...props} />
                </Div>
              )}
            </Div>
            <Div className="mt-4 min-w-0">
              <Starters {...props} />
            </Div>
            <Div className="mt-2 min-w-0 md:col-start-2">
              <MoreReplies {...props} />
              <ModelFacts {...props} />
            </Div>
          </Div>
        </Div>
      </Div>
    </Section>
  );
}

function QuestionPage(props: PreviewProps): JSX.Element {
  const { name, byline, pitch, samples, t, prompts, promptUrl } = props;
  const sample = samples[0];
  const question = sample?.prompt ?? prompts[0];
  return (
    <Section className="border-b border-border bg-[#faf6ed] text-[#27251e] dark:bg-[#24211c] dark:text-[#f8f2e5]">
      <Div className={cn(CONTAINER, "py-3 md:py-10")}>
        <Div className="flex items-center justify-between gap-x-4 border-y-2 border-current py-3">
          <Div className="flex items-center gap-3">
            <Span className="inline-flex size-12 shrink-0 overflow-hidden rounded-lg md:hidden">
              <PersonaMark {...props} />
            </Span>
            <Div>
              <H1 className="m-0 font-serif text-3xl font-bold tracking-tight [overflow-wrap:anywhere] md:text-4xl lg:text-4xl">
                {name}
              </H1>
              <Div className="text-sm">{byline}</Div>
            </Div>
          </Div>
        </Div>
        <Div className="grid items-end gap-3 border-b border-current/30 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,.4fr)] md:py-8">
          <Div className={wrap}>
            <H2 className="m-0 max-w-2xl border-0 pb-0 font-serif text-3xl leading-[1.08] font-medium tracking-[-.04em] text-balance sm:text-5xl">
              {pitch}
            </H2>
            {props.detail && (
              <P className="mt-3 max-w-xl text-base leading-relaxed">
                {props.detail}
              </P>
            )}
          </Div>
          <Div className="flex flex-col items-start gap-3 md:col-start-1">
            <ContentNote {...props} />
            <Div className="w-full max-w-lg" id={HERO_CTA_ID}>
              <ChatStartForm {...props} />
              {props.guestNote && (
                <Span className="mt-1.5 block text-sm text-muted-foreground">
                  {props.guestNote}
                </Span>
              )}
            </Div>
          </Div>
          <Div className="hidden h-44 w-full overflow-hidden rounded-lg md:col-start-2 md:row-start-1 md:row-span-2 md:block md:self-center md:justify-self-center">
            <PersonaMark {...props} />
          </Div>
        </Div>
        <Div className="grid items-start gap-5 py-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] md:gap-10 md:py-7">
          {sample && (
            <Div
              className={cn(wrap, "border-l-2 border-[#b56948] pl-4 md:pl-6")}
            >
              <Div className="flex items-center gap-2 text-[#9b4027] dark:text-[#f6b89b]">
                <Quote className="size-4" />
                <Span className={kicker}>{t("preview.recorded")}</Span>
              </Div>
              <Span className="mt-2 block text-xs font-bold uppercase tracking-wide text-[#784327] dark:text-[#f6b89b]">
                {t("preview.youAsk")}
              </Span>
              <P className="mt-0.5 max-w-xl text-base font-semibold leading-snug">
                {question}
              </P>
              <Span className="mt-3 block text-xs font-bold uppercase tracking-wide text-[#784327] dark:text-[#f6b89b]">
                {t("preview.replies", { name })}
              </Span>
              <P className="mt-0.5 max-w-xl font-serif text-xl leading-snug whitespace-pre-line md:text-2xl">
                {sample.answer}
              </P>
              <UsePrompt prompt={sample.prompt} {...props} />
              <MoreReplies {...props} />
            </Div>
          )}
          <Div className="min-w-0">
            <H2 className="m-0 border-0 pb-0 font-serif text-xl font-semibold">
              {t("preview.startQuestion")}
            </H2>
            <Div className="mt-2 flex flex-col gap-2">
              {prompts.slice(0, 2).map((prompt) => (
                <StarterLink
                  key={prompt}
                  prompt={prompt}
                  href={promptUrl(prompt)}
                />
              ))}
            </Div>
          </Div>
        </Div>
        <ModelFacts {...props} />
      </Div>
    </Section>
  );
}

export function DesignPreview(props: PreviewProps): JSX.Element {
  switch (props.design) {
    case "A":
      return <Conversation {...props} />;
    case "B":
      return <Identity {...props} />;
    case "C":
      return <QuestionPage {...props} />;
  }
}
