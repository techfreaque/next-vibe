"use client";

/**
 * Media Studio history: the visitor's generations as a gallery. Each card
 * plays or shows the result and offers run again, copy prompt, download and
 * open in chat. Used on /create (all kinds) and every /create/<kind> page.
 */

import {
  mediaDownloadHref,
  mediaDownloadName,
} from "next-vibe/agent/chat/storage/download-name";
import { resolveMediaSrc } from "next-vibe/agent/chat/storage/media-src";
import { Audio } from "next-vibe/ui/components/audio";
import { Button, buttonVariants } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { type DivRefObject } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Download } from "next-vibe/ui/components/icons/Download";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { Film } from "next-vibe/ui/components/icons/Film";
import { Image as ImageIcon } from "next-vibe/ui/components/icons/Image";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Mic } from "next-vibe/ui/components/icons/Mic";
import { Music } from "next-vibe/ui/components/icons/Music";
import { Play } from "next-vibe/ui/components/icons/Play";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { RotateCcw } from "next-vibe/ui/components/icons/RotateCcw";
import { Image } from "next-vibe/ui/components/image";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { Video } from "next-vibe/ui/components/video";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useWidgetValue } from "next-vibe/unified-ui/_shared/use-widget-value";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { type JSX, useEffect, useRef, useState } from "react";

import {
  CREATE_KINDS,
  createHref,
  type CreateKind,
  rerunHref,
} from "@/_pages/create/_shared/create-kinds";
import { formatCreditAmount } from "@/products/credit-money";

import { MEDIA_HISTORY_PAGE_SIZE } from "./constants";
import type definition from "./definition";
import type { MediaHistoryItem } from "./definition";
import { scopedTranslation } from "./i18n";

const KIND_ICONS = {
  image: ImageIcon,
  video: Film,
  music: Music,
  speech: Mic,
  transcribe: FileText,
};

/** Generations still running poll every few seconds until they settle. */
const POLL_MS = 4000;

const STEPS = ["queued", "running", "saving"] as const;

/** "Load more" reads two tool-page screens at once. */
const LOAD_MORE_LIMIT = MEDIA_HISTORY_PAGE_SIZE * 2;
/** Start loading the next page this far before the end scrolls into view. */
const LOAD_MORE_MARGIN = "600px 0px";

function newestFirst(a: MediaHistoryItem, b: MediaHistoryItem): number {
  const byTime =
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  return byTime || (a.id === b.id ? 0 : a.id < b.id ? 1 : -1);
}

/**
 * Union by id, newest first. `fresh` wins, so polled status updates on the
 * first page replace the copies kept from earlier pages.
 */
function mergeItems(
  fresh: MediaHistoryItem[],
  kept: MediaHistoryItem[],
): MediaHistoryItem[] {
  const ids = new Set(fresh.map((item) => item.id));
  return [...fresh, ...kept.filter((item) => !ids.has(item.id))].toSorted(
    newestFirst,
  );
}

/** Calls `onVisible` when it nears the viewport: infinite scroll. */
function LoadMoreSentinel({
  onVisible,
}: {
  onVisible: () => void;
}): JSX.Element {
  const ref = useRef<DivRefObject>(null);
  const callback = useRef(onVisible);
  useEffect(() => {
    callback.current = onVisible;
  });
  useEffect(() => {
    const node = ref.current;
    if (!(node instanceof Element)) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          callback.current();
        }
      },
      { rootMargin: LOAD_MORE_MARGIN },
    );
    observer.observe(node);
    return (): void => observer.disconnect();
  }, []);
  return <Div ref={ref} aria-hidden={true} className="h-px w-full" />;
}

const tileButton = cn(
  buttonVariants({ variant: "ghost", size: "sm" }),
  "h-9 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
);

/**
 * A generated file: image, video, audio player or transcript, plus a
 * download link. Also shows the fresh result under each create form.
 */
