import "server-only";

import { getPathname, headers } from "next-vibe/ui/lib/headers";

import {
  DEGRADED_PUBLIC_DOCUMENT_HEADER,
  isPublicDocumentPath,
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
