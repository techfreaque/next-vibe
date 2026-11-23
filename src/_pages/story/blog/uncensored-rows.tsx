/**
 * Shared model rows for the blog posts that list models (no GPU, uncensored
 * API, jailbreak alternative, writer, best LLM, no sign-up, unbiased). Every
 * value comes from the model registry at render time: which models are live
 * on this instance, tier, how an uncensored one was made, context window,
 * parameter count, strengths, tool support and the reference price per
 * message. Nothing about a model is typed in copy.
 *
 * Client-safe: rows, the table and pure helpers only. The loaders read the
 * instance's env availability (server-only) and live in
 * ./uncensored-rows-data, imported by page loaders only.
 */

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import type { JSX } from "react";

import {
  formatTokenCount,
  OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
} from "@/_pages/models/_shared/model-facts";
import {
  formatNumber,
  modelHref,
  type UncensoredKind,
} from "@/_pages/models/_shared/model-format";
import { scopedTranslation as modelsScopedTranslation } from "@/_pages/models/i18n";

import { ArticleScroll, InlineCode } from "../_shared/article";

export interface UncensoredRow {
  id: string;
  slug: string;
  name: string;
  /** How an uncensored model was made; null outside the uncensored tier. */
  kind: UncensoredKind | null;
  /** Localized content tier name (mainstream, open, uncensored). */
  tier: string;
  contextWindow: number;
  /** Context window as printed pages of prose. */
  contextPages: number;
  creditsPerMessage: number;
  /** Formatted money value of one reference message. */
  messagePrice: string;
  /** Billions, when the registry knows it. */
  parameterCount: number | null;
  /** Registry strengths (ModelUtility values), registry order. */
  strengths: string[];
  /** Localized, comma-separated strengths. */
  strengthText: string;
  supportsTools: boolean;
  apiCallable: boolean;
  chatHref: string;
}

/** The first row among `rows` whose id is in `ids` (preference order). */
export function pickRow(
  rows: readonly UncensoredRow[],
  ids: readonly ChatModelId[],
): UncensoredRow | undefined {
  for (const id of ids) {
    const row = rows.find((candidate) => candidate.id === id);
    if (row !== undefined) {
      return row;
    }
  }
  return undefined;
}

export interface ComparePair {
  a: { slug: string; name: string };
  b: { slug: string; name: string };
  /** Canonical locale-less compare path ("/models/compare/<a>/<b>"). */
  path: string;
}

/** The own-worldview model (UncensoredLM) among the rows, if it is live. */
export function findOwnWorldviewRow(
  rows: readonly UncensoredRow[],
): UncensoredRow | undefined {
  return rows.find((row) => row.id === OWN_WORLDVIEW_UNCENSORED_MODEL_ID);
}

/** Gigabytes of weights at a given bit width: parameters x bits / 8. */
export function weightGigabytes(
  parameterBillions: number,
  bits: number,
): number {
  return Math.ceil((parameterBillions * bits) / 8);
}

const LINK_CLASS =
  "font-medium text-primary underline-offset-4 hover:underline";

export type UncensoredColumn =
  | "params"
  | "memory"
  | "apiId"
  | "context"
  | "pages"
  | "strengths"
  | "tools"
  | "price"
  | "chat";

export interface UncensoredTableLabels {
  model: string;
  params?: string;
  memory?: string;
  apiId?: string;
  context: string;
  pages?: string;
  strengths?: string;
  tools?: string;
  price: string;
  chat?: string;
  /** "Chat with {{model}}" style label, already interpolated per row. */
  chatLink?: (name: string) => string;
  yes?: string;
  no?: string;
  /** Shown in the params/memory cells when the count is not published. */
  unknown?: string;
  /** "{{q4}} GB / {{q8}} GB" style label for the memory cell. */
  memoryValue?: (q4: number, q8: number) => string;
  /** "about {{count}} pages" style label for the pages cell. */
  pagesValue?: (pages: string) => string;
  /** "{{count}}B" style label for the params cell. */
  paramsValue?: (billions: number) => string;
}

export function UncensoredModelTable({
  rows,
  columns,
  labels,
  locale,
}: {
  rows: readonly UncensoredRow[];
  columns: readonly UncensoredColumn[];
  labels: UncensoredTableLabels;
  locale: CountryLanguage;
}): JSX.Element {
  const { t: modelsT } = modelsScopedTranslation.scopedT(locale);
  const header = (column: UncensoredColumn): string => labels[column] ?? "";
  const cell = (row: UncensoredRow, column: UncensoredColumn): JSX.Element => {
    switch (column) {
      case "params":
        return (
          <>
            {row.parameterCount === null
              ? (labels.unknown ?? "")
              : (labels.paramsValue?.(row.parameterCount) ??
                String(row.parameterCount))}
          </>
        );
      case "memory":
        return (
          <>
            {row.parameterCount === null
              ? (labels.unknown ?? "")
              : (labels.memoryValue?.(
                  weightGigabytes(row.parameterCount, 4),
                  weightGigabytes(row.parameterCount, 8),
                ) ?? "")}
          </>
        );
      case "apiId":
        return <InlineCode>{row.id}</InlineCode>;
      case "context":
        return <>{formatTokenCount(row.contextWindow)}</>;
      case "pages": {
        const pages = formatNumber(row.contextPages, locale);
        return <>{labels.pagesValue?.(pages) ?? pages}</>;
      }
      case "strengths":
        return <>{row.strengthText}</>;
      case "tools":
        return <>{row.supportsTools ? labels.yes : labels.no}</>;
      case "price":
        return <>{row.messagePrice}</>;
      case "chat":
        return (
          <Link href={row.chatHref} className={LINK_CLASS}>
            {labels.chatLink?.(row.name) ?? row.name}
          </Link>
        );
    }
  };

  return (
    <ArticleScroll>
      <Div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table className="min-w-[40rem]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                {labels.model}
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="text-xs font-semibold uppercase tracking-wide"
                >
                  {header(column)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} data-model={row.id}>
                <TableCell className="align-top">
                  <Link
                    href={modelHref(locale, row.slug)}
                    className={LINK_CLASS}
                  >
                    {row.name}
                  </Link>
                  <Span className="block text-xs text-muted-foreground">
                    {row.kind === null
                      ? row.tier
                      : modelsT(`uncensoredKind.${row.kind}.name`)}
                  </Span>
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    className="align-top text-sm tabular-nums text-muted-foreground"
                  >
                    {cell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Div>
    </ArticleScroll>
  );
}
