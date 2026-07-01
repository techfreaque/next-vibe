import "server-only";

import { notFound as nextNotFound } from "next/navigation";

/**
 * Web implementation of server-side notFound using Next.js navigation
 * This is a server-side only function for use in Server Components
 * Triggers Next.js 404 page
 */
export function notFound(): never {
  return nextNotFound();
}
