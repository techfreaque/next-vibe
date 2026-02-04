/**
 * CLI Endpoint Renderer Stub
 *
 * This stub prevents Next.js from bundling the real CliEndpointRenderer
 * which has a dependency on ink and other Node-only packages.
 *
 * The real implementation is only used in CLI contexts, not in Next.js routes.
 */

import type { JSX } from "react";

export function InkEndpointRenderer(): JSX.Element {
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
  throw new Error("This should never be called");
}