export function StudioMedia({
  kind,
  url,
  transcript,
  title,
  model,
  showDownload = true,
}: {
  kind: CreateKind;
  url?: string | null;
  transcript?: string | null;
  title: string;
  /** Names the downloaded file (unbottled-<model>-<date>.<ext>). */
  model?: string | null;
  showDownload?: boolean;
}): JSX.Element | null {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const src = url ? resolveMediaSrc(url) : undefined;
  const downloadName = src
    ? mediaDownloadName({ url: src, kind, model })
    : null;
  const href = transcript
    ? `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`
    : src && mediaDownloadHref(src, downloadName);
  if (!href) {
    return null;
  }
  return (
    <Div className="flex min-w-0 flex-col items-stretch gap-2">
      {kind === "image" && src && (
        <ExternalLink
          href={src}
          title={t("widget.open")}
          className="block overflow-hidden rounded-lg bg-muted"
        >
          <Image
            src={src}
            alt={title}
            width={768}
            height={768}
            unoptimized
            className="max-h-[28rem] w-full object-contain"
          />
        </ExternalLink>
      )}
      {kind === "video" && src && (
        <Video
          src={src}
          controls
          playsInline
          preload="metadata"
          className="max-h-[28rem] w-full rounded-lg bg-black"
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
        <P className="m-0 max-h-60 w-full overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">
          {transcript}
        </P>
      )}
      {showDownload && (
        <ExternalLink
          href={href}
          download={transcript ? "transcript.txt" : (downloadName ?? true)}
          className={cn(tileButton, "self-start")}
        >
          <Download className="size-4" />
          {t("widget.download")}
        </ExternalLink>
      )}
    </Div>
  );
}

