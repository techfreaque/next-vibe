/**
 * Next.js `Metadata` → TanStack route `head()` bridge.
 *
 * Pages and layouts declare SEO metadata once, Next-style (`generateMetadata`
 * / `viewport`). The Next build renders it natively; on the TanStack/Vite path
 * the generated page route resolves the same metadata chain server-side
 * (root layout → nested layouts → page, shallow-merged like Next) and turns it
 * into serializable `meta`/`links` entries for `<HeadContent />`.
 *
 * Every page always resolves at least the root layout's metadata, so a real
 * `<title>` is emitted in `<head>` before any body content — an SVG icon's
 * `<title>` can never be the first title in the document.
 */

import type { Metadata, Viewport } from "next";

export type PageHeadMeta =
  | { title: string }
  | { charSet: "utf-8" }
  | { name: string; content: string; media?: string }
  | { property: string; content: string };

export interface PageHeadLink {
  rel: string;
  href: string;
  hrefLang?: string;
  title?: string;
  media?: string;
  type?: string;
}

export interface PageHead {
  meta: PageHeadMeta[];
  links: PageHeadLink[];
}

/** One segment's metadata, in root → page order. */
export type MetadataSource = () => Promise<Metadata> | Metadata;

type UrlLike = string | URL;

interface MediaDescriptor {
  url: UrlLike;
  secureUrl?: UrlLike | undefined;
  alt?: string | undefined;
  type?: string | undefined;
  width?: string | number | undefined;
  height?: string | number | undefined;
}

type MediaInput = UrlLike | MediaDescriptor;

interface AlternateDescriptor {
  title?: string | undefined;
  url: UrlLike;
}

type TitleInput = Metadata["title"];

/** Resolve a segment title against the inherited template (Next semantics). */
function resolveTitle(
  title: TitleInput,
  template: string | null,
): string | null {
  if (title === null || title === undefined) {
    return null;
  }
  if (typeof title === "string") {
    return template ? template.replace("%s", title) : title;
  }
  if ("absolute" in title) {
    return title.absolute;
  }
  return template ? template.replace("%s", title.default) : title.default;
}

function titleTemplate(title: TitleInput): string | null | undefined {
  if (title === null || title === undefined || typeof title === "string") {
    return undefined;
  }
  return "template" in title ? title.template : undefined;
}

function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function urlString(url: UrlLike): string {
  return typeof url === "string" ? url : url.toString();
}

function toDescriptor(media: MediaInput): MediaDescriptor {
  return typeof media === "string" || media instanceof URL
    ? { url: media }
    : media;
}

function robotsValue(robots: Metadata["robots"] | string): string | null {
  if (!robots) {
    return null;
  }
  if (typeof robots === "string") {
    return robots;
  }
  const values: string[] = [];
  if (robots.index) {
    values.push("index");
  } else if (typeof robots.index === "boolean") {
    values.push("noindex");
  }
  if (robots.follow) {
    values.push("follow");
  } else if (typeof robots.follow === "boolean") {
    values.push("nofollow");
  }
  const flags = [
    ["noarchive", robots.noarchive],
    ["nosnippet", robots.nosnippet],
    ["noimageindex", robots.noimageindex],
    ["nocache", robots.nocache],
    ["notranslate", robots.notranslate],
    ["indexifembedded", robots.indexifembedded],
    ["nositelinkssearchbox", robots.nositelinkssearchbox],
    ["unavailable_after", robots.unavailable_after],
    ["max-video-preview", robots["max-video-preview"]],
    ["max-image-preview", robots["max-image-preview"]],
    ["max-snippet", robots["max-snippet"]],
  ] as const;
  for (const [key, value] of flags) {
    if (value !== undefined && value !== false) {
      values.push(typeof value === "boolean" ? key : `${key}:${value}`);
    }
  }
  return values.join(", ");
}

function pushName(
  meta: PageHeadMeta[],
  name: string,
  content: string | number | null | undefined,
): void {
  if (content !== null && content !== undefined && content !== "") {
    meta.push({ name, content: String(content) });
  }
}

function pushProperty(
  meta: PageHeadMeta[],
  property: string,
  content: string | number | null | undefined,
): void {
  if (content !== null && content !== undefined && content !== "") {
    meta.push({ property, content: String(content) });
  }
}

