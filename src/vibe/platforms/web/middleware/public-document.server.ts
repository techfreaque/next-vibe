import "server-only";

import { getPathname, headers } from "next-vibe/ui/lib/headers";

import {
  DEGRADED_PUBLIC_DOCUMENT_HEADER,
  isPublicDocumentPath,
  VERIFIED_CRAWLER_HEADER,
} from "./public-document";

/** Outside a web request normal repository behavior applies. */
export async function isDegradedPublicDocument(): Promise<boolean> {
  try {
    const requestHeaders = await headers();
    return (
      requestHeaders.get(DEGRADED_PUBLIC_DOCUMENT_HEADER) === "1" &&
      isPublicDocumentPath(await getPathname())
    );
  } catch {
    return false;
  }
}

/** True only when middleware verified the caller as a known crawler for this page request. */
export async function isVerifiedCrawlerDocument(): Promise<boolean> {
  try {
    const requestHeaders = await headers();
    return requestHeaders.get(VERIFIED_CRAWLER_HEADER) === "1";
  } catch {
    return false;
  }
}
