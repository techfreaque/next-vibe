/**
 * Shared uncensored-model rows for the blog posts that list them (no GPU,
 * uncensored API, jailbreak alternative). Every value comes from the model
 * registry at render time: which uncensored models are live on this
 * instance, how each was made, context window, parameter count, tool support
 * and the reference price per message. Nothing about a model is typed in copy.
 */

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
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
  getModelFacts,
  listModelFacts,
  OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
} from "@/_pages/models/_shared/model-facts";
import {
  chatHref,
  formatMoney,
  isApiCallable,
  modelHref,
  type UncensoredKind,
  uncensoredKind,
} from "@/_pages/models/_shared/model-format";
import { scopedTranslation as modelsScopedTranslation } from "@/_pages/models/i18n";

import { ArticleScroll, InlineCode } from "../_shared/article";

export interface UncensoredRow {
  id: string;
  slug: string;
  name: string;
  kind: UncensoredKind;
  contextWindow: number;
  creditsPerMessage: number;
  /** Formatted money value of one reference message. */
  messagePrice: string;
  /** Billions, when the registry knows it. */
  parameterCount: number | null;
  supportsTools: boolean;
  apiCallable: boolean;
  chatHref: string;
}

/** Current uncensored chat models on this instance, cheapest first. */
export async function loadUncensoredRows(
  locale: CountryLanguage,
): Promise<UncensoredRow[]> {
  const availability = await getEnvAvailability();
  return listModelFacts(availability)
    .filter((facts) => !facts.isLegacy && isUncensoredContent(facts.content))
    .toSorted(
      (a, b) =>
        a.creditsPerMessage - b.creditsPerMessage ||
        a.name.localeCompare(b.name),
    )
    .map((facts) => ({
      id: facts.id,
      slug: facts.slug,
      name: facts.name.trim(),
      kind: uncensoredKind(facts) ?? "unlisted",
      contextWindow: facts.contextWindow,
      creditsPerMessage: facts.creditsPerMessage,
      messagePrice: formatMoney(facts.creditsPerMessage, locale),
      parameterCount: facts.parameterCount,
      supportsTools: facts.supportsTools,
      apiCallable: isApiCallable(facts),
      chatHref: chatHref(locale, facts),
    }));
}

export interface ComparePair {
  a: { slug: string; name: string };
  b: { slug: string; name: string };
}

/** Compare-page pairs whose two sides are both live and current. */
export async function loadComparePairs(
  pairs: readonly (readonly [ChatModelId, ChatModelId])[],
): Promise<ComparePair[]> {
  const availability = await getEnvAvailability();
  return pairs.flatMap(([aId, bId]): ComparePair[] => {
    const a = getModelFacts(aId, availability);
    const b = getModelFacts(bId, availability);
    if (a === null || b === null || a.isLegacy || b.isLegacy) {
      return [];
    }
    return [
      {
        a: { slug: a.slug, name: a.name.trim() },
        b: { slug: b.slug, name: b.name.trim() },
      },
    ];
  });
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
  | "tools"
  | "price"
  | "chat";

export interface UncensoredTableLabels {
  model: string;
  params?: string;
  memory?: string;
  apiId?: string;
  context: string;
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
                    {modelsT(`uncensoredKind.${row.kind}.name`)}
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