function Preview({ item }: { item: MediaHistoryItem }): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const Icon = KIND_ICONS[item.kind];
  if (item.status === "failed") {
    return (
      <Div className="flex aspect-square flex-col items-center justify-center gap-2 bg-destructive/10 px-2 text-center @max-xl:absolute @max-xl:inset-0 @max-xl:aspect-auto @xl:aspect-video @xl:px-6">
        <AlertTriangle className="size-5 text-destructive" />
        <Span className="text-xs font-medium @xl:text-sm">
          {t("widget.status.failed")}
        </Span>
      </Div>
    );
  }
  if (item.status !== "completed") {
    const current = STEPS.indexOf(item.status);
    return (
      <Div
        aria-live="polite"
        className="flex aspect-square flex-col items-center justify-center gap-2 px-2 text-center @xl:aspect-[4/3] @xl:gap-3 @xl:px-6"
      >
        <Loader2 className="size-5 animate-spin text-muted-foreground @xl:size-6" />
        <Span className="text-xs font-medium @xl:text-sm">
          {t(`widget.status.${item.status}`)}
        </Span>
        <Div className="flex items-center gap-1.5" aria-hidden>
          {STEPS.map((step, index) => (
            <Span
              key={step}
              className={cn(
                "h-1.5 w-4 rounded-full @xl:w-8",
                index <= current ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </Div>
        <Span className="hidden text-xs text-muted-foreground @xl:block">
          {t("widget.pendingHint")}
        </Span>
      </Div>
    );
  }
  const src = item.url ? resolveMediaSrc(item.url) : undefined;
  if (item.kind === "image" && src) {
    return (
      <ExternalLink
        href={src}
        title={t("widget.open")}
        className="block bg-muted @max-xl:absolute @max-xl:inset-0"
      >
        <Image
          src={src}
          alt={item.title}
          width={640}
          height={640}
          unoptimized
          className="aspect-square w-full object-cover @max-xl:h-full @xl:aspect-[4/3]"
        />
      </ExternalLink>
    );
  }
  if (item.kind === "video" && src) {
    // #t: browsers paint the first frame instead of a black box.
    return (
      <>
        <ExternalLink
          href={src}
          title={t("widget.open")}
          className="relative block bg-black @max-xl:absolute @max-xl:inset-0"
        >
          <Video
            src={`${src}#t=0.1`}
            muted
            playsInline
            preload="metadata"
            className="aspect-square w-full object-cover @max-xl:h-full @xl:aspect-[4/3]"
          />
          <Span className="absolute inset-0 m-auto inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow">
            <Play className="size-4" />
          </Span>
        </ExternalLink>
      </>
    );
  }
  if ((item.kind === "music" || item.kind === "speech") && src) {
    return (
      <>
        <KindTile kind={item.kind} />
        <Div className="hidden flex-col gap-3 p-4 @xl:flex">
          <Span className="inline-flex size-10 items-center justify-center rounded-xl border bg-background text-muted-foreground">
            <Icon className="size-5" />
          </Span>
          <Audio
            src={src}
            controls
            preload="metadata"
            className="w-full min-w-0"
          />
        </Div>
      </>
    );
  }
  return (
    <>
      <KindTile kind={item.kind} />
      <P className="m-0 hidden min-h-24 whitespace-pre-wrap break-words p-4 text-sm leading-relaxed @xl:line-clamp-6 @xl:block">
        {item.transcript ?? item.title}
      </P>
    </>
  );
}

/** Compact rows: an icon square where there is no picture to show. */
function KindTile({ kind }: { kind: CreateKind }): JSX.Element {
  const Icon = KIND_ICONS[kind];
  return (
    <Div className="flex aspect-square items-center justify-center text-muted-foreground @xl:hidden">
      <Icon className="size-6" />
    </Div>
  );
}

function Dot(): JSX.Element {
  return (
    <Span aria-hidden className="size-1 rounded-full bg-current opacity-50" />
  );
}

function HistoryCard({
  item,
  showKind,
}: {
  item: MediaHistoryItem;
  /** Only the all-kinds hub names the kind; a tool page already does. */
  showKind: boolean;
}): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { t } = scopedTranslation.scopedT(locale);
  const [copied, setCopied] = useState<"ok" | "failed" | null>(null);
  const Icon = KIND_ICONS[item.kind];
  const done = item.status === "completed";
  const src = item.url ? resolveMediaSrc(item.url) : undefined;
  const absolute = item.url
    ? resolveMediaSrc(item.url, { absolute: true })
    : undefined;
  const downloadName = src
    ? mediaDownloadName({
        url: src,
        kind: item.kind,
        model: item.model,
        createdAt: item.createdAt,
      })
    : null;
  const download = item.transcript
    ? `data:text/plain;charset=utf-8,${encodeURIComponent(item.transcript)}`
    : src && mediaDownloadHref(src, downloadName);
  const prompt =
    typeof item.settings?.prompt === "string"
      ? item.settings.prompt
      : typeof item.settings?.text === "string"
        ? item.settings.text
        : item.title;
  const chatHref =
    item.threadId && item.rootFolderId
      ? `/${locale}/threads/${item.rootFolderId}/${item.threadId}`
      : `/${locale}/threads/${user.isPublic ? "incognito" : "private"}/new?q=${encodeURIComponent(
          item.transcript ??
            t("widget.chatPrompt", { url: absolute ?? "", prompt }),
        )}`;
  const rerun = item.settings
    ? rerunHref(locale, item.kind, item.settings)
    : createHref(locale, item.kind, item.model ?? undefined);
  const date = new Intl.DateTimeFormat(locale.split("-")[0], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(item.createdAt));
  return (
    <Div className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_minmax(0,1fr)] overflow-hidden rounded-xl border bg-background @xl:flex @xl:flex-col">
      <Div className="relative min-h-20 min-w-0 bg-muted/40 sm:min-h-26 @xl:min-h-0">
        <Preview item={item} />
      </Div>
      <Div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        <P className="m-0 line-clamp-2 break-words text-sm font-medium leading-snug">
          {item.kind === "transcribe" ? item.title : prompt}
        </P>
        {item.transcript && (
          <P className="m-0 line-clamp-2 break-words text-xs leading-relaxed text-muted-foreground @xl:hidden">
            {item.transcript}
          </P>
        )}
        {done && src && (item.kind === "music" || item.kind === "speech") && (
          <Audio
            src={src}
            controls
            preload="metadata"
            className="h-9 w-full min-w-0 @xl:hidden"
          />
        )}
        <Div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <Div className="flex min-w-0 items-center gap-2">
            {showKind && (
              <>
                <Span className="inline-flex shrink-0 items-center gap-1">
                  <Icon className="size-3.5" />
                  {t(`widget.kinds.${item.kind}`)}
                </Span>
                <Dot />
              </>
            )}
            <Span className="truncate">{date}</Span>
          </Div>
          <Div className="flex min-w-0 items-center gap-2">
            <Span>{t(`widget.source.${item.source}`)}</Span>
            {item.credits !== null && (
              <>
                <Dot />
                <Span className="tabular-nums">
                  {t("widget.credits", {
                    amount: formatCreditAmount(item.credits, locale),
                  })}
                </Span>
              </>
            )}
          </Div>
        </Div>
        <Div className="mt-auto flex flex-wrap items-center gap-0.5 pt-1">
          <Link
            href={rerun}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mr-1 h-9 gap-1.5 px-2.5",
            )}
          >
            <RotateCcw className="size-4" />
            {t("widget.runAgain")}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="unset"
            className={tileButton}
            title={t("widget.copyPrompt")}
            aria-label={t("widget.copyPrompt")}
            onClick={() => {
              void copyToClipboard(prompt, logger).then((ok) =>
                setCopied(ok ? "ok" : "failed"),
              );
            }}
          >
            {copied === "ok" ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied && (
              <Span className="text-xs">
                {t(copied === "ok" ? "widget.copied" : "widget.copyFailed")}
              </Span>
            )}
          </Button>
          {done && download && (
            <ExternalLink
              href={download}
              download={
                item.transcript ? "transcript.txt" : (downloadName ?? true)
              }
              className={tileButton}
              title={t("widget.download")}
              aria-label={t("widget.download")}
            >
              <Download className="size-4" />
            </ExternalLink>
          )}
          {done && (
            <Link
              href={chatHref}
              className={tileButton}
              title={t(
                item.threadId ? "widget.openInChat" : "widget.continueInChat",
              )}
              aria-label={t(
                item.threadId ? "widget.openInChat" : "widget.continueInChat",
              )}
            >
              <MessageSquare className="size-4" />
            </Link>
          )}
        </Div>
      </Div>
    </Div>
  );
}

