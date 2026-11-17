/**
 * Plain link list of every public model page (chat incl. legacy, image,
 * video, music, voice) for the models index. The interactive catalog only
 * renders the active tab and hides legacy rows until toggled, so without this
 * list crawlers would never reach most model pages from the index.
 * Server-rendered markup inside a native <details>: no client logic, and the
 * links stay in the HTML while the list is collapsed.
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { Li } from "next-vibe/ui/components/li";
import { Link } from "next-vibe/ui/components/link";
import { Summary } from "next-vibe/ui/components/summary";
import { H3, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import type { JSX } from "react";

import { CONTAINER } from "../../story/_shared/marketing";
import { scopedTranslation } from "../i18n";
import {
  CATALOG_TYPE_ORDER,
  type CatalogType,
  listAllCatalogEntries,
} from "./model-catalog-entries";
import { modelHref } from "./model-format";

export interface DirectoryGroup {
  type: CatalogType;
  links: { slug: string; name: string }[];
}

/** Every catalog row that has a public page, per type, alphabetical. */
export function buildModelDirectory(
  availability: AgentEnvAvailability,
): DirectoryGroup[] {
  const all = listAllCatalogEntries({ availability });
  const groups: DirectoryGroup[] = [];
  for (const type of CATALOG_TYPE_ORDER) {
    const links: { slug: string; name: string }[] = [];
    for (const entry of all[type] ?? []) {
      if (entry.slug !== null && !links.some((l) => l.slug === entry.slug)) {
        links.push({ slug: entry.slug, name: entry.name });
      }
    }
    if (links.length > 0) {
      groups.push({
        type,
        links: links.toSorted((a, b) => a.name.localeCompare(b.name)),
      });
    }
  }
  return groups;
}

export function ModelDirectory({
  locale,
  groups,
}: {
  locale: CountryLanguage;
  groups: DirectoryGroup[];
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const count = groups.reduce((sum, group) => sum + group.links.length, 0);
  return (
    <Div className={`${CONTAINER} pb-12 md:pb-16`}>
      <Details
        className="group rounded-xl border border-border bg-card"
        id="model-directory"
      >
        <Summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-5 py-4 text-base font-semibold">
          {t("directory.heading")}
        </Summary>
        <Div className="flex flex-col gap-8 border-t border-border px-5 py-6">
          <P className="m-0 text-sm text-muted-foreground">
            {t("directory.intro", { count })}
          </P>
          {groups.map((group) => (
            <Div key={group.type} className="flex flex-col gap-3">
              <H3 className="m-0 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t(`catalog.types.${group.type}`)}
              </H3>
              <Ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-1 p-0 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {group.links.map((link) => (
                  <Li key={link.slug}>
                    <Link
                      href={modelHref(locale, link.slug)}
                      className="text-foreground hover:text-primary hover:underline"
                    >
                      {link.name}
                    </Link>
                  </Li>
                ))}
              </Ul>
            </Div>
          ))}
        </Div>
      </Details>
    </Div>
  );
}
