/**
 * GET /models-changelog.xml - RSS feed of the public model changelog (root
 * route, served outside [locale] on Next and TanStack; shells are generated
 * from src/_pages/_root/<file>/root-route.ts). `?locale=de-DE` (or `?locale=de`)
 * returns the feed in another site locale; default is generic English.
 */

import { getEnvAvailability } from "next-vibe/agent/env-availability";

import { configScopedTranslation } from "@/env/i18n";

import { resolveLlmsLocale } from "../llms.txt/build-llms";
import { buildModelChangelogFeed } from "./build-feed";

/** Never prerender: the build has no provider keys, so links would be missing. */
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const locale = resolveLlmsLocale(
    new URL(request.url).searchParams.get("locale"),
  );
  const { t } = configScopedTranslation.scopedT(locale);
  const xml = buildModelChangelogFeed(
    locale,
    await getEnvAvailability(),
    t("websiteUrl"),
  );
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
