import { expect, test } from "bun:test";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { guideCards } from "./guide-links";
import { getBlogPostCard, listBlogPostCards } from "./posts-cards";

const locales: CountryLanguage[] = ["en-US", "de-DE", "pl-PL"];

test.each(locales)("localized post lookups match the index in %s", (locale) => {
  const index = listBlogPostCards(locale);
  for (const card of index) {
    expect(getBlogPostCard(card.slug, locale)).toEqual(card);
  }
  const recent = index.slice(0, 3).reverse();
  expect(guideCards(locale, recent.map((card) => card.slug))).toEqual(recent);
});
