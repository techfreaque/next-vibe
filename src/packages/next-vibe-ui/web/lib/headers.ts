/**
 * Web (Next.js) implementation of server-side cookie/header access.
 * Re-exports cookies() and headers() from next/headers.
 */
export { cookies, headers } from "next/headers";

export async function getPathname(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  return h.get("x-pathname") ?? h.get("next-url") ?? "";
}