function LoadingGrid({ count }: { count: number }): JSX.Element {
  return (
    <Div className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
      {[...Array(count).keys()].map((index) => (
        <Div
          key={index}
          className="grid grid-cols-[5rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_minmax(0,1fr)] overflow-hidden rounded-xl border @xl:flex @xl:flex-col"
        >
          <Skeleton className="aspect-square w-full rounded-none @xl:aspect-[4/3]" />
          <Div className="flex flex-col gap-2 p-3">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </Div>
        </Div>
      ))}
    </Div>
  );
}

/** One line per result: what the AI and the CLI get. */
function CompactList({ items }: { items: MediaHistoryItem[] }): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="flex flex-col gap-1">
      {items.map((item) => (
        <Span key={item.id}>
          {`${t(`widget.kinds.${item.kind}`)} · ${t(`widget.status.${item.status}`)} · ${item.title}${item.url ? ` · ${resolveMediaSrc(item.url, { absolute: true })}` : ""}`}
        </Span>
      ))}
    </Div>
  );
}

export function MediaHistoryWidget(): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const form = useWidgetForm<typeof definition.GET>();
  const mutations = useWidgetEndpointMutations();
  const responseOnly = useWidgetResponseOnly();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const kind = form?.watch("kind");
  const firstPage = value?.items ?? [];
  const pagination = value?.paginationInfo;
  const fetching = mutations?.read?.isFetching ?? false;
  const refetch = mutations?.read?.refetch;
  // Pages past the first. Everything shown when "load more" ran is kept, so
  // a new result arriving on top never pushes an item out of the list.
  const [more, setMore] = useState<{
    kind: CreateKind | undefined;
    items: MediaHistoryItem[];
    nextCursor: string | null;
  } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const loaded = more?.kind === kind ? more : null;
  const items = loaded ? mergeItems(firstPage, loaded.items) : firstPage;
  const nextCursor = loaded ? loaded.nextCursor : (value?.nextCursor ?? null);
  const loadMore = async (): Promise<void> => {
    if (!nextCursor || loadingMore || !user) {
      return;
    }
    setLoadingMore(true);
    setLoadMoreError(false);
    const { default: endpoint } = await import("./definition");
    const page = await apiClient.fetch(
      endpoint.GET,
      logger,
      user,
      {
        kind,
        cursor: nextCursor,
        paginationInfo: { page: 1, limit: LOAD_MORE_LIMIT },
      },
      undefined,
      locale,
    );
    setLoadingMore(false);
    if (!page.success) {
      setLoadMoreError(true);
      return;
    }
    setMore({
      kind,
      items: mergeItems(items, page.data.items),
      nextCursor: page.data.nextCursor,
    });
  };
  const running = firstPage.some(
    (item) => item.status !== "completed" && item.status !== "failed",
  );
  // Polling, not data loading: async jobs (video, music) report progress
  // only through the stored row, so the list re-reads until they settle.
  useEffect(() => {
    if (!running || !refetch) {
      return;
    }
    const timer = setInterval(() => {
      void refetch();
    }, POLL_MS);
    return (): void => clearInterval(timer);
  }, [running, refetch]);

  if (responseOnly) {
    return <CompactList items={items} />;
  }

  const EmptyIcon = kind ? KIND_ICONS[kind] : Layers;
  const failed = response?.success === false && !value;
  return (
    <Div className="@container flex min-w-0 flex-col gap-4">
      <Div className="flex items-center justify-between gap-3">
        <Div className="flex min-w-0 items-baseline gap-2">
          <H2 className="m-0 border-0 pb-0 text-lg font-semibold tracking-tight">
            {kind ? t(`widget.titles.${kind}`) : t("widget.title")}
          </H2>
          {pagination && pagination.totalCount > 0 && (
            <Span className="text-sm tabular-nums text-muted-foreground">
              {t("widget.count", { count: pagination.totalCount })}
            </Span>
          )}
        </Div>
        {refetch && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-muted-foreground"
            title={t("widget.retry")}
            aria-label={t("widget.retry")}
            disabled={fetching}
            onClick={() => {
              void refetch();
            }}
          >
            <RefreshCw className={cn("size-4", fetching && "animate-spin")} />
          </Button>
        )}
      </Div>

      {failed ? (
        <Div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-5 py-10 text-center">
          <AlertTriangle className="size-5 text-destructive" />
          <P className="m-0 text-sm font-medium">{t("widget.error")}</P>
          <P className="m-0 text-xs text-muted-foreground">
            {response.message}
          </P>
          {refetch && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void refetch();
              }}
            >
              {t("widget.retry")}
            </Button>
          )}
        </Div>
      ) : !value ? (
        <LoadingGrid count={kind ? 2 : 3} />
      ) : items.length === 0 ? (
        <Div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-5 py-10 text-center">
          <Span className="inline-flex size-12 items-center justify-center rounded-xl border bg-background text-muted-foreground">
            <EmptyIcon className="size-5" />
          </Span>
          <Div className="flex flex-col gap-1">
            <P className="m-0 text-sm font-medium">{t("widget.emptyTitle")}</P>
            <P className="m-0 max-w-72 text-sm leading-relaxed text-muted-foreground">
              {t(kind ? "widget.emptyKindHint" : "widget.emptyHint")}
            </P>
          </Div>
          {!kind && (
            <Div className="flex flex-wrap justify-center gap-2 pt-1">
              {CREATE_KINDS.map((item) => {
                const Icon = KIND_ICONS[item];
                return (
                  <Link
                    key={item}
                    href={createHref(locale, item)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "gap-1.5",
                    )}
                  >
                    <Icon className="size-4" />
                    {t(`widget.kinds.${item}`)}
                  </Link>
                );
              })}
            </Div>
          )}
        </Div>
      ) : (
        <Div
          className={cn(
            "grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3",
            fetching && "opacity-80 transition-opacity",
          )}
        >
          {items.map((item) => (
            <HistoryCard key={item.id} item={item} showKind={!kind} />
          ))}
        </Div>
      )}

      {value && nextCursor && (
        <Div className="flex flex-col items-center gap-2 pt-1">
          {kind && !loadMoreError && (
            <LoadMoreSentinel
              onVisible={() => {
                void loadMore();
              }}
            />
          )}
          {loadMoreError && (
            <P className="m-0 text-sm text-destructive">
              {t("widget.loadMoreFailed")}
            </P>
          )}
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full gap-2 sm:w-auto"
            disabled={loadingMore}
            onClick={() => {
              void loadMore();
            }}
          >
            {loadingMore && <Loader2 className="size-4 animate-spin" />}
            {loadingMore
              ? t("widget.loadingMore")
              : loadMoreError
                ? t("widget.retry")
                : t("widget.loadMore")}
          </Button>
        </Div>
      )}
      {value && !nextCursor && loaded && (
        <P className="m-0 text-center text-sm text-muted-foreground">
          {t("widget.endOfList")}
        </P>
      )}
    </Div>
  );
}
