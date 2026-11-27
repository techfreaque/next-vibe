/**
 * Commercial use at a glance: every media model grouped by its license status
 * and reason, plus the AI-output section of the terms. Built only from the
 * per-model labels (models/commercial-use) and the existing terms text, so it
 * adds no legal wording of its own. Used on the /create tool pages and /models.
 */

import {
  CommercialUse,
  type CommercialUseInfo,
  commercialUseTermsHref,
} from "next-vibe/agent/models/commercial-use/enum";
import { scopedTranslation as commercialUseTranslation } from "next-vibe/agent/models/commercial-use/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { Summary } from "next-vibe/ui/components/summary";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { scopedTranslation as termsTranslation } from "../../story/terms-of-service/i18n";
import { scopedTranslation } from "../i18n";
import type { CreateKind } from "./create-kinds";

export interface CommercialUseRow {
  id: string;
  name: string;
  kind: CreateKind;
  info: CommercialUseInfo;
  /** Public model page, when there is one. */
  href: string | null;
}

/** Restricted first: that is what a buyer needs to see before using output. */
const STATUS_ORDER = [
  CommercialUse.RESTRICTED,
  CommercialUse.UNCLEAR,
  CommercialUse.ALLOWED,
] as const;

const STATUS_DOT = {
  [CommercialUse.RESTRICTED]: "bg-amber-500",
  [CommercialUse.UNCLEAR]: "bg-muted-foreground/60",
  [CommercialUse.ALLOWED]: "bg-emerald-500",
};

interface ReasonGroup {
  reason: CommercialUseInfo["reason"];
  rows: CommercialUseRow[];
}

function groupByReason(rows: CommercialUseRow[]): ReasonGroup[] {
  const groups = new Map<CommercialUseInfo["reason"], CommercialUseRow[]>();
  for (const row of rows) {
    groups.set(row.info.reason, [...(groups.get(row.info.reason) ?? []), row]);
  }
  return [...groups].map(([reason, items]) => ({
    reason,
    rows: items.toSorted((a, b) => a.name.localeCompare(b.name)),
  }));
}

export function CommercialUseOverview({
  locale,
  rows,
  showKind = false,
  open = false,
  className,
}: {
  locale: CountryLanguage;
  rows: CommercialUseRow[];
  /** Name the media type next to each model (pages that mix types). */
  showKind?: boolean;
  open?: boolean;
  className?: string;
}): JSX.Element | null {
  if (rows.length === 0) {
    return null;
  }
  const { t } = scopedTranslation.scopedT(locale);
  const { t: usageT } = commercialUseTranslation.scopedT(locale);
  const { t: termsT } = termsTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const unique = [...new Map(rows.map((row) => [row.id, row])).values()];
  const byStatus = STATUS_ORDER.map((status) => ({
    status,
    rows: unique.filter((row) => row.info.status === status),
  })).filter((group) => group.rows.length > 0);
  const allowed = unique.filter(
    (row) => row.info.status === CommercialUse.ALLOWED,
  ).length;
  return (
    <Section
      id="commercial-use"
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      <Div className="flex flex-col gap-1.5">
        <H2 className="m-0 border-0 pb-0 text-lg font-semibold tracking-tight">
          {t("commercialUse.title")}
        </H2>
        <P className="m-0 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("commercialUse.intro")}
        </P>
      </Div>

      <Div className="flex flex-wrap gap-2">
        {byStatus.map((group) => (
          <Span
            key={group.status}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
          >
            <Span
              aria-hidden={true}
              className={cn("size-2 rounded-full", STATUS_DOT[group.status])}
            />
            {usageT(group.status)}
            <Span className="tabular-nums font-semibold">
              {group.rows.length}
            </Span>
          </Span>
        ))}
      </Div>

      <Details
        open={open}
        className="group rounded-xl border bg-card [&_summary::-webkit-details-marker]:hidden"
      >
        <Summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 text-sm font-medium">
          {t("commercialUse.showAll", {
            count: unique.length,
            allowed,
          })}
          <ChevronDown
            aria-hidden={true}
            className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          />
        </Summary>
        <Div className="flex flex-col gap-5 border-t px-4 py-4">
          {byStatus.map((group) => (
            <Div key={group.status} className="flex flex-col gap-3">
              <H3 className="m-0 flex items-center gap-2 text-sm font-semibold">
                <Span
                  aria-hidden={true}
                  className={cn(
                    "size-2 rounded-full",
                    STATUS_DOT[group.status],
                  )}
                />
                {usageT(group.status)}
              </H3>
              {groupByReason(group.rows).map((reasonGroup) => (
                <Div
                  key={reasonGroup.reason}
                  className="flex flex-col gap-2 pl-4"
                >
                  <P className="m-0 text-sm text-muted-foreground">
                    {usageT(reasonGroup.reason)}
                  </P>
                  <Div className="flex flex-wrap gap-1.5">
                    {reasonGroup.rows.map((row) => {
                      const label = showKind
                        ? `${row.name} · ${t(`kinds.${row.kind}.label`)}`
                        : row.name;
                      return row.href ? (
                        <Link
                          key={row.id}
                          href={row.href}
                          className="rounded-md border bg-background px-2 py-1 text-xs font-medium hover:border-primary hover:text-primary"
                        >
                          {label}
                        </Link>
                      ) : (
                        <Span
                          key={row.id}
                          className="rounded-md border bg-background px-2 py-1 text-xs font-medium"
                        >
                          {label}
                        </Span>
                      );
                    })}
                  </Div>
                </Div>
              ))}
            </Div>
          ))}
        </Div>
      </Details>

      <Div className="flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">
        <P className="m-0">
          {termsT("sections.aiOutput.ownership", {
            appName: configT("appName"),
          })}
        </P>
        <P className="m-0">{termsT("sections.aiOutput.licenses")}</P>
        <P className="m-0">{termsT("sections.aiOutput.copyright")}</P>
        <Link
          href={commercialUseTermsHref(locale)}
          className="w-fit font-medium text-primary underline-offset-4 hover:underline"
        >
          {usageT("termsLink")}
        </Link>
      </Div>
    </Section>
  );
}
