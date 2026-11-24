export const CHROME_131_CRAWLER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
export const CHROME_131_CRAWLER_REFERRER_HOST = "google.com";
export const CHROME_131_CRAWLER_REFERRER_PATH = "/";

/** The crawler's only Fetch Metadata header is Sec-Fetch-Site. Chrome sends mode and destination too. */
export function matchesChrome131CrawlerHeaders(headers: Headers): boolean {
  if (
    headers.get("user-agent") !== CHROME_131_CRAWLER_UA ||
    !headers.get("accept")?.includes("text/html") ||
    headers.has("cookie") ||
    headers.has("sec-fetch-mode") ||
    headers.has("sec-fetch-dest") ||
    headers.has("sec-fetch-user") ||
    headers.has("sec-ch-ua") ||
    headers.has("rsc")
  ) {
    return false;
  }
  const referrer = headers.get("referer")?.replace(/\/$/, "");
  return (
    referrer === `https://${CHROME_131_CRAWLER_REFERRER_HOST}` ||
    referrer === `https://www.${CHROME_131_CRAWLER_REFERRER_HOST}`
  );
}
