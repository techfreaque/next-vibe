"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { ContentBlock } from "@/app/api/[locale]/shared/types/response.schema";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";

/**
 * Renders ContentResponse blocks (text + images) from tool results.
 * Used by ToolCallRenderer when a tool returns a ContentResponse
 * (e.g. browser take-screenshot returning a base64 PNG).
 * CLI/MCP platforms skip inline image rendering (no DOM available).
 */
export function ContentBlocksRenderer({
  blocks,
  platform,
}: {
  blocks: ContentBlock[];
  platform?: Platform;
}): JSX.Element {
  const isCli = platform === Platform.CLI || platform === Platform.CLI_PACKAGE;

  return (
    <Div className="flex flex-col gap-3">
      {blocks.map((block, index) => (
        <ContentBlockItem key={index} block={block} isCli={isCli} />
      ))}
    </Div>
  );
}

function ContentBlockItem({
  block,
  isCli,
}: {
  block: ContentBlock;
  isCli: boolean;
}): JSX.Element {
  if (block.type === "text") {
    return <Span className="text-sm whitespace-pre-wrap">{block.text}</Span>;
  }

  if (block.type === "image_url") {
    return <UrlImage url={block.url} />;
  }

  if (isCli) {
    // CLI has no DOM — show a placeholder instead of crashing on next/image
    const sizeKb = Math.round((block.data.length * 3) / 4 / 1024);
    return (
      <Span className="text-sm text-muted-foreground">
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        {`[image: ${block.mimeType}, ~${sizeKb}KB]`}
      </Span>
    );
  }

  // Image block - render base64 as data URI
  return <Base64Image data={block.data} mimeType={block.mimeType} />;
}

/**
 * Renders an image from a URL (e.g. uploaded storage URLs from screenshot tools).
 */
function UrlImage({ url }: { url: string }): JSX.Element {
  return (
    <Div className="rounded-md overflow-hidden border border-border/50">
      <Image
        src={url}
        alt=""
        width={1280}
        height={720}
        unoptimized
        className="max-w-full h-auto"
      />
    </Div>
  );
}

/**
 * Renders a base64-encoded image using a data URI.
 * Uses unoptimized mode since Next.js Image can't optimize data URIs.
 */
function Base64Image({
  data,
  mimeType,
}: {
  data: string;
  mimeType: string;
}): JSX.Element {
  const src = `data:${mimeType};base64,${data}`;

  return (
    <Div className="rounded-md overflow-hidden border border-border/50">
      <Image
        src={src}
        alt=""
        width={1280}
        height={720}
        unoptimized
        className="max-w-full h-auto"
      />
    </Div>
  );
}