function pushAlternates(
  links: PageHeadLink[],
  entries: Record<string, UrlLike | AlternateDescriptor[] | null | undefined>,
  attr: "hrefLang" | "media" | "type",
): void {
  for (const [key, value] of Object.entries(entries)) {
    if (value === null || value === undefined) {
      continue;
    }
    const descriptors: AlternateDescriptor[] = Array.isArray(value)
      ? value
      : [{ url: value }];
    for (const descriptor of descriptors) {
      links.push({
        rel: "alternate",
        href: urlString(descriptor.url),
        [attr]: key,
        ...(descriptor.title ? { title: descriptor.title } : {}),
      });
    }
  }
}

function openGraphTags(
  og: NonNullable<Metadata["openGraph"]>,
  meta: PageHeadMeta[],
): void {
  pushProperty(meta, "og:determiner", og.determiner);
  pushProperty(meta, "og:title", resolveTitle(og.title, null));
  pushProperty(meta, "og:description", og.description);
  pushProperty(meta, "og:url", og.url ? urlString(og.url) : null);
  pushProperty(meta, "og:site_name", og.siteName);
  pushProperty(meta, "og:locale", og.locale);
  pushProperty(meta, "og:country_name", og.countryName);
  pushProperty(meta, "og:ttl", og.ttl);
  for (const image of toArray<MediaInput>(og.images).map(toDescriptor)) {
    pushProperty(meta, "og:image", urlString(image.url));
    pushProperty(
      meta,
      "og:image:secure_url",
      image.secureUrl ? urlString(image.secureUrl) : null,
    );
    pushProperty(meta, "og:image:type", image.type);
    pushProperty(meta, "og:image:width", image.width);
    pushProperty(meta, "og:image:height", image.height);
    pushProperty(meta, "og:image:alt", image.alt);
  }
  for (const video of toArray<MediaInput>(og.videos).map(toDescriptor)) {
    pushProperty(meta, "og:video", urlString(video.url));
    pushProperty(meta, "og:video:type", video.type);
    pushProperty(meta, "og:video:width", video.width);
    pushProperty(meta, "og:video:height", video.height);
  }
  for (const audio of toArray<MediaInput>(og.audio).map(toDescriptor)) {
    pushProperty(meta, "og:audio", urlString(audio.url));
    pushProperty(meta, "og:audio:type", audio.type);
  }
  for (const alternate of toArray(og.alternateLocale)) {
    pushProperty(meta, "og:locale:alternate", alternate);
  }
  if ("type" in og) {
    pushProperty(meta, "og:type", og.type);
    if (og.type === "article") {
      pushProperty(meta, "article:published_time", og.publishedTime);
      pushProperty(meta, "article:modified_time", og.modifiedTime);
      pushProperty(meta, "article:expiration_time", og.expirationTime);
      for (const author of toArray(og.authors)) {
        pushProperty(meta, "article:author", urlString(author));
      }
      pushProperty(meta, "article:section", og.section);
      for (const tag of toArray(og.tags)) {
        pushProperty(meta, "article:tag", tag);
      }
    }
  }
}

function twitterTags(
  twitter: NonNullable<Metadata["twitter"]>,
  meta: PageHeadMeta[],
): void {
  const images = toArray<MediaInput>(twitter.images).map(toDescriptor);
  const card =
    "card" in twitter
      ? twitter.card
      : images.length > 0
        ? "summary_large_image"
        : "summary";
  pushName(meta, "twitter:card", card);
  pushName(meta, "twitter:site", twitter.site);
  pushName(meta, "twitter:site:id", twitter.siteId);
  pushName(meta, "twitter:creator", twitter.creator);
  pushName(meta, "twitter:creator:id", twitter.creatorId);
  pushName(meta, "twitter:title", resolveTitle(twitter.title, null));
  pushName(meta, "twitter:description", twitter.description);
  for (const image of images) {
    pushName(meta, "twitter:image", urlString(image.url));
    pushName(meta, "twitter:image:alt", image.alt);
  }
}

