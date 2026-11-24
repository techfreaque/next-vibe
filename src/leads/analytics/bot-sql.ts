import "server-only";

/**
 * One rule for "is this lead a bot, and which one".
 *
 * Every lead analytics report and the lead list filter classify the lead's
 * user agent with these SQL expressions, so a count in a report and the
 * drilled list always agree. Browser impersonation also uses lead attribution.
 * Order matters: the first matching family wins.
 *
 * Three classes, never two:
 * - bot: a known crawler, preview fetcher or automation client (BOT_FAMILIES),
 * - human: a browser user agent no pattern matched (BotFamily.HUMAN),
 * - unknown: no user agent recorded (BotFamily.NO_UA). Unknown is NOT a bot.
 *
 * The user agent and IP live in the typed columns on rows written by the
 * tracking endpoint, but the lead-id middleware (the path that creates almost
 * every production lead) historically stored them only in `metadata`
 * (`userAgent`, `ipAddress`). `leadUserAgentSql` / `leadIpSql` read both.
 */
import { type AnyColumn, type SQL, sql } from "drizzle-orm";
import { DeviceType } from "next-vibe/identity/lead/enum";

import { BotFamily, isBotFamily } from "./enum";

type BotFamilyValue = (typeof BotFamily)[keyof typeof BotFamily];

/** Families that are bots (everything except HUMAN and NO_UA). */
export const BOT_FAMILIES: readonly BotFamilyValue[] =
  Object.values(BotFamily).filter(isBotFamily);

/** `family` is a known bot (not human, not unknown). */
export function isBotFamilySql(family: SQL): SQL {
  return sql`(${family}) IN (${sql.join(
    BOT_FAMILIES.map((value) => sql`${value}`),
    sql`, `,
  )})`;
}

/** `family` is not a known bot (human or unknown). */
export function notBotFamilySql(family: SQL): SQL {
  return sql`(${family}) IN (${BotFamily.HUMAN}, ${BotFamily.NO_UA})`;
}

/**
 * Trimmed user agent of a `leads` row (alias), typed column first, then the
 * middleware's `metadata.userAgent`. NULL when neither holds a value.
 */
export function leadUserAgentSql(alias = "l"): SQL<string | null> {
  const a = sql.raw(alias);
  return sql<
    string | null
  >`coalesce(nullif(btrim(${a}.user_agent), ''), nullif(btrim(${a}.metadata->>'userAgent'), ''))`;
}

/** IP of a `leads` row (alias): typed column, then `metadata.ipAddress`. */
export function leadIpSql(alias = "l"): SQL<string | null> {
  const a = sql.raw(alias);
  return sql<
    string | null
  >`coalesce(nullif(btrim(${a}.ip_address), ''), nullif(btrim(${a}.metadata->>'ipAddress'), ''))`;
}

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
      "headlesschrome|phantomjs|puppeteer|playwright|selenium|webdriver|python-requests|python-urllib|^python/|aiohttp|httpx|^curl/|^wget/|go-http-client|node-fetch|undici|axios/|^bun/|^deno/|^java/|libwww|scrapy|httpclient|postmanruntime|guzzlehttp|lighthouse|gtmetrix|pingdom",
  },
  {
    family: BotFamily.OTHER_BOT,
    pattern:
      "[a-z0-9]{3,}bot\\y|\\ybot\\y|bot/|crawler|spider|slurp|crawling|uptime|monitor|scanner|archiver|validator|yandex|baiduspider|semrush|ahrefs|mj12|dotbot|petalbot|preview",
  },
];

/** Bot family key using the user agent and any corroborating automation evidence. */
export function botFamilySql(
  userAgent: AnyColumn | SQL,
  browserAutomation: SQL,
): SQL<string> {
  const cases = BOT_FAMILY_PATTERNS.map(
    ({ family, pattern }) =>
      sql`WHEN (${userAgent}) ~* ${pattern} THEN ${family}`,
  );
  return sql<string>`(CASE
    WHEN (${userAgent}) IS NULL OR btrim(${userAgent}) = '' THEN ${BotFamily.NO_UA}
    ${sql.join(cases, sql` `)}
    WHEN ${browserAutomation} THEN ${BotFamily.AUTOMATION}
    ELSE ${BotFamily.HUMAN}
  END)`;
}

/**
 * Device class of a lead, derived from the user agent with the same rules as
 * `parseLeadUserAgent` but with this file's bot families (known bots are BOT,
 * so the device split agrees with the bot split). The stored `device_type`
 * only counts when no user agent is recorded.
 */
export function leadDeviceSql(
  deviceType: SQL,
  userAgent: SQL,
  family: SQL,
): SQL<string> {
  return sql<string>`(CASE
    WHEN (${userAgent}) IS NULL THEN coalesce(${deviceType}, ${DeviceType.UNKNOWN})
    WHEN ${isBotFamilySql(family)} THEN ${DeviceType.BOT}
    WHEN (${userAgent}) ~* 'tablet|ipad' THEN ${DeviceType.TABLET}
    WHEN (${userAgent}) ~* 'mobile|android|iphone|ipod|blackberry|windows phone' THEN ${DeviceType.MOBILE}
    ELSE ${DeviceType.DESKTOP} END)`;
}

/**
 * Browser name (stored column, else derived like parseLeadUserAgent). NULL
 * when unrecognized: breakdowns show it as the translated "(none)".
 */
export function leadBrowserSql(
  browser: SQL,
  userAgent: SQL,
): SQL<string | null> {
  return sql<string | null>`coalesce(nullif(${browser}, 'Unknown'), CASE
    WHEN (${userAgent}) IS NULL THEN NULL
    WHEN (${userAgent}) ~* 'firefox' THEN 'Firefox'
    WHEN (${userAgent}) ~* 'edg/' THEN 'Edge'
    WHEN (${userAgent}) ~* 'opr/|opera' THEN 'Opera'
    WHEN (${userAgent}) ~* 'chrome' AND (${userAgent}) !~* 'chromium' THEN 'Chrome'
    WHEN (${userAgent}) ~* 'safari' THEN 'Safari'
    WHEN (${userAgent}) ~* 'msie|trident/' THEN 'Internet Explorer'
    ELSE NULL END)`;
}

/**
 * Operating system (stored column, else derived), NULL when unrecognized.
 * Older tracking rows stored the literal 'Unknown': folded to NULL too.
 */
export function leadOsSql(os: SQL, userAgent: SQL): SQL<string | null> {
  return sql<string | null>`coalesce(nullif(${os}, 'Unknown'), CASE
    WHEN (${userAgent}) IS NULL THEN NULL
    WHEN (${userAgent}) ~* 'windows nt' THEN 'Windows'
    WHEN (${userAgent}) ~* 'android' THEN 'Android'
    WHEN (${userAgent}) ~* 'iphone|ipad|ipod' THEN 'iOS'
    WHEN (${userAgent}) ~* 'mac os x|macos' THEN 'macOS'
    WHEN (${userAgent}) ~* 'linux' THEN 'Linux'
    WHEN (${userAgent}) ~* 'cros' THEN 'ChromeOS'
    ELSE NULL END)`;
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
