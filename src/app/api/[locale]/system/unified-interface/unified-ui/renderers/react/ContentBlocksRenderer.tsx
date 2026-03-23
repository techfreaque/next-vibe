"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { ContentBlock } from "@/app/api/[locale]/shared/types/response.schema";

/**
 * Renders ContentResponse blocks (text + images) from tool results.
 * Used by ToolCallRenderer when a tool returns a ContentResponse
 * (e.g. browser take-screenshot returning a base64 PNG).
 */
export function ContentBlocksRenderer({
  blocks,
}: {
  blocks: ContentBlock[];
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-3">
      {blocks.map((block, index) => (
        <ContentBlockItem key={index} block={block} />
      ))}
    </Div>
  );
}

function ContentBlockItem({ block }: { block: ContentBlock }): JSX.Element {
  if (block.type === "text") {
    return <Span className="text-sm whitespace-pre-wrap">{block.text}</Span>;
  }

  // Image block - render base64 as data URI
  return <Base64Image data={block.data} mimeType={block.mimeType} />;
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