/** Convert resolved (merged) Next metadata into TanStack head entries. */
export function metadataToHead(
  metadata: Metadata,
  title: string | null,
): PageHead {
  const meta: PageHeadMeta[] = [];
  const links: PageHeadLink[] = [];

  if (title) {
    meta.push({ title });
  }
  pushName(meta, "description", metadata.description);
  pushName(meta, "application-name", metadata.applicationName);
  for (const author of toArray(metadata.authors)) {
    if (author.url) {
      links.push({ rel: "author", href: urlString(author.url) });
    }
    pushName(meta, "author", author.name);
  }
  if (metadata.manifest) {
    links.push({ rel: "manifest", href: urlString(metadata.manifest) });
  }
  pushName(meta, "generator", metadata.generator);
  const keywords = toArray(metadata.keywords);
  pushName(meta, "keywords", keywords.length ? keywords.join(",") : null);
  pushName(meta, "referrer", metadata.referrer);
  pushName(meta, "creator", metadata.creator);
  pushName(meta, "publisher", metadata.publisher);
  pushName(meta, "robots", robotsValue(metadata.robots));
  if (metadata.robots && typeof metadata.robots !== "string") {
    pushName(meta, "googlebot", robotsValue(metadata.robots.googleBot));
  }
  pushName(meta, "abstract", metadata.abstract);

  const alternates = metadata.alternates;
  if (alternates) {
    const canonical = alternates.canonical;
    if (canonical) {
      const descriptor: AlternateDescriptor =
        typeof canonical === "string" || canonical instanceof URL
          ? { url: canonical }
          : canonical;
      links.push({
        rel: "canonical",
        href: urlString(descriptor.url),
        ...(descriptor.title ? { title: descriptor.title } : {}),
      });
    }
    if (alternates.languages) {
      pushAlternates(links, alternates.languages, "hrefLang");
    }
    if (alternates.media) {
      pushAlternates(links, alternates.media, "media");
    }
    if (alternates.types) {
      pushAlternates(links, alternates.types, "type");
    }
  }

  pushName(meta, "category", metadata.category);
  pushName(meta, "classification", metadata.classification);

  const formatDetection = metadata.formatDetection;
  if (formatDetection) {
    const disabled = (
      ["telephone", "date", "address", "email", "url"] as const
    ).filter((key) => formatDetection[key] === false);
    pushName(
      meta,
      "format-detection",
      disabled.length ? disabled.map((key) => `${key}=no`).join(", ") : null,
    );
  }

  const verification = metadata.verification;
  if (verification) {
    for (const value of toArray(verification.google)) {
      pushName(meta, "google-site-verification", value);
    }
    for (const value of toArray(verification.yandex)) {
      pushName(meta, "yandex-verification", value);
    }
  }

  if (metadata.openGraph) {
    openGraphTags(metadata.openGraph, meta);
  }
  if (metadata.twitter) {
    twitterTags(metadata.twitter, meta);
  }

  if (metadata.other) {
    for (const [name, value] of Object.entries(metadata.other)) {
      for (const content of toArray(value)) {
        pushName(meta, name, content);
      }
    }
  }

  return { meta, links };
}

/**
 * Resolve a metadata chain (root layout → … → page) into head entries.
 * Segments resolve in parallel; merging is shallow and child-wins per
 * top-level key, exactly like Next's metadata resolution. Title templates
 * declared by a parent apply to child string titles.
 */
export async function resolvePageHead(
  sources: MetadataSource[],
): Promise<PageHead> {
  const segments = await Promise.all(sources.map((source) => source()));
  let merged: Metadata = {};
  let template: string | null = null;
  let title: string | null = null;
  for (const segment of segments) {
    if (segment.title !== undefined) {
      title = resolveTitle(segment.title, template);
    }
    const nextTemplate = titleTemplate(segment.title);
    if (nextTemplate !== undefined) {
      template = nextTemplate;
    }
    merged = { ...merged, ...segment };
  }
  return metadataToHead(merged, title);
}

/** `viewport` export → theme-color / color-scheme meta (Next semantics). */
export function viewportToHead(viewport: Viewport): PageHeadMeta[] {
  const meta: PageHeadMeta[] = [];
  const themeColor = viewport.themeColor;
  if (typeof themeColor === "string") {
    meta.push({ name: "theme-color", content: themeColor });
  } else {
    for (const descriptor of toArray(themeColor)) {
      meta.push({
        name: "theme-color",
        content: descriptor.color,
        ...(descriptor.media ? { media: descriptor.media } : {}),
      });
    }
  }
  pushName(meta, "color-scheme", viewport.colorScheme);
  return meta;
}
