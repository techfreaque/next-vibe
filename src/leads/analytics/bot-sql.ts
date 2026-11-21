import "server-only";

/**
 * One rule for "is this lead a bot, and which one".
 *
 * Every lead analytics report and the lead list filter classify
 * `leads.user_agent` with these SQL expressions, so a count in a report and
 * the drilled list always agree. Order matters: the first matching family wins.
 */
import { type AnyColumn, type SQL, sql } from "drizzle-orm";

import { BotFamily } from "./enum";

/** Case-insensitive POSIX patterns per family, checked in this order. */
export const BOT_FAMILY_PATTERNS: ReadonlyArray<{
  family: (typeof BotFamily)[keyof typeof BotFamily];
  pattern: string;
}> = [
  {
    family: BotFamily.META,
    pattern:
      "facebookexternalhit|meta-externalagent|meta-externalfetcher|meta-webindexer|facebookcatalog|facebookbot",
  },
  {
    family: BotFamily.OPENAI,
    pattern: "gptbot|chatgpt-user|oai-searchbot",
  },
  {
    family: BotFamily.ANTHROPIC,
    pattern: "claudebot|claude-web|claude-user|claude-searchbot|anthropic-ai",
  },
  {
    family: BotFamily.PERPLEXITY,
    pattern: "perplexitybot|perplexity-user",
  },
  {
    family: BotFamily.OTHER_AI,
    pattern:
      "ccbot|bytespider|amazonbot|applebot|cohere-ai|youbot|diffbot|ai2bot|duckassistbot|mistralai-user|timpibot|imagesiftbot|omgili",
  },
  {
    family: BotFamily.GOOGLE,
    pattern:
      "googlebot|google-inspectiontool|googleother|adsbot-google|mediapartners-google|storebot-google|apis-google|feedfetcher-google|google-read-aloud|google-site-verification",
  },
  {
    family: BotFamily.BING,
    pattern: "bingbot|bingpreview|msnbot|adidxbot",
  },
  {
    family: BotFamily.SOCIAL_PREVIEW,
    pattern:
      "twitterbot|slackbot|slack-imgproxy|discordbot|telegrambot|whatsapp|linkedinbot|skypeuripreview|redditbot|pinterest|embedly|vkshare|iframely|mastodon|bluesky|cardyb",
  },
  {
    family: BotFamily.AUTOMATION,
    pattern:
      "headlesschrome|phantomjs|puppeteer|playwright|selenium|webdriver|python-requests|python-urllib|aiohttp|httpx|^curl/|^wget/|go-http-client|node-fetch|undici|axios/|^java/|libwww|scrapy|httpclient|postmanruntime|guzzlehttp|lighthouse|gtmetrix|pingdom",
  },
  {
    family: BotFamily.OTHER_BOT,
    pattern:
      "[a-z0-9]{3,}bot\\y|\\ybot\\y|bot/|crawler|spider|slurp|crawling|uptime|monitor|scanner|archiver|validator|yandex|baiduspider|semrush|ahrefs|mj12|dotbot|petalbot|preview",
  },
];

/** Bot family key (BotFamily value) of a user agent expression. */
export function botFamilySql(userAgent: AnyColumn | SQL): SQL<string> {
  const cases = BOT_FAMILY_PATTERNS.map(
    ({ family, pattern }) =>
      sql`WHEN (${userAgent}) ~* ${pattern} THEN ${family}`,
  );
  return sql<string>`(CASE
    WHEN (${userAgent}) IS NULL OR btrim(${userAgent}) = '' THEN ${BotFamily.NO_UA}
    ${sql.join(cases, sql` `)}
    ELSE ${BotFamily.HUMAN}
  END)`;
}

/** /24 network for IPv4 (incl. IPv4-mapped IPv6), /48 for IPv6, else NULL. */
export function ipPrefixSql(ip: AnyColumn | SQL): SQL<string | null> {
  const bare = sql`regexp_replace(btrim(${ip}), '^::ffff:', '', 'i')`;
  return sql<string | null>`(CASE
    WHEN (${ip}) IS NULL OR NOT pg_input_is_valid(${bare}, 'inet') THEN NULL
    WHEN family((${bare})::inet) = 4 THEN network(set_masklen((${bare})::inet, 24))::text
    ELSE network(set_masklen((${bare})::inet, 48))::text
  END)`;
}

/** Short stable fingerprint of the exact user agent string (NULL when absent). */
export function uaFingerprintSql(
  userAgent: AnyColumn | SQL,
): SQL<string | null> {
  return sql<string | null>`(CASE
    WHEN (${userAgent}) IS NULL OR btrim(${userAgent}) = '' THEN NULL
    ELSE left(md5(lower(btrim(${userAgent}))), 10)
  END)`;
}
