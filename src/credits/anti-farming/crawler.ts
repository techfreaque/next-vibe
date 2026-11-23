import type { EndpointLogger } from "next-vibe/logger/types";

import { BOT_FAMILY_PATTERNS } from "@/leads/analytics/bot-sql";
import { BotFamily } from "@/leads/analytics/enum";

import { protectionEnv } from "./env";
import { recordAntiFarmingEvent } from "./events";

const crawlerPatterns = BOT_FAMILY_PATTERNS.filter(
  ({ family }) => family !== BotFamily.AUTOMATION,
).map(({ pattern }) => new RegExp(pattern.replaceAll("\\y", "\\b"), "i"));
const incidentBrowser =
  /^Mozilla\/5\.0 \(Macintosh; Intel Mac OS X 10_15_7\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) Chrome\/(142|158)\.0\.0\.0 Safari\/537\.36$/i;

export function crawlerUserAgent(ua: string | null): boolean {
  return (
    !!ua &&
    (/headlesschrome/i.test(ua) ||
      incidentBrowser.test(ua) ||
      crawlerPatterns.some((pattern) => pattern.test(ua)))
  );
}

/** Called only when a request would otherwise create an anonymous identity. */
export async function skipCrawlerLead(
  ua: string | null,
  logger: EndpointLogger,
): Promise<boolean> {
  const mode = protectionEnv.FREE_CRAWLER_MODE;
  if (mode === "off" || !crawlerUserAgent(ua)) {
    return false;
  }
  if (mode === "shadow") {
    await recordAntiFarmingEvent({ kind: "shadow_crawler" }, logger);
    return false;
  }
  return true;
}
