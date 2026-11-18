"use client";

import { resolveMediaSrc } from "next-vibe/agent/chat/storage/media-src";
import type { StudioEntry } from "next-vibe/agent/media-studio/history";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Audio } from "next-vibe/ui/components/audio";
import { Div } from "next-vibe/ui/components/div";
import { Download } from "next-vibe/ui/components/icons/Download";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Image } from "next-vibe/ui/components/image";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { Video } from "next-vibe/ui/components/video";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { type JSX, useEffect } from "react";

import { formatCreditAmount } from "@/products/credit-money";

import { scopedTranslation } from "../i18n";
import type { CreateKind } from "./create-kinds";
import { STUDIO_ICONS } from "./studio-shell";

export function StudioMedia({
  kind,
  url,
  transcript,
  title,
  locale,
}: {
  kind: CreateKind;
  url?: string | null;
  transcript?: string | null;
  title: string;
  locale: CountryLanguage;
}): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const src = url ? resolveMediaSrc(url) : undefined;
  const href = transcript
    ? `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`
    : src;
  if (!href) {
    return null;
  }
  return (
    <Div className="flex min-w-0 flex-col items-start gap-2">
      {kind === "image" && src && (
        <Image
          src={src}
          alt={title}
          width={512}
          height={512}
          unoptimized
          className="max-h-80 w-full rounded-lg bg-muted object-contain"
        />
      )}
      {kind === "video" && src && (
        <Video
          src={src}
          controls
          playsInline
          preload="metadata"
          className="max-h-80 w-full rounded-lg bg-black"
        />
      )}
      {(kind === "speech" || kind === "music") && src && (
        <Audio
          src={src}
          controls
          preload="metadata"
          className="w-full min-w-0"
        />
      )}
      {transcript && (
        <P className="m-0 max-h-48 w-full overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted/50 p-3 text-sm">
          {transcript}
        </P>
      )}
      <ExternalLink
        href={href}
        download={transcript ? "transcript.txt" : true}
        className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
      >
        <Download className="size-4" />
        {t("download")}
      </ExternalLink>
    </Div>
  );
}

export function StudioGallery({
  locale,
  kind,
  history,
}: {
  locale: CountryLanguage;
  kind?: CreateKind;
  history: StudioEntry[] | null;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const router = useRouter();
  const running = history?.some(
    (row) => row.status !== "completed" && row.status !== "failed",
  );
  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = setInterval(() => {
      void router.refresh();
    }, 5000);
    return (): void => clearInterval(timer);
  }, [running, router]);
  const EmptyIcon = kind ? STUDIO_ICONS[kind] : Layers;
  return (
    <Div className="min-w-0 rounded-2xl border bg-card p-4 sm:p-6">
      <H2 className="mb-4 mt-0 text-lg font-semibold tracking-tight">
        {t("recent")}
      </H2>
      {history === null ? (
        <P className="text-sm text-muted-foreground">{t("historyError")}</P>
      ) : history.length === 0 ? (
        <Div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-5 py-8 text-center sm:py-12">
          <Span className="inline-flex size-12 items-center justify-center rounded-xl border bg-background text-muted-foreground">
            <EmptyIcon className="size-5" />
          </Span>
          <P className="m-0 max-w-64 text-sm leading-relaxed text-muted-foreground">
            {t(kind ? "emptyKind" : "empty")}
          </P>
        </Div>
      ) : (
        <Div
          className={
            kind ? "grid gap-4" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {history.map((row) => (
            <Div
              key={row.id}
              className="flex min-w-0 flex-col gap-2 rounded-lg border p-3"
            >
              <Span className="line-clamp-2 break-words text-sm font-medium">
                {row.title}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {`${t(`kinds.${row.kind}.label`)} · ${new Intl.DateTimeFormat(
                  locale.split("-")[0],
                  {
                    dateStyle: "medium",
                    timeZone: "UTC",
                  },
                ).format(new Date(row.createdAt))}`}
                {row.credits !== null &&
                  ` · ${t("credits", { amount: formatCreditAmount(row.credits, locale) })}`}
              </Span>
              {row.status === "completed" ? (
                <StudioMedia {...row} locale={locale} />
              ) : (
                <Div
                  aria-live="polite"
                  className="text-sm text-muted-foreground"
                >
                  {t(row.status)}
                </Div>
              )}
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}
